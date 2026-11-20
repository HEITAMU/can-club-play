// @ts-nocheck
/** Cocos Creator 3.8.8 主域入口：全部节点使用原生 Cocos UI / Graphics，不依赖 WebView。 */
import {_decorator,Component,Node,Canvas,Camera,Layers,UITransform,Label,Graphics,Color,view,ResolutionPolicy,director,SubContextView,tween,Vec3} from 'cc';
import {GOAL,makePuzzle,todayCN,rotate,isSolved,shortestPath,honor,resultScore} from './Core';
const {ccclass}=_decorator;
const AD_IDS={rewarded:'',banner:''}; // 微信公众平台创建广告位后填写真实 adUnitId
const C={background:'#0C162A',surface:'#19263F',surface2:'#243653',gold:'#DFC18A',gold2:'#A78255',white:'#F4F1EB',muted:'#96A9C2',dark:'#0C1425',green:'#8BDFC2'};
function ink(hex:string){const c=new Color();Color.fromHEX(c,hex);return c;}
const at=()=>typeof performance!=='undefined'&&performance.now?performance.now():Date.now();
const wxSDK=()=>typeof wx!=='undefined'?(wx as any):null;
const KEY='FF_DAILY_V1';
const NAMES=['星图初醒','看似简单','交错轨道','一念之差','不对称','失序之环','倒影之谜','四角对峙','镜像迷宫','群星换位','王冠密码','无声棋局','深空共振','星环审判','暗夜回响','隐秘秩序','星渊终章','逻辑之冠'];
const SIGILS=['✦','◈','✣','❖','☼','✶','✧','✤','✺'];
@ccclass('FourfoldGame')
export class FourfoldGame extends Component {
  private canvasNode:Node;private root:Node;private cam:Camera;private width=390;private height=844;private safeTop=0;
  private inHome=true;private mode='story';private key='1';private puzzle:any;private board=GOAL;private direction=1;private moves=0;private hints=0;private elapsed=0;private startAt=0;private won=false;private modal='';private clockLabel:Label|null=null;
  private rewardAd:any=null;private banner:any=null;private toastSerial=0;
  onLoad(){
    // 固定设计坐标并使用 SHOW_ALL：小屏统一缩放，确保按钮不被挤到屏外。
    this.height=844;
    view.setDesignResolutionSize(this.width,this.height,ResolutionPolicy.SHOW_ALL);
    const sdk=wxSDK();if(sdk){
      try{const info=sdk.getWindowInfo?.()||sdk.getSystemInfoSync?.(),scale=this.width/Math.max(1,info.windowWidth||this.width);const cap=sdk.getMenuButtonBoundingClientRect?.();this.safeTop=Math.min(64,Math.max(0,(cap?.bottom||0)*scale-18));}catch{}
      try{sdk.showShareMenu?.({withShareTicket:false});}catch{}
    }
    const scene=director.getScene();
    this.canvasNode=new Node('Canvas');scene.addChild(this.canvasNode);this.canvasNode.layer=Layers.Enum.UI_2D;
    this.canvasNode.addComponent(UITransform).setContentSize(this.width,this.height);
    const canvas=this.canvasNode.addComponent(Canvas);
    const cameraNode=new Node('UICamera');this.canvasNode.addChild(cameraNode);cameraNode.layer=Layers.Enum.UI_2D;cameraNode.setPosition(0,0,1000);
    this.cam=cameraNode.addComponent(Camera);this.cam.projection=Camera.ProjectionType.ORTHO;this.cam.clearFlags=Camera.ClearFlag.SOLID_COLOR;this.cam.clearColor=ink(C.background);this.cam.near=.1;this.cam.far=2000;this.cam.visibility=Layers.Enum.UI_2D;this.cam.orthoHeight=this.height/2;canvas.cameraComponent=this.cam;
    this.canvasNode.setPosition(this.width/2,this.height/2);
    this.root=new Node('UIRoot');this.root.layer=Layers.Enum.UI_2D;this.root.addComponent(UITransform).setContentSize(this.width,this.height);this.canvasNode.addChild(this.root);this.root.setPosition(-this.width/2,this.height/2);
    const launch=sdk?.getLaunchOptionsSync?.()||{};const q=launch.query||{};
    if(q.mode==='daily'&&/^20\d\d-\d\d-\d\d$/.test(q.day||'')){this.inHome=false;this.startGame('daily',q.day);}else this.startGame('story',String(this.storeRead('unlocked',1)));
    this.schedule(()=>this.updateClock(),.2);
  }
  private storageKey(){return `${this.mode}:${this.key}`;}
  private storeRead(key:string,otherwise:any){try{const sdk=wxSDK();const value=sdk?sdk.getStorageSync('fourfold:'+key):localStorage.getItem('fourfold:'+key);return value?JSON.parse(value):otherwise;}catch{return otherwise;}}
  private storeWrite(key:string,val:any){try{const sdk=wxSDK();if(sdk)sdk.setStorageSync('fourfold:'+key,JSON.stringify(val));else localStorage.setItem('fourfold:'+key,JSON.stringify(val));}catch{}}
  private startGame(mode:string,key:string){this.mode=mode;this.key=key;this.puzzle=makePuzzle(mode,key);this.board=this.puzzle.board;this.direction=1;this.moves=0;this.hints=0;this.startAt=0;this.elapsed=0;this.won=false;this.modal='';this.hideBanner();this.draw();}
  private updateClock(){if(this.startAt&&!this.won)this.elapsed=(at()-this.startAt)/1000;if(this.clockLabel)this.clockLabel.string=`${String(Math.floor(this.elapsed/60)).padStart(2,'0')}:${String(Math.floor(this.elapsed%60)).padStart(2,'0')}`;}
  private clear(){this.clockLabel=null;for(const n of [...this.root.children])n.destroy();}
  private node(name:string,x:number,y:number,w:number,h:number,parent:Node=this.root){const n=new Node(name);n.layer=Layers.Enum.UI_2D;parent.addChild(n);n.addComponent(UITransform).setContentSize(w,h);n.setPosition(x+w/2,-y-h/2);return n;}
  private shape(x:number,y:number,w:number,h:number,fill:string,stroke='',radius=10,parent:Node=this.root){
    const n=this.node('Panel',x,y,w,h,parent),g=n.addComponent(Graphics);g.clear();g.fillColor=ink(fill);if(stroke){g.strokeColor=ink(stroke);g.lineWidth=1.2;}
    g.roundRect(-w/2,-h/2,w,h,radius);g.fill();if(stroke)g.stroke();return n;
  }
  private ring(x:number,y:number,r:number,color:string,parent:Node=this.root){const n=this.node('Halo',x-r,y-r,r*2,r*2,parent),g=n.addComponent(Graphics);g.strokeColor=ink(color);g.lineWidth=2;g.circle(0,0,r);g.stroke();return n;}
  private txt(value:string,x:number,y:number,w:number,h:number,size=14,color=C.white,bold=false,parent:Node=this.root){
    const n=this.node('Text',x,y,w,h,parent),l=n.addComponent(Label);l.string=value;l.color=ink(color);l.fontSize=size;l.lineHeight=Math.max(size*1.35,16);l.horizontalAlign=Label.HorizontalAlign.CENTER;l.verticalAlign=Label.VerticalAlign.CENTER;l.overflow=Label.Overflow.SHRINK;l.isBold=bold;return l;
  }
  private btn(value:string,x:number,y:number,w:number,h:number,action:()=>void,primary=false,size=13){
    const n=this.shape(x,y,w,h,primary?C.gold:C.surface2,primary?C.gold2:'#556B87',11);this.txt(value,x+2,y+1,w-4,h-2,size,primary?C.dark:C.white,true);
    n.on(Node.EventType.TOUCH_END,()=>{action();});return n;
  }
  private draw(){
    if(this.inHome){this.drawHome();return;}
    this.clear();const w=this.width,h=this.height,T=this.safeTop>0?Math.min(30,this.safeTop):0;
    this.shape(0,0,w,h,C.background,'',0);
    this.ring(w/2,-105,320,'#263C5A');this.ring(w/2,-105,280,'#172C4B');
    this.shape(22,20+T,44,44,C.gold,C.gold2,12);this.txt('✦',25,21+T,38,42,27,C.dark,true);
    this.txt('FOURFOLD',75,23+T,161,21,14,C.gold,true);this.txt('四格诡局 · 星图修复局',75,45+T,185,14,10,C.muted);
    this.btn('♛ 榜',302,25+T,65,37,()=>this.showRank(),false,13);

    this.btn('‹',20,89+T,38,38,()=>{this.inHome=true;this.draw();},false,22);
    this.btn('✦ 闯关档案',20,135+T,169,39,()=>this.startGame('story',String(this.storeRead('unlocked',1))),this.mode==='story',13);
    this.btn('◈ 每日同题',200,135+T,170,39,()=>this.startGame('daily',todayCN()),this.mode==='daily',13);
    const y=180+T,cardH=h-y-100;
    this.shape(16,y,w-32,cardH,C.surface,'#60708B',18);
    this.txt(this.mode==='story'?`ARCHIVE ${String(this.key).padStart(2,'0')} / 18`:`DAILY · ${this.key}`,30,y+12,170,20,11,C.muted);
    this.txt(this.mode==='story'?NAMES[Math.max(0,Number(this.key)-1)]:'今日脑力审判',28,y+34,205,27,18,C.white,true);
    this.txt(this.puzzle.difficulty,280,y+28,70,26,12,C.gold,true);
    this.shape(31,y+72,w-62,64,C.dark,'#3E506A',10);
    const ms=[['当前步数',String(this.moves).padStart(2,'0')],['理论最优',String(this.puzzle.par).padStart(2,'0')],['本局用时','00:00']];
    ms.forEach((v,i)=>{const x=33+i*(w-66)/3,sz=(w-66)/3;this.txt(v[0],x,y+78,sz,19,10,C.muted);const l=this.txt(v[1],x,y+96,sz,31,24,C.gold,true);if(i===2){this.clockLabel=l;this.updateClock();}});
    this.txt('✦',32,y+140,w-64,19,12,C.gold);
    const size=Math.min(w-62,Math.min(260,cardH-250));
    const bx=(w-size)/2,by=y+156;
    this.shape(bx-6,by-6,size+12,size+12,C.dark,C.gold2,13);
    const unit=size/3;
    for(let i=0;i<9;i++){
      const x=bx+(i%3)*unit,yy=by+Math.floor(i/3)*unit,tok=Number(this.board[i]);
      const v=this.shape(x+2,yy+2,unit-4,unit-4,(tok%2)?'#314767':'#293B58','#718397',5);
      this.ring(x+unit/2,yy+unit/2,Math.max(15,unit*.32),'#9B7F55');
      this.txt(SIGILS[tok-1],x+unit*.2,yy+unit*.15,unit*.6,unit*.6,29,C.gold,true);
      this.txt(String(tok),x+unit*.66,yy+unit*.68,unit*.28,unit*.24,14,C.white,true);
      tween(v).to(.14,{scale:new Vec3(1.015,1.015,1)}).to(.16,{scale:new Vec3(1,1,1)}).start();
    }
    for(let q=0;q<4;q++){
      const sx=bx+(q%2+1)*unit,sy=by+(Math.floor(q/2)+1)*unit,r=22;
      this.shape(sx-r,sy-r,r*2,r*2,C.gold,'#FFF0C9',22);
      this.txt(this.direction===1?'↻':'↺',sx-r,sy-r,r*2,r*2,25,C.dark,true);
      const hit=this.node('Rotate '+q,sx-r,sy-r,2*r,2*r);hit.on(Node.EventType.TOUCH_END,()=>this.spin(q));
    }
    const iy=by+size+12;
    this.txt(this.won?'✦ 完成':this.hints?'✧ 已使用提示':'',20,iy,w-40,20,10,this.won?C.green:C.muted);
    const ctrlY=iy+28;
    this.btn('↻ 顺时针',26,ctrlY,(w-62)/2,38,()=>{this.direction=1;this.draw();},this.direction===1,13);
    this.btn('↺ 逆时针',36+(w-62)/2,ctrlY,(w-62)/2,38,()=>{this.direction=-1;this.draw();},this.direction===-1,13);
    const toolY=ctrlY+45;
    this.btn('↺ 重开',26,toolY,(w-62)/2,37,()=>this.startGame(this.mode,this.key),false,12);
    this.btn('✧ 提示',36+(w-62)/2,toolY,(w-62)/2,37,()=>this.askHint(),false,12);
    const bottomY=h-84;
    this.btn('✦ 发起好友挑战',21,bottomY,214,50,()=>this.share(),true,14);
    this.btn(this.won?'下一关 →':'锁定下一关',245,bottomY,124,50,()=>this.nextLevel(),false,12);
    // 真正的 Banner 由微信 SDK 在结算界面管理；不伪造广告曝光。
    if(this.modal)this.drawModal();
  }
  private drawHome(){
    this.clear();const w=this.width,h=this.height;
    this.shape(0,0,w,h,C.background,'',0);
    this.ring(w/2,h*.38,144,'#5E7290');this.ring(w/2,h*.38,113,C.gold2);this.ring(w/2,h*.38,83,'#3B5575');
    this.txt('✦',w/2-90,h*.38-110,180,190,112,C.gold,true);
    this.txt('四格诡局',30,h*.52,w-60,62,39,C.white,true);
    this.txt('F O U R F O L D',30,h*.52+64,w-60,24,14,C.gold);
    this.txt('♛  '+String(this.storeRead('unlocked',1)).padStart(2,'0')+' / 18',80,h*.52+99,w-160,30,18,C.gold,true);
    this.btn('✦ 进入星图',43,h*.69,w-86,54,()=>{this.inHome=false;this.startGame('story',String(this.storeRead('unlocked',1)));},true,17);
    this.btn('◈ 每日挑战',43,h*.69+66,w-86,51,()=>{this.inHome=false;this.startGame('daily',todayCN());},false,16);
    this.btn('♛ 好友荣誉榜',43,h*.69+129,w-86,51,()=>{this.inHome=false;this.showRank();},false,16);
  }
  private spin(q:number){if(this.won||this.modal)return;if(!this.startAt)this.startAt=at();this.board=rotate(this.board,q,this.direction);this.moves++;if(isSolved(this.board)){this.won=true;this.elapsed=(at()-this.startAt)/1000;this.complete();}this.draw();}
  private complete(){
    const result={moves:this.moves,par:this.puzzle.par,seconds:Math.floor(this.elapsed),hints:this.hints,score:resultScore(this.moves,this.elapsed,this.hints),day:this.key};
    const prev=this.storeRead('best:'+this.storageKey(),null);
    if(!prev||(this.hints===0&&prev.hints>0)||(this.hints===prev.hints&&(this.moves<prev.moves||(this.moves===prev.moves&&result.seconds<prev.seconds))))this.storeWrite('best:'+this.storageKey(),result);
    if(this.mode==='story')this.storeWrite('unlocked',Math.max(this.storeRead('unlocked',1),Math.min(18,Number(this.key)+1)));
    if(this.mode==='daily'&&this.key===todayCN()&&this.hints===0)this.uploadScore(result);
    this.modal='result';this.showBanner();
    const sdk=wxSDK();sdk?.vibrateShort?.({type:'light'});
  }
  private uploadScore(result:any){const sdk=wxSDK();if(!sdk?.setUserCloudStorage)return;
    const value=[todayCN(),String(result.score),String(result.moves),String(result.seconds)].join('|');
    try{sdk.setUserCloudStorage({KVDataList:[{key:KEY,value}],fail:(e:any)=>console.warn('ranking cloud sync unavailable',e)});}catch(e){console.warn('ranking cloud sync failed',e);}
  }
  private nextLevel(){if(!this.won){this.toast('先完成本局，再解锁后续关卡');return;}if(this.mode==='daily')this.startGame('story',String(this.storeRead('unlocked',1)));else if(Number(this.key)<18)this.startGame('story',String(Number(this.key)+1));else this.startGame('daily',todayCN());}
  private applyHint(){if(this.won)return;const path=shortestPath(this.board);if(!path.length)return;this.hints++;this.direction=path[0].dir;this.draw();this.toast(`提示：请点第 ${path[0].q+1} 个旋转点（从左上到右下）`);}
  private askHint(){if(this.won)return;const sdk=wxSDK();if(!sdk||!AD_IDS.rewarded){this.applyHint();this.toast('未配置真实广告位：测试模式免费提示，本局不参与排名');return;}
    try{
      if(!this.rewardAd){this.rewardAd=sdk.createRewardedVideoAd({adUnitId:AD_IDS.rewarded});this.rewardAd.onClose((res:any)=>{if(res?.isEnded===true)this.applyHint();else this.toast('未观看完整广告，未消耗提示机会');});this.rewardAd.onError((err:any)=>{console.warn(err);this.toast('广告加载失败，可以继续不看提示地挑战');});}
      this.rewardAd.show().catch(()=>this.rewardAd.load().then(()=>this.rewardAd.show()).catch(()=>this.toast('广告暂不可用')));
    }catch{this.toast('广告接口不可用，暂不能使用奖励提示');}
  }
  private showBanner(){const sdk=wxSDK();if(!sdk||!AD_IDS.banner)return;try{
    const info=sdk.getWindowInfo?.()||sdk.getSystemInfoSync?.();const width=Math.min(info.windowWidth||320,320);
    this.banner=sdk.createBannerAd({adUnitId:AD_IDS.banner,style:{left:((info.windowWidth||width)-width)/2,top:(info.windowHeight||this.height)-115,width}});
    this.banner.onError?.((e:any)=>console.warn('banner unavailable',e));this.banner.show?.().catch(()=>{});
  }catch(e){console.warn(e);}}
  private hideBanner(){if(!this.banner)return;try{this.banner.hide?.();this.banner.destroy?.();}catch{}this.banner=null;}
  private share(){const sdk=wxSDK();if(!sdk){this.toast('网页体验请使用试玩版链接分享；微信内可直接发送挑战卡片');return;}
    const day=this.mode==='daily'?this.key:todayCN();const query=`mode=daily&day=${encodeURIComponent(day)}${this.won&&!this.hints&&this.mode==='daily'?`&beat=${this.moves}`:''}`;
    try{sdk.shareAppMessage({title:this.won&&!this.hints?`我用了 ${this.moves} 步复原星图，你呢？`:'四格诡局｜来挑战今天的同一道星图',query});}catch{this.toast('当前微信环境不支持分享');}
  }
  private showRank(){this.modal='rank';this.hideBanner();this.draw();const sdk=wxSDK();if(sdk?.getOpenDataContext){try{sdk.getOpenDataContext().postMessage({type:'fourfold-rank',day:todayCN(),key:KEY});}catch(e){console.warn('rank context unavailable',e);}}}
  private drawModal(){
    const w=this.width,h=this.height;
    const shade=this.shape(0,0,w,h,'#0B1426','',0);shade.on(Node.EventType.TOUCH_END,()=>{this.modal='';this.draw();});
    const top=Math.max(110,(h-455)/2),height=455;this.shape(24,top,w-48,height,C.surface2,C.gold2,19);
    this.btn('×',w-69,top+14,35,35,()=>{this.modal='';this.draw();},false,19);
    if(this.modal==='result'){
      this.txt(this.moves===this.puzzle.par&&!this.hints?'♛':'✦',50,top+28,w-100,90,65,C.gold,true);
      this.txt('CHALLENGE COMPLETE',40,top+126,w-80,20,12,C.gold);
      this.txt(honor(this.moves,this.puzzle.par,this.hints),40,top+156,w-80,38,23,C.white,true);
      this.txt(`${this.moves} 步 · 最优 ${this.puzzle.par} 步 · ${Math.floor(this.elapsed)} 秒`,38,top+210,w-76,26,16,C.gold,true);
      this.txt(this.hints?'使用过提示：本局成绩不入好友榜':'你的最佳成绩已记录。',38,top+243,w-76,29,12,C.muted);
      this.btn(this.mode==='daily'?'回去闯关':'挑战下一关',43,top+298,w-86,52,()=>this.nextLevel(),true,16);
      this.btn('分享此题给好友',43,top+367,w-86,40,()=>this.share(),false,13);
    } else {
      this.txt('♛ 好友同题榜',39,top+30,w-78,45,25,C.gold,true);
      this.txt(`今天 ${todayCN()} · 好友成绩`,39,top+77,w-78,23,13,C.muted);
      const best=this.storeRead('best:daily:'+todayCN(),null);
      this.txt(best?`我的成绩 ${best.moves} 步 · ${best.seconds} 秒`:'我今天还没有通关记录',45,top+114,w-90,34,13,C.white);
      const sdk=wxSDK();
      if(sdk?.getOpenDataContext){
        try{const n=this.node('OpenDataRank',42,top+158,w-84,190);n.addComponent(SubContextView);}catch(e){this.txt('好友排行初始化失败，请检查开放数据域',44,top+198,w-88,40,12,C.muted);}
      }else this.txt('真实微信好友榜仅在微信小游戏内展示\n浏览器试玩不展示虚构好友',44,top+208,w-88,70,14,C.muted);
      this.btn('挑战今日同题',44,top+368,w-88,47,()=>this.startGame('daily',todayCN()),true,15);
    }
  }
  private toast(message:string){const serial=++this.toastSerial;const n=this.shape(31,this.height-167,this.width-62,48,C.gold,C.gold2,15);this.txt(message,36,this.height-163,this.width-72,42,11,C.dark,true);this.scheduleOnce(()=>{if(serial===this.toastSerial)this.draw();},2.3);}
  onDestroy(){this.hideBanner();try{this.rewardAd?.destroy?.();}catch{}}
}
