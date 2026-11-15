import {imageCache} from './image-cache.mjs';
export const SHARED_BATTLE_ASSETS=[
 './assets/ui/critical-physical-v02658.webp','./assets/ui/critical-magic-v02658.webp',
 './assets/vfx/effects-v0216.webp','./assets/vfx/can-rescue-v0192.webp'
];
export function uniqueAssets(urls){return [...new Set(urls.filter(Boolean))];}
export function battleAssetsReady(urls,cache=imageCache){return uniqueAssets(urls).every(url=>cache.entries.get(url)?.ready);}
export function loadBattleAssets(urls,{cache=imageCache,timeout=30000,onProgress=()=>{}}={}){
 const all=uniqueAssets(urls);let completed=0;onProgress(0,all.length);
 return Promise.all(all.map(url=>new Promise((resolve,reject)=>{
  let settled=false,dispose=()=>{};
  const timer=setTimeout(()=>{if(settled)return;settled=true;dispose();reject(new Error('asset timeout: '+url));},timeout);
  dispose=cache.subscribe(url,async img=>{try{if(typeof img.decode==='function')await img.decode();if(settled)return;settled=true;clearTimeout(timer);dispose();onProgress(++completed,all.length);resolve(url);}catch{if(settled)return;settled=true;clearTimeout(timer);dispose();reject(new Error('asset decode: '+url));}},4);
  if(settled)dispose();
 })));
}
