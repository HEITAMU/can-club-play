export const SIZE=1000,RADIUS=310,MAX_PULL=225,GAIN=1.7,CATCH_RADIUS=43;
export function clampPull(delta){const length=Math.hypot(delta.x,delta.y),scale=length>MAX_PULL?MAX_PULL/length:1;return {x:delta.x*scale,y:delta.y*scale};}
export function influence(point,anchor){const d=Math.hypot(point.x-anchor.x,point.y-anchor.y);return Math.exp(-(d*d)/(RADIUS*RADIUS));}
export function projectedStar(star,anchor,delta){const pull=clampPull(delta),weight=influence(star,anchor),dx=pull.x*weight,dy=pull.y*weight;return {weight,from:{x:star.x+dx,y:star.y+dy},to:{x:Math.max(48,Math.min(952,star.x-GAIN*dx)),y:Math.max(48,Math.min(952,star.y-GAIN*dy))}};}
export function segmentHit(a,b,center,radius=CATCH_RADIUS){const dx=b.x-a.x,dy=b.y-a.y,ox=a.x-center.x,oy=a.y-center.y,A=dx*dx+dy*dy,C=ox*ox+oy*oy-radius*radius;if(C<=0)return 0;if(A<1e-8)return null;const B=2*(ox*dx+oy*dy),D=B*B-4*A*C;if(D<0)return null;const t=(-B-Math.sqrt(D))/(2*A);return t>=0&&t<=1?t:null;}
export function releasePlan(stars,targets,anchor,delta){
 const pull=clampPull(delta);if(Math.hypot(pull.x,pull.y)<10)return null;
 const plans=stars.map((star,index)=>({index,base:{x:star.x,y:star.y},...projectedStar(star,anchor,pull),target:null,wasCaught:star.caught}));
 const occupied=new Set(stars.filter(s=>s.caught).map(s=>s.target)),events=[];
 for(const p of plans)if(!p.wasCaught&&p.weight>.055)for(let j=0;j<targets.length;j++){if(occupied.has(j))continue;const t=segmentHit(p.base,p.to,targets[j]);if(t!==null)events.push({t,star:p.index,target:j});}
 events.sort((a,b)=>a.t-b.t||a.star-b.star||a.target-b.target);
 const assigned=new Set();for(const event of events)if(!assigned.has(event.star)&&!occupied.has(event.target)){assigned.add(event.star);occupied.add(event.target);plans[event.star].target=event.target;plans[event.star].to={...targets[event.target]};}
 return {pull,plans,stars:stars.map((star,i)=>star.caught?{...star}:plans[i].weight<=.055?{...star}:{x:plans[i].to.x,y:plans[i].to.y,caught:plans[i].target!==null,target:plans[i].target}),caught:assigned.size};
}
const definitions=[
 {name:'轻轻一拉',points:[[500,650]],anchor:{x:500,y:650},pull:{x:0,y:180},message:'按住亮圈往下拉，松手把星星弹上去。'},
 {name:'两颗一起',points:[[385,635],[615,635]],anchor:{x:500,y:660},pull:{x:0,y:205},message:'拉住两颗星之间，一起送回星座。'},
 {name:'拽起一片星空',points:[[300,590],[480,700],[650,610]],anchor:{x:460,y:660},pull:{x:-130,y:165},message:'换个落手位置，看看能带起几颗星。'}
];
export const LEVELS=Object.freeze(definitions.map(d=>{const stars=d.points.map(([x,y])=>({x,y,caught:false,target:null})),targets=stars.map(s=>projectedStar(s,d.anchor,d.pull).to);return Object.freeze({...d,stars,targets});}));
export function initialStars(level){return level.stars.map(s=>({...s}));}
