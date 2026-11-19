// @ts-nocheck
import {Node,Label,UITransform,UIOpacity,Graphics,Sprite,Color,Button} from 'cc';
import {UI,THEME,fmt,color} from './UI';
import {PaintedActor} from './PaintedActor';
import {Effects} from './Effects';
import {CombatEffects,GuardEffects,StatusEffects} from './EffectsSampler';
import {BattleCues,formationPositions} from '../domain/battle-cues';
import {FormationMotion} from '../domain/formation-motion';
import {poseFor,travelOffset,MotionOffsets} from '../domain/motion';
import {groundFootY} from '../domain/battlefield-space';
import {battleUnitSize,companionSize} from '../domain/companion-display';
import {HealthTrails,rescueView,bossView} from '../domain/battle-ui';
import {damageTextStyle,criticalFrameSize} from '../domain/damage-text-style';
import {carrierId} from '../domain/carrier-art';
import {CHAPTERS,chapterOf,power} from '../domain/core';
import {MATERIAL_NAMES} from '../domain/loot-data';
import {rainFrame} from '../domain/scene-weather';
import {idleRate,idleMinutes} from '../domain/core';
import {assets} from './Assets';

class FloatingText{
 constructor(ui,parent,w,h){Object.assign(this,{ui,parent,w,h});this.items=[];this.anchors={};}
 clear(){for(const p of this.items)p.node.destroy();this.items=[];}
 consume(events,positions,time){for(const e of events){const p=this.anchors[e.to]||positions[e.to];if(!p)continue;let title,style;
  if(['hit','burn'].includes(e.type)&&e.value>0){for(const f of this.items)if(f.target===e.to&&time-f.born<.24)f.lift+=24;style=damageTextStyle(e);title=String(e.value);}
  else if(e.type==='heal'&&e.value>2){title='+'+e.value;style={color:'#caf9b7',size:11};}
  else if(e.type==='shield'&&e.value>0){title='护盾 +'+e.value;style={color:'#ffe7a7',size:11};}
  else if(['status','interrupt'].includes(e.type)){title=e.text;style={color:'#fff5d5',size:11};}
  else continue;
  if(this.items.length>=48)this.items.shift().node.destroy();const x=Math.max(9,Math.min(91,p.x))*this.w/100,y=Math.max(12,Math.min(88,p.y-6))*this.h/100,frame=criticalFrameSize(title.length*6),w=style.icon?frame.width:Math.max(40,title.length*style.size*.66),h=style.icon?26:22;
  const n=this.ui.group(this.parent,x-w/2,y-h/2,w,h,'combat-text:'+title);n.addComponent(UIOpacity);
  if(style.icon){
   assets.load(style.icon).then(texture=>{if(!n.isValid)return;const sw=texture.width,sh=texture.height,sx=[0,sw/4,sw*3/4,sw],sy=[0,sh/4,sh*3/4,sh],dx=[0,12,w-12,w],dy=[0,6,h-6,h];for(let row=0;row<3;row++)for(let col=0;col<3;col++)this.ui.image(n,style.icon,dx[col],dy[row],dx[col+1]-dx[col],dy[row+1]-dy[row],[sx[col],sy[row],sx[col+1]-sx[col],sy[row+1]-sy[row]]);label.node.setSiblingIndex(n.children.length-1);}).catch(error=>this.ui.errors.push(String(error)));
  }
  const label=this.ui.label(n,title,0,0,w,h,{size:style.size||10,color:style.icon?'#171211':style.color,bold:true,align:'center'});this.items.push({node:n,x,y,w,h,target:e.to,born:time,duration:.95,lift:0});
 }}
 update(time){for(let i=this.items.length-1;i>=0;i--){const f=this.items[i],p=Math.max(0,time-f.born)/f.duration;if(p>=1){f.node.destroy();this.items.splice(i,1);continue;}f.node.getComponent(UIOpacity).opacity=Math.round(255*(p<.65?1:(1-p)/.35));f.node.setPosition(f.x-f.w/2,-f.y+f.h/2+Math.round((1-(1-p)**2)*38+f.lift));}}
}
export class BattleView{
 constructor(ui: UI,session,parent:Node,w:number,h:number,callbacks){Object.assign(this,{ui,session,parent,w,h,cb:callbacks});this.arenaH=h-33;this.actorH=this.arenaH-76;this.unit=battleUnitSize(w,this.actorH);this.refs=new Map();this.battle=null;this.cues=new BattleCues();this.formation=new FormationMotion();this.offsets=new MotionOffsets();this.trails=new HealthTrails();this.fx=new CombatEffects(null);this.guards=new GuardEffects();this.statuses=new StatusEffects();this.bossInterrupted=-99;
  this.scene=ui.group(parent,0,0,w,this.arenaH,'battle-background');this.back=ui.group(parent,0,0,w,this.arenaH,'ground-effects');this.actors=ui.group(parent,0,0,w,this.arenaH,'actors');this.front=ui.group(parent,0,0,w,this.arenaH,'combat-effects');this.texts=ui.group(parent,0,0,w,this.arenaH,'damage-text');this.hud=ui.group(parent,0,0,w,h,'battle-hud');this.effects=new Effects(this.back,this.front);this.floating=new FloatingText(ui,this.texts,w,this.actorH);
  const banner=ui.panel(this.hud,9,9,w-60,29,{fill:'#4c362bd9',stroke:'#caa169',radius:8});this.stageLabel=ui.label(banner,'',7,0,w-133,29,{size:11,color:'#fff0c9',bold:true});this.stageLabel.node.name='battle-label';this.roundLabel=ui.label(banner,'',w-125,0,56,29,{size:9,color:'#edd7ae',align:'right'});
  ui.button(this.hud,'Ⅱ',w-44,9,34,34,()=>this.cb.open('pause'),{fill:'#70513c',color:'#ffe8bd',name:'battle-pause'});
  const income=ui.button(this.hud,'',8,49,58,76,()=>session.claimIdle(),{fill:'#00000000',stroke:'#00000000',name:'battle-income'});ui.image(income,'assets/ui/income-stall-v0272.webp',1,0,56,56);ui.panel(income,6,52,46,18,{fill:'#f2dcad',stroke:'#795337',radius:5});this.incomeLabel=ui.label(income,'领取',6,52,46,18,{size:10,bold:true,color:'#66432a',align:'center'});ui.icon(income,'gold',40,-1,19);this.incomeBar=ui.bar(income,7,72,43,4,0,'#efc562','#593e31');
  const bw=w*.67;this.boss=ui.panel(this.hud,w*.2,45,bw,53,{fill:'#513822ed',stroke:'#d1ad75',radius:9});this.boss.active=false;this.bossName=ui.label(this.boss,'',8,3,bw-105,21,{size:11,color:'#fce5bf',bold:true});this.bossHP=ui.label(this.boss,'',bw-102,3,94,21,{size:9,color:'#fce5bf',align:'right'});this.bossBar=ui.bar(this.boss,8,26,bw-16,6,1,'#d98157','#36251e');this.bossWarning=ui.label(this.boss,'',8,34,bw-16,14,{size:8,color:'#efc27c'});this.bossCharge=ui.bar(this.boss,8,49,bw-16,2,0,'#efc96c','#00000000');
  this.can=ui.button(this.hud,'',w/2-52,this.arenaH-113,104,104,()=>session.useCan(),{fill:'#00000000',stroke:'#00000000',name:'open-can'});ui.icon(this.can,'can',13,0,78);ui.panel(this.can,15,75,74,22,{fill:'#66442ee8',stroke:'#ad8354',radius:6});ui.label(this.can,'开罐啦',15,75,74,22,{size:15,bold:true,align:'center',color:'#ffeabc'});this.canStatus=ui.label(this.can,'',69,5,35,24,{size:11,bold:true,align:'center',color:'#ffe8bd'});this.canBar=ui.bar(this.can,25,100,54,4,1,'#efc668');
  ui.panel(this.hud,0,this.arenaH,w,33,{fill:'#725236',stroke:'#b38a58',radius:0});ui.label(this.hud,'队伍战力',11,this.arenaH+3,63,27,{size:12,bold:true,color:'#f2cc8b'});this.powerLabel=ui.label(this.hud,'',83,this.arenaH+2,w-147,28,{size:19,bold:true,color:'#ffdf8e'});this.speed=ui.button(this.hud,'×1',w-46,this.arenaH+4,36,25,()=>session.toggleSpeed(),{name:'battle-speed',size:11,fill:'#946c40'});
  this.growthLabel=ui.label(this.hud,'',78,this.arenaH-22,w-156,20,{size:10,color:'#ffdfa1',align:'center'});
  this.message=ui.group(this.hud,0,this.arenaH*.39,w,66,'battle-rewards');
 }
 bindBattle(){const b=this.session.battle;if(b===this.battle)return;this.battle=b;this.ui.clear(this.scene);this.ui.clear(this.actors);this.effects.clear();this.fx.clear();this.guards.clear();this.statuses.clear();this.offsets.clear();this.cues.clear();this.formation.clear();this.trails.clear();this.floating.clear();this.refs.clear();
  const q=b.activity,i=Math.floor((b.stage-1)/20)%6,ci=q?({sweep:0,escort:1,salvage:2,wardrobe:2,nightwatch:2,parts:0,polish:2,recruit:3,hunt:4,hard:5}[q.kind]??0):i,file=q?'assets/scenes/commissions-v02646.webp':`assets/mobile/street-${i}-v02684.webp`,cw=q?512:418,ch=q?512:627,x=q?ci%3*512:0,y=q?Math.floor(ci/3)*512:0,cut=q?[300,286,286,276,278,286][ci]:[290,270,265,275,245,270][i];
  this.ui.image(this.scene,file,0,0,this.w,this.arenaH*.35,[x,y,cw,cut]);this.ui.image(this.scene,file,0,this.arenaH*.35,this.w,this.arenaH*.65,[x,y+cut,cw,ch-cut]);this.rain=q&&ci===0?this.ui.group(this.scene,0,0,this.w,this.arenaH,'rain').addComponent(Graphics):null;this.bossInterrupted=-99;this.ui.clear(this.message);
  this.stageLabel.string=q?`${q.name} · 难度 ${q.tier}`:b.weekly?`${b.weekly.name} · 难度 ${b.weekly.tier}`:b.mode==='arena'?`第 ${b.arenaTier} 擂 · ${b.arenaRule.name}`:`第 ${b.stage} 关 · ${chapterOf(b.stage).name}${b.stage%5===0?' · 首领':''}`;
  const p=this.ground();this.floating.anchors=Object.fromEntries([...b.heroes,...b.enemies].map(a=>[a.id,{x:p[a.id].x,y:p[a.id].y-this.size(a)*.43/this.actorH*100}]));
  for(const a of [...b.enemies,...b.heroes]){const id=carrierId(a)||a.catId||(a.boss&&a.type==='box'?'boxBoss':a.type),n=this.ui.group(this.actors,0,0,0,0,'actor-'+a.id),shadow=this.ui.group(n,0,0,0,0,'shadow');const g=shadow.addComponent(Graphics);g.fillColor=color('#302a2344');g.ellipse(0,0,this.size(a)*.3,3.5);g.fill();const art=this.ui.character(n,id,0,0,a.boss?this.unit*1.3:this.unit);art.controlled=true;const bw=a.boss?58:44,bars=this.ui.group(n,-bw/2,-this.size(a)*1.3,bw,15,'vitals'),trail=this.ui.bar(bars,0,0,bw,5,1,'#e3c8a2'),hp=this.ui.bar(bars,0,0,bw,5,1,a.side==='p'?'#8db882':'#cc7764','#00000000'),shield=this.ui.bar(bars,0,6,bw,2,0,'#b2d5da','#00000000'),energy=a.side==='p'?this.ui.bar(bars,0,10,bw,3,0,'#edc276','#493b35'):null,charge=a.boss?this.ui.bar(bars,0,10,bw,3,0,'#e2a85f','#493b35'):null,tag=this.ui.label(n,'',-48,-this.size(a)*1.55,96,16,{size:8,color:'#fff4c9',align:'center',bold:true}),action=this.ui.label(n,'',-55,-this.size(a)*1.82,110,19,{size:10,color:'#ffe7ac',align:'center',bold:true});if(a.materialDrop){this.ui.icon(n,a.materialDrop.id,-12,9,19);this.ui.label(n,a.materialDrop.count,9,9,26,19,{size:10,color:'#ffedc3',bold:true});}this.refs.set(a.id,{node:n,art,shadow,bars,trail,hp,shield,energy,charge,tag,action,ratios:{}});}
 }
 size(a){return a.boss?this.unit*1.3:companionSize(this.unit,a.catId);}
 ground(){const p=this.formation.update(this.session.battle,this.session.battle.time+this.session.endElapsed);for(const v of Object.values(p))v.y=groundFootY(v.y,this.actorH,this.unit);return p;}
 centers(p){const b=this.battle;return Object.fromEntries([...b.heroes,...b.enemies].map(a=>{const off=this.offsets.points.get(a.id)||{x:0,y:0};return [a.id,{x:p[a.id].x+off.x/this.w*100,y:p[a.id].y-this.size(a)*.43/this.actorH*100+off.y/this.actorH*100}];}));}
 consume(events){this.bindBattle();const p=this.centers(this.ground());this.cues.consume(events,this.battle,p);this.floating.consume(events,p,this.battle.time);for(const e of events){if(e.type==='interrupt')this.bossInterrupted=this.battle.time+2.2;if(e.type==='burst'&&p[e.from])this.fx.emit('dust',p[e.from],this.battle.time,76,.6);}}
 showRewards(reward){this.ui.clear(this.message);const list=Object.entries(reward||{}).filter(([key,value])=>MATERIAL_NAMES[key]&&Number(value)>0),cw=Math.min(62,this.w/Math.max(1,list.length)),start=(this.w-list.length*cw)/2;list.forEach(([key,value],i)=>{this.ui.icon(this.message,key,start+i*cw,0,23);this.ui.label(this.message,'+'+fmt(value),start+i*cw+23,0,cw-23,24,{size:11,bold:true,color:'#ffe9b7'});});}
 showRetry(request){this.ui.clear(this.message);this.ui.button(this.message,'再挑战',this.w/2-62,0,124,38,()=>{this.session.changeTab('battle');this.session.startBattle(request);},{name:'resume-challenge',primary:true});}
 update(dt){
  this.bindBattle();const b=this.battle;if(!b)return;
  const time=b.time+this.session.endElapsed,ground=this.ground(),sizes={},feet={},actors=[...b.heroes,...b.enemies],active=this.cues.active(time);
  if(this.parent.activeInHierarchy){
   for(const a of actors){
    const r=this.refs.get(a.id),sz=this.size(a),src=ground[a.id],pose=poseFor(a,time),targetId=a.action?.targetId||b.targetFor(a)?.id,tar=ground[targetId],target=actors.find(x=>x.id===targetId);
    const desired=travelOffset(a,pose,src,tar,this.w,this.actorH,sz,target?this.size(target):sz,time),off=this.offsets.value(a,desired,time);
    sizes[a.id]=sz;feet[a.id]={x:src.x*this.w/100+off.x,y:src.y*this.actorH/100+off.y};r.node.setPosition(src.x*this.w/100,-src.y*this.actorH/100);
    if(a.action||r.flip===undefined)r.flip=tar?(tar.x<src.x?-1:1):a.side==='e'?-1:1;
    r.art.place(off.x,off.y,a.boss?this.unit*1.3:this.unit,r.flip);r.art.update(a,time,dt,this.session.time,b.result);r.shadow.setPosition(off.x,-off.y);
    const values={trail:this.trails.value(a.id,a.hp/a.maxHp,time),hp:Math.max(0,a.hp/a.maxHp),shield:Math.min(1,a.shield/a.maxHp),energy:a.energy/100,charge:a.charge>0?Math.max(0,1-a.charge/2):0};
    for(const key of Object.keys(values))if(r[key]&&r.ratios[key]!==values[key]){r[key].setRatio(values[key]);r.ratios[key]=values[key];}
    if(r.charge)r.charge.active=a.charge>0&&a.hp>0;
    r.tag.string=a.hp<=0?(a.side==='p'?'无法战斗':'已击败'):a.stun>0?'眩晕':a.burnTime>0?'灼烧':a.charge>0?'蓄力：攻击全队':a.side==='e'&&a.armor>=40?'高护甲':a.side==='e'&&a.magicResist>=40?'高魔抗':'';
    r.action.string=a.hp>0?(active.find(route=>route.from===a.id&&route.label!=='普攻')?.label||''):'';
   }
   actors.slice().sort((a,c)=>ground[a.id].y-ground[c.id].y).forEach((a,i)=>this.refs.get(a.id).node.setSiblingIndex(i));
   const centers=this.centers(ground);this.guards.render(actors,time,centers,sizes,this.fx);this.statuses.render(actors,time,centers,sizes,this.fx);this.effects.render(this.fx.render(active,time,this.w,this.actorH,centers,sizes,feet));this.floating.update(time);
   if(this.rain){const g=this.rain,weather=rainFrame(this.session.time,this.w,this.arenaH,this.unit);g.clear();g.lineWidth=.8;for(const d of weather.rain){g.strokeColor=new Color(198,222,226,Math.round(255*d.alpha));g.moveTo(d.x,-d.y);g.lineTo(d.x-2,-d.y-d.length);g.stroke();}for(const r of weather.ripples){g.strokeColor=new Color(195,222,226,Math.round(255*r.alpha));g.ellipse(r.x,-r.y,r.r,r.r*.3);g.stroke();}}
  }
  this.roundLabel.string=b.result?(b.result==='win'?'本场胜利':'暂时退回'):this.session.paused?'已暂停':!this.session.running?'准备出发':`第 ${b.round||1} 回合`;
  this.powerLabel.string=fmt(power(this.session.state));this.speed.__label.string='×'+this.session.state.speed;
  this.growthLabel.string=this.session.growthRunFrom===null?'':'本次跃升后已推进 '+Math.max(0,this.session.state.highest-this.session.growthRunFrom)+' 关';
  const idle=this.session.state.idle,cap=idleRate(this.session.state)*idleMinutes(this.session.state);this.incomeBar.setRatio(cap>0?idle/cap:0);
  const can=rescueView(b,this.session.running||this.session.state.guideStep===12);this.can.__button.interactable=can.ready&&!this.session.loading;this.canStatus.string=can.seconds>0?Math.ceil(can.seconds)+'秒':can.ready?'开罐':'补给中';this.canBar.setRatio(can.progress);
  const boss=bossView(b);this.boss.active=!!boss;if(boss){this.bossName.string=boss.name;this.bossHP.string=`${boss.hp} / ${Math.ceil(boss.maxHp)}`;this.bossBar.setRatio(boss.ratio);this.bossCharge.setRatio(boss.charge);this.bossWarning.string=boss.hp<=0?'首领已击败':boss.charging?'全队攻击即将落下 · '+Math.ceil(boss.rounds)+' 回合':b.time<this.bossInterrupted?'打断成功 · 全队避开群攻':'蓄力';}
 }
}
