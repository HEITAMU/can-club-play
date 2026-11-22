import {test} from 'node:test';
import assert from 'node:assert/strict';
import {nativeFixture} from './helpers/runtime-fixtures.mjs';
import {rotate} from '../cocos/assets/scripts/Core.js';
import {TURN_DURATION_MS} from '../cocos/assets/scripts/TurnMotion.js';

// Exercise production preference, modal, frame and commit methods. The platform
// substitutes expose transforms/opacities; they do not verify Creator rendering.
function motionFixture(options={}){
  class UITransform{setContentSize(width,height){this.width=width;this.height=height;}}
  class UIOpacity{constructor(){this.opacity=255;}}
  class Vec3{constructor(x=0,y=0,z=1){this.x=x;this.y=y;this.z=z;}clone(){return new Vec3(this.x,this.y,this.z);}}
  const cc={UITransform,UIOpacity,Vec3,Tween:{stopAllByTarget(){}}};
  const f=nativeFixture({...options,cc}),g=f.game;
  const decorate=(node,x,y,width,height)=>{
    node.position=new Vec3(x,y,0);node.scale=new Vec3(1,1,1);node.addComponent(UITransform).setContentSize(width,height);
    node.setPosition=(x,y,z=0)=>{node.position=typeof x==='object'?x.clone():new Vec3(x,y,z);};
    node.setScale=(x,y,z=1)=>{node.scale=typeof x==='object'?x.clone():new Vec3(x,y,z);};
    return node;
  };
  const group=g.group,art=g.art;
  g.group=(name,x,y,width,height,...rest)=>{const value=group(name,x,y,width,height,...rest);decorate(value.node,x+width/2,-y-height/2,width,height);return value;};
  g.art=(name,x,y,width,height,...rest)=>decorate(art(name,x,y,width,height,...rest),x+width/2,-y-height/2,width,height);
  g.createNode=(name,x,y,width,height,parent=g.root)=>{const node=decorate(new f.NativeNode(name),x+width/2,-y-height/2,width,height);parent.addChild(node);return node;};
  const sounds=[],playAudio=g.playAudio.bind(g);
  g.playAudio=(kind,motion)=>{sounds.push({kind,moves:g.moves,board:g.board});return playAudio(kind,motion);};
  const board=()=>{g.startGame('story','1');g.drawReferenceBoard(0,0,1);};
  return {...f,UIOpacity,sounds,board};
}

const position=node=>({x:node.position.x,y:node.position.y});
const nearPosition=(actual,expected)=>{
  assert(Math.abs(actual.x-expected.x)<1e-7,`${actual.x} should be ${expected.x}`);
  assert(Math.abs(actual.y-expected.y)<1e-7,`${actual.y} should be ${expected.y}`);
};

test('native turn preference defaults to full, persists both choices and survives restart in wx/local storage',()=>{
  for(const useWx of [true,false]){
    const f=motionFixture({useWx}),g=f.game;
    assert.equal(g.turnMotionMode,'full');g.modal='settings';g.drawModal();
    const button=f.buttons.find(button=>button.label==='旋转动画：完整');assert(button);
    assert.equal(button.action(),true);assert.equal(g.turnMotionMode,'gentle');
    assert.equal(f.storage.values.get('fourfold:turnMotion'),'"gentle"');
    const reopened=nativeFixture({storage:f.storage,useWx});assert.equal(reopened.game.turnMotionMode,'gentle');
    g.startGame('story','1');assert.equal(g.turnMotionMode,'gentle');
    g.modal='settings';assert.equal(g.toggleTurnMotionMode(),true);assert.equal(g.turnMotionMode,'full');
    assert.equal(f.storage.values.get('fourfold:turnMotion'),'"full"');
    assert.equal(nativeFixture({storage:f.storage,useWx}).game.turnMotionMode,'full');
    assert.equal(f.storage.values.has('fourfold:sound'),false,'animation choice does not change sound preference');
  }
  for(const value of [false,true,'reduced','unknown',null])assert.equal(nativeFixture({preferences:{turnMotion:value}}).game.turnMotionMode,'full');
});

test('native animation setting rejects detached, wrong-round, closed and disposed callbacks',()=>{
  const f=motionFixture(),g=f.game;g.modal='settings';g.drawModal();
  const oldButton=f.buttons.find(button=>button.label==='旋转动画：完整');
  g.draw();assert.equal(oldButton.action(),false,'an old panel cannot change the preference');
  const round=g.roundSerial,ui=g.uiSerial;g.startGame('story','1');g.modal='settings';
  assert.equal(g.toggleTurnMotionMode(round,ui),false,'an old round cannot change the preference');
  g.modal='';assert.equal(g.toggleTurnMotionMode(),false);
  g.modal='settings';g.disposed=true;assert.equal(g.toggleTurnMotionMode(),false);
  assert.equal(g.turnMotionMode,'full');assert.equal(f.storage.values.has('fourfold:turnMotion'),false);
});

test('native full and gentle turns keep the press/commit/landing boundaries at exactly 1200ms',()=>{
  assert.equal(TURN_DURATION_MS,1200);
  for(const mode of ['full','gentle']){
    const f=motionFixture({preferences:{turnMotion:mode}}),g=f.game;f.board();
    const initial=g.board,expected=rotate(initial,0,1);g.spin(0);const motion=g.turnMotion;assert(motion);
    assert.deepEqual(f.sounds.map(sound=>sound.kind),['press']);assert.equal(motion.gentle,mode==='gentle');
    g.update(.6);assert.equal(g.board,initial);assert.equal(g.moves,0);
    if(mode==='gentle')assert(motion.tiles.every(tile=>tile.getComponent(f.UIOpacity).opacity===0));
    else assert(motion.tiles.every(tile=>tile.getComponent(f.UIOpacity).opacity===255));
    g.update(.599);assert.equal(g.turnMotion,motion);assert.equal(g.board,initial);assert.equal(g.moves,0);
    assert.deepEqual(f.sounds.map(sound=>sound.kind),['press'],'1199ms is too early to seat either mode');
    g.update(.001);assert.equal(g.turnMotion,null);assert.equal(g.board,expected);assert.equal(g.moves,1);
    assert.deepEqual(f.sounds.map(sound=>sound.kind),['press','seat']);
    assert.deepEqual(f.sounds[1],{kind:'seat',moves:1,board:expected},'landing is requested only after the committed board redraw');
    g.update(10);assert.equal(f.sounds.length,2);assert.equal(g.turnMotionMode,mode);
  }
});

test('native gentle mode changes positions only at full transparency and uses a weak focus without landing flash',()=>{
  const f=motionFixture({preferences:{turnMotion:'gentle'}}),g=f.game;f.board();g.spin(0);
  const motion=g.turnMotion,original=motion.tiles.map(position);
  g.update(.3);
  motion.tiles.forEach((tile,index)=>{nearPosition(position(tile),original[index]);const opacity=tile.getComponent(f.UIOpacity).opacity;assert(opacity>0&&opacity<255);});
  assert.equal(motion.knob.angle,-motion.knobStart);
  g.update(.24);
  motion.tiles.forEach((tile,index)=>{nearPosition(position(tile),original[index]);assert.equal(tile.getComponent(f.UIOpacity).opacity,0);});
  assert.equal(motion.knobOpacity.opacity,0);
  g.update(.06);
  motion.tiles.forEach((tile,index)=>{nearPosition(position(tile),original[(index+1)%4]);assert.equal(tile.getComponent(f.UIOpacity).opacity,0);});
  assert.equal(motion.knobOpacity.opacity,0);assert.equal(motion.knob.angle,-(motion.knobStart+90));
  assert(motion.focus.every(node=>node.getComponent(f.UIOpacity).opacity<=115),'gentle focus stays below half opacity');
  assert(motion.states.filter(state=>!motion.tiles.includes(state.node)).every(state=>state.opacity.opacity>=219),'stationary tiles remain lightly shaded');
  g.update(.3);
  motion.tiles.forEach((tile,index)=>{nearPosition(position(tile),original[(index+1)%4]);const opacity=tile.getComponent(f.UIOpacity).opacity;assert(opacity>0&&opacity<255);});
  g.update(.24);assert(motion.flashes.every(node=>node.getComponent(f.UIOpacity).opacity===0));
  assert.equal(g.moves,0);g.update(.06);assert.equal(g.moves,1);
});

test('native cancelling a transparent gentle turn restores all tiles and knob without committing or landing',()=>{
  const f=motionFixture({preferences:{turnMotion:'gentle'}}),g=f.game;f.board();const initial=g.board;g.spin(0);
  const motion=g.turnMotion,original=motion.tiles.map(position);g.update(.6);
  assert(motion.tiles.every(tile=>tile.getComponent(f.UIOpacity).opacity===0));assert.equal(motion.knobOpacity.opacity,0);
  g.cancelTurnMotion();assert.equal(g.turnMotion,null);assert.equal(g.busy,false);
  motion.tiles.forEach((tile,index)=>{nearPosition(position(tile),original[index]);assert.equal(tile.getComponent(f.UIOpacity).opacity,255);});
  assert.equal(motion.knobOpacity.opacity,255);assert.equal(motion.knob.angle,-motion.knobStart);
  g.update(10);assert.equal(g.board,initial);assert.equal(g.moves,0);assert.deepEqual(f.sounds.map(sound=>sound.kind),['press']);
});
