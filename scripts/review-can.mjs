import {createRequire} from 'node:module';
import fs from 'node:fs';
import {Battle,initialState,CATS} from '../core.mjs';
import {BattleCues,formationPositions} from '../battle-cues.mjs';
import {CombatEffects,paintVFX} from '../painted-fx.mjs';
import {CAN_ATLAS} from '../can-fx.mjs';
import {VFX_ATLAS} from '../vfx-atlas.mjs';
import {ANATOMY} from '../anatomy-data.mjs';
import {renderPuppetFrame} from '../rig-renderer.mjs';
import {rigPose} from '../rig-motion.mjs';
import {expressionFor} from '../expressions.mjs';
const require=createRequire(import.meta.url),{createCanvas,loadImage}=require('@napi-rs/canvas');
const images=Object.fromEntries(await Promise.all(Object.entries(ANATOMY).map(async([id,kit])=>[id,await loadImage(kit.atlas)])));
const street=await loadImage('assets/scenes/streets-v019.webp'),enemyImage=await loadImage('assets/painted/enemies-b.webp'),canImage=await loadImage(CAN_ATLAS.url),fxImage=await loadImage(VFX_ATLAS.url);
const s=initialState();s.highest=120;s.party=['orange','ink','milk','mint','bolt'];for(const c of CATS)s.levels[c.id]=8;
const b=new Battle(s,{stage:20}),cues=new BattleCues(),fx=new CombatEffects(null),w=390,h=592,n=66,base=formationPositions(b),centers=Object.fromEntries(Object.entries(base).map(([id,p])=>[id,{x:p.x,y:p.y-n*.43/h*100}])),sizes=Object.fromEntries(Object.keys(base).map(id=>[id,n]));
for(const a of [...b.heroes,...b.enemies]){a.wait=99;a.skillWait=99;a.hp=a.maxHp=99999;}b.heroes.forEach(a=>a.hp*=.5);
b.openCan();cues.consume(b.events.splice(0),b,centers);
function draw(time){
 while(b.time<time-1e-8)cues.consume(b.tick(Math.min(1/120,time-b.time)),b,centers);
 const c=createCanvas(w,h),ctx=c.getContext('2d');ctx.drawImage(street,0,0,418,627,0,0,w,h);
 const particles=fx.render(cues.active(time),time,w,h,centers,sizes);paintVFX(ctx,fxImage,particles.filter(p=>p.layer===0),canImage);
 for(const a of [...b.heroes,...b.enemies].sort((a,b)=>base[a.id].y-base[b.id].y)){
  const id=a.catId||a.type,p=base[a.id],x=p.x*w/100,y=p.y*h/100,sprite=createCanvas(95,91),sc=sprite.getContext('2d'),face=expressionFor(id,a,time);
  renderPuppetFrame(sc,id,rigPose(id,a,time),a.side==='p'?images[id]:enemyImage,95,91,a.side==='e'?[0,enemyImage.height/4*2,enemyImage.width/4,enemyImage.height/4]:null,{from:face,to:face,mix:1});
  ctx.save();ctx.translate(x,y);if(a.side==='e')ctx.scale(-1,1);ctx.drawImage(sprite,-n*.72,-n*1.12);ctx.restore();
 }
 paintVFX(ctx,fxImage,particles.filter(p=>p.layer!==0),canImage);return c;
}
const times=[.16,.36,.78,1.10,1.48,1.88,2.15,2.50],sheet=createCanvas(w*4,(h+28)*2),ctx=sheet.getContext('2d');ctx.fillStyle='#293e46';ctx.fillRect(0,0,sheet.width,sheet.height);
for(let i=0;i<times.length;i++){const x=i%4*w,y=Math.floor(i/4)*(h+28);ctx.drawImage(draw(times[i]),x,y+28);ctx.fillStyle='#ffe5b1';ctx.font='16px sans-serif';ctx.fillText(times[i].toFixed(2)+'s',x+12,y+20);}
fs.mkdirSync('qa',{recursive:true});fs.writeFileSync('qa/can-v0192-contact.jpg',sheet.toBuffer('image/jpeg',85));console.log('Wrote qa/can-v0192-contact.jpg');
