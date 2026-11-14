import test from 'node:test';import assert from 'node:assert/strict';
import {Battle,initialState} from '../core.mjs';
import {createShieldPunch,gainShield,loseShield,tickShieldPunch} from '../shield-punch.mjs';
import {crewSkill} from '../crew-profile.mjs';import {talentCards} from '../talents.mjs';
const make=(level=80)=>{const s=initialState();s.party=['pudding'];s.levels.pudding=level;return new Battle(s);};
test('punch uses shield at release, has no attack scaling, and ignores shield gained after release',()=>{
 const cast=attack=>{const s=createShieldPunch({maxHp:1000,attack});gainShield(s,350,0);gainShield(s,200,.2);loseShield(s,100);tickShieldPunch(s,1.35);assert.equal(s.shield,0);assert.equal(s.shieldAtSecond,450);gainShield(s,100,1.4);return tickShieldPunch(s,1.8,[{id:'e',hp:10000}]).find(e=>e.type==='punchHit').hits[0].rawDamage;};assert.equal(cast(1),810);assert.equal(cast(99999),810);
});
test('shield damage reduction covers direct and periodic damage, only while shielded',()=>{
 for(const dot of [false,true]){const damage=(level,shield)=>{const b=make(level),h=b.heroes[0];h.hp=h.maxHp=10000;h.shield=shield;h.armor=h.magicResist=0;h.energy=0;b.harm(h,100,b.enemies[0],{dot});return 10000+shield-h.hp-h.shield;};assert.equal(damage(40,1000),90);assert.equal(damage(40,0),100);assert.equal(damage(39,1000),100);}
});
test('shielded hit energy doubles after awakening, including a shield-breaking hit',()=>{
 for(const [level,expected] of [[4,8],[5,16]]){const b=make(level),h=b.heroes[0];h.hp=h.maxHp=10000;h.shield=1;h.energy=0;b.harm(h,100,b.enemies[0]);assert.equal(h.energy,expected);b.harm(h,100,b.enemies[0]);assert.equal(h.energy,expected);b.time=1;b.harm(h,100,b.enemies[0]);assert.equal(h.energy,expected+8);}
});
test('level 80 increases only Shidun received shields by twenty percent',()=>{for(const [level,expected] of [[79,100],[80,120]]){const b=make(level),h=b.heroes[0];h.shield=0;b.shield(h,100,h);assert.equal(h.shield,expected);}});
test('all character descriptions omit implementation language and Shidun cards match mechanics',()=>{for(const id of ['orange','ink','milk','spark','mint','bolt','pudding','star']){const s=crewSkill(id,80,{hp:1000,atk:100,skillRank:0});assert.doesNotMatch(s.description+s.passive+talentCards(id,80).map(t=>t.desc).join(''),/锁定|仍在|毫秒|不影响/);}const s=crewSkill('pudding',80,{hp:1000,atk:100,skillRank:0});assert.doesNotMatch(s.description,/攻击力/);assert.match(s.description,/180% 当前护盾值/);});
