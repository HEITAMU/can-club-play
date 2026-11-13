import {CHARACTERS,SUPPORT,behavior} from './characters.mjs';
import {actionFor,sampleAction,clamp} from './motion.mjs';
import {drawActor} from './render.mjs';
import {paintEffects} from './fx.mjs';
import {ULTIMATES,ENEMY_POINTS,ALLY_POINTS,paintUltimate,paintUltimateGround,paintShieldPunch} from './ultimates.mjs';
import {scriptedShieldPunch,shieldPunchPose} from './shield-punch.mjs';
export const STAGE={width:960,height:520};
export function sceneAction(id,index){const a=actionFor(id,behavior(id,index),{x:185,y:430},{x:765,y:430},260);if(ULTIMATES.has(a.kind))a.end=Math.max(a.end,a.hit+1.65);if(a.kind==='shieldPunch')a.end=4.2;return a;}
export function dummy(ctx,x,y,hit=0,ally=false){ctx.save();ctx.translate(x+Math.sin(hit*Math.PI)*8,y);ctx.rotate(-Math.sin(hit*Math.PI)*.07);ctx.fillStyle='#172c30';ctx.globalAlpha=.18;ctx.beginPath();ctx.ellipse(0,0,45,11,0,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;ctx.fillStyle='#937355';ctx.fillRect(-7,-92,14,82);ctx.fillStyle=ally?'#b3c7ab':'#c9ae82';ctx.strokeStyle='#77614c';ctx.lineWidth=3;ctx.beginPath();ctx.roundRect(-36,-137,72,94,23);ctx.fill();ctx.stroke();ctx.strokeStyle=ally?'#5c8675':'#9c7761';ctx.setLineDash([4,7]);ctx.beginPath();ctx.roundRect(-27,-127,54,73,17);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle='#e6cf9b';for(const [dx,dy,r]of[[0,-90,10],[-15,-111,4],[0,-117,4],[15,-111,4]]){ctx.beginPath();ctx.arc(dx,dy,r,0,Math.PI*2);ctx.fill();}ctx.restore();}
function stageGround(ctx,width,height){ctx.beginPath();ctx.rect(0,0,width,height);ctx.clip();ctx.fillStyle='#2d474c';ctx.fillRect(0,0,width,height);const scale=Math.min(width/960,height/520);ctx.translate((width-960*scale)/2,(height-520*scale)/2);ctx.scale(scale,scale);ctx.fillStyle='#344f51';ctx.beginPath();ctx.ellipse(470,440,550,180,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#526665';ctx.globalAlpha=.23;ctx.lineWidth=2;for(let row=0;row<3;row++)for(let i=0;i<8;i++){ctx.beginPath();ctx.moveTo(i*140+(row%2)*60,445+row*32);ctx.lineTo(i*140+95+(row%2)*60,443+row*32);ctx.stroke();}ctx.globalAlpha=1;}
function shadow(ctx,x,y){ctx.fillStyle='#142c30';ctx.globalAlpha=.26;ctx.beginPath();ctx.ellipse(x,y,57,11,0,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;}
export function renderStage(ctx,atlas,images,id,index,time,width=960,height=520,options={}){
 if(id==='pudding'&&index===1)return renderShieldStage(ctx,atlas,images,options.demo||scriptedShieldPunch(time,options.interrupted),time,width,height);
 ctx.save();stageGround(ctx,width,height);const a=sceneAction(id,index),p=sampleAction(a,time),support=SUPPORT.has(a.kind),ultimate=ULTIMATES.has(a.kind),age=time-a.hit,hit=age>=0&&age<.27?age/.27:0;
 const impactKinds=['flare','freeze','inkBurst'];
 if(ultimate&&age>=0&&age<.23&&!support)ctx.translate(Math.sin(age*97)*3*(1-age/.23),Math.cos(age*72)*2*(1-age/.23));
 paintUltimateGround(ctx,atlas,images,a,time);
 if(support){if(ultimate)ALLY_POINTS.slice(1).forEach(([x,y])=>dummy(ctx,x,y,0,true));else dummy(ctx,440,435,0,true);}
 else if(impactKinds.includes(a.kind))ENEMY_POINTS.forEach(([x,y])=>dummy(ctx,x,y,hit));
 else dummy(ctx,765,430,hit);
 shadow(ctx,p.x,p.y);if(p.run){ctx.fillStyle='#c7b891';for(let i=0;i<3;i++){ctx.globalAlpha=.15*(1-i/3);ctx.beginPath();ctx.ellipse(p.x-40-i*15,p.y-1,8+i*3,3+i,0,0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;}
 drawActor(ctx,atlas,images,id,p,p.x,p.y,a.size);
 if(!paintUltimate(ctx,atlas,images,a,time))paintEffects(ctx,atlas,images,a,time);
 ctx.restore();return{action:a,pose:p};
}
export function renderShieldStage(ctx,atlas,images,d,time,width=960,height=520){
 ctx.save();stageGround(ctx,width,height);
 const hitEvent=[...d.events].reverse().find(e=>e.type==='punchHit'),age=hitEvent?time-hitEvent.at:-1,hit=age>=0&&age<.3?age/.3:0;
 if(age>=0&&age<.28)ctx.translate(Math.sin(age*110)*5*(1-age/.28),Math.cos(age*77)*2.5*(1-age/.28));
 const pose=shieldPunchPose(d.s,time),x=255,y=440,size=310;
 paintShieldPunch(ctx,atlas,images,d,time,{x:405,y:330},true);
 ENEMY_POINTS.forEach(([tx,ty],i)=>{dummy(ctx,tx,ty,hit);const e=d.enemies[i];if(e){ctx.fillStyle='#20393d';ctx.fillRect(tx-37,ty-154,74,5);ctx.fillStyle='#d8bd7f';ctx.fillRect(tx-37,ty-154,74*clamp(e.hp/e.maxHp),5);}});
 shadow(ctx,x,y);const muzzle=drawActor(ctx,atlas,images,'pudding',pose,x,y,size,{charge:pose.charge});
 const start=[...d.events].reverse().find(e=>e.type==='punchStart');const origin=pose.phase==='蓄力'||pose.phase==='锁定盾量'||(start&&time-start.at<=d.s.config.punchTravel)?muzzle:{x:405,y:330};
 paintShieldPunch(ctx,atlas,images,d,time,origin);
 // A local shield/energy readout makes the two triggers inspectable without a combat log.
 ctx.fillStyle='#1e363b';ctx.fillRect(132,476,246,9);ctx.fillStyle='#dfbb74';ctx.fillRect(132,476,246*clamp(d.s.shield/(d.s.maxHp*d.s.config.shieldCapRatio)),9);
 ctx.fillStyle='#1e363b';ctx.fillRect(132,491,246,5);ctx.fillStyle='#a4cfc1';ctx.fillRect(132,491,246*clamp(d.s.energy/d.s.config.energyCap),5);
 ctx.restore();return{action:sceneAction('pudding',1),pose,demo:d};
}
