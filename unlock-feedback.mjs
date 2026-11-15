// Each tap refreshes one readable, input-transparent message in the screen center.
let current=null,removeTimer=null;
export const UNLOCK_MESSAGE_MS=4000;
export function showUnlockFeedback(_button,message){
 if(!message)return;
 current?.remove();clearTimeout(removeTimer);const tip=document.createElement('div');current=tip;
 tip.className='unlock-message';tip.setAttribute('role','status');tip.setAttribute('aria-live','polite');tip.setAttribute('aria-atomic','true');tip.textContent=message.replace(/，并/g,'，\n并');
 document.body.append(tip);
 const remove=()=>{tip.remove();if(current===tip){current=null;clearTimeout(removeTimer);removeTimer=null;}};
 // Readability is a timer, never an animation lifecycle (reduced motion can end in .01ms).
 removeTimer=setTimeout(remove,Math.max(UNLOCK_MESSAGE_MS,Math.min(6500,message.length*100)));
}
