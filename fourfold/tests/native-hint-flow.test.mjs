import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {GOAL,SQUARES,rotate,hintLimit} from '../cocos/assets/scripts/Core.js';
import {createTurnMotion} from '../cocos/assets/scripts/TurnMotion.js';
import {nativeFixture,reference,TEST_DAY} from './helpers/runtime-fixtures.mjs';

// Production component methods and callbacks with cc drawing substituted.
// This checks interaction state, not Creator rendering or WeChat device behavior.
function ready(mode='story',q=0,dir=1,cc={}){
  const f=nativeFixture({cc}),g=f.game;g.startGame(mode,mode==='daily'?TEST_DAY:'1');
  g.board=rotate(GOAL,q,-dir);return f;
}

function paintingFixture(mode='story',q=0,dir=1){
  class Vec3 {constructor(x=0,y=0,z=0){Object.assign(this,{x,y,z});}}
  class UITransform {
    setContentSize(w,h){this.width=w;this.height=h;}
    convertToWorldSpaceAR(point){const result={...point};for(let node=this.node;node;node=node.parent){result.x+=node.position?.[0]||0;result.y+=node.position?.[1]||0;}return result;}
    convertToNodeSpaceAR(point){const origin=this.convertToWorldSpaceAR(new Vec3());return new Vec3(point.x-origin.x,point.y-origin.y,point.z);}
  }
  const f=ready(mode,q,dir,{UITransform,Vec3,Layers:{Enum:{UI_2D:1}}}),g=f.game;f.created=[];
  g.root.addComponent(UITransform);g.group=f.Game.prototype.group.bind(g);
  g.createNode=(name,x,y,w,h,parent=g.root)=>{
    const node=new f.NativeNode(name);node.rect={x,y,w,h};parent.addChild(node);node.addComponent(UITransform).setContentSize(w,h);node.setPosition(x+w/2,-y-h/2);
    node.getSiblingIndex=()=>node.parent.children.indexOf(node);
    node.setSiblingIndex=index=>{const siblings=node.parent.children;siblings.splice(siblings.indexOf(node),1);siblings.splice(index,0,node);};
    f.created.push(node);return node;
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
    const oldDirectionOutline=g.hintVisualNodes[0],oldShade=g.hintMaskNode;
    assert.deepEqual(oldShade.rect,{x:0,y:0,w:g.width,h:g.height});
    if(mode==='story')f.buttons.findLast(button=>button.label===(dir===1?'↻ 顺时针':'↺ 逆时针')).action();
    else{
      const button=f.created.findLast(node=>node.name===(dir===1?'↻ 顺时针':'↺ 逆时针'));
      button.emit('start');button.emit('end');
    }
    assert.equal(g.hintGuide.stage,'target');assert.equal(oldDirectionOutline.isValid,false);assert.equal(oldShade.isValid,false);
    g.drawGame();assert.deepEqual(Array.from(g.hintVisualNodes,node=>node.name),['Hint target knob 3']);
    const spot=g.hintFocus.lastRect,scale=g.boardLayout.size/reference.tileArea[2],center=reference.knobCenters[3],a=reference.tileArea;
    assert.equal(spot.w,reference.knobClipRadius*2*scale+6*g.windowScale);assert.equal(spot.h,spot.w);
    assert.ok(Math.abs(spot.x+spot.w/2-(g.boardLayout.x+(center[0]-a[0])*scale))<.001);
    assert.ok(Math.abs(spot.y+spot.h/2-(g.boardLayout.y+(center[1]-a[1])*scale))<.001);
    assert.equal(g.hints,1);
  }
});

test('native spotlight keeps the screen shade static, follows scrolling and clears across lifecycle changes',()=>{
  const f=paintingFixture('daily',2,-1),g=f.game;
  g.draw=()=>{g.clear();g.drawGame();};g.applyHint();
  const shade=g.hintMaskNode,glow=g.hintVisualNodes[0],opacity=[...glow.components.values()].find(component=>'opacity' in component);
  assert.equal(opacity.opacity,102);assert.equal([...shade.components.values()].some(component=>'opacity' in component),false);
  assert.equal(shade.events.size,0,'the visual shade cannot consume button input');
  for(let i=0;i<11;i++)g.updateHintPulse(.1);
  assert.equal(opacity.opacity,255);assert.equal(g.hintMaskNode,shade,'breathing cannot replace or animate the shade');
  for(let i=0;i<11;i++)g.updateHintPulse(.1);
  assert.equal(opacity.opacity,102);
  g.setDirection(-1);const guide=g.hintGuide,target=g.hintFocus,previousY=target.lastRect.y,parent=target.parent,position=parent.position;
  parent.setPosition(position[0],position[1]+28);g.updateHintPulse(.1);
  assert.equal(target.lastRect.y,previousY-28,'the hole follows its scrolled target in root coordinates');
  for(const state of ['settings','']){g.modal=state;g.draw();assert.equal(g.hintGuide,guide);assert.equal(!!g.hintMaskNode,!state);}
  const beforeHide=g.hintMaskNode;g.onAppHide();assert.equal(g.hintMaskNode,null);assert.equal(beforeHide.isValid,false);assert.equal(g.hintGuide,guide);
  g.onAppShow();assert.ok(g.hintMaskNode);assert.equal(g.hintGuide,guide);assert.equal(g.hints,1);
  g.onDisable();assert.equal(g.hintMaskNode,null);g.onEnable();assert.ok(g.hintMaskNode);assert.equal(g.hintGuide,guide);
  const lastMask=g.hintMaskNode;g.clearHintGuide();assert.equal(lastMask.isValid,false);assert.equal(g.hintMaskNode,null);assert.equal(g.hintVisualNodes.length,0);
});

test('native short-screen spotlight brings each new target into view once without locking later scrolling',()=>{
  const f=paintingFixture('daily',0,-1),g=f.game,scrolls=[];g.height=360;g.safeTop=18;g.safeBottom=12;
  g.pageContent=(name,height)=>{
    const content=g.group(name,0,g.safeTop,g.width,height).content,origin=[...content.position],max=Math.max(0,height-g.height+g.safeTop+g.safeBottom);
    let offset=Math.min(max,g.scrollOffsets['short-screen']||0);content.setPosition(origin[0],origin[1]+offset);
    g.pageScrollKey='short-screen';
    g.pageScroll={getScrollOffset:()=>({x:0,y:offset}),getMaxScrollOffset:()=>({x:0,y:max}),scrollToOffset(point){offset=point.y;content.setPosition(origin[0],origin[1]+offset);scrolls.push(offset);}};
    return content;
  };
  g.draw=()=>{g.clear();g.drawGame();};g.applyHint();
  const visible=()=>{const rect=g.hintFocus.lastRect;assert.ok(rect.y>=g.safeTop+8-.001);assert.ok(rect.y+rect.h<=g.height-g.safeBottom-8+.001);};
  visible();assert.equal(scrolls.length,1);
  g.setDirection(-1);visible();assert.equal(scrolls.length,2,'the offscreen knob is revealed when the hint advances');
  const originalY=g.hintFocus.lastRect.y,offset=g.pageScroll.getScrollOffset();g.pageScroll.scrollToOffset({x:0,y:offset.y+28});const calls=scrolls.length;
  g.updateHintPulse(.1);g.updateHintPulse(.1);
  assert.equal(scrolls.length,calls,'subsequent frames cannot force the scroll position back');
  assert.ok(Math.abs(g.hintFocus.lastRect.y-originalY+28)<.001);assert.equal(g.hints,1);
});

test('native hint toast stays beneath the shade and clear of the only illuminated control',()=>{
  const f=paintingFixture('daily'),g=f.game;g.applyHint();g.drawGame();g.scheduleOnce=()=>{};
  f.Game.prototype.toast.call(g,'先点击高亮的顺时针');
  const toast=g.toastNode,focus=g.hintFocus.lastRect;
  assert.ok(toast.getSiblingIndex()<g.hintMaskNode.getSiblingIndex());
  assert.ok(toast.rect.y+toast.rect.h<=focus.y-12||toast.rect.y>=focus.y+focus.h+12);
  assert.ok(f.texts.some(label=>label.string==='先点击高亮的顺时针'),'the existing instruction remains in the toast');
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
