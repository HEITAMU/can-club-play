import {projectilePose,unit} from './motion.mjs?v=0.21.3';
import {ACTION_BY_ID} from './action-profiles.mjs?v=0.21.3';
import {HEAL_ART,healingImpact,healingCast} from './healing-fx.mjs?v=0.21.3';
import {CAN_ART,sampleCan} from './can-fx.mjs?v=0.21.3';

// All samples depend on simulation time, never frame count or Math.random().
export const FX_CELLS={flash:1,dust:2,ember:3,fire:4,flame:5,ice:6,shard:7,heal:8,heart:9,milk:10,fish:11,shield:12,glass:13,star:14,electric:15,...HEAL_ART,...CAN_ART};
export const effectEnvelope=(age,duration,fadeIn=.035,fadeOut=.22)=>Math.min(unit(age/fadeIn),unit((duration-age)/fadeOut));
export const impactStyle=r=>r.style==='shield'?(r.tone==='support'?'guard':'block'):r.style==='heal'?'heal':r.style==='star'&&r.tone==='energy'?'energy':ACTION_BY_ID[r.profile]?.impact||(['arrow','fish','milk'].includes(r.style)?'burst':r.style);
export const shieldTransition=(previous,next)=>next>previous?'raise':next<previous?(next<=0?'break':'block'):'steady';
const tau=Math.PI*2,rand=n=>{const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v);};
const point=(p,w,h)=>({x:p.x*w/100,y:p.y*h/100});
function sprite(out,art,x,y,size,alpha=1,angle=0,sx=1,sy=1,layer=1){
 if(alpha<=.001||size<=0)return;
 const p={art,x,y,width:size*sx,height:size*sy,alpha:unit(alpha),angle,layer};out.push(p);return p;
}
function scatter(out,art,x,y,size,age,duration,seed,count=7,{gravity=0,rise=0,spread=1,scale=.22,alpha=1}={}){
 const k=unit(age/duration),fade=effectEnvelope(age,duration,.018,duration*.55);
 for(let i=0;i<count;i++){
  const q=rand(seed+i*3.17),a=q*tau,r=size*(.28+rand(seed+i+43)*.65)*spread*(1-(1-k)**2);
  sprite(out,art,x+Math.cos(a)*r,y+Math.sin(a)*r*.72+gravity*k*k*size-rise*k*size,size*scale*(.65+rand(seed+i+7)*.7)*(1-.55*k),fade*alpha,a+k*(q-.5)*5,1,1,2);
 }
}

export function sampleProjectile(route,targetId,time,w,h,centers,sizes,shot=0,count=1){
 const origin=route.positions?.[route.from]||centers[route.from],to=centers[targetId]||route.positions?.[targetId];
 if(!origin||!to)return null;
 const recorded=route.positions?.[targetId]||to,dir=recorded.x>=origin.x?1:-1;
 const spark=route.profile==='spark-normal'||route.profile==='spark-skill',size=sizes[route.from]||50;
 const from={x:origin.x+dir*size*(spark?.31:.23)/w*100,y:origin.y-(spark?size*.09/h*100:1)};
 return projectilePose(from,to,w,h,time-route.born,route.travel||.29,route.style,shot,count);
}

export function sampleImpact(style,p,size,age,duration,seed=1,direction=1,skill=false){
 const out=[],k=unit(age/duration),fade=effectEnvelope(age,duration),x=p.x,y=p.y;
 if(age<0||age>=duration)return out;
 if(style==='heal')return healingImpact(p,size,age,duration,seed);
 if(['energy','guard'].includes(style)){
  const col=style==='energy'?'star':style==='guard'?'shield':'heal',grow=1-(1-k)**3;
  // Open-center ribbons stay below the face; motes travel independently.
  const ring=sprite(out,col,x,y+size*.24,size*(.65+grow*.55),fade*(style==='guard'?.48:.7),style==='heal'?-k*.7:0,1,style==='guard'?.80:.48,0);
  if(ring&&style==='heal')ring.deform={axis:'x',phase:age*9,amplitude:.06};
  if(style==='heal'||style==='energy')for(let i=0;i<6;i++){
   const t=unit((age-i*.035)/(duration-i*.035)),a=i*1.9+t*4.8;
   sprite(out,style==='heal'?'milk':'star',x+Math.cos(a)*size*(.34-.12*t),y+size*(.35-t*.85),size*.12,effectEnvelope(age-i*.035,duration-i*.035,.07,.25)*.8,-a*.7,1,1,Math.sin(a)<0?0:2);
  }
  for(let i=0;i<4;i++){
   const t=unit((age-i*.065)/(duration-i*.065)),f=effectEnvelope(age-i*.065,duration-i*.065,.08,.30);
   const side=i%2?1:-1;
   sprite(out,style==='heal'?'heart':'star',x+side*size*(.25+Math.sin(t*Math.PI+i)*.12),y+size*(.28-t*.88),size*(.17+Math.sin(t*Math.PI)*.07),f*.85,Math.sin(t*4+i)*.16,1,1,2);
  }
  return out;
 }
 if(['melee','shield-bash','wrench-hit','armor-break','shield-thump','ground-smash'].includes(style)){
  // Short, textured contact marks grow across the hit point. No flying blade,
  // circular slash silhouette or full-size crescent covers the characters.
  const wrench=style==='wrench-hit'||style==='armor-break',slam=style==='shield-thump'||style==='ground-smash',heavy=style==='armor-break'||style==='ground-smash';
  const t=unit(age/.20),pop=Math.sin(t*Math.PI),contact=effectEnvelope(age,heavy?.28:.22,.014,.14);
  sprite(out,'flash',x-direction*size*.12*(1-t),y+size*(slam?.12:0),size*(.30+.26*pop)*(heavy?1.15:1),contact,wrench?direction*.65:0,wrench?1.4:1.1,slam?.55:.75,2);
  if(wrench)sprite(out,'flash',x+direction*size*.07,y-size*.04,size*(.18+.37*pop),effectEnvelope(age-.022,.22,.025,.13)*.72,-direction*.62,1.3,.32,2);
  scatter(out,style==='armor-break'?'glass':'ember',x,y,size,age,heavy?.55:.34,seed,heavy?7:style==='shield-bash'?6:4,{gravity:.30,spread:heavy?.75:.46,scale:style==='armor-break'?.19:.10});
  if(slam){
   const count=heavy?7:3,dustTime=heavy?.60:.38,u=unit(age/dustTime);
   for(let i=0;i<count;i++){const a=i*tau/count,spread=size*(.12+.57*(1-(1-u)**2));sprite(out,'dust',x+Math.cos(a)*spread,y+size*.34+Math.sin(a)*spread*.23,size*(.16+.30*u),effectEnvelope(age,dustTime,.04,.29)*.63,Math.sin(a)*.24,1,.65,0);}
  }else sprite(out,'dust',x,y+size*.34,size*(.25+unit(age/.42)*.4),effectEnvelope(age,.42,.035,.25)*.36,0,1,.35,0);
 }else if(style==='pierce'||style==='pierce-volley'){
  const count=style==='pierce-volley'?3:1;
  for(let i=0;i<count;i++){const delay=i*.027,offset=(i-(count-1)/2)*size*.15;
   sprite(out,'flash',x+direction*offset,y-offset*.75,size*(count>1?.38:.32),effectEnvelope(age-delay,.24,.012,.16),direction*-.25,1.5,.40,2);
  }
  scatter(out,'ember',x,y,size,age,.38,seed,count*2+1,{spread:.48,scale:.09});
 }else if(style==='splash'){
  const t=unit(age/.32);sprite(out,'milk',x,y,size*(.32+.24*t),effectEnvelope(age,.30,.025,.19),-.7,1,.72,1);
  scatter(out,'milk',x,y,size,age,.45,seed,6,{gravity:.55,spread:.60,scale:.15});
 }else if(style==='fire-hit'){
  const t=unit(age/.38),flame=sprite(out,'flame',x,y-size*t*.12,size*(.35+.17*Math.sin(t*Math.PI)),effectEnvelope(age,.38,.025,.24),direction*.15,1,.9,1);
  if(flame)flame.deform={axis:'y',phase:age*17,amplitude:.15};
  scatter(out,'ember',x,y,size,age,.38,seed,4,{rise:.35,scale:.10,spread:.5});
 }else if(style==='ice-hit'){
  sprite(out,'shard',x,y,size*.42,effectEnvelope(age,.28,.018,.18),-.3,1,.9,1);
  scatter(out,'ice',x,y,size,age,.36,seed,4,{gravity:.25,spread:.55,scale:.20});
 }else if(style==='star-hit'){
  sprite(out,'star',x,y,size*(.30+.20*Math.sin(unit(age/.34)*Math.PI)),effectEnvelope(age,.34,.018,.23),age*2.5,1,1,1);
  scatter(out,'star',x,y,size,age,.42,seed,3,{rise:.14,spread:.53,scale:.16});
 }else if(style==='ranged'){
  sprite(out,'flash',x,y,size*.32,effectEnvelope(age,.21,.012,.14),0,1,.78,2);
  scatter(out,'ember',x,y,size,age,.30,seed,4,{spread:.45,scale:.09});
 }else if(style==='fire'){
  sprite(out,'flash',x,y,size*.60,effectEnvelope(age,.20,.012,.16),0,1,.8,2);
  for(let i=0;i<3;i++){
   const delay=i*.035,t=unit((age-delay)/(duration-delay));
   const flame=sprite(out,'flame',x+(i-1)*size*.19,y+size*(.16-t*.30),size*(.52+Math.sin(t*Math.PI)*.38),effectEnvelope(age-delay,duration-delay,.04,.34)*.88,(i-1)*.22,1,.9+Math.sin(age*18+i)*.06,1);
   if(flame)flame.deform={axis:'y',phase:age*17+i*2,amplitude:.13};
  }
  scatter(out,'ember',x,y,size,age,duration,seed,8,{rise:.6,scale:.13});
  sprite(out,'dust',x,y-size*k*.35,size*(.25+k*.60),fade*k*.35,0,1,1,0);
 }else if(style==='ice'){
  sprite(out,'shard',x,y,size*(.55+.4*Math.sin(k*Math.PI)),fade*.75,-.2+k*.3,1,1,1);
  sprite(out,'flash',x,y,size*.45,effectEnvelope(age,.18,.01,.14),0,1,1,2);
  scatter(out,'ice',x,y,size,age,duration,seed,7,{gravity:.25,spread:.95,scale:.30});
 }else if(style==='break'){
  scatter(out,'glass',x,y,size,age,duration,seed,8,{gravity:.55,spread:1.05,scale:.38,alpha:.9});
 }else if(style==='block'){
  sprite(out,'shield',x,y,size*(.9+k*.16),fade*.7,0,1,.95,1);
  sprite(out,'flash',x+direction*size*.28,y,size*.42,effectEnvelope(age,.20,.012,.15),0,1,.8,2);
  scatter(out,'ember',x+direction*size*.25,y,size,age,duration,seed,5,{scale:.10,spread:.55});
 }else if(style==='electric'){
  for(let i=0;i<3;i++)sprite(out,'electric',x,y,size*(.65+i*.09),fade*(i? .52:.9),Math.floor(age*18)*.47+i*2.1,1,.8,1);
  scatter(out,'ember',x,y,size,age,duration,seed,6,{scale:.12});
 }else if(style==='star'){
  sprite(out,'star',x,y,size*(.55+.25*Math.sin(k*Math.PI)),fade,-.4+k*1.2,1,1,1);
  scatter(out,'star',x,y,size,age,duration,seed,6,{rise:.3,scale:.22});
 }else if(style==='rescue'){
  sprite(out,'heal',x,y,size*(.6+k*1.8),fade*.62,-k*.5,1,.34,0);
  scatter(out,'star',x,y,size,age,duration,seed,10,{rise:.25,scale:.16,spread:1.5});
 }else if(style==='dust'){
  for(let i=0;i<3;i++)sprite(out,'dust',x+(i-1)*size*k*.3,y-k*size*.07,size*(.3+k*.6),fade*.50,(i-1)*.15,1,.55,0);
 }else{
  const heavy=style==='burst'&&skill;
  sprite(out,'flash',x,y,size*(heavy?.88:.62)*(1+.3*k),effectEnvelope(age,.22,.012,.17),seed*.6,1,.85,2);
  scatter(out,'ember',x,y,size,age,duration,seed,skill?9:5,{gravity:.23,spread:skill?1:.7,scale:.13});
  sprite(out,'dust',x,y+size*.37,size*(.35+k*.65),fade*.45,0,1,.38,0);
 }
 return out;
}

export function sampleRoute(r,time,w,h,centers={},sizes={}){
 if(r.style==='can-rescue')return sampleCan(r,time,w,h,centers,sizes);
 const out=[],age=time-r.born,duration=r.until-r.born,k=unit(age/duration);
 if(age<0||age>=duration)return out;
 const origin=centers[r.from]||r.positions?.[r.from],size=sizes[r.from]||50;
 if(!origin)return out;
 const source=point(origin,w,h),support=r.tone==='support'||r.tone==='energy',performance=ACTION_BY_ID[r.profile];
 if(r.style==='heal'&&r.phase!=='impact'){
  out.push(...healingCast(source,size,age,duration,r.phase==='release'));
  if(r.phase==='release')for(const id of r.targets){const p=centers[id]||r.positions?.[id];if(!p)continue;const q=point(p,w,h),s=sizes[id]||50;out.push({art:'heal-light',x:q.x,y:q.y+s*.39,width:s*(.55+k*.35),height:s*.22,alpha:effectEnvelope(age,duration,.05,.07)*.28,angle:0,layer:0});}
  return out;
 }
 if(r.phase==='windup'){
  if(r.kind==='skill'||r.style==='warning'){
   const art=support?'star':({fire:'ember',ice:'shard',electric:'electric',warning:'ember'})[r.style]||'star';
   for(let i=0;i<4;i++){const a=i*tau/4+k*.8,dist=size*(.75-.48*k);sprite(out,art,source.x+Math.cos(a)*dist,source.y+Math.sin(a)*dist*.65,size*(.10+.12*k),effectEnvelope(age,duration,.08,.05)*.65,a,1,1,1);}
   if(r.style==='warning')for(const id of r.targets){const p=centers[id]||r.positions?.[id];if(!p)continue;const q=point(p,w,h),s=sizes[id]||50;for(let i=0;i<3;i++)sprite(out,'dust',q.x+(i-1)*s*.22,q.y+s*.43,s*(.36+.1*k),(.18+.10*Math.sin(age*8)**2),0,1,.30,0);}
  }
 }else if(r.phase==='release'){
  if(r.style==='melee'||r.style==='warning'||r.style==='shield')return out;
  for(const id of r.targets){if(id===r.from)continue;
   const shot=performance?.projectile,count=shot?.count||(r.kind==='skill'&&r.style==='arrow'?3:1);
   for(let i=0;i<count;i++){
    const flight=sampleProjectile(r,id,time,w,h,centers,sizes,i,count);if(!flight?.visible)continue;
    const art=shot?.art||({arrow:'fish',ranged:'ember',heal:'milk',energy:'star'})[r.style]||r.style;
    const head=shot?.size||(r.style==='ranged'?16:(r.kind==='skill'?31:23)*(r.style==='ice'?1.15:1));
    // A flowing wake follows past trajectory samples. The head art is drawn once.
    const trailArt=shot?.trail||({fire:'fire',milk:'milk',heal:'milk',ice:'ice',electric:'electric',star:'star',arrow:'ember',ranged:'ember'})[r.style]||'ember';
    for(let j=8;j>=1;j--){
     const past=sampleProjectile(r,id,time-j*.012,w,h,centers,sizes,i,count),next=sampleProjectile(r,id,time-(j-1)*.012,w,h,centers,sizes,i,count);if(!past?.visible||!next?.visible)continue;
     const dx=next.x-past.x,dy=next.y-past.y,len=Math.hypot(dx,dy),taper=1-j/10;
     const ribbon=sprite(out,trailArt,(past.x+next.x)/2,(past.y+next.y)/2,Math.max(6,len*1.45),taper*.52,Math.atan2(dy,dx),1,Math.min(2,head*.22/Math.max(6,len*1.45))*taper,1);
     if(ribbon&&r.style==='fire')ribbon.deform={axis:'x',phase:time*20-j*.7,amplitude:.18};
     if(j%2===0){const drift=Math.sin((r.id+j)*3)*j*.5;sprite(out,r.style==='ice'?'shard':support?'heart':'ember',past.x+drift,past.y-j*.6,head*.12*taper,taper*.7,time*4+j,1,1,1);}
    }
    const stretch=1+.30*Math.sin(flight.progress*Math.PI),headSprite=sprite(out,art,flight.x,flight.y,head*stretch,1,flight.angle*Math.PI/180,1,1/stretch,2);
    if(headSprite&&['fire','milk','heal','star'].includes(r.style))headSprite.deform={axis:'x',phase:time*22+i*2,amplitude:r.style==='fire'?.16:.09};
    if(headSprite&&r.style==='ice')headSprite.angle+=Math.sin(flight.progress*Math.PI*3)*.12;
   }
  }
 }else if(r.phase==='impact'){
  for(let i=0;i<r.targets.length;i++){
   const id=r.targets[i],p=centers[id]||r.positions?.[id];if(!p)continue;
   const q=point(p,w,h),style=impactStyle(r),s=sizes[id]||50,dir=q.x>=source.x?1:-1;
   out.push(...sampleImpact(style,q,s,age,duration,r.id*19+i*31,dir,r.kind==='skill'));
  }
 }
 return out;
}

export function sampleGuard(entry,actor,time,p,size){
 if(actor.hp<=0||actor.shield<=0)return [];
 const out=[],age=time-entry.at,grow=1-(1-unit(age/.22))**3,hit=unit(1-(time-entry.hit)/.25);
 sprite(out,'shield',p.x,p.y+size*.02,size*(1.12+.08*grow+Math.sin(time*2.8)*.012),unit(age/.12)*(.44+hit*.32),0,1,1.06,1);
 return out;
}

export function sampleStatus(actor,time,p,size){
 const out=[];if(actor.hp<=0)return out;
 if(actor.burnTime>0)for(let i=0;i<2;i++){const q=time*6+i*2.6;const flame=sprite(out,'flame',p.x+(i?1:-1)*size*.23,p.y+size*.28+Math.sin(q)*size*.02,size*(.32+Math.sin(q)*.035),.67,Math.sin(q*.7)*.12,1,1,1);if(flame)flame.deform={axis:'y',phase:time*16+i*3,amplitude:.16};}
 if(actor.stun>0)for(let i=0;i<3;i++){const q=time*3+i*tau/3;sprite(out,'star',p.x+Math.cos(q)*size*.33,p.y-size*.46+Math.sin(q)*size*.09,size*.17,.83,q*.4,1,1,2);}
 return out;
}
