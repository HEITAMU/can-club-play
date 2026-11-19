import { storage } from './Platform';
import { createConfiguredRewardedService } from './Rewarded';
import { decodeSave } from '../domain/core';
import { GROWTH_SAVE_KEY } from '../domain/growth-curve';
export const SAVE_KEY=GROWTH_SAVE_KEY;
export function createSessionServices() {
  const rewarded = createConfiguredRewardedService();
  const key=SAVE_KEY,backup=key+'-backup';
  return {
    load:()=>storage.getItem(key),
    loadBackup:()=>storage.getItem(backup),
    save:(encoded:string)=>{
      const previous=storage.getItem(key);
      if(previous) { try { decodeSave(previous);storage.setItem(backup,previous); } catch {} }
      storage.setItem(key,encoded);
    },
    clear:()=>{storage.removeItem(key);storage.removeItem(backup);},
    now:()=>Date.now(),
    reward:(_placement:'tokens'|'business')=>rewarded.watch(),
    rewarded,
    dispose:()=>rewarded.dispose()
  };
}
