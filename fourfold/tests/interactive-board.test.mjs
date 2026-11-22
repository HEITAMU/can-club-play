import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createBoardSession, mountBoardPreview } from './interactive-board.js';
import { GOAL, rotate } from '../cocos/assets/scripts/Core.js';
import { TILE_THEMES } from '../cocos/assets/scripts/TileThemes.js';
import { TURN_DURATION_MS } from '../cocos/assets/scripts/TurnMotion.js';

const reference = JSON.parse(readFileSync(new URL('../cocos/assets/resources/art/referenceLayout.json', import.meta.url), 'utf8'));

test('a committed move is counted once; undo reverses a mixed path completely', () => {
  const session = createBoardSession();
  const path = [{ q: 0, dir: 1 }, { q: 3, dir: -1 }, { q: 2, dir: 1 }, { q: 1, dir: -1 }];
  let expected = GOAL;
  for (const move of path) {
    const turn = session.begin(move.q, move.dir);
    assert.equal(session.begin(0, -1), null, 'a busy session must not queue a second turn');
    assert.equal(session.snapshot().board, expected, 'a move is uncommitted until its animation completes');
    assert.equal(session.commit(turn), true);
    assert.equal(session.commit(turn), false, 'repeated animation completion must not count twice');
    expected = rotate(expected, move.q, move.dir);
    assert.equal(session.snapshot().board, expected);
  }
  assert.equal(session.snapshot().moves, path.length);
  for (let index = path.length - 1; index >= 0; index -= 1) {
    const undo = session.beginUndo();
    assert.equal(undo.q, path[index].q); assert.equal(undo.dir, -path[index].dir);
    assert.equal(session.commit(undo), true);
    assert.equal(session.snapshot().undoCount, index);
  }
  assert.equal(session.snapshot().board, GOAL); assert.equal(session.beginUndo(), null);
});

test('cancelled turns and cancelled undos cannot mutate a new board or consume history', () => {
  const session = createBoardSession();
  const first = session.begin(0, 1); session.commit(first);
  const undo = session.beginUndo(); session.cancel();
  assert.equal(session.commit(undo), false); assert.equal(session.snapshot().undoCount, 1);
  assert.equal(session.snapshot().board, rotate(GOAL, 0, 1));
  const stale = session.begin(2, 1); session.reset();
  const fresh = session.begin(3, -1);
  assert.equal(session.commit(stale), false, 'old completion cannot commit while another turn is active');
  assert.equal(session.commit(fresh), true); assert.equal(session.snapshot().board, rotate(GOAL, 3, -1));
  assert.equal(session.snapshot().moves, 1);
});

test('every scramble is an explicit legal rotation path, is not solved and starts fresh undo history', () => {
  let seed = 42;
  const random = () => { seed = Math.imul(seed, 1664525) + 1013904223 | 0; return (seed >>> 0) / 4294967296; };
  const session = createBoardSession({ random });
  for (let trial = 0; trial < 24; trial += 1) {
    const oldTurn = session.begin(trial % 4, 1);
    const result = session.shuffle(18);
    assert.equal(session.commit(oldTurn), false);
    assert.equal(result.path.reduce((board, move) => rotate(board, move.q, move.dir), GOAL), result.board);
    assert.notEqual(result.board, GOAL); assert.equal(result.undoCount, 0); assert.equal(result.moves, 0);
    assert.equal(new Set(result.board).size, 9);
    const userTurn = session.begin(0, 1); session.commit(userTurn); session.commit(session.beginUndo());
    assert.equal(session.snapshot().board, result.board, 'undo returns to this scramble, not a previous one');
  }
});

// A deliberately small DOM/clock substitute runs the real controller's event,
// image-load and RAF guards. It does not claim to verify browser paint/layout.
class Element {
  constructor(tagName, ownerDocument) {
    this.tagName = tagName; this.ownerDocument = ownerDocument; this.children = []; this.parentNode = null;
    this.dataset = {}; this.attributes = new Map(); this.events = new Map(); this.classes = new Set(); this.hidden = false;
    this.style = { setProperty(name, value) { this[name] = String(value); } };
    this.classList = { add: (...names) => names.forEach(name => this.classes.add(name)), remove: (...names) => names.forEach(name => this.classes.delete(name)), contains: name => this.classes.has(name) };
    this.clientWidth = 360;
  }
  set className(value) { this.classes = new Set(value.split(/\s+/).filter(Boolean)); }
  get className() { return [...this.classes].join(' '); }
  setAttribute(name, value) {
    this.attributes.set(name, String(value));
    if (name === 'class') this.className = value;
    if (name === 'hidden') this.hidden = true;
    if (name.startsWith('data-')) this.dataset[name.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = String(value);
  }
  removeAttribute(name) { this.attributes.delete(name); }
  addEventListener(type, handler) { if (!this.events.has(type)) this.events.set(type, new Set()); this.events.get(type).add(handler); }
  removeEventListener(type, handler) { this.events.get(type)?.delete(handler); }
  append(...nodes) {
    for (const node of nodes) {
      if (node.tagName === '#fragment') { this.append(...[...node.children]); continue; }
      if (node.parentNode) node.parentNode.children.splice(node.parentNode.children.indexOf(node), 1);
      this.children.push(node); node.parentNode = this;
    }
  }
  replaceChildren(...nodes) { for (const node of this.children) node.parentNode = null; this.children = []; this.append(...nodes); }
  matches(selector) {
    return selector === '[data-field]' ? this.dataset.field !== undefined : selector.startsWith('.') ? this.classes.has(selector.slice(1)) : this.tagName === selector;
  }
  querySelectorAll(selector) {
    const selectors = selector.split(',').map(part => part.trim()), result = [];
    const walk = element => { for (const child of element.children) { if (selectors.some(part => child.matches(part))) result.push(child); walk(child); } };
    walk(this); return result;
  }
  querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
  getBoundingClientRect() { return { x: 0, y: 0, width: 360, height: 360 * 765 / 817 }; }
  set innerHTML(html) {
    this.replaceChildren(); const stack = [this];
    for (const match of html.matchAll(/<(\/?)([\w-]+)([^>]*)>/g)) {
      const [, closing, tag, attrs] = match;
      if (closing) { stack.pop(); continue; }
      const element = this.ownerDocument.createElement(tag);
      for (const attr of attrs.matchAll(/([\w-]+)(?:="([^"]*)")?/g)) element.setAttribute(attr[1], attr[2] ?? '');
      stack.at(-1).append(element);
      if (!['img', 'input', 'br', 'hr', 'meta', 'link'].includes(tag)) stack.push(element);
    }
  }
  set src(value) { this._src = value; if (this.tagName === 'img') this.ownerDocument.images.push(this); }
  get src() { return this._src; }
}

function harness() {
  let nextId = 1;
  const frames = new Map(), timers = new Map();
  const view = {
    requestAnimationFrame(callback) { const id = nextId++; frames.set(id, callback); return id; },
    cancelAnimationFrame(id) { frames.delete(id); },
    setTimeout(callback) { const id = nextId++; timers.set(id, callback); return id; },
    clearTimeout(id) { timers.delete(id); },
    matchMedia() { return { matches: false }; },
    addEventListener() {}, removeEventListener() {},
  };
  const document = { defaultView: view, images: [], createElement(tag) { return new Element(tag, this); }, createDocumentFragment() { return new Element('#fragment', this); } };
  const root = document.createElement('section'), assetUrls = { reference: 'memory:reference' };
  for (const theme of TILE_THEMES) assetUrls[theme.resource] = `memory:${theme.resource}`;
  const api = mountBoardPreview(root, { reference, themes: TILE_THEMES, assetUrls, defaultTheme: 'jade' });
  const load = resource => {
    for (const image of [...document.images]) if (image.src === `memory:${resource}` && image.onload) {
      image.naturalWidth = resource === 'reference' ? 854 : 1302; image.naturalHeight = resource === 'reference' ? 1842 : 1208; image.onload();
    }
  };
  const tick = time => { const callbacks = [...frames.values()]; frames.clear(); callbacks.forEach(callback => callback(time)); };
  const field = name => root.querySelectorAll('[data-field]').find(element => element.dataset.field === name);
  return { api, root, frames, timers, load, tick, field };
}
async function readyHarness() { const h = harness(); h.load('reference'); h.load('celestial-stag-v1'); assert.equal(await h.api.ready, true); return h; }

test('controller isolates out-of-order theme image loads and renders the current theme only', async () => {
  const h = harness(), next = h.api.selectTheme('tide');
  h.load('reference'); h.load('celestial-stag-v1');
  assert.equal(await h.api.ready, false);
  assert.equal(h.api.getState().themeId, 'tide'); assert.equal(h.api.getState().loading, true);
  h.load('celestial-libra-v2'); assert.equal(await next, true);
  assert.equal(h.field('theme').value, 'tide'); assert.equal(h.api.getState().board, GOAL);
  assert.equal(h.field('board').children.length, 9);
  for (const tile of h.field('board').children) assert.match(tile.style.backgroundImage, /celestial-libra-v2/);
  assert.equal(h.field('full').alt, '天秤星衡完整原画'); h.api.destroy();
});

test('controller accepts one click, samples four upright pieces for 800ms, and animates undo', async () => {
  const h = await readyHarness();
  const turn = h.api.rotate(0, 1); assert.equal(await h.api.rotate(3, -1), false);
  assert.equal(h.api.getState().moves, 0); assert.equal(h.root.querySelectorAll('.spin-node').every(button => button.disabled), true);
  h.tick(0); h.tick(TURN_DURATION_MS / 2);
  const moving = h.root.querySelectorAll('.turn-selected'); assert.equal(moving.length, 4);
  for (const tile of moving) { assert.match(tile.style.transform, /^translate\(.+\) scale\(.+\)$/); assert.doesNotMatch(tile.style.transform, /rotate/); }
  assert.equal(h.api.getState().board, GOAL, 'visual movement does not precommit rules');
  h.tick(TURN_DURATION_MS); assert.equal(await turn, true);
  assert.equal(h.api.getState().board, rotate(GOAL, 0, 1)); assert.equal(h.api.getState().moves, 1);
  const undo = h.api.undo(); h.tick(2000); h.tick(2000 + TURN_DURATION_MS); assert.equal(await undo, true);
  assert.equal(h.api.getState().board, GOAL); assert.equal(h.api.getState().undoCount, 0); h.api.destroy();
});

test('reset, compare and shuffle cancel active DOM animation; manually invoked stale RAF cannot revive it', async () => {
  const h = await readyHarness();
  for (const action of ['reset', 'compare', 'shuffle']) {
    h.api.reset(); const pending = h.api.rotate(2, -1); h.tick(0);
    const staleCallback = [...h.frames.values()][0]; assert.equal(typeof staleCallback, 'function');
    if (action === 'compare') h.api.setCompare(true); else h.api[action]();
    const state = h.api.getState(); staleCallback(TURN_DURATION_MS);
    assert.equal(await pending, false); assert.equal(h.api.getState().board, state.board);
    assert.equal(h.api.getState().busy, false); assert.equal(h.api.getState().undoCount, 0); assert.equal(h.frames.size, 0);
    assert.equal(h.root.querySelectorAll('.turn-selected').length, 0);
    if (action === 'compare') {
      assert.equal(h.field('anchors').hidden, true); assert.equal(h.field('full').hidden, false);
      assert.equal(await h.api.rotate(0, 1), false); h.api.setCompare(false); assert.equal(h.api.getState().board, GOAL);
    }
  }
  h.api.setNumbersVisible(false); assert.equal(h.root.dataset.numbers, 'false'); h.api.destroy();
});

test('theme change cancels an old turn, and destroy cannot be repopulated by an image completion', async () => {
  const h = await readyHarness();
  const turn = h.api.rotate(1, 1); h.tick(0); const stale = [...h.frames.values()][0];
  const theme = h.api.selectTheme('ruby'); stale(TURN_DURATION_MS);
  assert.equal(await turn, false); assert.equal(h.api.getState().board, GOAL);
  h.api.destroy(); h.load('celestial-ruby-v1'); assert.equal(await theme, false);
  assert.equal(h.root.children.length, 0); assert.equal(h.api.getState().destroyed, true); assert.equal(await h.api.rotate(0, 1), false);
});
