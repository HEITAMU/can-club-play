import {createRequire} from 'node:module';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {CATS,Battle,initialState} from '../core.mjs';
import {BattleCues,formationPositions} from '../battle-cues.mjs';
import {CombatEffects,GuardEffects,StatusEffects,paintVFX} from '../painted-fx.mjs';
import {ANATOMY} from '../anatomy-data.mjs';
import {VFX_ATLAS} from '../vfx-atlas.mjs';
import {renderPuppetFrame} from '../rig-renderer.mjs';
import {rigPose} from '../rig-motion.mjs';
import {expressionFor,bowNock} from '../expressions.mjs';
import {poseFor,travelOffset,MotionOffsets} from '../motion.mjs';
const require=createRequire(import.meta.url),{createCanvas,loadImage,GlobalFonts}=require('@napi-rs/canvas');
process.chdir(fileURLToPath(new URL('..',import.meta.url)));
const font='/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc';if(fs.existsSync(font))GlobalFonts.registerFromPath(font,'Review CJK');
const images=Object.fromEntries(await Promise.all(Object.entries(ANATOMY).map(async([id,kit])=>[id,await loadImage(kit.atlas)])));
const fxImage=await loadImage(VFX_ATLAS.url),enemyImage=await loadImage('assets/painted/enemies-b.webp'),street=await loadImage('assets/painted/streets.webp');
export function fixture(caster,kind='skill'){
 const s=initialState();s.highest=120;s.party=[caster,...['orange','milk','ink'].filter(id=>id!==caster).slice(0,2)];for(const c of CATS)s.levels[c.id]=8;
 const b=new Battle(s,{stage:20});b.enemies=b.enemies.slice(0,1);for(const a of b.heroes){a.hp=a.maxHp*.48;a.wait=99;a.energy=0;}const e=b.enemies[0];e.hp=e.maxHp=99999;e.wait=99;e.skillWait=99;
 return {b,kind,cues:new BattleCues(),fx:new CombatEffects(null),guards:new GuardEffects(),statuses:new StatusEffects(),offsets:new MotionOffsets(),base:{p0:{x:34,y:75},p1:{x:15,y:43},p2:{x:15,y:94},e0:{x:79,y:74}},centers:{},started:false};
}
export function advance(v,dt){if(!v.started&&v.b.time>=.55){v.started=true;v.b.beginAction(v.b.heroes[0],v.kind);v.b.heroes[0].wait=99;}const events=v.b.events.splice(0);events.push(...v.b.tick(dt));v.cues.consume(events,v.b,v.centers);}
export function draw(v,w=390,h=320){
 const c=createCanvas(w,h),ctx=c.getContext('2d');ctx.fillStyle='#293e46';ctx.fillRect(0,0,w,h);
 ctx.globalAlpha=.65;ctx.drawImage(street,0,street.height*.18,street.width/3,street.height*.32,0,0,w,h);ctx.globalAlpha=1;
 const size=66,sz={},b=v.b,actors=[...b.heroes,...b.enemies].sort((a,z)=>v.base[a.id].y-v.base[z.id].y);
 for(const a of actors){const pose=poseFor(a,b.time),target=b.targetFor(a,a.action?.kind),n=size*(a.boss?1.12:1),p=v.base[a.id],offset=v.offsets.value(a,travelOffset(a,pose,p,v.base[target?.id],w,h,n,size,b.time),b.time),x=p.x*w/100+offset.x,y=p.y*h/100+offset.y;sz[a.id]=n;v.centers[a.id]={x:x/w*100,y:(y-n*.43)/h*100};
  ctx.fillStyle='#172c344d';ctx.beginPath();ctx.ellipse(x,y,n*.29,n*.045,0,0,Math.PI*2);ctx.fill();
  const sprite=createCanvas(Math.round(n*1.44),Math.round(n*1.38)),art=sprite.getContext('2d'),id=a.catId||a.type,shape=rigPose(id,a,b.time);shape.nock=bowNock(a);const face=expressionFor(id,a,b.time);
  renderPuppetFrame(art,id,shape,a.side==='p'?images[id]:enemyImage,sprite.width,sprite.height,a.side==='e'?[0,enemyImage.height/4*2,enemyImage.width/4,enemyImage.height/4]:null,{from:face,to:face,mix:1});
  ctx.save();ctx.translate(x,y);if(a.side==='e')ctx.scale(-1,1);ctx.drawImage(sprite,-n*.72,-n*1.12);ctx.restore();
  ctx.fillStyle='#293e46';ctx.fillRect(x-20,y-n-12,40,3);ctx.fillStyle=a.side==='p'?'#bad29e':'#dda08c';ctx.fillRect(x-20,y-n-12,40*a.hp/a.maxHp,3);
 }
 v.guards.render([...b.heroes,...b.enemies],b.time,v.centers,sz,v.fx);v.statuses.render([...b.heroes,...b.enemies],b.time,v.centers,sz,v.fx);
 paintVFX(ctx,fxImage,v.fx.render(v.cues.active(b.time),b.time,w,h,v.centers,sz));
 return c;
}
export function sheet(time=1.4,kind='skill'){
 const c=createCanvas(1200,790),ctx=c.getContext('2d');ctx.fillStyle='#22363e';ctx.fillRect(0,0,1200,790);
 for(let i=0;i<8;i++){const cat=CATS[i],v=fixture(cat.id,kind),x=i%4*300,y=Math.floor(i/4)*395;draw(v,300,320);while(v.b.time<time){advance(v,Math.min(1/60,time-v.b.time));draw(v,300,320);}
  ctx.fillStyle='#ddc99f';ctx.font='17px "Review CJK"';ctx.fillText(cat.name+' · '+(kind==='normal'?'普攻':cat.skill),x+14,y+24);ctx.drawImage(draw(v,300,320),x,y+37);ctx.font='12px "Review CJK"';ctx.fillStyle='#acbfb5';ctx.fillText('实际结算 / '+v.b.time.toFixed(2)+' 秒',x+14,y+378);
 }
 return c;
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 fs.mkdirSync('qa',{recursive:true});for(const kind of ['normal','skill'])for(const time of [.75,.95,1.14,1.32,1.6])fs.writeFileSync('qa/vfx-'+kind+'-'+time+'.png',sheet(time,kind).toBuffer('image/png'));
 console.log('Rendered all sixteen actions at cast, flight, hit and dissipation times.');
}
