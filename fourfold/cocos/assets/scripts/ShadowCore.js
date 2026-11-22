// Engine-independent rules shared by the browser prototype and future Creator UI.
export const DIRECTIONS=Object.freeze({up:[-1,0],right:[0,1],down:[1,0],left:[0,-1]});
export const LEVELS=Object.freeze([
 {name:'先滑一下',size:3,starts:[6],goals:[0],walls:[],message:'向上划动金色星星，让它停进星座。'},
 {name:'借自己的影子',size:3,starts:[6],goals:[4],walls:[0],message:'中间没有刹车的地方，借一个自己的影子。'},
 {name:'绕一下就到了',size:4,starts:[12],goals:[10],walls:[],message:'先绕一绕，把影子留在能帮上忙的位置。'},
 {name:'两颗星见面',size:4,starts:[12,15],goals:[5,10],walls:[0],message:'金星回金色空位，蓝星回蓝色空位。'},
 {name:'留个位置给你',size:4,starts:[12,3],goals:[6,9],walls:[0,15],message:'你留下的影子，也能帮另一颗星停住。'}
].map(level=>Object.freeze({...level,starts:Object.freeze(level.starts),goals:Object.freeze(level.goals),walls:Object.freeze(level.walls)})));
export function initialState(level){return {stars:[...level.starts],shadowMask:0,moves:0};}
export function isWon(level,state){return state.stars.every((p,i)=>p===level.goals[i]);}
export function neighbour(index,direction,size){const delta=DIRECTIONS[direction];if(!delta)return -1;const r=Math.floor(index/size)+delta[0],c=index%size+delta[1];return r<0||r>=size||c<0||c>=size?-1:r*size+c;}
export function slide(level,state,star,direction){
 if(!Number.isInteger(star)||star<0||star>=state.stars.length||!DIRECTIONS[direction])return null;
 const from=state.stars[star];let to=from;const path=[];let stoppedBy;
 while(true){const next=neighbour(to,direction,level.size);
  if(next<0){stoppedBy={type:'edge',index:-1};break;}
  if(level.walls.includes(next)){stoppedBy={type:'wall',index:next};break;}
  if(state.shadowMask&(1<<next)){stoppedBy={type:'shadow',index:next};break;}
  if(state.stars.some((p,i)=>i!==star&&p===next)){stoppedBy={type:'star',index:next};break;}
  to=next;path.push(next);
 }
 if(to===from)return null;
 const stars=[...state.stars];stars[star]=to;
 return {state:{stars,shadowMask:state.shadowMask|(1<<from),moves:state.moves+1},from,to,path,star,direction,stoppedBy};
}
function key(state){return state.stars.join(',')+':'+state.shadowMask;}
export function solve(level,state=initialState(level),maxStates=40000){
 if(isWon(level,state))return {status:'solved',moves:[],visited:1};
 const queue=[{state,parent:-1,move:null}],seen=new Set([key(state)]);
 for(let cursor=0;cursor<queue.length;cursor++){
  const node=queue[cursor];
  for(let star=0;star<state.stars.length;star++)for(const direction of Object.keys(DIRECTIONS)){
   const result=slide(level,node.state,star,direction);if(!result)continue;
   const id=key(result.state);if(seen.has(id))continue;seen.add(id);
   const entry={state:result.state,parent:cursor,move:{star,direction}};
   if(isWon(level,result.state)){
    const moves=[entry.move];let p=cursor;while(queue[p].parent>=0){moves.push(queue[p].move);p=queue[p].parent;}
    return {status:'solvable',moves:moves.reverse(),visited:seen.size};
   }
   if(seen.size>=maxStates)return {status:'limit',moves:[],visited:seen.size};
   queue.push(entry);
  }
 }
 return {status:'blocked',moves:[],visited:seen.size};
}
