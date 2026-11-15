import test from 'node:test';import assert from 'node:assert/strict';
import {styleValue,attributeValue,textValue,classValue} from '../render-writes.mjs';
import {CombatText} from '../combat-text.mjs';
import {warmInterfaceAssets,BACKGROUND_UI_ASSETS} from '../startup-assets.mjs';
test('600 unchanged animation frames make no redundant DOM writes; changed and externally reset values update',()=>{
 let writes=0,text='',styles=new Map(),attrs=new Map(),classes=new Set();const el={style:{getPropertyValue:k=>styles.get(k),setProperty:(k,v)=>{writes++;styles.set(k,v)}},getAttribute:k=>attrs.get(k),setAttribute:(k,v)=>{writes++;attrs.set(k,v)},get textContent(){return text},set textContent(v){writes++;text=v},classList:{contains:k=>classes.has(k),toggle:(k,on)=>{writes++;on?classes.add(k):classes.delete(k)}}};
 for(let i=0;i<600;i++){styleValue(el,'left','20%');attributeValue(el,'data-phase','idle');textValue(el,'第 1 回合');classValue(el,'has-shield',true)}assert.equal(writes,4);styleValue(el,'left','21%');assert.equal(writes,5);styles.clear();styleValue(el,'left','21%');assert.equal(writes,6);
});
test('long battles recycle bounded damage nodes and clear critical decoration before normal hits',()=>{
 let created=0;const nodes=[];const layer={ownerDocument:{createElement(){created++;const style={set cssText(v){for(const k of Object.keys(this))if(k!=='cssText')delete this[k]}};return {style,remove(){const i=nodes.indexOf(this);if(i>=0)nodes.splice(i,1)}}}},appendChild:el=>nodes.push(el)};const t=new CombatText(layer);
 t.consume([{type:'hit',to:'p',value:123,crit:true,damageType:'physical'}],{p:{x:50,y:50}},0);const el=nodes[0];assert.ok(el.style.borderImageSource);t.render(1);t.consume([{type:'hit',to:'p',value:10}],{p:{x:50,y:50}},2);assert.equal(nodes[0],el);assert.equal(el.style.borderImageSource,undefined);assert.equal(el.className,'float-text');
 for(let round=0;round<100;round++){t.clear();for(let i=0;i<60;i++)t.spawn(i,50,50);assert.equal(nodes.length,48)}assert.equal(created,48);t.clear();assert.equal(nodes.length,0);assert.equal(t.pool.length,48);
});
test('background warmup is serial, low-priority and survives a missing optional asset',async()=>{const calls=[];let active=0,max=0;await warmInterfaceAssets(async(urls,opts)=>{active++;max=Math.max(max,active);calls.push([urls[0],opts.priority]);await Promise.resolve();active--;if(calls.length===1)throw Error('offline')});assert.equal(max,1);assert.deepEqual(calls.map(x=>x[0]),BACKGROUND_UI_ASSETS);assert.ok(calls.every(x=>x[1]===0));});
