import {damageTextStyle} from './damage-text-style.mjs';
// Explicit battle-clock animation works without Web Animations / CSS translate.
export class CombatText {
 constructor(layer){this.layer=layer;this.items=[];this.anchors={};}
 clear(){for(const f of this.items)f.el.remove();this.items=[];this.anchors={};}
 setAnchors(positions){this.anchors=Object.fromEntries(Object.entries(positions).map(([id,p])=>[id,{...p}]));}
 consume(events,positions,time){
  for(const e of events){const p=this.anchors[e.to]||positions[e.to];if(!p)continue;
   if((e.type==='hit'||e.type==='burn')&&e.value>0){
    // Same target, same origin. Push older close hits upward to keep combos legible.
    for(const f of this.items)if(f.target===e.to&&time-f.born<.24)f.lift=(f.lift||0)+24;
    const style=damageTextStyle(e),el=this.spawn(e.value+style.suffix,p.x,p.y-6,'float-text'+(style.crit?' crit':'')+(style.dot?' dot':''),time);el.style.color=style.color;el.style.fontWeight=String(style.weight);el.style.fontSize=style.size+'px';this.items[this.items.length-1].target=e.to;
    if(style.icon){el.className+=' critical-frame';el.style.color='#171211';el.style.fontWeight='700';el.style.border='6px solid transparent';el.style.borderLeftWidth=el.style.borderRightWidth='12px';el.style.borderImageSource=`url('${style.icon}')`;el.style.borderImageSlice='25% fill';el.style.borderImageRepeat='stretch';el.style.padding='2px';el.style.minWidth='40px';el.style.boxSizing='border-box';el.style.textShadow='none';}
   }
   if(e.type==='heal'&&e.value>2)this.spawn('+'+e.value,p.x,p.y-5,'float-text heal',time);
   if(e.type==='shield'&&e.value>0)this.spawn('护盾 +'+e.value,p.x,p.y-5,'float-text status',time);
   if(e.type==='status'||e.type==='interrupt')this.spawn(e.text,p.x,p.y-5,'float-text status',time);
  }
 }
 spawn(text,x,y,className='float-text',time=0,duration=.95){
  if(this.items.length>=48)this.items.shift().el.remove();
  const el=this.layer.ownerDocument.createElement('div');el.className=className;el.textContent=String(text);
  el.style.left=Math.max(9,Math.min(91,x))+'%';el.style.top=Math.max(12,Math.min(88,y))+'%';
  el.style.opacity='1';el.style.transform='translate(-50%, -50%)';this.layer.appendChild(el);
  this.items.push({el,born:time,duration});return el;
 }
 render(time){
  for(let i=this.items.length-1;i>=0;i--){const f=this.items[i],elapsed=Math.max(0,time-f.born),p=elapsed/f.duration;
   if(p>=1){f.el.remove();this.items.splice(i,1);continue;}
   f.el.style.opacity=String(p<.65?1:(1-p)/.35);
   f.el.style.transform=`translate(-50%, calc(-50% - ${Math.round((1-(1-p)**2)*38+(f.lift||0))}px))`;
  }
 }
}
