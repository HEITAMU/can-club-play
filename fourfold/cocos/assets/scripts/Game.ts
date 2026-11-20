// @ts-nocheck
/** Cocos Creator 3.8.8 主域：已确认原画拆分为 Sprite，操作、棋盘和数值仍为原生节点。 */
import {
  _decorator,Component,Node,Canvas,Camera,Layers,UITransform,Label,LabelOutline,
  Graphics,Color,view,ResolutionPolicy,director,SubContextView,tween,Tween,Vec3,
  Sprite,SpriteFrame,Texture2D,ImageAsset,JsonAsset,Rect,Size,resources,BlockInputEvents,
} from 'cc';
import {GOAL,SQUARES,makePuzzle,todayCN,rotate,isSolved,shortestPath,honor,resultScore} from './Core';
const {ccclass}=_decorator;
const AD_IDS={rewarded:'',banner:''}; // 接入时只填写微信公众平台提供的真实 adUnitId。
const C={background:'#F8DEB7',surface:'#FFF1D6',gold:'#F5CB79',gold2:'#C88B4D',white:'#FFF4D7',muted:'#977253',dark:'#5B301F',edge:'#825037',night:'#1B2345',shadow:'#B27C50'};
const ART_PATHS={home:'art/home-scene',mural:'art/celestial-mural',atlas:'art/ui-atlas',daily:'art/daily-banner'};
const REQUIRED_FRAMES=['goldButton','creamButton','lavenderButton','stepsCard','timeCard','rotateKnob','settingsButton','backButton'];
const at=()=>typeof performance!=='undefined'&&performance.now?performance.now():Date.now();
const wxSDK=()=>typeof wx!=='undefined'?(wx as any):null;
const KEY='FF_DAILY_V1';
function ink(hex:string){const c=new Color();Color.fromHEX(c,hex);return c;}
function clock(seconds:number){return `${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(Math.floor(seconds%60)).padStart(2,'0')}`;}

@ccclass('FourfoldGame')
export class FourfoldGame extends Component {
  private canvasNode:Node;private root:Node;private cam:Camera;private width=390;private height=844;
  private safeTop=0;private safeBottom=0;private inHome=true;private mode='story';private key='1';private puzzle:any;
  private board=GOAL;private direction=1;private moves=0;private hints=0;private elapsed=0;private startAt=0;private won=false;private modal='';private busy=false;
  private clockLabel:Label|null=null;private rewardAd:any=null;private banner:any=null;private toastNode:Node|null=null;
  private assetsReady=false;private loading=false;private loadError='';private loadProgress=0;private loadSerial=0;
  private textures:Record<string,Texture2D>={};private frames:Record<string,SpriteFrame>={};private images:ImageAsset[]=[];private manifest:any=null;
  private tileNodes:Node[]=[];private boardLayout={x:0,y:0,size:0,unit:0};private launchQuery:any={};

  onLoad(){
    view.setDesignResolutionSize(this.width,this.height,ResolutionPolicy.SHOW_ALL);
    const sdk=wxSDK();
    if(sdk){
      try{
        const info=sdk.getWindowInfo?.()||sdk.getSystemInfoSync?.()||{};
        const ww=Number(info.windowWidth)||this.width,wh=Number(info.windowHeight)||this.height;
        const scale=Math.min(ww/this.width,wh/this.height),letterbox=(wh-this.height*scale)/2;
        const cap=sdk.getMenuButtonBoundingClientRect?.();
        this.safeTop=Math.min(90,Math.max(0,((cap?.bottom||info.safeArea?.top||0)+6-letterbox)/scale));
        this.safeBottom=Math.min(42,Math.max(0,(wh-(info.safeArea?.bottom||wh)-letterbox)/scale));
        this.launchQuery=(sdk.getLaunchOptionsSync?.()||{}).query||{};
        sdk.showShareMenu?.({withShareTicket:false});
      }catch(e){console.warn('window safe area unavailable',e);}
    }
    const scene=director.getScene();
    this.canvasNode=new Node('Canvas');scene.addChild(this.canvasNode);this.canvasNode.layer=Layers.Enum.UI_2D;
    this.canvasNode.addComponent(UITransform).setContentSize(this.width,this.height);
    const canvas=this.canvasNode.addComponent(Canvas);
    const cameraNode=new Node('UICamera');this.canvasNode.addChild(cameraNode);cameraNode.layer=Layers.Enum.UI_2D;cameraNode.setPosition(0,0,1000);
    this.cam=cameraNode.addComponent(Camera);this.cam.projection=Camera.ProjectionType.ORTHO;this.cam.clearFlags=Camera.ClearFlag.SOLID_COLOR;
    this.cam.clearColor=ink(C.background);this.cam.near=.1;this.cam.far=2000;this.cam.visibility=Layers.Enum.UI_2D;this.cam.orthoHeight=this.height/2;canvas.cameraComponent=this.cam;
    this.canvasNode.setPosition(this.width/2,this.height/2);
    this.root=new Node('UIRoot');this.root.layer=Layers.Enum.UI_2D;this.root.addComponent(UITransform).setContentSize(this.width,this.height);
    this.canvasNode.addChild(this.root);this.root.setPosition(-this.width/2,this.height/2);
    this.schedule(()=>this.updateClock(),.2);
    this.loadArt();
  }

  private storageKey(){return `${this.mode}:${this.key}`;}
  private storeRead(key:string,otherwise:any){try{const sdk=wxSDK();const value=sdk?sdk.getStorageSync('fourfold:'+key):localStorage.getItem('fourfold:'+key);return value?JSON.parse(value):otherwise;}catch{return otherwise;}}
  private storeWrite(key:string,val:any){try{const sdk=wxSDK();if(sdk)sdk.setStorageSync('fourfold:'+key,JSON.stringify(val));else localStorage.setItem('fourfold:'+key,JSON.stringify(val));}catch{}}
  private unlocked(){return Math.min(18,Math.max(1,Number(this.storeRead('unlocked',1))||1));}
  private loadResource(path:string,type:any){return new Promise<any>((resolve,reject)=>resources.load(path,type,(err,asset)=>err?reject(err):resolve(asset)));}
  private async loadArt(){
    if(this.loading)return;
    const serial=++this.loadSerial;this.loading=true;this.loadError='';this.assetsReady=false;this.loadProgress=0;this.draw();
    try{
      const manifestAsset=await this.loadResource('art/assetManifest',JsonAsset);
      if(serial!==this.loadSerial)return;
      this.manifest=manifestAsset.json;
      const rects=this.manifest?.atlas?.frames;
      if(!rects||REQUIRED_FRAMES.some(name=>!rects[name]))throw new Error('美术清单缺少必要组件');
      this.disposeArt();
      const names=Object.keys(ART_PATHS);
      // 逐张入库；重试和销毁能准确释放本次已经装入的资源。
      for(const name of names){
        const source=await this.loadResource(ART_PATHS[name],ImageAsset);
        if(serial!==this.loadSerial)return;
        source.addRef();this.images.push(source);
        const texture=new Texture2D();texture.image=source;this.textures[name]=texture;
        this.frames[name]=this.makeFrame(texture,0,0,texture.width,texture.height);
        this.loadProgress++;this.draw();
      }
      const atlas=this.textures.atlas;
      for(const name of Object.keys(rects)){
        const r=rects[name];
        if(![r.x,r.y,r.w,r.h].every(Number.isFinite)||r.x<0||r.y<0||r.w<=0||r.h<=0||r.x+r.w>atlas.width||r.y+r.h>atlas.height)throw new Error(`组件裁切范围错误: ${name}`);
        this.frames[name]=this.makeFrame(atlas,r.x,r.y,r.w,r.h);
      }
      const bannerRect=this.manifest.images?.dailyBanner?.frame;
      if(bannerRect){
        const t=this.textures.daily,r=bannerRect;
        if(![r.x,r.y,r.w,r.h].every(Number.isFinite)||r.x<0||r.y<0||r.w<=0||r.h<=0||r.x+r.w>t.width||r.y+r.h>t.height)throw new Error('每日横幅裁切范围错误');
        this.frames.daily.destroy();this.frames.daily=this.makeFrame(t,r.x,r.y,r.w,r.h);
      }
      const mural=this.textures.mural;
      if(mural.width!==mural.height)throw new Error('星图原画必须是正方形');
      for(let i=0;i<9;i++){
        const x0=Math.round(i%3*mural.width/3),y0=Math.round(Math.floor(i/3)*mural.height/3);
        const x1=Math.round((i%3+1)*mural.width/3),y1=Math.round((Math.floor(i/3)+1)*mural.height/3);
        this.frames['tile'+(i+1)]=this.makeFrame(mural,x0,y0,x1-x0,y1-y0);
      }
      this.assetsReady=true;this.loading=false;
      if(!this.puzzle){
        const q=this.launchQuery;
        if(q.mode==='daily'&&/^20\d\d-\d\d-\d\d$/.test(q.day||''))this.startGame('daily',q.day);
        else if(q.mode==='story'&&q.level)this.startGame('story',String(Math.min(18,Math.max(1,parseInt(q.level,10)||1))));
        else this.startGame('story',String(this.unlocked()),true);
      }else this.draw();
    }catch(e){
      if(serial!==this.loadSerial)return;
      console.error('Fourfold artwork load failed',e);this.loading=false;this.loadError='美术资源未加载完成';this.assetsReady=false;this.draw();
    }
  }
  private makeFrame(texture:Texture2D,x:number,y:number,w:number,h:number){
    const f=new SpriteFrame();f.texture=texture;f.rect=new Rect(x,y,w,h);f.originalSize=new Size(w,h);f.packable=false;return f;
  }
  private disposeArt(){
    for(const frame of Object.values(this.frames))frame.destroy();this.frames={};
    for(const texture of Object.values(this.textures))texture.destroy();this.textures={};
    for(const image of this.images)image.decRef();this.images=[];
  }
  private startGame(mode:string,key:string,home=false){
    try{this.puzzle=makePuzzle(mode,key);}catch(e){console.warn('unavailable challenge',e);this.toast('这个日期的挑战暂不可用');if(!this.puzzle){this.puzzle=makePuzzle('story','1');mode='story';key='1';home=true;}else return;}
    this.mode=mode;this.key=key;this.inHome=home;this.board=this.puzzle.board;this.direction=1;this.moves=0;this.hints=0;this.startAt=0;this.elapsed=0;this.won=false;this.busy=false;this.modal='';this.hideBanner();this.draw();
  }
  private updateClock(){if(this.startAt&&!this.won&&!this.inHome)this.elapsed=(at()-this.startAt)/1000;if(this.clockLabel)this.clockLabel.string=clock(this.elapsed);}
  private clear(){this.clockLabel=null;this.tileNodes=[];this.toastNode=null;for(const n of [...this.root.children]){n.active=false;n.removeFromParent();n.destroy();}}
  private node(name:string,x:number,y:number,w:number,h:number,parent:Node=this.root){const n=new Node(name);n.layer=Layers.Enum.UI_2D;parent.addChild(n);n.addComponent(UITransform).setContentSize(w,h);n.setPosition(x+w/2,-y-h/2);return n;}
  private group(name:string,x:number,y:number,w:number,h:number,parent:Node=this.root){const n=this.node(name,x,y,w,h,parent),content=new Node('Content');content.layer=Layers.Enum.UI_2D;content.addComponent(UITransform).setContentSize(w,h);n.addChild(content);content.setPosition(-w/2,h/2);return {node:n,content};}
  private shape(x:number,y:number,w:number,h:number,fill:string,stroke='',radius=10,parent:Node=this.root){
    const n=this.node('Panel',x,y,w,h,parent),g=n.addComponent(Graphics);g.fillColor=ink(fill);g.roundRect(-w/2,-h/2,w,h,radius);g.fill();
    if(stroke){g.strokeColor=ink(stroke);g.lineWidth=1.2;g.stroke();}return n;
  }
  private txt(value:string,x:number,y:number,w:number,h:number,size=14,color=C.dark,bold=false,parent:Node=this.root){
    const n=this.node('Text',x,y,w,h,parent),l=n.addComponent(Label);l.string=value;l.color=ink(color);l.fontSize=size;l.lineHeight=Math.max(size*1.25,16);
    l.horizontalAlign=Label.HorizontalAlign.CENTER;l.verticalAlign=Label.VerticalAlign.CENTER;l.overflow=Label.Overflow.SHRINK;l.isBold=bold;return l;
  }
  private art(name:string,x:number,y:number,w:number,h:number,parent:Node=this.root){
    const frame=this.frames[name];if(!frame)throw new Error(`Missing loaded sprite: ${name}`);
    const n=this.node(name,x,y,w,h,parent),sprite=n.addComponent(Sprite);sprite.sizeMode=Sprite.SizeMode.CUSTOM;sprite.type=Sprite.Type.SIMPLE;sprite.spriteFrame=frame;
    n.getComponent(UITransform).setContentSize(w,h);return n;
  }
  private bindButton(n:Node,action:()=>void){
    let pressed=false;
    n.on(Node.EventType.TOUCH_START,(e:any)=>{e.propagationStopped=true;if(this.busy)return;pressed=true;Tween.stopAllByTarget(n);tween(n).to(.06,{scale:new Vec3(.975,.975,1)}).start();});
    n.on(Node.EventType.TOUCH_CANCEL,()=>{pressed=false;Tween.stopAllByTarget(n);tween(n).to(.08,{scale:new Vec3(1,1,1)}).start();});
    n.on(Node.EventType.TOUCH_END,(e:any)=>{e.propagationStopped=true;if(!pressed)return;pressed=false;Tween.stopAllByTarget(n);n.setScale(1,1,1);if(!this.busy)action();});
    return n;
  }
  private btn(value:string,x:number,y:number,w:number,h:number,action:()=>void,kind='creamButton',size=16){
    const g=this.group(value||kind,x,y,w,h);
    if(this.assetsReady)this.art(kind,0,0,w,h,g.content);else this.shape(0,0,w,h,C.surface,C.edge,14,g.content);
    if(value)this.txt(value,8,0,w-16,h-3,size,C.dark,true,g.content);return this.bindButton(g.node,action);
  }
  private iconButton(frame:string,x:number,y:number,size:number,action:()=>void){return this.btn('',x,y,size,size,action,frame);}
  private drawLoading(){
    this.shape(0,0,this.width,this.height,C.background,'',0);
    this.txt('四格诡局',40,280,this.width-80,60,34,C.dark,true);
    this.txt(this.loadError||'正在展开星图…',35,368,this.width-70,35,16,C.muted);
    if(this.loadError)this.btn('重新加载',80,431,this.width-160,54,()=>this.loadArt(),'creamButton',18);
    else {this.shape(70,426,this.width-140,7,'#E5BC88','',3);this.shape(70,426,Math.max(7,(this.width-140)*this.loadProgress/4),7,C.gold2,'',3);}
  }
  private draw(){
    if(!this.root)return;this.clear();
    if(!this.assetsReady){this.drawLoading();return;}
    this.shape(0,0,this.width,this.height,C.background,'',0);
    if(this.inHome)this.drawHome();else this.drawGame();
    if(this.modal)this.drawModal();
  }
  private drawHome(){
    const w=this.width,h=this.height;
    // 保留原画比例；只在较高的微信胶囊下整体下移，裁掉的部分仅为底端背景。
    this.art('home',0,Math.max(0,this.safeTop-58),w,h);
    this.iconButton('settingsButton',16,Math.max(14,this.safeTop+6),42,()=>{this.modal='settings';this.draw();});
    const bh=62,gap=12,start=Math.min(h*.64,h-this.safeBottom-38-bh*3-gap*2);
    this.btn('✦ 进入星图',35,start,w-70,bh,()=>this.startGame('story',String(this.unlocked())),'goldButton',22);
    this.btn('◇ 每日挑战',35,start+bh+gap,w-70,bh,()=>this.startGame('daily',todayCN()),'creamButton',21);
    this.btn('♛ 好友荣誉榜',35,start+(bh+gap)*2,w-70,bh,()=>this.showRank(),'lavenderButton',21);
  }
  private statCard(frame:string,label:string,value:string,x:number,y:number,w:number,h:number,isClock=false){
    this.art(frame,x,y,w,h);
    this.txt(label,x+w*.37,y+h*.19,w*.55,h*.29,14,C.dark,true);
    const l=this.txt(value,x+w*.36,y+h*.45,w*.57,h*.40,isClock?26:29,C.dark,true);
    if(isClock){this.clockLabel=l;this.updateClock();}
  }
  private drawGame(){
    const w=this.width,top=Math.max(24,this.safeTop+8),bottom=this.height-this.safeBottom-12,daily=this.mode==='daily';
    this.iconButton('backButton',16,top,42,()=>{this.inHome=true;this.modal='';this.hideBanner();this.draw();});
    this.iconButton('settingsButton',w-58,top,42,()=>{this.modal='settings';this.draw();});
    let statsY:number;
    if(daily){
      const bannerY=top+48;this.art('daily',14,bannerY,w-28,74);
      const parts=this.key.split('-');this.txt(`${Number(parts[1])}月${Number(parts[2])}日`,70,bannerY+11,w-140,33,27,C.white,true);
      this.txt('每日挑战',95,bannerY+44,w-190,23,15,C.white,true);statsY=bannerY+82;
    }else{
      this.art('creamButton',87,top-2,w-174,52);this.txt(`第${this.key}关`,93,top+1,w-186,44,27,C.dark,true);statsY=top+67;
    }
    const statW=(w-42)/2;this.statCard('stepsCard','当前步数',String(this.moves).padStart(2,'0'),15,statsY,statW,68);
    this.statCard('timeCard','本局用时',clock(this.elapsed),27+statW,statsY,statW,68,true);
    const shareY=bottom-52,hintY=shareY-8-36,directionY=hintY-7-44;
    const minBoardY=statsY+78,maxBoardBottom=directionY-14,size=Math.min(w-34,maxBoardBottom-minBoardY);
    const by=minBoardY+Math.max(0,(maxBoardBottom-minBoardY-size)/2),bx=(w-size)/2;
    this.drawBoard(bx,by,size);
    this.btn('↻ 顺时针',14,directionY,(w-35)/2,44,()=>{this.direction=1;this.draw();},this.direction===1?'goldButton':'creamButton',17);
    this.btn('↺ 逆时针',21+(w-35)/2,directionY,(w-35)/2,44,()=>{this.direction=-1;this.draw();},this.direction===-1?'goldButton':'creamButton',17);
    this.btn('✧ 提示',88,hintY,w-176,36,()=>this.askHint(),'creamButton',16);
    this.btn('✦ 发起同关挑战',16,shareY,w-32,52,()=>this.share(),'goldButton',20);
  }
  private drawBoard(bx:number,by:number,size:number){
    const unit=size/3;this.boardLayout={x:bx,y:by,size,unit};
    if(this.frames.boardFrame)this.art('boardFrame',bx-7,by-7,size+14,size+14);
    else {this.shape(bx-7,by-4,size+14,size+16,C.shadow,C.edge,17);this.shape(bx-7,by-7,size+14,size+14,C.gold,C.edge,17);this.shape(bx-2,by-2,size+4,size+4,C.night,C.gold2,10);}
    for(let i=0;i<9;i++){
      const tok=Number(this.board[i]),x=bx+(i%3)*unit,y=by+Math.floor(i/3)*unit;
      const tile=this.group('Tile '+tok,x+1,y+1,unit-2,unit-2);this.art('tile'+tok,0,0,unit-2,unit-2,tile.content);
      const l=this.txt(String(tok),unit-29,unit-29,20,22,17,C.white,true,tile.content),outline=l.node.addComponent(LabelOutline);outline.color=ink(C.night);outline.width=1.5;
      this.tileNodes[i]=tile.node;
    }
    for(let q=0;q<4;q++){
      const cx=bx+(q%2+1)*unit,cy=by+(Math.floor(q/2)+1)*unit,d=48;
      const g=this.group('Rotate '+q,cx-d/2,cy-d/2,d,d),knob=this.art('rotateKnob',0,0,d,d,g.content);
      if(this.direction<0)knob.setScale(-1,1,1);
      this.bindButton(g.node,()=>this.spin(q));
    }
  }
  private spin(q:number){
    if(this.won||this.modal||this.busy||!this.assetsReady)return;
    if(!this.startAt)this.startAt=at();this.busy=true;
    const squares=SQUARES[q],positions=this.tileNodes.map(n=>n.position.clone()),dir=this.direction;
    squares.forEach((from,i)=>{const to=squares[(i+dir+4)%4];tween(this.tileNodes[from]).to(.16,{position:positions[to]},{easing:'quadInOut'}).start();});
    this.scheduleOnce(()=>{
      this.board=rotate(this.board,q,dir);this.moves++;this.busy=false;
      if(isSolved(this.board)){this.won=true;this.elapsed=(at()-this.startAt)/1000;this.complete();}
      this.draw();
    },.17);
  }
  private complete(){
    const result={moves:this.moves,par:this.puzzle.par,seconds:Math.floor(this.elapsed),hints:this.hints,score:resultScore(this.moves,this.elapsed,this.hints),day:this.key};
    const prev=this.storeRead('best:'+this.storageKey(),null);
    if(!prev||(this.hints===0&&prev.hints>0)||(this.hints===prev.hints&&(this.moves<prev.moves||(this.moves===prev.moves&&result.seconds<prev.seconds))))this.storeWrite('best:'+this.storageKey(),result);
    if(this.mode==='story')this.storeWrite('unlocked',Math.max(this.unlocked(),Math.min(18,Number(this.key)+1)));
    if(this.mode==='daily'&&this.key===todayCN()&&this.hints===0)this.uploadScore(result);
    this.modal='result';this.showBanner();wxSDK()?.vibrateShort?.({type:'light'});
  }
  private uploadScore(result:any){
    const sdk=wxSDK();if(!sdk?.setUserCloudStorage)return;
    const value=[todayCN(),String(result.score),String(result.moves),String(result.seconds)].join('|');
    try{sdk.setUserCloudStorage({KVDataList:[{key:KEY,value}],fail:(e:any)=>console.warn('ranking cloud sync unavailable',e)});}catch(e){console.warn('ranking cloud sync failed',e);}
  }
  private nextLevel(){if(!this.won){this.toast('先完成本关，再解锁后续关卡');return;}if(this.mode==='daily')this.startGame('story',String(this.unlocked()));else if(Number(this.key)<18)this.startGame('story',String(Number(this.key)+1));else this.startGame('daily',todayCN());}
  private applyHint(){if(this.won)return;const path=shortestPath(this.board);if(!path.length)return;this.hints++;this.direction=path[0].dir;this.draw();this.toast(`点击第 ${path[0].q+1} 个旋转点（从左上到右下）`);}
  private askHint(){
    if(this.won)return;const sdk=wxSDK();
    if(!sdk||!AD_IDS.rewarded){this.applyHint();return;}
    try{
      if(!this.rewardAd){this.rewardAd=sdk.createRewardedVideoAd({adUnitId:AD_IDS.rewarded});this.rewardAd.onClose((res:any)=>{if(res?.isEnded===true)this.applyHint();else this.toast('未观看完整广告，未消耗提示机会');});this.rewardAd.onError((err:any)=>{console.warn(err);this.toast('广告加载失败，可以继续挑战');});}
      this.rewardAd.show().catch(()=>this.rewardAd.load().then(()=>this.rewardAd.show()).catch(()=>this.toast('广告暂不可用')));
    }catch{this.toast('广告接口暂不可用');}
  }
  private showBanner(){const sdk=wxSDK();if(!sdk||!AD_IDS.banner)return;try{
    const info=sdk.getWindowInfo?.()||sdk.getSystemInfoSync?.();const width=Math.min(info.windowWidth||320,320);
    this.banner=sdk.createBannerAd({adUnitId:AD_IDS.banner,style:{left:((info.windowWidth||width)-width)/2,top:(info.windowHeight||this.height)-115,width}});
    this.banner.onError?.((e:any)=>console.warn('banner unavailable',e));this.banner.show?.().catch(()=>{});
  }catch(e){console.warn(e);}}
  private hideBanner(){if(!this.banner)return;try{this.banner.hide?.();this.banner.destroy?.();}catch{}this.banner=null;}
  private share(){
    const sdk=wxSDK();if(!sdk){this.toast('请使用浏览器的分享功能发送当前试玩链接');return;}
    const query=this.mode==='daily'?`mode=daily&day=${encodeURIComponent(this.key)}`:`mode=story&level=${encodeURIComponent(this.key)}`;
    try{sdk.shareAppMessage({title:this.won&&!this.hints?`我用了 ${this.moves} 步复原星图，你呢？`:'四格诡局｜来挑战同一关星图',query:query+(this.won&&!this.hints?`&beat=${this.moves}`:'')});}catch{this.toast('当前微信环境不支持分享');}
  }
  private showRank(){this.modal='rank';this.hideBanner();this.draw();const sdk=wxSDK();if(sdk?.getOpenDataContext){try{sdk.getOpenDataContext().postMessage({type:'fourfold-rank',day:todayCN(),key:KEY});}catch(e){console.warn('rank context unavailable',e);}}}
  private closeModal(){this.modal='';this.hideBanner();this.draw();}
  private drawModal(){
    const w=this.width,h=this.height;
    const shade=this.shape(0,0,w,h,'#32201CCB','',0);shade.addComponent(BlockInputEvents);shade.on(Node.EventType.TOUCH_END,()=>this.closeModal());
    const top=Math.max(this.safeTop+24,(h-456)/2),height=456;
    const panel=this.shape(24,top,w-48,height,C.surface,C.edge,20);panel.addComponent(BlockInputEvents);
    this.btn('×',w-69,top+12,35,35,()=>this.closeModal(),'creamButton',21);
    if(this.modal==='settings'){
      this.txt('设置',62,top+29,w-124,44,28,C.dark,true);
      if(!this.inHome)this.btn('重新开始本关',43,top+110,w-86,54,()=>this.startGame(this.mode,this.key),'goldButton',18);
      this.btn('好友荣誉榜',43,top+(this.inHome?112:180),w-86,54,()=>this.showRank(),'creamButton',18);
      this.btn(this.inHome?'进入星图':'返回主页',43,top+250,w-86,54,()=>{if(this.inHome)this.startGame('story',String(this.unlocked()));else{this.inHome=true;this.modal='';this.hideBanner();this.draw();}},'creamButton',18);
      this.btn('继续',86,top+366,w-172,45,()=>this.closeModal(),'creamButton',17);
    }else if(this.modal==='result'){
      this.txt(this.moves===this.puzzle.par&&!this.hints?'♛':'✦',50,top+22,w-100,76,57,C.gold2,true);
      this.txt('星图已复原',40,top+102,w-80,36,28,C.dark,true);
      this.txt(honor(this.moves,this.puzzle.par,this.hints),40,top+143,w-80,29,18,C.dark,true);
      this.statCard('stepsCard','当前步数',String(this.moves).padStart(2,'0'),37,top+188,151,66);
      this.statCard('timeCard','本局用时',clock(this.elapsed),202,top+188,151,66);
      this.txt(this.hints?'使用过提示，本关成绩不入好友榜':'最佳成绩已记录',38,top+263,w-76,27,13,C.muted);
      this.btn(this.mode==='daily'?'回去闯关':'挑战下一关',43,top+307,w-86,52,()=>this.nextLevel(),'goldButton',18);
      this.btn('分享此关给好友',43,top+374,w-86,42,()=>this.share(),'creamButton',16);
    }else if(this.modal==='rank'){
      this.txt('好友荣誉榜',43,top+34,w-86,43,25,C.dark,true);
      this.txt(todayCN(),43,top+80,w-86,24,14,C.muted);
      const best=this.storeRead('best:daily:'+todayCN(),null);
      this.txt(best?`我的成绩 ${best.moves} 步 · ${best.seconds} 秒`:'今天还没有通关记录',42,top+117,w-84,30,14,C.dark);
      const sdk=wxSDK();
      if(sdk?.getOpenDataContext){try{this.node('OpenDataRank',42,top+157,w-84,190).addComponent(SubContextView);}catch(e){this.txt('好友排行暂不可用',44,top+212,w-88,44,14,C.muted);}}
      else this.txt('请在微信小游戏内查看好友荣誉榜',44,top+217,w-88,48,15,C.muted);
      this.btn('挑战今日关卡',43,top+371,w-86,49,()=>this.startGame('daily',todayCN()),'goldButton',18);
    }
  }
  private toast(message:string){
    if(!this.root)return;if(this.toastNode){this.toastNode.active=false;this.toastNode.destroy();}
    const y=this.height-this.safeBottom-154,g=this.group('Toast',25,y,this.width-50,50);this.toastNode=g.node;
    this.shape(0,0,this.width-50,50,C.surface,C.edge,15,g.content);this.txt(message,10,3,this.width-70,44,13,C.dark,true,g.content);
    this.scheduleOnce(()=>{if(this.toastNode===g.node)this.toastNode=null;if(g.node.isValid)g.node.destroy();},2.5);
  }
  onDestroy(){this.loadSerial++;this.hideBanner();try{this.rewardAd?.destroy?.();}catch{}this.disposeArt();}
}
