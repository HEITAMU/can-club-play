// Explicit battle-clock animation works without Web Animations / CSS translate.
export class CombatText {
 constructor(layer){this.layer=layer;this.items=[];}
 clear(){for(const f of this.items)f.el.remove();this.items=[];}
 consume(events,positions,time){
  for(const e of events){const p=positions[e.to];if(!p)continue;
   if((e.type==='hit'||e.type==='burn')&&e.value>0){
    this.spawn((e.crit?'暴击 ':'')+e.value,p.x+(e.serial%3-1)*2,p.y-6,'float-text'+(e.damageType==='magic'?' magic':'')+(e.crit?' crit':''),time);
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
   f.el.style.transform=`translate(-50%, calc(-50% - ${Math.round((1-(1-p)**2)*38)}px))`;
  }
 }
}
