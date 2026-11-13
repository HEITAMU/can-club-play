import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState,encodeSave,decodeSave,idleRate,upgradeStall} from '../core.mjs';
import {businessBoostQuote,grantBusinessBoost,AD_COOLDOWN_MS} from '../rewarded-economy.mjs';
const start=Date.UTC(2026,10,14,2);
test('completed video boosts business; duplicate completion and cancelled video give nothing',()=>{
 const s=initialState(start),q=businessBoostQuote(s,start,idleRate(s));
 assert.equal(grantBusinessBoost(s,q,false,start),false);assert.equal(s.gold,200);
 assert.equal(grantBusinessBoost(s,q,true,start),true);assert.equal(s.gold,620);assert.equal(s.supplies,15);
 assert.equal(grantBusinessBoost(s,q,true,start),false);assert.equal(s.gold,620);
 const restored=decodeSave(encodeSave(s),start);
 assert.equal(grantBusinessBoost(restored,q,true,start+AD_COOLDOWN_MS),false);
});
test('five optional boosts per Beijing day, cooldown, backward clock and next-day recovery',()=>{
 const s=initialState(start);
 for(let i=0;i<5;i++){const now=start+i*AD_COOLDOWN_MS,q=businessBoostQuote(s,now,idleRate(s));assert.equal(grantBusinessBoost(s,q,true,now),true);assert.equal(businessBoostQuote(s,now).available,false);}
 assert.equal(businessBoostQuote(s,start+600000).remaining,0);
 assert.equal(businessBoostQuote(s,start-86400000).available,false);
 assert.equal(businessBoostQuote(s,start+86400000).remaining,5);
 assert.equal(businessBoostQuote(s,start+86400000).available,true);
});
test('two early boosts fund stall upgrade that increases future idle rate',()=>{
 const s=initialState(start),before=idleRate(s);
 for(let i=0;i<2;i++){const now=start+i*AD_COOLDOWN_MS;grantBusinessBoost(s,businessBoostQuote(s,now,idleRate(s)),true,now);}
 assert.equal(upgradeStall(s,'stall',start+AD_COOLDOWN_MS),true);
 assert.ok(idleRate(s)>before);assert.equal(s.supplies,0);
});
test('old saves start with an unused boost allowance',()=>{
 const s=initialState(start);delete s.adRewards;
 assert.equal(businessBoostQuote(decodeSave(encodeSave(s),start),start).remaining,5);
});

test('a video crossing midnight settles once into the new day',()=>{
 const now=Date.UTC(2026,10,14,15,59,50),s=initialState(now),q=businessBoostQuote(s,now,idleRate(s));
 assert.equal(grantBusinessBoost(s,q,true,now+30000),true);
 assert.equal(businessBoostQuote(s,now+30000).remaining,4);
 assert.equal(grantBusinessBoost(s,q,true,now+180000),false);
});
