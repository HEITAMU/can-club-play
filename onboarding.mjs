export const GUIDE_DONE=9;
export const GUIDE_CAN=12;
export function guideNumber(step){return step>=11?step-2:step;}
export function normalizeGuide(raw,onboarded){return Number.isInteger(raw)&&raw>=11&&raw<=13?raw:raw===10?2:Number.isInteger(raw)?Math.max(0,Math.min(GUIDE_DONE,raw)):onboarded?GUIDE_DONE:0;}
export function nextGuide(step,event){if(step===1&&event==='continue')return 2;return ({'0:start':1,'2:companions':3,'3:upgrade':4,'4:equipment':5,'5:gear':6,'6:continue':7,'7:battle':8,'8:continue':11,'11:continue':12,'12:can':13,'13:continue':9})[step+':'+event]??step;}
export const GUIDE=[null,
 {mode:'info',title:'第 1 关 · 自动出击',text:'伙伴会自动轮流攻击。先认识操作，完成引导后就会出发。',target:'#battle-label'},
 {mode:'action',title:'先培养伙伴',text:'点“伙伴”，用鱼币给橘座升一级。',target:'[data-tab="cats"]'},
 {mode:'action',title:'让橘座升一级',text:'点击“升 1 级”，提高橘座的战斗属性。',target:'[data-profile-upgrade]'},
 {mode:'action',title:'再看看装备',text:'点击“装备”，查看橘座正在使用的装备。',target:'[data-crew-mode="equipment"]'},
 {mode:'action',title:'查看爪套',text:'点击爪套，看看它提供什么属性。',target:'.slot-claw [data-slot]'},
 {mode:'info',title:'装备会增强伙伴',text:'属性在这里查看；以后拿到新装备，也这样打开卡片穿戴。',target:'#modal-content'},
 {mode:'action',title:'准备下一关',text:'升级完成了，点“出战”，返回当前主线战斗。',target:'[data-tab="battle"]'},
 {mode:'info',title:'主线关卡与回合',text:'左上角显示主线关卡，旁边显示回合。继续推进主线，也可以自由探索其他页面。',target:'#battle-label'},
 null,null,
 {mode:'info',title:'开罐啦 · 紧急支援',text:'为存活伙伴恢复 20% 最大生命，对敌人造成伤害，并立刻打断敌人的蓄力。',target:'#open-can'},
 {mode:'action',title:'试着开一罐',text:'点击高亮的“开罐啦”，亲自使用一次支援。',target:'#open-can'},
 {mode:'info',title:'留意冷却秒数',text:'使用后冷却 8 秒，按钮显示剩余秒数。冷却结束可再次使用；伙伴血量低或敌人蓄力时，记得开罐。',target:'#open-can'}
];

// Restore the actionable screen; equipment cards are transient and must reopen.
export function guideResume(step){
 const resumed=step===6?5:step;
 return {step:resumed,tab:resumed>=3&&resumed<=7?'cats':'battle',mode:resumed>=5&&resumed<=7?'equipment':'profile',waiting:resumed>=2&&resumed<=7};
}
export function guideCardTop(target,height,viewportHeight){
 const below=target.bottom+18,above=target.top-height-18;
 if(below+height<=viewportHeight-12)return below;
 if(above>=12)return above;
 return Math.max(12,Math.min(viewportHeight-height-12,below));
}
