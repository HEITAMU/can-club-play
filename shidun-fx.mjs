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
  const q=p.q;ctx.globalAlpha=.22+.2*q;ctx.fillStyle='#261c24';ctx.beginPath();ctx.ellipse(0,s*.48,s*(.7+.12*q),s*.17,0,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#e8b35d';ctx.lineWidth=1.5+q*1.8;ctx.globalAlpha=.55+.25*q;
  for(let i=0;i<3;i++){const u=(p.time*(.8+q*.5)+i/3)%1,r=s*(.82-.55*u);ctx.beginPath();ctx.ellipse(0,s*.44,r,r*.28,0,.1,Math.PI*1.9);ctx.stroke();}
  for(let i=0;i<10;i++){const a=i*2.399+p.time*.18,u=(p.time*1.1+i*.137)%1,r=s*(1.1-.75*u),x=Math.cos(a)*r,y=Math.sin(a)*r*.72;ctx.globalAlpha=Math.sin(u*Math.PI)*(.45+q*.45);ctx.lineWidth=1+q;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x*.83,y*.83);ctx.stroke();}
  ctx.globalAlpha=.4+q*.4;const g=ctx.createRadialGradient(-s*.2,0,0,-s*.2,0,s*.3);g.addColorStop(0,'#ffe4a4');g.addColorStop(.35,'#cc8b40aa');g.addColorStop(1,'#cc8b4000');ctx.fillStyle=g;ctx.fillRect(-s*.5,-s*.3,s*.6,s*.6);
 }else{
  if(img){const frame=Math.min(11,Math.floor(p.q*12)),width=p.span*1.12,height=width*.5;
   ctx.drawImage(img,(frame%3)*512,Math.floor(frame/3)*256,512,256,s*.34-width*.1,-s*.06-height*.66,width,height);
  }

 }
 ctx.restore();return true;
}
