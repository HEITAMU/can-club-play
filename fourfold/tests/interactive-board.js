import { GOAL, SQUARES, rotate as rotateBoard } from '../cocos/assets/scripts/Core.js';
import { TURN_DURATION_MS, createTurnMotion, sampleTurn } from '../cocos/assets/scripts/TurnMotion.js';
import { TILE_THEMES, buildThemeArtwork } from '../cocos/assets/scripts/TileThemes.js';

/** A preview-only session. A cancelled animation can never commit into a new board. */
export function createBoardSession({ random = Math.random } = {}) {
  let board = GOAL, history = [], active = null, revision = 0;
  const snapshot = () => ({ board, busy: active !== null, undoCount: history.length, moves: history.length, revision });
  function cancel() { revision += 1; active = null; }
  function reset() { cancel(); board = GOAL; history = []; return snapshot(); }
  function begin(q, dir, undo = false) {
    if (active) return null;
    if (!Number.isInteger(q) || !SQUARES[q] || (dir !== 1 && dir !== -1)) return null;
    active = Object.freeze({ revision, from: board, to: rotateBoard(board, q, dir), q, dir, undo });
    return active;
  }
  function beginUndo() {
    const previous = history.at(-1);
    return previous ? begin(previous.q, -previous.dir, true) : null;
  }
  function commit(turn) {
    if (!turn || active !== turn || turn.revision !== revision || turn.from !== board) return false;
    if (turn.undo) history.pop();
    else history.push({ q: turn.q, dir: turn.dir });
    board = turn.to; active = null;
    return true;
  }
  function shuffle(count = 18) {
    reset();
    const path = [];
    let previous = -1;
    const sample = () => Math.max(0, Math.min(.999999999, Number(random()) || 0));
    for (let i = 0; i < Math.max(1, Math.min(80, Math.floor(count) || 18)); i += 1) {
      const choices = SQUARES.map((_, q) => q).filter(q => q !== previous);
      const q = choices[Math.floor(sample() * choices.length)], dir = sample() < .5 ? -1 : 1;
      board = rotateBoard(board, q, dir); path.push({ q, dir }); previous = q;
    }
    if (board === GOAL) { board = rotateBoard(board, 0, 1); path.push({ q: 0, dir: 1 }); }
    return { ...snapshot(), path };
  }
  return { snapshot, begin: (q, dir = 1) => begin(q, dir), beginUndo, commit, cancel, reset, shuffle };
}

const percent = (value, total) => `${value / total * 100}%`;
const imageValue = url => `url(${JSON.stringify(String(url))})`;
const knobNames = ['左上', '右上', '左下', '右下'];

function checkReference(reference) {
  const rect = value => Array.isArray(value) && value.length === 4 && value.every(Number.isFinite) && value[2] > 0 && value[3] > 0;
  if (!reference || !rect(reference.boardOuter) || !rect(reference.tileArea) || !rect(reference.boardBed?.rect)
    || reference.slotRects?.length !== GOAL.length || !reference.slotRects.every(rect)
    || reference.knobCropRects?.length !== SQUARES.length || !reference.knobCropRects.every(rect)
    || reference.knobCenters?.length !== SQUARES.length
    || !reference.knobCenters.every(value => Array.isArray(value) && value.length === 2 && value.every(Number.isFinite))
    || !Array.isArray(reference.size) || reference.size.length !== 2 || !reference.size.every(value => Number.isFinite(value) && value > 0)) {
    throw new TypeError('The preview needs the game reference layout.');
  }
}

function setCrop(element, crop, imageSize) {
  const [x, y, width, height] = crop, [imageWidth, imageHeight] = imageSize;
  element.style.backgroundSize = `${100 * imageWidth / width}% ${100 * imageHeight / height}%`;
  element.style.backgroundPosition = `${imageWidth === width ? 0 : 100 * x / (imageWidth - width)}% ${imageHeight === height ? 0 : 100 * y / (imageHeight - height)}%`;
}

/**
 * Mount inside #ff-live-board. All image URLs may be data URLs. No fetch or game
 * storage is used here; the host supplies reference JSON and its asset URLs.
 * assetUrls.reference is the original reference-daily frame/knob sheet;
 * assetUrls[theme.resource] is the complete artwork for each theme.
 */
export function mountBoardPreview(root, { reference, themes = TILE_THEMES, assetUrls, defaultTheme = 'jade' } = {}) {
  if (!root?.ownerDocument || !root.ownerDocument.defaultView) throw new TypeError('A mounted DOM element is required.');
  checkReference(reference);
  if (!Array.isArray(themes) || !themes.length || !assetUrls?.reference) throw new TypeError('Preview themes and asset URLs are required.');
  if (themes.some(theme => !theme?.id || !theme.resource || !assetUrls[theme.resource])) throw new TypeError('Every theme needs an image URL.');
  const doc = root.ownerDocument, view = doc.defaultView, session = createBoardSession(), imageCache = new Map(), removers = [];
  let selectedTheme = themes.find(theme => theme.id === defaultTheme) || themes[0];
  let artwork = null, direction = 1, numbersVisible = true, compare = false, loading = true, error = '', notice = '';
  let destroyed = false, loadRevision = 0, frameRequest = 0, pendingResolve = null, resizeObserver = null;

  root.classList.add('ff-lb');
  root.innerHTML = `
    <header class="ff-lb-heading">
      <div><p class="ff-lb-kicker">四格诡局</p><h1>星图试转</h1></div>
    </header>
    <div class="ff-lb-theme-row">
      <label class="ff-lb-theme-label"><span class="ff-lb-visually-hidden">当前星图</span><select data-field="theme" aria-label="选择星图主题"></select></label>
      <div class="ff-lb-meta"><span class="ff-lb-state" data-field="state">正在准备</span><span class="ff-lb-count"><strong data-field="moves">0</strong><span>次试转</span></span></div>
    </div>
    <div class="ff-lb-stage game-screen">
      <div class="board-frame" data-field="frame">
        <div class="board" data-field="board" role="img" aria-label="九块星图"></div>
        <div class="anchors" data-field="anchors"><div class="turn-focus" data-field="focus"></div></div>
        <img class="ff-lb-full-art" data-field="full" alt="" hidden>
        <div class="ff-lb-load" data-field="load" role="status"><span data-field="loadText">正在展开星图…</span><button class="ff-lb-button" data-field="retry" type="button" hidden>重新载入</button></div>
      </div>
    </div>
    <div class="ff-lb-direction" role="group" aria-label="旋转方向">
      <button type="button" data-field="cw" aria-pressed="true"><span aria-hidden="true">↻</span> 顺时针</button>
      <button type="button" data-field="ccw" aria-pressed="false"><span aria-hidden="true">↺</span> 逆时针</button>
    </div>
    <div class="ff-lb-actions">
      <button class="ff-lb-button" type="button" data-field="shuffle">打乱星图</button>
      <button class="ff-lb-button" type="button" data-field="undo">撤销一步</button>
      <button class="ff-lb-button ff-lb-reset" type="button" data-field="reset">恢复拼合</button>
    </div>
    <div class="ff-lb-options">
      <button class="ff-lb-toggle" type="button" data-field="numbers" aria-pressed="true"><span class="ff-lb-check" aria-hidden="true"></span>显示数字</button>
      <button class="ff-lb-toggle" type="button" data-field="compare" aria-pressed="false"><span class="ff-lb-check" aria-hidden="true"></span><span data-field="compareText">整图对照</span></button>
    </div>
    <p class="ff-lb-status" data-field="status" role="status" aria-live="polite" aria-atomic="true"></p>`;
  const fields = Object.fromEntries([...root.querySelectorAll('[data-field]')].map(element => [element.dataset.field, element]));
  for (const element of root.querySelectorAll('button, select')) element.classList.add('cursor-interaction');
  const [outerX, outerY, outerWidth, outerHeight] = reference.boardOuter;
  const [areaX, areaY, areaWidth, areaHeight] = reference.tileArea;
  const [bedX, bedY, bedWidth, bedHeight] = reference.boardBed.rect;
  const slots = reference.slotRects.map(([x, y, width, height]) => ({ x, y, width, height }));
  const radius = reference.tileSurface?.cornerRadius ?? 16, rim = reference.tileSurface?.rimInset ?? 3;
  root.style.setProperty('--ff-reference-image', imageValue(assetUrls.reference));
  fields.frame.style.aspectRatio = `${outerWidth} / ${outerHeight}`;
  setCrop(fields.frame, reference.boardOuter, reference.size);
  for (const [property, value] of Object.entries({
    '--ff-bed-left': percent(bedX - outerX, outerWidth), '--ff-bed-top': percent(bedY - outerY, outerHeight),
    '--ff-bed-width': percent(bedWidth, outerWidth), '--ff-bed-height': percent(bedHeight, outerHeight),
    '--ff-bed-radius-x': percent(reference.boardBed.cornerRadius, bedWidth), '--ff-bed-radius-y': percent(reference.boardBed.cornerRadius, bedHeight),
    '--ff-bed-color': reference.boardBed.color,
  })) fields.frame.style.setProperty(property, value);
  for (const element of [fields.board, fields.anchors, fields.full]) Object.assign(element.style, {
    left: percent(areaX - outerX, outerWidth), top: percent(areaY - outerY, outerHeight), width: percent(areaWidth, outerWidth), height: percent(areaHeight, outerHeight),
  });
  for (const [index, theme] of themes.entries()) {
    const option = doc.createElement('option'); option.value = theme.id; option.textContent = `${String(index + 1).padStart(2, '0')} · ${theme.name}`;
    fields.theme.append(option);
  }
  const tiles = new Map([...GOAL].map(token => {
    const tile = doc.createElement('div'); tile.className = 'tile'; tile.dataset.token = token;
    const number = doc.createElement('span'); number.className = 'index'; number.textContent = token; number.setAttribute('aria-hidden', 'true'); tile.append(number);
    return [token, tile];
  }));
  function listen(element, type, handler) { element.addEventListener(type, handler); removers.push(() => element.removeEventListener(type, handler)); }
  const knobs = reference.knobCenters.map(([x, y], q) => {
    const button = doc.createElement('button'); button.type = 'button'; button.className = 'spin-node cursor-interaction'; button.dataset.q = String(q);
    button.style.setProperty('left', percent(x - areaX, areaWidth), 'important');
    button.style.setProperty('top', percent(y - areaY, areaHeight), 'important');
    const crop = reference.knobCropRects[q];
    button.style.setProperty('--ff-knob-width', `${crop[2]}px`); button.style.setProperty('--ff-knob-height', `${crop[3]}px`);
    button.innerHTML = '<span class="spin-ring"></span><span class="spin-motion"><span class="spin-art"></span></span>';
    setCrop(button.querySelector('.spin-art'), crop, reference.size);
    listen(button, 'click', () => performTurn(q, direction)); fields.anchors.append(button); return button;
  });

  function getState() {
    return { ...session.snapshot(), themeId: selectedTheme.id, themeName: selectedTheme.name, direction, numbersVisible, compare, loading, error, destroyed };
  }
  function sync() {
    if (destroyed) return;
    const state = session.snapshot(), unavailable = loading || !!error;
    root.dataset.theme = selectedTheme.id; root.dataset.busy = String(state.busy); root.dataset.compare = String(compare);
    root.dataset.numbers = String(numbersVisible); root.setAttribute('aria-busy', String(loading || state.busy));
    fields.theme.value = selectedTheme.id;
    fields.moves.textContent = String(state.moves);
    fields.state.textContent = unavailable ? (error ? '未载入' : '正在准备') : compare ? '完整原画' : state.busy ? '旋转中' : state.board === GOAL ? '已拼合' : '自由试转';
    fields.state.dataset.solved = String(!unavailable && !compare && state.board === GOAL);
    fields.cw.setAttribute('aria-pressed', String(direction === 1)); fields.ccw.setAttribute('aria-pressed', String(direction === -1));
    fields.cw.disabled = fields.ccw.disabled = unavailable || state.busy || compare;
    fields.shuffle.disabled = unavailable || compare; fields.undo.disabled = unavailable || compare || state.busy || !state.undoCount;
    fields.reset.disabled = unavailable; fields.compare.disabled = unavailable; fields.numbers.disabled = unavailable || compare;
    fields.numbers.setAttribute('aria-pressed', String(numbersVisible)); fields.compare.setAttribute('aria-pressed', String(compare));
    fields.compareText.textContent = compare ? '返回棋盘' : '整图对照';
    fields.load.hidden = !unavailable; fields.loadText.textContent = error ? '星图暂未载入，请重试。' : '正在展开星图…'; fields.retry.hidden = !error;
    fields.board.hidden = unavailable || compare; fields.anchors.hidden = unavailable || compare; fields.full.hidden = unavailable || !compare;
    fields.board.setAttribute('aria-label', `${selectedTheme.name}，当前拼片顺序：${[...state.board].join('、')}`);
    for (const [q, button] of knobs.entries()) {
      button.disabled = unavailable || compare || state.busy; button.dataset.direction = String(direction);
      button.setAttribute('aria-label', `${knobNames[q]}四格，${direction === 1 ? '顺' : '逆'}时针旋转`);
    }
    fields.status.textContent = error ? '载入失败，请重试' : loading ? '正在载入' : compare ? '完整原画'
      : state.busy ? '四块正在换位…' : notice || (state.board === GOAL ? '已拼合' : '自由试转');
  }
  function drawTiles() {
    if (!artwork || destroyed) return;
    const fragment = doc.createDocumentFragment();
    for (const [index, token] of [...session.snapshot().board].entries()) {
      const tile = tiles.get(token), slot = slots[index]; tile.dataset.slot = String(index);
      Object.assign(tile.style, { left: percent(slot.x - areaX, areaWidth), top: percent(slot.y - areaY, areaHeight), width: percent(slot.width, areaWidth), height: percent(slot.height, areaHeight), backgroundImage: imageValue(assetUrls[selectedTheme.resource]) });
      setCrop(tile, artwork.sourceRectByToken[token], artwork.imageSize);
      for (const [property, value] of Object.entries({
        '--tile-radius-x': percent(radius, slot.width), '--tile-radius-y': percent(radius, slot.height),
        '--tile-rim-x': percent(rim, slot.width), '--tile-rim-y': percent(rim, slot.height),
        '--tile-inner-radius-x': percent(radius - rim, slot.width - 2 * rim), '--tile-inner-radius-y': percent(radius - rim, slot.height - 2 * rim),
        '--tile-number-right': percent(38, slot.width), '--tile-number-bottom': percent(15, slot.height),
      })) tile.style.setProperty(property, value);
      fragment.append(tile);
    }
    fields.board.replaceChildren(fragment);
  }
  function clearMotion() {
    if (frameRequest) view.cancelAnimationFrame(frameRequest);
    frameRequest = 0;
    for (const tile of tiles.values()) { tile.style.transform = ''; tile.style.opacity = ''; tile.style.filter = ''; tile.style.zIndex = ''; tile.classList.remove('turn-selected'); }
    for (const button of knobs) { button.classList.remove('turning'); button.querySelector('.spin-motion').style.transform = ''; button.querySelector('.spin-ring').style.opacity = ''; }
    fields.focus.style.opacity = '0';
  }
  function cancelTurn() {
    session.cancel(); clearMotion();
    if (pendingResolve) { const resolve = pendingResolve; pendingResolve = null; resolve(false); }
  }
  function animate(turn) {
    const selected = SQUARES[turn.q].map(index => tiles.get(turn.from[index]));
    const rects = SQUARES[turn.q].map(index => slots[index]), [x, y] = reference.knobCenters[turn.q];
    const motion = createTurnMotion(rects, turn.dir, { x, y }), knob = knobs[turn.q];
    const others = [...tiles.values()].filter(tile => !selected.includes(tile));
    const reduced = view.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
    const duration = reduced ? 180 : TURN_DURATION_MS;
    Object.assign(fields.focus.style, { left: percent(motion.bounds.left - areaX, areaWidth), top: percent(motion.bounds.top - areaY, areaHeight), width: percent(motion.bounds.right - motion.bounds.left, areaWidth), height: percent(motion.bounds.bottom - motion.bounds.top, areaHeight) });
    selected.forEach(tile => { tile.classList.add('turn-selected'); tile.style.zIndex = '2'; });
    knob.classList.add('turning'); sync();
    return new Promise(resolve => {
      pendingResolve = resolve;
      let started = null;
      function tick(time) {
        if (destroyed || session.snapshot().revision !== turn.revision || !session.snapshot().busy) return;
        if (started === null) started = time;
        const progress = Math.min(1, (time - started) / duration);
        const first = sampleTurn(motion, 0, progress);
        for (const [index, tile] of selected.entries()) {
          const sample = sampleTurn(motion, index, progress);
          // Percent translation follows the real reference rectangle at every
          // viewport size; the illustrated face and number never rotate.
          tile.style.transform = reduced ? '' : `translate(${sample.dx / rects[index].width * 100}%, ${sample.dy / rects[index].height * 100}%) scale(${sample.scaleX}, ${sample.scaleY})`;
          tile.style.filter = `brightness(${1 + .045 * first.focus})`;
          if (reduced) tile.style.opacity = String(1 - .24 * Math.sin(Math.PI * progress));
        }
        for (const tile of others) tile.style.opacity = String(1 - .12 * first.focus);
        fields.focus.style.opacity = String(.85 * first.focus);
        knob.querySelector('.spin-motion').style.transform = reduced ? '' : `rotate(${first.angle}deg)`;
        knob.querySelector('.spin-ring').style.opacity = String(first.focus);
        if (progress < 1) { frameRequest = view.requestAnimationFrame(tick); return; }
        const committed = session.commit(turn);
        pendingResolve = null; clearMotion(); drawTiles();
        notice = committed ? (session.snapshot().board === GOAL ? '已拼合' : turn.undo ? '已撤销一步' : '已旋转') : '';
        sync(); resolve(committed);
      }
      frameRequest = view.requestAnimationFrame(tick);
    });
  }
  function canMove() { return !destroyed && !loading && !error && !compare && !session.snapshot().busy; }
  function performTurn(q, dir = direction) {
    if (!canMove()) return Promise.resolve(false);
    const turn = session.begin(q, dir); return turn ? animate(turn) : Promise.resolve(false);
  }
  function undo() {
    if (!canMove()) return Promise.resolve(false);
    const turn = session.beginUndo(); return turn ? animate(turn) : Promise.resolve(false);
  }
  function reset() {
    if (destroyed) return false;
    cancelTurn(); session.reset(); compare = false; notice = '已拼合'; drawTiles(); sync(); return true;
  }
  function shuffle() {
    if (destroyed || loading || error || compare) return false;
    cancelTurn(); session.shuffle(); notice = '已打乱'; drawTiles(); sync(); return true;
  }
  function setDirection(value) {
    if (destroyed || session.snapshot().busy || (value !== 1 && value !== -1)) return false;
    direction = value; sync(); return true;
  }
  function setNumbersVisible(value) { if (!destroyed) { numbersVisible = !!value; sync(); } }
  function setCompare(value) {
    if (destroyed || loading || error) return false;
    cancelTurn(); compare = !!value; notice = ''; drawTiles(); sync(); return true;
  }
  function loadImage(url) {
    if (imageCache.has(url)) return imageCache.get(url);
    const promise = new Promise((resolve, reject) => {
      const image = doc.createElement('img'); image.decoding = 'async';
      const timer = view.setTimeout(() => finish(new Error('Image loading timed out.')), 20000);
      function finish(failure) { view.clearTimeout(timer); image.onload = null; image.onerror = null; failure ? reject(failure) : resolve(image); }
      image.onload = () => finish(image.naturalWidth > 0 && image.naturalHeight > 0 ? null : new Error('Empty artwork.'));
      image.onerror = () => finish(new Error('Artwork unavailable.')); image.src = url;
    });
    imageCache.set(url, promise); promise.catch(() => { if (imageCache.get(url) === promise) imageCache.delete(url); });
    return promise;
  }
  async function selectTheme(id, retry = false) {
    if (destroyed) return false;
    const theme = themes.find(item => item.id === id); if (!theme) return false;
    const serial = ++loadRevision;
    cancelTurn(); session.reset(); selectedTheme = theme; artwork = null; compare = false; loading = true; error = ''; notice = '';
    if (retry) { imageCache.delete(assetUrls.reference); imageCache.delete(assetUrls[theme.resource]); }
    sync();
    try {
      const [, image] = await Promise.all([loadImage(assetUrls.reference), loadImage(assetUrls[theme.resource])]);
      if (destroyed || serial !== loadRevision) return false;
      artwork = buildThemeArtwork(reference.tileArtwork, theme, image.naturalWidth, image.naturalHeight);
      for (const [property, value] of Object.entries({ '--ff-number': theme.indexColor, '--ff-number-shadow': theme.indexShadowColor, '--ff-number-outline': theme.indexOutlineColor, '--ff-number-highlight': theme.indexHighlightColor })) root.style.setProperty(property, value);
      fields.full.src = assetUrls[theme.resource]; fields.full.alt = `${theme.name}完整原画`;
      loading = false; notice = '已拼合'; drawTiles(); sync(); updateScale(); return true;
    } catch (failure) {
      if (destroyed || serial !== loadRevision) return false;
      loading = false; error = failure instanceof Error ? failure.message : String(failure); sync(); return false;
    }
  }
  function updateScale() {
    if (!destroyed) fields.frame.style.setProperty('--ff-board-scale', String((fields.frame.getBoundingClientRect().width || root.clientWidth || outerWidth) / outerWidth));
  }
  listen(fields.theme, 'change', () => selectTheme(fields.theme.value));
  listen(fields.cw, 'click', () => setDirection(1)); listen(fields.ccw, 'click', () => setDirection(-1));
  listen(fields.shuffle, 'click', shuffle); listen(fields.reset, 'click', reset); listen(fields.undo, 'click', undo);
  listen(fields.numbers, 'click', () => setNumbersVisible(!numbersVisible)); listen(fields.compare, 'click', () => setCompare(!compare));
  listen(fields.retry, 'click', () => selectTheme(selectedTheme.id, true));
  if (view.ResizeObserver) { resizeObserver = new view.ResizeObserver(updateScale); resizeObserver.observe(fields.frame); }
  else listen(view, 'resize', updateScale);
  updateScale();
  const ready = selectTheme(selectedTheme.id);
  return {
    ready, selectTheme, rotate: performTurn, shuffle, reset, undo, setDirection, setNumbersVisible, setCompare, getState,
    destroy() { if (destroyed) return; cancelTurn(); destroyed = true; loadRevision += 1; resizeObserver?.disconnect(); removers.forEach(remove => remove()); root.replaceChildren(); root.removeAttribute('aria-busy'); },
  };
}
