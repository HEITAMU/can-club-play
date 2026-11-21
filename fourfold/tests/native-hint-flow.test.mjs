import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {GOAL,SQUARES,rotate,hintLimit} from '../cocos/assets/scripts/Core.js';
import {createTurnMotion} from '../cocos/assets/scripts/TurnMotion.js';
import {nativeFixture,reference,TEST_DAY} from './helpers/runtime-fixtures.mjs';

// Production component methods and callbacks with cc drawing substituted.
// This checks interaction state, not Creator rendering or WeChat device behavior.
function ready(mode='story',q=0,dir=1){
  const f=nativeFixture(),g=f.game;g.startGame(mode,mode==='daily'?TEST_DAY:'1');
  g.board=rotate(GOAL,q,-dir);return f;
}

function paintingFixture(mode='story',q=0,dir=1){
  const f=ready(mode,q,dir),g=f.game;f.created=[];
  g.createNode=(name,x,y,w,h,parent=g.root)=>{
    const node=new f.NativeNode(name);node.rect={x,y,w,h};parent.addChild(node);f.created.push(node);return node;
  };
  g.pageContent=name=>g.group(name,0,0,390,844).content;
  g.referenceNumber=(value,x,y,w,h,color,parent)=>g.txt(value,x,y,w,h,16,color,true,parent);
  return f;
}

test('native hints require an explicit direction click for every quadrant and both directions',()=>{
  for(let q=0;q<4;q++)for(const dir of [1,-1])for(const selected of [dir,-dir]){
    const f=ready('story',q,dir),g=f.game;g.direction=selected;const board=g.board;
    g.applyHint();
    assert.equal(g.hints,1);assert.equal(g.direction,selected,'a hint cannot silently choose the direction');
    assert.equal(g.board,board);assert.equal(g.hintGuide.q,q);assert.equal(g.hintGuide.dir,dir);assert.equal(g.hintGuide.stage,'direction');
    g.boardContent={};g.spin(q);
    assert.equal(g.turnMotion,null);assert.equal(g.moves,0);assert.equal(g.board,board);
    assert.match(f.events.at(-1),/^toast:先点击高亮的/,'the first step must block even the correct knob');
    g.setDirection(-dir);assert.equal(g.hintGuide.stage,'direction');
    g.setDirection(dir);assert.equal(g.hintGuide.stage,'target');assert.equal(g.direction,dir);
    g.setDirection(-dir);assert.equal(g.hintGuide.stage,'direction','changing away from the advised direction hides the target');
    g.setDirection(dir);assert.equal(g.hintGuide.stage,'target');assert.equal(g.hints,1);
  }
});

test('native repeat requests preserve the current step without charging, including the last allowance',async()=>{
  for(const mode of ['story','daily']){
    const f=ready(mode,2,-1),g=f.game,limit=hintLimit(mode);g.hints=limit-1;
    await g.askHint();const guide=g.hintGuide;assert.equal(g.hints,limit);assert.equal(guide.stage,'direction');
    await g.askHint();g.applyHint();assert.equal(g.hintGuide,guide);assert.equal(g.hints,limit);assert.equal(guide.stage,'direction');
    g.setDirection(guide.dir);await g.askHint();g.applyHint();
    assert.equal(g.hintGuide,guide);assert.equal(g.hints,limit);assert.equal(guide.stage,'target');
    g.clearHintGuide();await g.askHint();assert.equal(g.hintGuide,null);assert.equal(g.hints,limit);
  }
});

test('native story and daily controls draw only the current step and use the same direction handler',()=>{
  for(const mode of ['story','daily'])for(const dir of [1,-1]){
    const f=paintingFixture(mode,3,dir),g=f.game;g.applyHint();g.drawGame();
    assert.deepEqual(Array.from(g.hintVisualNodes,node=>node.name),['Hint direction '+dir]);
    const oldDirectionOutline=g.hintVisualNodes[0];
    if(mode==='story')f.buttons.findLast(button=>button.label===(dir===1?'↻ 顺时针':'↺ 逆时针')).action();
    else{
      const button=f.created.findLast(node=>node.name===(dir===1?'↻ 顺时针':'↺ 逆时针'));
      button.emit('start');button.emit('end');
    }
    assert.equal(g.hintGuide.stage,'target');assert.equal(oldDirectionOutline.isValid,false);
    g.drawGame();assert.deepEqual(Array.from(g.hintVisualNodes,node=>node.name),['Hint target region','Hint target knob 3']);
    const region=g.hintVisualNodes[0].rect,scale=g.boardLayout.size/reference.tileArea[2],slots=SQUARES[3].map(i=>reference.slotRects[i]);
    assert.equal(region.w,(Math.max(...slots.map(p=>p[0]+p[2]))-Math.min(...slots.map(p=>p[0])))*scale);
    assert.equal(region.h,(Math.max(...slots.map(p=>p[1]+p[3]))-Math.min(...slots.map(p=>p[1])))*scale);
    assert.equal(g.hints,1);
  }
});

test('native redraws and number settings preserve guidance; new rounds, home, completion and stale boards clear it',()=>{
  const f=ready(),g=f.game;g.applyHint();g.setDirection(g.hintGuide.dir);const guide=g.hintGuide;
  g.toggleNumbers();g.modal='settings';g.draw();g.modal='';g.draw();
  assert.equal(g.hintGuide,guide);assert.equal(g.hintGuide.stage,'target');assert.equal(g.hints,1);
  const oldRound=g.roundSerial,oldUI=g.uiSerial;g.startGame('story','1');
  assert.equal(g.hintGuide,null);assert.equal(g.hints,0);assert.equal(g.setDirection(-1,oldRound,oldUI),false);
  g.applyHint();g.goHome();assert.equal(g.hintGuide,null);
  g.startGame('story','1');g.applyHint();g.board=rotate(g.board,3,1);
  assert.equal(g.currentHintGuide(),null,'a hint cannot follow a different board');
  g.applyHint();g.board=GOAL;g.won=true;g.complete();assert.equal(g.hintGuide,null);
});

test('native daily keeps the last active hint visibly available until that guidance is cleared',()=>{
  const f=paintingFixture('daily'),g=f.game,original=g.referenceControl,dims=[];
  g.referenceControl=function(...args){if(args[0]==='✧ 提示')dims.push(args[7]);return original.apply(this,args);};
  g.hints=hintLimit('daily')-1;g.applyHint();g.drawGame();
  assert.equal(g.hintsLeft(),0);assert.equal(dims.at(-1),false);
  g.setDirection(g.hintGuide.dir);g.drawGame();assert.equal(dims.at(-1),false);
  g.clearHintGuide();g.draw();g.drawGame();assert.equal(dims.at(-1),true);
});

test('native invalidates and detaches pending hint requests on round changes and home',()=>{
  for(const leave of ['reset','home']){
    const f=ready(),g=f.game,detached=[];
    const request={round:g.roundSerial,ad:{offClose:fn=>detached.push(fn),offError:fn=>detached.push(fn)},onClose(){},onError(){}};
    g.hintRequest=request;assert.equal(g.hintRequestCurrent(request),true);
    if(leave==='reset')g.startGame('story','1');else g.goHome();
    assert.equal(g.hintRequest,null);assert.equal(g.hintRequestCurrent(request),false);assert.equal(g.hints,0);
    assert.deepEqual(detached,[request.onClose,request.onError]);
  }
});

test('native target step allows any valid turn and clears its guidance when that turn begins',()=>{
  for(const q of [0,3]){
    const f=ready('story',0,-1),g=f.game;g.applyHint();g.setDirection(-1);
    class UITransform{}class UIOpacity{constructor(){this.opacity=255;}}
    const vector=(x=0,y=0,z=1)=>({x,y,z,clone(){return vector(this.x,this.y,this.z);}});
    const node=(name,x,y,w,h)=>{
      const n=new f.NativeNode(name);n.position=vector(x,y);n.scale=vector(1,1);n.components.set(UITransform,{width:w,height:h});
      n.addChild(new f.NativeNode('Content'));return n;
    };
    const a=reference.tileArea;g.boardContent=new f.NativeNode('Board');
    g.tileNodes=reference.slotRects.map((p,i)=>node('Tile '+i,p[0]-a[0]+p[2]/2,-(p[1]-a[1]+p[3]/2),p[2],p[3]));
    g.knobArtNodes=reference.knobCenters.map((p,i)=>node('Knob '+i,0,0,80,80));
    g.knobNodes=reference.knobCenters.map((p,i)=>node('Hit '+i,p[0]-a[0],-(p[1]-a[1]),80,80));
    g.turnOutline=name=>new f.NativeNode(name);g.applyTurnFrame=()=>{};
    // Execute the exact compiled production method with the additional cc
    // component tokens needed by spin(), without altering the shared fixture.
    const spin=vm.runInNewContext('({'+g.spin.toString()+'}).spin',{SQUARES,createTurnMotion,UITransform,UIOpacity,at:()=>1000});
    const before=g.board;spin.call(g,q);
    assert.equal(g.hintGuide,null);assert.equal(g.hints,1);assert.equal(g.busy,true);
    assert.equal(g.turnMotion.q,q);assert.equal(g.turnMotion.dir,-1);assert.equal(g.turnMotion.board,before);
    assert.equal(g.board,before);assert.equal(g.moves,0,'the move is committed by the existing animation completion path');
  }
});
