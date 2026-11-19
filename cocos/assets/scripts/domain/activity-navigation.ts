// @ts-nocheck
// Migrated verbatim from Preview11 source 28eb867; only module specifiers changed.
export function activityRoute(info){return {group:['recruit','hunt','hard'].includes(info.kind)?info.kind:'materials',id:info.id||info.kind,tier:info.tier,...(info.runeSearch===true?{runeSearch:true}:{})};}
export class ActivityReturn {
 finish(info,time){this.pending={route:activityRoute(info),at:time+1.4};}
 cancel(){this.pending=null;}
 update(time){if(!this.pending||time<this.pending.at)return null;const route=this.pending.route;this.cancel();return route;}
}
