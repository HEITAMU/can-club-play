/** 微信小游戏开放数据域：仅在这里读取微信朋友关系链；不构造假榜单。 */
/* global wx */
const sharedCanvas=wx.getSharedCanvas();
const ctx=sharedCanvas.getContext('2d');
const WIDTH=650,HEIGHT=380;
sharedCanvas.width=WIDTH;sharedCanvas.height=HEIGHT;
function draw(status,records=[]){
  ctx.clearRect(0,0,WIDTH,HEIGHT);ctx.fillStyle='#142139';ctx.fillRect(0,0,WIDTH,HEIGHT);
  ctx.fillStyle='#d8bb83';ctx.font='bold 26px sans-serif';ctx.fillText('微信好友 · 今日同关榜',22,40);
  ctx.fillStyle='#718ba7';ctx.font='18px sans-serif';ctx.fillText('按最少步数，其次用时排序',22,69);
  if(status){ctx.fillStyle='#a3b6cc';ctx.font='21px sans-serif';ctx.fillText(status,26,155);return;}
  records.slice(0,5).forEach((row,i)=>{
    const y=111+i*51;ctx.fillStyle=i%2===0?'#223451':'#1a2b46';ctx.fillRect(12,y-28,WIDTH-24,44);
    ctx.fillStyle=i===0?'#eed2a3':'#acc0d5';ctx.font='bold 21px sans-serif';ctx.fillText(String(i+1).padStart(2,'0'),27,y);
    ctx.font='20px sans-serif';const name=String(row.nickname||'微信好友').slice(0,9);ctx.fillText(name,88,y);
    ctx.textAlign='right';ctx.fillStyle='#efcd93';ctx.font='bold 20px sans-serif';ctx.fillText(row.moves+' 步',WIDTH-155,y);ctx.fillStyle='#92a6bd';ctx.font='17px sans-serif';ctx.fillText(row.seconds+' 秒',WIDTH-28,y);ctx.textAlign='left';
  });
}
wx.onMessage(message=>{
  if(!message || message.type!=='fourfold-rank')return;
  const day=String(message.day||'');const key='FF_DAILY_V1';
  if(!/^20\d{2}-\d\d-\d\d$/.test(day)){draw('挑战日期无效');return;}
  draw('正在读取好友成绩…');
  try{wx.getFriendCloudStorage({keyList:[key],success(result){
    const rows=(result.data||[]).map(user=>{
      const item=(user.KVDataList||[]).find(v=>v.key===key);if(!item)return null;
      const parts=String(item.value||'').split('|');if(parts.length<4||parts[0]!==day)return null;
      const score=Number(parts[1]),moves=Number(parts[2]),seconds=Number(parts[3]);
      if(!Number.isFinite(score)||!Number.isFinite(moves)||!Number.isFinite(seconds)||score<=0||moves<1||seconds<0)return null;
      return{nickname:user.nickname||'微信好友',score,moves,seconds,openid:user.openid};
    }).filter(Boolean).sort((a,b)=>b.score-a.score||a.moves-b.moves||a.seconds-b.seconds);
    if(!rows.length)draw('还没有朋友完成今日挑战，去拿下第一名吧。');else draw('',rows);
  },fail(err){console.warn('getFriendCloudStorage failed',err);draw('好友关系权限未就绪，请检查隐私授权配置。');}});
  }catch(e){console.warn(e);draw('好友榜暂不可用，请稍后再试。');}
});
draw('完成今天的关卡后，好友成绩会显示在这里。');
