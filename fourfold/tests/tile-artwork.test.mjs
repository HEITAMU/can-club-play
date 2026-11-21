import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {GOAL} from '../cocos/assets/scripts/Core.js';

const artRoot=new URL('../cocos/assets/resources/art/',import.meta.url);
const reference=JSON.parse(readFileSync(new URL('referenceLayout.json',artRoot),'utf8'));
const art=reference.tileArtwork;
const [boardX,boardY,boardW,boardH]=reference.tileArea;
const near=(actual,expected,message)=>assert.ok(Math.abs(actual-expected)<1e-8,`${message}: ${actual} != ${expected}`);

test('every goal tile is an unscaled window into one continuous mural',()=>{
  assert.equal(GOAL,'123456789');
  assert.equal(art.fit,'fill');
  assert.deepEqual(Object.keys(art.sourceRectByToken),[...GOAL]);
  const png=readFileSync(new URL(art.resource+'.png',artRoot));
  assert.deepEqual([...png.subarray(0,8)],[137,80,78,71,13,10,26,10]);
  const imageW=png.readUInt32BE(16),imageH=png.readUInt32BE(20);
  assert.deepEqual(art.imageSize,[imageW,imageH]);
  for(const [index,token] of [...GOAL].entries()){
    const [x,y,w,h]=art.sourceRectByToken[token];
    const [slotX,slotY,slotW,slotH]=reference.slotRects[index];
    assert.ok(x>=0&&y>=0&&w>0&&h>0&&x+w<=imageW&&y+h<=imageH,`token ${token} is inside the image`);
    const scaleX=slotW/w,scaleY=slotH/h;
    near(imageW*scaleX,boardW,`token ${token} common full-image width`);
    near(imageH*scaleY,boardH,`token ${token} common full-image height`);
    near(slotX-x*scaleX,boardX,`token ${token} common image origin X`);
    near(slotY-y*scaleY,boardY,`token ${token} common image origin Y`);
  }
});

test('gold rails conceal matching image intervals instead of removing or repeating artwork',()=>{
  const [imageW,imageH]=art.imageSize;
  for(let row=0;row<3;row++)for(let col=0;col<2;col++){
    const a=row*3+col,b=a+1;
    const [ax,,aw]=art.sourceRectByToken[GOAL[a]], [bx]=art.sourceRectByToken[GOAL[b]];
    const slotA=reference.slotRects[a],slotB=reference.slotRects[b];
    near((bx-ax-aw)*boardW/imageW,slotB[0]-slotA[0]-slotA[2],`row ${row} rail ${col}`);
  }
  for(let col=0;col<3;col++)for(let row=0;row<2;row++){
    const a=row*3+col,b=a+3;
    const [,ay,,ah]=art.sourceRectByToken[GOAL[a]], [,by]=art.sourceRectByToken[GOAL[b]];
    const slotA=reference.slotRects[a],slotB=reference.slotRects[b];
    near((by-ay-ah)*boardH/imageH,slotB[1]-slotA[1]-slotA[3],`column ${col} rail ${row}`);
  }
});
