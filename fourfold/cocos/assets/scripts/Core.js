import {DAILY_VERIFIED_ROWS} from './DailyVerified.js';
/** 四格诡局：Cocos / 浏览器共用的无依赖规则引擎。纯函数，便于单测。 */
export const GOAL = '123456789';
export const SQUARES = [[0,1,4,3],[1,2,5,4],[3,4,7,6],[4,5,8,7]];
export const ACTIONS = SQUARES.flatMap((_,q)=>[{q,dir:1},{q,dir:-1}]);
export const isSolved = board => board === GOAL;
export function rotate(board, q, dir=1) {
  if (typeof board !== 'string' || board.length !== 9 || !SQUARES[q] || (dir !== 1 && dir !== -1)) throw new Error('invalid move');
  const [a,b,c,d]=SQUARES[q], out=board.split('');
  if (dir === 1) { out[a]=board[d];out[b]=board[a];out[c]=board[b];out[d]=board[c]; }
  else { out[a]=board[b];out[b]=board[c];out[c]=board[d];out[d]=board[a]; }
  return out.join('');
}
export const inverse = move => ({q:move.q,dir:-move.dir});
export const applyPath=(board,path)=>path.reduce((s,m)=>rotate(s,m.q,m.dir),board);
function reconstruct(meet,a,b) {
  const head=[];let s=meet;
  while(a.get(s).parent!==null){const v=a.get(s);head.push(v.move);s=v.parent;}
  head.reverse();s=meet;const tail=[];
  while(b.get(s).parent!==null){const v=b.get(s);tail.push(inverse(v.move));s=v.parent;}
  return head.concat(tail);
}
/** 双向 BFS，9! 状态图中最大最短路径 11 步，返回严格最优解。 */
export function shortestPath(from) {
  if (!/^([1-9]{9})$/.test(from) || new Set(from).size!==9) throw new Error('invalid board');
  if (from===GOAL) return [];
  const a=new Map([[from,{parent:null,move:null}]]), b=new Map([[GOAL,{parent:null,move:null}]]);
  let fa=[from],fb=[GOAL];
  while(fa.length && fb.length){
    const forward=fa.length<=fb.length, source=forward?a:b, opposite=forward?b:a, frontier=forward?fa:fb, next=[];
    for(const state of frontier){
      for(const move of ACTIONS){
        const dest=rotate(state,move.q,move.dir);
        if(source.has(dest))continue;
        source.set(dest,{parent:state,move});
        if(opposite.has(dest))return reconstruct(dest,a,b);
        next.push(dest);
      }
    }
    if(forward)fa=next;else fb=next;
  }
  throw new Error('unreachable board');
}
export function hash(input){let h=2166136261>>>0;for(const ch of String(input)){h=Math.imul(h ^ ch.charCodeAt(0),16777619)>>>0;}return h>>>0;}
function rand(seed){let x=seed||0x9e3779b9;return ()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return(x>>>0)/4294967296;};}
/** date YYYY-MM-DD; level 1..18。生成独立的确定性残局。 */
// Curated 18-level story progression; each board's exact distance was verified by exhaustive BFS.
export const STORY_BOARDS=["152463789","413526789","152743869","136285479","413278596","413892576","541682793","542361789","523716849","254681793","243619758","254739861","215874369","215378694","624389517","284765913","624397581","624581397"];
export const STORY_PAR=[1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,10];
export function makePuzzle(mode='story', key='1'){
  if(mode!=='story'&&mode!=='daily')throw new Error('invalid mode');
  if(!/^[0-9-]{1,14}$/.test(String(key)))throw new Error('invalid key');
  if(mode==='daily')return dailyBankPuzzle(String(key));
  const level=Math.max(1,Math.min(18,Number(key)||1));
  const board=STORY_BOARDS[level-1],par=STORY_PAR[level-1];
  return {board,par,mode:'story',key:String(level),level,difficulty:par<=2?'入门':par<=4?'普通':par<=6?'进阶':par<=8?'高手':'宗师'};
  /* legacy generator retained below for comparison only */
  const target=mode==='daily'?7:Math.min(8,Math.max(2,2+Math.floor(level*.42)));
  const r=rand(hash(mode+':'+key+':fourfold-v1'));
  let pick=null;
  for(let trial=0;trial<6;trial++){
    let board=GOAL,prior=null;
    const times=target+2+Math.floor(r()*5);
    for(let i=0;i<times;i++){
      let move;
      do{move=ACTIONS[Math.floor(r()*ACTIONS.length)];}while(prior&&prior.q===move.q&&prior.dir===-move.dir);
      board=rotate(board,move.q,move.dir);prior=move;
    }
    const path=shortestPath(board);
    if(!pick||path.length>pick.par)pick={board,par:path.length};
    if(path.length>=target)break;
  }
  return {...pick,mode,key:String(key),level,difficulty:pick.par<=4?'入门':pick.par<=6?'进阶':pick.par<=8?'高手':'宗师'};
}

// Verified deterministic daily bank: distinct non-solved permutations without replacement.
export const DAILY_BANK_START='2026-11-21';
export const DAILY_BANK_SIZE=25000;
const BANK_MODULUS=362879; // 9! - 1: exclude the solved state
const BANK_STEP=7919; // coprime to BANK_MODULUS
const BANK_OFFSET=104729;
const FACTORIALS=[40320,5040,720,120,24,6,2,1,1];
export function dailyBankIndex(date){
  if(!/^20\d{2}-\d{2}-\d{2}$/.test(date))throw new Error('invalid date');
  const time=Date.parse(date+'T00:00:00Z'),origin=Date.parse(DAILY_BANK_START+'T00:00:00Z');
  if(!Number.isFinite(time)||new Date(time).toISOString().slice(0,10)!==date)throw new Error('invalid date');
  const i=Math.round((time-origin)/86400000);
  if(i<0||i>=DAILY_BANK_SIZE)throw new Error('daily bank exhausted or date out of range');
  return i;
}
export function dailyBoardAt(index){
  if(!Number.isInteger(index)||index<0||index>=DAILY_BANK_SIZE)throw new Error('invalid daily index');
  let rank=1+((BANK_OFFSET+index*BANK_STEP)%BANK_MODULUS);
  const remaining=['1','2','3','4','5','6','7','8','9'];
  let board='';
  for(const f of FACTORIALS){const n=Math.floor(rank/f);rank%=f;board+=remaining.splice(n,1)[0];}
  return board;
}
export function dailyBankPuzzle(date){
  const index=dailyBankIndex(date),offset=index*11,board=DAILY_VERIFIED_ROWS.slice(offset,offset+9),par=Number(DAILY_VERIFIED_ROWS.slice(offset+9,offset+11));
  if(board.length!==9||!Number.isInteger(par)||par<1)throw new Error('daily bank record invalid');
  return {board,par,mode:'daily',key:date,level:0,difficulty:'宗师',bankIndex:index+1,bankSize:DAILY_BANK_SIZE};
}
export function todayCN(now=Date.now()){return new Date(now+8*3600*1000).toISOString().slice(0,10);}
/** 每局提示额度；两端均从规则引擎读取，重开时由界面重置本局已用次数。 */
export function hintLimit(mode='story'){if(mode!=='story'&&mode!=='daily')throw new Error('invalid mode');return mode==='daily'?2:5;}
/** hints 参数保留供旧调用兼容；使用提示不影响得分或荣誉。 */
export function resultScore(moves,seconds,hints=0){return Math.max(0,100-moves)*1000 + (999-Math.min(999,Math.max(0,Math.floor(seconds))));}
export function honor(moves,par,hints=0){if(moves===par)return '最优解 · 解谜宗师';if(moves<=par+2)return '极致推演';if(moves<=par+5)return '逻辑高手';return '破局者';}
/** 最佳成绩只按更少步数、相同步数时更短用时比较；完全相同时保留已有记录。 */
export function isBetterResult(candidate,previous){return !previous||candidate.moves<previous.moves||(candidate.moves===previous.moves&&candidate.seconds<previous.seconds);}
export function parseChallenge(params){const mode=params.get('mode')==='daily'?'daily':'story';const day=params.get('day');const key=mode==='daily' && /^20\d\d-\d\d-\d\d$/.test(day||'')?day:mode==='daily'?todayCN():String(Math.min(18,Math.max(1,parseInt(params.get('level')||'1',10)||1)));const beat=parseInt(params.get('beat')||'',10);return {mode,key,beat:Number.isFinite(beat)&&beat>=0&&beat<=999?beat:null};}
