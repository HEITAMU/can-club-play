import {CATS,MAX_LEVEL,MAX_PARTY,catStats,upgradeCost,unlocked,inheritanceFor} from './core.mjs?v=0.19.2';
import {catSVG,icon,relicSVG} from './art.mjs?v=0.19.2';

const palettes={
 orange:['#aa875d','#dec394','#f0cd89'],ink:['#738a99','#b4c1c4','#c2d8e3'],
 milk:['#a78d91','#e0c8bc','#f4d8c6'],spark:['#a56f5c','#d5a586','#efbb90'],
 mint:['#648c7b','#b1ccae','#c5dfb8'],bolt:['#7e8b8d','#bfc6b2','#d9d5a9'],
 pudding:['#9f8865','#d7c59a','#eddbb2'],star:['#8d7d9b','#c5b5ca','#dfc5e2']
};
const skillIcons={orange:'coat',ink:'claw',milk:'thermos',spark:'match',mint:'bowl',bolt:'scope',pudding:'thorn',star:'bell'};
const passiveNames={orange:'稳稳接住',ink:'一击中的',milk:'加满一杯',spark:'余温未散',mint:'冷静一下',bolt:'彻底拆解',pudding:'越打越饱',star:'星光先行'};
const number=n=>n>=1e8?(n/1e8).toFixed(1)+'亿':n>=1e4?(n/1e4).toFixed(1)+'万':Math.floor(n).toLocaleString('zh-CN');
const metric=(value,label)=>({value,label});
export function crewSkill(id,level){
 const awake=level>=5;
 const skills={
  orange:{metrics:[metric('45%','自身护盾'),metric('12%','队友护盾')],note:'按各自最大生命'},
  ink:{metrics:[metric('330%','攻击伤害')],note:'三连击 · 最低生命目标 · 穿透部分护甲'},
  milk:{metrics:[metric('28%','全队治疗')],note:'按奶盖最大生命'},
  spark:{metrics:[metric('160%','群体伤害'),metric('30%','每秒灼烧')],note:'按自身攻击 · 灼烧 '+(awake?'6':'4')+' 秒'},
  mint:{metrics:[metric('230%','攻击伤害'),metric(awake?'2.6秒':'1.8秒','眩晕')],note:'攻击生命最高的敌人 · 打断蓄力'},
  bolt:{metrics:[metric('300%','攻击伤害'),metric(awake?'75%':'50%','永久降甲')],note:'单体破甲'},
  pudding:{metrics:[metric('140%','群体伤害'),metric('18%','全队护盾')],note:'护盾按各自最大生命'},
  star:{metrics:[metric('+48','队友能量'),metric('160%','全队治疗')],note:'能量给其他队友 · 治疗按星斑攻击'}
 };
 return skills[id];
}
export function crewPosition(state,id){
 const slot=state.party.indexOf(id);
 return slot<0?'未出战':slot<2?'前排 '+(slot+1):'后排 '+(slot-1);
}
export function crewRosterHTML(state,selected){
 return CATS.map(c=>{
  const open=state.highest>=c.unlock;
  return '<button class="crew-pick'+(open?'':' is-locked')+'" data-crew="'+c.id+'" aria-pressed="'+(selected===c.id)+'" aria-label="查看'+c.name+(open?'':'，第 '+c.unlock+' 关结识')+'">'+
   '<span class="crew-pick-art">'+catSVG(c.id,true)+'</span><b>'+c.name+'</b>'+
   '<small>'+(open?'Lv.'+state.levels[c.id]:'未结识')+'</small>'+
   (state.party.includes(c.id)?'<i class="crew-in-party" aria-label="出战中"></i>':'')+'</button>';
 }).join('');
}
function deploymentHTML(state,id){
 const inParty=state.party.includes(id),level=state.levels[id];
 return '<details class="crew-deployment"><summary><b>调整阵容</b><span>'+crewPosition(state,id)+' <i aria-hidden="true">⌄</i></span></summary>'+
 '<div class="crew-slots">'+Array.from({length:MAX_PARTY},(_,i)=>{
  const old=state.party[i],transfer=inheritanceFor(state,i,id),label=i<2?'前排 '+(i+1):'后排 '+(i-1);
  return '<button data-equip="'+i+'" '+(old===id||i>state.party.length?'disabled':'')+'>'+
   '<small>'+label+'</small><b>'+(old?CATS.find(c=>c.id===old).name:'空位')+'</b>'+
   '<span>'+(old===id?'当前':inParty?'移到这里':old?'替换':'上阵')+'</span>'+
   (transfer?'<em>继承 Lv.'+transfer.fromLevel+'</em><small>'+CATS.find(c=>c.id===old).name+' → Lv.'+level+'</small>':'')+'</button>';
 }).join('')+'</div><p class="crew-deploy-note">调整后重新挑战当前关卡</p></details>';
}
export function crewProfileHTML(state,id,{modal=false}={}){
 const c=CATS.find(c=>c.id===id),open=state.highest>=c.unlock,level=state.levels[id],stats=catStats(state,id);
 const skill=crewSkill(id,level),awake=open&&level>=5,[wash,rim,accent]=palettes[id],cost=upgradeCost(level);
 const heading=modal?'h2':'h3',canInherit=open&&unlocked(state).some(d=>state.levels[d.id]>level);
 return '<article class="crew-profile'+(open?'':' is-locked')+'" data-profile-cat="'+id+'" style="--crew-wash:'+wash+';--crew-rim:'+rim+';--crew-accent:'+accent+'">'+
  '<div class="crew-hero"><div class="crew-identity"><span class="crew-role">'+c.job+'</span>'+
  '<'+heading+(modal?' id="modal-title"':'')+'>'+c.name+'</'+heading+'>'+
  '<span class="crew-level">'+(open?'Lv. <b>'+level+'</b>':'等待结识')+'</span>'+
  '<span class="crew-position">'+(open?crewPosition(state,id):'第 '+c.unlock+' 关加入')+'</span></div>'+
  '<div class="crew-portrait"><span class="crew-portrait-halo" aria-hidden="true"></span>'+catSVG(id)+'</div></div>'+
  '<section class="crew-attributes" aria-label="'+c.name+'的属性">'+
   '<div class="crew-section-label"><h4>人物属性</h4><span>'+(open?'当前属性':'Lv.1 预览')+'</span></div>'+
   '<dl>'+[['生命',number(stats.hp)],['攻击',number(stats.atk)],['间隔',stats.interval.toFixed(2)+'<small>秒</small>'],['暴击',Math.round(stats.crit*100)+'<small>%</small>']].map(([label,value])=>'<div><dt>'+label+'</dt><dd>'+value+'</dd></div>').join('')+'</dl></section>'+
  '<section class="crew-skills" aria-label="'+c.name+'的技能"><div class="crew-section-label"><h4>角色技能</h4><span>能量满自动释放</span></div>'+
  '<div class="crew-active-skill"><div class="crew-skill-title"><span class="crew-skill-icon">'+relicSVG(skillIcons[id])+'</span><h4>'+c.skill+'</h4><span>主动</span></div>'+
  '<div class="crew-skill-metrics">'+skill.metrics.map(m=>'<div><strong>'+m.value+'</strong><span>'+m.label+'</span></div>').join('')+'</div>'+
  '<p>'+skill.note+'</p></div>'+
  '<div class="crew-passive '+(awake?'is-awake':'is-dormant')+'"><span class="crew-passive-mark" aria-hidden="true">'+icon(awake?'star':'paw',23)+'</span><div><div class="crew-passive-title"><b>'+passiveNames[id]+'</b><span>'+(awake?'被动 · 已觉醒':'被动 · Lv.5 解锁')+'</span></div><p>'+c.passive.replace(/^5 级：/,'').replace(/。$/,'')+'</p></div></div></section>'+
  (open?'<div class="crew-actions"><button class="primary crew-upgrade" data-upgrade="'+id+'" data-profile-upgrade aria-label="'+(level>=MAX_LEVEL?c.name+'已满级':'升级'+c.name+'，花费'+cost+'鱼币')+'" '+(level>=MAX_LEVEL||state.gold<cost?'disabled':'')+'>'+icon('coin',23)+'<span>'+(level>=MAX_LEVEL?'已满级':'升级 · '+number(cost))+'</span></button>'+
   (canInherit?'<button class="secondary crew-inherit" data-inherit-open="'+id+'">培养继承</button>':'')+'</div>'+deploymentHTML(state,id):
   '<div class="crew-locked-note">通过第 <b>'+c.unlock+'</b> 关后加入</div>')+'</article>';
}
