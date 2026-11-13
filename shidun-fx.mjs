const clamp=x=>Math.max(0,Math.min(1,x));
export function sampleShidun(actor,time,p,size,w,h){
 if(actor.catId!=='pudding'||actor.hp<=0)return[];
 const sp=actor.shieldPunch,out=[],base={art:'shidun',x:p.x,y:p.y,width:size,height:size,angle:0,alpha:1,layer:2};
 if(sp&&['charging','primed'].includes(sp.state))out.push({...base,stage:'charge',q:clamp((time-sp.firstAt)/sp.config.minCharge),time,layer:0});
 const since=time-(actor.shidunImpactAt??-99);
 if(since>=0&&since<.72)out.push({...base,stage:'impact',q:since/.72,time,span:Math.max(size*2.7,w-p.x),spread:Math.min(h*.5,size*3.4)});
 return out;
}
export function paintShidun(ctx,p){
 if(p.art!=='shidun')return false;
 ctx.save();ctx.translate(p.x,p.y);const s=p.width;
 if(p.stage==='charge'){
  const q=p.q;ctx.globalAlpha=.22+.2*q;ctx.fillStyle='#261c24';ctx.beginPath();ctx.ellipse(0,s*.48,s*(.7+.12*q),s*.17,0,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#e8b35d';ctx.lineWidth=1.5+q*1.8;ctx.globalAlpha=.55+.25*q;
  for(let i=0;i<3;i++){const u=(p.time*(.8+q*.5)+i/3)%1,r=s*(.82-.55*u);ctx.beginPath();ctx.ellipse(0,s*.44,r,r*.28,0,.1,Math.PI*1.9);ctx.stroke();}
  for(let i=0;i<10;i++){const a=i*2.399+p.time*.18,u=(p.time*1.1+i*.137)%1,r=s*(1.1-.75*u),x=Math.cos(a)*r,y=Math.sin(a)*r*.72;ctx.globalAlpha=Math.sin(u*Math.PI)*(.45+q*.45);ctx.lineWidth=1+q;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x*.83,y*.83);ctx.stroke();}
  ctx.globalAlpha=.4+q*.4;const g=ctx.createRadialGradient(-s*.2,0,0,-s*.2,0,s*.3);g.addColorStop(0,'#ffe4a4');g.addColorStop(.35,'#cc8b40aa');g.addColorStop(1,'#cc8b4000');ctx.fillStyle=g;ctx.fillRect(-s*.5,-s*.3,s*.6,s*.6);
 }else{
  const q=p.q,fade=(1-q)**1.4,reach=p.span*Math.min(1,q*4),spread=p.spread*(.15+.85*Math.min(1,q*3));ctx.globalAlpha=fade;
  const g=ctx.createLinearGradient(0,0,Math.max(1,reach),0);g.addColorStop(0,'#fff3c6');g.addColorStop(.25,'#f2bb65e8');g.addColorStop(.8,'#d58a3977');g.addColorStop(1,'#bc6b2000');ctx.fillStyle=g;
  ctx.beginPath();ctx.moveTo(s*.12,-s*.1);ctx.bezierCurveTo(reach*.32,-spread*.03,reach*.52,-spread*.56,reach*.83,-spread*.45);ctx.bezierCurveTo(reach*1.04,-spread*.38,reach*1.06,spread*.38,reach*.82,spread*.45);ctx.bezierCurveTo(reach*.5,spread*.5,reach*.3,spread*.05,s*.12,s*.1);ctx.closePath();ctx.fill();
  for(let i=0;i<4;i++){const cx=reach*(.43+i*.15),cy=Math.sin(i*2.6)*spread*.13;ctx.globalAlpha=fade*(.12+i*.035);ctx.fillStyle=i%2?'#fff0bb':'#eda952';ctx.beginPath();ctx.ellipse(cx,cy,s*(.28+i*.11),spread*(.15+i*.045),-.12+i*.08,0,Math.PI*2);ctx.fill();}ctx.globalAlpha=fade;
  ctx.strokeStyle='#ffe7ae';ctx.lineWidth=s*.06*fade+1;
  for(let i=0;i<3;i++){const x=reach*(.72+i*.12);ctx.beginPath();ctx.ellipse(x,0,s*(.13+i*.035),spread*(.38+i*.06),0,-Math.PI*.6,Math.PI*.6);ctx.stroke();}
  for(let i=0;i<12;i++){const y=Math.sin(i*2.3)*spread*.48,x=reach*(.22+(i%5)*.14);ctx.globalAlpha=fade*(.4+(i%3)*.2);ctx.lineWidth=1+i%3;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+s*(.2+.08*(i%4)),y*.93);ctx.stroke();}
 }
 ctx.restore();return true;
}
