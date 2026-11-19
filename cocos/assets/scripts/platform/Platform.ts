import { game, Game, sys } from 'cc';
const root = globalThis as any;
export const isWechat = () => typeof root.wx?.getStorageSync === 'function';
export const storage = {
  getItem(key:string):string|null {
    const value = isWechat() ? root.wx.getStorageSync(key) : sys.localStorage.getItem(key);
    if(value === undefined || value === null || value === '') return null;
    return typeof value === 'string' ? value : JSON.stringify(value);
  },
  setItem(key:string,value:string) {
    if(isWechat())root.wx.setStorageSync(key,value);else sys.localStorage.setItem(key,value);
  },
  removeItem(key:string) {
    if(isWechat())root.wx.removeStorageSync(key);else sys.localStorage.removeItem(key);
  }
};
export const platform = {
  storage,
  onHide(callback:()=>void) { game.on(Game.EVENT_HIDE, callback); return ()=>game.off(Game.EVENT_HIDE,callback); },
  onShow(callback:()=>void) { game.on(Game.EVENT_SHOW, callback); return ()=>game.off(Game.EVENT_SHOW,callback); },
  async clipboard(text:string) {
    if(isWechat()) return new Promise<void>((resolve,reject)=>root.wx.setClipboardData({data:text,success:()=>resolve(),fail:reject}));
    if(root.navigator?.clipboard)return root.navigator.clipboard.writeText(text);
    throw new Error('当前环境暂不支持剪贴板，请手动复制存档文本。');
  },
  async share() {
    const data={title:'罐头远征队',text:'带上五只猫，拿下一条街。',url:root.location?.href};
    if(isWechat()) { root.wx.shareAppMessage({title:data.title});return; }
    if(root.navigator?.share)return root.navigator.share(data);
    return platform.clipboard(data.url || 'https://heitamu.github.io/can-club-play/');
  },
  safeArea() {
    if(isWechat()) {
      const info=root.wx.getWindowInfo?.() || root.wx.getSystemInfoSync();
      return info.safeArea || {top:0,left:0,bottom:info.windowHeight,right:info.windowWidth,width:info.windowWidth,height:info.windowHeight};
    }
    return null;
  }
};
