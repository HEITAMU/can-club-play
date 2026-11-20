import {GOAL,SQUARES,rotate,isSolved,shortestPath,makePuzzle,todayCN,resultScore,honor,parseChallenge} from './cocos/assets/scripts/Core.js';
const el=id=>document.getElementById(id);
const $={board:el('board'),anchors:el('anchors'),target:el('target'),moves:el('moves'),par:el('par'),clock:el('clock'),instruction:el('instruction'),difficulty:el('difficulty'),chapterCaption:el('chapterCaption'),puzzleTitle:el('puzzleTitle'),storyTab:el('storyTab'),dailyTab:el('dailyTab'),cwBtn:el('cwBtn'),ccwBtn:el('ccwBtn'),modal:el('modal'),toast:el('toast')};
const names=['星图初醒','看似简单','交错轨道','一念之差','不对称','失序之环','倒影之谜','四角对峙','镜像迷宫','群星换位','王冠密码','无声棋局','深空共振','星环审判','暗夜回响','隐秘秩序','星渊终章','逻辑之冠'];
const chars=['✦','◈','✣','❖','☼','✶','✧','✤','✺'];
const pos=i=>`${((i%3)/2)*100}% ${Math.floor(i/3)*50}%`;
const currentDay=()=>todayCN();
const read=(key,otherwise)=>{try{const v=localStorage.getItem('fourfold:'+key);return v===null?otherwise:JSON.parse(v);}catch{return otherwise;}};
const write=(key,value)=>{try{localStorage.setItem('fourfold:'+key,JSON.stringify(value));}catch{}};
let mode='story',key='1',dir=1,board=GOAL,puzzle=null,moves=0,hints=0,won=false,started=0,elapsed=0,claimedBeat=null,highlight=-1,showingRanks=false;
let bgTimer=0,audio=null,soundEnabled=read('sound',true);
const showHome=()=>{el('home').hidden=false;el('gameScreen').hidden=true;$.modal.hidden=true;el('homeProgress').textContent=String(read('unlocked',1)).padStart(2,'0')+' / 18';};
const showGame=()=>{el('home').hidden=true;el('gameScreen').hidden=false;};
el('enterStory').onclick=()=>{showGame();startGame('story',String(read('unlocked',1)));};
el('enterDaily').onclick=()=>{showGame();startGame('daily',currentDay());};
el('enterRank').onclick=()=>{showRank();};
el('backHome').onclick=showHome;
function sound(note=440,len=.13,volume=.038){if(!soundEnabled)return;try{audio ||= new (window.AudioContext||window.webkitAudioContext)();if(audio.state==='suspended')audio.resume();const osc=audio.createOscillator(),gain=audio.createGain();osc.type='sine';osc.frequency.setValueAtTime(note,audio.currentTime);osc.frequency.exponentialRampToValueAtTime(note*.79,audio.currentTime+len);gain.gain.setValueAtTime(volume,audio.currentTime);gain.gain.exponentialRampToValueAtTime(.0001,audio.currentTime+len);osc.connect(gain);gain.connect(audio.destination);osc.start();osc.stop(audio.currentTime+len);}catch{}}
function backgroundMusic(){if(!soundEnabled||document.hidden||!audio||audio.state!=='running')return;const notes=[196,247,294,392,330,294,247,220];sound(notes[Math.floor(Date.now()/6000)%notes.length],1.6,.008);}
function toast(msg){$.toast.textContent=msg;$.toast.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>$.toast.classList.remove('show'),2800);}
const storageKey=()=>mode+':'+key;
function best(){return read('best:'+storageKey(),null);}
function startGame(m=mode,k=key){mode=m;key=String(k);puzzle=makePuzzle(mode,key);board=puzzle.board;moves=0;hints=0;elapsed=0;started=0;won=false;highlight=-1;showingRanks=false;$.modal.hidden=true;$.storyTab.classList.toggle('active',mode==='story');$.dailyTab.classList.toggle('active',mode==='daily');render();}
function updateTime(){if(started&&!won)elapsed=(performance.now()-started)/1000;$.clock.textContent=`${String(Math.floor(elapsed/60)).padStart(2,'0')}:${String(Math.floor(elapsed%60)).padStart(2,'0')}`;}
function render(){
  $.chapterCaption.textContent=mode==='story'?`ARCHIVE ${String(+key).padStart(2,'0')} / 18`:`DAILY • ${key}`;
  $.puzzleTitle.textContent=mode==='story'?names[Math.min(17,Math.max(0,+key-1))]:'今日脑力审判';
  $.difficulty.textContent=puzzle.difficulty;
  $.moves.textContent=String(moves).padStart(2,'0');$.par.textContent=String(puzzle.par).padStart(2,'0');updateTime();
  $.instruction.textContent=won?'✦ 完成':hints?'✧ 已使用提示':'';
  $.target.innerHTML=GOAL.split('').map((tok,i)=>`<div class="mini" data-id="${tok}" style="--pos:${pos(i)}"></div>`).join('');
  $.board.innerHTML=board.split('').map((tok,i)=>`<div class="tile ${i<9?'pulse':''}" data-token="${tok}" style="--pos:${pos(Number(tok)-1)}" aria-label="星图碎片 ${tok}"><span class="index">${tok} ${chars[Number(tok)-1]}</span></div>`).join('');
  $.anchors.innerHTML=SQUARES.map((_,q)=>`<button type="button" class="spin-node" aria-label="${q+1}号旋转点，${dir===1?'顺':'逆'}时针旋转四格" style="left:${q%2?66.6667:33.3333}%;top:${q>=2?66.6667:33.3333}%" data-q="${q}">${dir===1?'↻':'↺'}</button>`).join('');
  $.cwBtn.classList.toggle('selected',dir===1);$.ccwBtn.classList.toggle('selected',dir===-1);
  el('nextBtn').textContent=won?(mode==='daily'?'继续闯关 →':+key===18?'全部通关 ✓':'下一关 →'):'完成后解锁 →';
}
function spin(q){if(won)return;if(!started)started=performance.now();board=rotate(board,q,dir);moves++;highlight=-1;render();sound(365+q*70);if(isSolved(board))finish();}
function finish(){won=true;elapsed=started?(performance.now()-started)/1000:0;const metric={moves,par:puzzle.par,seconds:Math.floor(elapsed),hints,score:resultScore(moves,elapsed,hints),day:key};const prev=best();const better=!prev || (hints===0&&prev.hints>0)||(hints===prev.hints&&(moves<prev.moves||(moves===prev.moves&&metric.seconds<prev.seconds)));
  if(better)write('best:'+storageKey(),metric);
  if(mode==='story')write('unlocked',Math.max(read('unlocked',1),Math.min(18,+key+1)));
  sound(523,.22,.05);setTimeout(()=>sound(659,.25,.043),110);setTimeout(()=>sound(784,.45,.04),235);
  render();openResult(metric,better);
}
function openDialog({emblem='✦',overline='',title,text='',stats='',primary='继续',secondary='',onPrimary=()=>{},onSecondary=()=>{}}){el('dialogEmblem').textContent=emblem;el('dialogOverline').textContent=overline;el('dialogTitle').textContent=title;el('dialogText').textContent=text;el('dialogStats').textContent=stats;el('dialogPrimary').textContent=primary;el('dialogSecondary').textContent=secondary;el('dialogSecondary').style.display=secondary?'':'none';el('dialogPrimary').onclick=onPrimary;el('dialogSecondary').onclick=onSecondary;$.modal.hidden=false;}
function openResult(metric,newBest){const title=honor(metric.moves,metric.par,metric.hints);openDialog({emblem:metric.moves===metric.par&&!metric.hints?'♛':'✦',overline:mode==='daily'?'DAILY CHALLENGE / COMPLETE':'ARCHIVE REPAIRED',title,text:`${newBest?'个人记录已更新。':''}${metric.hints?'本次用了提示，不参与公平排名。':'这是你的真实解题成绩。'}`,stats:`${metric.moves} 步通关 · 最优 ${metric.par} 步 · 用时 ${metric.seconds} 秒${claimedBeat!==null?` · 好友目标 ${claimedBeat} 步`:''}`,primary:mode==='daily'?'去闯关':'挑战下一关',secondary:'分享这个成绩',onPrimary:nextLevel,onSecondary:share});}
function nextLevel(){if(!won){toast('先还原星图，才能解锁下一关');return;}claimedBeat=null;if(mode==='daily')startGame('story',String(read('unlocked',1)));else if(+key<18)startGame('story',String(+key+1));else {toast('18份档案全部通关！试试今日同题');startGame('daily',currentDay());}}
function share(){let url=new URL(window.location.href);url.search='';url.searchParams.set('mode',mode);if(mode==='daily'){url.searchParams.set('day',key);if(won&&!hints)url.searchParams.set('beat',String(moves));}else{url.searchParams.set('level',key);if(won&&!hints)url.searchParams.set('beat',String(moves));}const title=won&&!hints?`我在《四格诡局》用 ${moves} 步还原星图。你能更少吗？`:'四格诡局 · 和我来一场同题脑力挑战';const text=`${title} ${url.toString()}`;if(navigator.share){navigator.share({title,text,url:url.toString()}).catch(()=>{});}else if(navigator.clipboard){navigator.clipboard.writeText(text).then(()=>toast('挑战链接已复制，发给朋友试试')).catch(()=>toast('浏览器限制复制，请手动复制当前地址'));}else{toast('可以复制浏览器地址分享给朋友');}}
function showRank(){showingRanks=true;const local=read('best:daily:'+currentDay(),null);openDialog({emblem:'♛',overline:'WECHAT FRIENDS RANK',title:'好友同题榜',text:'网页试玩不拥有微信关系链权限。微信正式小游戏使用开放数据域展示好友的真实成绩，不会生成虚拟好友。',stats:local?`你今天的个人最好成绩：${local.moves} 步 · ${local.seconds} 秒`:'今天还没有通关记录，先去完成今日挑战吧。',primary:'去挑战每日同题',secondary:'分享挑战入口',onPrimary:()=>startGame('daily',currentDay()),onSecondary:share});}
function hint(){if(won){toast('本局已经通关');return;}const path=shortestPath(board);if(!path.length)return;hints++;dir=path[0].dir;highlight=path[0].q;render();const buttons=[...$.anchors.querySelectorAll('button')];buttons[highlight].style.boxShadow='0 0 0 6px #f8cd7e66,0 0 35px #eeca76';buttons[highlight].animate([{transform:'translate(-50%,-50%) scale(1)'},{transform:'translate(-50%,-50%) scale(1.2)'},{transform:'translate(-50%,-50%) scale(1)'}],{duration:900,iterations:2});toast('试玩版免费显示一步提示；这局不参与每日排名');sound(660,.3);}
function reset(){startGame(mode,key);toast('已重置，重新挑战最优解');}
$.anchors.addEventListener('click',e=>{const b=e.target.closest('button[data-q]');if(b)spin(Number(b.dataset.q));});
el('cwBtn').onclick=()=>{dir=1;render();sound(390)};el('ccwBtn').onclick=()=>{dir=-1;render();sound(350)};
el('resetBtn').onclick=reset;el('hintBtn').onclick=hint;el('shareBtn').onclick=share;el('nextBtn').onclick=nextLevel;el('rankBtn').onclick=showRank;
$.storyTab.onclick=()=>{claimedBeat=null;startGame('story',String(read('unlocked',1)));};$.dailyTab.onclick=()=>{claimedBeat=null;startGame('daily',currentDay());};
el('closeModal').onclick=()=>{$.modal.hidden=true;};$.modal.addEventListener('click',e=>{if(e.target===$.modal)$.modal.hidden=true;});
el('soundBtn').onclick=()=>{soundEnabled=!soundEnabled;write('sound',soundEnabled);el('soundBtn').textContent=soundEnabled?'♫':'♩';if(soundEnabled){sound(523);backgroundMusic();}else if(audio){audio.suspend().catch(()=>{});}toast(soundEnabled?'声音已开启':'声音已关闭');};el('soundBtn').textContent=soundEnabled?'♫':'♩';
window.addEventListener('keydown',e=>{if(e.key==='Escape')$.modal.hidden=true;else if(e.key==='r'||e.key==='R')reset();else if(e.key==='1'||e.key==='2'||e.key==='3'||e.key==='4')spin(Number(e.key)-1);else if(e.key===' ') {e.preventDefault();dir=-dir;render();}});
window.setInterval(updateTime,220);bgTimer=window.setInterval(backgroundMusic,6600);
const entry=parseChallenge(new URLSearchParams(location.search));claimedBeat=entry.beat;startGame(entry.mode,entry.key);if(new URLSearchParams(location.search).has('mode'))showGame();else showHome();if(claimedBeat!==null)toast(`好友向你发起挑战：试试能否少于 ${claimedBeat} 步！`);
