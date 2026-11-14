// Shared by DOM and WeChat canvas; elements only affect presentation, not mitigation.
export const DAMAGE_COLORS=Object.freeze({physical:'#ffda55',magic:'#bc8aff',fire:'#ff743e',ice:'#83dfff',lightning:'#ead36b',poison:'#9cda69',crit:'#ff6262'});
export function damageTextStyle(e){
 const dot=!!e.dot||e.type==='burn',crit=!!e.crit&&!dot,element=e.damageElement||(e.type==='burn'?'fire':e.damageType)||'physical';
 const color=crit?(e.damageType==='magic'?DAMAGE_COLORS.magic:DAMAGE_COLORS.crit):(DAMAGE_COLORS[element]||DAMAGE_COLORS.physical);
 return {color,weight:dot?400:800,size:crit?13:10,suffix:'',icon:crit?(e.damageType==='magic'?'./assets/ui/critical-magic-v02658.webp':'./assets/ui/critical-physical-v02658.webp'):null,dot,crit};
}
