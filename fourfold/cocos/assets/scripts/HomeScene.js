// Shared by the browser and Cocos: the new homepage is a full-width illustration,
// with real text and a launch hit area on top. Short screens scroll; no art is cropped.
export const HOME_ART=Object.freeze({
  resource:'home-observatory-v2',width:1174,height:1340,
  titleRect:[230,112,714,106],subtitleRect:[330,218,514,30],
  launchRect:[158,380,858,900],titleSize:104,subtitleSize:28,
});

const BUTTONS=[[1114,198],[1116,196],[1122,196]];
const box=(x,y,w,h)=>({x,y,w,h});

export function homeStoryLabel(level){
  return Number(level)>1?`挑战第${level}关`:'开始解谜';
}

export function homeLayout(width,height){
  const textScale=width/HOME_ART.width,heroH=HOME_ART.height*textScale;
  const menuW=width*.8,buttonHeights=BUTTONS.map(([w,h])=>Math.max(44,menuW*h/w));
  const menuH=buttonHeights.reduce((sum,h)=>sum+h,0)+10;
  const content=heroH+8+menuH+16,top=8+Math.max(0,(height-content)/2);
  let menuY=top+heroH+8;
  const buttons=buttonHeights.map(h=>{const r=box((width-menuW)/2,menuY,menuW,h);menuY+=h+5;return r;});
  const scaleRect=([x,y,w,h])=>box(x*textScale,y*textScale,w*textScale,h*textScale);
  return {compact:content>height,contentH:Math.max(height,content),textScale,cropTop:0,
    hero:box(0,top,width,heroH),image:box(0,0,width,heroH),
    title:scaleRect(HOME_ART.titleRect),subtitle:scaleRect(HOME_ART.subtitleRect),launch:scaleRect(HOME_ART.launchRect),
    buttons,settings:box(12,top+10,44,44)};
}
