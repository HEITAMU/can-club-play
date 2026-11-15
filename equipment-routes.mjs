import {rewardDay} from './economy-limits.mjs';
export const EQUIPMENT_SERIES='旧街寻宝';
export const EQUIPMENT_ROUTES=[
 {id:'salvage',name:'废件仓库',mark:'Ⅰ',theme:'armor',slots:['claw','brace'],rule:'拆开废件堆，寻找爪套与挂件。前排铁壳怕法术，后排电池怕物理伤害。'},
 {id:'wardrobe',name:'旧衣库',mark:'Ⅱ',theme:'crowd',slots:['coat','collar'],rule:'旧衣架间挤满了杂物怪，清出道路后收集围巾与项圈。'},
 {id:'nightwatch',name:'夜巡货道',mark:'Ⅲ',theme:'armor',rule:'每日轮换两种装备部位。寻觅妙招会惊动守卫，追兵绕后袭击。'}
];
export const ROTATING_SLOTS=[['claw','brace'],['brace','coat'],['coat','collar'],['collar','claw']];
export const RUNE_CHANCE={normal:0.001,search:0.03};
export const equipmentRoute=kind=>EQUIPMENT_ROUTES.find(x=>x.id===kind);
// First published rotation starts with claw/pendant on 2026-11-16, Beijing time.
const ROTATION_EPOCH=20773;
export function rotationSlots(day){return [...ROTATING_SLOTS[((day-ROTATION_EPOCH)%4+4)%4]];}
export function equipmentRouteInfo(kind,now=Date.now(),search=false){const route=equipmentRoute(kind);if(!route)return null;const rotating=kind==='nightwatch',day=rewardDay(now);return {dropSlots:rotating?rotationSlots(day):[...route.slots],rotationDay:day,runeSearch:rotating&&search===true,runeChance:rotating?(search===true?RUNE_CHANCE.search:RUNE_CHANCE.normal):0};}
export function routeGearOptions(info,random=Math.random){
 if(info.kind==='nightwatch'&&random()<info.runeChance)return {slot:'rune'};
 return {slot:info.dropSlots[Math.min(info.dropSlots.length-1,Math.floor(random()*info.dropSlots.length))]};
}
