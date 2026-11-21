import { TILE_THEMES } from '../cocos/assets/scripts/TileThemes.js';
import { mountBoardPreview } from './interactive-board.js';

const root = document.getElementById('ff-live-board');
const VERSION = '0.8.14';

async function start() {
  try {
    const response = await fetch(new URL('../cocos/assets/resources/art/referenceLayout.json?v=' + VERSION, import.meta.url));
    if (!response.ok) throw new Error('Reference layout unavailable.');
    const reference = await response.json();
    const assetUrls = { reference: new URL('../assets/art/reference-daily.webp', import.meta.url).href };
    for (const theme of TILE_THEMES) assetUrls[theme.resource] = new URL('../assets/art/' + theme.resource + '.webp', import.meta.url).href;
    // Deliberately separate from the game app and its localStorage save data.
    window.fourfoldBoardPreview = mountBoardPreview(root, { reference, themes: TILE_THEMES, assetUrls, defaultTheme: 'jade' });
  } catch {
    root.replaceChildren();
    const message = document.createElement('p'); message.textContent = '棋盘暂未载入，请重新载入后再试。';
    const retry = document.createElement('button'); retry.type = 'button'; retry.className = 'ff-lb-button cursor-interaction'; retry.textContent = '重新载入';
    retry.addEventListener('click', () => { retry.disabled = true; start(); }, { once: true });
    root.append(message, retry);
  }
}
start();
