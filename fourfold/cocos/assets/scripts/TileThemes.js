// Shared visual choices only. Puzzle generation, scoring and the goal stay in Core.
const theme=(id,name,resource,indexColor='#FFF2C5',indexShadowColor='#081025CC',indexOutlineColor='#081025AA',indexHighlightColor='#FFF8E8')=>
  Object.freeze({id,name,resource,indexColor,indexShadowColor,indexOutlineColor,indexHighlightColor});

export const TILE_THEMES=Object.freeze([
  theme('night','深蓝星月','celestial-mural-v2'),
  theme('ruby','暗红玫瑰','celestial-ruby-v1'),
  theme('jade','翠绿星庭','celestial-jade-v1'),
  theme('amethyst','紫晶梦境','celestial-amethyst-v1'),
  theme('tide','青蓝潮汐','celestial-tide-v1'),
  theme('solar','琥珀日轮','celestial-solar-v1'),
  theme('frost','银白星霜','celestial-frost-v1','#603823','#FFF9E8B3','#FFF4D899','#FFFEF4'),
]);

function themeHash(text){
  let value=2166136261;
  for(let index=0;index<text.length;index++)value=Math.imul(value^text.charCodeAt(index),16777619);
  return value>>>0;
}

function dailyThemeIndex(ordinal){
  const count=TILE_THEMES.length,bag=Math.floor(ordinal/count),offset=ordinal-bag*count;
  // Each fixed seven-day bag contains every theme. Its first day excludes the
  // previous bag's known last theme, so the boundary never repeats either.
  const last=themeHash('end:'+bag)%count,previousLast=themeHash('end:'+(bag-1))%count;
  const indices=TILE_THEMES.map((_,index)=>index);
  const candidates=indices.filter(index=>index!==previousLast&&index!==last);
  const first=candidates[themeHash('start:'+bag)%candidates.length];
  const middle=indices.filter(index=>index!==first&&index!==last);
  let seed=themeHash('shuffle:'+bag)||0x9e3779b9;
  for(let index=middle.length-1;index>0;index--){
    seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;
    const target=Math.floor((seed>>>0)/4294967296*(index+1));
    [middle[index],middle[target]]=[middle[target],middle[index]];
  }
  return [first,...middle,last][offset];
}

export function getTileTheme(mode,key){
  if(mode==='story'){
    const level=Number(key);
    if(!Number.isSafeInteger(level)||level<1)throw new Error('Invalid story theme key');
    return TILE_THEMES[0];
  }else if(mode==='daily'){
    // Core already supplies the UTC+8 calendar key. Do not read the device's timezone.
    if(typeof key!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(key))throw new Error('Invalid daily theme key');
    const time=Date.parse(key+'T00:00:00Z');
    if(!Number.isFinite(time)||new Date(time).toISOString().slice(0,10)!==key)throw new Error('Invalid daily theme date');
    return TILE_THEMES[dailyThemeIndex(Math.floor(time/86400000))];
  }else throw new Error('Invalid theme mode');
}

export function buildThemeArtwork(baseArtwork,selectedTheme,width,height){
  if(!selectedTheme||!/^[-a-z0-9]+$/.test(selectedTheme.resource)||!Number.isSafeInteger(width)||!Number.isSafeInteger(height)||width<=0||height<=0)throw new Error('Invalid theme image');
  if(baseArtwork?.fit!=='fill'||!Array.isArray(baseArtwork.imageSize)||baseArtwork.imageSize.length!==2)throw new Error('Invalid base mural layout');
  const [sourceW,sourceH]=baseArtwork.imageSize;
  if(!Number.isFinite(sourceW)||!Number.isFinite(sourceH)||sourceW<=0||sourceH<=0)throw new Error('Invalid base mural size');
  const sourceRectByToken={};
  for(let token=1;token<=9;token++){
    const rect=baseArtwork.sourceRectByToken?.[token];
    if(!Array.isArray(rect)||rect.length!==4||rect.some(value=>!Number.isFinite(value)))throw new Error('Missing base mural crop');
    const [x,y,w,h]=rect;
    if(x<0||y<0||w<=0||h<=0||x+w>sourceW+1e-7||y+h>sourceH+1e-7)throw new Error('Invalid base mural crop');
    const left=x/sourceW*width,top=y/sourceH*height;
    // Scale shared endpoints, including image strips concealed by the metal rails.
    // Subtract endpoints instead of rounding or independently insetting each piece.
    const right=x+w>=sourceW-1e-7?width:(x+w)/sourceW*width;
    const bottom=y+h>=sourceH-1e-7?height:(y+h)/sourceH*height;
    sourceRectByToken[token]=[left,top,right-left,bottom-top];
  }
  return {resource:selectedTheme.resource,imageSize:[width,height],fit:'fill',sourceRectByToken,themeId:selectedTheme.id};
}
