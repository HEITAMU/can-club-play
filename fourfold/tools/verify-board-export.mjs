#!/usr/bin/env node
/** DOM-contract smoke check for a self-contained export, not a browser renderer. */
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const project = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const filename = process.argv[2] || path.join(project, 'art-source/previews/fourfold-live-board.html');
const html = fs.readFileSync(filename, 'utf8');
const payloadMatch = html.match(/<script id="ff-preview-data" type="application\/json">\s*([\s\S]*?)\s*<\/script>/);
const scripts = [...html.matchAll(/<script>\s*([\s\S]*?)\s*<\/script>/g)];
assert(payloadMatch && scripts.length === 1, 'Expected embedded data and exactly one executable script');
const payload = JSON.parse(payloadMatch[1]);
const report = JSON.parse(fs.readFileSync(path.join(project, 'art-source/previews/preview-build-report.json'), 'utf8'));
const sizes = new Map(report.inline.images.map(image => [payload.assetUrls[image.key], image.dimensions]));
assert.equal(Object.keys(payload.assetUrls).length, 8);
assert(payload.themes.every(theme => payload.assetUrls[theme.resource]));

let serial = 0, clock = 0;
const frames = new Map();
const doc = {};
class Element {
  constructor(tagName = 'div') {
    this.tagName = tagName.toUpperCase(); this.ownerDocument = doc; this.children = [];
    this.dataset = {}; this.attributes = {}; this.listeners = {}; this.clientWidth = 620;
    this.style = {setProperty(key, value) { this[key] = value; }};
    this.classes = new Set();
    this.classList = {add: (...names) => names.forEach(name => this.classes.add(name)), remove: (...names) => names.forEach(name => this.classes.delete(name))};
    this.textContent = ''; this.disabled = false;
  }
  set className(value) { this.classes = new Set(value.split(/\s+/).filter(Boolean)); }
  get className() { return [...this.classes].join(' '); }
  setAttribute(name, value) {
    this.attributes[name] = String(value);
    if (name === 'class') this.className = String(value);
    if (name.startsWith('data-')) this.dataset[name.slice(5).replace(/-([a-z])/g, (_, value) => value.toUpperCase())] = String(value);
  }
  getAttribute(name) { return this.attributes[name] ?? null; }
  removeAttribute(name) { delete this.attributes[name]; }
  append(...nodes) {
    for (const node of nodes) {
      if (node.tagName === '#FRAGMENT') this.append(...[...node.children]);
      else { if (node.parent) node.parent.children = node.parent.children.filter(child => child !== node); node.parent = this; this.children.push(node); }
    }
  }
  replaceChildren(...nodes) { this.children.forEach(node => { node.parent = null; }); this.children = []; this.append(...nodes); }
  set innerHTML(value) {
    this.replaceChildren();
    const stack = [this];
    const tokens = value.matchAll(/<\/?([\w-]+)([^>]*)>|([^<]+)/g);
    const voids = new Set(['img', 'input', 'br', 'hr', 'meta', 'link']);
    for (const token of tokens) {
      if (token[3]) { stack.at(-1).textContent += token[3]; continue; }
      if (token[0].startsWith('</')) { stack.pop(); continue; }
      const node = new Element(token[1]);
      for (const attr of token[2].matchAll(/([\w-]+)(?:="([^"]*)")?/g)) node.setAttribute(attr[1], attr[2] ?? '');
      stack.at(-1).append(node);
      if (!voids.has(token[1])) stack.push(node);
    }
  }
  querySelectorAll(selector) {
    const found = [];
    const matches = node => selector.startsWith('.') ? node.classes.has(selector.slice(1)) : selector === '[data-field]' ? node.dataset.field !== undefined : false;
    const visit = parent => parent.children.forEach(node => { if (matches(node)) found.push(node); visit(node); });
    visit(this); return found;
  }
  querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
  addEventListener(type, callback) { (this.listeners[type] ||= []).push(callback); }
  removeEventListener(type, callback) { this.listeners[type] = (this.listeners[type] || []).filter(value => value !== callback); }
  fire(type) { if (!this.disabled) for (const callback of this.listeners[type] || []) callback({target: this}); }
  getBoundingClientRect() { return {width: 574, height: 537}; }
  set src(value) {
    this._src = value;
    const size = sizes.get(value);
    queueMicrotask(() => {
      if (!size) return this.onerror?.(new Error('Unknown embedded image'));
      [this.naturalWidth, this.naturalHeight] = size; this.onload?.();
    });
  }
  get src() { return this._src; }
}

const view = {
  setTimeout, clearTimeout,
  requestAnimationFrame(callback) { const id = ++serial; frames.set(id, callback); return id; },
  cancelAnimationFrame(id) { frames.delete(id); },
  matchMedia() { return {matches: false}; },
  ResizeObserver: class { constructor(callback) { this.callback = callback; } observe() { this.callback(); } disconnect() {} },
};
doc.defaultView = view;
doc.createElement = tag => new Element(tag);
doc.createDocumentFragment = () => new Element('#fragment');
const root = new Element('div'), data = new Element('script'); data.textContent = payloadMatch[1];
doc.getElementById = id => id === 'ff-live-board' ? root : id === 'ff-preview-data' ? data : null;
vm.runInNewContext(scripts[0][1], {document: doc, console, setTimeout, clearTimeout}, {filename: path.basename(filename)});
const settle = () => new Promise(resolve => setImmediate(resolve));
await settle();
const fields = Object.fromEntries(root.querySelectorAll('[data-field]').map(node => [node.dataset.field, node]));
const board = () => fields.board.children.map(node => node.dataset.token).join('');
const knobs = () => fields.anchors.children.filter(node => node.classes.has('spin-node'));
function finishFrames() {
  for (let iteration = 0; frames.size; iteration += 1) {
    assert(iteration < 40, 'Animation did not terminate'); clock += 100;
    const callbacks = [...frames.values()]; frames.clear(); callbacks.forEach(callback => callback(clock));
  }
}
assert.equal(root.dataset.theme, 'jade'); assert.equal(root.dataset.busy, 'false'); assert.equal(board(), '123456789');
assert.equal(knobs().length, 4); assert.equal(fields.theme.children.length, 7);
knobs()[0].fire('click'); assert.equal(root.dataset.busy, 'true'); assert(knobs().every(node => node.disabled));
finishFrames(); await settle(); assert.equal(board(), '413526789'); assert.equal(fields.moves.textContent, '1');
fields.undo.fire('click'); finishFrames(); await settle(); assert.equal(board(), '123456789');
fields.ccw.fire('click'); knobs()[0].fire('click'); finishFrames(); await settle(); assert.equal(board(), '253146789');
fields.reset.fire('click'); assert.equal(board(), '123456789');
knobs()[1].fire('click'); fields.theme.value = 'tide'; fields.theme.fire('change'); finishFrames(); await settle();
assert.equal(root.dataset.theme, 'tide'); assert.equal(root.dataset.busy, 'false'); assert.equal(board(), '123456789');
for (const theme of payload.themes) {
  fields.theme.value = theme.id; fields.theme.fire('change'); await settle();
  assert.equal(root.dataset.theme, theme.id); assert.equal(fields.load.hidden, true); assert.equal(board(), '123456789');
}
fields.compare.fire('click'); assert.equal(root.dataset.compare, 'true'); assert.equal(fields.anchors.hidden, true);
fields.compare.fire('click'); assert.equal(root.dataset.compare, 'false');
fields.numbers.fire('click'); assert.equal(root.dataset.numbers, 'false');
fields.shuffle.fire('click'); assert.notEqual(board(), '123456789');
fields.reset.fire('click'); assert.equal(board(), '123456789');
knobs()[2].fire('click'); fields.reset.fire('click'); finishFrames(); await settle(); assert.equal(board(), '123456789'); assert.equal(root.dataset.busy, 'false');
assert.equal(root.dataset.previewError, undefined);
console.log(JSON.stringify({file: filename, kind: 'limited DOM contract, not rendered browser QA', checks: ['bundle syntax and mount', '8 embedded images and 7 themes', 'CW/CCW real permutation', 'animation lock', 'undo', 'theme-switch cancellation', 'all themes load', 'whole-art comparison', 'number visibility', 'legal shuffle UI', 'reset cancellation']}, null, 2));
