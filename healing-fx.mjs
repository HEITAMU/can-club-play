// Healing grows around each recipient. No traveling icon or opaque full-body sheet.
const clamp=x=>Math.max(0,Math.min(1,x));
const envelope=(age,duration,enter=.09,leave=.32)=>Math.min(clamp(age/enter),clamp((duration-age)/leave));
const tau=Math.PI*2;
export const HEAL_ART={'heal-light':-1,'heal-stream':-1,'heal-mote':-1,'heal-cross':-1};
const particle=(art,x,y,width,height,alpha,layer=0,extra={})=>({art,x,y,width,height,alpha:clamp(alpha),angle:0,layer,...extra});

export function healingImpact(p,size,age,duration,seed=1){
 if(age<=0||age>=duration)return [];
 const fade=envelope(age,duration),grow=1-(1-clamp(age/.24))**3,k=clamp(age/duration),out=[];
 out.push(particle('heal-light',p.x,p.y+size*.39,size*(.66+.35*grow),size*.23,fade*.70,0));
 out.push(particle('heal-light',p.x,p.y+size*.06,size*.77,size*1.08,fade*.36,0,{vertical:true}));
 // Two filled, tapered wisps wrap behind and in front of the lower body.
 for(let i=0;i<2;i++)for(const front of [false,true])out.push(particle('heal-stream',p.x,p.y+size*.13,size*.93,size*.54,fade*(front?.63:.42),front?2:0,{phase:age*3.7+i*Math.PI+seed*.11,front}));
 for(let i=0;i<6;i++){
  const delay=i*.075,t=clamp((age-delay)/Math.max(.1,duration-delay)),alpha=envelope(age-delay,duration-delay,.10,.28);
  const side=i%2?1:-1,y=p.y+size*(.36-t*.67),spread=.27+.09*Math.sin(t*3.7+i),x=p.x+side*size*(y<p.y-size*.12?Math.max(.36,spread):spread);
  out.push(particle(i===1||i===4?'heal-cross':'heal-mote',x,y,size*(i===1||i===4?.145:.066)*(1-.25*k),size*(i===1||i===4?.145:.066),alpha*.88,2,{phase:t*3+i}));
 }
 return out.filter(p=>p.alpha>.001);
}

export function healingCast(p,size,age,duration,release=false){
 if(age<=0||age>=duration)return [];
 const k=clamp(age/duration),fade=envelope(age,duration,.06,.06),out=[];
 // The light gathers by the raised cup and hand, then opens at the caster's feet.
 out.push(particle('heal-light',p.x+size*.17,p.y-size*.02,size*(.24+.15*k),size*(.24+.15*k),fade*.78,2));
 out.push(particle('heal-light',p.x,p.y+size*.39,size*(.65+k*(release?.45:.15)),size*.24,fade*.52,0));
 for(let i=0;i<4;i++){
  const a=i*tau/4+k*1.2,dist=size*(release?.12+k*.24:.42*(1-k)+.06);
  out.push(particle('heal-mote',p.x+size*.17+Math.cos(a)*dist,p.y-size*.02+Math.sin(a)*dist*.65,size*.065,size*.065,fade*.85,2));
 }
 return out;
}

function glow(ctx,p){
 ctx.scale(p.width/2,p.height/2);
 const g=ctx.createRadialGradient(0,0,.02,0,0,1);
 g.addColorStop(0,p.vertical?'#fff2bd55':'#fff3becb');
 g.addColorStop(.35,p.vertical?'#b6efb663':'#b5e7a9af');
 g.addColorStop(.70,'#67ccae50');g.addColorStop(1,'#55c3a000');
 ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,1,0,tau);ctx.fill();
}

function stream(ctx,p){
 const segments=34,points=[];
 for(let j=0;j<=segments;j++){
  const t=j/segments,a=p.phase+t*tau*.88;
  points.push({x:Math.cos(a)*p.width*(.43-.09*t),y:p.height*(.52-t),front:Math.sin(a)>0,t});
 }
 const gradient=ctx.createLinearGradient(-p.width*.5,0,p.width*.5,0);
 gradient.addColorStop(0,'#62c8a1');gradient.addColorStop(.4,'#d0edb6');gradient.addColorStop(.62,'#fff1ba');gradient.addColorStop(1,'#7ed6ad');
 ctx.fillStyle=gradient;
 // Short connected trapezoids make a broad flowing brush stroke, not a line.
 for(let j=0;j<segments;j++){
  const a=points[j],b=points[j+1];if(a.front!==p.front)continue;
  const dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy)||1,nx=-dy/len,ny=dx/len;
  const thickness=t=>p.width*.045*Math.sin(Math.PI*t)**.75*(.85+.15*Math.sin(t*29+p.phase));
  const aw=thickness(a.t),bw=thickness(b.t);
  ctx.beginPath();ctx.moveTo(a.x+nx*aw,a.y+ny*aw);ctx.lineTo(b.x+nx*bw,b.y+ny*bw);ctx.lineTo(b.x-nx*bw,b.y-ny*bw);ctx.lineTo(a.x-nx*aw,a.y-ny*aw);ctx.closePath();ctx.fill();
 }
}

export function paintHealing(ctx,p){
 if(!(p.art in HEAL_ART))return false;
 ctx.save();ctx.globalAlpha=p.alpha;ctx.translate(p.x,p.y);
 if(p.art==='heal-light')glow(ctx,p);
 else if(p.art==='heal-stream')stream(ctx,p);
 else{
  const halo=ctx.createRadialGradient(0,0,0,0,0,p.width*.8);
  halo.addColorStop(0,'#e7f5bdbb');halo.addColorStop(1,'#78d9ad00');ctx.fillStyle=halo;ctx.beginPath();ctx.arc(0,0,p.width*.8,0,tau);ctx.fill();
  ctx.rotate(Math.sin(p.phase||0)*.09);ctx.fillStyle='#f7f3c8';
  if(p.art==='heal-cross'){
   const r=p.width*.42,n=p.width*.13;ctx.beginPath();ctx.moveTo(-n,-r);ctx.lineTo(n,-r);ctx.lineTo(n,-n);ctx.lineTo(r,-n);ctx.lineTo(r,n);ctx.lineTo(n,n);ctx.lineTo(n,r);ctx.lineTo(-n,r);ctx.lineTo(-n,n);ctx.lineTo(-r,n);ctx.lineTo(-r,-n);ctx.lineTo(-n,-n);ctx.closePath();ctx.fill();
  }else{ctx.beginPath();ctx.ellipse(0,0,p.width*.19,p.height*.31,0,0,tau);ctx.fill();}
 }
 ctx.restore();return true;
}
