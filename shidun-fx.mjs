const clamp=x=>Math.max(0,Math.min(1,x));
export function sampleShidun(actor,time,p,size,w,h,feet,centers={},sizes={}){
 if(actor.catId!=='pudding')return[];
 const sp=actor.shieldPunch,out=[],base={art:'shidun',x:p.x,y:p.y,width:size,height:size,angle:0,alpha:1,layer:2};
 if(actor.hp>0&&sp&&['charging','primed'].includes(sp.state))out.push({...base,stage:'charge',x:feet?.x??p.x,y:feet?.y??p.y+size*.43,q:clamp((time-sp.firstAt)/sp.config.minCharge),time,layer:0});
 const since=time-(actor.shidunImpactAt??-99);
 if(since>=0&&since<.6)for(const id of actor.shidunHitTargets||[]){const target=centers[id];if(!target)continue;const targetSize=Math.max(sizes[id]||0,size*.9);out.push({...base,stage:'impact',targetId:id,x:target.x*w/100,y:target.y*h/100,width:targetSize,height:targetSize,q:since/.6,time});}
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
