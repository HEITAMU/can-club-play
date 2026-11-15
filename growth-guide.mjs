import {teamPlan} from './team-plans.mjs';
import {QUESTS,questValue,CATS,starQuote,MAX_STAGE} from './core.mjs';
import {gearOwner} from './equipment.mjs';
import {materialIcon} from './loot-icons.mjs';
export function nextGrowth(s,battle=null){
 if(battle&&!battle.result){
  if(battle.mode==='activity')return {title:'正在挑战'+battle.activity.name,text:'完成当前委托后领取奖励，点击结算中的奖励可以查看详情。',action:'battle',label:'查看战斗'};
  if(battle.weekly||battle.mode==='arena')return {title:'正在挑战'+(battle.weekly?.name||'街头擂台'),text:'完成当前挑战后领取奖励。',action:'battle',label:'查看战斗'};
 }
 if(s.highest<3)return {title:'先通关第 3 关',text:'主线会自动推进。打不过时，先用鱼币给上阵伙伴升级。',action:'battle',label:'继续主线'};
 if(!s.activities.cleared.salvage)return {title:'去废件仓库拿装备',text:'街区 → 委托板 → 装备 → 废件仓库。完成挑战，装备会进入背包。',action:'salvage',label:'前往废件仓库'};
 if(!s.guidance?.equipmentWorn&&s.inventory.items.some(e=>!gearOwner(s,e.id)))return {title:'给伙伴穿上新装备',text:'选中一位伙伴，点背包中的装备，再点“穿戴”。穿戴一次就会完成这一步。',action:'equipment',label:'前往穿戴'};
 const ready=teamPlan(s).order.filter(id=>s.party.includes(id)).find(id=>{const q=starQuote(s,id);return !q.maxed&&q.have>=q.shards&&s.growth.notes>=q.notes;});
 if(ready){const q=starQuote(s,ready),name=CATS.find(c=>c.id===ready).name;return {title:name+'可以升阶',text:(s.growthRebalancePending?'此前培养已补回升星材料。':'')+'这次生命和攻击提升 '+q.gain+'%，升星后继续推进主线。',action:'cat-tag',id:ready,label:q.ready?'前往进阶':'前往升星'};}
 if(s.runCleared>=MAX_STAGE)return {title:'主线已通关，挑战街区硬仗',text:'继续挑战街区硬仗、街头擂台与每周委托，完善装备和妙招牌搭配。',action:'hard',label:'前往街区硬仗'};
 if(battle?.result==='lose'&&battle.mode==='patrol'&&!battle.weekly){const id=teamPlan(s).order.filter(id=>s.party.includes(id)).find(id=>!starQuote(s,id).maxed);if(id)return {title:'积攒材料，给伙伴升星',text:'伙伴信物来自失物追寻，训练笔记来自后巷清扫。升星是前期的大幅提升来源。',action:'cat-tag',id,label:'查看升星'};return {title:'强化装备后再挑战',text:'升级装备、调整套装和妙招牌，再继续推进主线。',action:'equipment',label:'前往装备'};}
 return {title:'继续推进主线',text:'升星带来前期的明显提升；之后逐渐以装备、套装和妙招牌为主。',action:'battle',label:'回到战场'};
}
export function questDestination(q){return q.key==='upgrades'?'train':q.key==='relicCount'?'salvage':q.key==='cats'?'recruit':q.key==='arenaCleared'?'arena':'battle';}
export function growthGuideHTML(s,battle=null){const next=nextGrowth(s,battle),ready=QUESTS.filter(q=>!s.claimed.includes(q.id)&&questValue(s,q)>=q.goal),sum=ready.reduce((n,q)=>n+q.reward,0);return `<div class="growth-notebook"><header><small>远征队手账</small><h2 id="modal-title">接下来做什么</h2></header><section class="growth-next"><small>当前目标</small><h3>${next.title}</h3><p>${next.text}</p><button class="primary wide" data-growth-go="${next.action}"${next.id?` data-growth-cat="${next.id}"`:""}>${next.label} ›</button></section><section class="gear-directions"><h3>${materialIcon('gear',30)} 装备怎么弄</h3><p><b>获得</b>　通关第 3 关后，到委托板的旧街寻宝，按部位选择废件仓库、旧衣库或夜巡货道。</p><p><b>穿戴</b>　伙伴 → 装备，先选人，再点右侧背包中的装备 → 穿戴。</p><p><b>强化</b>　点击身上已穿戴的装备，查看强化消耗和提升，再点强化。</p><div><button data-growth-go="salvage">去拿装备 ›</button><button data-growth-go="equipment">穿戴 / 强化 ›</button></div></section><div class="growth-reward-heading"><h3>成长奖励</h3><button id="claim-quests" ${ready.length?'':'disabled'}>${ready.length?'领取 '+sum+' 鱼币':'暂无待领'}</button></div><div class="quest-list">${QUESTS.map(q=>{const v=Math.min(questValue(s,q),q.goal),claimed=s.claimed.includes(q.id),done=v>=q.goal;return `<article class="growth-task ${claimed?'claimed':done?'complete':''}"><div><b>${q.name}</b><p>${q.desc}</p></div><span class="growth-reward">${materialIcon('gold',22)} ${q.reward}</span><div class="growth-progress"><i style="width:${v/q.goal*100}%"></i></div><small>${v} / ${q.goal}</small>${claimed?'<span class="growth-stamp">已领取</span>':done?`<button data-growth-claim="${q.id}">领取</button>`:`<button data-growth-go="${questDestination(q)}">前往 ›</button>`}</article>`;}).join('')}</div></div>`;}
