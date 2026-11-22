import {LEVELS,PORTS,masksFor,traceLight,turnTile,hintTile} from '../cocos/assets/scripts/StarlightCore.js?v=1';
import {createBackgroundMusic} from '../music.mjs?v=0.8.39';
import {createGameAudio} from '../audio.mjs?v=0.8.39';

const STORAGE='STARMAP_LIGHT_DEMO_V1';
const $=id=>document.getElementById(id);
let stored={};try{stored=JSON.parse(localStorage.getItem(STORAGE)||'{}')||{};}catch{}
let soundOn=stored.sound!==false,selected=Number.isInteger(stored.level)?Math.max(0,Math.min(LEVELS.length-1,stored.level)):0;
const completed=new Set(Array.isArray(stored.completed)?stored.completed.filter(n=>Number.isInteger(n)&&n>=0&&n<LEVELS.length):[]);
const music=createBackgroundMusic({enabled:soundOn,isVisible:()=>!document.hidden});
const sfx=createGameAudio({enabled:soundOn,isVisible:()=>!document.hidden});
void sfx.preload();
let level,turns,history=[],moves=0,won=false,lastLit=new Set(),hint=-1,notice='',serial=0,flashTimer=0;
const cells=[];
function save(){try{localStorage.setItem(STORAGE,JSON.stringify({level:selected,completed:[...completed],sound:soundOn}));}catch{}}
function gesture(){void music.resume({gesture:true});void sfx.unlock({gesture:true});}
const points=[[50,0],[100,50],[50,100],[0,50]],near=[[50,34],[66,50],[50,66],[34,50]];
function routePath(mask){
  const directions=PORTS.flatMap((port,index)=>(mask&port)?[index]:[]);
  if(directions.length===2){
    const [a,b]=directions;
    if((b-a)%2===0)return `M${points[a].join(' ')}L${points[b].join(' ')}`;
    return `M${points[a].join(' ')}L${near[a].join(' ')}Q50 50 ${near[b].join(' ')}L${points[b].join(' ')}`;
  }
  return directions.map(d=>`M50 50L${points[d].join(' ')}`).join('');
}
function routeSVG(mask){
  const path=routePath(mask),hub=PORTS.filter(p=>mask&p).length>=3?'<circle class="hub" cx="50" cy="50" r="5"/>':'';
  return `<svg class="route" viewBox="0 0 100 100" aria-hidden="true"><path class="channel" d="${path}"/><path class="track" d="${path}"/><path class="shine" d="${path}"/><path class="flow" d="${path}"/>${hub}</svg>`;
}
const moonSVG='<svg class="emblem source" viewBox="0 0 60 60" aria-hidden="true"><circle class="moon-disc" cx="30" cy="30" r="28"/><path class="moon" d="M38 8A24 24 0 1 0 47 43A22 22 0 0 1 38 8Z"/><circle fill="#fff3c9" cx="43" cy="20" r="2"/><path fill="#f7d780" d="m40 29 2-5 2 5 5 2-5 2-2 5-2-5-5-2Z"/></svg>';
const starSVG='<svg class="emblem goal" viewBox="0 0 60 60" aria-hidden="true"><circle class="star-aura" cx="30" cy="30" r="24"/><path class="star-main" d="m30 3 7.5 19.5L57 30l-19.5 7.5L30 57l-7.5-19.5L3 30l19.5-7.5Z"/><path class="star-center" d="m30 19 3 8 8 3-8 3-3 8-3-8-8-3 8-3Z"/></svg>';
function updateOptions(){
  for(let i=0;i<LEVELS.length;i++)$('level').options[i].textContent=`${completed.has(i)?'✓ ':''}第 ${i+1} 关 · ${LEVELS[i].name}`;
  $('level').value=String(selected);
}
for(let index=0;index<LEVELS.length;index++){const option=document.createElement('option');option.value=String(index);$('level').append(option);}
function loadLevel(index){
  serial++;clearTimeout(flashTimer);selected=index;level=LEVELS[index];turns=[...level.initialTurns];history=[];moves=0;won=false;lastLit=new Set();notice='';
  hint=index===0?hintTile(level,turns):-1;
  const board=$('board');board.replaceChildren();board.style.setProperty('--size',level.size);board.dataset.level=String(index+1);cells.length=0;
  level.solved.forEach((mask,i)=>{
    const button=document.createElement('button');button.type='button';button.className='tile'+(mask?'':' empty');button.dataset.index=String(i);button.disabled=!mask||i===level.source;
    button.innerHTML=`<span class="tile-art"><img src="assets/tile-v1.webp" width="384" height="384" alt="" draggable="false">${mask?routeSVG(mask):''}</span>${i===level.source?moonSVG:level.targets.includes(i)?starSVG:''}`;
    button.querySelector('.tile-art').style.transform=`rotate(${turns[i]*90}deg)`;
    button.addEventListener('click',()=>rotate(i));cells.push(button);board.append(button);
  });
  updateOptions();update(false);save();
}
function rotate(index){
  if(won)return;
  const next=turnTile(level,turns,index);if(!next)return;
  gesture();void sfx.playButton();
  history.push({turns:[...turns],moves});if(history.length>150)history.shift();turns=next;moves++;notice='';
  if(hint>=0)hint=hintTile(level,turns)===hint?hint:-1;
  update(true);
}
function update(animate){
  const state=traceLight(level,masksFor(level,turns)),justWon=state.won&&!won;won=state.won;
  cells.forEach((cell,index)=>{
    cell.classList.toggle('energized',state.lit.has(index));cell.classList.toggle('just-lit',animate&&state.lit.has(index)&&!lastLit.has(index));cell.classList.toggle('hinted',index===hint&&!won);
    cell.querySelector('.tile-art').style.transform=`rotate(${turns[index]*90}deg)`;
    cell.setAttribute('aria-label',index===level.source?'月亮，月光从这里出发':!level.solved[index]?'星尘空位':`第${Math.floor(index/level.size)+1}行第${index%level.size+1}列${level.targets.includes(index)?'目标星星':'星片'}，${state.lit.has(index)?'已点亮':'未点亮'}，点击旋转`);
    cell.disabled=won||!level.solved[index]||index===level.source;
  });
  lastLit=state.lit;$('board').dataset.litTargets=String(state.litTargets.length);$('board').dataset.won=String(won);
  $('count').textContent=`${state.litTargets.length} / ${level.targets.length}`;$('moves').textContent=`${moves} 次转动`;$('undo').disabled=!history.length;
  document.querySelector('.page').classList.toggle('is-won',won);$('next').hidden=!won;
  if(won){
    $('message').textContent=selected===LEVELS.length-1?'这片星空，被你点亮了':'月光送到了！';
    $('detail').textContent=`${level.targets.length} 颗星星全部点亮 · ${moves} 次转动`;
    $('next').textContent=selected===LEVELS.length-1?'再玩一轮':'下一关';
    if(justWon){completed.add(selected);updateOptions();save();}
  }else{
    $('message').textContent=notice||(hint>=0?'点一下发光的星片，让星路转个方向。':level.message);
    $('detail').textContent=hint>=0?'亮起的是接通月光的路线。':'月亮固定 · 星片每点一次转 90°';
  }
  $('progress').textContent=completed.size?`已点亮 ${completed.size} / ${LEVELS.length} 片星图 · 可选关`:'8 关试玩 · 可直接选关';
  const generation=serial;clearTimeout(flashTimer);if(animate)flashTimer=setTimeout(()=>{if(generation===serial)cells.forEach(cell=>cell.classList.remove('just-lit'));},550);
}
$('level').addEventListener('change',event=>{gesture();loadLevel(Number(event.target.value));});
$('undo').addEventListener('click',()=>{if(!history.length)return;gesture();const previous=history.pop();turns=previous.turns;moves=previous.moves;hint=-1;notice='已退回上一步。';update(true);});
$('reset').addEventListener('click',()=>{gesture();loadLevel(selected);});
$('hint').addEventListener('click',()=>{gesture();hint=hintTile(level,turns);notice=hint<0?'月光已经接通。':'';update(false);});
$('next').addEventListener('click',()=>{gesture();loadLevel((selected+1)%LEVELS.length);});
function updateSound(){const button=$('sound');button.setAttribute('aria-pressed',String(soundOn));button.setAttribute('aria-label',soundOn?'关闭声音':'开启声音');button.querySelector('span').textContent=soundOn?'声音':'静音';}
$('sound').addEventListener('click',()=>{soundOn=!soundOn;music.setEnabled(soundOn);sfx.setEnabled(soundOn);updateSound();save();if(soundOn)gesture();});
function pause(){music.pause();sfx.pause();}
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();else void music.resume();});
window.addEventListener('pagehide',pause);window.addEventListener('pageshow',()=>{if(!document.hidden)void music.resume();});
updateSound();loadLevel(selected);document.documentElement.dataset.ready='true';
