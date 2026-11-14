const CACHE='can-club-0.25.2',ART_CACHE='can-club-art-v1';
// Cache only the shell at install. Download artwork when the player needs it.
const SHELL=['./index.html','./game.bundle.mjs?v=0.25.2','./game.bundle.css?v=0.25.2'];
self.addEventListener('install',event=>event.waitUntil((async()=>{
 try{const cache=await caches.open(CACHE);await Promise.allSettled(SHELL.map(url=>cache.add(url)));}catch{}
 await self.skipWaiting();
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 // Retain already downloaded scenery/effects before retiring the old shell.
 try{
  const art=await caches.open(ART_CACHE);
  for(const key of await caches.keys())if(key.startsWith('can-club-')&&key!==CACHE&&key!==ART_CACHE){
   const old=await caches.open(key);
   for(const request of await old.keys())if(/\/assets\/(scenes|vfx|painted)\//.test(request.url)){
    if(!await art.match(request)){const response=await old.match(request);if(response?.ok)await art.put(request,response).catch(()=>{});}
   }
   await caches.delete(key);
  }
 }catch{}
 await self.clients.claim();
})()));
async function remember(cache,key,response){if(cache&&response?.ok)await cache.put(key,response.clone()).catch(()=>{});return response;}
async function resource(request){
 const artwork=new URL(request.url).pathname.includes('/assets/');
 const cache=await caches.open(artwork?ART_CACHE:CACHE).catch(()=>null);
 const cached=await cache?.match(request).catch(()=>null);if(cached)return cached;
 return remember(cache,request,await fetch(request));
}
async function page(request){
 const cache=await caches.open(CACHE).catch(()=>null),cached=await cache?.match('./index.html').catch(()=>null);
 const network=fetch(request).then(async response=>{
  if(!response.ok&&cached)return cached;
  return remember(cache,'./index.html',response);
 }).catch(error=>{if(cached)return cached;throw error;});
 if(!cached)return network;
 let timer;
 try{return await Promise.race([network,new Promise(resolve=>{timer=setTimeout(()=>resolve(cached),2500);})]);}
 finally{clearTimeout(timer);}
}
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;
 const result=event.request.mode==='navigate'?page(event.request):resource(event.request);
 event.respondWith(result.catch(()=>Response.error()));
 event.waitUntil(result.catch(()=>{}));
});
