// @ts-nocheck
// Migrated verbatim from Preview11 source 28eb867; only module specifiers changed.
import {COMPANION_IDS} from './companions';
export const TOKEN_DROP=5;
export function tokenRewardReady(s,ticket){return Number.isSafeInteger(ticket)&&ticket>0&&s.activities.tokenRewards?.some(r=>r.serial===ticket&&!r.claimed)===true;}
export function grantChosenTokens(s,ticket,id,completed){
 if(completed!==true||!COMPANION_IDS.includes(id)||!tokenRewardReady(s,ticket))return false;
 const reward=s.activities.tokenRewards.find(r=>r.serial===ticket);reward.claimed=true;reward.companion=id;
 s.roster.shards[id]+=TOKEN_DROP;
 if(s.battleReport?.tokenTicket===ticket)s.battleReport.tokenClaimed=true;
 return true;
}
