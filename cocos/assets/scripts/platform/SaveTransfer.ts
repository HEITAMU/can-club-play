// File and clipboard integration stays outside the Cocos game and domain layers.
import { platform, isWechat } from './Platform';
const root = globalThis as any;
const limit = 100000;
const checked = (text:string) => { if(text.length>limit)throw new Error('文件过大，请选择本游戏导出的存档。'); return text; };
export async function readClipboard():Promise<string>{
  if(isWechat())return new Promise((resolve,reject)=>root.wx.getClipboardData({success:r=>resolve(checked(r.data||'')),fail:reject}));
  if(root.navigator?.clipboard?.readText)return checked(await root.navigator.clipboard.readText());
  throw new Error('当前环境不支持读取剪贴板，请在文本框内长按粘贴。');
}
export async function exportSaveFile(text:string){
  if(isWechat()){
    const filePath=root.wx.env.USER_DATA_PATH+'/can-club-save.json';
    await new Promise<void>((resolve,reject)=>root.wx.getFileSystemManager().writeFile({filePath,data:text,encoding:'utf8',success:()=>resolve(),fail:reject}));
    if(root.wx.shareFileMessage)return new Promise<void>((resolve,reject)=>root.wx.shareFileMessage({filePath,fileName:'can-club-save.json',success:()=>resolve(),fail:reject}));
    await platform.clipboard(text);return '存档文字已复制，可粘贴保存。';
  }
  const url=root.URL.createObjectURL(new Blob([text],{type:'application/json'})),link=root.document.createElement('a');
  link.href=url;link.download='can-club-save.json';root.document.body.appendChild(link);link.click();link.remove();root.setTimeout(()=>root.URL.revokeObjectURL(url),1000);
}
export async function importSaveFile():Promise<string>{
  if(isWechat())return new Promise((resolve,reject)=>root.wx.chooseMessageFile({count:1,type:'file',extension:['json'],success:r=>{
    const file=r.tempFiles[0];if(!file)return resolve('');if(file.size>limit)return reject(new Error('文件过大，请选择本游戏导出的存档。'));
    root.wx.getFileSystemManager().readFile({filePath:file.path,encoding:'utf8',success:v=>resolve(checked(v.data)),fail:reject});
  },fail:e=>String(e.errMsg||'').includes('cancel')?resolve(''):reject(e)}));
  return new Promise((resolve,reject)=>{
    const input=root.document.createElement('input');input.type='file';input.accept='.json,application/json';input.style.display='none';root.document.body.appendChild(input);
    input.addEventListener('cancel',()=>{input.remove();resolve('');},{once:true});
    input.addEventListener('change',async()=>{try{const file=input.files?.[0];if(!file){resolve('');return;}if(file.size>limit)throw new Error('文件过大，请选择本游戏导出的存档。');resolve(checked(await file.text()));}catch(e){reject(e);}finally{input.remove();}},{once:true});input.click();
  });
}
