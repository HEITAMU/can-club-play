/** 微信好友成绩只在开放数据域读取和绘制，不向主域返回好友数据，不生成示例名单。 */
/* global wx */
const sharedCanvas=wx.getSharedCanvas();
const ctx=sharedCanvas.getContext('2d');
// 与主域RankViewTemplate的SubContextView设计分辨率一致，运行时不改变纹理尺寸。
const CANVAS_WIDTH=720,CANVAS_HEIGHT=640,PAGE_SIZE=5,DEFAULT_KEY='FF_DAILY_V1';
sharedCanvas.width=CANVAS_WIDTH;sharedCanvas.height=CANVAS_HEIGHT;
const COLORS={paper:'#FFF1D7',light:'#FFF8E9',ink:'#5B301F',muted:'#977253',line:'#D8B37B',gold:'#D8A44D',purple:'#8B699B'};
const avatarCache=new Map();
let logicalWidth=358,logicalHeight=358*CANVAS_HEIGHT/CANVAS_WIDTH,requestSerial=0;
let state={day:'',key:DEFAULT_KEY,page:0,rows:[],status:'idle'};

function roundRect(x,y,w,h,r){
  r=Math.max(0,Math.min(r,w/2,h/2));
  ctx.beginPath();ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.quadraticCurveTo(x+w,y,x+w,y+r);
  ctx.lineTo(x+w,y+h-r);ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);ctx.lineTo(x+r,y+h);
  ctx.quadraticCurveTo(x,y+h,x,y+h-r);ctx.lineTo(x,y+r);ctx.quadraticCurveTo(x,y,x+r,y);ctx.closePath();
}
function panel(x,y,w,h,r,fill,stroke=COLORS.line){
  roundRect(x,y,w,h,r);ctx.fillStyle=fill;ctx.fill();
  if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=.8*logicalWidth/358;ctx.stroke();}
}
function text(value,x,y,size,color=COLORS.ink,align='left',bold=false){
  ctx.font=`${bold?'bold ':''}${size}px sans-serif`;ctx.fillStyle=color;ctx.textAlign=align;ctx.textBaseline='middle';ctx.fillText(String(value),x,y);
}
function fittedText(value,maxWidth){
  const chars=Array.from(String(value));if(ctx.measureText(chars.join('')).width<=maxWidth)return chars.join('');
  while(chars.length&&ctx.measureText(chars.join('')+'…').width>maxWidth)chars.pop();
  return chars.length?chars.join('')+'…':'…';
}
function star(x,y,r,color){
  ctx.beginPath();for(let i=0;i<8;i++){const angle=-Math.PI/2+i*Math.PI/4,d=i%2?r*.3:r;const px=x+Math.cos(angle)*d,py=y+Math.sin(angle)*d;if(i)ctx.lineTo(px,py);else ctx.moveTo(px,py);}
  ctx.closePath();ctx.fillStyle=color;ctx.fill();
}
function validDay(day){
  if(!/^20\d{2}-\d{2}-\d{2}$/.test(day))return false;
  const time=Date.parse(day+'T00:00:00Z');return Number.isFinite(time)&&new Date(time).toISOString().slice(0,10)===day;
}
function parseRows(users,day,key){
  const rows=[];
  users.forEach((user,index)=>{
    if(!user||!Array.isArray(user.KVDataList))return;
    const item=user.KVDataList.find(v=>v&&v.key===key);if(!item||typeof item.value!=='string')return;
    const parts=item.value.split('|');if(parts.length<4||parts[0]!==day||!/^\d+$/.test(parts[2])||!/^\d+$/.test(parts[3]))return;
    const moves=Number(parts[2]),seconds=Number(parts[3]);
    if(!Number.isSafeInteger(moves)||!Number.isSafeInteger(seconds)||moves<1||seconds<0)return;
    const nickname=typeof user.nickname==='string'&&user.nickname.trim()?user.nickname.trim():'微信好友';
    // 旧score字段和提示次数都不参与筛选、排序；历史0分提示成绩仍按真实步数/用时入榜。
    rows.push({nickname,moves,seconds,avatarUrl:typeof user.avatarUrl==='string'?user.avatarUrl:'',index});
  });
  return rows.sort((a,b)=>a.moves-b.moves||a.seconds-b.seconds||a.index-b.index);
}
function totalPages(){return Math.ceil(state.rows.length/PAGE_SIZE);}
function clampPage(page){return Math.max(0,Math.min(Math.max(0,totalPages()-1),Number.isFinite(page)?Math.floor(page):0));}
function pageRows(){return state.rows.slice(state.page*PAGE_SIZE,(state.page+1)*PAGE_SIZE);}
function timeText(seconds){return `${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;}
function avatar(url){
  if(!url||typeof wx.createImage!=='function')return null;
  const cached=avatarCache.get(url);if(cached)return cached.status==='ready'?cached.image:null;
  const entry={status:'loading',image:null};avatarCache.set(url,entry);
  if(avatarCache.size>40)avatarCache.delete(avatarCache.keys().next().value);
  try{
    const image=wx.createImage();entry.image=image;
    image.onload=()=>{entry.status='ready';if(state.status==='ready'&&pageRows().some(row=>row.avatarUrl===url))render();};
    image.onerror=()=>{entry.status='failed';};
    image.src=url;
  }catch{entry.status='failed';}
  return null;
}
function drawAvatar(row,x,y,size){
  const r=size/2,image=avatar(row.avatarUrl);
  ctx.save();ctx.beginPath();ctx.arc(x+r,y+r,r,0,Math.PI*2);ctx.clip();ctx.fillStyle='#EBDCF0';ctx.fillRect(x,y,size,size);
  let painted=false;
  if(image){try{const w=image.width||size,h=image.height||size,crop=Math.min(w,h);ctx.drawImage(image,(w-crop)/2,(h-crop)/2,crop,crop,x,y,size,size);painted=true;}catch{}}
  if(!painted)text(Array.from(row.nickname)[0]||'友',x+r,y+r,size*.45,'#7F5D8C','center',true);
  ctx.restore();ctx.beginPath();ctx.arc(x+r,y+r,r,0,Math.PI*2);ctx.strokeStyle='#CEAC71';ctx.lineWidth=1.2*logicalWidth/358;ctx.stroke();
}
function drawMedal(rank,x,y,r){
  const palettes=[['#FFE3A0','#C9913B','#855124'],['#F7F0DE','#C3B4A1','#81705B'],['#EEC59C','#BA8153','#7E4C31']];
  const [light,dark,ink]=palettes[rank-1],gradient=ctx.createLinearGradient(x,y-r,x,y+r);
  gradient.addColorStop(0,light);gradient.addColorStop(1,dark);
  ctx.fillStyle=dark;ctx.beginPath();ctx.moveTo(x-r*.65,y+r*.45);ctx.lineTo(x-r*.64,y+r*1.3);ctx.lineTo(x,y+r*.95);ctx.lineTo(x+r*.64,y+r*1.3);ctx.lineTo(x+r*.65,y+r*.45);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=gradient;ctx.fill();ctx.strokeStyle=ink;ctx.lineWidth=.8;ctx.stroke();
  ctx.beginPath();ctx.arc(x,y,r*.77,0,Math.PI*2);ctx.strokeStyle=light;ctx.stroke();text(rank,x,y+.2,r*1.15,ink,'center',true);
}
function drawState(top,bottom,u){
  const titles={idle:'等待读取好友成绩',loading:'正在读取好友成绩…',empty:'这一天暂无好友成绩',error:'好友榜暂时无法读取',invalid:'挑战日期无效'};
  const details={idle:'进入排行榜后自动同步',loading:'请稍候',empty:'完成同一天挑战的好友会显示在这里',error:'稍后返回此页重试',invalid:'请返回后重新打开排行榜'};
  const center=logicalWidth/2,cy=(top+bottom)/2;
  panel(14*u,top+8*u,logicalWidth-28*u,Math.max(1,bottom-top-16*u),12*u,'#FFF6E4','#E7CBA1');
  ctx.strokeStyle='#C4AAD0';ctx.lineWidth=1.2*u;ctx.beginPath();ctx.moveTo(center-28*u,cy-24*u);ctx.lineTo(center,cy-38*u);ctx.lineTo(center+26*u,cy-20*u);ctx.stroke();
  star(center,cy-38*u,10*u,COLORS.gold);star(center-28*u,cy-24*u,4*u,COLORS.purple);star(center+26*u,cy-20*u,4*u,COLORS.purple);
  text(titles[state.status]||titles.error,center,cy+3*u,16*u,COLORS.ink,'center',true);
  text(details[state.status]||details.error,center,cy+28*u,11.5*u,COLORS.muted,'center');
}
function render(){
  ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
  const scale=Math.min(CANVAS_WIDTH/logicalWidth,CANVAS_HEIGHT/logicalHeight);
  ctx.setTransform(scale,0,0,scale,(CANVAS_WIDTH-logicalWidth*scale)/2,(CANVAS_HEIGHT-logicalHeight*scale)/2);
  const w=logicalWidth,h=logicalHeight,u=w/358,pad=8*u,headerH=34*u,footerH=24*u,rowsTop=pad+headerH+6*u;
  const rowsBottom=h-pad-footerH,rowPitch=(rowsBottom-rowsTop)/PAGE_SIZE,rowH=rowPitch-5*u;
  const paper=ctx.createLinearGradient(0,0,0,h);paper.addColorStop(0,COLORS.light);paper.addColorStop(1,COLORS.paper);
  panel(.5*u,.5*u,w-u,h-u,14*u,paper,'#D5AD70');
  panel(pad,pad,w-pad*2,headerH,9*u,'#F7E4BE','#DDBB85');
  const rankX=27*u,avatarX=51*u,movesX=w-88*u,timeX=w-30*u,avatarSize=Math.min(32*u,Math.max(12*u,rowH-8*u)),nameX=avatarX+avatarSize+9*u;
  text('名次',rankX,pad+headerH/2,11.5*u,COLORS.muted,'center',true);
  text('好友',avatarX+3*u,pad+headerH/2,11.5*u,COLORS.muted,'left',true);
  text('步数',movesX,pad+headerH/2,11.5*u,COLORS.muted,'center',true);
  text('用时',timeX,pad+headerH/2,11.5*u,COLORS.muted,'center',true);
  if(state.status==='ready')pageRows().forEach((row,index)=>{
    const rank=state.page*PAGE_SIZE+index+1,y=rowsTop+index*rowPitch,cy=y+rowH/2;
    const fills=['#FFF0CB','#F5EAF3','#F8E7D0'],fill=rank<=3?fills[rank-1]:index%2?'#FCEDD7':'#FFF7E8';
    panel(pad,y,w-pad*2,rowH,8*u,fill,rank===1?'#D6A757':'#E5C89F');
    if(rank<=3)drawMedal(rank,rankX,cy-1*u,Math.min(10.6*u,rowH*.27));else text(rank,rankX,cy,14*u,COLORS.purple,'center',true);
    drawAvatar(row,avatarX,cy-avatarSize/2,avatarSize);
    const fontSize=Math.min(15*u,rowH*.4),nameWidth=Math.max(12*u,movesX-28*u-nameX);
    ctx.font=`${fontSize}px sans-serif`;const name=fittedText(row.nickname,nameWidth);text(name,nameX,cy,fontSize,COLORS.ink);
    const numberSize=Math.min(16*u,rowH*.43);ctx.font=`bold ${numberSize}px sans-serif`;
    text(fittedText(row.moves,46*u),movesX,cy,numberSize,COLORS.ink,'center',true);
    const timeSize=Math.min(13*u,rowH*.36);ctx.font=`${timeSize}px sans-serif`;
    text(fittedText(timeText(row.seconds),52*u),timeX,cy,timeSize,COLORS.muted,'center');
  });else drawState(rowsTop,rowsBottom,u);
  const pages=totalPages(),footer=state.status==='loading'?'正在同步':`第 ${pages?state.page+1:0} / ${pages} 页`;
  text(footer,w/2,h-pad-footerH/2,11*u,COLORS.muted,'center');
  star(w/2-52*u,h-pad-footerH/2,3*u,COLORS.gold);star(w/2+52*u,h-pad-footerH/2,3*u,COLORS.gold);
}
function readFriends(message){
  const serial=++requestSerial,day=String(message.day||''),key=typeof message.key==='string'&&message.key.trim()?message.key.trim():DEFAULT_KEY;
  const width=Number(message.width),height=Number(message.height);
  if(Number.isFinite(width)&&Number.isFinite(height)&&width>=200&&height>=200&&width<=2048&&height<=2048){logicalWidth=width;logicalHeight=height;}
  state={day,key,page:Number.isFinite(message.page)?Math.max(0,Math.floor(message.page)):0,rows:[],status:validDay(day)?'loading':'invalid'};
  render();if(state.status==='invalid')return;
  const failed=err=>{if(serial!==requestSerial)return;console.warn('getFriendCloudStorage failed',err);state.rows=[];state.page=0;state.status='error';render();};
  try{
    if(typeof wx.getFriendCloudStorage!=='function'){failed('API unavailable');return;}
    wx.getFriendCloudStorage({keyList:[key],success(result){
      if(serial!==requestSerial)return;
      if(!result||!Array.isArray(result.data)){failed('invalid response');return;}
      state.rows=parseRows(result.data,day,key);state.page=clampPage(state.page);state.status=state.rows.length?'ready':'empty';render();
    },fail:failed});
  }catch(err){failed(err);}
}
wx.onMessage(message=>{
  if(!message)return;
  if(message.type==='fourfold-rank'){readFriends(message);return;}
  if(message.type==='fourfold-rank-page'){
    const delta=message.delta===-1?-1:message.delta===1?1:0;
    const next=clampPage(state.page+delta);if(next!==state.page){state.page=next;render();}
  }
});
render();
