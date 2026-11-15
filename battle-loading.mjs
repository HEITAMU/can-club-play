import {imageCache} from './image-cache.mjs';
export const SHARED_BATTLE_ASSETS=[
 './assets/ui/critical-physical-v02658.webp','./assets/ui/critical-magic-v02658.webp',
 './assets/vfx/effects-v0216.webp','./assets/vfx/can-rescue-v0192.webp'
];
export function uniqueAssets(urls){return [...new Set(urls.filter(Boolean))];}
const decodedImages=new WeakSet();
export function battleAssetsReady(urls,cache=imageCache){return uniqueAssets(urls).every(url=>decodedImages.has(cache.entries.get(url)?.img));}
export async function loadBattleAssets(urls,{cache=imageCache,timeout=30000,onProgress=()=>{}}={}){
 const all=uniqueAssets(urls),cleanups=new Set();let completed=0,stopped=false;onProgress(0,all.length);
 try{return await Promise.all(all.map(url=>new Promise((resolve,reject)=>{
  let settled=false,decoding=false,dispose=()=>{};
  const cleanup=()=>{clearTimeout(timer);dispose();cleanups.delete(cleanup);};
  const timer=setTimeout(()=>{if(settled||stopped)return;settled=true;cleanup();reject(new Error('asset timeout: '+url));},timeout);
  cleanups.add(cleanup);
  dispose=cache.subscribe(url,async img=>{
   if(settled||stopped||decoding)return;decoding=true;
   try{
    if(!decodedImages.has(img)&&typeof img.decode==='function')await img.decode();
    if(settled||stopped)return;
    decodedImages.add(img);settled=true;cleanup();onProgress(++completed,all.length);resolve(url);
   }catch{
    if(settled||stopped)return;
    cache.invalidate?.(url,img);settled=true;cleanup();reject(new Error('asset decode: '+url));
   }
  },4);
  if(settled||stopped)dispose();
 })));}finally{stopped=true;for(const cleanup of [...cleanups])cleanup();}
}
