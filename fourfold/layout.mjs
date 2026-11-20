// The artwork keeps its own aspect ratio. Available height changes the arrangement,
// never the width of the whole screen.
const HOME_BUTTONS = [[1114,198],[1116,196],[1122,196]];
const fitHeight = (width, sw, sh) => width * sh / sw;
const box = (x,y,w,h) => ({x,y,w,h});

export function homeLayout(width,height){
  const menuW=width*.8,buttonHeights=HOME_BUTTONS.map(([w,h])=>Math.max(44,fitHeight(menuW,w,h)));
  const menuH=buttonHeights.reduce((a,b)=>a+b,0)+10;
  const regularH=fitHeight(width,854,1140)+16+menuH+16;
  const compact=regularH>height,heroW=compact?width-8:width;
  const cropTop=compact?128:0,heroH=fitHeight(heroW,854,1140-cropTop);
  const gap=compact?4:16,contentH=heroH+gap+menuH+(compact?8:16);
  const y=compact?4+Math.max(0,(height-contentH)/2):0;
  let menuY=y+heroH+gap;
  const buttons=buttonHeights.map(h=>{const r=box((width-menuW)/2,menuY,menuW,h);menuY+=h+5;return r;});
  return {compact,contentH:Math.max(height,contentH),hero:box((width-heroW)/2,y,heroW,heroH),cropTop,
    image:box(0,-cropTop*heroW/854,heroW,1840*heroW/854),buttons,
    settings:box(12,compact?Math.max(10,y+3):14,44,44)};
}

export function dailyLayout(width,height){
  const c=width-16,cardW=(c-8)/2,directionW=(c-8)/2;
  const statsH=fitHeight(cardW,380,181),boardH=fitHeight(c,817,765);
  const directionH=Math.max(44,fitHeight(directionW,412,123));
  const hintW=c*401/817,shareW=c*764/817;
  const hintH=Math.max(44,fitHeight(hintW,401,92)),shareH=Math.max(44,fitHeight(shareW,764,143));
  const regularHeights=[44,fitHeight(c,807,213),statsH,boardH,directionH,hintH,shareH];
  const regularTotal=regularHeights.reduce((a,b)=>a+b,0)+6*6+16;
  const compact=regularTotal>height,gap=compact?3:6,pad=compact?6:8;
  const bannerW=compact?c-72:c,bannerH=fitHeight(bannerW,807,213);
  const footerHintW=(c-8)*.36,footerShareW=(c-8)*.64;
  const footerH=Math.max(44,fitHeight(footerHintW,401,92),fitHeight(footerShareW,764,143));
  const heights=compact?[Math.max(44,bannerH),statsH,boardH,directionH,footerH]:regularHeights;
  const total=heights.reduce((a,b)=>a+b,0)+gap*(heights.length-1)+pad*2;
  let y=pad+Math.max(0,(height-total)/2);
  const rows=heights.map(h=>{const r=box(8,y,c,h);y+=h+gap;return r;});
  const bannerRow=compact?rows[0]:rows[1],statsRow=compact?rows[1]:rows[2],boardRow=compact?rows[2]:rows[3],directionRow=compact?rows[3]:rows[4];
  const navY=rows[0].y+(rows[0].h-44)/2;
  const hint=compact?box(8,rows[4].y,footerHintW,footerH):box((width-hintW)/2,rows[5].y,hintW,hintH);
  const share=compact?box(16+footerHintW,rows[4].y,footerShareW,footerH):box((width-shareW)/2,rows[6].y,shareW,shareH);
  return {compact,contentH:Math.max(height,total),
    back:box(compact?0:8,navY,44,44),settings:box(width-(compact?44:52),navY,44,44),iconWidth:compact?32:40,
    banner:box((width-bannerW)/2,bannerRow.y+(bannerRow.h-bannerH)/2,bannerW,bannerH),
    moves:box(8,statsRow.y,cardW,statsH),timer:box(16+cardW,statsRow.y+(statsH-fitHeight(cardW,379,180))/2,cardW,fitHeight(cardW,379,180)),
    board:boardRow,cw:box(8,directionRow.y,directionW,directionH),ccw:box(16+directionW,directionRow.y,directionW,directionH),hint,share};
}

if(typeof document!=='undefined'){
  const shell=document.getElementById('app'),home=document.getElementById('home'),daily=document.getElementById('gameScreen');
  const place=(element,r)=>{element.style.left=r.x+'px';element.style.top=r.y+'px';element.style.width=r.w+'px';element.style.height=r.h+'px';};
  function applyLayout(){
    const {width,height}=shell.getBoundingClientRect();
    if(!width||!height)return;
    const h=homeLayout(width,height),d=dailyLayout(width,height);
    home.dataset.layout=h.compact?'compact':'regular';daily.dataset.layout=d.compact?'compact':'regular';
    place(home.querySelector('.home-hero'),h.hero);place(home.querySelector('.home-scene'),h.image);
    home.style.setProperty('--home-u',width/390+'px');
    home.style.setProperty('--home-content-height',h.contentH+'px');
    home.style.setProperty('--home-crop-top',h.cropTop);
    home.querySelectorAll('.cozy-menu button').forEach((b,i)=>place(b,h.buttons[i]));
    place(document.getElementById('homeSettings'),h.settings);
    // Values are applied to daily-only selectors; ordinary levels keep their layout.
    const positions={backHome:d.back,settingsBtn:d.settings,dailyBanner:d.banner,cwBtn:d.cw,ccwBtn:d.ccw,hintBtn:d.hint,shareBtn:d.share};
    for(const [id,r] of Object.entries(positions)){
      const element=document.getElementById(id);
      for(const [key,value] of Object.entries(r))element.style.setProperty('--daily-'+key,value+'px');
    }
    const parts=[[daily.querySelector('.metric-row>.stat-card:first-child'),d.moves],[daily.querySelector('.metric-row>.stat-card:last-child'),d.timer],[daily.querySelector('.board-frame'),d.board]];
    for(const [element,r] of parts)for(const [key,value] of Object.entries(r))element.style.setProperty('--daily-'+key,value+'px');
    daily.style.setProperty('--daily-content-height',d.contentH+'px');
    daily.style.setProperty('--daily-icon-width',d.iconWidth+'px');
    daily.style.setProperty('--daily-banner-scale',d.banner.w/807+'px');
    daily.style.setProperty('--daily-stat-scale',d.moves.w/380+'px');
    daily.style.setProperty('--daily-board-scale',d.board.w/817+'px');
    document.documentElement.dataset.layoutReady='true';
  }
  applyLayout();
  new ResizeObserver(applyLayout).observe(shell);
  window.addEventListener('resize',applyLayout);
  window.visualViewport?.addEventListener('resize',applyLayout);
}
