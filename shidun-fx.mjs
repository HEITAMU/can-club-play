const clamp=x=>Math.max(0,Math.min(1,x));
export function sampleShidun(actor,time,p,size,w,h,feet,centers={},sizes={}){
 if(actor.catId!=='pudding')return[];
 const sp=actor.shieldPunch,out=[],base={art:'shidun',x:p.x,y:p.y,width:size,height:size,angle:0,alpha:1,layer:2};
 if(actor.hp>0&&sp&&['charging','primed'].includes(sp.state))out.push({...base,stage:'charge',x:feet?.x??p.x,y:feet?.y??p.y+size*.43,q:clamp((time-sp.firstAt)/sp.config.minCharge),time,layer:0});
 const since=time-(actor.shidunImpactAt??-99);
 if(since>=0&&since<.6){
  const targets=(actor.shidunHitTargets||[]).map(id=>({id,p:centers[id]})).filter(t=>t.p);
  if(targets.length){
   // One continuous punch wave from the fist to the actual hit formation.
   const points=targets.map(t=>({x:t.p.x*w/100,y:t.p.y*h/100})),endX=Math.max(...points.map(t=>t.x));
   const low=Math.min(...points.map(t=>t.y)),high=Math.max(...points.map(t=>t.y));
   out.push({...base,stage:'wave',x:p.x,y:p.y,span:Math.max(size*2.7,endX-p.x+size),rise:(low+high)/2-p.y,spread:Math.max(size*1.3,high-low+size*1.2),q:since/.6,time});
   for(const t of targets){const targetSize=Math.max(sizes[t.id]||0,size*.9);out.push({...base,stage:'impact',targetId:t.id,x:t.p.x*w/100,y:t.p.y*h/100,width:targetSize,height:targetSize,q:since/.6,time});}
  }
 }
 return out;
}
export function paintShidun(ctx,p,img){
 if(p.art!=='shidun')return false;
 ctx.save();ctx.translate(p.x,p.y);const s=p.width;
 if(p.stage==='charge'){
  // Reuse the painted dust/stone cells; no circles, radial lines or magic sigils.
  if(img){
   const q=p.q;
   for(let i=0;i<3;i++){
    const u=(p.time*(.6+q*.25)+i/3)%1,side=i===1?-1:1;
    const x=side*s*(.28-.17*u),y=-s*.035*Math.sin(u*Math.PI);
    ctx.save();ctx.translate(x,y);ctx.scale(side,1);
    ctx.globalAlpha=Math.sin(u*Math.PI)*(.28+q*.35);
    ctx.drawImage(img,0,768,512,256,-s*.5,-s*.16,s*.85,s*.22);ctx.restore();
   }
   ctx.globalAlpha=.35+q*.3;
   ctx.drawImage(img,512,768,512,256,-s*.48+Math.sin(p.time*27)*s*.006,-s*.11,s*.94,s*.18);
  }

 }else if(p.stage==='wave'){
  // Restore the original twelve-frame travelling punch, including its
  // opening burst and dust tail. Keep its origin and aim tied to this hit.
  ctx.rotate(Math.atan2(p.rise,p.span));
  if(img){
   const frame=Math.min(11,Math.floor(p.q*12));
   const advance=1-Math.pow(1-Math.min(1,p.q/.65),2);
   const width=p.span*(.58+.2*advance)*1.25,height=width*.5;
   const forward=p.span*.42*advance;
   ctx.drawImage(img,(frame%3)*512,Math.floor(frame/3)*256,512,256,s*.34+forward-width*.1,s*.02-height*.66,width,height);
  }else{ctx.strokeStyle='#f5cb7e';ctx.lineWidth=6;for(let i=-1;i<=1;i++){ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(p.span,p.spread*i*.35);ctx.stroke();}}
 }else{
  if(img){const frame=Math.min(11,Math.floor(p.q*12));
   const width=s*1.65,height=width*.5;
   ctx.drawImage(img,(frame%3)*512,Math.floor(frame/3)*256,512,256,-width*.5,-height*.45,width,height);
  }else{
   // Visible contact even while the painted atlas is loading or unavailable.
   const r=s*(.45+.35*p.q);ctx.globalAlpha=(1-p.q)*.9;ctx.strokeStyle='#f5cb7e';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(0,0,r,r*.38,0,0,Math.PI*2);ctx.stroke();
   for(let i=0;i<6;i++){const a=i*Math.PI/3;ctx.beginPath();ctx.moveTo(Math.cos(a)*r*.5,Math.sin(a)*r*.3);ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r*.6);ctx.stroke();}
  }

 }
 ctx.restore();return true;
}
