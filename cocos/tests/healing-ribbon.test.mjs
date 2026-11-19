import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
import {fileURLToPath, pathToFileURL} from 'node:url';
const require = createRequire(import.meta.url);
const esbuild = process.env.CAN_CLUB_ESBUILD ? require(process.env.CAN_CLUB_ESBUILD) : require('esbuild');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const manifest = JSON.parse(await fs.readFile(path.join(root, 'cocos/assets/scripts/domain/migration-manifest.json'), 'utf8'));
const temporary = await fs.mkdtemp(path.join(os.tmpdir(), 'can-club-healing-ribbon-'));
test.after(() => fs.rm(temporary, {recursive: true, force: true}));
const originalSource = execFileSync('git', ['show', `${manifest.sourceCommit}:healing-fx.mjs`], {cwd: root, encoding: 'utf8'});
await fs.writeFile(path.join(temporary, 'original.mjs'), originalSource);
await esbuild.build({entryPoints: [path.join(root, 'cocos/assets/scripts/render/HealingRibbon.ts')],
  outfile: path.join(temporary, 'ribbon.mjs'), bundle: true, format: 'esm', platform: 'node',
  tsconfigRaw: {compilerOptions: {experimentalDecorators: true}},
  plugins: [{name: 'geometry-only-cocos-import', setup(build) {
    build.onResolve({filter: /^cc$/}, () => ({path: 'cc', namespace: 'test'}));
    build.onLoad({filter: /.*/, namespace: 'test'}, () => ({contents:
      `export const _decorator={ccclass:()=>C=>C};export class Sprite{};export class SpriteFrame{};export class Texture2D{};export class UITransform{};export const builtinResMgr={};`}));
  }}]});
const {paintHealing} = await import(pathToFileURL(path.join(temporary, 'original.mjs')));
const {HealingRibbonGeometry, HEALING_RIBBON_MAX_VERTICES} = await import(pathToFileURL(path.join(temporary, 'ribbon.mjs')));

// Record actual frozen Canvas paths/gradient. The test deliberately does not
// repeat the curve, normal or thickness equations implemented by the new mesh.
function frozenDraw(p) {
  const fills = [], gradients = []; let points = [];
  const ctx = {globalAlpha: 1, save(){}, restore(){}, translate(){},
    createLinearGradient(x0,y0,x1,y1) {const g={x0,y0,x1,y1,stops:[],addColorStop(t,c){this.stops.push([t,c]);}};gradients.push(g);return g;},
    beginPath(){points=[];},moveTo(x,y){points.push([x,y]);},lineTo(x,y){points.push([x,y]);},closePath(){},
    fill(){fills.push({points:[...points],alpha:this.globalAlpha,gradient:this.fillStyle});}};
  assert.equal(paintHealing(ctx,{art:'heal-stream',x:0,y:0,...p}),true);
  return {fills,gradient:gradients[0]};
}
const area = points => Math.abs(points.reduce((sum,a,i)=>{const b=points[(i+1)%points.length];return sum+a[0]*b[1]-b[0]*a[1];},0))/2;
const point = (g,index) => [g.vertices[index*6],-g.vertices[index*6+1]];
const triangle = (g,index) => [point(g,index),point(g,index+1),point(g,index+2)];
function gradientAt(gradient,x) {
  const t=Math.max(0,Math.min(1,(x-gradient.x0)/(gradient.x1-gradient.x0)));
  let i=1;while(i<gradient.stops.length-1&&t>gradient.stops[i][0])i++;
  const [ta,ca]=gradient.stops[i-1],[tb,cb]=gradient.stops[i],mix=(t-ta)/(tb-ta);
  const rgb=c=>[1,3,5].map(start=>parseInt(c.slice(start,start+2),16)/255),a=rgb(ca),b=rgb(cb);
  return a.map((v,k)=>v+(b[k]-v)*mix);
}
function trianglesBySegment(g) {
  const segments=new Map();
  for(let i=0;i<g.vertexCount;i+=3){const segment=g.triangleSegments[i/3];if(!segments.has(segment))segments.set(segment,[]);segments.get(segment).push(i);}
  return [...segments.values()];
}
const phases=[0,1e-10,Math.PI/2,Math.PI,Math.PI*1.5,-Math.PI,-17.37,31.91,...Array.from({length:26},(_,i)=>i*.2413+.017)];
test('ribbon covers the exact frozen 34-segment outlines in both occlusion layers',()=>{
  const g=new HealingRibbonGeometry();let cases=0;
  for(const phase of phases)for(const [width,height]of [[28,16.2],[86.49,50.22],[141,81.87]])for(const front of [false,true]){
    const p={width,height,phase,front,alpha:front?.63:.42},original=frozenDraw(p);g.rebuild(p);
    assert.ok(g.vertexCount<=HEALING_RIBBON_MAX_VERTICES);assert.equal(g.vertexCount%3,0);
    const groups=trianglesBySegment(g);assert.equal(groups.length,original.fills.length);
    groups.forEach((indices,k)=>{
      const poly=original.fills[k].points,expectedArea=area(poly),actualArea=indices.reduce((sum,i)=>sum+area(triangle(g,i)),0);
      assert.ok(Math.abs(actualArea-expectedArea)<=Math.max(1,expectedArea)*3e-6,`outline area phase=${phase} segment=${k}`);
      const vertices=indices.flatMap(i=>triangle(g,i));
      for(const [x,y]of poly)assert.ok(vertices.some(v=>Math.hypot(v[0]-x,v[1]-y)<width*1e-7),`source corner lost phase=${phase}`);
      for(const [x,y]of vertices){
        const crosses=poly.map((a,i)=>{const b=poly[(i+1)%poly.length];return (b[0]-a[0])*(y-a[1])-(b[1]-a[1])*(x-a[0]);});
        const tolerance=width*height*1e-7;
        assert.ok(crosses.every(v=>v>=-tolerance)||crosses.every(v=>v<=tolerance),'clipped vertex outside source trapezoid');
      }
    });cases++;
  }
  assert.equal(cases,204);
});
test('vertex interpolation equals the frozen continuous X gradient and original alpha',()=>{
  const g=new HealingRibbonGeometry();let samples=0;
  for(const phase of phases)for(const front of [false,true])for(const alpha of [.0001,.42,.63,1]){
    const p={width:86.49,height:50.22,phase,front,alpha},original=frozenDraw(p);g.rebuild(p);
    for(let i=0;i<g.vertexCount;i+=3){
      for(const weights of [[.2,.3,.5],[.7,.15,.15],[1/3,1/3,1/3]]){
        let x=0;const color=[0,0,0,0];weights.forEach((weight,k)=>{const offset=(i+k)*6;x+=g.vertices[offset]*weight;for(let c=0;c<4;c++)color[c]+=g.vertices[offset+2+c]*weight;});
        const expected=[...gradientAt(original.gradient,x),alpha];
        for(let c=0;c<4;c++)assert.ok(Math.abs(color[c]-expected[c])<2e-7,`gradient channel=${c} phase=${phase} x=${x}`);
        samples++;
      }
      const xs=triangle(g,i).map(p=>p[0]);
      for(const [stop]of original.gradient.stops.slice(1,-1)){
        const boundary=original.gradient.x0+stop*(original.gradient.x1-original.gradient.x0);
        assert.ok(!(Math.min(...xs)<boundary-1e-5&&Math.max(...xs)>boundary+1e-5),'triangle crossed a gradient color stop');
      }
    }
  }
  assert.ok(samples>30000);
});
test('front/back stay complementary and fixed buffers clear prior phases',()=>{
  const front=new HealingRibbonGeometry(),back=new HealingRibbonGeometry(),buffer=front.vertices;
  for(let i=0;i<1200;i++){
    const p={width:83.7,height:48.6,phase:i*.0167,alpha:.63,front:true};front.rebuild(p);back.rebuild({...p,front:false});
    assert.equal(front.vertices,buffer);assert.ok(front.vertexCount<=HEALING_RIBBON_MAX_VERTICES);assert.ok(back.vertexCount<=HEALING_RIBBON_MAX_VERTICES);
    const frontSegments=new Set(front.triangleSegments.slice(0,front.vertexCount/3)),backSegments=new Set(back.triangleSegments.slice(0,back.vertexCount/3));
    assert.equal(new Set([...frontSegments,...backSegments]).size,34);
    for(const segment of frontSegments)assert.ok(!backSegments.has(segment));
    assert.ok(front.vertices.subarray(front.vertexCount*6).every(x=>x===0));
  }
  front.rebuild({width:0,height:20,phase:0,alpha:1,front:true});
  assert.equal(front.vertexCount,0);assert.ok(front.vertices.every(x=>x===0));
});
