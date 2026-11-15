export const GUIDE_DONE=9;
export function normalizeGuide(raw,onboarded){return Number.isInteger(raw)?Math.max(0,Math.min(GUIDE_DONE,raw)):onboarded?GUIDE_DONE:0;}
export function nextGuide(step,event){return ({'0:start':1,'1:win':2,'2:companions':3,'3:upgrade':4,'4:equipment':5,'5:gear':6,'6:close':7,'7:battle':8,'8:win':9})[step+':'+event]??step;}
export const GUIDE=[null,
 {title:'第 1 关 · 自动出击',text:'两名伙伴会轮流攻击，先看他们拿下这一关。',target:'#battle-label'},
 {title:'首战获胜！',text:'点“伙伴”，把刚获得的鱼币用来培养橘座。',target:'[data-tab="cats"]'},
 {title:'让橘座升一级',text:'点击“升 1 级”，提高橘座的战斗属性。',target:'[data-profile-upgrade]'},
 {title:'再看看装备',text:'点击“装备”，查看橘座正在使用的装备。',target:'[data-crew-mode="equipment"]'},
 {title:'查看爪套',text:'点击爪套，看看它提供什么属性。',target:'.slot-claw [data-slot]'},
 {title:'装备会增强伙伴',text:'属性在这里查看；以后拿到新装备，也这样打开卡片穿戴。现在关闭卡片。',target:'#modal-close'},
 {title:'准备下一关',text:'升级完成了，点“出战”，让伙伴挑战第 2 关。',target:'[data-tab="battle"]'},
 {title:'第 2 关 · 再试一场',text:'左上角显示主线关卡，旁边显示回合。通关后即可自由探索。',target:'#battle-label'}
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
