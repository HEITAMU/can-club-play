import {createBackgroundMusic} from '../../music.mjs';
// Execute production app/component logic with small platform substitutes.
// These fixtures do not run a browser renderer, Cocos GPU, or a WeChat device.
import {readFileSync} from 'node:fs';
import {stripTypeScriptTypes} from 'node:module';
import vm from 'node:vm';
import * as Core from '../../cocos/assets/scripts/Core.js';
import * as Motion from '../../cocos/assets/scripts/TurnMotion.js';
import * as Home from '../../cocos/assets/scripts/HomeScene.js';
import * as Themes from '../../cocos/assets/scripts/TileThemes.js';
import {createGameAudio} from '../../audio.mjs';

export const TEST_DAY='2026-11-21';
export const reference=JSON.parse(readFileSync(new URL('../../cocos/assets/resources/art/referenceLayout.json',import.meta.url),'utf8'));
const rankLayout=JSON.parse(readFileSync(new URL('../../cocos/assets/resources/art/rankLayout.json',import.meta.url),'utf8'));
export const flush=()=>new Promise(resolve=>setImmediate(resolve));

export function memoryStorage(preferences={}){
  const values=new Map(Object.entries(preferences).map(([key,value])=>['fourfold:'+key,JSON.stringify(value)])),writes=[];
  return {values,writes,getItem:key=>values.get(key)??null,setItem(key,value){values.set(key,String(value));writes.push({key,value:JSON.parse(value)});},removeItem:key=>values.delete(key)};
}

class EventTarget {
  constructor(){this.events=new Map();}
  addEventListener(type,handler){if(!this.events.has(type))this.events.set(type,new Set());this.events.get(type).add(handler);}
  removeEventListener(type,handler){this.events.get(type)?.delete(handler);}
  dispatch(type,extra={}){const event={target:this,preventDefault(){},...extra};for(const handler of this.events.get(type)||[])handler(event);this['on'+type]?.(event);}
}

class Element extends EventTarget {
  constructor(tagName,doc){
    super();this.tagName=tagName.toLowerCase();this.ownerDocument=doc;this.children=[];this.parentNode=null;
    this.dataset={};this.attributes=new Map();this.classes=new Set();this.hidden=false;this.disabled=false;this.textContent='';
    this.style={setProperty(name,value){this[name]=String(value);},getPropertyValue(name){return this[name]??'';},removeProperty(name){delete this[name];}};
    this.classList={add:(...names)=>names.forEach(name=>this.classes.add(name)),remove:(...names)=>names.forEach(name=>this.classes.delete(name)),contains:name=>this.classes.has(name),toggle:(name,force)=>{const enabled=force===undefined?!this.classes.has(name):!!force;enabled?this.classes.add(name):this.classes.delete(name);return enabled;}};
  }
  set id(value){this._id=value;this.ownerDocument.ids.set(value,this);}get id(){return this._id||'';}
  set hidden(value){this._hidden=!!value;if(this.attributes){if(this._hidden)this.attributes.set('hidden','');else this.attributes.delete('hidden');}}get hidden(){return this._hidden;}
  set className(value){this.classes=new Set(value.split(/\s+/).filter(Boolean));}get className(){return [...this.classes].join(' ');}
  setAttribute(name,value){
    this.attributes.set(name,String(value));
    if(name==='id')this.id=String(value);if(name==='class')this.className=String(value);
    if(name==='hidden')this.hidden=true;if(name==='disabled')this.disabled=true;
    if(name.startsWith('data-'))this.dataset[name.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]=String(value);
  }
  getAttribute(name){return this.attributes.get(name)??null;}
  removeAttribute(name){this.attributes.delete(name);if(name==='hidden')this.hidden=false;if(name==='disabled')this.disabled=false;}
  append(...nodes){for(const node of nodes){if(node.tagName==='#fragment'){this.append(...[...node.children]);continue;}if(node.parentNode)node.parentNode.children.splice(node.parentNode.children.indexOf(node),1);node.parentNode=this;this.children.push(node);}}
  replaceChildren(...nodes){this.children.forEach(node=>node.parentNode=null);this.children=[];this.append(...nodes);}
  get firstElementChild(){return this.children[0]||null;}
  matches(selector){
    if(selector.includes(','))return selector.split(',').some(part=>this.matches(part.trim()));
    if(selector.startsWith('#'))return this.id===selector.slice(1);
    if(selector.startsWith('.'))return selector.slice(1).split('.').every(name=>this.classes.has(name));
    const attr=selector.match(/^(\w+)?\[([\w-]+)(?:=["']?([^"'\]]+)["']?)?\]$/);
    if(attr)return (!attr[1]||this.tagName===attr[1])&&this.attributes.has(attr[2])&&(attr[3]===undefined||this.getAttribute(attr[2])===attr[3]);
    return this.tagName===selector;
  }
  querySelectorAll(selector){const result=[],selectors=selector.split(',').map(value=>value.trim());const visit=node=>node.children.forEach(child=>{if(selectors.some(value=>child.matches(value)))result.push(child);visit(child);});visit(this);return result;}
  querySelector(selector){return this.querySelectorAll(selector)[0]||null;}
  closest(selector){for(let node=this;node;node=node.parentNode)if(node.matches(selector))return node;return null;}
  click(){if(!this.disabled)this.dispatch('click');}
  focus(){this.ownerDocument.activeElement=this;}
  getBoundingClientRect(){return {x:0,y:0,left:0,top:0,width:390,height:365,right:390,bottom:365};}
}

function documentFromMarkup(markup){
  const doc=new EventTarget();doc.ids=new Map();doc.createElement=tag=>new Element(tag,doc);doc.getElementById=id=>doc.ids.get(id)||null;
  doc.createDocumentFragment=()=>doc.createElement('#fragment');doc.documentElement=doc.createElement('html');
  const stack=[doc.documentElement],voids=new Set(['img','input','br','hr','meta','link']);
  const body=markup.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,'').replace(/<!--[\s\S]*?-->/g,'');
  for(const match of body.matchAll(/<(\/?)([\w-]+)([^>]*)>/g)){
    const [,closing,tag,attrs]=match;if(closing){if(stack.length>1)stack.pop();continue;}
    const node=doc.createElement(tag);
    for(const attr of attrs.matchAll(/([\w-]+)(?:="([^"]*)"|='([^']*)'|=([^\s>]+))?/g))node.setAttribute(attr[1],attr[2]??attr[3]??attr[4]??'');
    stack.at(-1).append(node);if(!voids.has(tag))stack.push(node);
  }
  return doc;
}

export function webFixture({preferences={},storage=memoryStorage(preferences),audioOptions={},musicOptions={}}={}){
  const sourceUrl=new URL('../../app.js',import.meta.url),source=readFileSync(sourceUrl,'utf8');
  if(!/\nboot\(\);\s*$/.test(source))throw new Error('Review changed production boot boundary');
  const executable=source.replace(/^import\s+[^;]+;\s*$/gm,'').replace(/import\.meta\.url/g,JSON.stringify(sourceUrl.href)).replace(/\nboot\(\);\s*$/,'\n');
  const document=documentFromMarkup(readFileSync(new URL('../../index.html',import.meta.url),'utf8'));
  const window=new EventTarget(),timers=new Map();let clock=1000,timer=0;
  const timeout=(callback,delay)=>{const id=++timer;timers.set(id,{callback,delay});return id;};
  window.location={href:'https://example.invalid/fourfold/',search:''};window.matchMedia=()=>({matches:false});
  window.setTimeout=timeout;window.clearTimeout=id=>timers.delete(id);window.setInterval=timeout;window.clearInterval=window.clearTimeout;
  class Image {
    set src(value){this._src=value;const resource=new URL(value).pathname.split('/').at(-1).replace(/\.webp$/,'');const bytes=readFileSync(new URL(`../../cocos/assets/resources/art/${resource}.png`,import.meta.url));this.naturalWidth=bytes.readUInt32BE(16);this.naturalHeight=bytes.readUInt32BE(20);queueMicrotask(()=>this.onload?.());}
    get src(){return this._src;}async decode(){}
  }
  const audioControllers=[];
  const fixtureAudio=options=>{const controller=createGameAudio({...options,contextFactory:()=>null,fetchAudio:async()=>({ok:false}),now:()=>clock,...audioOptions});audioControllers.push(controller);return controller;};
  const context=vm.createContext({...Core,...Motion,...Home,...Themes,createBackgroundMusic:options=>createBackgroundMusic({...options,contextFactory:()=>null,...musicOptions}),createGameAudio:fixtureAudio,todayCN:()=>TEST_DAY,document,window,localStorage:storage,Image,
    performance:{now:()=>clock},setTimeout:timeout,clearTimeout:window.clearTimeout,setInterval:timeout,clearInterval:window.clearTimeout,
    URL,URLSearchParams,location:window.location,navigator:{},console:{warn(){},error(){},log(){}},__reference:reference});
  vm.runInContext(executable,context,{filename:'app.js'});
  vm.runInContext('baseTileArtwork=__reference.tileArtwork;ready=true;',context);
  return {context,document,window,storage,timers,audioControllers,
    run:script=>vm.runInContext(script,context),el:id=>document.getElementById(id),setClock:value=>{clock=value;},
    async start(mode='story',key='1'){context.__testEntry={mode,key};await vm.runInContext('startGame(__testEntry.mode,__testEntry.key)',context);vm.runInContext('showGame()',context);await flush();},
  };
}

class Graphics {clear(){}roundRect(){}fill(){}stroke(){}moveTo(){}lineTo(){}}
class UIOpacity {constructor(){this.opacity=255;}}
class Mask {}Mask.Type={RECT:0,GRAPHICS_STENCIL:1,ELLIPSE:2};
class Color {static fromHEX(color,value){color.hex=value;}}
class NativeNode {
  static EventType={TOUCH_START:'start',TOUCH_END:'end',TOUCH_CANCEL:'cancel'};
  constructor(name='Node'){this.name=name;this.children=[];this.components=new Map();this.events=new Map();this.isValid=true;this.active=true;this.activeInHierarchy=true;}
  addChild(node){node.parent=this;this.children.push(node);}
  addComponent(Type){const value=new Type();value.node=this;this.components.set(Type,value);return value;}
  getComponent(Type){return this.components.get(Type)||null;}
  on(event,handler){this.events.set(event,handler);}
  emit(event){this.events.get(event)?.({propagationStopped:false});}
  removeFromParent(){if(this.parent)this.parent.children=this.parent.children.filter(node=>node!==this);this.parent=null;}
  destroy(){this.isValid=false;}
  setPosition(...values){this.position=values;}setScale(...values){this.scale=values;}
}

export function nativeFixture({preferences={},storage=memoryStorage(preferences),useWx=true,cc={},musicOptions={}}={}){
  const source=readFileSync(new URL('../../cocos/assets/scripts/Game.ts',import.meta.url),'utf8');
  const executable=stripTypeScriptTypes(source.replace(/^import\s*\{[\s\S]*?\}\s*from\s*['"][^'"]+['"];?\s*$/gm,'').replace(/^@ccclass\('FourfoldGame'\)\s*$/m,'').replace('export class FourfoldGame','class FourfoldGame'),{mode:'transform'});
  const clouds=[],events=[],art=[],groups=[],buttons=[],hits=[],shapes=[],texts=[];let clock=1000;
  const sdk={getStorageSync:key=>storage.getItem(key),setStorageSync:(key,value)=>storage.setItem(key,value),setUserCloudStorage:payload=>clouds.push(payload),vibrateShort:()=>events.push('vibrate')};
  const context={...Core,...Motion,...Home,...Themes,createBackgroundMusic:options=>createBackgroundMusic({...options,contextFactory:()=>null,...musicOptions}),todayCN:()=>TEST_DAY,Component:class{},Node:NativeNode,Graphics,UIOpacity,Mask,Color,BlockInputEvents:class{},LabelOutline:class{},
    Vec2:class{constructor(x,y){this.x=x;this.y=y;}},UITransform:class{setContentSize(){}},
    _decorator:{ccclass:()=>{}},localStorage:storage,performance:{now:()=>clock},console:{warn(){},error(){}},wx:useWx?sdk:undefined,...cc};
  const Game=vm.runInNewContext(executable+'\nFourfoldGame;',context,{filename:'Game.ts'}),game=new Game();
  game.root=new NativeNode('Root');game.reference=reference;game.rankLayout=rankLayout;game.assetsReady=true;game.inHome=false;
  // Keep real clear() and therefore the real UI generation token; only painting
  // and image I/O are replaced. No routing or preference implementation is copied.
  game.resumeMusic=()=>Promise.resolve(); // Music I/O is covered by its dedicated lifecycle tests.
  game.draw=()=>{game.clear();events.push('draw');};
  game.prepareTheme=()=>{game.activeTheme=Themes.getTileTheme(game.mode,game.key);game.themeLoading=false;game.themeError='';game.draw();return Promise.resolve();};
  game.hideBanner=()=>events.push('banner:hide');game.showBanner=()=>events.push('banner:show');game.toast=message=>events.push('toast:'+message);
  game.group=(name,x,y,w,h,parent=game.root)=>{const node=new NativeNode(name),content=new NativeNode('Content');parent?.addChild(node);node.addChild(content);groups.push({name,x,y,w,h,node,content});return {node,content};};
  game.art=(name,x,y,w,h,parent=game.root)=>{const node=new NativeNode(name);parent?.addChild(node);art.push({name,x,y,w,h,node});return node;};
  game.shape=(x,y,w,h,fill,stroke,radius,parent=game.root)=>{const node=new NativeNode('Shape');parent?.addChild(node);shapes.push({x,y,w,h,node});return node;};
  game.txt=(text,x,y,w,h,size,color,bold,parent=game.root)=>{const node=new NativeNode(text);parent?.addChild(node);const label={node,string:text};texts.push(label);return label;};
  game.numberText=(...args)=>game.txt(...args);
  game.tileSurface=()=>{};game.bindButton=(node,action)=>node.on(NativeNode.EventType.TOUCH_END,action);
  game.artHit=(name,rect,scale,parent,action)=>{const node=new NativeNode(name);parent?.addChild(node);hits.push({name,action,node});return {x:0,y:0,w:44,h:44,node};};
  game.btn=(label,x,y,w,h,action)=>{buttons.push({label,x,y,w,h,action});return new NativeNode(label);};
  return {game,storage,clouds,events,art,groups,buttons,hits,shapes,texts,NativeNode,Game,setClock:value=>{clock=value;}};
}
