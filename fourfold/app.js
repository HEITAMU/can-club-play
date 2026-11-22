import {createBackgroundMusic} from './music.mjs?v=0.8.33';
import {GOAL,SQUARES,rotate,isSolved,shortestPath,makePuzzle,todayCN,resultScore,honor,parseChallenge,hintLimit,isBetterResult} from './cocos/assets/scripts/CoreHardWeb.js?story=linear18-v2&v=0.8.33';
import {TURN_DURATION_MS,TURN_KEYFRAME_COUNT,createTurnMotion,sampleTurn} from './cocos/assets/scripts/TurnMotion.js?v=0.8.33';
import {HOME_ART,HOME_UI,HOME_COLORS,homeStoryLabel} from './cocos/assets/scripts/HomeScene.js?v=0.8.33';
import {getTileTheme,buildThemeArtwork} from './cocos/assets/scripts/TileThemes.js?v=0.8.33';
import {createGameAudio} from './audio.mjs?v=0.8.33';

const APP_BUILD='0.8.33';
const el=id=>document.getElementById(id);
const $={board:el('board'),anchors:el('anchors'),target:el('target'),moves:el('moves'),par:el('par'),clock:el('clock'),instruction:el('instruction'),difficulty:el('difficulty'),chapterCaption:el('chapterCaption'),puzzleTitle:el('puzzleTitle'),storyTab:el('storyTab'),dailyTab:el('dailyTab'),cwBtn:el('cwBtn'),ccwBtn:el('ccwBtn'),modal:el('modal'),toast:el('toast')};
const names=['星图初醒','看似简单','交错轨道','一念之差','不对称','失序之环','倒影之谜','四角对峙','镜像迷宫','群星换位','王冠密码','无声棋局','深空共振','星环审判','暗夜回响','隐秘秩序','星渊终章','逻辑之冠'];
const currentDay=()=>todayCN();
const read=(key,otherwise)=>{try{const v=localStorage.getItem('fourfold:'+key);return v===null?otherwise:JSON.parse(v);}catch{return otherwise;}};
const write=(key,value)=>{try{localStorage.setItem('fourfold:'+key,JSON.stringify(value));}catch{}};
const unlocked=()=>String(Math.min(18,Math.max(1,parseInt(read('unlocked',1),10)||1)));
const gameScreen=el('gameScreen');
const rankScreen=el('rankScreen');
const settingsOverlay=el('settingsOverlay');
const notice=el('startupNotice');
const tileNodes=new Map();
const themeCache=new Map();
let baseTileArtwork=null,tileArtwork=null,tileTheme=null;
let themeLoadSerial=0,themeLoading=false,themeError=false;
const anchorNodes=[];
const anchorMotionNodes=[],anchorRingNodes=[],knobAngles=[0,0,0,0];
const turnFocus=el('turnFocus'),boardFrame=el('boardFrame');

let mode='story',key='1',dir=1,board=GOAL,puzzle=null,moves=0,hints=0,won=false,started=0,elapsed=0,claimedBeat=null,highlight=-1;
let hintGuide=null,hintSpotlightFrame=0;
let musicEnabled=read('music',true)!==false;
const backgroundMusic=createBackgroundMusic({enabled:musicEnabled,isVisible:()=>!document.hidden});
let soundEnabled=read('sound',true)!==false,clockTimer=0,toastTimer=0;
let soundOutputMode=read('soundOutput','standard')==='media'?'media':'standard';
let turnMotionMode=read('turnMotion','full')==='gentle'?'gentle':'full';
let audioSnapshot=null,activeTurnMeasure=null,lastTurnMeasure=null;
const gameAudio=createGameAudio({enabled:soundEnabled,outputMode:soundOutputMode,isVisible:()=>!document.hidden,onStatus:onAudioStatus});
let showNumbers=read('showNumbers',true)!==false,viewArt=false,completionMetric=null;
let ready=false,bootFailed=false,pendingOpen=window.ffPending||null;
let rotating=false,motionEpoch=0,activeAnimations=[];
let motionFallback=null;
let rankOrigin='home';
let roundSerial=0,resultRouteToken=null,resultDialogToken=null;
window.ffReady=false;

// Fetching is non-blocking; playback is unlocked by the first real gesture.
void gameAudio.preload();
document.addEventListener('pointerdown',event=>{if(event.pointerType==='mouse')void gameAudio.unlock();},{capture:true,passive:true});
document.addEventListener('pointerup',event=>{if(event.pointerType!=='mouse')void gameAudio.unlock();},{capture:true,passive:true});
document.addEventListener('touchend',()=>{void gameAudio.unlock();},{capture:true,passive:true});
document.addEventListener('keydown',()=>{void gameAudio.unlock();void backgroundMusic.resume({gesture:true});},true);
document.addEventListener('click',event=>{
  const button=event.target.closest?.('button');
  if(button?.id!=='settingsMusic')void backgroundMusic.resume({gesture:true});
  if(!button||button.disabled||button.closest('[hidden]')||button.classList.contains('spin-node')||['settingsSound','settingsTestSound','settingsSoundOutput'].includes(button.id))return;
  void gameAudio.playButton();
},true);
function toast(message){
  $.toast.textContent=message;$.toast.classList.add('show');
  clearTimeout(toastTimer);toastTimer=setTimeout(()=>$.toast.classList.remove('show'),2800);
}
function currentHint(){
  if(hintGuide&&(hintGuide.round!==roundSerial||hintGuide.board!==board||won))clearHintGuide();
  return hintGuide;
}
function hintInstruction(guide){
  return guide.stage==='direction'?`先点击“${guide.dir===1?'顺时针':'逆时针'}”`:'再点击这四格中间的旋转按钮';
}
function hideHintSpotlight(){
  const spotlight=el('hintSpotlight');
  spotlight.hidden=true;spotlight.dataset.target='';spotlight.dataset.stage='';
  document.documentElement.classList.remove('hint-spotlight-active');
  if(hintSpotlightFrame){window.cancelAnimationFrame?.(hintSpotlightFrame);hintSpotlightFrame=0;}
}
function syncHintSpotlight(){
  hintSpotlightFrame=0;
  const guide=currentHint(),spotlight=el('hintSpotlight');
  if(!guide||gameScreen.hidden||!$.modal.hidden||!settingsOverlay.hidden||document.hidden||rotating||!themeReady()){
    hideHintSpotlight();return;
  }
  const target=guide.stage==='direction'?(guide.dir===1?$.cwBtn:$.ccwBtn):anchorNodes[guide.q];
  const targetName=guide.stage==='direction'?target.id:'rotation-'+guide.q;
  const targetBounds=()=>{
    if(guide.stage==='direction')return target.getBoundingClientRect();
    const tiles=SQUARES[guide.q].map(index=>tileNodes.get(board[index]).getBoundingClientRect());
    const left=Math.min(...tiles.map(r=>r.left)),top=Math.min(...tiles.map(r=>r.top));
    const right=Math.max(...tiles.map(r=>r.right)),bottom=Math.max(...tiles.map(r=>r.bottom));
    return {left,top,right,bottom,width:right-left,height:bottom-top};
  };
  let rect=targetBounds();
  const viewport=gameScreen.getBoundingClientRect();
  // Reveal the whole four-tile group on short phones, rather than just its centre.
  if(spotlight.dataset.target!==targetName&&(rect.top<viewport.top+4||rect.bottom>viewport.bottom-4)){
    if(guide.stage==='target'){
      const available=viewport.height-8;
      const delta=rect.height>available?(rect.top+rect.bottom-viewport.top-viewport.bottom)/2:rect.top<viewport.top+4?rect.top-viewport.top-4:rect.bottom-viewport.bottom+4;
      gameScreen.scrollTop+=delta;
    }else target.scrollIntoView?.({block:'nearest',inline:'nearest',behavior:'auto'});
    rect=targetBounds();
  }
  if(rect.width<=0||rect.height<=0){hideHintSpotlight();return;}
  const focus=el('hintSpotlightFocus'),padding=3;
  focus.style.left=(rect.left-padding)+'px';focus.style.top=(rect.top-padding)+'px';
  focus.style.width=(rect.width+padding*2)+'px';focus.style.height=(rect.height+padding*2)+'px';
  spotlight.dataset.stage=guide.stage;spotlight.dataset.target=targetName;spotlight.hidden=false;
  document.documentElement.classList.add('hint-spotlight-active');
}
function queueHintSpotlight(){
  if(!hintGuide)return;
  if(!window.requestAnimationFrame){syncHintSpotlight();return;}
  if(!hintSpotlightFrame)hintSpotlightFrame=window.requestAnimationFrame(syncHintSpotlight);
}
function clearHintGuide(){
  hintGuide=null;highlight=-1;gameScreen.dataset.hintStage='';
  hideHintSpotlight();
  for(const button of [$.cwBtn,$.ccwBtn,...anchorNodes]){
    button.classList.remove('hint-direction','hinted');button.removeAttribute('aria-describedby');
  }
  for(const tile of tileNodes.values())tile.classList.remove('hint-selected','hint-muted');
}
function clearTurnVisuals(resetKnobs=false){
  if(resetKnobs)knobAngles.fill(0);
  for(const tile of tileNodes.values()){
    tile.style.zIndex='';tile.style.transform='';tile.style.opacity='';tile.style.filter='';
    tile.classList.remove('turn-selected','turn-muted');
  }
  turnFocus.hidden=true;turnFocus.style.opacity='';
  $.board.classList.remove('rotating');$.anchors.removeAttribute('aria-busy');
  delete $.board.dataset.turn;delete $.board.dataset.turnDirection;delete $.board.dataset.turnDuration;
  anchorNodes.forEach((button,q)=>{
    button.disabled=won||!themeReady();button.classList.remove('turning');
    anchorMotionNodes[q].style.transform=knobAngles[q]?`rotate(${knobAngles[q]}deg)`:'';
    anchorMotionNodes[q].style.opacity='';anchorRingNodes[q].style.opacity='';
  });
  $.cwBtn.disabled=won||!themeReady();$.ccwBtn.disabled=won||!themeReady();el('hintBtn').disabled=won||!themeReady();el('numbersBtn').disabled=won||!themeReady();
}
function cancelRotation({resetKnobs=false}={}){
  recordTurnMeasure('cancelled');
  gameAudio.stopTurn();
  motionEpoch++;
  for(const animation of activeAnimations)animation.cancel();
  if(motionFallback){motionFallback();motionFallback=null;}
  activeAnimations=[];rotating=false;
  clearTurnVisuals(resetKnobs);
}
function syncHomeEntry(){
  const label=homeStoryLabel(unlocked());
  el('homeStoryText').textContent=label;
  el('enterStory').setAttribute('aria-label',label);
}
function setScreenBackdrop(screen){
  document.documentElement.dataset.screen=screen;
  el('themeColor')?.setAttribute('content',screen==='home'?HOME_COLORS.background:'#f8d4a5');
}
function clearCompletion(){
  viewArt=false;completionMetric=null;resultRouteToken=null;resultDialogToken=null;
  $.modal.hidden=true;$.modal.classList.remove('result-mode');
  el('dialogPrimary').onclick=null;el('dialogSecondary').onclick=null;
  el('completeArt').hidden=true;
}
function showHome(){
  setScreenBackdrop('home');
  cancelRotation({resetKnobs:true});
  clearHintGuide();
  clearCompletion();won=false;started=0;
  syncHomeEntry();
  el('home').hidden=false;gameScreen.hidden=true;rankScreen.hidden=true;$.modal.hidden=true;settingsOverlay.hidden=true;
  if(puzzle)render();
}
function showGame(){setScreenBackdrop('game');el('home').hidden=true;gameScreen.hidden=false;rankScreen.hidden=true;settingsOverlay.hidden=true;syncHintSpotlight();}
function openMode(which){
  if(!ready){pendingOpen=which;window.ffPending=which;if(notice)notice.hidden=false;return;}
  if(which==='rank'){showRank();return;}
  claimedBeat=null;
  try{
    startGame(which==='daily'?'daily':'story',which==='daily'?currentDay():unlocked());
    showGame();
  }catch{toast('当前关卡暂时无法打开，请刷新后重试');}
}
window.ffOpen=openMode;
el('enterStory').onclick=()=>openMode('story');
syncHomeEntry();
el('enterDaily').onclick=()=>openMode('daily');
el('enterRank').onclick=()=>openMode('rank');
el('backHome').onclick=showHome;

function onAudioStatus(snapshot){
  // The controller may report synchronously while it is being constructed.
  // Render from the supplied snapshot; do not read gameAudio in this callback.
  audioSnapshot=snapshot;
  if(!settingsOverlay.hidden)renderDeviceDiagnostics(snapshot);
}
function audioCueText(cue){
  if(!cue)return '未触发';
  const states={requested:'请求中',started:'已启动',ended:'已结束',cancelled:'已取消',blocked:'未启动',failed:'失败',error:'失败',late:'未启动'};
  const reasons={muted:'音效关闭',disposed:'音频已销毁',hidden:'页面已隐藏',cancelled:'操作取消',replaced:'被后续操作替换',unsupported:'音频接口不可用',closed:'音频上下文已关闭',suspended:'音频仍处于暂停',interrupted:'音频被系统中断','resume-timeout':'恢复等待超时','resume-blocked':'音频上下文未运行','resume-error':'音频恢复失败','not-ready':'素材尚未就绪','download-error':'素材下载失败','decode-error':'素材解码失败',late:'请求已过时','empty-clip':'素材为空','play-error':'播放调用失败',deadline:'播放启动超时',stale:'操作已过期','source-changed':'音频来源已切换','busy-audio':'当前触点仍在播放','missing-source':'音频资源未配置','media-error':'媒体资源加载失败','play-rejected':'浏览器拒绝播放',MediaError:'媒体资源加载失败',NotAllowedError:'浏览器未允许播放',NotSupportedError:'浏览器不支持此音频',AbortError:'播放已中止'};
  const reason=cue.reason?`：${reasons[cue.reason]||cue.reason}`:'';
  const delay=Number.isFinite(cue.delayMs)&&cue.delayMs>0?` · ${Math.round(cue.delayMs)} ms`:'';
  return (states[cue.state]||cue.state||'未知状态')+reason+delay;
}
function renderDeviceDiagnostics(snapshot=audioSnapshot){
  const status=snapshot||{},htmlBuild=el('app')?.dataset.build||'未知',audioBuild=status.build||'未加载';
  const build=el('settingsBuild');
  const mismatch=htmlBuild!==APP_BUILD||!!status.build&&status.build!==APP_BUILD;
  build.textContent=`脚本 ${APP_BUILD} · 音频 ${audioBuild} · 页面 ${htmlBuild}${mismatch?' · 版本不一致':''}`;
  build.dataset.appBuild=APP_BUILD;build.dataset.audioBuild=audioBuild;build.dataset.htmlBuild=htmlBuild;
  build.classList.toggle('settings-build-mismatch',mismatch);
  const recent=lastTurnMeasure;
  el('settingsTurn').textContent=recent?`最近旋转：${(recent.elapsedMs/1000).toFixed(3)} 秒 / 目标 ${(recent.targetMs/1000).toFixed(3)} 秒 · ${recent.state==='completed'?'已完成':'已取消'}`:`本页尚未完成旋转 · 目标 ${(TURN_DURATION_MS/1000).toFixed(3)} 秒`;
  const osReduced=!!window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
  el('settingsMotionStatus').textContent=`${(recent?.mode||turnMotionMode)==='gentle'?'轻柔':'完整'}${recent?' · '+recent.backend:''}；系统减少动态：${osReduced?'开':'关'}`;
  const backend=status.backend==='html-media'?'媒体播放':'网页音频';
  el('settingsAudioState').textContent=`${status.enabled??soundEnabled?'音效开':'音效关'} · ${status.mode==='media'?'兼容':'标准'} · ${backend} / ${status.contextState||'未创建'}`;
  const unlock={idle:'未请求',unsupported:'接口不支持',closed:'已关闭',resuming:'恢复中',running:'已运行','media-ready':'媒体已准备','resume-timeout':'恢复等待超时','resume-blocked':'上下文仍未运行','resume-error':'恢复失败'};
  el('settingsAudioSession').textContent=`${status.sessionType||'不可用'} / ${unlock[status.unlockState]||status.unlockState||'未请求'}`;
  const assetNames={idle:'未载入',loading:'下载中',downloaded:'已下载',decoded:'已解码','download-error':'下载失败','decode-error':'解码失败'};
  const assetText=kind=>assetNames[status.assets?.[kind]]||status.assets?.[kind]||'未载入';
  el('settingsAudioAssets').textContent=`按下：${assetText('button')} · 落位：${assetText('seat')}`;
  el('settingsAudioCues').textContent=`按下 ${audioCueText(status.cues?.press)}；落位 ${audioCueText(status.cues?.seat)}`;
  el('settingsAudioTest').textContent=status.cues?.test?audioCueText(status.cues.test):(status.enabled??soundEnabled)?'尚未试听':'音效关闭，尚未试听';
}
function recordTurnMeasure(state){
  if(!activeTurnMeasure)return;
  lastTurnMeasure={...activeTurnMeasure,state,elapsedMs:Math.max(0,performance.now()-activeTurnMeasure.startedAt)};
  activeTurnMeasure=null;
  if(!settingsOverlay.hidden)renderDeviceDiagnostics();
}
function syncSettings(){
  el('settingsMusic').textContent=musicEnabled?'音乐：开':'音乐：关';
  el('settingsMusic').setAttribute('aria-pressed',String(musicEnabled));
  el('settingsSound').textContent=soundEnabled?'音效：开':'音效：关';
  el('settingsSound').setAttribute('aria-pressed',String(soundEnabled));
  el('settingsMotion').textContent=turnMotionMode==='gentle'?'旋转动画：轻柔':'旋转动画：完整';
  el('settingsMotion').setAttribute('aria-pressed',String(turnMotionMode==='gentle'));
  el('settingsSoundOutput').textContent=soundOutputMode==='media'?'恢复标准音效':'手机兼容并试听';
  el('settingsSoundOutput').setAttribute('aria-pressed',String(soundOutputMode==='media'));
  el('settingsReset').disabled=!ready||gameScreen.hidden;
  audioSnapshot=gameAudio.getDiagnostics();renderDeviceDiagnostics(audioSnapshot);
}
async function testSettingsSound(){
  el('settingsDiagnostics').setAttribute('open','');
  const pending=gameAudio.testSound();
  syncSettings();
  try{await pending;}finally{syncSettings();}
}
function openSettings(){
  if(rotating){cancelRotation();if(puzzle)render();}
  syncSettings();settingsOverlay.hidden=false;hideHintSpotlight();
}
function closeSettings(){settingsOverlay.hidden=true;syncHintSpotlight();}
el('settingsBtn').onclick=openSettings;
if(el('homeSettings'))el('homeSettings').onclick=openSettings;
el('settingsClose').onclick=closeSettings;
settingsOverlay.addEventListener('click',event=>{if(event.target===settingsOverlay)closeSettings();});
el('settingsMusic').onclick=()=>{
  musicEnabled=!musicEnabled;write('music',musicEnabled);backgroundMusic.setEnabled(musicEnabled);
  if(musicEnabled)void backgroundMusic.resume({gesture:true});syncSettings();
};
el('settingsSound').onclick=()=>{
  soundEnabled=!soundEnabled;write('sound',soundEnabled);
  gameAudio.setEnabled(soundEnabled);
  if(soundEnabled)void gameAudio.playButton();
  syncSettings();
};
el('settingsMotion').onclick=()=>{
  turnMotionMode=turnMotionMode==='full'?'gentle':'full';write('turnMotion',turnMotionMode);syncSettings();
};
el('settingsTestSound').onclick=()=>{void testSettingsSound();};
el('settingsSoundOutput').onclick=()=>{
  soundOutputMode=soundOutputMode==='standard'?'media':'standard';write('soundOutput',soundOutputMode);
  gameAudio.setOutputMode(soundOutputMode);el('settingsDiagnostics').setAttribute('open','');syncSettings();
  if(soundOutputMode==='media')void testSettingsSound();
};
el('settingsDiagnostics').addEventListener('toggle',()=>{if(!settingsOverlay.hidden)syncSettings();});
el('settingsReset').onclick=()=>{settingsOverlay.hidden=true;reset();};
el('settingsRank').onclick=()=>openMode('rank');
el('settingsHome').onclick=showHome;
el('rankBack').onclick=closeRank;
el('rankSettings').onclick=openSettings;
el('rankPrev').onclick=()=>toast('暂无可翻页的好友成绩');
el('rankNext').onclick=()=>toast('暂无可翻页的好友成绩');
el('rankDaily').onclick=()=>openMode('daily');

const storageKey=()=>mode+':'+key;
function best(){return read('best:'+storageKey(),null);}
function startGame(nextMode=mode,nextKey=key){
  const nextPuzzle=makePuzzle(nextMode,String(nextKey));
  if(nextMode==='daily'&&(nextPuzzle.par<9||nextPuzzle.par>11||nextPuzzle.difficulty!=='宗师'))throw new Error('daily puzzle bank validation failed');
  const nextTheme=getTileTheme(nextMode,nextPuzzle.key);
  cancelRotation({resetKnobs:true});
  clearHintGuide();
  roundSerial++;clearCompletion();
  mode=nextMode;puzzle=nextPuzzle;key=puzzle.key;board=puzzle.board;dir=1;
  moves=0;hints=0;elapsed=0;started=0;won=false;highlight=-1;$.modal.hidden=true;
  $.storyTab.classList.toggle('active',mode==='story');$.dailyTab.classList.toggle('active',mode==='daily');
  const loading=prepareTheme(nextTheme);
  render();
  return loading;
}
function updateTime(){
  if(started&&!won)elapsed=(performance.now()-started)/1000;
  $.clock.textContent=`${String(Math.floor(elapsed/60)).padStart(2,'0')}:${String(Math.floor(elapsed%60)).padStart(2,'0')}`;
}
function initBoard(){
  if(tileNodes.size)return;
  for(const token of GOAL){
    const tile=document.createElement('div');tile.className='tile';tile.dataset.token=token;
    tile.setAttribute('aria-label','星图碎片 '+token);
    const number=document.createElement('span');number.className='index';number.textContent=token;number.setAttribute('aria-hidden','true');
    tile.append(number);tileNodes.set(token,tile);$.board.append(tile);
  }
  SQUARES.forEach((_,q)=>{
    const button=document.createElement('button');button.type='button';button.className='spin-node';button.dataset.q=String(q);
    button.style.left=`${(q%2+1)*100/3}%`;button.style.top=`${(Math.floor(q/2)+1)*100/3}%`;
    const motion=document.createElement('span');motion.className='spin-motion';motion.setAttribute('aria-hidden','true');
    const art=document.createElement('span');art.className='spin-art skin skin-rotateKnob';art.setAttribute('aria-hidden','true');
    const ring=document.createElement('span');ring.className='spin-ring';ring.setAttribute('aria-hidden','true');
    motion.append(art);button.append(motion,ring);anchorNodes.push(button);anchorMotionNodes.push(motion);anchorRingNodes.push(ring);$.anchors.append(button);
  });
}
function themeReady(){return !!tileArtwork&&!themeLoading&&!themeError&&tileArtwork.resource===tileTheme?.resource;}
function syncThemeStatus(){
  const available=themeReady();
  boardFrame.classList.toggle('theme-pending',!available);
  boardFrame.dataset.theme=tileTheme?.id||'';
  boardFrame.dataset.themeState=available?'ready':themeError?'error':'loading';
  boardFrame.setAttribute('aria-busy',String(themeLoading));
  el('themeStatus').hidden=available;
  el('themeStatusText').textContent=themeError?'星图暂时未能展开':'星图正在展开…';
  el('themeRetry').hidden=!themeError;
  el('themeRetry').disabled=themeLoading;
}
function applyTileArtwork(art,theme){
  initBoard();
  const [imageW,imageH]=art.imageSize;
  const sourceUrl=new URL('./assets/art/'+art.resource+'.webp',import.meta.url).href;
  for(const token of GOAL){
    const tile=tileNodes.get(token),[x,y,w,h]=art.sourceRectByToken[token];
    // Every piece shares one continuous mural, including the strips below the rails.
    tile.style.backgroundImage=`url("${sourceUrl}")`;
    tile.style.backgroundSize=`${100*imageW/w}% ${100*imageH/h}%`;
    tile.style.backgroundPosition=`${100*x/(imageW-w)}% ${100*y/(imageH-h)}%`;
    const number=tile.firstElementChild;
    number.style.color=theme.indexColor;
    number.style.textShadow=`0 1px 1px ${theme.indexShadowColor},0 2px 2px ${theme.indexShadowColor},0 -.4px 0 ${theme.indexHighlightColor}`;
    number.style.webkitTextStroke=`.4px ${theme.indexOutlineColor}`;
  }
  tileArtwork=art;
  el('completeArt').src=sourceUrl;el('completeArt').alt=theme.name+'完整星图';
  $.board.setAttribute('aria-label',theme.name+'九宫格星图');
}
function loadThemeArtwork(theme){
  const cached=themeCache.get(theme.resource);
  if(cached)return cached;
  const entry={artwork:null,image:null,promise:null};
  entry.promise=preloadArt(theme.resource+'.webp').then(image=>{
    entry.artwork=buildThemeArtwork(baseTileArtwork,theme,image.naturalWidth,image.naturalHeight);
    entry.image=image;
    return entry.artwork;
  }).catch(error=>{
    if(themeCache.get(theme.resource)===entry)themeCache.delete(theme.resource);
    throw error;
  });
  themeCache.set(theme.resource,entry);
  return entry;
}
function prepareTheme(theme){
  const serial=++themeLoadSerial,round=roundSerial;
  tileTheme=theme;themeError=false;
  const cached=loadThemeArtwork(theme);
  if(cached.artwork){
    applyTileArtwork(cached.artwork,theme);themeLoading=false;syncThemeStatus();
    return Promise.resolve(true);
  }
  themeLoading=true;syncThemeStatus();
  const stillCurrent=()=>serial===themeLoadSerial&&round===roundSerial&&tileTheme===theme;
  return cached.promise.then(art=>{
    if(!stillCurrent())return false;
    applyTileArtwork(art,theme);themeLoading=false;themeError=false;render();
    return true;
  }).catch(()=>{
    if(!stillCurrent())return false;
    themeLoading=false;themeError=true;render();
    return false;
  });
}
el('themeRetry').onclick=()=>{
  if(!puzzle||themeLoading||!themeError)return;
  prepareTheme(getTileTheme(mode,key));render();
};
function render(){
  initBoard();
  syncThemeStatus();
  gameScreen.dataset.mode=mode;
  const stageTitle=el('stageTitle'),dailyBanner=el('dailyBanner'),dailyDate=el('dailyDate');
  if(stageTitle){stageTitle.hidden=mode==='daily';stageTitle.textContent=`第${key}关`;}
  if(dailyBanner)dailyBanner.hidden=mode!=='daily';
  if(dailyDate&&mode==='daily'){const parts=key.split('-');dailyDate.textContent=`${Number(parts[1])}月${Number(parts[2])}日`;}
  $.chapterCaption.textContent=mode==='story'?`第${key}关 / 18`:`每日挑战 · ${key}`;
  $.puzzleTitle.textContent=mode==='story'?names[Math.min(17,Math.max(0,+key-1))]:'每日挑战';
  $.difficulty.textContent=mode==='daily'?'宗师':puzzle.difficulty;
  $.moves.textContent=String(moves).padStart(2,'0');$.par.textContent=String(puzzle.par).padStart(2,'0');updateTime();
  const limit=hintLimit(mode),remaining=Math.max(0,limit-hints),hintButton=el('hintBtn');
  el('hintLabel').textContent=`✧ 提示 ${remaining}/${limit}`;
  el('hintRemaining').textContent=`${remaining}/${limit}`;
  const guide=currentHint();
  hintButton.classList.toggle('hint-exhausted',remaining===0&&!guide);
  const blocked=rotating||!themeReady();
  hintButton.disabled=blocked||won;$.cwBtn.disabled=blocked||won;$.ccwBtn.disabled=blocked||won;
  hintButton.setAttribute('aria-disabled',String(blocked||won||(remaining===0&&!guide)));
  hintButton.setAttribute('aria-label',guide?'查看当前提示，不额外消耗次数':remaining?`提示，剩余 ${remaining} 次，本局最多 ${limit} 次`:'本局提示已用完');
  hintButton.title=guide?'查看当前提示，不额外消耗次数':remaining?`本局剩余 ${remaining}/${limit} 次提示`:'本局提示已用完，重新开始可重置';
  $.instruction.textContent=won?'✦ 完成':guide?hintInstruction(guide):`提示剩余 ${remaining}/${limit} 次`;
  highlight=guide?.stage==='target'?guide.q:-1;
  gameScreen.dataset.hintStage=guide?.stage||'';
  const hintTiles=new Set(highlight<0?[]:SQUARES[highlight].map(index=>board[index]));
  for(const token of board){
    const tile=tileNodes.get(token);$.board.append(tile);
    tile.classList.toggle('hint-selected',hintTiles.has(token));
  }
  anchorNodes.forEach((button,q)=>{
    button.dataset.direction=String(dir);button.disabled=won||blocked;
    button.setAttribute('aria-label',`${q+1}号旋转点，${dir===1?'顺':'逆'}时针旋转四格`);
    button.classList.toggle('hinted',q===highlight);
    if(q===highlight)button.setAttribute('aria-describedby','instruction');else button.removeAttribute('aria-describedby');
  });
  for(const [button,direction] of [[$.cwBtn,1],[$.ccwBtn,-1]]){
    const prompted=guide?.stage==='direction'&&guide.dir===direction;
    button.classList.toggle('hint-direction',prompted);
    if(prompted)button.setAttribute('aria-describedby','instruction');else button.removeAttribute('aria-describedby');
  }
  $.cwBtn.classList.toggle('selected',dir===1);$.ccwBtn.classList.toggle('selected',dir===-1);
  $.cwBtn.setAttribute('aria-pressed',String(dir===1));$.ccwBtn.setAttribute('aria-pressed',String(dir===-1));
  gameScreen.dataset.showNumbers=String(showNumbers);gameScreen.dataset.won=String(won);
  boardFrame.classList.toggle('view-art',won&&viewArt&&themeReady());
  el('completeArt').hidden=!(won&&viewArt&&themeReady());
  $.board.setAttribute('aria-hidden',String(won&&viewArt));$.anchors.setAttribute('aria-hidden',String(won&&viewArt));
  el('playDirection').hidden=won;el('playTools').hidden=won;el('completionActions').hidden=!won;
  const numbersButton=el('numbersBtn');numbersButton.disabled=blocked||won;
  numbersButton.setAttribute('aria-pressed',String(showNumbers));
  numbersButton.setAttribute('aria-label',showNumbers?'隐藏数字，当前显示':'显示数字，当前隐藏');
  el('numbersLabel').textContent=showNumbers?'隐藏数字':'显示数字';
  el('viewArtLabel').textContent=viewArt?'返回棋盘':'欣赏星图';
  el('viewArtBtn').setAttribute('aria-pressed',String(viewArt));
  el('nextLabel').textContent=mode==='daily'?'继续闯关':+key<18?'下一关':'挑战每日关卡';
  const route=resultRouteToken,metric=completionMetric;
  el('viewArtBtn').disabled=el('nextBtn').disabled=el('resultDetailsBtn').disabled=blocked||!completionCurrent(route);
  el('viewArtBtn').onclick=()=>toggleArtView(route);
  el('nextBtn').onclick=()=>nextLevel(route);
  el('resultDetailsBtn').onclick=()=>openResult(metric,route);
  syncHintSpotlight();
}

function toggleNumbers(){
  if(!canPlay())return false;
  showNumbers=!showNumbers;write('showNumbers',showNumbers);render();return true;
}
function completionCurrent(route=resultRouteToken){
  return !!route&&route===resultRouteToken&&!route.consumed&&route.round===roundSerial&&route.mode===mode&&route.key===key&&won&&!rotating&&!gameScreen.hidden;
}
function toggleArtView(route=resultRouteToken){
  if(!completionCurrent(route)||!themeReady()||!$.modal.hidden||!settingsOverlay.hidden)return false;
  viewArt=!viewArt;render();return true;
}

function canPlay(){return ready&&themeReady()&&!gameScreen.hidden&&$.modal.hidden&&settingsOverlay.hidden&&!rotating&&!won;}
function screenScale(node,rect){
  const style=window.getComputedStyle?.(node);
  const width=parseFloat(style?.width)||node.offsetWidth||rect.width;
  const height=parseFloat(style?.height)||node.offsetHeight||rect.height;
  return {x:rect.width/width||1,y:rect.height/height||1};
}
function playTurnFallback(effects,duration,epoch){
  return new Promise(resolve=>{
    const request=window.requestAnimationFrame?fn=>window.requestAnimationFrame(fn):fn=>setTimeout(()=>fn(performance.now()),16);
    const cancel=window.cancelAnimationFrame?id=>window.cancelAnimationFrame(id):id=>clearTimeout(id);
    const start=performance.now();let frame=0,done=false;
    const stop=()=>{if(done)return;done=true;cancel(frame);resolve(false);};
    motionFallback=stop;
    function tick(now){
      if(epoch!==motionEpoch){stop();return;}
      const progress=Math.min(1,Math.max(0,(now-start)/duration));
      for(const effect of effects)for(const [name,value] of Object.entries(effect.at(progress)))effect.node.style[name]=value;
      if(progress<1)frame=request(tick);
      else{done=true;if(motionFallback===stop)motionFallback=null;resolve(true);}
    }
    frame=request(tick);
  });
}
async function spin(q){
  if(!canPlay()||!SQUARES[q])return;
  const guide=currentHint();
  if(guide?.stage==='direction'){toast(hintInstruction(guide));return;}
  const affected=SQUARES[q].map(index=>tileNodes.get(board[index]));
  const rectangles=affected.map(tile=>tile.getBoundingClientRect());
  if(rectangles.some(r=>r.width<=0||r.height<=0))return;
  const scales=affected.map((tile,index)=>screenScale(tile,rectangles[index]));
  const knobRect=anchorNodes[q].getBoundingClientRect();
  const motion=createTurnMotion(rectangles.map(r=>({x:r.left,y:r.top,width:r.width,height:r.height})),dir,{x:knobRect.left+knobRect.width/2,y:knobRect.top+knobRect.height/2});
  if(!started)started=performance.now();
  clearHintGuide();rotating=true;
  const epoch=++motionEpoch,nextBoard=rotate(board,q,dir),direction=dir,startAngle=knobAngles[q];
  const gentleMotion=turnMotionMode==='gentle';
  const duration=TURN_DURATION_MS;
  const turnSound=gameAudio.beginTurn();
  const offsets=gentleMotion?[0,.45,.55,1]:Array.from({length:TURN_KEYFRAME_COUNT},(_,i)=>i/(TURN_KEYFRAME_COUNT-1));
  const fadeAt=p=>p<=.45?1-p/.45:p<.55?0:(p-.55)/.45;
  const focusAt=p=>gentleMotion?Math.sin(Math.PI*p)*.45:sampleTurn(motion,0,p).focus;
  const selected=new Set(affected);
  for(const tile of tileNodes.values()){
    tile.classList.toggle('turn-selected',selected.has(tile));tile.classList.toggle('turn-muted',!selected.has(tile));
    if(selected.has(tile))tile.style.zIndex='2';
  }
  const frameRect=boardFrame.getBoundingClientRect(),frameScale=screenScale(boardFrame,frameRect),bounds=motion.bounds;
  turnFocus.style.left=(bounds.left-frameRect.left)/frameScale.x+'px';turnFocus.style.top=(bounds.top-frameRect.top)/frameScale.y+'px';
  turnFocus.style.width=(bounds.right-bounds.left)/frameScale.x+'px';turnFocus.style.height=(bounds.bottom-bounds.top)/frameScale.y+'px';turnFocus.hidden=false;
  $.board.classList.add('rotating');$.anchors.setAttribute('aria-busy','true');
  $.board.dataset.turn=String(q);$.board.dataset.turnDirection=String(direction);$.board.dataset.turnDuration=String(duration);
  anchorNodes.forEach(button=>{button.disabled=true;button.classList.remove('hinted');});anchorNodes[q].classList.add('turning');
  $.cwBtn.disabled=true;$.ccwBtn.disabled=true;el('hintBtn').disabled=true;el('numbersBtn').disabled=true;
  const effects=affected.map((tile,index)=>({node:tile,role:'tile-'+tile.dataset.token,at:p=>{
    const sample=sampleTurn(motion,index,gentleMotion?(p<.5?0:1):p);
    const landing=!gentleMotion&&p>=.9?Math.sin(Math.PI*(p-.9)/.1)*.18:0;
    return {transform:`translate(${sample.dx/scales[index].x}px,${sample.dy/scales[index].y}px) scale(${sample.scaleX},${sample.scaleY})`,opacity:gentleMotion?fadeAt(p):1,filter:`brightness(${1+(gentleMotion?0:.08*sample.focus)+landing})`};
  }}));
  for(const tile of tileNodes.values())if(!selected.has(tile))effects.push({node:tile,role:'dim-'+tile.dataset.token,at:p=>({opacity:1-(gentleMotion ? .14*Math.sin(Math.PI*p) : .44*focusAt(p))})});
  effects.push({node:turnFocus,role:'focus',at:p=>({opacity:focusAt(p)})});
  effects.push({node:anchorRingNodes[q],role:'ring',at:p=>({opacity:focusAt(p)})});
  effects.push({node:anchorMotionNodes[q],role:'knob',at:p=>({transform:`rotate(${startAngle+(gentleMotion?(p<.5?0:direction*90):sampleTurn(motion,0,p).angle)}deg)`,opacity:gentleMotion?fadeAt(p):1})});
  const animationBackend=typeof affected[0].animate==='function'?'WAAPI':'RAF';
  activeTurnMeasure={startedAt:performance.now(),targetMs:duration,mode:turnMotionMode,backend:animationBackend};
  let completed=false;
  try{
    if(animationBackend==='WAAPI'){
      activeAnimations=[];
      for(const effect of effects){
        const animation=effect.node.animate(offsets.map(offset=>({...effect.at(offset),offset})),{duration,easing:'linear',fill:'both'});
        animation.id='fourfold-turn-'+effect.role;animation.finished.catch(()=>{});activeAnimations.push(animation);
      }
      const results=await Promise.allSettled(activeAnimations.map(animation=>animation.finished));
      completed=results.every(result=>result.status==='fulfilled');
    }else completed=await playTurnFallback(effects,duration,epoch);
  }catch{completed=false;}
  if(epoch!==motionEpoch)return;
  if(!completed){cancelRotation();render();return;}
  recordTurnMeasure('completed');
  board=nextBoard;moves++;knobAngles[q]=(startAngle+direction*90)%360;
  for(const animation of activeAnimations)animation.cancel();
  activeAnimations=[];rotating=false;clearTurnVisuals();
  render();
  if(isSolved(board))finish();
  void gameAudio.finishTurn(turnSound);
}

function finish(){
  if(won||rotating||!puzzle||!isSolved(board)||gameScreen.hidden)return;
  clearHintGuide();
  won=true;elapsed=started?(performance.now()-started)/1000:0;
  const metric={moves,par:puzzle.par,seconds:Math.floor(elapsed),hints,score:resultScore(moves,elapsed,hints),day:key};
  completionMetric=Object.freeze(metric);viewArt=false;
  resultRouteToken={round:roundSerial,mode,key,consumed:false};resultDialogToken=null;
  const prev=best();
  const record=isBetterResult(metric,prev)?metric:prev;
  write('best:'+storageKey(),{...record,score:resultScore(record.moves,record.seconds,record.hints)});
  if(mode==='story')write('unlocked',Math.max(Number(unlocked()),Math.min(18,+key+1)));
  render();
}
function openDialog({emblem='✦',title,text='',stats='',primary='继续',secondary='',onPrimary=()=>{},onSecondary=()=>{}}){
  resultDialogToken=null;el('closeModal').setAttribute('aria-label','关闭弹窗');
  $.modal.classList.remove('result-mode');el('dialogText').hidden=false;el('dialogEmblem').textContent=emblem;
  el('dialogOverline').textContent='';el('dialogOverline').hidden=true;el('dialogTitle').textContent=title;
  el('dialogText').textContent=text;el('dialogStats').textContent=stats;el('dialogPrimary').textContent=primary;
  el('dialogSecondaryLabel').textContent=secondary;el('dialogSecondary').style.display=secondary?'':'none';
  el('dialogPrimary').onclick=onPrimary;el('dialogSecondary').onclick=onSecondary;$.modal.hidden=false;hideHintSpotlight();
}
function openResult(metric=completionMetric,route=resultRouteToken){
  if(!completionCurrent(route)||!metric||metric!==completionMetric||!$.modal.hidden||!settingsOverlay.hidden)return false;
  const perfect=metric.moves===metric.par;
  const detail={route};
  const primary=mode==='daily'?'继续闯关':+key<18?'挑战下一关':'挑战每日关卡';
  openDialog({emblem:perfect?'♛':'✦',title:'星图已复原',primary,secondary:'分享此关给好友',onPrimary:()=>{
    if(resultDialogToken===detail&&!$.modal.hidden&&$.modal.classList.contains('result-mode'))nextLevel(route);
  },onSecondary:()=>{if(resultDialogToken===detail&&completionCurrent(route)&&!$.modal.hidden)share();}});
  resultDialogToken=detail;el('closeModal').setAttribute('aria-label','关闭成绩详情，返回星图');
  $.modal.classList.add('result-mode');
  el('resultHonor').textContent=honor(metric.moves,metric.par,metric.hints);
  el('resultNote').textContent=claimedBeat===null?`最优步数 ${metric.par} 步`:`最优 ${metric.par} 步 · 好友目标 ${claimedBeat} 步`;
  const stats=el('dialogStats');
  const fields=[
    ['Moves','当前步数',String(metric.moves).padStart(2,'0'),[280,715,220,45],[275,768,230,100]],
    ['Time','本局用时',String(Math.floor(metric.seconds/60)).padStart(2,'0')+':'+String(metric.seconds%60).padStart(2,'0'),[715,715,220,45],[705,770,242,95]],
  ];
  const place=(node,rect)=>['x','y','w','h'].forEach((axis,index)=>node.style.setProperty('--result-'+axis,rect[index]));
  stats.replaceChildren(...fields.map(([name,label,value,labelRect,valueRect])=>{
    const cell=document.createElement('div');cell.className='result-stat';
    const l=document.createElement('small');l.id='result'+name+'Label';l.className='result-position';l.textContent=label;place(l,labelRect);
    const v=document.createElement('strong');v.id='result'+name;v.className='result-position';v.textContent=String(value);place(v,valueRect);cell.append(l,v);return cell;
  }));
  el('dialogText').hidden=true;
  return true;
}
function nextLevel(route=resultRouteToken){
  if(!completionCurrent(route)||!settingsOverlay.hidden)return false;
  if(!$.modal.hidden&&!$.modal.classList.contains('result-mode'))return false;
  route.consumed=true;resultRouteToken=null;
  try{
    if(route.mode==='daily')startGame('story',unlocked());
    else if(+route.key<18)startGame('story',String(+route.key+1));
    else startGame('daily',currentDay());
    claimedBeat=null;showGame();
    return true;
  }catch{
    route.consumed=false;resultRouteToken=route;
    toast('下一关暂时无法打开，请重试');
    render();return false;
  }
}
function closeDialog(){
  if($.modal.hidden)return;
  $.modal.hidden=true;resultDialogToken=null;$.modal.classList.remove('result-mode');
  el('dialogPrimary').onclick=null;el('dialogSecondary').onclick=null;
  syncHintSpotlight();
}
function share(){shareChallenge(mode,key);}
function shareChallenge(challengeMode,challengeKey){
  const url=new URL(window.location.href);url.search='';url.searchParams.set('mode',challengeMode);
  const shareResult=won&&challengeMode===mode&&challengeKey===key;
  url.searchParams.set(challengeMode==='daily'?'day':'level',challengeKey);
  if(shareResult)url.searchParams.set('beat',String(moves));
  const title=shareResult?`我在《四格诡局》用 ${moves} 步还原星图。你能更少吗？`:'四格诡局 · 和我来一场脑力挑战';
  const text=`${title} ${url.toString()}`;
  if(navigator.share)navigator.share({title,text,url:url.toString()}).catch(()=>{});
  else if(navigator.clipboard)navigator.clipboard.writeText(text).then(()=>toast('挑战链接已复制，发给朋友试试')).catch(()=>toast('浏览器限制复制，请手动复制当前地址'));
  else toast('可以复制浏览器地址分享给朋友');
}
function showRank(){
  setScreenBackdrop('rank');
  if(rankScreen.hidden)rankOrigin=gameScreen.hidden?'home':'game';
  cancelRotation();if(puzzle)render();
  const local=read('best:daily:'+currentDay(),null);
  const hasBest=local&&Number.isFinite(Number(local.moves))&&Number(local.moves)>=1&&Number.isFinite(Number(local.seconds))&&Number(local.seconds)>=0;
  const [year,month,day]=currentDay().split('-');
  el('rankDate').textContent=`${Number(month)}月${Number(day)}日 · 每日挑战`;
  el('rankDate').setAttribute('aria-label',`${year}年${Number(month)}月${Number(day)}日，每日挑战`);
  el('rankBestMoves').textContent=hasBest?String(local.moves):'—';
  const seconds=hasBest?Math.floor(Number(local.seconds)):0;
  el('rankBestTime').textContent=hasBest?`${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`:'—:—';
  el('rankBestNote').textContent=hasBest?'本机已记录':'本机暂无记录';
  el('home').hidden=true;gameScreen.hidden=true;$.modal.hidden=true;resultDialogToken=null;$.modal.classList.remove('result-mode');settingsOverlay.hidden=true;
  rankScreen.hidden=false;rankScreen.scrollTop=0;hideHintSpotlight();
}
function closeRank(){
  if(rankOrigin==='game'&&puzzle){showGame();render();}
  else showHome();
}
function hint(){
  if(won){toast('本局已经通关');return;}
  if(!canPlay())return;
  const guide=currentHint();
  if(guide){render();toast(hintInstruction(guide));return;}
  const limit=hintLimit(mode);
  if(hints>=limit){toast('本局提示已用完，重新开始可重置');return;}
  const path=shortestPath(board);if(!path.length)return;
  hints++;hintGuide={round:roundSerial,board,q:path[0].q,dir:path[0].dir,stage:'direction'};
  render();toast(hintInstruction(hintGuide));
}
function reset(){if(!ready)return;startGame(mode,key);toast('已重置本局');}
function setDirection(direction){
  if(!canPlay()||(direction!==1&&direction!==-1))return;
  dir=direction;
  const guide=currentHint();
  if(guide)guide.stage=direction===guide.dir?'target':'direction';
  render();if(guide)toast(hintInstruction(guide));
}
$.anchors.addEventListener('click',event=>{const button=event.target.closest('button[data-q]');if(button)spin(Number(button.dataset.q));});
el('cwBtn').onclick=()=>setDirection(1);el('ccwBtn').onclick=()=>setDirection(-1);
el('hintBtn').onclick=hint;el('shareBtn').onclick=share;el('numbersBtn').onclick=toggleNumbers;
$.storyTab.onclick=()=>openMode('story');$.dailyTab.onclick=()=>openMode('daily');
el('closeModal').onclick=closeDialog;
$.modal.addEventListener('click',event=>{if(event.target===$.modal)closeDialog();});
window.addEventListener('keydown',event=>{
  if(event.key==='Escape'){
    if(!settingsOverlay.hidden){closeSettings();return;}
    if(!$.modal.hidden){closeDialog();return;}
    if(!rankScreen.hidden)closeRank();
    return;
  }
  if(!canPlay())return;
  if(event.key==='r'||event.key==='R'){void gameAudio.playButton();reset();}
  else if(/^[1-4]$/.test(event.key))spin(Number(event.key)-1);
  else if(event.key===' '&&!event.target?.closest?.('button,input,select,textarea,a')){event.preventDefault();void gameAudio.playButton();setDirection(-dir);}
});

function startTimers(){
  clearInterval(clockTimer);
  clockTimer=window.setInterval(updateTime,220);
}
window.addEventListener('pagehide',event=>{cancelRotation();hideHintSpotlight();clearInterval(clockTimer);if(event.persisted){gameAudio.pause();backgroundMusic.pause();}else{gameAudio.dispose();backgroundMusic.dispose();}});
window.addEventListener('pageshow',event=>{if(event.persisted&&ready){render();startTimers();void backgroundMusic.resume();}});
function onMotionResize(){if(rotating){cancelRotation();if(puzzle)render();}queueHintSpotlight();}
window.addEventListener('resize',onMotionResize);
window.visualViewport?.addEventListener('resize',onMotionResize);
document.addEventListener('scroll',queueHintSpotlight,{capture:true,passive:true});
document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelRotation();gameAudio.pause();backgroundMusic.pause();if(puzzle)render();hideHintSpotlight();}else{syncHintSpotlight();void backgroundMusic.resume();}});

const ART_FILES=[HOME_ART.resource+'.webp',HOME_UI.resource+'.webp','ui-atlas.webp','daily-banner.webp','reference-daily.webp','reference-clean.webp','rank-scene.webp','result-panel.webp'];
async function preloadTileArtwork(){
  const response=await fetch(new URL('./cocos/assets/resources/art/referenceLayout.json?v=0.8.33',import.meta.url));
  if(!response.ok)throw new Error('tile artwork layout could not be loaded');
  const {tileArtwork:art}=await response.json();
  if(!art||!/^[-a-z0-9]+$/.test(art.resource)||art.fit!=='fill'||!Array.isArray(art.imageSize)||art.imageSize.length!==2||art.imageSize.some(v=>!Number.isFinite(v)||v<=0))throw new Error('invalid tile artwork layout');
  const [iw,ih]=art.imageSize;
  for(const token of GOAL){
    const r=art.sourceRectByToken?.[token];
    if(!Array.isArray(r)||r.length!==4||r.some(v=>!Number.isFinite(v))||r[0]<0||r[1]<0||r[2]<=0||r[3]<=0||r[2]>=iw||r[3]>=ih||r[0]+r[2]>iw+1e-7||r[1]+r[3]>ih+1e-7)throw new Error('invalid mural tile crop');
  }
  baseTileArtwork=art;
}
function preloadArt(file){
  return new Promise((resolve,reject)=>{
    const image=new Image(),timer=setTimeout(()=>reject(new Error('art load timeout')),25000);
    image.onload=async()=>{
      try{if(image.decode)await image.decode();clearTimeout(timer);resolve(image);}catch(error){clearTimeout(timer);reject(error);}
    };
    image.onerror=()=>{clearTimeout(timer);reject(new Error('art load failed'));};
    image.src=new URL('./assets/art/'+file,import.meta.url).href;
  });
}
async function boot(){
  let loaded=0;
  document.documentElement.classList.add('art-loading');
  if(notice){notice.hidden=false;notice.textContent='星图正在加载…';}
  try{
    const progress=()=>{loaded++;if(notice&&!bootFailed)notice.textContent=`星图正在加载… ${loaded}/${ART_FILES.length+1}`;};
    await Promise.all([...ART_FILES.map(file=>preloadArt(file).then(progress)),preloadTileArtwork().then(progress)]);
    const params=new URLSearchParams(location.search),entry=parseChallenge(params);
    const initialRequest=pendingOpen||window.ffPending;
    if(initialRequest==='story'||initialRequest==='daily'){
      entry.mode=initialRequest;entry.key=initialRequest==='daily'?currentDay():unlocked();entry.beat=null;
    }else if(!params.has('mode')&&!params.has('level'))entry.key=unlocked();
    let invalidDate=false;
    claimedBeat=entry.beat;
    try{await startGame(entry.mode,entry.key);}catch(error){
      if(entry.mode!=='daily')throw error;
      invalidDate=true;claimedBeat=null;await startGame('daily',currentDay());
    }
    ready=true;window.ffReady=true;document.documentElement.dataset.gameReady='true';
    document.documentElement.classList.remove('art-loading');if(notice)notice.hidden=true;
    startTimers();
    const requested=pendingOpen||window.ffPending;window.ffPending=null;pendingOpen=null;
    if(requested)openMode(requested);
    else if(params.has('mode'))showGame();else showHome();
    if(invalidDate)toast('这个日期的挑战不可用，已打开今日挑战');
    else if(claimedBeat!==null)toast(`好友向你发起挑战：试试能否少于 ${claimedBeat} 步！`);
  }catch{
    bootFailed=true;document.documentElement.classList.remove('art-loading');
    if(notice){
      notice.hidden=false;notice.replaceChildren();
      const message=document.createElement('div');message.textContent='画面加载失败，请重试';
      const retry=document.createElement('button');retry.type='button';retry.className='load-retry';retry.textContent='重新加载';retry.onclick=()=>location.reload();
      notice.append(message,retry);
    }
  }
}
boot();
