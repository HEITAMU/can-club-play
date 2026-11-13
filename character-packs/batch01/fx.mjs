import {CHARACTERS,SUPPORT,PASSIVES} from './characters.mjs';
import {clamp,ease,sampleAction} from './motion.mjs';
import {fxStamp,paintTrail,paintTextureFlame,muzzleFor} from './render.mjs';
const TAU=Math.PI*2;
export function paintEffects(ctx,atlas,images,a,t){
 const c=CHARACTERS[a.id],art=atlas.characters[a.id],kind=a.kind,age=t-a.hit;
 const target={x:a.target.x-35,y:a.target.y-95},birthPose=sampleAction(a,a.release),birth=muzzleFor(atlas,a.id,birthPose,birthPose.x,birthPose.y,a.size);
 const stamp=(key,x,y,w,ang=0,alpha=1,stretch=1)=>fxStamp(ctx,art,images,key,x,y,w,ang,alpha,stretch);
 const sparks=(key,x,y,count,width,age,duration=.65)=>{if(age<0||age>duration)return;const q=age/duration;for(let i=0;i<count;i++){const angle=i*2.399+ .4,speed=25+(i%4)*12,r=speed*ease(q),fall=q*q*35;stamp(key,x+Math.cos(angle)*r,y+Math.sin(angle)*r+fall,width*(1-q*.65),angle+q,Math.sin(Math.PI*q)**.6*.7);}};
 const seal=(x,y,key='release',w=110,delayAge=age,duration=.9)=>{if(delayAge<0||delayAge>duration)return;const q=delayAge/duration;stamp(key,x,y,w*(.66+.34*ease(q/.22)),0,Math.min(1,q/.12)*(1-ease((q-.55)/.45)));};
 const stream=(from,to,start,duration,key='seed',curve=0,scale=45)=>{const q=(t-start)/duration;if(q<0||q>1)return;const point=u=>[from.x+(to.x-from.x)*u,from.y+(to.y-from.y)*u-Math.sin(u*Math.PI)*curve];const p=point(q),prev=point(Math.max(0,q-.035)),pts=[];for(let i=0;i<9;i++)pts.push(point(Math.max(0,q-i*.017)));pts.reverse();paintTrail(ctx,pts,c.color,5,.50);stamp(key,...p,scale,Math.atan2(p[1]-prev[1],p[0]-prev[0]),1,1+Math.sin(q*Math.PI)*.15);};
 if(kind==='normal'){
  if(!a.melee)stream(birth,target,a.release,a.hit-a.release,'seed',a.id==='milk'?32:a.id==='star'?55:0,a.id==='ink'?53:42);
  if(age>=0&&age<.6){
   if(a.id==='night')stamp('release',target.x,target.y,165,-.15,1-ease(age/.3),.6);
   else if(a.id==='mint')seal(target.x,target.y,'release',72,age,.5);
   else if(a.id==='spark')paintTextureFlame(ctx,art,images,'release',target.x,target.y+20,68,100,t,1-ease(age/.6));
   sparks('impact',target.x,target.y,4,30,age);}
  return;
 }
 if(SUPPORT.has(kind)){
  const x=a.start.x,y=a.start.y-a.size*.42;
  if(['ward','guard','foam','convert','absorb','selfShield','returnEnergy'].includes(kind)){
   for(let i=0;i<(kind==='guard'?3:1);i++)seal(x+i*65-10,y+(i%2)*20,kind==='foam'?'state':'seed',100,age-i*.08,1.05);
   if((kind==='absorb'||kind==='returnEnergy')&&t>.18&&t<a.release){const q=(t-.18)/(a.release-.18);paintTrail(ctx,[[x+180,y-50],[x+130*(1-q),y-30*(1-q)],[x+55*(1-q),y]],c.color,5,.8);stamp('impact',x+55*(1-q),y,35,0,Math.sin(q*Math.PI));}
   if(kind==='convert'){seal(x,y-15,'state',110,age,.9);sparks('seed',x,y,5,20,age);}
  }else if(kind==='heal'||kind==='healTeam'){
   const targets=kind==='healTeam'?[{x:400,y:330},{x:500,y:350},{x:360,y:400}]:[{x:440,y:350}];
   targets.forEach((to,i)=>{stream(birth,to,a.release+i*.08,.40,'seed',65,35);const q=t-a.release-.40-i*.08;seal(to.x,to.y,'state',110,q,1);if(q>0&&q<.9){for(let j=0;j<3;j++)stamp('impact',to.x+(j-1)*26,to.y-q*55-j*12,24,Math.sin(q*4+j)*.1,Math.sin(q/.9*Math.PI));}});
   if(age>-.1&&age<.75)paintTextureFlame(ctx,art,images,'release',420,420,80,180,t,Math.sin(clamp((age+.1)/.85)*Math.PI)*.65);
  }else if(['energy','constellation','echo','bond'].includes(kind)){
   const allies=kind==='energy'?[{x:440,y:320}]:[{x:370,y:340},{x:500,y:305},{x:430,y:400}];
   allies.forEach((to,i)=>{stream(birth,to,a.release+i*.07,.45,'seed',60,30);seal(to.x,to.y,'release',110,age-i*.08,.9);sparks('impact',to.x,to.y,4,22,age-i*.08);});
  }else if(['shadow','stealth'].includes(kind)){
   if(age>-.25&&age<1.0)for(let i=0;i<3;i++)stamp('state',x+(i-1)*40,y+30+i*8,150,Math.sin(t*2+i)*.12,Math.sin(clamp((age+.25)/1.25)*Math.PI)*.42);
  }else if(kind==='defer'){seal(x,y,'state',95,age,1.2);for(let i=0;i<3;i++)sparks('seed',x,y+i*15,2,21,age-i*.20,.4);}
  return;
 }
 const area=['flare','freeze','burst','inkBurst'].includes(kind),targets=area?[{x:target.x-20,y:target.y-55},{x:target.x+45,y:target.y},{x:target.x-5,y:target.y+65}]:[target];
 if(!a.melee)targets.forEach((to,i)=>stream(birth,to,a.release+i*.035,a.hit-a.release,'seed',a.id==='spark'?18:0,45));
 targets.forEach((to,i)=>{
  const q=age-i*.05;if(q<0||q>1.2)return;
  if(a.id==='spark'){paintTextureFlame(ctx,art,images,'release',to.x,to.y+50,105,160,t+i,1-ease(q/1));sparks('impact',to.x,to.y,6,27,q);}
  else if(a.id==='mint'){for(let j=0;j<3;j++)seal(to.x+(j-1)*22,to.y+10-j*13,'release',90,q-j*.04,.8);sparks('impact',to.x,to.y,7,20,q);}
  else if(a.id==='night'){const count=kind==='multicut'?3:1;for(let j=0;j<count;j++){const z=q-j*.13;if(z>=0&&z<.30)stamp('release',to.x,to.y,190,(j%2?1:-1)*.25,1-z/.30,.5);}seal(to.x,to.y-70,'seed',42,q,.8);sparks('impact',to.x,to.y,6,22,q);}
  else if(a.id==='pudding'){stamp('release',to.x,to.y+20,240*(.5+ease(q/.30)*.5),0,1-ease(q/.7),.45+q*.8);sparks('impact',to.x,to.y+30,7,38,q,.85);}
  else if(a.id==='inkstone'){stamp('seed',to.x,to.y,170,0,1-ease(q/.3));seal(to.x,to.y,'release',180,q,.8);sparks('impact',to.x,to.y,4,35,q);}
  else if(a.id==='ink'){seal(to.x,to.y,'release',85,q,.85);sparks('impact',to.x,to.y,4,22,q);}
  else{seal(to.x,to.y,'state',100,q,.95);sparks('impact',to.x,to.y,6,30,q);}
 });
 if(a.id==='ink'&&(kind==='volley'||kind==='pursuit'))for(let i=1;i<3;i++)stream(birth,{x:target.x,y:target.y+(i-1)*22},a.release+i*.10,a.hit-a.release,'seed',0,57);
}
