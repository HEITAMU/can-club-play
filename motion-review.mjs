import {FINISHED_ROSTER} from './finished-roster-data.mjs';
import {FINISHED_SPARK} from './finished-spark-data.mjs';
import {renderPuppetFrame} from './rig-renderer.mjs';
import {renderBaselineFrame} from './motion-baseline-renderer.mjs';
import {rigPose} from './rig-motion.mjs';
import {actionTiming} from './motion.mjs';
import {attackStyle} from './motion.mjs';
const $=s=>document.querySelector(s),images={};
try{
await Promise.all(['orange','ink','milk','spark','mint','bolt','pudding','star'].map(async id=>{const image=new Image();image.src=id==='spark'?FINISHED_SPARK.atlas:FINISHED_ROSTER[id].atlas;await image.decode();images[id]=image;}));
const oldCanvas=$('#old canvas'),newCanvas=$('#new canvas'),ctx=oldCanvas.getContext('2d');const currentCtx=newCanvas.getContext('2d'),backend='完整原画 / 短过渡',gpu={draw(id,pose){renderPuppetFrame(currentCtx,id,pose,images[id],400,384,null,{to:'neutral'});return null;}};
let id='orange',kind='normal',clock=0,paused=false,last=performance.now(),counter=0,oldTotal=0,newTotal=0;
const timings=()=>actionTiming({catId:id,side:'p'},kind);
const duration=()=>timings().duration+1.1;
const smooth=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
function draw(){const timing=timings(),t=clock%duration(),elapsed=t-.45,actor={catId:id,side:'p',hp:100,interval:1.5};if(elapsed>=0&&elapsed<timing.duration)actor.action={...timing,kind,elapsed};const pose=rigPose(id,actor,clock,clock);
const start=performance.now();renderBaselineFrame(ctx,id,pose,images[id],400,384,null,{to:'neutral'});const mid=performance.now(),draws=gpu.draw(id,pose),end=performance.now();oldTotal+=mid-start;newTotal+=end-mid;counter++;
const distance=Math.max(0,$('#new').clientWidth-200),hitAt=timing.impactAt;
let travel=0;if(attackStyle({catId:id},kind)==='melee'&&elapsed>=0){travel=elapsed<hitAt?smooth((elapsed-timing.windup)/timing.travel):1-smooth((elapsed-hitAt-timing.hold)/timing.recovery);}
for(const lane of ['old','new']){const el=$('#'+lane);el.querySelector('canvas').style.transform=`translateX(${distance*travel}px)`;const hit=elapsed-hitAt,target=el.querySelector('.target');target.style.transform=`translateX(${hit>=0&&hit<.22?Math.sin(hit/.22*Math.PI)*7:0}px) rotate(${hit>=0&&hit<.22?Math.sin(hit/.22*Math.PI)*7:0}deg)`;target.style.filter=hit>=0&&hit<.09?'brightness(1.8)':'';
const fx=el.querySelector('.fx'),flight=(elapsed-timing.windup)/timing.travel;fx.style.opacity=id==='spark'&&flight>=0&&flight<=1?'1':'0';fx.style.left=(130+(el.clientWidth-195)*Math.max(0,Math.min(1,flight)))+'px';fx.style.top=(105-Math.sin(Math.max(0,Math.min(1,flight))*Math.PI)*20)+'px';}
$('#phase').textContent=elapsed<0?'准备':elapsed<timing.windup?'蓄势':elapsed<hitAt?'出手':elapsed<hitAt+timing.hold?'命中':elapsed<timing.duration?'收势':'待机';$('#hit').textContent=`本次命中：${elapsed>=hitAt?1:0} / 1`;$('#seek').value=t/duration()*1000;
if(counter>=30){$('#oldStats').textContent=`CPU 绘制均值 ${(oldTotal/counter).toFixed(2)} ms / 帧 · Canvas 网格` ;$('#newStats').textContent=`CPU 绘制均值 ${(newTotal/counter).toFixed(2)} ms / 帧 · ${backend}${draws===null?'':` / ${draws} 次绘制`}`;counter=0;oldTotal=newTotal=0;}}
for(const button of document.querySelectorAll('[data-id]'))button.onclick=()=>{id=button.dataset.id;clock=0;document.querySelectorAll('[data-id]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));draw();};
$('#kind').onchange=e=>{kind=e.target.value;clock=0;draw();};$('#pause').onclick=()=>{paused=!paused;$('#pause').textContent=paused?'播放':'暂停';};$('#seek').oninput=e=>{paused=true;$('#pause').textContent='播放';clock=+e.target.value/1000*duration();draw();};
document.addEventListener('visibilitychange',()=>last=performance.now());function frame(now){if(!document.hidden){if(!paused)clock+=Math.min(.05,(now-last)/1000)*Number($('#speed').value);draw();}last=now;requestAnimationFrame(frame);}requestAnimationFrame(frame);
}catch(error){$('#newStats').textContent='此设备无法运行试作：'+error.message;}
