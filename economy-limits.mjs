// Repeat rewards reset at Beijing midnight; material first clears are separate; every token victory consumes one attempt.
export const REPEAT_LIMITS=Object.freeze({sweep:6,escort:4,salvage:4,wardrobe:4,nightwatch:4,parts:4,polish:4,recruit:3,hunt:6,hard:2});
export const rewardDay=now=>Math.floor((now+8*3600000)/86400000);
export function repeatQuota(activities,kind,id,now=Date.now()){
 const day=Math.max(rewardDay(now),activities?.rewardDay||0),key=kind;
 const count=day>(activities?.rewardDay||0)?0:activities?.repeatClaims?.[key]||0,limit=REPEAT_LIMITS[kind]||0;
 return {day,key,limit,remaining:Math.max(0,limit-count)};
}
export function consumeRepeat(activities,quota){if(quota.day>activities.rewardDay){activities.rewardDay=quota.day;activities.repeatClaims={};}activities.repeatClaims[quota.key]=(activities.repeatClaims[quota.key]||0)+1;}
