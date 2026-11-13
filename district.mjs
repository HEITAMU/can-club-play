import {rewardIcons} from './loot-icons.mjs?v=0.25.1';
import {STALL_UPGRADES,STALL_MAX,ARENA_MAX,ARENA_UNLOCK,stallQuote,idleMinutes,arenaInfo,arenaOpen} from './progression.mjs?v=0.25.0';
import {idleRate} from './core.mjs?v=0.25.0';
const fmt=n=>Math.floor(n||0).toLocaleString('zh-CN');
export const DISTRICT_PLACES=[
 {id:'stall',name:'鱼摊',sub:'经营与收益',x:22,y:65,w:44,h:35},
 {id:'arena',name:'委托板',sub:'特殊挑战',x:78,y:71.7,w:36,h:16}
];
export function districtHTML(s){return `<div class="district-page"><div class="district-scene" aria-label="深夜猫巷"><img data-asset="./assets/scenes/neighborhood-v0220.webp" alt="暗巷里的猫窝与晾鱼架，左下暖灯鱼摊，右下暖灯委托板"/><canvas class="district-ambient" aria-hidden="true"></canvas>${DISTRICT_PLACES.map(p=>`<button class="district-place" data-place="${p.id}" aria-label="${p.name}" style="left:${p.x}%;top:${p.y}%;width:${p.w}%;height:${p.h}%"><span class="district-accessible">${p.name}</span></button>`).join('')}</div></div>`;}
export function stallHTML(s){return `<h2 id="modal-title">鱼摊</h2><div class="stall-income">${rewardIcons({gold:idleRate(s)})}<span>/ 分钟</span><button id="idle-claim" class="primary">领取 ${fmt(s.idle)}</button></div><div class="stall-upgrades">${STALL_UPGRADES.map(u=>{const q=stallQuote(s,u.id);return `<article><div><h3>${u.name}</h3><span>${q.level}/${STALL_MAX}</span></div><p>${u.effect}</p><button class="secondary wide" data-stall-upgrade="${u.id}" ${q.maxed||s.supplies<q.cost?'disabled':''}>${q.maxed?'已满级':'升级 '+rewardIcons({supplies:q.cost})}</button></article>`;}).join('')}</div><button id="stall-patrol" class="street-entry"><b>街区巡逻</b>${rewardIcons({gold:1,supplies:1},{counts:false})}</button>`;}
export function arenaHTML(s){return `<h2 id="modal-title">街头擂台</h2><div class="arena-tiers">${Array.from({length:ARENA_MAX},(_,i)=>{const a=arenaInfo(i+1),open=arenaOpen(s,a.tier);return `<button class="street-entry" data-arena-tier="${a.tier}" ${open?'':'disabled'}><b>${a.name} ${a.tier}</b>${rewardIcons({badges:1,gear:1},{counts:false})}</button>`;}).join('')}</div>`;}
// Two low-amplitude glows aligned to the painted lamps; no continuous particle allocation.
export function paintDistrictAmbient(ctx,x,y,w,h,time){ctx.save();ctx.translate(x,y);for(const [i,l] of [[.094,.633],[.903,.642]].entries()){const r=w*.048,g=ctx.createRadialGradient(l[0]*w,l[1]*h,0,l[0]*w,l[1]*h,r);g.addColorStop(0,'#ffdf9c');g.addColorStop(1,'#ffce7000');ctx.globalAlpha=.035+.012*Math.sin(time*.65+i);ctx.fillStyle=g;ctx.fillRect(l[0]*w-r,l[1]*h-r,r*2,r*2);}ctx.restore();}

// Continuous original-pixel mesh: outer edges, floor and board lamp stay pinned.
const feedbackRegions={stall:{left:0,right:496,top:710,bottom:1270,cx:220,foot:1245},arena:{left:600,right:1008,top:1018,bottom:1240,cx:800,foot:1210}};
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
export function districtObjectPose(id,pressed=false,age=0){
 const p=DISTRICT_PLACES.find(p=>p.id===id);
 const amount=pressed?1:age>=.26?0:Math.exp(-age*20)*Math.cos(age*29);
 return {x:p.x/100,y:p.y/100,amount,scale:1-.025*amount,dy:0};
}
export function districtMeshPoint(id,x,y,amount){
 const r=feedbackRegions[id];if(!r)return [x,y];
 const edge=smooth((x-r.left)/42)*smooth((r.right-x)/42)*smooth((y-r.top)/42)*smooth((r.bottom-y)/40);
 const lift=Math.max(0,r.foot-y);
 return [x+(r.cx-x)*.018*edge*amount*smooth(lift/110),y+lift*.045*edge*amount];
}
function triangle(ctx,img,a,b,c,da,db,dc){
 const determinant=(b[0]-a[0])*(c[1]-a[1])-(c[0]-a[0])*(b[1]-a[1]);
 const ax=((db[0]-da[0])*(c[1]-a[1])-(dc[0]-da[0])*(b[1]-a[1]))/determinant;
 const bx=((dc[0]-da[0])*(b[0]-a[0])-(db[0]-da[0])*(c[0]-a[0]))/determinant;
 const ay=((db[1]-da[1])*(c[1]-a[1])-(dc[1]-da[1])*(b[1]-a[1]))/determinant;
 const by=((dc[1]-da[1])*(b[0]-a[0])-(db[1]-da[1])*(c[0]-a[0]))/determinant;
 ctx.save();ctx.beginPath();
 const mx=(da[0]+db[0]+dc[0])/3,my=(da[1]+db[1]+dc[1])/3;
 for(const [i,p] of [da,db,dc].entries()){const dx=p[0]-mx,dy=p[1]-my,l=Math.hypot(dx,dy);const xx=p[0]+dx/l*.4,yy=p[1]+dy/l*.4;if(i)ctx.lineTo(xx,yy);else ctx.moveTo(xx,yy);}
 ctx.closePath();ctx.clip();ctx.transform(ax,ay,bx,by,da[0]-ax*a[0]-bx*a[1],da[1]-ay*a[0]-by*a[1]);
 ctx.drawImage(img,0,0,1024,1536);ctx.restore();
}
export function paintDistrictObjects(ctx,images,x,y,w,h,pressed=null,release=null){
 const id=pressed||release?.id,img=images.scene,r=feedbackRegions[id];if(!img||!r)return;
 const amount=districtObjectPose(id,!!pressed,release?.age??0).amount;if(Math.abs(amount)<.001)return;
 ctx.save();ctx.translate(x,y);ctx.scale(w/1024,h/1536);ctx.beginPath();ctx.rect(r.left,r.top,r.right-r.left,r.bottom-r.top);ctx.clip();
 const cols=8,rows=id==='stall'?10:5;
 for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){
  const l=r.left+(r.right-r.left)*col/cols,t=r.top+(r.bottom-r.top)*row/rows,rr=r.left+(r.right-r.left)*(col+1)/cols,bb=r.top+(r.bottom-r.top)*(row+1)/rows;
  const a=[l,t],b=[rr,t],c=[rr,bb],d=[l,bb],warp=p=>districtMeshPoint(id,...p,amount);
  triangle(ctx,img,a,b,c,warp(a),warp(b),warp(c));triangle(ctx,img,a,c,d,warp(a),warp(c),warp(d));
 }
 ctx.restore();
}
