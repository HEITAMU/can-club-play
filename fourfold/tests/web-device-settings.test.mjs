import {test} from 'node:test';
import assert from 'node:assert/strict';
import {webFixture,flush} from './helpers/runtime-fixtures.mjs';

// Exercise production settings and motion with substituted audio/device I/O.
// These assertions do not establish phone speaker output or perceived timing.
async function ready(preferences={}){
  const sources=[];
  const context={state:'suspended',currentTime:0,destination:{},
    async resume(){this.state='running';},async suspend(){this.state='suspended';},async close(){this.state='closed';},
    async decodeAudioData(){return {duration:.24};},
    createGain(){return {gain:{cancelScheduledValues(){},setValueAtTime(){},linearRampToValueAtTime(){}},connect(){},disconnect(){}};},
    createBufferSource(){const source={connect(){},disconnect(){},start(){},stop(){}};sources.push(source);return source;},
  };
  const f=webFixture({preferences,audioOptions:{contextFactory:()=>context,sessionFactory:()=>null,fetchAudio:async()=>({ok:true,arrayBuffer:async()=>new ArrayBuffer(8)})}});
  await f.start();return {f,context,sources,audio:f.audioControllers[0]};
}
function click(f,id){const button=f.el(id);f.document.dispatch('click',{target:button});button.click();}
function animations(f){
  const pending=[];
  f.context.__deviceAnimation=(frames,options)=>{
    let resolve,reject;const finished=new Promise((yes,no)=>{resolve=yes;reject=no;});
    const animation={frames,options,finished,finish:resolve,cancel:()=>reject(new Error('cancelled'))};
    pending.push(animation);return animation;
  };
  f.run('for(const node of [...tileNodes.values(),turnFocus,...anchorMotionNodes,...anchorRingNodes])node.animate=__deviceAnimation;');
  return pending;
}

test('settings show executing app/audio build IDs independently of HTML and retain separate cue records',async()=>{
  const {f,audio,sources}=await ready();
  const token=audio.beginTurn();await flush();sources.at(-1).onended();
  await audio.finishTurn(token);sources.at(-1).onended();
  await audio.testSound();sources.at(-1).onended();
  const before=audio.getDiagnostics();
  f.el('app').dataset.build='old-html';
  click(f,'settingsBtn');await flush();
  assert.match(f.el('settingsBuild').textContent,/脚本 0\.8\.29 · 音频 0\.8\.29 · 页面 old-html/);
  assert.equal(f.el('settingsBuild').classList.contains('settings-build-mismatch'),true);
  for(const cue of ['press','seat','test'])assert.deepEqual(audio.getDiagnostics().cues[cue],before.cues[cue],cue+' survives the settings button sound');
  assert.match(f.el('settingsAudioCues').textContent,/按下 已结束；落位 已结束/);
  assert.equal(f.el('settingsAudioTest').textContent,'已结束');
  assert.match(f.el('settingsTurn').textContent,/本页尚未完成旋转/);
  audio.dispose();
});

test('touch/pen warm audio on release, mouse on down, and dedicated audio buttons avoid a duplicate generic click',async()=>{
  const {f,audio}=await ready();let unlocks=0,buttons=0;
  audio.unlock=()=>{unlocks++;return Promise.resolve(true);};
  audio.playButton=()=>{buttons++;return Promise.resolve(true);};
  f.document.dispatch('pointerdown',{pointerType:'touch'});f.document.dispatch('pointerdown',{pointerType:'pen'});
  assert.equal(unlocks,0);
  f.document.dispatch('pointerdown',{pointerType:'mouse'});assert.equal(unlocks,1);
  f.document.dispatch('pointerup',{pointerType:'mouse'});assert.equal(unlocks,1);
  f.document.dispatch('pointerup',{pointerType:'touch'});f.document.dispatch('pointerup',{pointerType:'pen'});
  f.document.dispatch('touchend');f.document.dispatch('keydown');assert.equal(unlocks,5);
  f.run('openSettings()');
  for(const id of ['settingsSound','settingsTestSound','settingsSoundOutput'])f.document.dispatch('click',{target:f.el(id)});
  f.run('closeSettings()');f.document.dispatch('click',{target:f.run('anchorNodes[0]')});
  assert.equal(buttons,0);
  f.document.dispatch('click',{target:f.el('cwBtn')});assert.equal(buttons,1);
  audio.dispose();
});

test('audition opens checks, preserves mute, and compatibility mode persists until explicitly restored',async()=>{
  const {f,audio,sources}=await ready({sound:false});
  let tests=0;const originalTest=audio.testSound;audio.testSound=()=>{tests++;return originalTest();};
  f.run('openSettings()');click(f,'settingsTestSound');await flush();
  assert.equal(tests,1);assert.equal(f.el('settingsDiagnostics').getAttribute('open'),'');
  assert.match(f.el('settingsAudioTest').textContent,/音效关闭/);assert.equal(sources.length,0);
  click(f,'settingsSoundOutput');await flush();
  assert.equal(tests,2);assert.equal(f.storage.getItem('fourfold:soundOutput'),'"media"');
  assert.equal(f.el('settingsSoundOutput').textContent,'恢复标准音效');assert.equal(audio.getDiagnostics().mode,'media');
  assert.equal(audio.getDiagnostics().enabled,false);assert.equal(f.storage.getItem('fourfold:sound'),'false');
  assert.match(f.el('settingsAudioTest').textContent,/音效关闭/);assert.equal(sources.length,0);
  const reloaded=await ready({sound:false,soundOutput:'media'});reloaded.f.run('openSettings()');
  assert.equal(reloaded.f.el('settingsSoundOutput').textContent,'恢复标准音效');
  click(f,'settingsSoundOutput');await flush();
  assert.equal(tests,2,'restoring the standard mode does not sneak in another audition');
  assert.equal(f.storage.getItem('fourfold:soundOutput'),'"standard"');assert.equal(audio.getDiagnostics().mode,'standard');
  assert.equal(audio.getDiagnostics().enabled,false);
  audio.dispose();reloaded.audio.dispose();
});

test('device checks report specific production failures and never infer that the phone was audible',async()=>{
  const f=webFixture();await f.start();f.run('openSettings()');
  click(f,'settingsTestSound');await flush();
  assert.equal(f.el('settingsDiagnostics').getAttribute('open'),'');
  assert.match(f.el('settingsAudioTest').textContent,/失败.*音频接口不可用/);
  assert.match(f.el('settingsAudioSession').textContent,/接口不支持/);
  assert.doesNotMatch(f.el('settingsAudioTest').textContent,/声音正常|听见|播放成功/);
  f.audioControllers[0].dispose();
});

test('explicit full/gentle preference survives reload and both modes measure completed WAAPI turns at 800 ms',async()=>{
  for(const mode of ['full','gentle']){
    const {f,audio}=await ready({turnMotion:mode});f.window.matchMedia=()=>({matches:true});
    f.run('openSettings()');assert.equal(f.el('settingsMotion').textContent,mode==='full'?'旋转动画：完整':'旋转动画：轻柔');
    f.run('closeSettings()');const pending=animations(f),turn=f.run('spin(0)');await flush();
    assert(pending.length>0);assert(pending.every(animation=>animation.options.duration===800));
    assert.equal(pending[0].frames.length,mode==='gentle'?4:f.run('TURN_KEYFRAME_COUNT'));
    f.setClock(1808);pending.forEach(animation=>animation.finish());await turn;await flush();
    f.run('openSettings()');assert.match(f.el('settingsTurn').textContent,/0\.808 秒 \/ 目标 0\.800 秒 · 已完成/);
    assert.match(f.el('settingsMotionStatus').textContent,/WAAPI；系统减少动态：开/);
    click(f,'settingsMotion');await flush();
    assert.equal(f.storage.getItem('fourfold:turnMotion'),JSON.stringify(mode==='full'?'gentle':'full'));
    assert.match(f.el('settingsTurn').textContent,/0\.808 秒/,'changing the next mode retains the last measured result');
    audio.dispose();
  }
});

test('cancelled WAAPI and completed RAF turns keep distinct observed durations without inventing a completion',async()=>{
  const cancelled=await ready(),f=cancelled.f,pending=animations(f),turn=f.run('spin(0)');await flush();
  f.setClock(1375);f.run('openSettings()');await turn;
  assert.match(f.el('settingsTurn').textContent,/0\.375 秒 \/ 目标 0\.800 秒 · 已取消/);
  assert.equal(f.run('moves'),0);pending.forEach(animation=>animation.finish());await flush();
  assert.equal(f.run('lastTurnMeasure.state'),'cancelled');
  const fallback=await ready({turnMotion:'gentle'}),g=fallback.f,rafTurn=g.run('spin(0)');await flush();
  g.setClock(2205);
  const [id,timer]=[...g.timers].find(([,timer])=>timer.delay===16);g.timers.delete(id);timer.callback();
  await rafTurn;g.run('openSettings()');
  assert.match(g.el('settingsTurn').textContent,/1\.205 秒 \/ 目标 0\.800 秒 · 已完成/);
  assert.match(g.el('settingsMotionStatus').textContent,/轻柔 · RAF/);
  cancelled.audio.dispose();fallback.audio.dispose();
});
