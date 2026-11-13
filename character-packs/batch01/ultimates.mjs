import {clamp,ease,sampleAction} from './motion.mjs';
import {fxStamp,paintTrail,paintTextureFlame,muzzleFor} from './render.mjs';
export const ULTIMATES=new Set(['guard','volley','healTeam','flare','freeze','break','shieldPunch','constellation','multicut','inkBurst']);
export const ENEMY_POINTS=[[665,315],[680,465],[820,240],[835,365],[850,490]];
export const ALLY_POINTS=[[170,420],[300,300],[320,455],[435,255],[455,420]];
const TAU=Math.PI*2,fract=n=>n-Math.floor(n),rand=i=>fract(Math.sin(i*123.41+71.7)*43758.5453);
function ellipse(ctx,x,y,rx,ry,color,alpha=1){ctx.save();ctx.globalAlpha*=alpha;ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,TAU);ctx.fill();ctx.restore();}
function poly(ctx,pts,fill,stroke,width=2){ctx.beginPath();ctx.moveTo(...pts[0]);for(const p of pts.slice(1))ctx.lineTo(...p);ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke();}}
function star(ctx,x,y,r,color,alpha=1){ctx.save();ctx.globalAlpha*=alpha;const pts=[];for(let i=0;i<8;i++){const a=i*TAU/8-Math.PI/2,s=i%2?r*.24:r;pts.push([x+Math.cos(a)*s,y+Math.sin(a)*s]);}poly(ctx,pts,color);ctx.restore();}
function glow(ctx,x,y,rx,ry,color,alpha=.3){ctx.save();ctx.translate(x,y);ctx.scale(rx,ry);const g=ctx.createRadialGradient(0,0,0,0,0,1);g.addColorStop(0,color);g.addColorStop(1,'transparent');ctx.globalAlpha*=alpha;ctx.fillStyle=g;ctx.fillRect(-1,-1,2,2);ctx.restore();}
function ray(ctx,x1,y1,x2,y2,width,color,alpha=1){paintTrail(ctx,[[x1,y1],[x2,y2]],color,width,alpha);}
function frost(ctx,x,y,h,w,alpha){ctx.save();ctx.globalAlpha*=alpha;poly(ctx,[[x,y-h],[x-w*.55,y-h*.55],[x-w*.42,y],[x+w*.35,y],[x+w*.52,y-h*.52]],'#76b8cb','#c8f4e7',2);poly(ctx,[[x,y-h],[x-w*.1,y-h*.48],[x+w*.35,y],[x+w*.52,y-h*.52]],'#b3e4df');ray(ctx,x,y-h,x-w*.1,y-h*.48,2,'#f1f8d9',.85);ctx.restore();}
function shield(ctx,x,y,w,h,alpha){ctx.save();ctx.globalAlpha*=alpha;poly(ctx,[[x-w/2,y-h*.40],[x,y-h*.58],[x+w/2,y-h*.40],[x+w*.45,y+h*.20],[x,y+h*.50],[x-w*.45,y+h*.20]],'#8b765234','#f8ce82',3);ctx.restore();}
function gear(ctx,x,y,r,angle,alpha){ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.globalAlpha*=alpha;const pts=[];for(let i=0;i<48;i++){const a=i*TAU/48,rr=r*(i%4<2?1:.84);pts.push([Math.cos(a)*rr,Math.sin(a)*rr]);}poly(ctx,pts,null,'#efc58a',4);ctx.strokeStyle='#b2d0b3';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,r*.55,0,TAU);ctx.stroke();ctx.restore();}
export function ultimateEnvelope(a,time){const pre=clamp((time-a.release+.38)/.38),age=time-a.hit;return{pre,age,alpha:age<0?pre:1-ease((age-.42)/1.05)};}
export function paintUltimateGround(ctx,atlas,images,a,t){
 if(!ULTIMATES.has(a.kind))return;
 const {age,pre,alpha}=ultimateEnvelope(a,t);if(t<a.release-.38||alpha<=0)return;
 const support=['guard','healTeam','constellation'].includes(a.kind),x=support?315:755;
 const colors={guard:'#e8b96d',healTeam:'#9be2bd',constellation:'#b6a1e2',flare:'#f58d45',freeze:'#9de2e2',break:'#cfbc7e',volley:'#b9c68e',multicut:'#de9673',inkBurst:'#bcc8d1',shieldPunch:'#f0bb64'};
 glow(ctx,x,405,support?285:280,95,colors[a.kind],.24*alpha*pre);
 if(a.kind==='flare'){ellipse(ctx,758,423,228*pre,65,'#d46536',.22*alpha);for(let i=0;i<4;i++)ellipse(ctx,600+i*90,410+i%2*30,65,30,'#f5bc6b',.08*alpha);}
 if(a.kind==='freeze'){ellipse(ctx,755,423,231*pre,69,'#9acfd0',.24*alpha);for(let i=0;i<11;i++){const x0=550+i*35;ray(ctx,x0,460,x0+70,365,1.6,'#c9f3e9',.35*alpha);}}
 if(a.kind==='inkBurst'){for(let i=0;i<8;i++)ellipse(ctx,555+i*53,415+(i%3)*20,63+rand(i)*22,35,'#162c34',.5*alpha);}
}
// One authored identity per ultimate. Timing grows from caster gesture into field-scale effects.
export function paintUltimate(ctx,atlas,images,a,t){
 if(!ULTIMATES.has(a.kind)||a.kind==='shieldPunch')return false;
 const art=atlas.characters[a.id],{age,pre,alpha}=ultimateEnvelope(a,t);if(t<a.release-.38||alpha<=0)return true;
 const p=sampleAction(a,a.release),origin=muzzleFor(atlas,a.id,p,p.x,p.y,a.size),stamp=(key,x,y,w,angle=0,opacity=1,stretch=1)=>fxStamp(ctx,art,images,key,x,y,w,angle,opacity,stretch);
 // Small inward anticipation stays with the casting hand, never a detached flying character.
 if(age<0){for(let i=0;i<7;i++){const q=fract(t*1.5+i/7),an=i*2.399;star(ctx,origin.x+Math.cos(an)*(1-q)*70,origin.y+Math.sin(an)*(1-q)*65,2+q*3,'#efdcaa',q*.65);}glow(ctx,origin.x,origin.y,65*pre,65*pre,'#e8c993',.18*pre);}
 if(a.kind==='guard'){
  const q=ease((t-a.release)/.40);for(let i=0;i<5;i++){const [x,y]=ALLY_POINTS[i],st=clamp((age+.30-i*.045)/.30);shield(ctx,x,y-90,125*st,205*st,.85*alpha);stamp('seed',x,y-110,60*st,0,.65*alpha);}
  ctx.save();ctx.globalAlpha=.75*alpha*q;ctx.strokeStyle='#f3d291';ctx.lineWidth=6;ctx.beginPath();ctx.ellipse(310,390,270,205,Math.PI,0,Math.PI);ctx.stroke();ctx.restore();
  for(let i=0;i<19;i++)star(ctx,80+i*25,425-fract(age*.7+i*.19)*210,3,'#f4d69c',.5*alpha);
 }else if(a.kind==='healTeam'){
  for(let i=0;i<5;i++){const [x,y]=ALLY_POINTS[i],q=clamp((t-a.release-i*.045)/.42),pts=[];for(let k=0;k<18;k++){const u=q*k/17;pts.push([origin.x+(x-origin.x)*u,origin.y+(y-110-origin.y)*u-Math.sin(u*Math.PI)*145]);}paintTrail(ctx,pts,'#e1ecd2',10,.55*alpha);stamp('state',x,y-75,115*(.75+.25*ease((age+.12)/.3)),0,.6*alpha);for(let j=0;j<6;j++){const z=fract(age*.7+j*.16+i*.07),xx=x+Math.sin(j*2.3+i)*60,yy=y-25-z*245;ellipse(ctx,xx,yy,8+j%3*2,9+j%3*2,'#e6eed2',Math.sin(z*Math.PI)*.42*alpha);stamp('impact',xx,yy-20,23,0,Math.sin(z*Math.PI)*alpha);}}
  glow(ctx,310,280,260,200,'#aeeac9',.13*alpha);
 }else if(a.kind==='constellation'){
  const stars=[[150,155],[280,85],[440,125],[500,240],[325,270]],q=ease((t-a.release)/.45);for(let i=0;i<stars.length;i++){const v=stars[i],n=stars[(i+2)%5];ray(ctx,v[0],v[1],v[0]+(n[0]-v[0])*q,v[1]+(n[1]-v[1])*q,3,'#c4b6ea',alpha*.75);star(ctx,...v,17+Math.sin(t*5+i)*3,'#eee6b9',alpha);stamp('seed',...v,60,0,.50*alpha);const to=ALLY_POINTS[i];ray(ctx,v[0],v[1]+15,to[0],to[1]-55,7,'#b7d6db',.18*alpha*q);for(let j=0;j<3;j++){const r=fract((t-a.release)*.7+j/3);star(ctx,v[0]+(to[0]-v[0])*r,v[1]+(to[1]-65-v[1])*r,6,'#c5ebe0',alpha);}}
  glow(ctx,320,165,250,160,'#b4a0de',.2*alpha);
 }else if(a.kind==='flare'){
  const q=clamp((t-a.release)/(a.hit-a.release));if(age<.15){const xx=origin.x+(730-origin.x)*q;paintTextureFlame(ctx,art,images,'release',xx,410,120+q*240,130+q*170,t,Math.min(1,pre));}
  if(age>=0){for(let i=0;i<7;i++){const u=clamp((age-i*.025)/.17),x=560+i*61,y=405+(i%3)*25;paintTextureFlame(ctx,art,images,'release',x,y,104+rand(i)*20,(155+rand(i+4)*100)*ease(u),t+i,.9*alpha);}
   for(let i=0;i<36;i++){const q=fract(age*.7+i*.153),x=550+rand(i)*370+Math.sin(q*6+i)*22,y=470-q*(250+rand(i+8)*90);star(ctx,x,y,3+rand(i+2)*4,'#ffdda0',Math.sin(q*Math.PI)*alpha);}}
 }else if(a.kind==='freeze'){
  if(age>=-.3){const q=clamp((age+.3)/.5);for(let i=0;i<9;i++){const u=ease((q-i*.045)/.6);frost(ctx,560+i*43,440+(i%3)*15,(160+rand(i+2)*130)*u,48+rand(i+3)*26,.52*alpha);stamp('release',560+i*43,360+(i%3)*15,75*u,0,.5*alpha,1.5);}
   for(let i=0;i<30;i++){const z=fract((age+.3)*.45+i*.13);star(ctx,535+rand(i)*385,110+z*355,3+rand(i+4)*5,'#e7fff0',.8*alpha);}
   for(let i=0;i<5;i++){const [x,y]=ENEMY_POINTS[i];stamp('impact',x,y-90,110,age*.2,.8*alpha);}}
 }else if(a.kind==='volley'){
  for(let wave=0;wave<3;wave++)for(let j=0;j<4;j++){const start=a.release+wave*.16+j*.018,q=(t-start)/.42;if(q<0||q>1.5)continue;const tx=a.target.x+(j-1.5)*15,ty=a.target.y-120+(j-1.5)*27;if(q<=1){const pts=[];for(let k=0;k<8;k++){const u=Math.max(0,q-k*.035);pts.unshift([origin.x+(tx-origin.x)*u,origin.y+(ty-origin.y)*u-Math.sin(u*Math.PI)*(80+wave*35)]);}paintTrail(ctx,pts,'#d5dba5',6,.6);const v=pts.at(-1),pr=pts.at(-2);stamp('seed',...v,67,Math.atan2(v[1]-pr[1],v[0]-pr[0]));}else stamp('impact',tx,ty,78,0,(1-(q-1)/.5)*.7);}
  if(age>=0)stamp('state',a.target.x,a.target.y-110,180,0,.65*alpha);
 }else if(a.kind==='break'){
  const x=a.target.x,y=a.target.y-110;if(age>=-.15){const q=ease((age+.15)/.25);gear(ctx,x,y,130*q,-t*.3,.9*alpha);gear(ctx,x,y,85*q,t*.6,.7*alpha);stamp('impact',x,y,250*q,0,alpha*.9);for(let i=0;i<14;i++){const an=i*2.399,dd=(25+rand(i)*130)*ease((age+.15)/.6),xx=x+Math.cos(an)*dd,yy=y+Math.sin(an)*dd;poly(ctx,[[xx-4,yy-6],[xx+7,yy-2],[xx+3,yy+9],[xx-6,yy+2]],`rgba(222,188,127,${alpha*.8})`);}}
 }else if(a.kind==='multicut'){
  const x=a.target.x,y=a.target.y-105;for(let i=0;i<3;i++){const z=age-i*.17;if(z<0||z>.48)continue;const q=ease(z/.11),ang=i%2?-.85:.65,dx=Math.cos(ang)*155,dy=Math.sin(ang)*190;const pts=[[x-dx,y-dy],[x-dx+dx*2*q,y-dy+dy*2*q]];paintTrail(ctx,pts,'#f2d4b3',8,(1-z/.48)*.9);stamp('release',x,y,330,ang,(1-z/.48)*.9,.6);stamp('impact',x,y,100,ang,1-z/.48);}stamp('seed',x,y-160,62,0,.8*alpha);
 }else if(a.kind==='inkBurst'){
  if(age>=0){for(let i=0;i<5;i++){const [x,y]=ENEMY_POINTS[i],q=ease((age-i*.035)/.22);stamp('release',x,y-80,210*q,0,alpha*.85,1.15);stamp('seed',x,y-100,150*q,0,alpha*.8);}
   for(let i=0;i<24;i++){const q=clamp(age/1.3),x=570+rand(i)*300+(rand(i+4)-.5)*150*q,y=420-Math.sin(q*Math.PI)*(100+rand(i+8)*240)+q*q*55;ellipse(ctx,x,y,4+rand(i+3)*8,6+rand(i+2)*12,'#bbc9cb',alpha*.65);}}
 }
 return true;
}
// Xuanyue's broad straight pressure front covers the entire enemy half (x 520..950).
// No crescent projectile: a growing fan, contact facets, ground fractures and recoil.
export function paintShieldPunch(ctx,atlas,images,d,now,origin,back=false){
 const art=atlas.characters.pudding,s=d.s,stamp=(key,x,y,w,angle=0,alpha=1,stretch=1)=>fxStamp(ctx,art,images,key,x,y,w,angle,alpha,stretch);
 const start=[...d.events].reverse().find(e=>e.type==='punchStart'),hit=[...d.events].reverse().find(e=>e.type==='punchHit');
 const age=hit?now-hit.at:-Infinity;
 if(back&&s.shield>0){glow(ctx,255,420,135,40,'#e7bc79',.20);shield(ctx,255,320,175,235,.24);}
 if(!back&&(s.state==='charging'||s.state==='primed')){
  const q=clamp((now-s.firstAt)/s.config.minCharge),power=s.shield/(s.maxHp*s.config.shieldCapRatio);glow(ctx,origin.x,origin.y,80+power*30,65,'#ffcb72',.42*q);
  for(let i=0;i<14;i++){const u=fract(now*.9+i/14),ang=i*2.399,r=(1-u)*(90+power*55);star(ctx,origin.x+Math.cos(ang)*r,origin.y+Math.sin(ang)*r,3+u*3,'#f8d393',u*.8*q);}
  stamp('state',origin.x,origin.y,85+q*25,Math.sin(now*.8)*.10,.85*q);
 }
 if(!back){const e=[...d.events].reverse().find(e=>e.type==='selfShield');if(e){const q=(now-e.at)/.35;if(q>=0&&q<1){shield(ctx,255,310,175+q*60,245+q*60,(1-q)*.85);stamp('seed',255,300,112,0,(1-q)*.8);}}}
 if(!start)return;const a=now-start.at;if(a<0||a>1.5)return;
 const q=ease((a-.12)/(s.config.punchTravel-.12)),fade=1-ease((a-.34)/1.10),beamFade=1-ease((a-.26)/.38),tip=origin.x+(948-origin.x)*q;
 if(back){glow(ctx,750,380,285,150,'#f2b557',.48*fade);for(let i=0;i<7;i++){const yy=290+i*32,xx=560+i%2*35;paintTrail(ctx,[[origin.x,432],[xx,yy],[xx+45,yy+13],[xx+95,yy-7],[920,yy+20]],'#e2ba72',3,fade*.48*q);}return;}
 if(q<=0)return;
 ctx.save();ctx.globalAlpha=.62*beamFade;
 const g=ctx.createLinearGradient(origin.x,0,948,0);g.addColorStop(0,'#ffe5a7');g.addColorStop(.28,'#f5c56d');g.addColorStop(1,'#d99a3d22');
 poly(ctx,[[origin.x-12,origin.y-15],[tip,origin.y-(origin.y-90)*q],[tip,origin.y+(505-origin.y)*q],[origin.x-12,origin.y+18]],g);
 ctx.restore();
 for(let i=0;i<13;i++){const yy=105+i*31,dx=70+rand(i)*55;paintTrail(ctx,[[origin.x+20,origin.y+(i-6)*2],[Math.max(origin.x+30,tip-dx),origin.y+(yy-origin.y)*q],[tip,origin.y+(yy-origin.y)*q]],i%3?'#f6ce8a':'#fff0ba',i%3?2.4:5,beamFade*(i%3?.6:.8));}
 if(age>=0){for(let i=0;i<5;i++){const [x,y]=ENEMY_POINTS[i];stamp('impact',x,y-95,155+clamp(age/.2)*35+i*3,i*.28,fade*.88);}
  for(let i=0;i<27;i++){const u=clamp(age/.95),x=540+rand(i)*360+(rand(i+5)-.15)*u*160,y=390-Math.sin(u*Math.PI)*(80+rand(i+4)*220)+u*u*100,rr=7+rand(i+2)*12;ctx.save();ctx.translate(x,y);ctx.rotate(i+u*3);ctx.globalAlpha=fade*.8;poly(ctx,[[0,-rr],[rr*.65,0],[0,rr*.55],[-rr*.5,0]],i%2?'#eac78a':'#a98e63','#f5d69e',1);ctx.restore();}
  if(age<.12){ctx.save();ctx.globalAlpha=(1-age/.12)*.26;ctx.fillStyle='#fff0bd';poly(ctx,[[origin.x,origin.y],[948,90],[948,505]],'#fff0bd');ctx.restore();}
 }
}
