// One horizon for art, actor feet and weather, independent of viewport cropping.
export const BACKDROP_FRACTION=.35;
export function groundFootY(row,actorHeight,unit){
 const fullHeight=actorHeight+76,horizon=fullHeight*BACKDROP_FRACTION;
 const bottom=actorHeight*.95,top=Math.min(bottom-unit*.6,horizon+unit*1.05);
 return (top+(bottom-top)*Math.max(0,Math.min(1,(row-51)/44)))/actorHeight*100;
}
export function layeredScene({file,x,y,width,height,cut,sheetWidth=width*3,sheetHeight=height*2}){
 const image=`<image data-asset="${file}" width="${sheetWidth}" height="${sheetHeight}"/>`,h=BACKDROP_FRACTION*1000;
 return `<svg class="scene-art stage-scene layered-battlefield" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true"><svg x="0" y="0" width="1000" height="${h}" viewBox="${x} ${y} ${width} ${cut}" preserveAspectRatio="none" overflow="hidden">${image}</svg><svg x="0" y="${h}" width="1000" height="${1000-h}" viewBox="${x} ${y+cut} ${width} ${height-cut}" preserveAspectRatio="none" overflow="hidden">${image}</svg></svg>`;
}
