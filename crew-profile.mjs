import {skillTuning,skillSummary,SKILL_STUDY} from './skill-training.mjs';
import {badgeHTML} from './growth-visual.mjs';
import {growthHTML} from './street-ui.mjs?v=0.25.0';
import {talentCards} from './talents.mjs?v=0.25.0';
import {CATS,MAX_LEVEL,catStats,upgradeCost,upgradeQuote,unlocked,ownsCompanion,levelCap,breakthroughQuote} from './core.mjs?v=0.25.0';
import {catSVG,icon,relicSVG,skillSVG} from './art.mjs?v=0.25.0';

const palettes={
 orange:['#aa875d','#dec394','#f0cd89'],ink:['#738a99','#b4c1c4','#c2d8e3'],
 milk:['#a78d91','#e0c8bc','#f4d8c6'],spark:['#a56f5c','#d5a586','#efbb90'],
 mint:['#648c7b','#b1ccae','#c5dfb8'],bolt:['#7e8b8d','#bfc6b2','#d9d5a9'],
 pudding:['#9f8865','#d7c59a','#eddbb2'],star:['#8d7d9b','#c5b5ca','#dfc5e2']
};
const passiveNames={orange:'稳稳接住',ink:'一击中的',milk:'加满一杯',spark:'余温未散',mint:'冷静一下',bolt:'彻底拆解',pudding:'硬气护体',star:'星光先行'};
const number=n=>n>=1e8?Math.floor(n/1e8)+'亿':n>=1e4?Math.floor(n/1e4)+'万':Math.floor(n).toLocaleString('zh-CN');
const effect=(value,type)=>'<strong class="skill-'+type+'">'+value+'</strong>';
const scaling=text=>'<span class="skill-scaling">（'+text+'）</span>';
export function crewSkill(id,level,stats){
 const sk=skillTuning(stats.skillRank),awake=level>=5,amount=(ratio,stat='atk')=>Math.round(stats[stat]*ratio).toLocaleString('zh-CN');
 const skills={
  orange:{description:'自身获得 '+effect(amount(sk.orangeSelf/100,'hp'),'shield')+scaling(''+sk.orangeSelf+'% 最大生命值')+' 护盾，其他队友获得各自 '+effect(''+sk.orangeTeam+'% 最大生命值','shield')+' 护盾。',passive:'受到的伤害降低 '+effect(sk.orangeGuard+'%','shield')+'。'},
  ink:{description:'三连击攻击生命值最低的敌人，合计造成 '+effect(sk.inkHit+'% 攻击力','damage')+' 物理伤害，获得 '+effect(''+sk.inkPen+' 点护甲穿透','armor')+'。'+(sk.inkRetarget?'目标死亡后，剩余攻击转向生命值最低的敌人。':''),passive:'暴击率提高 '+effect('15%','damage')+'。'},
  milk:{description:'为全体队友恢复 '+effect(amount(sk.milkHeal/100,'hp'),'heal')+scaling('奶盖最大生命值的 '+sk.milkHeal+'%')+' 生命值。',passive:'普攻额外回复 '+effect('10','energy')+' 能量。'},
  spark:{description:'对全体敌人造成 '+effect(sk.sparkHit+'% 攻击力','damage')+' 法术伤害，并灼烧目标 '+effect(sk.sparkDuration+' 回合','control')+'，每回合造成 '+effect(((awake?sk.sparkBurn:60)*(level>=40?1.2:1))+'% 攻击力','damage')+' 法术伤害。',passive:'每回合灼烧提高至 '+effect(sk.sparkBurn+'% 攻击力','damage')+'。'+(sk.sparkDetonate?'再次施加灼烧时，立即造成剩余灼烧伤害的 50%。':'')},
  mint:{description:'攻击一名敌人，造成 '+effect((sk.mintHit+(awake?30:0))+'% 攻击力','damage')+' 法术伤害，使其 '+effect('眩晕 1 回合','control')+'。优先攻击蓄力中的敌人，其次为治疗者。',passive:'主动技能伤害额外提高 '+effect('30% 攻击力','damage')+'。'},
  bolt:{description:'使敌方前排目标的当前护甲降低 '+effect(((awake?60:40)+sk.boltShred)+'%','armor')+'（下限为初始护甲的 20%），随后造成 '+effect(sk.boltHit+'% 攻击力','damage')+' 物理伤害。',passive:'技能护甲削减提高 '+effect('20%','armor')+'。'},
  pudding:{description:'获得 '+effect(amount(sk.puddingSelf/100,'hp'),'shield')+scaling(sk.puddingSelf+'% 最大生命值')+' 护盾。护盾达到 30% 最大生命值时蓄力，蓄力期间每次自身回合开始回复 50 能量；再获得 15% 最大生命值的护盾后，消耗当前护盾，对目标前排及其身后两名敌人造成 '+effect(sk.puddingShieldHit+'% 当前护盾值','damage')+' 的物理伤害。护盾破裂或受到控制时中断蓄力。冷却 2 回合，最快在开始蓄力的下一回合出拳。',passive:'护盾吸收伤害时也回复能量。'},
  star:{description:'为其他队友回复 '+effect(((level>=80?44:36)+sk.starEnergy)+' 点能量','energy')+'，并为全体队友恢复 '+effect(amount(sk.starHeal/100),'heal')+scaling(sk.starHeal+'% 攻击力')+' 生命值。'+(sk.starOverflow?'每溢出 10 点能量，转为目标最大生命值 2% 的护盾，上限 8%。':''),passive:'战斗开始时，额外获得 '+effect('40 点能量','energy')+'。'}
 };
 return skills[id];
}
export function crewPosition(state,id){
 const slot=state.party.indexOf(id);
 return slot<0?'未出战':slot<2?'前排 '+(slot+1):'后排 '+(slot-1);
}
export function crewUpgradeHTML(state,id){
 const c=CATS.find(c=>c.id===id),level=state.levels[id],open=ownsCompanion(state,c.id),quote=upgradeQuote(level,10,levelCap(state,id));
 return '<button class="crew-quick-upgrade" data-upgrade="'+id+'" data-upgrade-count="10" '+(!open||!quote.levels||state.gold<quote.cost?'disabled':'')+' aria-label="'+c.name+'升'+quote.levels+'级，花费'+quote.cost+'鱼币"><small>'+ (quote.levels?'＋'+quote.levels+'级':'升级')+'</small><span>'+(!open?'未结识':!quote.levels?'已满级':number(quote.cost)+' 鱼币')+'</span></button>';
}
export function crewRosterHTML(state,selected){
 return CATS.filter(c=>ownsCompanion(state,c.id)).map(c=>{
  const open=ownsCompanion(state,c.id);
  return '<article class="crew-roster-card"><button class="crew-pick'+(open?'':' is-locked')+'" data-crew="'+c.id+'" aria-pressed="'+(selected===c.id)+'" aria-label="查看'+c.name+(open?'':'，通过伙伴委托结识')+'">'+
   '<span class="crew-pick-art">'+catSVG(c.id,true)+'</span>'+
   (state.party.includes(c.id)?'<i class="crew-in-party" aria-label="出战中"></i>':'')+'</button></article>';
 }).join('');
}
export function crewProfileHTML(state,id,{modal=false}={}){
 const c=CATS.find(c=>c.id===id),open=ownsCompanion(state,c.id),level=state.levels[id],stats=catStats(state,id),cap=levelCap(state,id),bq=breakthroughQuote(state,id);
 const skill=crewSkill(id,level,stats),study=SKILL_STUDY[id],studyHTML='<details class="skill-level-list"><summary>技能升级</summary>'+[0,1,2,3].map(r=>'<div class="'+(r===stats.skillRank?'current':'')+'"><b>Lv.'+(r+1)+'</b> '+skillSummary(id,r)+'</div>').join('')+'</details>',awake=open&&level>=5,[wash,rim,accent]=palettes[id],quote=upgradeQuote(level,state.guideStep===3?1:10,cap),cost=quote.cost;
 const heading=modal?'h2':'h3',canInherit=open&&unlocked(state).some(d=>state.levels[d.id]>level);
 const growthMarkup=open?'<section class="crew-growth" aria-label="伙伴养成">'+growthHTML(state,id)+'</section>':'';
 const upgradeMarkup=open?'<div class="crew-actions"><button class="primary crew-upgrade" data-upgrade="'+id+'" data-profile-upgrade data-upgrade-count="'+(state.guideStep===3?1:10)+'" '+(level>=cap||state.gold<cost?'disabled':'')+'>'+'<span>'+(level>=cap?'已满级':'升 '+quote.levels+' 级')+'</span></button><div class="upgrade-cost" data-upgrade-cost="'+id+'">'+(quote.levels?icon('coin',12)+'<span>消耗 '+cost.toLocaleString('zh-CN')+'</span>':'')+'</div>'+'<button class="secondary crew-inherit" data-inherit-open="'+id+'" '+(canInherit?'':'disabled')+'>培养继承</button>'+'</div>':'<div class="crew-locked-note">尚未结识</div>';
 return '<article class="crew-profile'+(open?'':' is-locked')+'" data-profile-cat="'+id+'" style="--crew-wash:'+wash+';--crew-rim:'+rim+';--crew-accent:'+accent+'">'+
  '<div class="crew-hero-column"><div class="crew-hero"><div class="crew-identity"><span class="crew-role">'+c.job+'</span>'+
  '<'+heading+(modal?' id="modal-title"':'')+'>'+c.name+'</'+heading+'>'+
  '<span class="crew-level">'+(open?'Lv. <b>'+level+'</b>':'等待结识')+'</span>'+
  '<span class="crew-position">'+(open?crewPosition(state,id):'伙伴委托结识')+'</span></div>'+
  '<div class="crew-portrait"><span class="crew-portrait-halo" aria-hidden="true"></span>'+catSVG(id)+'</div><div class="crew-tag-row"><button class="cat-tag-open" data-cat-tag="'+id+'" aria-label="查看'+c.name+'的猫牌">'+badgeHTML(state.roster?.stars?.[id]||0,state.roster?.tagSteps?.[id]||0)+'</button></div></div>'+upgradeMarkup+'</div>'+
  '<section class="crew-attributes" aria-label="'+c.name+'的属性">'+
   '<div class="crew-section-label"><h4>人物属性</h4><span>'+(open?'普攻 · '+(stats.normalDamageType==='magic'?'法术':'物理'):'Lv.1 预览')+'</span></div>'+
   '<dl>'+[['生命',number(stats.hp)],['攻击',number(stats.atk)],['暴击',stats.crit+'<small>%</small>'],['护甲',stats.armor],['魔抗',stats.magicResist],['护甲穿透',stats.armorPen],['法术穿透',stats.magicPen]].map(([label,value])=>'<div><dt>'+label+'</dt><dd>'+value+'</dd></div>').join('')+'</dl></section>'+
  '<section class="crew-skills" aria-label="'+c.name+'的技能"><div class="crew-section-label"><h4>角色技能</h4></div>'+
  '<div class="crew-active-skill"><div class="crew-skill-title"><span class="crew-skill-icon">'+skillSVG(id)+'</span><h4>'+c.skill+'</h4><span>主动 · Lv.'+(study.index===0?stats.skillRank+1:1)+'</span></div>'+
  '<p class="crew-skill-description">'+skill.description+'</p>'+(study.index===0?studyHTML:'')+'</div>'+
  '<div class="crew-passive '+(awake?'is-awake':'is-dormant')+'"><span class="crew-passive-mark" aria-hidden="true">'+icon(awake?'star':'paw',23)+'</span><div><div class="crew-passive-title"><b>'+passiveNames[id]+'</b><span>'+(awake?'被动 · Lv.'+(study.index===1?stats.skillRank+1:1):'被动 · 角色 Lv.5 解锁')+'</span></div><p>'+skill.passive+'</p>'+(study.index===1?studyHTML:'')+'</div></div>'+talentCards(id,level,stats.skillRank).map(t=>'<div class="crew-passive '+(t.active?'is-awake':'is-dormant')+'"><div><div class="crew-passive-title"><b>'+t.name+'</b><span>'+ (t.active?'被动 · Lv.'+t.rank:'被动 · 角色 Lv.'+t.level+' 解锁')+'</span></div><p>'+t.desc+'</p>'+(t.trainable?studyHTML:'')+'</div></div>').join('')+'</section>'+
  growthMarkup+'</article>';
}
