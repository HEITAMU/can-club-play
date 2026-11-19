import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {build} from 'esbuild';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const temporary=await fs.mkdtemp(path.join(os.tmpdir(),'can-club-effects-pool-'));
test.after(()=>fs.rm(temporary,{recursive:true,force:true}));
// Exercise the production Effects pool and both production mesh components.
// These minimal Cocos base types expose state changes without pretending to
// run a graphics device; CI separately audits submitted real-engine vertices.
const cc=`
 export const _decorator={ccclass:()=>Class=>Class};
 export class Color{constructor(r=255,g=255,b=255,a=255){Object.assign(this,{r,g,b,a});}static WHITE=new Color();}
 export class UITransform{setAnchorPoint(){}setContentSize(width,height){Object.assign(this,{width,height});}}
 export class Sprite{static SizeMode={CUSTOM:0};enabled=true;color=new Color();spriteFrame=null;_markForUpdateRenderData(){}}
 export class SpriteFrame{};export class Texture2D{};
 export const builtinResMgr={get:()=>({width:2,height:2})};
 export const isValid=()=>true;
 export class Node{
  layer=1;children=[];components=[];active=true;parent=null;
  constructor(name){this.name=name;}
  addChild(child){if(child.parent)child.parent.children=child.parent.children.filter(n=>n!==child);child.parent=this;this.children.push(child);}
  addComponent(Class){const component=new Class();component.node=this;this.components.push(component);return component;}
  getComponent(Class){return this.components.find(c=>c instanceof Class);}
  setPosition(){}setRotationFromEuler(){}setScale(){}
 }`;
const output=path.join(temporary,'effects.mjs');
await build({stdin:{contents:`export {Effects} from './assets/scripts/render/Effects';export {Node,Color} from 'cc';`,resolveDir:root,loader:'ts'},
 outfile:output,bundle:true,format:'esm',platform:'node',tsconfigRaw:{compilerOptions:{experimentalDecorators:true}},
 plugins:[{name:'render-state-without-gpu',setup(api){
  api.onResolve({filter:/^cc$/},()=>({path:'cc',namespace:'test'}));
  api.onResolve({filter:/^\.\/Assets$/},()=>({path:'assets',namespace:'test'}));
  api.onLoad({filter:/.*/,namespace:'test'},args=>({contents:args.path==='cc'?cc:`export const assets={frame:async()=>({texture:{},uv:[0,1,1,1,0,0,1,0]})};`}));
 }}]});
const {Effects,Node}=await import(pathToFileURL(output));
const texture=alpha=>({art:'texture',path:'fixture.png',width:60,height:40,x:20,y:30,alpha,layer:0});
const stream=(alpha,front)=>({art:'heal-stream',width:60,height:40,x:20,y:30,alpha,phase:1.3,front,layer:front?2:0});
const strip=alpha=>({art:'flame',width:60,height:40,x:20,y:30,alpha,layer:2,deform:{axis:'x',phase:.8,amplitude:3}});

test('low-alpha normal Sprite reuse cannot multiply the original healing ribbon alpha',async()=>{
 const back=new Node('back'),front=new Node('front'),effects=new Effects(back,front);
 for(const oldAlpha of [.08,.28,.56,.85])for(const isFront of [false,true]){
  effects.render([texture(oldAlpha)]);await Promise.resolve();
  const entry=effects.pool[0];assert.equal(entry.standard.color.a,Math.round(oldAlpha*255));
  effects.render([stream(.63,isFront)]);
  assert.strictEqual(effects.pool[0],entry,'must reuse the same pool object');
  assert.equal(entry.standard.enabled,false);assert.equal(entry.standard.color.a,255,'disabled parent must remain opaque');
  assert.equal(entry.graphicChild.active,true);assert.strictEqual(entry.node.parent,isFront?front:back);
  assert.ok(entry.g.geometry.vertexCount>0);
  for(let i=0;i<entry.g.geometry.vertexCount;i++){
   const alpha=entry.g.geometry.vertices[i*6+5];
   assert.ok(Math.abs(alpha-.63)<1e-7);
   assert.ok(Math.abs(alpha*entry.standard.color.a/255-.63)<1e-7,'pool opacity must not attenuate the stream');
  }
 }
});
test('normal -> twelve-strip -> normal -> healing retains alpha ownership and layer routing',async()=>{
 const back=new Node('back'),front=new Node('front'),effects=new Effects(back,front);
 effects.render([texture(.2)]);await Promise.resolve();const entry=effects.pool[0];
 effects.render([strip(.4)]);await Promise.resolve();
 assert.strictEqual(effects.pool[0],entry);assert.equal(entry.standard.enabled,false);
 assert.equal(entry.standard.color.a,255);assert.equal(entry.stripChild.active,true);
 assert.equal(entry.strip.color.a,102);assert.ok(entry.strip.stripVertices.length>0);
 assert.equal(entry.standard.color.a/255*entry.strip.color.a/255,.4);
 assert.equal(entry.graphicChild.active,false);assert.strictEqual(entry.node.parent,front);
 effects.clear();assert.equal(entry.node.active,false);
 effects.render([texture(.3)]);
 assert.equal(entry.node.active,true);assert.equal(entry.standard.enabled,true);assert.equal(entry.standard.color.a,77);
 assert.equal(entry.stripChild.active,false);assert.strictEqual(entry.node.parent,back);
 effects.render([stream(.42,false)]);
 assert.equal(entry.standard.color.a,255);assert.equal(entry.stripChild.active,false);assert.equal(entry.graphicChild.active,true);
 assert.equal(effects.pool.length,1,'transitions must keep the existing pooled allocation');
});
