// The art is animated, not a rectangular button painted over the scene.
export function bindDistrictInput(root,onOpen,{reducedMotion=false}={}){
 let timer=null,reset=null,disposed=false;
 const listeners=[];
 const listen=(el,type,fn)=>{el.addEventListener(type,fn);listeners.push(()=>el.removeEventListener(type,fn));};
 const clear=()=>{delete root.dataset.pressed;if(root._districtTap?.phase==='press')root._districtTap=null;};
 const mark=(id,phase,e)=>{const r=root.getBoundingClientRect?.();const p=root.querySelectorAll('[data-place]');const b=[...p].find(b=>b.dataset.place===id);const br=b?.getBoundingClientRect?.();const prev=root._districtTap;root._districtTap={id,phase,at:performance.now()/1000,x:r?((e?.clientX??(br?.left+br?.width/2))-r.left)/r.width:undefined,y:r?((e?.clientY??(br?.top+br?.height/2))-r.top)/r.height:undefined};if(phase==='release'&&prev){root._districtTap.x=prev.x;root._districtTap.y=prev.y;}};
 for(const button of root.querySelectorAll('[data-place]')){
  const id=button.dataset.place;
  listen(button,'pointerdown',e=>{if(e.button!==0||timer)return;root.dataset.pressed=id;mark(id,'press',e);delete root.dataset.released;});
  listen(button,'pointerleave',clear);listen(button,'pointercancel',clear);listen(button,'pointerup',clear);listen(button,'blur',clear);
  listen(button,'keydown',e=>{if((e.key==='Enter'||e.key===' ')&&!e.repeat&&!timer){root.dataset.pressed=id;mark(id,'press');}});
  listen(button,'keyup',clear);
  listen(button,'click',e=>{if(timer||disposed)return;mark(id,'release',e.detail?e:undefined);delete root.dataset.pressed;root.dataset.released=id;clearTimeout(reset);reset=setTimeout(()=>{delete root.dataset.released;root._districtTap=null;},280);timer=setTimeout(()=>{timer=null;if(!disposed&&root.isConnected)onOpen(id);},reducedMotion?0:270);});
 }
 return ()=>{disposed=true;clearTimeout(timer);clearTimeout(reset);clear();delete root.dataset.released;root._districtTap=null;listeners.forEach(f=>f());};
}
