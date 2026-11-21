// Shared by the browser and Cocos. The complete portrait scene contains the
// title and all three entries; short screens scroll without cropping the art.
export const HOME_ART=Object.freeze({
  resource:'home-celestial-v9',width:981,height:1602,
  titleRect:[98.1,128.16,784.8,120.15],subtitleRect:[245.25,272.34,490.5,48.06],
  titleSize:110.506,subtitleSize:28.148,
});

// Match the established game pages with warm cream, painted gold and brown ink.
// The live title and labels remain clear and unembellished over the artwork.
export const HOME_COLORS=Object.freeze({
  background:'#FDD4AA',title:'#61331F',subtitle:'#936744',menu:'#61331F',
});

export const HOME_UI=Object.freeze({
  resource:'home-menu-v9',width:1536,height:1024,
  frames:{story:[37,73,1453,369],daily:[30,475,711,492],rank:[765,475,727,493]},
  // Caption regions are local to each frame, clear of the painted icons.
  labelRects:{story:[373,85,820,190],daily:[81,310,548,115],rank:[89,318,551,115]},
});

const BUTTONS=[
  {key:'story',x:.12,y:.64,w:.76,fontSize:24,minFont:20,maxFont:28},
  {key:'daily',x:.10,y:.79,w:.38,fontSize:18,minFont:15,maxFont:21},
  {key:'rank',x:.52,y:.79,w:.38,fontSize:18,minFont:15,maxFont:21},
];
const box=(x,y,w,h)=>({x,y,w,h});

export function homeStoryLabel(level){
  return Number(level)>1?`挑战第${level}关`:'开始解谜';
}

export function homeLayout(width,height){
  const textScale=width/HOME_ART.width,heroH=HOME_ART.height*textScale;
  const top=Math.max(0,(height-heroH)/2),buttonArtwork=[],buttonLabels=[],buttonFontSizes=[];
  const buttons=BUTTONS.map(entry=>{
    const [, ,sourceW,sourceH]=HOME_UI.frames[entry.key],artW=width*entry.w,scale=artW/sourceW,artH=sourceH*scale;
    const hitW=Math.max(44,artW),hitH=Math.max(44,artH),insetX=(hitW-artW)/2,insetY=(hitH-artH)/2;
    const [x,y,w,h]=HOME_UI.labelRects[entry.key];
    buttonArtwork.push(box(insetX,insetY,artW,artH));
    buttonLabels.push(box(insetX+x*scale,insetY+y*scale,w*scale,h*scale));
    buttonFontSizes.push(Math.min(entry.maxFont,Math.max(entry.minFont,entry.fontSize*width/390)));
    return box(width*entry.x-insetX,top+heroH*entry.y-insetY,hitW,hitH);
  });
  const scaleRect=([x,y,w,h])=>box(x*textScale,y*textScale,w*textScale,h*textScale);
  // Image/title/subtitle rects are local to the illustration. Hero, buttons and
  // settings are page coordinates; artwork and captions are local to each hit.
  return {compact:heroH>height,contentH:Math.max(height,heroH),textScale,cropTop:0,
    hero:box(0,top,width,heroH),image:box(0,0,width,heroH),
    title:scaleRect(HOME_ART.titleRect),subtitle:scaleRect(HOME_ART.subtitleRect),
    buttons,buttonArtwork,buttonLabels,buttonFontSizes,settings:box(12,top+10,44,44)};
}
