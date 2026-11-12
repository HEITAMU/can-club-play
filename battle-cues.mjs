import {attackStyle} from './motion.mjs?v=0.13.0';
import {CATS} from './core.mjs?v=0.13.0';
export const cueColors={attack:'#edc581',enemy:'#ee9f8c',support:'#b3d9ba',energy:'#d2b9eb'};
const skillEffect={orange:'全队护盾',ink:'穿甲三连',milk:'全队治疗',spark:'群攻灼烧',mint:'眩晕打断',bolt:'破甲',pudding:'群攻＋全队护盾',star:'治疗＋回能'};
// Coordinates are foot contacts on the painted ground, not sprite centers.
export function formationPositions(b){
 const result={};
 for(const [side,actors] of [['p',b.heroes],['e',b.enemies]]){
  const living=actors.filter(a=>a.hp>0),front=living.slice(0,2),back=living.slice(2),mirror=x=>side==='p'?x:100-x;
  for(const [i,a] of actors.entries()){
   const fi=front.indexOf(a),bi=back.indexOf(a);
   result[a.id]=a.hp<=0?{x:mirror(8+i*7),y:98}:fi>=0?{x:mirror(36),y:front.length===1?76:[59,89][fi]}:{x:mirror(bi===1?22:16),y:back.length===1?75:back.length===2?[57,94][bi]:[51,73,95][bi]};
  }
 }
 return result;
}
export class BattleCues{
 constructor(){this.clear();}
 clear(){this.routes=new Map();this.entries=[];this.nextId=0;}
 addRoute(key,from,targets,label,tone,time,positions,phase='impact',duration=.55,extra={}){
  if(!targets.length)return;
  this.routes.set(key,{id:++this.nextId,from,targets:[...new Set(targets)],label,tone,phase,born:time,until:time+duration,positions:structuredClone(positions),...extra});
 }
 log(from,ability,target,effect,tone,time,skill=false){this.entries.unshift({id:++this.nextId,from,ability,target,effect,tone,time,skill});this.entries.length=Math.min(this.entries.length,60);}
 consume(events,b,positions){
  const actors=[...b.heroes,...b.enemies],byId=id=>actors.find(a=>a.id===id),name=id=>byId(id)?.name.split(' · ')[0]||'开罐啦';
  const casters=new Set(events.filter(e=>e.type==='skill').map(e=>e.from)),can=events.some(e=>e.type==='can'),bursts=new Set(events.filter(e=>e.type==='burst').map(e=>e.from));
  if(can){
   for(const e of events)if(e.type==='interrupt')this.routes.delete(e.to);
   const enemies=events.filter(e=>e.type==='hit'&&e.to?.startsWith('e')).map(e=>e.to),friends=b.heroes.filter(h=>h.hp>0).map(h=>h.id),p={...positions,can:{x:50,y:99}};
   this.addRoute('can-attack','can',enemies,'伤敌','attack',b.time,p,'impact',.7,{style:'melee'});this.addRoute('can-heal','can',friends,'回血','support',b.time,p,'impact',.8,{style:'heal'});
   this.log('开罐啦','全队救援','全体敌我',events.some(e=>e.type==='interrupt')?'回血20% · 伤敌 · 打断成功':'回血20% · 伤敌','support',b.time,true);return;
  }
  for(const e of events){
   const a=byId(e.from);if(!a)continue;const at=e.at??b.time,tone=a.side==='e'?'enemy':'attack';
   if(e.type==='cancel'||e.type==='down'){
    const id=e.type==='down'?e.to:e.from;
    for(const [key,r] of this.routes)if(r.from===id&&r.phase!=='impact')this.routes.delete(key);
   }
   if(e.type==='windup'||e.type==='release'){
    const duration=e.type==='windup'?(e.windup||.4)+.06:(e.travel||.29)+.05,extra={style:attackStyle(a),travel:e.travel||.29,kind:e.kind};
    if(e.kind==='normal')this.addRoute(a.id,a.id,[e.to],'普攻',tone,at,positions,e.type,duration,extra);
    else {
     const targets=b.skillTargets(a).map(t=>t.id),friends=targets.filter(id=>id.startsWith('p')),foes=targets.filter(id=>id.startsWith('e')),label=CATS.find(c=>c.id===a.catId)?.skill||'技能';
     if(foes.length)this.addRoute(a.id,a.id,foes,label,tone,at,positions,e.type,duration,extra);
     if(friends.length)this.addRoute(a.id+'-support',a.id,friends,label,a.catId==='star'?'energy':'support',at,positions,e.type,duration,{...extra,style:['orange','pudding'].includes(a.catId)?'shield':a.catId==='star'?'star':'heal'});
    }
   }
   if(e.type==='hit'&&!bursts.has(e.from)&&!casters.has(e.from)&&e.cause!=='skill'){
    const reflected=e.cause==='reflect';this.addRoute(reflected?a.id+'-reflect':a.id,a.id,[e.to],reflected?'反伤':'普攻',tone,at,positions,'impact',.32,{style:e.shield?'shield':attackStyle(a),kind:'normal'});
    this.log(name(e.from),reflected?'反伤':'普攻',name(e.to),(e.crit?'暴击 ':'')+e.value+(e.shield?' · 护盾承受':''),tone,at);
   }
   if(e.type==='skill'){
    const info=CATS.find(c=>c.id===a.catId),targets=e.targets||[],friends=targets.filter(id=>id.startsWith('p')),foes=targets.filter(id=>id.startsWith('e'));
    this.routes.delete(a.id);
    if(foes.length)this.addRoute(a.id,a.id,foes,e.text,tone,at,positions,'impact',1.25,{style:attackStyle(a),kind:e.type==='skill'?'skill':'normal'});
    if(friends.length)this.addRoute(a.id+'-support',a.id,friends,e.text,a.catId==='star'?'energy':'support',at,positions,'impact',1.25,{kind:'skill',style:['orange','pudding'].includes(a.catId)?'shield':a.catId==='star'?'star':'heal'});
    this.log(a.name,info.skill,targets.length===1?name(targets[0]):friends.length&&foes.length?'敌方＋全队':friends.length?'我方全队':'敌方全体',skillEffect[a.catId],friends.length?'support':'attack',at,true);
   }
   if(e.type==='heal'&&!casters.has(e.from)&&a.side==='e'){
    this.addRoute(a.id+'-support',a.id,[e.to],'纸袋修补','support',at,positions,'impact',.7,{style:'heal'});
    this.log(name(a.id),'纸袋修补',name(e.to),'治疗 +'+e.value,'support',at,true);
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
