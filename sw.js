const CACHE='can-club-0.27.4',ART_CACHE='can-club-art-v1';
// Cache only the shell at install. Download artwork when the player needs it.
const RELEASE='0.27.4';
const SHELL=['./index.html','./game.bundle.mjs?v=0.27.4','./game.bundle.css?v=0.27.4'];
self.addEventListener('install',event=>event.waitUntil((async()=>{
 try{const cache=await caches.open(CACHE);await Promise.allSettled(SHELL.map(async url=>{const response=await fetch(url,{cache:'no-store'});if(response.ok)await cache.put(url,response);}));}catch{}
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
 // An old QR tab does not contain the new app's update listener. Migrate it once
 // after the complete current shell is cached; keep all localStorage saves.
 try{
  const cache=await caches.open(CACHE),shell=await cache.match('./index.html');
  if(shell?.ok&&(await shell.clone().text()).includes('game.bundle.mjs?v='+RELEASE)&&(await Promise.all(SHELL.map(url=>cache.match(url)))).every(Boolean)){
   const windows=await self.clients.matchAll({type:'window',includeUncontrolled:true});
   const root=new URL('./',self.location.href);
   for(const client of windows){const url=new URL(client.url);if(url.origin!==root.origin||![root.pathname,root.pathname+'index.html'].includes(url.pathname)||url.searchParams.get('v')===RELEASE)continue;
    client.postMessage({type:'GAME_UPDATE_READY',version:RELEASE});
    await new Promise(resolve=>setTimeout(resolve,300));
    url.searchParams.set('v',RELEASE);await client.navigate(url.href);
   }
  }
 }catch{}
})()));
async function remember(cache,key,response){if(cache&&response?.ok)await cache.put(key,response.clone()).catch(()=>{});return response;}
async function resource(request){
 const artwork=new URL(request.url).pathname.includes('/assets/');
 const cache=await caches.open(artwork?ART_CACHE:CACHE).catch(()=>null);
 const cached=await cache?.match(request).catch(()=>null);if(cached)return cached;
 return remember(cache,request,await fetch(request));
}
async function page(request){
 const path=new URL(request.url).pathname;
 if(!path.endsWith('/')&&!path.endsWith('/index.html'))return fetch(request);
 const cache=await caches.open(CACHE).catch(()=>null),cached=await cache?.match('./index.html').catch(()=>null);
 const fresh=new URL(request.url);fresh.searchParams.set('_shell',RELEASE);
 const network=fetch(fresh.href,{cache:'no-store'}).then(async response=>{
  if(!response.ok&&cached)return cached;
  return remember(cache,'./index.html',response);
 }).catch(error=>{if(cached)return cached;throw error;});
 if(!cached)return network;
 let timer;
 try{return await Promise.race([network,new Promise(resolve=>{timer=setTimeout(()=>resolve(cached),10000);})]);}
 finally{clearTimeout(timer);}
}
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;
 const result=event.request.mode==='navigate'?page(event.request):resource(event.request);
 event.respondWith(result.catch(()=>Response.error()));
 event.waitUntil(result.catch(()=>{}));
});
