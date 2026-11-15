import {imageCache} from './image-cache.mjs';
export const SHARED_BATTLE_ASSETS=[
 './assets/ui/critical-physical-v02658.webp','./assets/ui/critical-magic-v02658.webp',
 './assets/vfx/effects-v0216.webp','./assets/vfx/can-rescue-v0192.webp'
];
export function uniqueAssets(urls){return [...new Set(urls.filter(Boolean))];}
const decodedImages=new WeakSet();
export function battleAssetsReady(urls,cache=imageCache){return uniqueAssets(urls).every(url=>decodedImages.has(cache.entries.get(url)?.img));}
export function loadBattleAssets(urls,{cache=imageCache,timeout=30000,onProgress=()=>{}}={}){
 const all=uniqueAssets(urls);let completed=0;onProgress(0,all.length);
 if(!all.length)return Promise.resolve([]);
 return new Promise((resolve,reject)=>{
  const cleanups=new Set();let stopped=false,timer;
  const finish=error=>{if(stopped)return;stopped=true;clearTimeout(timer);for(const dispose of cleanups)dispose();cleanups.clear();error?reject(error):resolve(all);};
  // Measure a stall, not time spent waiting behind other successful downloads.
  const progressDeadline=()=>{clearTimeout(timer);timer=setTimeout(()=>finish(new Error('asset timeout: loading stalled')),timeout);};
  progressDeadline();
  for(const url of all){
   if(stopped)break;
   let settled=false,decoding=false,dispose=()=>{};
   dispose=cache.subscribe(url,async img=>{
    if(settled||stopped||decoding)return;decoding=true;
    try{
     if(!decodedImages.has(img)&&typeof img.decode==='function')await img.decode();
     if(settled||stopped)return;
     decodedImages.add(img);settled=true;dispose();cleanups.delete(dispose);
     onProgress(++completed,all.length);
     if(completed===all.length)finish();else progressDeadline();
    }catch{
     if(settled||stopped)return;
     cache.invalidate?.(url,img);settled=true;finish(new Error('asset decode: '+url));
    }
   },4);
   if(settled||stopped)dispose();else cleanups.add(dispose);
  }
 });
}
