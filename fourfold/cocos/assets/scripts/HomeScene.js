// Shared by the browser and Cocos: the new homepage is a full-width illustration,
// with real text on top and three separate menu buttons. Short screens scroll.
export const HOME_ART=Object.freeze({
  resource:'home-celestial-v3',width:1173,height:1341,
  titleRect:[230,112,714,106],subtitleRect:[330,218,514,30],
  titleSize:104,subtitleSize:28,
});

export const HOME_UI=Object.freeze({
  resource:'home-menu-v3',width:1448,height:1086,
  frames:{story:[37,88,1370,260],daily:[37,419,1370,260],rank:[37,752,1370,260]},
});

const BUTTONS=Object.values(HOME_UI.frames).map(([, ,w,h])=>[w,h]);
const box=(x,y,w,h)=>({x,y,w,h});

export function homeStoryLabel(level){
  return Number(level)>1?`挑战第${level}关`:'开始解谜';
}

export function homeLayout(width,height){
  const textScale=width/HOME_ART.width,heroH=HOME_ART.height*textScale;
  const menuW=width*.8,buttonHeights=BUTTONS.map(([w,h])=>Math.max(44,menuW*h/w));
  const menuH=buttonHeights.reduce((sum,h)=>sum+h,0)+6;
  const content=heroH+6+menuH+12,top=6+Math.max(0,(height-content)/2);
  let menuY=top+heroH+6;
  const buttons=buttonHeights.map(h=>{const r=box((width-menuW)/2,menuY,menuW,h);menuY+=h+3;return r;});
  const scaleRect=([x,y,w,h])=>box(x*textScale,y*textScale,w*textScale,h*textScale);
  return {compact:content>height,contentH:Math.max(height,content),textScale,cropTop:0,
    hero:box(0,top,width,heroH),image:box(0,0,width,heroH),
    title:scaleRect(HOME_ART.titleRect),subtitle:scaleRect(HOME_ART.subtitleRect),
    buttons,settings:box(12,top+10,44,44)};
}
