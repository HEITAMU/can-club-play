import {FINISHED_SPARK} from './finished-spark-data.mjs?v=0.21.10';
import {renderPuppetFrame} from './rig-renderer.mjs?v=0.21.10';
import {rigPose} from './rig-motion.mjs?v=0.21.10';
import {actionTiming} from './motion.mjs?v=0.21.10';
import {expressionFor} from './expressions.mjs?v=0.21.10';
const canvas=document.querySelector('#hero'),ctx=canvas.getContext('2d'),atlas=new Image();atlas.src=FINISHED_SPARK.atlas;await atlas.decode();
let mode='demo',clock=0,last=performance.now(),paused=false,speed=1;
const sequence=[['idle',1.4],['normal',1.5],['idle',.8],['skill',1.6],['hit',.6],['victory',1],['idle',1.1]];
export function sampleSparkDemo(t,selected='demo'){
 let kind=selected,elapsed=t;
 if(selected==='demo'){elapsed=t%8;for(const [name,duration] of sequence){kind=name;if(elapsed<duration)break;elapsed-=duration;}}
 else elapsed=t%(selected==='idle'?8:selected==='hit'?1.4:1.8);
 const actor={catId:'spark',side:'p',hp:100,interval:1.5};
 if(['normal','skill'].includes(kind)){const timing=actionTiming(actor,kind);if(elapsed<timing.duration)actor.action={...timing,kind,elapsed};}
 if(kind==='hit'&&elapsed<.22)actor.hitUntil=t-elapsed+.22;
 return {actor,kind,face:expressionFor('spark',actor,t,t,{outcome:kind==='victory'?'win':null})};
}
function draw(){const s=sampleSparkDemo(clock,mode),face=document.querySelector('#face').value==='auto'?s.face:document.querySelector('#face').value;renderPuppetFrame(ctx,'spark',rigPose('spark',s.actor,clock,clock),atlas,canvas.width,canvas.height,null,{from:face,to:face,mix:1});document.querySelector('#label').textContent=({idle:'呼吸与眨眼',normal:'提灯 · 普攻',skill:'提灯 · 施法',hit:'受击',victory:'开心'})[s.kind];document.querySelector('#seek').value=clock%8;}
document.querySelectorAll('[data-action]').forEach(b=>b.onclick=()=>{mode=b.dataset.action;clock=0;document.querySelectorAll('[data-action]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));draw();});
document.querySelector('#pause').onclick=e=>{paused=!paused;e.target.textContent=paused?'播放':'暂停';};
document.querySelector('#speed').onchange=e=>speed=+e.target.value;
document.querySelector('#face').onchange=draw;
document.querySelector('#seek').oninput=e=>{clock=+e.target.value;draw();};
function frame(now){if(!paused)clock+=Math.min(.05,(now-last)/1000)*speed;last=now;draw();requestAnimationFrame(frame);}requestAnimationFrame(frame);

globalThis.__sparkPreview={seek(t){paused=true;clock=t;draw();},benchmark(){const start=performance.now();for(let i=0;i<120;i++){clock=i/60;draw();}return{samples:120,averageMs:(performance.now()-start)/120,environment:'CI Chromium; not a phone benchmark'};}};
