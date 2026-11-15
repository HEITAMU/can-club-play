import {GEAR_SLOTS} from './equipment.mjs';
import {equipmentSVG} from './art.mjs';
const cells={claw:0,brace:1,coat:2,collar:3};
export function equipmentCategoryIcon(slot,size=40){const name=GEAR_SLOTS.find(s=>s.id===slot)?.name||'装备';return slot==='rune'?`<span class="equipment-category rune-category" style="width:${size}px;height:${size}px" role="img" aria-label="妙招牌">${equipmentSVG({slot:'rune',rune:'focus'})}</span>`:`<span class="equipment-category" role="img" aria-label="${name}" style="width:${size}px;height:${size}px;--slot-x:${cells[slot]%2*100}%;--slot-y:${Math.floor(cells[slot]/2)*100}%"></span>`;}
export function equipmentDropsHTML(q){if(!q.dropSlots)return '';return '<div class="equipment-drop-types" aria-label="掉落部位">'+[...q.dropSlots,...(q.kind==='nightwatch'?['rune']:[])].map(slot=>`<span>${equipmentCategoryIcon(slot)}<small>${GEAR_SLOTS.find(s=>s.id===slot).name}${slot==='rune'?` · ${q.runeSearch?'3%':'0.1%'}`:''}</small></span>`).join('')+'</div>';}
