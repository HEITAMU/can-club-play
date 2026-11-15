import {FINISHED_ROSTER} from './finished-roster-data.mjs';
import {FINISHED_SPARK} from './finished-spark-data.mjs';
import {ICON_BOUNDS} from './icon-bounds.mjs';
import {webAsset} from './web-assets.mjs';
// Shared first-visit surfaces; never download unowned characters at startup.
export const COMMON_UI_ASSETS=[
 './assets/ui/income-stall-v0272.webp',
 './assets/painted/items.webp',
 './assets/scenes/neighborhood-v0220.webp',
 './assets/scenes/formation-room-v02620.webp',
 './assets/ui/paper-grain-v02642.webp',
 './assets/ui/cat-tag-wide-v02679.webp',
 './assets/ui/equipment-slots-v0281.webp',
 './assets/materials/harbor-materials-v02641.webp',
 './assets/materials/scrap-v02643.webp',
 ...['equipment','runes'].map(key=>'./assets/ui/'+ICON_BOUNDS[key].file)
];
export function startupAssets(ownedIds){
 const urls=[...COMMON_UI_ASSETS];
 for(const id of ownedIds){
  const art=id==='spark'?{...FINISHED_SPARK,portrait:'./assets/finished/spark-portrait-v0211.webp'}:FINISHED_ROSTER[id];
  if(art)urls.push(webAsset(art.atlas),webAsset(art.portrait));
 }
 return [...new Set(urls)];
}

export const BACKGROUND_UI_ASSETS=[
 './assets/scenes/commissions-v02646.webp',
 './assets/scenes/quest-locations-v02672.webp',
 './assets/scenes/equipment-room-v02672.webp',
 './assets/ui/battle-results-v02641.webp',
 './assets/ui/journal-challenge-v02677.webp',
 ...Array.from({length:6},(_,i)=>`./assets/mobile/street-${i}-v02684.webp`)
];
export async function warmInterfaceAssets(load,shouldStop=()=>false){
 for(const url of BACKGROUND_UI_ASSETS){
  if(shouldStop())return;
  try{await load([url],{priority:0,timeout:12000});}catch{/* retry on actual entry */}
 }
}
