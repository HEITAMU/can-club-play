import test from 'node:test';
import assert from 'node:assert/strict';
import {mitigatedDamage,effectiveDefense} from '../combat-stats.mjs';
import {Battle,CATS,initialState,catStats,inheritTraining,encodeSave,decodeSave} from '../core.mjs';
import {crewProfileHTML,crewSkill} from '../crew-profile.mjs';
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);
function ready(ids=['orange','spark','mint']){const s=initialState();s.highest=120;s.party=ids;const b=new Battle(s);for(const a of [...b.heroes,...b.enemies]){a.wait=99;a.skillWait=99;a.shield=0;a.hp=a.maxHp=10000;}return {s,b};}

test('physical and magic damage use independent defense and penetration ratings',()=>{
 const target={armor:100,magicResist:200},source={armorPen:20,magicPen:50};
 near(mitigatedDamage(300,target,source,'physical'),300/1.8);
 near(mitigatedDamage(300,target,source,'magic'),120);
 near(mitigatedDamage(300,{...target,magicResist:999},{...source,magicPen:999},'physical'),300/1.8);
 near(mitigatedDamage(300,{...target,armor:999},{...source,armorPen:999},'magic'),120);
 assert.deepEqual(target,{armor:100,magicResist:200});
 assert.equal(effectiveDefense(target,{armorPen:999},'physical'),0);
 assert.equal(mitigatedDamage(300,target,{magicPen:999},'magic'),300);
});
test('normal attacks emit their damage type and mitigation happens before shield absorption',()=>{
 const {b}=ready(),[orange,spark]=b.heroes,e=b.enemies[0];
 Object.assign(e,{armor:100,magicResist:0});Object.assign(orange,{atk:100,crit:0});Object.assign(spark,{atk:100,crit:0});
 b.normal(orange);near(e.maxHp-e.hp,50);assert.equal(b.events.at(-1).damageType,'physical');
 e.hp=e.maxHp;b.normal(spark);near(e.maxHp-e.hp,100);assert.equal(b.events.at(-1).damageType,'magic');
 Object.assign(orange,{armor:100,shield:80,hp:1000,maxHp:1000});e.armorPen=0;
 b.harm(orange,200,e,{type:'physical',reflect:false});near(orange.hp,980);assert.equal(orange.shield,0);
});
test('armor shred is permanent and is applied before flat penetration; MR is unchanged',()=>{
 for(const level of [1,5]){
  const {b}=ready(['bolt']),h=b.heroes[0],e=b.enemies[0];
  Object.assign(h,{level,atk:100,armorPen:10});Object.assign(e,{armor:100,magicResist:80});
  b.skill(h);const armor=level===5?25:50;
  assert.equal(e.armor,armor);assert.equal(e.magicResist,80);near(e.maxHp-e.hp,300*100/(100+armor-10));
  b.skill(h);assert.equal(e.armor,armor*(level===5?.25:.5));
 }
 const {b}=ready(['ink']),h=b.heroes[0],e=b.enemies[0];Object.assign(h,{atk:100,armorPen:12});e.armor=100;
 b.skill(h);near(e.maxHp-e.hp,330*100/163);assert.equal(e.armor,100);
});
test('burn uses its real caster and magic penetration even when another cat is in front',()=>{
 const {b}=ready(),caster=b.heroes[1],weaker=b.heroes[2],e=b.enemies[0];
 caster.magicPen=50;weaker.magicPen=90;Object.assign(e,{armor:999,magicResist:100});
 b.applyBurn(e,100,1,caster);b.applyBurn(e,50,2,weaker);b.events=[];
 const events=b.tick(.25);near(e.maxHp-e.hp,25*100/150);
 const event=events.find(x=>x.type==='burn');assert.equal(event.from,caster.id);assert.equal(event.damageType,'magic');
});
test('old saves and inheritance derive all four stats without changing stored investment',()=>{
 const {s,b}=ready();s.gold=9876;s.levels.orange=35;s.levels.spark=1;
 const restored=decodeSave(encodeSave(s));assert.equal(restored.gold,9876);assert.deepEqual(restored.levels,s.levels);
 inheritTraining(restored,'orange','spark');b.syncStats(restored,{preserveHealthRatio:true});
 for(const hero of b.heroes)for(const key of ['armor','magicResist','armorPen','magicPen'])assert.equal(hero[key],catStats(restored,hero.catId)[key]);
 assert.equal(restored.gold,9876);assert.equal(restored.levels.spark,35);
 for(const c of CATS)for(const level of [1,50,100]){s.levels[c.id]=level;const stats=catStats(s,c.id);for(const key of ['armor','magicResist','armorPen','magicPen'])assert.ok(Number.isFinite(stats[key])&&stats[key]>=0);}
});
test('skill tooltips show current values and the eight visible attributes use combat stats',()=>{
 for(const c of CATS){
  const s=initialState();s.highest=120;s.party=[c.id];s.levels[c.id]=10;
  const b=new Battle(s),h=b.heroes[0],e=b.enemies[0];Object.assign(e,{hp:1e6,maxHp:1e6,armor:0,magicResist:0});h.hp=1;
  const description=crewSkill(c.id,10,catStats(s,c.id));b.skill(h);
  const type=['orange','pudding'].includes(c.id)?'shield':['milk','star'].includes(c.id)?'heal':'hit';
  const event=b.events.find(x=>x.type===type&&x.from===h.id);
  if(type==='hit')assert.equal(event.damageType,['spark','mint'].includes(c.id)?'magic':'physical');
  assert.ok(description.description.includes('>'+event.value.toLocaleString('zh-CN')+'</strong>'),c.id);
  const html=crewProfileHTML(s,c.id);assert.equal((html.match(/<dt>/g)||[]).length,8);
  for(const name of ['护甲','魔抗','护甲穿透','法术穿透'])assert.ok(html.includes('<dt>'+name+'</dt>'));
  assert.ok(!/NaN|undefined/.test(html));
 }
});
