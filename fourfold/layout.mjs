// The artwork keeps its own aspect ratio. Available height changes the arrangement,
// never the width of the whole screen.
import {HOME_ART,HOME_UI,HOME_COLORS,homeLayout} from './cocos/assets/scripts/HomeScene.js?v=0.8.20';
export {homeLayout};
const fitHeight = (width, sw, sh) => width * sh / sw;
const box = (x,y,w,h) => ({x,y,w,h});

export function dailyLayout(width,height){
  const c=width-16,cardW=(c-8)/2,directionW=(c-8)/2;
  const statsH=fitHeight(cardW,380,181),boardH=fitHeight(c,817,765);
  const directionH=Math.max(44,fitHeight(directionW,412,123));
  const toolW=(c-8)/2,shareW=c*764/817;
  const toolH=Math.max(44,fitHeight(toolW,401,92)),shareH=Math.max(44,fitHeight(shareW,764,143));
  const regularHeights=[44,fitHeight(c,807,213),statsH,boardH,directionH,toolH,shareH];
  const regularTotal=regularHeights.reduce((a,b)=>a+b,0)+6*6+16;
  const compact=regularTotal>height,gap=compact?3:6,pad=compact?6:8;
  const bannerW=compact?c-72:c,bannerH=fitHeight(bannerW,807,213);
  const heights=compact?[Math.max(44,bannerH),statsH,boardH,directionH,toolH,shareH]:regularHeights;
  const total=heights.reduce((a,b)=>a+b,0)+gap*(heights.length-1)+pad*2;
  let y=pad+Math.max(0,(height-total)/2);
  const rows=heights.map(h=>{const r=box(8,y,c,h);y+=h+gap;return r;});
  const bannerRow=compact?rows[0]:rows[1],statsRow=compact?rows[1]:rows[2],boardRow=compact?rows[2]:rows[3],directionRow=compact?rows[3]:rows[4];
  const navY=rows[0].y+(rows[0].h-44)/2;
  const toolsRow=compact?rows[4]:rows[5],shareRow=compact?rows[5]:rows[6];
  const hint=box(8,toolsRow.y,toolW,toolH),numbers=box(16+toolW,toolsRow.y,toolW,toolH);
  const share=box((width-shareW)/2,shareRow.y,shareW,shareH);
  const cw=box(8,directionRow.y,directionW,directionH),ccw=box(16+directionW,directionRow.y,directionW,directionH);
  return {compact,contentH:Math.max(height,total),
    back:box(compact?0:8,navY,44,44),settings:box(width-(compact?44:52),navY,44,44),iconWidth:compact?32:40,
    banner:box((width-bannerW)/2,bannerRow.y+(bannerRow.h-bannerH)/2,bannerW,bannerH),
    moves:box(8,statsRow.y,cardW,statsH),timer:box(16+cardW,statsRow.y+(statsH-fitHeight(cardW,379,180))/2,cardW,fitHeight(cardW,379,180)),
    board:boardRow,cw,ccw,hint,numbers,share,
    appreciate:{...cw},next:{...ccw},details:box((width-toolW)/2,toolsRow.y,toolW,toolH)};
}

if(typeof document!=='undefined'){
  const shell=document.getElementById('app'),home=document.getElementById('home'),daily=document.getElementById('gameScreen');
  for(const [name,color] of Object.entries(HOME_COLORS))home.style.setProperty('--home-'+name,color);
  const place=(element,r)=>{element.style.left=r.x+'px';element.style.top=r.y+'px';element.style.width=r.w+'px';element.style.height=r.h+'px';};
  function applyLayout(){
    const {width,height}=shell.getBoundingClientRect();
    if(!width||!height)return;
    const h=homeLayout(width,height),d=dailyLayout(width,height);
    home.dataset.layout=h.compact?'compact':'regular';daily.dataset.layout=d.compact?'compact':'regular';
    place(home.querySelector('.home-hero'),h.hero);place(home.querySelector('.home-scene'),h.image);
    place(document.getElementById('homeTitle'),h.title);place(document.getElementById('homeSubtitle'),h.subtitle);
    document.getElementById('homeTitle').style.fontSize=HOME_ART.titleSize*h.textScale+'px';
    document.getElementById('homeSubtitle').style.fontSize=HOME_ART.subtitleSize*h.textScale+'px';
    home.style.setProperty('--home-u',width/390+'px');
    home.style.setProperty('--home-content-height',h.contentH+'px');
    home.querySelectorAll('.cozy-menu button').forEach((b,i)=>{
      place(b,h.buttons[i]);
      const [sx,sy,sw,sh]=HOME_UI.frames[['story','daily','rank'][i]],skin=b.querySelector('.home-menu-skin');
      place(skin,h.buttonArtwork[i]);
      place(b.querySelector('.button-label'),h.buttonLabels[i]);
      b.style.fontSize=h.buttonFontSizes[i]+'px';
      b.style.setProperty('--button-ratio',sw+' / '+sh);
      skin.style.backgroundImage=`url("${new URL('./assets/art/'+HOME_UI.resource+'.webp',import.meta.url).href}")`;
      skin.style.backgroundSize=`${100*HOME_UI.width/sw}% ${100*HOME_UI.height/sh}%`;
      skin.style.backgroundPosition=`${100*sx/(HOME_UI.width-sw)}% ${100*sy/(HOME_UI.height-sh)}%`;
    });
    place(document.getElementById('homeSettings'),h.settings);
    // Values are applied to daily-only selectors; ordinary levels keep their layout.
    const positions={backHome:d.back,settingsBtn:d.settings,dailyBanner:d.banner,cwBtn:d.cw,ccwBtn:d.ccw,hintBtn:d.hint,numbersBtn:d.numbers,shareBtn:d.share,viewArtBtn:d.appreciate,nextBtn:d.next,resultDetailsBtn:d.details};
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
