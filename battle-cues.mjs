import {attackStyle} from './motion.mjs?v=0.21.8';
import {CATS} from './core.mjs?v=0.21.8';
import {catAction} from './action-profiles.mjs?v=0.21.8';
export const cueColors={attack:'#edc581',enemy:'#ee9f8c',support:'#b3d9ba',energy:'#d2b9eb'};
const skillEffect={orange:'全队护盾',ink:'穿甲三连',milk:'全队治疗',spark:'群攻灼烧',mint:'眩晕打断',bolt:'破甲',pudding:'蓄盾重拳 · 最多三目标',star:'治疗＋回能'};
// Coordinates are foot contacts on the painted ground, not sprite centers.
export function formationPositions(b){
 const result={};
 for(const [side,actors] of [['p',b.heroes],['e',b.enemies]]){
  const front=actors.slice(0,2),back=actors.slice(2),mirror=x=>side==='p'?x:100-x;
  for(const [i,a] of actors.entries()){
   const fi=front.indexOf(a),bi=back.indexOf(a);
   result[a.id]=fi>=0?{x:mirror(36),y:front.length===1?76:[59,89][fi]}:{x:mirror(bi===1?22:16),y:back.length===1?75:back.length===2?[57,94][bi]:[51,73,95][bi]};
  }
 }
 return result;
}
export class BattleCues{
 constructor(){this.clear();}
 clear(){this.routes=new Map();this.entries=[];this.nextId=0;}
 cancelPending(id){for(const [key,r] of this.routes)if(r.from===id&&r.phase!=='impact')this.routes.delete(key);}
 addRoute(key,from,targets,label,tone,time,positions,phase='impact',duration=.55,extra={}){
  if(!targets.length)return;
  this.routes.set(key,{id:++this.nextId,from,targets:[...new Set(targets)],label,tone,phase,born:time,until:time+duration,positions:structuredClone(positions),...extra});
 }
 log(from,ability,target,effect,tone,time,skill=false){this.entries.unshift({id:++this.nextId,from,ability,target,effect,tone,time,skill});this.entries.length=Math.min(this.entries.length,60);}
 consume(events,b,positions){
  const actors=[...b.heroes,...b.enemies],byId=id=>actors.find(a=>a.id===id),name=id=>byId(id)?.name.split(' · ')[0]||'开罐啦';
  const casters=new Set(events.filter(e=>e.type==='skill').map(e=>e.from)),can=events.some(e=>e.type==='can'),bursts=new Set(events.filter(e=>e.type==='burst').map(e=>e.from));
  if(can){
   // Rescue has its own combined readout, but deaths and interrupts still retire pending attacks.
   for(const e of events)if(e.type==='down'||e.type==='interrupt')this.cancelPending(e.to);else if(e.type==='cancel')this.cancelPending(e.from);
   const event=events.find(e=>e.type==='can'),p={...positions,can:{x:26,y:26}};
   this.addRoute('can-rescue','can',event.targets,'开罐啦','support',event.at??b.time,p,'impact',event.duration,{style:'can-rescue',friends:event.friends,contacts:{}});
   this.log('开罐啦','全队救援','全体敌我',events.some(e=>e.type==='interrupt')?'回血20% · 伤敌 · 打断成功':'回血20% · 伤敌','support',b.time,true);
  }
  for(const e of events){
   if(e.type==='can'||(can&&e.type==='interrupt'))continue;
   if(e.type==='cancel'||e.type==='down'){
    const id=e.type==='down'?e.to:e.from;
    this.cancelPending(id);
   }
   if(e.rescue){const r=this.routes.get('can-rescue');if(r&&e.type==='hit'&&positions[e.to])r.contacts[e.to]={...positions[e.to]};continue;}
   const a=byId(e.from);if(!a)continue;const at=e.at??b.time,tone=a.side==='e'?'enemy':'attack';
   if(e.type==='windup'||e.type==='release'){
    const duration=e.type==='windup'?(e.windup||.4)+.06:(e.travel||.29)+.05,extra={style:attackStyle(a,e.kind),travel:e.travel||.29,kind:e.kind,profile:catAction(a.catId,e.kind)?.id};
    if(e.kind==='normal')this.addRoute(a.id,a.id,[e.to],'普攻',tone,at,positions,e.type,duration,extra);
    else {
     const targets=b.skillTargets(a).map(t=>t.id),friends=targets.filter(id=>id.startsWith('p')),foes=targets.filter(id=>id.startsWith('e')),label=CATS.find(c=>c.id===a.catId)?.skill||'技能';
     if(foes.length)this.addRoute(a.id,a.id,foes,label,tone,at,positions,e.type,duration,extra);
     if(friends.length)this.addRoute(a.id+'-support',a.id,friends,label,a.catId==='star'?'energy':'support',at,positions,e.type,duration,{...extra,style:['orange','pudding'].includes(a.catId)?'shield':a.catId==='star'?'star':'heal'});
    }
   }
   if(e.type==='hit'&&!bursts.has(e.from)&&!casters.has(e.from)&&e.cause!=='skill'){
    const reflected=e.cause==='reflect';this.addRoute(reflected?a.id+'-reflect':a.id,a.id,[e.to],reflected?'反伤':'普攻',tone,at,positions,'impact',.44,{style:e.shield?'shield':attackStyle(a),kind:'normal',profile:e.shield?undefined:catAction(a.catId,'normal')?.id});
    this.log(name(e.from),reflected?'反伤':'普攻',name(e.to),(e.crit?'暴击 ':'')+e.value+(e.shield?' · 护盾承受':''),tone,at);
   }
   if(e.type==='skill'){
    const info=CATS.find(c=>c.id===a.catId),targets=e.targets||[],friends=targets.filter(id=>id.startsWith('p')),foes=targets.filter(id=>id.startsWith('e'));
    this.routes.delete(a.id);
    if(foes.length)this.addRoute(a.id,a.id,foes,e.text,tone,at,positions,'impact',.82,{style:attackStyle(a,'skill'),kind:'skill',profile:catAction(a.catId,'skill')?.id});
    if(friends.length)this.addRoute(a.id+'-support',a.id,friends,e.text,a.catId==='star'?'energy':'support',at,positions,'impact',a.catId==='milk'?1.32:1.05,{kind:'skill',profile:catAction(a.catId,'skill')?.id,style:['orange','pudding'].includes(a.catId)?'shield':a.catId==='star'?'star':'heal'});
    this.log(a.name,info.skill,targets.length===1?name(targets[0]):friends.length&&foes.length?'敌方＋全队':friends.length?'我方全队':a.catId==='pudding'?'穿线＋双前排':'敌方全体',skillEffect[a.catId],friends.length?'support':'attack',at,true);
   }
   if(e.type==='heal'&&!casters.has(e.from)){
    const label=a.side==='e'?'纸袋修补':'吸血回复';
    this.addRoute(a.id+'-support',a.id,[e.to],label,'support',at,positions,'impact',.7,{style:'heal'});
    this.log(name(a.id),label,name(e.to),'治疗 +'+e.value,'support',at,true);
   }
   if(e.type==='charge'){
    this.addRoute(a.id,a.id,b.heroes.filter(h=>h.hp>0).map(h=>h.id),'蓄力群攻','enemy',at,positions,'windup',2.1,{style:'warning'});
    this.log(name(a.id),'蓄力群攻','我方全队','开罐啦可打断','enemy',at,true);
   }
   if(e.type==='interrupt'){
    this.routes.delete(e.to);this.log(name(e.from),'打断',name(e.to),'群攻已取消','support',at,true);
   }
   if(e.type==='burst'){
    const targets=events.filter(h=>h.type==='hit'&&h.from===a.id&&h.to?.startsWith('p')).map(h=>h.to);
    this.addRoute(a.id,a.id,targets,'群攻','enemy',at,positions,'impact',.7,{style:'burst'});this.log(name(a.id),'蓄力群攻','我方全队','全队受击','enemy',at,true);
   }
  }
 }
 active(time){for(const [key,r] of this.routes)if(time>=r.until)this.routes.delete(key);return [...this.routes.values()];}
 recent(time){const skills=this.entries.filter(e=>e.skill&&time-e.time<4);return (skills.length?skills:this.entries).slice(0,2);}
}
