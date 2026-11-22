import {LEVELS,initialState,slide,isWon,solve} from '../cocos/assets/scripts/ShadowCore.js?v=1';
import {createBackgroundMusic} from '../music.mjs?v=0.8.39';
import {createGameAudio} from '../audio.mjs?v=0.8.39';
const $=id=>document.getElementById(id),STORAGE='STARMAP_SHADOW_DEMO_V1';
let saved={};try{saved=JSON.parse(localStorage.getItem(STORAGE)||'{}')||{};}catch{}
let selectedLevel=Number.isInteger(saved.level)?Math.max(0,Math.min(LEVELS.length-1,saved.level)):0;
let soundOn=saved.sound!==false;
const completed=new Set(Array.isArray(saved.completed)?saved.completed.filter(x=>Number.isInteger(x)&&x>=0&&x<LEVELS.length):[]);
const music=createBackgroundMusic({enabled:soundOn,isVisible:()=>!document.hidden}),sfx=createGameAudio({enabled:soundOn,isVisible:()=>!document.hidden});void sfx.preload();
const board=$('board'),pieceLayer=$('pieces');
const DIR_NAMES={up:'上',right:'右',down:'下',left:'左'},DIR_GLYPHS={up:'↑',right:'→',down:'↓',left:'←'},COLORS=['金星','蓝星'];
const starPath='M30 3 37 22 57 30 37 38 30 57 23 38 3 30 23 22Z';
const starSVG='<svg viewBox="0 0 60 60" aria-hidden="true"><path d="'+starPath+'" fill="currentColor" stroke="#fff2cf" stroke-width="1.6" stroke-linejoin="round"/><path d="M30 3 30 30 3 30 23 22Z" fill="#fff7d4" opacity=".65"/><path d="M30 30 57 30 37 38 30 57Z" fill="#705127" opacity=".27"/><circle cx="29" cy="28" r="3.5" fill="#fff9e8"/></svg>';
const shadowSVG='<svg viewBox="0 0 60 60" aria-hidden="true"><path d="'+starPath+'"/><path class="inner" d="m30 15 4.5 11L46 30l-11.5 4L30 45l-4.5-11L14 30l11.5-4Z"/></svg>';
let level,state,history=[],selectedStar=0,drag=null,locked=false,moveTimer=0,hint=null,cellNodes=[],starNodes=[];
function save(){try{localStorage.setItem(STORAGE,JSON.stringify({level:selectedLevel,completed:[...completed],sound:soundOn}));}catch{}}
function gesture(){void music.resume({gesture:true});void sfx.unlock({gesture:true});}
function place(node,index){node.style.left=`${index%level.size*100/level.size}%`;node.style.top=`${Math.floor(index/level.size)*100/level.size}%`;}
for(let i=0;i<LEVELS.length;i++){const o=document.createElement('option');o.value=String(i);$('level').append(o);}
function options(){for(let i=0;i<LEVELS.length;i++)$('level').options[i].textContent=`${completed.has(i)?'✓ ':''}第 ${i+1} 关 · ${LEVELS[i].name}`;$('level').value=String(selectedLevel);}
function loadLevel(index){
 clearTimeout(moveTimer);locked=false;drag=null;hint=null;selectedLevel=index;level=LEVELS[index];state=initialState(level);history=[];selectedStar=0;
 board.style.setProperty('--size',level.size);board.dataset.level=String(index+1);$('cells').replaceChildren();pieceLayer.replaceChildren();cellNodes=[];starNodes=[];
 for(let i=0;i<level.size**2;i++){const cell=document.createElement('div');cell.className='cell'+(level.walls.includes(i)?' wall':'');cell.dataset.index=String(i);const goal=level.goals.indexOf(i);if(goal>=0)cell.innerHTML=`<svg class="goal-slot ${goal===1?'blue':''}" viewBox="0 0 60 60" aria-hidden="true"><path d="${starPath}"/></svg>`;cellNodes.push(cell);$('cells').append(cell);}
 state.stars.forEach((position,i)=>{const star=document.createElement('button');star.type='button';star.className='star-piece'+(i===1?' blue':'');star.dataset.star=String(i);star.innerHTML=starSVG;star.addEventListener('click',()=>{selectedStar=i;renderSelection();});star.addEventListener('focus',()=>{selectedStar=i;renderSelection();});starNodes.push(star);pieceLayer.append(star);place(star,position);});
 render(level.message);options();if(index===0)showHint({star:0,direction:'up'});save();
}
function renderSelection(){starNodes.forEach((node,i)=>{node.classList.toggle('selected',selectedStar===i);node.setAttribute('aria-label',`${COLORS[i]}，第${Math.floor(state.stars[i]/level.size)+1}行第${state.stars[i]%level.size+1}列${selectedStar===i?'，已选中':''}，划动移动`);});}
function clearPreview(){cellNodes.forEach(cell=>cell.classList.remove('preview','preview-end'));$('gestureCue').replaceChildren();starNodes.forEach(n=>n.classList.remove('hinted'));}
function preview(result){clearPreview();if(!result)return;result.path.forEach(i=>cellNodes[i].classList.add('preview'));cellNodes[result.to].classList.add('preview-end');}
function showHint(move){hint=move;selectedStar=move.star;renderSelection();preview(slide(level,state,move.star,move.direction));starNodes[move.star].classList.add('hinted');const cue=document.createElement('span');cue.textContent=DIR_GLYPHS[move.direction];place(cue,state.stars[move.star]);$('gestureCue').append(cue);}
function render(message='',detail='划动星星 · 碰到挡板才停 · 出发处留影'){
 clearPreview();const won=isWon(level,state);document.querySelector('.page').classList.toggle('is-won',won);board.dataset.won=String(won);board.dataset.moves=String(state.moves);board.dataset.stars=state.stars.join(',');board.dataset.shadowMask=String(state.shadowMask);
 for(const ghost of pieceLayer.querySelectorAll('.shadow-piece'))ghost.remove();
 for(let i=0;i<level.size**2;i++)if(state.shadowMask&(1<<i)){const ghost=document.createElement('div');ghost.className='shadow-piece';ghost.innerHTML=shadowSVG;ghost.setAttribute('aria-label','留下的影子');ghost.dataset.index=String(i);place(ghost,i);pieceLayer.prepend(ghost);}
 starNodes.forEach((node,i)=>{place(node,state.stars[i]);node.classList.toggle('in-goal',state.stars[i]===level.goals[i]);node.disabled=won;});renderSelection();
 $('count').textContent=`${state.stars.filter((p,i)=>p===level.goals[i]).length} / ${level.goals.length}`;$('moves').textContent=`${state.moves} 次滑动`;$('undo').disabled=!history.length||locked;$('hint').disabled=locked;
 $('next').hidden=!won;
 if(won){completed.add(selectedLevel);options();save();$('message').textContent=selectedLevel===LEVELS.length-1?'借着影子，星星都回家了':'刚刚好，停住了！';$('detail').textContent=`${state.moves} 次滑动 · 完整星图留给你看`;$('next').textContent=selectedLevel===LEVELS.length-1?'再玩一轮':'下一关';}
 else{$('message').textContent=message||level.message;$('detail').textContent=detail;}
 $('progress').textContent=completed.size?`已完成 ${completed.size} / ${LEVELS.length} 关 · 可选关`:'5 关试玩 · 可直接选关';
}
function move(star,direction){
 if(locked||isWon(level,state))return;gesture();clearPreview();hint=null;const result=slide(level,state,star,direction);
 if(!result){$('message').textContent='这个方向被挡住了，换个方向试试。';starNodes[star].classList.remove('jolt');void starNodes[star].offsetWidth;starNodes[star].classList.add('jolt');return;}
 history.push({state:{...state,stars:[...state.stars]},selectedStar});selectedStar=star;state=result.state;locked=true;void sfx.playButton();
 const duration=matchMedia('(prefers-reduced-motion:reduce)').matches?0:Math.min(360,150+result.path.length*40);board.style.setProperty('--travel',`${duration}ms`);
 let message=result.stoppedBy.type==='shadow'?'借到影子了，它帮星星停了下来。':'原地留下了影子，后面可以借它挡一下。';
 if(result.path.includes(level.goals[star])&&result.to!==level.goals[star])message='刚才滑过了空位，要停在里面才算。';
 render(message);moveTimer=setTimeout(()=>{locked=false;$('undo').disabled=!history.length;$('hint').disabled=false;if(selectedLevel===1&&!isWon(level,state)&&state.moves<=2){const answer=solve(level,state);if(answer.status==='solvable'){const next=answer.moves[0],landing=slide(level,state,next.star,next.direction);$('message').textContent=`向${DIR_NAMES[next.direction]}滑，${landing.stoppedBy.type==='shadow'?'借影子停住。':'留个影子给下一步。'}`;showHint(next);}}},duration);
}
function getDirection(dx,dy){if(Math.max(Math.abs(dx),Math.abs(dy))<16)return null;return Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up');}
board.addEventListener('pointerdown',event=>{if(locked||isWon(level,state)||event.isPrimary===false||event.button>0)return;const target=event.target.closest('.star-piece');if(!target)return;selectedStar=Number(target.dataset.star);renderSelection();drag={id:event.pointerId,x:event.clientX,y:event.clientY,star:selectedStar,direction:null};board.setPointerCapture(event.pointerId);target.focus({preventScroll:true});clearPreview();});
board.addEventListener('pointermove',event=>{if(!drag||drag.id!==event.pointerId)return;const direction=getDirection(event.clientX-drag.x,event.clientY-drag.y);if(direction!==drag.direction){drag.direction=direction;preview(direction?slide(level,state,drag.star,direction):null);}event.preventDefault();});
board.addEventListener('pointerup',event=>{if(!drag||drag.id!==event.pointerId)return;const action=drag;drag=null;if(board.hasPointerCapture(event.pointerId))board.releasePointerCapture(event.pointerId);const direction=getDirection(event.clientX-action.x,event.clientY-action.y);clearPreview();if(direction)move(action.star,direction);});
function cancelDrag(){drag=null;clearPreview();}board.addEventListener('pointercancel',cancelDrag);board.addEventListener('lostpointercapture',()=>{if(drag)cancelDrag();});
board.addEventListener('keydown',event=>{const directions={ArrowUp:'up',ArrowRight:'right',ArrowDown:'down',ArrowLeft:'left'};if(directions[event.key]){event.preventDefault();move(selectedStar,directions[event.key]);}});
$('undo').addEventListener('click',()=>{if(!history.length||locked)return;gesture();const previous=history.pop();state=previous.state;selectedStar=previous.selectedStar;hint=null;board.style.setProperty('--travel','.15s');render('退回一步，影子也一起收回了。');});
$('reset').addEventListener('click',()=>{gesture();loadLevel(selectedLevel);});
$('hint').addEventListener('click',()=>{if(locked)return;gesture();const answer=solve(level,state);if(answer.status==='solvable'){showHint(answer.moves[0]);$('message').textContent=`${COLORS[answer.moves[0].star]}向${DIR_NAMES[answer.moves[0].direction]}滑。`;$('detail').textContent='虚线框是这一划会停的位置。';}else if(answer.status==='blocked'){$('message').textContent='这条路线走不通了，退一步试试。';$('detail').textContent='影子也可能挡路，撤销会一起收回。';}else if(answer.status==='limit'){$('message').textContent='这条路线暂时没找到提示，可以退一步再试。';}});
$('next').addEventListener('click',()=>{gesture();loadLevel((selectedLevel+1)%LEVELS.length);});$('level').addEventListener('change',event=>{gesture();loadLevel(Number(event.target.value));});
function updateSound(){$('sound').setAttribute('aria-pressed',String(soundOn));$('sound').setAttribute('aria-label',soundOn?'关闭声音':'开启声音');$('sound').querySelector('span').textContent=soundOn?'声音':'静音';}
$('sound').addEventListener('click',()=>{soundOn=!soundOn;music.setEnabled(soundOn);sfx.setEnabled(soundOn);updateSound();save();if(soundOn)gesture();});
function pause(){cancelDrag();music.pause();sfx.pause();}document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();else void music.resume();});window.addEventListener('pagehide',pause);window.addEventListener('pageshow',()=>{if(!document.hidden)void music.resume();});
updateSound();loadLevel(selectedLevel);document.documentElement.dataset.ready='true';
