// Each tap refreshes one readable, input-transparent message in the screen center.
let current=null,removeTimer=null;
export function showUnlockFeedback(_button,message){
 if(!message)return;
 current?.remove();clearTimeout(removeTimer);const tip=document.createElement('div');current=tip;
 tip.className='unlock-message';tip.setAttribute('role','status');tip.setAttribute('aria-live','polite');tip.setAttribute('aria-atomic','true');tip.textContent=message;
 document.body.append(tip);
 const remove=()=>{tip.remove();if(current===tip){current=null;clearTimeout(removeTimer);removeTimer=null;}};
 tip.addEventListener('animationend',remove,{once:true});removeTimer=setTimeout(remove,2600);
}
