const keys=['gold','supplies','badges','notes','seals','shards','essence','scrap'];
const integer=n=>Math.max(0,Math.min(1e9,Math.floor(Number(n)||0)));
export function normalizeReport(raw){
 if(!raw||typeof raw!=='object'||typeof raw.win!=='boolean')return null;
 const text=x=>String(x||'').replace(/[<>"'&]/g,'').slice(0,100);
 const mode=['patrol','activity','arena','weekly'].includes(raw.mode)?raw.mode:'patrol';
 return {win:raw.win,tokenTicket:integer(raw.tokenTicket),tokenClaimed:raw.tokenClaimed===true,rewardCapped:raw.rewardCapped===true,mode,title:text(raw.title),stage:integer(raw.stage),companion:text(raw.companion),gearUid:text(raw.gearUid),rewards:Object.fromEntries(keys.map(k=>[k,integer(raw.rewards?.[k])])),route:raw.route?{group:text(raw.route.group),id:text(raw.route.id),tier:Math.max(1,integer(raw.route.tier)),...(raw.route.runeSearch===true?{runeSearch:true}:{})}:null,request:raw.request?{arenaTier:integer(raw.request.arenaTier),weeklyTier:integer(raw.request.weeklyTier)}:null};
}
export function battleReport(b,r){return normalizeReport({win:r.win,tokenTicket:r.tokenTicket,tokenClaimed:false,rewardCapped:r.rewardCapped,mode:b.activity?'activity':b.weekly?'weekly':b.mode==='arena'?'arena':'patrol',title:b.activity?.name||b.weekly?.name||(b.mode==='arena'?`街头擂台 · 第 ${b.arenaTier} 擂`:`第 ${b.stage} 关`),stage:b.stage,companion:r.companion||b.activity?.id,gearUid:r.gearLoot?.item?.id,rewards:{...r,scrap:(r.scrap||0)+(r.gearLoot?.scrap||0)},route:b.activity?{group:['recruit','hunt','hard'].includes(b.activity.kind)?b.activity.kind:'materials',id:b.activity.id||b.activity.kind,tier:b.activity.tier,...(b.activity.runeSearch===true?{runeSearch:true}:{})}:null,request:{arenaTier:b.arenaTier||0,weeklyTier:b.weekly?.tier||0}});}
