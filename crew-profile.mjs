import {CATS,MAX_LEVEL,catStats,upgradeCost,upgradeQuote,unlocked} from './core.mjs?v=0.21.3';
import {catSVG,icon,relicSVG} from './art.mjs?v=0.21.3';

const palettes={
 orange:['#aa875d','#dec394','#f0cd89'],ink:['#738a99','#b4c1c4','#c2d8e3'],
 milk:['#a78d91','#e0c8bc','#f4d8c6'],spark:['#a56f5c','#d5a586','#efbb90'],
 mint:['#648c7b','#b1ccae','#c5dfb8'],bolt:['#7e8b8d','#bfc6b2','#d9d5a9'],
 pudding:['#9f8865','#d7c59a','#eddbb2'],star:['#8d7d9b','#c5b5ca','#dfc5e2']
};
const skillIcons={orange:'coat',ink:'claw',milk:'thermos',spark:'match',mint:'bowl',bolt:'scope',pudding:'thorn',star:'bell'};
const passiveNames={orange:'稳稳接住',ink:'一击中的',milk:'加满一杯',spark:'余温未散',mint:'冷静一下',bolt:'彻底拆解',pudding:'越打越饱',star:'星光先行'};
const number=n=>n>=1e8?(n/1e8).toFixed(1)+'亿':n>=1e4?(n/1e4).toFixed(1)+'万':Math.floor(n).toLocaleString('zh-CN');
const effect=(value,type)=>'<strong class="skill-'+type+'">'+value+'</strong>';
const scaling=text=>'<span class="skill-scaling">（'+text+'）</span>';
export function crewSkill(id,level,stats){
 const awake=level>=5,amount=(ratio,stat='atk')=>Math.round(stats[stat]*ratio).toLocaleString('zh-CN');
 const skills={
  orange:{description:'为自身提供 '+effect(amount(.45,'hp'),'shield')+scaling('45% 最大生命值')+' 护盾，并为其他队友提供相当于各自 '+effect('12% 最大生命值','shield')+' 的护盾。',passive:'受到的伤害降低 '+effect('15%','shield')+'。'},
  ink:{description:'向当前生命值最低的敌人发起三连击，合计造成 '+effect(amount(3.3),'damage')+scaling('330% 攻击力')+' 物理伤害。本次攻击额外获得 '+effect('25 点护甲穿透','armor')+'。',passive:'暴击率提高 '+effect('15 个百分点','damage')+'。'},
  milk:{description:'为全体队友恢复 '+effect(amount(.28,'hp'),'heal')+scaling('奶盖最大生命值的 28%')+' 生命值。',passive:'普攻回复的能量由 '+effect('22','energy')+' 点提高至 '+effect('32','energy')+' 点。'},
  spark:{description:'对全体敌人造成 '+effect(amount(1.6),'damage')+scaling('160% 攻击力')+' 法术伤害，并灼烧目标 '+effect(awake?'6 秒':'4 秒','control')+'，每秒造成 '+effect(amount(.3),'damage')+scaling('30% 攻击力')+' 法术伤害。',passive:'灼烧持续时间由 '+effect('4 秒','control')+' 延长至 '+effect('6 秒','control')+'。'},
  mint:{description:'对当前生命值最高的敌人造成 '+effect(amount(2.3),'damage')+scaling('230% 攻击力')+' 法术伤害，使其 '+effect('眩晕 '+(awake?'2.6':'1.8')+' 秒','control')+' 并打断蓄力。',passive:'眩晕持续时间由 '+effect('1.8 秒','control')+' 延长至 '+effect('2.6 秒','control')+'。'},
  bolt:{description:'使敌方前排目标的当前护甲永久降低 '+effect(awake?'75%':'50%','armor')+'，随后造成 '+effect(amount(3),'damage')+scaling('300% 攻击力')+' 物理伤害。',passive:'技能对当前护甲的削减比例由 '+effect('50%','armor')+' 提高至 '+effect('75%','armor')+'。'},
  pudding:{description:'对全体敌人造成 '+effect(amount(1.4),'damage')+scaling('140% 攻击力')+' 物理伤害，并为全体队友提供相当于各自 '+effect('18% 最大生命值','shield')+' 的护盾。',passive:'造成生命伤害时，回复相当于该伤害 '+effect('22%','heal')+' 的生命值。'},
  star:{description:'为其他队友回复 '+effect('48 点能量','energy')+'，并为全体队友恢复 '+effect(amount(1.6),'heal')+scaling('160% 攻击力')+' 生命值。',passive:'战斗开始时，额外获得 '+effect('40 点能量','energy')+'。'}
 };
 return skills[id];
}
export function crewPosition(state,id){
 const slot=state.party.indexOf(id);
 return slot<0?'未出战':slot<2?'前排 '+(slot+1):'后排 '+(slot-1);
}
export function crewUpgradeHTML(state,id){
 const c=CATS.find(c=>c.id===id),level=state.levels[id],open=state.highest>=c.unlock,quote=upgradeQuote(level);
 return '<button class="crew-quick-upgrade" data-upgrade="'+id+'" data-upgrade-count="10" '+(!open||!quote.levels||state.gold<quote.cost?'disabled':'')+' aria-label="'+c.name+'升'+quote.levels+'级，花费'+quote.cost+'鱼币"><small>'+ (quote.levels?'＋'+quote.levels+'级':'升级')+'</small><span>'+(!open?'未结识':!quote.levels?'已满级':number(quote.cost)+' 鱼币')+'</span></button>';
}
export function crewRosterHTML(state,selected){
 return CATS.map(c=>{
  const open=state.highest>=c.unlock;
  return '<article class="crew-roster-card"><button class="crew-pick'+(open?'':' is-locked')+'" data-crew="'+c.id+'" aria-pressed="'+(selected===c.id)+'" aria-label="查看'+c.name+(open?'':'，第 '+c.unlock+' 关结识')+'">'+
   '<span class="crew-pick-art">'+catSVG(c.id,true)+'</span><b>'+c.name+'</b><small>'+(open?'Lv.'+state.levels[c.id]:'未结识')+'</small>'+
   (state.party.includes(c.id)?'<i class="crew-in-party" aria-label="出战中"></i>':'')+'</button>'+crewUpgradeHTML(state,c.id)+'</article>';
 }).join('');
}
export function crewProfileHTML(state,id,{modal=false}={}){
 const c=CATS.find(c=>c.id===id),open=state.highest>=c.unlock,level=state.levels[id],stats=catStats(state,id);
 const skill=crewSkill(id,level,stats),awake=open&&level>=5,[wash,rim,accent]=palettes[id],cost=upgradeCost(level);
 const heading=modal?'h2':'h3',canInherit=open&&unlocked(state).some(d=>state.levels[d.id]>level);
 return '<article class="crew-profile'+(open?'':' is-locked')+'" data-profile-cat="'+id+'" style="--crew-wash:'+wash+';--crew-rim:'+rim+';--crew-accent:'+accent+'">'+
  '<div class="crew-hero"><div class="crew-identity"><span class="crew-role">'+c.job+'</span>'+
  '<'+heading+(modal?' id="modal-title"':'')+'>'+c.name+'</'+heading+'>'+
  '<span class="crew-level">'+(open?'Lv. <b>'+level+'</b>':'等待结识')+'</span>'+
  '<span class="crew-position">'+(open?crewPosition(state,id):'第 '+c.unlock+' 关加入')+'</span></div>'+
  '<div class="crew-portrait"><span class="crew-portrait-halo" aria-hidden="true"></span>'+catSVG(id)+'</div></div>'+
  '<section class="crew-attributes" aria-label="'+c.name+'的属性">'+
   '<div class="crew-section-label"><h4>人物属性</h4><span>'+(open?'普攻 · '+(stats.normalDamageType==='magic'?'法术':'物理'):'Lv.1 预览')+'</span></div>'+
   '<dl>'+[['生命',number(stats.hp)],['攻击',number(stats.atk)],['间隔',stats.interval.toFixed(2)+'<small>秒</small>'],['暴击',Math.round(stats.crit*100)+'<small>%</small>'],['护甲',stats.armor],['魔抗',stats.magicResist],['护甲穿透',stats.armorPen],['法术穿透',stats.magicPen]].map(([label,value])=>'<div><dt>'+label+'</dt><dd>'+value+'</dd></div>').join('')+'</dl></section>'+
  '<section class="crew-skills" aria-label="'+c.name+'的技能"><div class="crew-section-label"><h4>角色技能</h4><span>能量满自动释放</span></div>'+
  '<div class="crew-active-skill"><div class="crew-skill-title"><span class="crew-skill-icon">'+relicSVG(skillIcons[id])+'</span><h4>'+c.skill+'</h4><span>主动</span></div>'+
  '<p class="crew-skill-description">'+skill.description+'</p></div>'+
  '<div class="crew-passive '+(awake?'is-awake':'is-dormant')+'"><span class="crew-passive-mark" aria-hidden="true">'+icon(awake?'star':'paw',23)+'</span><div><div class="crew-passive-title"><b>'+passiveNames[id]+'</b><span>'+(awake?'被动 · 已觉醒':'被动 · Lv.5 解锁')+'</span></div><p>'+skill.passive+'</p></div></div></section>'+
  (open?'<div class="crew-actions"><button class="primary crew-upgrade" data-upgrade="'+id+'" data-profile-upgrade aria-label="'+(level>=MAX_LEVEL?c.name+'已满级':'升级'+c.name+'，花费'+cost+'鱼币')+'" '+(level>=MAX_LEVEL||state.gold<cost?'disabled':'')+'>'+icon('coin',23)+'<span>'+(level>=MAX_LEVEL?'已满级':'升级 · '+number(cost))+'</span></button>'+
   (canInherit?'<button class="secondary crew-inherit" data-inherit-open="'+id+'">培养继承</button>':'')+'</div><button class="crew-deployment-open" data-open-formation>调整阵容 <span>拖动换位 ›</span></button>':
   '<div class="crew-locked-note">通过第 <b>'+c.unlock+'</b> 关后加入</div>')+'</article>';
}
