import {test} from 'node:test';
import assert from 'node:assert/strict';
import {GOAL} from '../cocos/assets/scripts/Core.js';
import {webFixture,nativeFixture,TEST_DAY,flush} from './helpers/runtime-fixtures.mjs';

// This suite executes production functions and DOM/cc event callbacks.
// Rendering and platform I/O are substituted; it is not browser/device QA.
const plain=value=>JSON.parse(JSON.stringify(value));
const webRound=f=>plain(f.run('({mode,key,board,moves,hints,elapsed,showNumbers,roundSerial,won,viewArt})'));
const nativeRound=g=>({mode:g.mode,key:g.key,board:g.board,moves:g.moves,hints:g.hints,elapsed:g.elapsed,showNumbers:g.showNumbers,roundSerial:g.roundSerial,won:g.won,admiring:g.admiring});
const writesFor=(f,key)=>f.storage.writes.filter(write=>write.key==='fourfold:'+key);
function winWeb(f){f.setClock(13500);f.run('board=GOAL;moves=8;hints=1;started=1000;finish();');}
function winNative(f){const g=f.game;g.board=GOAL;g.moves=8;g.hints=1;g.elapsed=12.5;g.won=true;g.complete();}

test('web number preference defaults on, persists false/true, and survives starts and reset',async()=>{
  for(const preference of [undefined,false,true]){
    const f=webFixture({preferences:preference===undefined?{}:{showNumbers:preference}});await f.start();
    assert.equal(f.run('showNumbers'),preference!==false);
    assert.equal(f.el('gameScreen').dataset.showNumbers,String(preference!==false));
    let prevented=false;const direction=f.run('dir');
    f.window.dispatch('keydown',{key:' ',target:f.el('numbersBtn'),preventDefault(){prevented=true;}});
    assert.equal(prevented,false,'the global shortcut must let a focused button handle Space');
    assert.equal(f.run('dir'),direction,'Space on the preference button must not change rotation direction');
    const storedCount=f.storage.writes.length,storedPreference=f.run('showNumbers');
    f.run('rotating=true;render()');assert.equal(f.el('numbersBtn').disabled,true);
    assert.equal(f.el('numbersBtn').onclick(),false,'a queued click must not redraw during a turn');
    assert.equal(f.storage.writes.length,storedCount);assert.equal(f.run('showNumbers'),storedPreference);
    f.run('rotating=false;render()');
    const before=webRound(f);f.el('numbersBtn').click();
    assert.equal(f.run('showNumbers'),preference===false);
    assert.equal(f.storage.getItem('fourfold:showNumbers'),JSON.stringify(preference===false));
    const toggled=webRound(f);assert.deepEqual({...toggled,showNumbers:before.showNumbers},before);
    await f.start('daily',TEST_DAY);f.run('reset()');await flush();
    assert.equal(f.run('showNumbers'),preference===false,'starting/resetting a round must not overwrite the preference');
    const restored=webFixture({storage:f.storage});await restored.start('story','2');
    assert.equal(restored.run('showNumbers'),preference===false,'a new app instance reads the persisted preference');
    restored.el('numbersBtn').click();assert.equal(restored.run('showNumbers'),preference!==false);
    assert.equal(f.storage.getItem('fourfold:showNumbers'),JSON.stringify(preference!==false));
  }
});

test('web completion records exactly once and leaves the solved board with no automatic modal or route',async()=>{
  const f=webFixture({preferences:{showNumbers:false}});await f.start('story','4');
  const round=f.run('roundSerial');winWeb(f);
  assert.equal(f.run('board'),GOAL);assert.equal(f.run('won'),true);assert.equal(f.run('roundSerial'),round);
  assert.equal(f.run('key'),'4');assert.equal(f.el('modal').hidden,true);assert.equal(f.el('completionActions').hidden,false);
  assert.equal(f.el('playDirection').hidden,true);assert.equal(f.el('playTools').hidden,true);
  assert.equal(writesFor(f,'best:story:4').length,1);assert.equal(writesFor(f,'unlocked').length,1);
  assert.equal(JSON.parse(f.storage.getItem('fourfold:unlocked')),5);
  assert.equal(f.run('showNumbers'),false);assert.equal(f.run('viewArt'),false);
  const state=webRound(f);f.run('finish();finish();');f.setClock(99000);f.run('updateTime()');
  assert.deepEqual(webRound(f),state,'finish is idempotent and the victory clock stays frozen');
  assert.equal(writesFor(f,'best:story:4').length,1);assert.equal(writesFor(f,'unlocked').length,1);
});

test('web details X, backdrop and Escape only close; stale detail buttons cannot advance',async()=>{
  const f=webFixture();await f.start();winWeb(f);const solved=webRound(f);
  for(const close of ['x','backdrop','escape']){
    f.el('resultDetailsBtn').click();assert.equal(f.el('modal').hidden,false);
    const stalePrimary=f.el('dialogPrimary').onclick;
    if(close==='x')f.el('closeModal').click();
    else if(close==='backdrop')f.el('modal').dispatch('click');
    else f.window.dispatch('keydown',{key:'Escape'});
    assert.equal(f.el('modal').hidden,true);assert.deepEqual(webRound(f),solved);
    stalePrimary();assert.deepEqual(webRound(f),solved,'a detached details action is not an explicit new next request');
  }
  assert.equal(writesFor(f,'best:story:1').length,1);
  f.el('nextBtn').click();await flush();assert.equal(f.run('key'),'2');assert.equal(f.run('won'),false);
});

test('web explicit next uses story/final/daily routes once and rejects an old round',async()=>{
  for(const [mode,key,nextMode,nextKey] of [['story','3','story','4'],['story','18','daily',TEST_DAY],['daily',TEST_DAY,'story','7']]){
    const f=webFixture({preferences:{unlocked:7}});await f.start(mode,key);winWeb(f);
    const oldRound=f.run('roundSerial'),click=f.el('nextBtn').onclick;
    const solvedBeforeModal=webRound(f);f.run("openDialog({title:'阻断测试'})");click();
    assert.deepEqual(webRound(f),solvedBeforeModal,'a generic dialog must block an old completion-page next callback');
    f.el('closeModal').click();f.run('openSettings()');click();
    assert.deepEqual(webRound(f),solvedBeforeModal,'settings must also block advancement without consuming the completion route');
    f.el('settingsClose').click();
    click();click();await flush();
    assert.equal(f.run('mode'),nextMode);assert.equal(f.run('key'),nextKey);assert.equal(f.run('roundSerial'),oldRound+1);
    assert.equal(f.run('won'),false);click();assert.equal(f.run('roundSerial'),oldRound+1);
    winWeb(f);const current=webRound(f);click();assert.deepEqual(webRound(f),current,'an old completion callback cannot advance a later solved round');
  }
});

test('web artwork view preserves result and preference, restores the board, and rejects old controls',async()=>{
  const f=webFixture({preferences:{showNumbers:false}});await f.start();
  assert.equal(f.run('toggleArtView()'),false,'artwork mode is available only after completion');
  winWeb(f);const solved=webRound(f),oldToggle=f.el('viewArtBtn').onclick,oldNext=f.el('nextBtn').onclick,oldDetails=f.el('resultDetailsBtn').onclick;
  f.el('viewArtBtn').click();assert.equal(f.run('viewArt'),true);assert.equal(f.el('completeArt').hidden,false);
  assert.equal(f.el('boardFrame').classList.contains('view-art'),true);assert.equal(f.el('board').getAttribute('aria-hidden'),'true');
  assert.equal(f.el('anchors').getAttribute('aria-hidden'),'true');
  assert.deepEqual({...webRound(f),viewArt:false},solved);
  f.el('resultDetailsBtn').click();f.el('closeModal').click();assert.equal(f.run('viewArt'),true);
  f.el('viewArtBtn').click();assert.equal(f.el('completeArt').hidden,true);assert.equal(f.el('boardFrame').classList.contains('view-art'),false);
  assert.equal(f.el('board').getAttribute('aria-hidden'),'false');assert.deepEqual(webRound(f),solved);
  await f.start('story','2');oldToggle();assert.equal(f.run('viewArt'),false);assert.equal(f.run('showNumbers'),false);
  f.run('showHome()');const home=webRound(f);oldToggle();oldNext();oldDetails();
  assert.equal(f.el('gameScreen').hidden,true);assert.equal(f.el('modal').hidden,true);assert.deepEqual(webRound(f),home);
});

test('native number preference loads from wx/local storage and persists across rounds',()=>{
  for(const useWx of [true,false])for(const preference of [undefined,false,true]){
    const f=nativeFixture({useWx,preferences:preference===undefined?{}:{showNumbers:preference}}),g=f.game;
    assert.equal(g.showNumbers,preference!==false);g.startGame('story','1');
    const before=nativeRound(g);g.toggleNumbers();assert.equal(g.showNumbers,preference===false);
    assert.deepEqual({...nativeRound(g),showNumbers:before.showNumbers},before);
    assert.equal(f.storage.getItem('fourfold:showNumbers'),JSON.stringify(preference===false));
    g.startGame('daily',TEST_DAY);g.startGame(g.mode,g.key);assert.equal(g.showNumbers,preference===false);
    const restored=nativeFixture({useWx,storage:f.storage});restored.game.startGame('story','2');
    assert.equal(restored.game.showNumbers,preference===false);restored.game.toggleNumbers();
    assert.equal(f.storage.getItem('fourfold:showNumbers'),JSON.stringify(preference!==false));
  }
});

test('native number toggle changes only numeral nodes while retaining all nine artwork crops',()=>{
  const f=nativeFixture(),g=f.game;g.startGame('story','1');
  for(const visible of [true,false,true]){
    if(g.showNumbers!==visible)g.toggleNumbers();
    const firstArt=f.art.length,firstText=f.texts.length;g.drawReferenceBoard(0,0,.4);
    assert.equal(f.art.slice(firstArt).filter(item=>/^referenceTile[1-9]$/.test(item.name)).length,9);
    assert.equal(f.texts.slice(firstText).filter(label=>/^Tile index [1-9]$/.test(label.node.name)).length,visible?9:0);
  }
});

test('native completion writes/unlocks once and uploads today’s daily result once without a popup',()=>{
  for(const [mode,key] of [['story','4'],['daily',TEST_DAY]]){
    const f=nativeFixture({preferences:{showNumbers:false}}),g=f.game;g.startGame(mode,key);
    const round=g.roundSerial;winNative(f);const solved=nativeRound(g);
    assert.equal(g.board,GOAL);assert.equal(g.won,true);assert.equal(g.modal,'');assert.equal(g.roundSerial,round);
    assert.equal(f.events.filter(event=>event==='banner:show').length,0);
    assert.equal(writesFor(f,`best:${mode}:${key}`).length,1);
    assert.equal(writesFor(f,'unlocked').length,mode==='story'?1:0);
    assert.equal(f.clouds.length,mode==='daily'?1:0);
    if(mode==='daily')assert.match(f.clouds[0].KVDataList[0].value,new RegExp('^'+TEST_DAY+'\\|'));
    g.complete();g.complete(round);f.setClock(99999);g.updateClock();assert.deepEqual(nativeRound(g),solved);
    assert.equal(writesFor(f,`best:${mode}:${key}`).length,1);assert.equal(f.clouds.length,mode==='daily'?1:0);
  }
});

test('native result X/backdrop close without advancing and detached result actions are ignored',()=>{
  const f=nativeFixture(),g=f.game;g.startGame('story','1');winNative(f);const solved=nativeRound(g);
  for(const which of ['x','backdrop']){
    g.openResultDetails();assert.equal(g.modal,'result');
    const firstHit=f.hits.length,firstShape=f.shapes.length;g.drawResultModal();
    const hit=f.hits.slice(firstHit),primary=hit.find(item=>item.name==='Result next');
    assert(primary,'the actual result renderer must bind an explicit next action');
    if(which==='x')hit.find(item=>item.name==='Result close').action();
    else f.shapes[firstShape].node.emit(f.NativeNode.EventType.TOUCH_END);
    assert.equal(g.modal,'');assert.deepEqual(nativeRound(g),solved);
    primary.action();assert.deepEqual(nativeRound(g),solved,'old result UI tokens cannot advance after closing');
  }
  assert.equal(writesFor(f,'best:story:1').length,1);
  g.nextLevel();assert.equal(g.key,'2');assert.equal(g.won,false);
});

test('native explicit next handles three routes once and guards round/UI generations',()=>{
  for(const [mode,key,nextMode,nextKey] of [['story','3','story','4'],['story','18','daily',TEST_DAY],['daily',TEST_DAY,'story','7']]){
    const f=nativeFixture({preferences:{unlocked:7}}),g=f.game;g.startGame(mode,key);winNative(f);
    const round=g.roundSerial,ui=g.uiSerial,solvedBeforeModal=nativeRound(g);
    for(const modal of ['settings','rank']){g.modal=modal;g.nextLevel(round,ui);assert.deepEqual(nativeRound(g),solvedBeforeModal);}
    g.modal='';g.nextLevel(round,ui);g.nextLevel(round,ui);
    assert.equal(g.mode,nextMode);assert.equal(g.key,nextKey);assert.equal(g.roundSerial,round+1);assert.equal(g.won,false);
    winNative(f);const solved=nativeRound(g);g.nextLevel(round,ui);assert.deepEqual(nativeRound(g),solved);
    const staleUi=g.uiSerial;g.openResultDetails();g.closeModal();g.nextLevel(g.roundSerial,staleUi);
    assert.deepEqual(nativeRound(g),solved,'a callback from a replaced UI tree is not a current next request');
  }
});

test('native artwork view is reversible, preserves metrics/preference, and draws one mural without rails/knobs/numbers',()=>{
  const f=nativeFixture({preferences:{showNumbers:false}}),g=f.game;g.startGame('story','1');
  g.toggleAdmiration();assert.equal(g.admiring,false);winNative(f);const solved=nativeRound(g);
  const round=g.roundSerial,ui=g.uiSerial;g.toggleAdmiration(round,ui);assert.equal(g.admiring,true);
  assert.deepEqual({...nativeRound(g),admiring:false},solved);
  const firstArt=f.art.length,firstGroup=f.groups.length;g.drawReferenceBoard(0,0,.4);
  const visibleArt=f.art.slice(firstArt),visibleGroups=f.groups.slice(firstGroup);
  assert.equal(visibleArt.filter(item=>item.name==='mural').length,1);
  assert.equal(visibleArt.some(item=>/^reference(?:Tile|Knob)/.test(item.name)),false);
  assert.equal(visibleGroups.some(item=>/Clean .* rail|^Tile |^Rotate /.test(item.name)),false);
  g.openResultDetails();g.closeModal();assert.equal(g.admiring,true);
  g.toggleAdmiration();assert.deepEqual(nativeRound(g),solved);
  g.startGame('story','2');g.toggleAdmiration(round,ui);assert.equal(g.admiring,false);assert.equal(g.showNumbers,false);
});
