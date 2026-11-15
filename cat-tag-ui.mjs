import {starQuote} from './companions.mjs';
import {pawHTML,BADGE_NAMES} from './growth-visual.mjs';
import {CATS,catStats} from './core.mjs';
import {materialCosts} from './material-info.mjs';
export function catTagCardHTML(s,id){
 const q=starQuote(s,id),can=q.owned&&!q.maxed&&q.have>=q.shards&&s.growth.notes>=q.notes;
 const before=catStats(s,id),after=catStats({...s,roster:{...s.roster,stars:{...s.roster.stars,[id]:q.nextRank},tagSteps:{...s.roster.tagSteps,[id]:q.nextStep}}},id),n=v=>Math.round(v).toLocaleString('zh-CN');
 return `<section class="cat-tag-card"><h2 id="modal-title">${CATS.find(c=>c.id===id).name}的猫牌</h2><div class="tag-comparison"><div><small>当前</small>${pawHTML(q.rank,q.step)}<b>${BADGE_NAMES[q.rank]}</b><span>${q.maxed?'已满阶':'品质进阶'}</span><p>生命、攻击 +${q.bonus}%</p></div>${q.maxed?'':`<i aria-hidden="true">›</i><div><small>${q.ready?'下一品质':'下一星'}</small>${pawHTML(q.nextRank,q.nextStep)}<b>${BADGE_NAMES[q.nextRank]}</b><span>${q.nextRank===9?'已满阶':'品质进阶'}</span><p>生命、攻击 +${q.nextBonus}%</p></div>`}</div>${q.maxed?'':`<div class="cat-tag-gain"><strong>本次生命、攻击提升 ${q.gain}%</strong><span>攻击 ${n(before.atk)} → <b>${n(after.atk)}</b></span><span>生命 ${n(before.hp)} → <b>${n(after.hp)}</b></span></div>${materialCosts(s,{shards:q.shards,notes:q.notes},id)}`}<button id="cat-tag-upgrade" class="primary wide" ${can?'':'disabled'}>${q.maxed?'已满阶':!can?'材料不足':q.ready?'升阶':'升阶'}</button>${q.maxed?'':'<div class="cat-tag-sources"><button id="cat-tag-shards">获取信物 ›</button><button id="cat-tag-notes">获取笔记 ›</button></div>'}</section>`;
}
