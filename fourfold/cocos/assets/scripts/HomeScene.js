// Shared by the browser and Cocos. The complete portrait scene contains the
// title and all three entries; short screens scroll without cropping the art.
export const HOME_ART=Object.freeze({
  resource:'home-celestial-v5',width:941,height:1672,
  titleRect:[94.1,133.76,752.8,125.4],subtitleRect:[235.25,284.24,470.5,50.16],
  titleSize:106,subtitleSize:27,
});

// Homepage-only colors keep the night sky continuous without changing
// the established game, ranking, result panel, or numeric material colors.
export const HOME_COLORS=Object.freeze({
  background:'#1B2B58',title:'#FFF0C6',subtitle:'#E4D3AE',menu:'#76513A',
});

export const HOME_UI=Object.freeze({
  resource:'home-menu-v5',width:1536,height:1024,
  frames:{story:[48,53,1438,385],daily:[53,509,672,450],rank:[800,509,675,450]},
  // Caption regions are local to each frame, clear of the painted icons.
  labelRects:{story:[362,105,820,190],daily:[62,285,548,115],rank:[62,285,551,115]},
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
