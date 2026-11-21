import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {TILE_THEMES,getTileTheme,buildThemeArtwork} from '../cocos/assets/scripts/TileThemes.js';

const reference=JSON.parse(readFileSync(new URL('../cocos/assets/resources/art/referenceLayout.json',import.meta.url),'utf8'));
const near=(a,b,message)=>assert.ok(Math.abs(a-b)<1e-8,`${message}: ${a} != ${b}`);

test('all eighteen story levels keep the original approved deep blue artwork',()=>{
  assert.equal(TILE_THEMES.length,7);
  assert.equal(new Set(TILE_THEMES.map(theme=>theme.id)).size,7);
  assert.equal(new Set(TILE_THEMES.map(theme=>theme.resource)).size,7);
  assert.equal(TILE_THEMES[1].resource,'celestial-ruby-v1');
  for(let level=1;level<=18;level++)assert.equal(getTileTheme('story',String(level)),TILE_THEMES[0]);
  assert.equal(TILE_THEMES[0].resource,'celestial-mural-v2');
  assert.notEqual(TILE_THEMES[6].indexColor,TILE_THEMES[0].indexColor);
});

test('daily shuffled bags are stable per date, include all seven themes, and never repeat on adjacent days',()=>{
  const origin=Math.ceil(Date.parse('2026-11-21T00:00:00Z')/86400000/7)*7,orders=new Set();
  let previous=null;
  for(let bag=0;bag<32;bag++){
    const order=[];
    for(let offset=0;offset<7;offset++){
      const key=new Date((origin+bag*7+offset)*86400000).toISOString().slice(0,10),selected=getTileTheme('daily',key);
      assert.equal(selected,getTileTheme('daily',key));
      assert.notEqual(selected,previous,'adjacent dates including bag boundaries must differ');
      order.push(selected.id);previous=selected;
    }
    assert.equal(new Set(order).size,7,'each fixed seven-day bag includes every theme');
    orders.add(order.join(','));
  }
  assert.ok(orders.size>1,'daily themes do not repeat one fixed weekly sequence');
  assert.throws(()=>getTileTheme('daily','2026-02-30'));
  assert.throws(()=>getTileTheme('daily','2026/11/21'));
  assert.throws(()=>getTileTheme('story','0'));
});

test('all theme resolutions restore the same complete mural and rail intervals',()=>{
  const base=reference.tileArtwork,snapshot=JSON.stringify(base),[bx,by,bw,bh]=reference.tileArea;
  for(const theme of TILE_THEMES)for(const [iw,ih] of [[1302,1208],[1024,1536],[1536,1024]]){
    const art=buildThemeArtwork(base,theme,iw,ih);
    assert.equal(art.resource,theme.resource);assert.deepEqual(art.imageSize,[iw,ih]);
    for(let i=0;i<9;i++){
      const [x,y,w,h]=art.sourceRectByToken[i+1],[sx,sy,sw,sh]=reference.slotRects[i];
      assert.ok(x>=0&&y>=0&&x+w<=iw&&y+h<=ih);
      near(sw/w*iw,bw,'shared image width');near(sh/h*ih,bh,'shared image height');
      near(sx-x*sw/w,bx,'shared image origin X');near(sy-y*sh/h,by,'shared image origin Y');
    }
  }
  assert.equal(JSON.stringify(base),snapshot,'base mapping stays immutable');
});
