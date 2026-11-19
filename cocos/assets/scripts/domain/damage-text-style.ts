// @ts-nocheck
// Migrated verbatim from Preview11 source 28eb867; only module specifiers changed.
// Shared by DOM and WeChat canvas; elements only affect presentation, not mitigation.
export const DAMAGE_COLORS=Object.freeze({physical:'#ffda55',magic:'#bc8aff',fire:'#ff743e',ice:'#83dfff',lightning:'#ead36b',poison:'#9cda69',crit:'#ff6262'});
export function damageTextStyle(e){
 const dot=!!e.dot||e.type==='burn',crit=!!e.crit&&!dot,element=e.damageElement||(e.type==='burn'?'fire':e.damageType)||'physical';
 const color=crit?(e.damageType==='magic'?DAMAGE_COLORS.magic:DAMAGE_COLORS.crit):(DAMAGE_COLORS[element]||DAMAGE_COLORS.physical);
 return {color,weight:dot?400:800,size:10,suffix:'',icon:crit?(e.damageType==='magic'?'./assets/ui/critical-magic-v02658.webp':'./assets/ui/critical-physical-v02658.webp'):null,dot,crit};
}
export const criticalFrameSize=textWidth=>({width:Math.max(40,Math.ceil(textWidth)+28),height:26});
// Keep the painted burst tips intact; only the center/edge strips grow.
export function drawCriticalFrame(ctx,image,x,y,width,height){
 const sw=image.width,sh=image.height,sx=[0,sw/4,sw*3/4,sw],sy=[0,sh/4,sh*3/4,sh],dx=[x,x+12,x+width-12,x+width],dy=[y,y+6,y+height-6,y+height];
 for(let row=0;row<3;row++)for(let col=0;col<3;col++)ctx.drawImage(image,sx[col],sy[row],sx[col+1]-sx[col],sy[row+1]-sy[row],dx[col],dy[row],dx[col+1]-dx[col],dy[row+1]-dy[row]);
}
