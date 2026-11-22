// Separate media channel: music preference never changes the sound-effects flag.
export const MUSIC_FILE=new URL('./assets/audio/starlight-groove-v2.mp3',import.meta.url).href;
export function createBackgroundMusic({enabled=true,createElement=()=>{const element=new Audio();element.hidden=true;element.setAttribute("aria-hidden","true");document.body.append(element);return element;},isVisible=()=>true}={}){
  let player=null,disposed=false,activated=false,epoch=0;
  const allowed=()=>enabled&&activated&&!disposed&&isVisible();
  function pause(){epoch++;try{player?.pause();}catch{}}
  async function resume({gesture=false}={}){
    if(gesture)activated=true;
    if(!allowed())return false;
    try{
      if(!player){player=createElement();player.src=MUSIC_FILE;player.preload='none';player.loop=true;player.volume=1;}
      if(!player.paused)return true;
      const ticket=++epoch;
      // Call play synchronously within the gesture, without waiting for loading.
      await player.play();
      if(ticket!==epoch||!allowed()){if(!allowed())player.pause();return false;}
      return true;
    }catch{return false;} // A later real gesture retries failed media playback.
  }
  function setEnabled(value){enabled=!!value;if(!enabled)pause();return enabled;}
  function dispose(){disposed=true;pause();try{player?.removeAttribute('src');player?.load();player?.remove?.();}catch{}player=null;}
  return {resume,pause,setEnabled,dispose};
}
