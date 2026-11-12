import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState,normalizeState,encodeSave,decodeSave,setParty,inheritanceFor,settleBattle,Battle,CATS,MAX_PARTY,enemiesFor} from '../core.mjs';
import {BattleCues,formationPositions} from '../battle-cues.mjs';
function ready(){const s=initialState();s.highest=60;s.runCleared=60;s.stage=61;s.party=['orange','ink','milk','spark','mint'];return s;}
test('five unique unlocked cats survive save roundtrip; old three-cat saves keep resources and levels',()=>{
 const s=ready();s.levels.orange=19;s.gold=5432;assert.equal(MAX_PARTY,5);assert.deepEqual(decodeSave(encodeSave(s)).party,s.party);
 s.party=s.party.slice(0,3);const restored=decodeSave(encodeSave(s));assert.deepEqual(restored.party,s.party);assert.deepEqual(restored.levels,s.levels);assert.equal(restored.gold,s.gold);
 const bad={...s,party:['orange','orange','ink','milk','spark','mint','bolt','unknown']};assert.deepEqual(normalizeState(bad).party,['orange','ink','milk','spark','mint']);
});
test('fourth and fifth slots support inherited replacement and swapping without creating training',()=>{
 const s=ready();s.party=s.party.slice(0,3);const levels={...s.levels};assert.ok(setParty(s,3,'spark'));assert.ok(setParty(s,4,'mint'));assert.deepEqual(s.levels,levels);s.levels.mint=23;
 assert.equal(inheritanceFor(s,4,'bolt').from,'mint');assert.ok(setParty(s,4,'bolt'));assert.equal(s.levels.bolt,23);assert.equal(s.levels.mint,1);
 const before={...s.levels};assert.ok(setParty(s,0,'bolt'));assert.deepEqual(s.levels,before);assert.equal(new Set(s.party).size,5);assert.equal(setParty(s,5,'star'),false);
});
test('new recruits fill the fourth and fifth free places at level one',()=>{
 const s=ready();s.highest=s.runCleared=7;s.stage=8;s.party=['orange','ink','milk'];s.levels.orange=20;
 let b=new Battle(s);b.result='win';settleBattle(s,b);assert.equal(s.party[3],'spark');assert.equal(s.levels.spark,1);
 s.highest=s.runCleared=14;s.stage=15;b=new Battle(s);b.result='win';settleBattle(s,b);assert.equal(s.party[4],'mint');assert.equal(s.levels.mint,1);assert.equal(s.levels.orange,20);
});
test('five-cat ordinary hits follow the living front, with no position buff; boss burst hits all five',()=>{
 const b=new Battle(ready(),{stage:20}),enemy=b.enemies[0];enemy.atk=10;
 for(let i=0;i<5;i++){enemy.attacks=0;const h=b.heroes[i],hp=h.hp;b.normal(enemy);assert.equal(hp-h.hp,10);h.hp=0;}
 const full=new Battle(ready(),{stage:20});const before=full.heroes.map(h=>h.hp);full.enemies[0].charge=.01;const events=full.tick(.1);
 assert.equal(events.filter(e=>e.type==='hit'&&e.from==='e0').length,5);full.heroes.forEach((h,i)=>assert.ok(h.hp<before[i]));
});
test('healing and shield skill events name all five actual recipients',()=>{
 const b=new Battle(ready());b.heroes.forEach(h=>h.hp=h.maxHp*.4);const healer=b.heroes[2];b.skill(healer);
 const event=b.events.find(e=>e.type==='skill');assert.deepEqual(event.targets,b.heroes.map(h=>h.id));assert.equal(b.events.filter(e=>e.type==='heal').length,5);
 b.events=[];b.skill(b.heroes[0]);assert.equal(b.events.filter(e=>e.type==='shield').length,5);assert.deepEqual(b.events[0].targets,b.heroes.map(h=>h.id));
});
test('all eight skills publish correct single or group destinations',()=>{
 for(const cat of CATS){const s=ready();s.party=[cat.id,...CATS.filter(c=>c.id!==cat.id).slice(0,4).map(c=>c.id)];const b=new Battle(s,{stage:30});const targets=b.skillTargets(b.heroes[0]);
  if(['orange','milk','star'].includes(cat.id))assert.ok(targets.length===5&&targets.every(t=>t.side==='p'));
  else if(cat.id==='pudding')assert.equal(targets.length,b.heroes.length+b.enemies.length);
  else if(cat.id==='spark')assert.deepEqual(targets,b.enemies);
  else assert.equal(targets.length,1);
 }
});
test('actual impact replaces an obsolete windup target; cues are read-only and freeze on game time',()=>{
 const b=new Battle(ready(),{stage:30}),c=new BattleCues(),p=formationPositions(b);const before=JSON.stringify(b);
 c.consume([{type:'windup',from:'p0',to:'e0',kind:'normal'},{type:'hit',from:'p0',to:'e1',value:12,cause:'normal'}],b,p);
 assert.deepEqual(c.active(0)[0].targets,['e1']);assert.equal(c.entries[0].target,b.enemies[1].name);assert.equal(JSON.stringify(b),before);
 const snapshot=JSON.stringify(c.active(0));assert.equal(JSON.stringify(c.active(0)),snapshot);assert.equal(c.active(1).length,0);
});
test('can rescue clears interrupted boss routes and is attributed to the button rather than the front cat',()=>{
 const b=new Battle(ready(),{stage:20}),c=new BattleCues(),p=formationPositions(b);c.consume([{type:'charge',from:'e0',to:'e0'}],b,p);
 c.consume([{type:'hit',from:'p0',to:'e0',value:42},{type:'interrupt',from:'p0',to:'e0'},{type:'can',from:'p0',to:'e0'}],b,p);
 assert.ok(!c.active(0).some(r=>r.from==='e0'));assert.equal(c.entries[0].from,'开罐啦');assert.ok(c.entries[0].effect.includes('打断成功'));assert.equal(c.routes.get('can-heal').targets.length,5);
});
test('skill captions remain attributable when several allies cast in one tick',()=>{
 const b=new Battle(ready()),c=new BattleCues();for(const h of [b.heroes[0],b.heroes[2],b.heroes[3]])b.skill(h);c.consume(b.events,b,formationPositions(b));
 assert.equal(c.entries.filter(e=>e.skill).length,3);assert.ok(c.entries.some(e=>e.from==='奶盖'&&e.ability==='热牛奶时间'));assert.ok(c.active(0).some(r=>r.from==='p2'&&r.targets.length===5));
});
test('five-person formation has distinct bounded foot positions',()=>{
 const b=new Battle(ready(),{stage:30}),p=formationPositions(b);assert.equal(new Set(b.heroes.map(h=>JSON.stringify(p[h.id]))).size,5);
 for(const pos of Object.values(p)){assert.ok(pos.x>=0&&pos.x<=100&&pos.y>=0&&pos.y<=100);assert.ok(Number.isFinite(pos.x)&&Number.isFinite(pos.y));}
 b.heroes[0].hp=0;assert.equal(formationPositions(b).p1.x,36);assert.equal(formationPositions(b).p2.x,36);
});

test('ordinary attacks alternate across two front cats and never choose a rear cat',()=>{
 const b=new Battle(ready(),{stage:16}),e=b.enemies[0];e.atk=2;const ids=[];
 for(let i=0;i<6;i++){b.normal(e);ids.push(b.events.filter(x=>x.type==='hit').at(-1).to);}
 assert.deepEqual(ids,['p0','p1','p0','p1','p0','p1']);assert.ok(b.heroes.slice(2).every(h=>h.hp===h.maxHp));
 b.heroes[1].hp=0;assert.deepEqual(b.frontlines().map(h=>h.id),['p0','p2']);
});
test('locked front target stays fixed through windup and release, then switches next attack',()=>{
 const b=new Battle(ready(),{stage:16}),e=b.enemies[0];b.beginAction(e,'normal');const target=e.action.targetId;
 e.action.elapsed=e.action.windup;assert.equal(b.targetFor(e).id,target);b.advanceAction(e,e.action.travel+.01);assert.equal(b.events.find(x=>x.type==='hit').to,target);
 e.action=null;assert.notEqual(b.targetFor(e).id,target);
});
test('mixed encounter sizes include five-mob waves and boss with four escorts, with bounded pack pressure',()=>{
 assert.equal(enemiesFor(1).length,1);assert.equal(enemiesFor(2).length,2);assert.equal(enemiesFor(12).length,3);assert.equal(enemiesFor(16).length,5);assert.equal(enemiesFor(20).length,5);assert.equal(enemiesFor(25).length,2);
 const pack=enemiesFor(16),m=1+.14*15+.0046*15**2;assert.ok(pack.reduce((sum,e)=>sum+e.atk,0)<9*m*3);
 const boss=enemiesFor(20);assert.equal(boss.filter(e=>e.boss).length,1);assert.equal(boss.filter(e=>!e.boss).length,4);
});
test('both teams have two forward foot anchors and three grounded rear anchors',()=>{
 const b=new Battle(ready(),{stage:20}),p=formationPositions(b);
 assert.equal(b.heroes.filter(h=>p[h.id].x===36).length,2);assert.equal(b.enemies.filter(e=>p[e.id].x===64).length,2);
 for(const a of [...b.heroes,...b.enemies]){assert.ok(p[a.id].y>=51&&p[a.id].y<=95);assert.ok(Number.isFinite(p[a.id].x));}
});

test('skill release carries its named caster, visual type, targets and actual projectile time',()=>{
 const b=new Battle(ready()),c=new BattleCues(),h=b.heroes[2];c.consume([{type:'release',from:h.id,to:h.id,kind:'skill',travel:.22}],b,formationPositions(b));
 const effect=c.active(0)[0];assert.equal(effect.label,'热牛奶时间');assert.equal(effect.from,h.id);assert.equal(effect.style,'heal');assert.equal(effect.travel,.22);assert.equal(effect.phase,'release');assert.equal(effect.targets.length,5);
});
test('enemy healing effects identify the healer and actual recipient',()=>{
 const b=new Battle(ready(),{stage:20}),bag=b.enemies.find(e=>e.type==='bag'),c=new BattleCues();b.enemies[0].hp-=100;bag.attacks=2;b.normal(bag);c.consume(b.events,b,formationPositions(b));
 assert.ok(c.entries.some(e=>e.from==='乱跑纸袋'&&e.ability==='纸袋修补'&&e.target==='吸尘器大王'));
 assert.ok(c.active(0).some(e=>e.style==='heal'&&e.from===bag.id&&e.targets.includes('e0')));
});
