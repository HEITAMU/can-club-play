/** 微信好友成绩只在开放数据域读取和绘制，不向主域返回好友数据，不生成示例名单。 */
/* global wx */
const sharedCanvas=wx.getSharedCanvas();
const ctx=sharedCanvas.getContext('2d');
// 与主域 RankViewTemplate / rank-scene 的设计分辨率一致，保持透明并且不在运行时改变纹理尺寸。
const CANVAS_WIDTH=854,CANVAS_HEIGHT=1842,PODIUM_COUNT=3,PAGE_SIZE=3,DEFAULT_KEY='FF_DAILY_V1';
sharedCanvas.width=CANVAS_WIDTH;sharedCanvas.height=CANVAS_HEIGHT;
const COLORS={ink:'#5B2D19',muted:'#916343',gold:'#E6BC75',avatar:'#342753',avatarText:'#FFF0C8'};
// 全部使用批准原画的源像素坐标。主域负责底图、日期、个人最佳和点击区域。
const LAYOUT={
  podium:[
    {avatar:{x:427,y:501,r:60,maxY:550},name:{x:427,y:653,w:194,size:31},moves:{x:427,y:703,w:188,size:31},time:{x:427,y:743,w:192,size:35}},
    {avatar:{x:189,y:564,r:56,maxY:611},name:{x:190,y:694,w:170,size:28},moves:{x:190,y:741,w:154,size:29},time:{x:190,y:777,w:154,size:31}},
    {avatar:{x:664,y:577,r:56,maxY:624},name:{x:665,y:701,w:170,size:28},moves:{x:665,y:744,w:154,size:29},time:{x:665,y:780,w:154,size:31}}
  ],
  list:{centers:[1024,1122,1220],rankX:129,avatarX:266,avatarR:30,nameX:383,nameWidth:170,movesX:563,movesWidth:120,timeX:708,timeWidth:144},
  state:{x:427,titleY:1105,detailY:1144,width:650},
  pagination:{x:427,y:1258,w:146,size:19}
};
const avatarCache=new Map();
let requestSerial=0;
let state={day:'',key:DEFAULT_KEY,page:0,rows:[],status:'idle'};

function text(value,x,y,size,color=COLORS.ink,align='center',bold=false){
  ctx.font=(bold?'bold ':'')+size+'px sans-serif';ctx.fillStyle=color;ctx.textAlign=align;ctx.textBaseline='middle';ctx.fillText(String(value),x,y);
}
function fittedText(value,maxWidth){
  const chars=Array.from(String(value));if(ctx.measureText(chars.join('')).width<=maxWidth)return chars.join('');
  while(chars.length&&ctx.measureText(chars.join('')+'…').width>maxWidth)chars.pop();
  return chars.length?chars.join('')+'…':'…';
}
function nameText(value,field,align='center'){
  ctx.font='bold '+field.size+'px sans-serif';
  ctx.save();ctx.beginPath();ctx.rect(align==='left'?field.x:field.x-field.w/2,field.y-field.size*.8,field.w,field.size*1.6);ctx.clip();
  text(fittedText(value,field.w),field.x,field.y,field.size,COLORS.ink,align,true);
  ctx.restore();
}
function valueText(value,field,color=COLORS.ink){
  ctx.font='bold '+field.size+'px sans-serif';
  const width=ctx.measureText(String(value)).width,size=width>field.w?field.size*field.w/width:field.size;
  ctx.save();ctx.beginPath();ctx.rect(field.x-field.w/2,field.y-field.size*.8,field.w,field.size*1.6);ctx.clip();
  text(value,field.x,field.y,size,color,'center',true);
  ctx.restore();
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
    // 旧 score 字段和提示次数都不参与筛选、排序；历史 0 分提示成绩仍按真实步数/用时入榜。
    rows.push({nickname,moves,seconds,avatarUrl:typeof user.avatarUrl==='string'?user.avatarUrl:'',index});
  });
  return rows.sort((a,b)=>a.moves-b.moves||a.seconds-b.seconds||a.index-b.index);
}
function totalPages(){return state.rows.length?Math.max(1,Math.ceil(Math.max(0,state.rows.length-PODIUM_COUNT)/PAGE_SIZE)):0;}
function clampPage(page){return Math.max(0,Math.min(Math.max(0,totalPages()-1),Number.isFinite(page)?Math.floor(page):0));}
function podiumRows(){return state.rows.slice(0,PODIUM_COUNT);}
function pageRows(){const start=PODIUM_COUNT+state.page*PAGE_SIZE;return state.rows.slice(start,start+PAGE_SIZE);}
function visibleRows(){return podiumRows().concat(pageRows());}
function timeText(seconds){return String(Math.floor(seconds/60)).padStart(2,'0')+':'+String(seconds%60).padStart(2,'0');}
function avatar(url){
  if(!url||typeof wx.createImage!=='function')return null;
  const cached=avatarCache.get(url);if(cached)return cached.status==='ready'?cached.image:null;
  const entry={status:'loading',image:null};avatarCache.set(url,entry);
  if(avatarCache.size>40)avatarCache.delete(avatarCache.keys().next().value);
  try{
    const image=wx.createImage();entry.image=image;
    image.onload=()=>{entry.status='ready';if(state.status==='ready'&&visibleRows().some(row=>row.avatarUrl===url))render();};
    image.onerror=()=>{entry.status='failed';};
    image.src=url;
  }catch{entry.status='failed';}
  return null;
}
function drawAvatar(row,field){
  const {x,y,r}=field,size=r*2,image=avatar(row.avatarUrl);
  // 领奖台头像底边退让原画上的 1/2/3 徽章，不遮住徽章和缎带。
  ctx.save();
  if(Number.isFinite(field.maxY)){ctx.beginPath();ctx.rect(x-r-2,y-r-2,size+4,field.maxY-(y-r-2));ctx.clip();}
  ctx.save();ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.clip();ctx.fillStyle=COLORS.avatar;ctx.fillRect(x-r,y-r,size,size);
  let painted=false;
  if(image){try{const w=image.width||size,h=image.height||size,crop=Math.min(w,h);ctx.drawImage(image,(w-crop)/2,(h-crop)/2,crop,crop,x-r,y-r,size,size);painted=true;}catch{}}
  if(!painted)text(Array.from(row.nickname)[0]||'友',x,y,size*.43,COLORS.avatarText,'center',true);
  ctx.restore();ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.strokeStyle=COLORS.gold;ctx.lineWidth=1.5;ctx.stroke();
  ctx.restore();
}
function drawPodium(){
  const rows=podiumRows();
  LAYOUT.podium.forEach((field,index)=>{
    const row=rows[index];
    if(row){drawAvatar(row,field.avatar);nameText(row.nickname,field.name);}
    else nameText(state.status==='ready'?'待登榜':'—',field.name);
    valueText(row?row.moves+' 步':'— 步',field.moves);
    valueText(row?timeText(row.seconds):'—:—',field.time);
  });
}
function drawListRow(row,index){
  const field=LAYOUT.list,y=field.centers[index],rank=PODIUM_COUNT+state.page*PAGE_SIZE+index+1;
  valueText(rank,{x:field.rankX,y,w:55,size:37});
  drawAvatar(row,{x:field.avatarX,y,r:field.avatarR});
  nameText(row.nickname,{x:field.nameX,y,w:field.nameWidth,size:31});
  valueText(row.moves,{x:field.movesX,y,w:field.movesWidth,size:36});
  valueText(timeText(row.seconds),{x:field.timeX,y,w:field.timeWidth,size:34});
}
function drawState(status=state.status){
  const titles={idle:'等待读取好友成绩',loading:'正在读取好友成绩…',empty:'这一天暂无好友成绩',more:'暂无更多好友成绩',error:'好友榜暂时无法读取',invalid:'挑战日期无效'};
  const details={idle:'进入排行榜后自动同步',loading:'请稍候',empty:'完成同一天挑战的好友会显示在这里',more:'前三名已在上方展示',error:'请稍后重新打开排行榜',invalid:'请返回后重新打开排行榜'};
  const field=LAYOUT.state;
  // 仅状态文案使用轻薄纸色背衬，避免原画的竖分隔线穿过文字。
  const paper=ctx.createLinearGradient(64,0,790,0);
  paper.addColorStop(0,'rgba(255,241,215,0)');paper.addColorStop(.08,'rgba(255,241,215,.97)');
  paper.addColorStop(.92,'rgba(255,241,215,.97)');paper.addColorStop(1,'rgba(255,241,215,0)');
  ctx.fillStyle=paper;ctx.fillRect(64,1081,726,80);
  nameText(titles[status]||titles.error,{x:field.x,y:field.titleY,w:field.width,size:30});
  text(details[status]||details.error,field.x,field.detailY,23,COLORS.muted);
}
function render(){
  ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
  // 不重画标题、纸张、金边或星空；这些都来自主域显示的批准原画。
  drawPodium();
  if(state.status==='ready'){
    const rows=pageRows();if(rows.length)rows.forEach(drawListRow);else drawState('more');
  }else drawState();
  const pages=totalPages(),footer=state.status==='ready'?(state.page+1)+' / '+pages:state.status==='loading'?'读取中':'—';
  valueText(footer,LAYOUT.pagination,COLORS.muted);
}
function readFriends(message){
  const serial=++requestSerial,day=String(message.day||''),key=typeof message.key==='string'&&message.key.trim()?message.key.trim():DEFAULT_KEY;
  // width/height 是主域显示尺寸；纹理始终使用源坐标，避免改变 SubContextView 已绑定的 SpriteFrame。
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
