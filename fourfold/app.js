import {GOAL,SQUARES,rotate,isSolved,shortestPath,makePuzzle,todayCN,resultScore,honor,parseChallenge,hintLimit,isBetterResult} from './cocos/assets/scripts/CoreHardWeb.js?story=linear18-v2&v=0.8.3';

const el=id=>document.getElementById(id);
const $={board:el('board'),anchors:el('anchors'),target:el('target'),moves:el('moves'),par:el('par'),clock:el('clock'),instruction:el('instruction'),difficulty:el('difficulty'),chapterCaption:el('chapterCaption'),puzzleTitle:el('puzzleTitle'),storyTab:el('storyTab'),dailyTab:el('dailyTab'),cwBtn:el('cwBtn'),ccwBtn:el('ccwBtn'),modal:el('modal'),toast:el('toast')};
const names=['星图初醒','看似简单','交错轨道','一念之差','不对称','失序之环','倒影之谜','四角对峙','镜像迷宫','群星换位','王冠密码','无声棋局','深空共振','星环审判','暗夜回响','隐秘秩序','星渊终章','逻辑之冠'];
const pos=i=>`${((i%3)/2)*100}% ${Math.floor(i/3)*50}%`;
const currentDay=()=>todayCN();
const read=(key,otherwise)=>{try{const v=localStorage.getItem('fourfold:'+key);return v===null?otherwise:JSON.parse(v);}catch{return otherwise;}};
const write=(key,value)=>{try{localStorage.setItem('fourfold:'+key,JSON.stringify(value));}catch{}};
const unlocked=()=>String(Math.min(18,Math.max(1,parseInt(read('unlocked',1),10)||1)));
const gameScreen=el('gameScreen');
const rankScreen=el('rankScreen');
const settingsOverlay=el('settingsOverlay');
const notice=el('startupNotice');
const tileNodes=new Map();
const anchorNodes=[];

let mode='story',key='1',dir=1,board=GOAL,puzzle=null,moves=0,hints=0,won=false,started=0,elapsed=0,claimedBeat=null,highlight=-1;
let audio=null,soundEnabled=read('sound',true),clockTimer=0,bgTimer=0,toastTimer=0;
let ready=false,bootFailed=false,pendingOpen=window.ffPending||null;
let rotating=false,motionEpoch=0,activeAnimations=[];
let rankOrigin='home';
window.ffReady=false;

function sound(note=440,len=.13,volume=.038){
  if(!soundEnabled)return;
  try{
    audio ||= new (window.AudioContext||window.webkitAudioContext)();
    if(audio.state==='suspended')audio.resume().catch(()=>{});
    const osc=audio.createOscillator(),gain=audio.createGain();
    osc.type='sine';osc.frequency.setValueAtTime(note,audio.currentTime);
    osc.frequency.exponentialRampToValueAtTime(note*.79,audio.currentTime+len);
    gain.gain.setValueAtTime(volume,audio.currentTime);gain.gain.exponentialRampToValueAtTime(.0001,audio.currentTime+len);
    osc.connect(gain);gain.connect(audio.destination);osc.start();osc.stop(audio.currentTime+len);
  }catch{}
}
function backgroundMusic(){
  if(!soundEnabled||document.hidden||!audio||audio.state!=='running')return;
  const notes=[196,247,294,392,330,294,247,220];
  sound(notes[Math.floor(Date.now()/6000)%notes.length],1.6,.008);
}
function toast(message){
  $.toast.textContent=message;$.toast.classList.add('show');
  clearTimeout(toastTimer);toastTimer=setTimeout(()=>$.toast.classList.remove('show'),2800);
}
function cancelRotation(){
  motionEpoch++;
  for(const animation of activeAnimations)animation.cancel();
  activeAnimations=[];rotating=false;
  for(const tile of tileNodes.values())tile.style.zIndex='';
  $.board.classList.remove('rotating');$.anchors.removeAttribute('aria-busy');
}
function showHome(){
  cancelRotation();
  el('home').hidden=false;gameScreen.hidden=true;rankScreen.hidden=true;$.modal.hidden=true;settingsOverlay.hidden=true;
  if(puzzle)render();
}
function showGame(){el('home').hidden=true;gameScreen.hidden=false;rankScreen.hidden=true;settingsOverlay.hidden=true;}
function openMode(which){
  if(!ready){pendingOpen=which;window.ffPending=which;if(notice)notice.hidden=false;return;}
  if(which==='rank'){showRank();return;}
  claimedBeat=null;
  try{
    startGame(which==='daily'?'daily':'story',which==='daily'?currentDay():unlocked());
    showGame();sound(440,.12,.025);
  }catch{toast('当前关卡暂时无法打开，请刷新后重试');}
}
window.ffOpen=openMode;
el('enterStory').onclick=()=>openMode('story');
el('enterDaily').onclick=()=>openMode('daily');
el('enterRank').onclick=()=>openMode('rank');
el('backHome').onclick=showHome;

function syncSettings(){
  el('settingsSound').textContent=soundEnabled?'♫　音乐与音效：开':'♩　音乐与音效：关';
  el('settingsReset').disabled=!ready||gameScreen.hidden;
}
function openSettings(){syncSettings();settingsOverlay.hidden=false;}
el('settingsBtn').onclick=openSettings;
if(el('homeSettings'))el('homeSettings').onclick=openSettings;
el('settingsClose').onclick=()=>{settingsOverlay.hidden=true;};
settingsOverlay.addEventListener('click',event=>{if(event.target===settingsOverlay)settingsOverlay.hidden=true;});
el('settingsSound').onclick=()=>{
  soundEnabled=!soundEnabled;write('sound',soundEnabled);
  if(soundEnabled)sound(523);else if(audio)audio.suspend().catch(()=>{});
  syncSettings();
};
el('settingsReset').onclick=()=>{settingsOverlay.hidden=true;reset();};
el('settingsRank').onclick=()=>openMode('rank');
el('settingsHome').onclick=showHome;
el('rankBack').onclick=closeRank;
el('rankDaily').onclick=()=>openMode('daily');

const storageKey=()=>mode+':'+key;
function best(){return read('best:'+storageKey(),null);}
function startGame(nextMode=mode,nextKey=key){
  const nextPuzzle=makePuzzle(nextMode,String(nextKey));
  if(nextMode==='daily'&&(nextPuzzle.par<9||nextPuzzle.par>11||nextPuzzle.difficulty!=='宗师'))throw new Error('daily puzzle bank validation failed');
  cancelRotation();
  mode=nextMode;puzzle=nextPuzzle;key=puzzle.key;board=puzzle.board;dir=1;
  moves=0;hints=0;elapsed=0;started=0;won=false;highlight=-1;$.modal.hidden=true;
  $.storyTab.classList.toggle('active',mode==='story');$.dailyTab.classList.toggle('active',mode==='daily');
  render();
}
function updateTime(){
  if(started&&!won)elapsed=(performance.now()-started)/1000;
  $.clock.textContent=`${String(Math.floor(elapsed/60)).padStart(2,'0')}:${String(Math.floor(elapsed%60)).padStart(2,'0')}`;
}
function initBoard(){
  if(tileNodes.size)return;
  for(const token of GOAL){
    const tile=document.createElement('div');tile.className='tile';tile.dataset.token=token;
    tile.style.setProperty('--pos',pos(Number(token)-1));tile.setAttribute('aria-label','星图碎片 '+token);
    const number=document.createElement('span');number.className='index';number.textContent=token;
    tile.append(number);tileNodes.set(token,tile);$.board.append(tile);
  }
  SQUARES.forEach((_,q)=>{
    const button=document.createElement('button');button.type='button';button.className='spin-node';button.dataset.q=String(q);
    button.style.left=`${(q%2+1)*100/3}%`;button.style.top=`${(Math.floor(q/2)+1)*100/3}%`;
    const art=document.createElement('span');art.className='spin-art skin skin-rotateKnob';art.setAttribute('aria-hidden','true');
    button.append(art);anchorNodes.push(button);$.anchors.append(button);
  });
}
function render(){
  initBoard();
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
  hintButton.classList.toggle('hint-exhausted',remaining===0);
  hintButton.setAttribute('aria-disabled',String(won||remaining===0));
  hintButton.setAttribute('aria-label',remaining?`提示，剩余 ${remaining} 次，本局最多 ${limit} 次`:'本局提示已用完');
  hintButton.title=remaining?`本局剩余 ${remaining}/${limit} 次提示`:'本局提示已用完，重新开始可重置';
  $.instruction.textContent=won?'✦ 完成':`提示剩余 ${remaining}/${limit} 次`;
  for(const token of board)$.board.append(tileNodes.get(token));
  anchorNodes.forEach((button,q)=>{
    button.dataset.direction=String(dir);button.disabled=won||rotating;
    button.setAttribute('aria-label',`${q+1}号旋转点，${dir===1?'顺':'逆'}时针旋转四格`);
    button.classList.toggle('hinted',q===highlight);
  });
  $.cwBtn.classList.toggle('selected',dir===1);$.ccwBtn.classList.toggle('selected',dir===-1);
  $.cwBtn.setAttribute('aria-pressed',String(dir===1));$.ccwBtn.setAttribute('aria-pressed',String(dir===-1));
  el('nextBtn').textContent=won?'下一关':'';
}

function canPlay(){return ready&&!gameScreen.hidden&&$.modal.hidden&&settingsOverlay.hidden&&!rotating&&!won;}
async function spin(q){
  if(!canPlay()||!SQUARES[q])return;
  if(!started)started=performance.now();
  rotating=true;highlight=-1;
  const epoch=++motionEpoch,nextBoard=rotate(board,q,dir),direction=dir;
  const affected=SQUARES[q].map(index=>tileNodes.get(board[index]));
  const rectangles=affected.map(tile=>tile.getBoundingClientRect());
  const scaleX=rectangles[0].width/(affected[0].offsetWidth||rectangles[0].width||1)||1;
  const scaleY=rectangles[0].height/(affected[0].offsetHeight||rectangles[0].height||1)||1;
  const centers=rectangles.map(r=>({x:r.left+r.width/2,y:r.top+r.height/2}));
  const pivot={x:centers.reduce((sum,c)=>sum+c.x,0)/4,y:centers.reduce((sum,c)=>sum+c.y,0)/4};
  // The approved reference uses rectangular grid strides. Rotate in normalized
  // grid coordinates so a quarter turn lands on the next cell on either axis.
  const radiusX=(Math.max(...centers.map(c=>c.x))-Math.min(...centers.map(c=>c.x)))/2||1;
  const radiusY=(Math.max(...centers.map(c=>c.y))-Math.min(...centers.map(c=>c.y)))/2||1;
  affected.forEach(tile=>{tile.style.zIndex='2';});
  $.board.classList.add('rotating');$.anchors.setAttribute('aria-busy','true');
  anchorNodes.forEach(button=>{button.disabled=true;button.classList.remove('hinted');});
  const reduceMotion=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if(!reduceMotion&&rectangles[0].width&&typeof affected[0].animate==='function'){
    activeAnimations=affected.map((tile,index)=>{
      const center=centers[index],x=center.x-pivot.x,y=center.y-pivot.y;
      const normalizedX=x/radiusX,normalizedY=y/radiusY;
      const target=centers[(index+direction+4)%4];
      const endX=-direction*normalizedY*radiusX,endY=direction*normalizedX*radiusY;
      const correctionX=target.x-pivot.x-endX,correctionY=target.y-pivot.y-endY;
      const frames=Array.from({length:9},(_,frame)=>{
        const progress=frame/8,angle=direction*Math.PI/2*progress;
        const easeCorrection=progress*progress*(3-2*progress);
        const nextX=(normalizedX*Math.cos(angle)-normalizedY*Math.sin(angle))*radiusX+correctionX*easeCorrection;
        const nextY=(normalizedX*Math.sin(angle)+normalizedY*Math.cos(angle))*radiusY+correctionY*easeCorrection;
        return {transform:`translate(${(nextX-x)/scaleX}px,${(nextY-y)/scaleY}px)`,offset:progress};
      });
      // Translate each illustrated piece around the pivot without rotating its own artwork.
      return tile.animate(frames,{duration:170,easing:'cubic-bezier(.25,.7,.3,1)',fill:'both'});
    });
    await Promise.allSettled(activeAnimations.map(animation=>animation.finished));
  }
  if(epoch!==motionEpoch)return;
  board=nextBoard;moves++;rotating=false;
  for(const animation of activeAnimations)animation.cancel();
  affected.forEach(tile=>{tile.style.zIndex='';});
  activeAnimations=[];$.board.classList.remove('rotating');$.anchors.removeAttribute('aria-busy');
  sound(365+q*70);render();
  if(isSolved(board))finish();
}
function finish(){
  won=true;elapsed=started?(performance.now()-started)/1000:0;
  const metric={moves,par:puzzle.par,seconds:Math.floor(elapsed),hints,score:resultScore(moves,elapsed,hints),day:key};
  const prev=best();
  const record=isBetterResult(metric,prev)?metric:prev;
  write('best:'+storageKey(),{...record,score:resultScore(record.moves,record.seconds,record.hints)});
  if(mode==='story')write('unlocked',Math.max(Number(unlocked()),Math.min(18,+key+1)));
  sound(523,.22,.05);setTimeout(()=>sound(659,.25,.043),110);setTimeout(()=>sound(784,.45,.04),235);
  render();openResult(metric);
}
function openDialog({emblem='✦',title,text='',stats='',primary='继续',secondary='',onPrimary=()=>{},onSecondary=()=>{}}){
  $.modal.classList.remove('result-mode');el('dialogText').hidden=false;el('dialogEmblem').textContent=emblem;
  el('dialogOverline').textContent='';el('dialogOverline').hidden=true;el('dialogTitle').textContent=title;
  el('dialogText').textContent=text;el('dialogStats').textContent=stats;el('dialogPrimary').textContent=primary;
  el('dialogSecondary').textContent=secondary;el('dialogSecondary').style.display=secondary?'':'none';
  el('dialogPrimary').onclick=onPrimary;el('dialogSecondary').onclick=onSecondary;$.modal.hidden=false;
}
function openResult(metric){
  const perfect=metric.moves===metric.par;
  openDialog({emblem:perfect?'♛':'✦',title:honor(metric.moves,metric.par,metric.hints),primary:mode==='daily'?'返回闯关':'挑战下一关',secondary:'分享这个成绩',onPrimary:nextLevel,onSecondary:share});
  $.modal.classList.add('result-mode');
  const stats=el('dialogStats');
  const fields=[['通关步数',metric.moves],['最优步数',metric.par],['用时',Math.floor(metric.seconds/60)+':'+String(metric.seconds%60).padStart(2,'0')]];
  stats.replaceChildren(...fields.map(([label,value])=>{
    const cell=document.createElement('div');cell.className='result-stat';
    const l=document.createElement('small');l.textContent=label;
    const v=document.createElement('strong');v.textContent=String(value);cell.append(l,v);return cell;
  }));
  if(claimedBeat!==null){const note=document.createElement('div');note.className='result-rival';note.textContent='好友挑战目标 '+claimedBeat+' 步';stats.append(note);}
  el('dialogText').hidden=true;
}
function nextLevel(){
  if(!won){toast('先还原星图，才能解锁下一关');return;}
  claimedBeat=null;
  if(mode==='daily')startGame('story',unlocked());
  else if(+key<18)startGame('story',String(+key+1));
  else{toast('18关全部通关！试试每日挑战');startGame('daily',currentDay());}
  showGame();
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
  if(rankScreen.hidden)rankOrigin=gameScreen.hidden?'home':'game';
  cancelRotation();if(puzzle)render();
  const local=read('best:daily:'+currentDay(),null);
  const hasBest=local&&Number.isFinite(Number(local.moves))&&Number(local.moves)>=0&&Number.isFinite(Number(local.seconds))&&Number(local.seconds)>=0;
  const [year,month,day]=currentDay().split('-');
  el('rankDate').textContent=`${year}年${Number(month)}月${Number(day)}日`;
  el('rankBestMoves').textContent=hasBest?String(local.moves):'—';
  const seconds=hasBest?Math.floor(Number(local.seconds)):0;
  el('rankBestTime').textContent=hasBest?`${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`:'—';
  el('rankBestNote').textContent=hasBest?'已记录今日最佳成绩':'今天还没有通关记录';
  el('rankHintRule').textContent=`每日挑战每局可用 ${hintLimit('daily')} 次提示，成绩照常参与排行`;
  el('home').hidden=true;gameScreen.hidden=true;$.modal.hidden=true;settingsOverlay.hidden=true;
  rankScreen.hidden=false;rankScreen.scrollTop=0;
}
function closeRank(){
  if(rankOrigin==='game'&&puzzle){render();showGame();}
  else showHome();
}
function hint(){
  if(won){toast('本局已经通关');return;}
  if(!canPlay())return;
  const limit=hintLimit(mode);
  if(hints>=limit){toast('本局提示已用完，重新开始可重置');return;}
  const path=shortestPath(board);if(!path.length)return;
  hints++;dir=path[0].dir;highlight=path[0].q;render();
  const button=anchorNodes[highlight];
  if(typeof button.animate==='function')button.animate([{transform:'translate(-50%,-50%) scale(1)'},{transform:'translate(-50%,-50%) scale(1.15)'},{transform:'translate(-50%,-50%) scale(1)'}],{duration:750,iterations:2});
  const remaining=limit-hints;
  toast(remaining?`点击高亮旋转点；本局剩余 ${remaining}/${limit} 次提示`:'点击高亮旋转点；本局提示已用完');sound(660,.3);
}
function reset(){if(!ready)return;startGame(mode,key);toast('已重置本局');}
function setDirection(direction){if(!canPlay())return;dir=direction;render();sound(direction===1?390:350);}
$.anchors.addEventListener('click',event=>{const button=event.target.closest('button[data-q]');if(button)spin(Number(button.dataset.q));});
el('cwBtn').onclick=()=>setDirection(1);el('ccwBtn').onclick=()=>setDirection(-1);
el('hintBtn').onclick=hint;el('shareBtn').onclick=share;el('nextBtn').onclick=nextLevel;
$.storyTab.onclick=()=>openMode('story');$.dailyTab.onclick=()=>openMode('daily');
el('closeModal').onclick=()=>{$.modal.hidden=true;};
$.modal.addEventListener('click',event=>{if(event.target===$.modal)$.modal.hidden=true;});
window.addEventListener('keydown',event=>{
  if(event.key==='Escape'){if(!rankScreen.hidden){closeRank();return;}$.modal.hidden=true;settingsOverlay.hidden=true;return;}
  if(!canPlay())return;
  if(event.key==='r'||event.key==='R')reset();
  else if(/^[1-4]$/.test(event.key))spin(Number(event.key)-1);
  else if(event.key===' '){event.preventDefault();setDirection(-dir);}
});

function startTimers(){
  clearInterval(clockTimer);clearInterval(bgTimer);
  clockTimer=window.setInterval(updateTime,220);bgTimer=window.setInterval(backgroundMusic,6600);
}
window.addEventListener('pagehide',()=>{cancelRotation();clearInterval(clockTimer);clearInterval(bgTimer);});
window.addEventListener('pageshow',event=>{if(event.persisted&&ready){render();startTimers();}});

const ART_FILES=['home-scene.webp','celestial-mural.webp','ui-atlas.webp','daily-banner.webp','reference-daily.webp','reference-clean.webp'];
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
    await Promise.all(ART_FILES.map(file=>preloadArt(file).then(()=>{
      loaded++;if(notice&&!bootFailed)notice.textContent=`星图正在加载… ${loaded}/${ART_FILES.length}`;
    })));
    const params=new URLSearchParams(location.search),entry=parseChallenge(params);
    let invalidDate=false;
    claimedBeat=entry.beat;
    try{startGame(entry.mode,entry.key);}catch(error){
      if(entry.mode!=='daily')throw error;
      invalidDate=true;claimedBeat=null;startGame('daily',currentDay());
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
