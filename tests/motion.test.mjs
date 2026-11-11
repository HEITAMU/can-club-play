import assert from 'node:assert/strict';
import {Battle,initialState,CATS} from '../core.mjs';
import {poseFor} from '../motion.mjs';
const checks=[];const test=(name,fn)=>{fn();checks.push(name);};
function ready(){const s=initialState();s.highest=120;s.party=['orange','ink','milk'];const b=new Battle(s,{stage:12});for(const a of [...b.heroes,...b.enemies])a.wait=99;return b;}
test('windup and release cause no damage; impact damages exactly once',()=>{
 const b=ready(),h=b.heroes[1],e=b.enemies[0];e.hp=e.maxHp=10000;b.enemies[1].hp=b.enemies[1].maxHp=20000;h.crit=0;
 b.beginAction(h,'normal');const before=e.hp;assert.equal(poseFor(h,b.time).frame,1);
 b.tick(.2);assert.equal(e.hp,before);assert.equal(poseFor(h,b.time).frame,2);
 b.tick(.1);assert.equal(e.hp,before);b.tick(.12);assert.equal(e.hp,before-h.atk);
 b.tick(.2);assert.equal(e.hp,before-h.atk);b.tick(.1);assert.equal(h.action,null);
});
test('stun cancels a pending strike before impact',()=>{const b=ready(),h=b.heroes[1],hp=b.enemies.map(e=>e.hp);b.beginAction(h,'normal');h.stun=1;b.tick(.2);assert.equal(h.action,null);assert.deepEqual(b.enemies.map(e=>e.hp),hp);});
test('death during anticipation prevents a ghost attack',()=>{const b=ready(),h=b.heroes[1],hp=b.enemies.map(e=>e.hp);b.beginAction(h,'normal');b.harm(h,1e9,b.enemies[0]);b.tick(.25);b.tick(.25);assert.equal(h.action,null);assert.deepEqual(b.enemies.map(e=>e.hp),hp);});
test('if front falls in windup, enemy impact targets the next living front',()=>{const b=ready(),e=b.enemies[0];e.atk=10;b.beginAction(e,'normal');b.heroes[0].hp=0;const hp=b.heroes.map(h=>h.hp);b.tick(.2);b.tick(.25);assert.equal(b.heroes[1].hp,hp[1]-10);assert.equal(b.heroes[2].hp,hp[2]);});
test('pause leaves pose, projectile phase and health unchanged',()=>{const b=ready(),h=b.heroes[1];b.beginAction(h,'normal');b.tick(.2);const before=JSON.stringify(b);for(let n=0;n<100;n++)poseFor(h,b.time);assert.equal(JSON.stringify(b),before);});
test('all eight skills use anticipation and release poses, execute once',()=>{for(const c of CATS){const s=initialState();s.highest=120;s.party=[c.id];const b=new Battle(s,{stage:120}),h=b.heroes[0];h.wait=99;for(const e of b.enemies)e.wait=e.skillWait=99;h.energy=100;b.beginAction(h,'skill');assert.equal(poseFor(h,0).frame,6);b.tick(.2);assert.equal(h.energy,100);b.tick(.2);assert.equal(poseFor(h,b.time).frame,7);const events=[...b.tick(.2),...b.tick(.2)];assert.equal(events.filter(e=>e.type==='skill').length,1);assert.equal(h.energy,0);}});
test('frame-rate slicing produces equal normal attack count and damage',()=>{function run(step){const b=ready();b.heroes[1].wait=0;for(const e of b.enemies)e.hp=e.maxHp=1e6;let hits=0;for(let t=0;t<3-1e-7;t+=step)hits+=b.tick(step).filter(e=>e.type==='hit'&&e.from==='p1').length;return hits;}assert.equal(run(.02),run(.1));});
console.log(JSON.stringify({passed:checks.length,checks},null,2));
