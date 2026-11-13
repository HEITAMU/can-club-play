const clamp=x=>Math.max(0,Math.min(1,x));
export function sampleShidun(actor,time,p,size,w,h){
 if(actor.catId!=='pudding'||actor.hp<=0)return[];
 const sp=actor.shieldPunch,out=[],base={art:'shidun',x:p.x,y:p.y,width:size,height:size,angle:0,alpha:1,layer:2};
 if(sp&&['charging','primed'].includes(sp.state))out.push({...base,stage:'charge',q:clamp((time-sp.firstAt)/sp.config.minCharge),time,layer:0});
 const since=time-(actor.shidunImpactAt??-99);
 if(since>=0&&since<.6)out.push({...base,stage:'impact',q:since/.6,time,span:Math.max(size*2.7,w-p.x),spread:Math.min(h*.5,size*3.4)});
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
    const x=side*s*(.55-.28*u),y=s*(.43-.035*Math.sin(u*Math.PI));
    ctx.save();ctx.translate(x,y);ctx.scale(side,1);
    ctx.globalAlpha=Math.sin(u*Math.PI)*(.28+q*.35);
    ctx.drawImage(img,0,768,512,256,-s*.5,-s*.16,s*.85,s*.22);ctx.restore();
   }
   ctx.globalAlpha=.35+q*.3;
   ctx.drawImage(img,512,768,512,256,-s*.48+Math.sin(p.time*27)*s*.006,s*.32,s*.94,s*.18);
  }

 }else{
  if(img){const frame=Math.min(11,Math.floor(p.q*12)),width=p.span*1.12,height=width*.5;
   ctx.drawImage(img,(frame%3)*512,Math.floor(frame/3)*256,512,256,s*.34-width*.1,-s*.06-height*.66,width,height);
  }

 }
 ctx.restore();return true;
}
