import test from 'node:test';import assert from 'node:assert/strict';
import {resultHTML,resultGearHTML} from '../battle-result.mjs';
import {generateGear,gearValues,attrText,gearName} from '../equipment.mjs';
import {equipmentSVG} from '../art.mjs';
test('settlement uses exact inventory item illustration for every slot and set',()=>{
 for(const set of ['hunt','guard','ember','spring','clock','thorn'])for(const slot of ['claw','coat','collar','brace','rune']){
 const e=generateGear(99,220,{slot,set,quality:3,rune:'focus'}),report={win:true,title:'鱼币追猎',rewards:{gold:180},gearUid:e.id};
 const html=resultHTML(report,[e]);assert.ok(html.includes(equipmentSVG(e)));assert.ok(html.includes(gearName(e)));assert.doesNotMatch(html,/material-gear/);
 const detail=resultGearHTML(e);assert.ok(detail.includes(equipmentSVG(e)));for(const [k,v] of Object.entries(gearValues(e)))assert.ok(detail.includes(attrText(k,v)));
 if(slot==='rune')assert.match(detail,/释放主动技能后回复 28 能量/);else{assert.match(detail,/珍藏/);assert.match(detail,/3阶/);assert.match(detail,/2件/);assert.match(detail,/4件/);}
 }
});
test('details preserve enhanced values and safely handle a missing item',()=>{const e=generateGear(13,510,{slot:'claw',set:'hunt',quality:2});e.enhance=15;const html=resultGearHTML(e);assert.match(html,/\+15/);assert.ok(html.includes(attrText('atk',gearValues(e).atk)));assert.equal(resultGearHTML(null),'<h3>装备已不在背包</h3>');});
