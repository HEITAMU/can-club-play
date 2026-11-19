// @ts-nocheck
// Migrated verbatim from Preview11 source 28eb867; only module specifiers changed.
// Approved whole-painting transition, shared by web and native WeChat.
// Never changes action clocks, hit markers, art dimensions or character anatomy.
export const PAINTED_TRANSITION=Object.freeze({start:.41,end:.59});
export function paintedBlend(value){
 const v=Number.isFinite(value)?value:0;
 const t=Math.max(0,Math.min(1,(v-PAINTED_TRANSITION.start)/(PAINTED_TRANSITION.end-PAINTED_TRANSITION.start)));
 return t*t*(3-2*t);
}
// Timed special actions already have short transitions (e.g. Shidun: 75 ms).
// Keep those authored intervals; narrowing them again creates a visible snap.
export function paintedLayers(from,to,mix,{short=false}={}){
 const t=short?Math.max(0,Math.min(1,Number.isFinite(mix)?mix:1)):paintedBlend(mix);
 if(from===to)return [[from,1]];
 if(t<=0)return [[from,1]];
 if(t>=1)return [[to,1]];
 return [[from,1-t],[to,t]];
}
