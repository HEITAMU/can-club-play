// Feedback is anchored to the tapped control, above modals, and never catches input.
export function unlockFeedbackPosition(rect,width,height){return {left:Math.max(16,Math.min(width-16,rect.left+rect.width/2)),top:Math.max(68,Math.min(height-20,rect.top-10))};}
let current=null;
export function showUnlockFeedback(button,message){
 if(!message)return;
 current?.remove();const tip=document.createElement('div');current=tip;
 tip.className='unlock-float';tip.setAttribute('role','status');tip.setAttribute('aria-live','polite');tip.textContent=message;
 const pos=unlockFeedbackPosition(button.getBoundingClientRect(),innerWidth,innerHeight);
 tip.style.left=pos.left+'px';tip.style.top=pos.top+'px';document.body.append(tip);
 const r=tip.getBoundingClientRect();if(r.left<12)tip.style.left=(pos.left+12-r.left)+'px';else if(r.right>innerWidth-12)tip.style.left=(pos.left-(r.right-innerWidth+12))+'px';
 const remove=()=>{tip.remove();if(current===tip)current=null;};tip.addEventListener('animationend',remove,{once:true});setTimeout(remove,1800);
}
