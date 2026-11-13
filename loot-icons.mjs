import {catSVG} from './art.mjs?v=0.25.1';
export const MATERIAL_NAMES={gold:'鱼币',supplies:'经营物资',badges:'突破徽章',notes:'训练笔记',seals:'历练印记',shards:'伙伴信物',essence:'打磨砂',scrap:'修补零件',gear:'装备'};
const paths={
 gold:'<circle cx="16" cy="16" r="12" fill="#d8ae60"/><path d="m7 16 5-4 7 0 6 4-6 4h-7z" fill="#fff0b5"/><circle cx="19" cy="15" r="1" fill="#665134"/>',
 supplies:'<path d="M4 10h24v18H4z" fill="#a77f55"/><path d="m4 10 6-6h16l2 6M16 10v18M4 19h24" stroke="#e4c294"/>',
 badges:'<path d="m8 3 8 5 8-5-3 17H11z" fill="#a46e64"/><path d="m16 10 11 6-4 12H9L5 16z" fill="#dfbe79"/><path d="m16 13 2 5 5 1-4 3 1 4-4-2-4 2 1-4-4-3 5-1z" fill="#826747"/>',
 notes:'<path d="M7 3h18v26H7z" fill="#d9ca9c"/><path d="M7 3h4v26H7z" fill="#8eaa9b"/><path d="M14 10h7M14 15h7M14 20h5" stroke="#7d7662"/>',
 seals:'<path d="M6 4h20v24H6z" fill="#dbcb9d"/><circle cx="16" cy="16" r="8" fill="#ad675a"/><path d="m16 10 2 4 4 2-4 2-2 4-2-4-4-2 4-2z" fill="#f2d6ac"/>',
 essence:'<path d="M11 4h10v5l5 5v14H6V14l5-5z" fill="#b1c4bd"/><path d="M8 20q8-6 16 0v6H8z" fill="#d6bc8d"/><path d="M11 4h10v4H11z" fill="#9a785b"/><path d="m14 17 2-3 2 3" fill="#fff1cc"/>',
 scrap:'<path d="m5 7 6-3 5 5-4 5 8 8 5-1 3 5-5 3-5-4-8-9-5-2z" fill="#a4b6b5"/><path d="m22 4 6 6-6 6-6-6z" fill="#d1b481"/>',
 gear:'<path d="m7 9 9-5 9 5-3 5v14H10V14z" fill="#9fb2a7"/><path d="m10 6 6 5 6-5M16 11v17" stroke="#e5d5b2"/>',
 shards:'<path d="m16 2 12 14-12 14L4 16z" fill="#b8a5c9"/><path d="m10 18 1-8 5 4 5-4 1 8-6 6z" fill="#f0dcc0"/>'
};
export function materialIcon(id,size=24,companion){return `<span class="material-icon material-${id}" style="width:${size}px;height:${size}px" title="${MATERIAL_NAMES[id]||id}" aria-label="${MATERIAL_NAMES[id]||id}">${id==='shards'&&companion?catSVG(companion,true):`<svg viewBox="0 0 32 32" aria-hidden="true">${paths[id]||paths.gear}</svg>`}</span>`;}
export function rewardIcons(reward,{companion,counts=true}={}){const entries=Object.keys(MATERIAL_NAMES).filter(k=>reward[k]>0||k==='gear'&&reward.gearLoot?.item);return '<span class="reward-icons">'+entries.map(k=>'<span class="reward-chip">'+materialIcon(k,25,companion)+(counts?'<b>'+((reward[k]===true||!reward[k])?1:reward[k])+'</b>':'')+'</span>').join('')+'</span>';}
