// Standalone “点亮星图” rules, usable by the browser prototype and Creator.
// A tile's ports are N/E/S/W = 1/2/4/8. Only reciprocal neighbours conduct.
export const PORTS=Object.freeze([1,2,4,8]);
export const rotateMask=(mask,turns=1)=>{
  let value=mask;for(let n=((turns%4)+4)%4;n>0;n--)value=((value<<1)&15)|(value>>3);
  return value;
};
export function neighbour(index,direction,size){
  const x=index%size,y=Math.floor(index/size);
  if(direction===0)return y>0?index-size:-1;
  if(direction===1)return x<size-1?index+1:-1;
  if(direction===2)return y<size-1?index+size:-1;
  return x>0?index-1:-1;
}
function defineLevel(name,size,source,targets,paths,scramble,message){
  const solved=Array(size*size).fill(0),turns=Array(size*size).fill(0);
  for(const path of paths)for(let i=1;i<path.length;i++){
    const a=path[i-1],b=path[i],direction=PORTS.findIndex((_,d)=>neighbour(a,d,size)===b);
    if(direction<0)throw Error('Non-adjacent star path');
    solved[a]|=PORTS[direction];solved[b]|=PORTS[(direction+2)%4];
  }
  for(const [index,value] of scramble){
    if(index===source||!solved[index])throw Error('Invalid scramble tile');
    turns[index]=value;
  }
  return Object.freeze({name,size,source,targets:Object.freeze(targets),solved:Object.freeze(solved),initialTurns:Object.freeze(turns),message});
}
export const LEVELS=Object.freeze([
  defineLevel('第一束光',3,6,[2],[[6,3,4,5,2]],[[4,3]],'点一下发光的星片，让月光走过去。'),
  defineLevel('拐个小弯',3,6,[2],[[6,7,4,1,2]],[[7,3],[4,1],[1,3]],'沿着月光，转动接不上的星路。'),
  defineLevel('两颗远星',3,7,[0,2],[[7,4,1,0],[1,2]],[[4,1],[1,3],[0,3]],'让一束月光，照到两颗星星。'),
  defineLevel('月光分岔',3,4,[0,2,8],[[4,1,0],[4,5,2],[4,7,8]],[[1,3],[5,1],[7,3],[8,3]],'分岔的星路，可以同时照亮几个方向。'),
  defineLevel('绕过星尘',4,12,[3,15],[[12,8,9,5,1,2,3],[9,10,14,15]],[[8,3],[9,1],[5,1],[2,1],[10,3],[14,3]],'棋盘变大了，月光依然从月亮出发。'),
  defineLevel('一光三路',4,12,[3,11,15],[[12,8,4,0,1,2,3],[4,5,9,10,11],[9,13,14,15]],[[8,1],[4,3],[0,3],[1,1],[5,3],[9,1],[10,1],[14,1]],'先找到主路，再照亮每一条分岔。'),
  defineLevel('交错星河',4,12,[3,11,15],[[12,8,9,5,4,0,1,2,6,7,3],[6,10,14,15],[10,11]],[[8,3],[9,3],[5,1],[4,3],[0,3],[2,1],[6,3],[10,1],[14,3]],'弯路有点多，先接通身边的一段。'),
  defineLevel('满天星光',4,5,[9,13,14],[[5,1,0,4,8,12,13],[5,6,2,3,7,11,15,14],[6,10,9]],[[1,3],[0,3],[4,1],[12,3],[6,3],[2,1],[3,3],[7,1],[15,3],[10,3]],'把三颗远星都点亮，收好这一片星空。'),
]);
export function masksFor(level,turns){return level.solved.map((mask,index)=>rotateMask(mask,index===level.source?0:(turns[index]||0)));}
export function traceLight(level,masks){
  const lit=new Set([level.source]),distance=Array(masks.length).fill(-1),queue=[level.source];distance[level.source]=0;
  for(let cursor=0;cursor<queue.length;cursor++){
    const index=queue[cursor];
    PORTS.forEach((port,direction)=>{
      if(!(masks[index]&port))return;
      const next=neighbour(index,direction,level.size);
      if(next<0||lit.has(next)||!(masks[next]&PORTS[(direction+2)%4]))return;
      lit.add(next);distance[next]=distance[index]+1;queue.push(next);
    });
  }
  const litTargets=level.targets.filter(index=>lit.has(index));
  return {lit,distance,litTargets,won:litTargets.length===level.targets.length};
}
export function turnTile(level,turns,index){
  if(!Number.isInteger(index)||index<0||index>=turns.length||index===level.source||!level.solved[index])return null;
  const next=turns.slice();next[index]++;return next;
}
export function hintTile(level,turns){
  const masks=masksFor(level,turns);if(traceLight(level,masks).won)return -1;
  const distances=traceLight(level,level.solved).distance;
  return level.solved.map((mask,index)=>({mask,index,distance:distances[index]}))
    .filter(({mask,index})=>mask&&index!==level.source&&mask!==masks[index])
    .sort((a,b)=>a.distance-b.distance||a.index-b.index)[0]?.index??-1;
}
