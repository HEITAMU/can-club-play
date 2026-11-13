// Optional business boost. All quantities are game resources, never cash.
export const AD_DAILY_LIMIT = 5;
export const AD_COOLDOWN_MS = 120000;
const dayAt = now => Math.floor((now + 8 * 3600000) / 86400000);
const integer = (n, max=Number.MAX_SAFE_INTEGER) => Number.isSafeInteger(n) && n >= 0 ? Math.min(n,max) : 0;
export function normalizeAdRewards(raw={}) {
  return {day:integer(raw.day),count:integer(raw.count,AD_DAILY_LIMIT),lastAt:integer(raw.lastAt),serial:integer(raw.serial)};
}
export function businessBoostQuote(s, now=Date.now(), rate=21) {
  const a=normalizeAdRewards(s.adRewards), day=dayAt(now);
  const count=day>a.day?0:a.count;
  const wait=Math.max(0,Math.ceil((a.lastAt+AD_COOLDOWN_MS-now)/1000));
  return Object.freeze({issuedAt:now,day:Math.max(day,a.day),serial:a.serial+1,remaining:AD_DAILY_LIMIT-count,wait,
    available:count<AD_DAILY_LIMIT&&!wait,
    gold:Math.max(1,Math.floor(rate*20)),
    supplies:3*Math.max(1,Math.floor((5+Math.floor(Math.max(1,s.highest)/5))*(1+.1*(s.stall?.cart||0))))});
}
// Quote belongs to one completed video; its serial survives save/reload.
export function grantBusinessBoost(s,quote,completed,now=Date.now()) {
  if(completed!==true||!quote?.available||!Number.isFinite(quote.issuedAt)||now<quote.issuedAt||now-quote.issuedAt>600000)return false;
  const current=businessBoostQuote(s,now);
  if(!current.available||quote.serial!==current.serial||quote.day>current.day)return false;
  if(!Number.isSafeInteger(quote.gold)||quote.gold<1||!Number.isSafeInteger(quote.supplies)||quote.supplies<1)return false;
  const a=normalizeAdRewards(s.adRewards);
  s.gold+=quote.gold;s.supplies+=quote.supplies;
  s.adRewards={day:current.day,count:(current.day>a.day?0:a.count)+1,lastAt:now,serial:quote.serial};
  return true;
}
