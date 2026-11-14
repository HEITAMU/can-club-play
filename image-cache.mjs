// A shared, bounded queue. A failed request never becomes a permanent blank sprite.
export class ImageCache {
 constructor({createImage=()=>new Image(),now=()=>Date.now(),schedule=(fn,ms)=>setTimeout(fn,ms),cancel=id=>clearTimeout(id),concurrency=3,timeout=12000}={}){
  Object.assign(this,{createImage,now,schedule,cancel,concurrency,timeout});this.entries=new Map();this.active=0;this.queue=[];
 }
 get(url,priority=0){
  let r=this.entries.get(url);
  if(!r){r={url,img:null,ready:false,loading:false,queued:false,attempts:0,retryAt:0,priority,listeners:new Set()};this.entries.set(url,r);}
  r.priority=Math.max(r.priority,priority);
  if(!r.ready&&!r.loading&&!r.queued&&this.now()>=r.retryAt){r.queued=true;this.queue.push(r);this.pump();}
  return r;
 }
 subscribe(url,callback,priority=0){const r=this.get(url,priority);r.listeners.add(callback);if(r.ready)callback(r.img);return ()=>r.listeners.delete(callback);}
 pump(){
  this.queue.sort((a,b)=>b.priority-a.priority);
  while(this.active<this.concurrency&&this.queue.length)this.start(this.queue.shift());
 }
 start(r){
  r.queued=false;r.loading=true;r.attempts++;this.active++;
  const img=this.createImage();r.img=img;img.decoding='async';img.fetchPriority=r.priority>0?'high':'low';
  let finished=false,timer;
  const done=ok=>{
   if(finished)return;finished=true;this.cancel(timer);img.onload=img.onerror=null;r.loading=false;this.active--;
   if(ok){r.ready=true;r.retryAt=0;for(const cb of r.listeners)cb(img);}
   else {r.retryAt=this.now()+Math.min(30000,1000*2**Math.min(5,r.attempts-1));this.schedule(()=>this.get(r.url,r.priority),r.retryAt-this.now());}
   this.pump();
  };
  img.onload=()=>done((img.naturalWidth||img.width)>0);img.onerror=()=>done(false);
  timer=this.schedule(()=>{done(false);if(!r.ready)img.src='';},this.timeout);
  img.src=r.url;
 }
}
export const imageCache=new ImageCache();
export function getImage(url,priority=0){return imageCache.get(url,priority);}

// CSS backgrounds and SVG scenery get the same retries as canvas characters.
// Small collection portraits load only when they enter the visible scroll area.
export function watchImageAssets(root=document){
 const subscriptions=new Map();
 const load=el=>{
  if(subscriptions.has(el))return;
  const url=el.dataset.asset;if(!url)return;
  subscriptions.set(el,imageCache.subscribe(url,img=>{
   if(el.tagName.toLowerCase()==='image')el.setAttribute('href',img.src);
   else if(el.tagName.toLowerCase()==='img')el.src=img.src;
   else el.style.backgroundImage=`url("${img.src}")`;
  },el.closest?.('#actors,#scene')?2:0));
 };
 const visible=typeof IntersectionObserver==='function'?new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){visible.unobserve(e.target);load(e.target);}},{rootMargin:'60px'}):null;
 const scan=node=>{if(node.nodeType!==1&&node!==root)return;const elements=[...(node.matches?.('[data-asset]')?[node]:[]),...node.querySelectorAll('[data-asset]')];for(const el of elements)visible?visible.observe(el):load(el);};
 scan(root);
 const changes=new MutationObserver(records=>{for(const record of records)for(const n of record.addedNodes)scan(n);for(const [el,dispose] of subscriptions)if(!el.isConnected){dispose();subscriptions.delete(el);visible?.unobserve(el);}for(const record of records)for(const n of record.removedNodes){if(n.nodeType===1){visible?.unobserve(n);for(const el of n.querySelectorAll('[data-asset]'))visible?.unobserve(el);}}});
 changes.observe(root,{childList:true,subtree:true});
 return ()=>{changes.disconnect();visible?.disconnect();for(const dispose of subscriptions.values())dispose();};
}
