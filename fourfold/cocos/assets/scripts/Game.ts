// @ts-nocheck
/** Cocos Creator 3.8.8 主域：已确认原画拆分为 Sprite，操作、棋盘和数值仍为原生节点。 */
import {
  _decorator,Component,Node,Canvas,Camera,Layers,UITransform,UIOpacity,Label,LabelOutline,instantiate,
  Graphics,Color,view,screen,ResolutionPolicy,director,SubContextView,tween,Tween,Vec2,Vec3,
  Sprite,SpriteFrame,Texture2D,ImageAsset,JsonAsset,Rect,Size,resources,BlockInputEvents,Mask,ScrollView,
} from 'cc';
import {GOAL,SQUARES,makePuzzle,todayCN,rotate,isSolved,shortestPath,honor,resultScore,hintLimit,isBetterResult} from './Core';
import {TURN_DURATION_MS,createTurnMotion,sampleTurn} from './TurnMotion';
const {ccclass}=_decorator;
const HINT_MODE:'free'|'rewarded'='free'; // 未开通广告时，正式上线也免费提示；开通后再显式切换。
const AD_IDS={rewarded:'',banner:''}; // 接入时只填写微信公众平台提供的真实 adUnitId。
const C={background:'#F8DEB7',surface:'#FFF1D6',gold:'#F5CB79',gold2:'#C88B4D',white:'#FFF4D7',muted:'#977253',dark:'#5B301F',edge:'#825037',night:'#1B2345',shadow:'#B27C50'};
const ART_PATHS={home:'art/home-scene',atlas:'art/ui-atlas',referenceOriginal:'art/reference-daily',referenceClean:'art/reference-clean',rankScene:'art/rank-scene',resultPanel:'art/result-panel'};
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
  private roundSerial=0;private hintRequest:any=null;private disposed=false;private resultAdvanceRound=-1;
  private rankTemplate:Node|null=null;private rankView:Node|null=null;private rankSettings=false;
  private assetsReady=false;private loading=false;private loadError='';private loadProgress=0;private loadSerial=0;
  private textures:Record<string,Texture2D>={};private frames:Record<string,SpriteFrame>={};private images:ImageAsset[]=[];private manifest:any=null;private reference:any=null;private rankLayout:any=null;
  private tileNodes:Node[]=[];private knobNodes:Node[]=[];private knobArtNodes:Node[]=[];private knobAngles=[0,0,0,0];private boardContent:Node|null=null;
  private motionSerial=0;private turnMotion:any=null;private hideSDK:any=null;
  private boardLayout={x:0,y:0,size:0,unit:0};private launchQuery:any={};
  private pageScroll:ScrollView|null=null;private pageScrollKey='';private scrollOffsets:Record<string,number>={};

  onLoad(){
    this.fitViewport();
    const sdk=wxSDK();
    if(sdk){
      try{
        this.launchQuery=(sdk.getLaunchOptionsSync?.()||{}).query||{};
        sdk.showShareMenu?.({withShareTicket:false});
        if(typeof sdk.onHide==='function'){sdk.onHide(this.onAppHide);this.hideSDK=sdk;}
      }catch(e){console.warn('launch context unavailable',e);}
    }
    const scene=director.getScene();
    this.rankTemplate=scene.getChildByName('RankViewTemplate');
    this.canvasNode=new Node('Canvas');scene.addChild(this.canvasNode);this.canvasNode.layer=Layers.Enum.UI_2D;
    this.canvasNode.addComponent(UITransform).setContentSize(this.width,this.height);
    const canvas=this.canvasNode.addComponent(Canvas);
    const cameraNode=new Node('UICamera');this.canvasNode.addChild(cameraNode);cameraNode.layer=Layers.Enum.UI_2D;cameraNode.setPosition(0,0,1000);
    this.cam=cameraNode.addComponent(Camera);this.cam.projection=Camera.ProjectionType.ORTHO;this.cam.clearFlags=Camera.ClearFlag.SOLID_COLOR;
    this.cam.clearColor=ink(C.background);this.cam.near=.1;this.cam.far=2000;this.cam.visibility=Layers.Enum.UI_2D;this.cam.orthoHeight=this.height/2;canvas.cameraComponent=this.cam;
    this.canvasNode.setPosition(this.width/2,this.height/2);
    this.root=new Node('UIRoot');this.root.layer=Layers.Enum.UI_2D;this.root.addComponent(UITransform).setContentSize(this.width,this.height);
    this.canvasNode.addChild(this.root);this.root.setPosition(-this.width/2,this.height/2);
    screen.on('window-resize',this.onWindowResize,this);
    this.schedule(()=>this.updateClock(),.2);
    this.loadArt();
  }

  private fitViewport(){
    const sdk=wxSDK(),frame=view.getFrameSize();let info:any={},cap:any=null;
    try{info=sdk?.getWindowInfo?.()||sdk?.getSystemInfoSync?.()||{};cap=sdk?.getMenuButtonBoundingClientRect?.();}catch(e){console.warn('window safe area unavailable',e);}
    const ww=Number(info.windowWidth)||frame.width||this.width,wh=Number(info.windowHeight)||frame.height||this.height;
    const scale=this.width/ww;this.height=wh*scale;
    const top=Math.max(Number(cap?.bottom)||0,Number(info.safeArea?.top)||0);
    this.safeTop=top?Math.max(0,(top+6)*scale):0;
    this.safeBottom=Math.max(0,(wh-(Number(info.safeArea?.bottom)||wh))*scale);
    // 固定逻辑宽度，按真实窗口推导高度；不再把整个390×844画面缩成两边留白的窄条。
    view.setDesignResolutionSize(this.width,this.height,ResolutionPolicy.FIXED_WIDTH);
  }
  private onWindowResize(){
    this.cancelTurnMotion();
    this.fitViewport();if(!this.canvasNode||!this.root)return;
    this.canvasNode.getComponent(UITransform).setContentSize(this.width,this.height);this.canvasNode.setPosition(this.width/2,this.height/2);
    this.root.getComponent(UITransform).setContentSize(this.width,this.height);this.root.setPosition(-this.width/2,this.height/2);
    this.cam.orthoHeight=this.height/2;this.draw();
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
      const [manifestAsset,referenceAsset,rankAsset]=await Promise.all([this.loadResource('art/assetManifest',JsonAsset),this.loadResource('art/referenceLayout',JsonAsset),this.loadResource('art/rankLayout',JsonAsset)]);
      if(serial!==this.loadSerial)return;
      this.manifest=manifestAsset.json;this.reference=referenceAsset.json;this.rankLayout=rankAsset.json;
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
      this.installReferenceFrames();
      this.validateSceneArtwork();
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
  private installReferenceFrames(){
    const r=this.reference,original=this.textures.referenceOriginal,clean=this.textures.referenceClean;
    if(!r?.size||r.slotRects?.length!==9||r.knobCenters?.length!==4||r.knobCropRects?.length!==4)throw new Error('参考界面坐标清单不完整');
    if([original,clean].some(t=>t.width!==r.size[0]||t.height!==r.size[1]))throw new Error('参考原画尺寸与清单不一致');
    const add=(name:string,rect:number[],texture=clean)=>{
      if(!Array.isArray(rect)||rect.length!==4||!rect.every(Number.isFinite)||rect[0]<0||rect[1]<0||rect[2]<=0||rect[3]<=0||rect[0]+rect[2]>texture.width||rect[1]+rect[3]>texture.height)throw new Error(`参考裁片范围错误: ${name}`);
      this.frames[name]=this.makeFrame(texture,rect[0],rect[1],rect[2],rect[3]);
    };
    for(let token=1;token<=9;token++)add('referenceTile'+token,r.tileByToken[token]);
    for(let q=0;q<4;q++)add('referenceKnob'+q,r.knobCropRects[q],original);
    for(const key of ['date','moves','timer'])add('referencePatch'+key,r.dynamicPatches[key]);
    add('referenceBoardFrame',r.boardOuter,original);
    add('referenceMovesCard',r.components.movesCard);add('referenceTimerCard',r.components.timerCard);
    add('referenceBanner',r.components.banner,original);
    for(const key of ['back','settings','clockwise','counterclockwise','hint','share'])add('referenceControl'+key,r.components[key],original);
    this.frames.homeHero=this.makeFrame(this.textures.home,0,0,this.textures.home.width,1140);
    this.frames.homeHeroCompact=this.makeFrame(this.textures.home,0,128,this.textures.home.width,1012);
    const a=r.tileArea,slots=r.slotRects;
    r.seams=[];
    for(let i=0;i<2;i++){
      const x=slots[i][0]+slots[i][2],nextX=slots[i+1][0];
      const vr=[x,a[1],nextX-x,a[3]],row=i*3,y=slots[row][1]+slots[row][3],nextY=slots[row+3][1];
      const hr=[a[0],y,a[2],nextY-y];
      add('referenceVSeam'+i,vr);add('referenceHSeam'+i,hr);r.seams.push({name:'referenceVSeam'+i,rect:vr},{name:'referenceHSeam'+i,rect:hr});
    }
  }
  private disposeArt(){
    for(const frame of Object.values(this.frames))frame.destroy();this.frames={};
    for(const texture of Object.values(this.textures))texture.destroy();this.textures={};
    for(const image of this.images)image.decRef();this.images=[];
  }
  private validateSceneArtwork(){
    for(const [key,texture] of [['rank',this.textures.rankScene],['result',this.textures.resultPanel]] as any){
      const layout=this.rankLayout?.[key];
      if(!layout||layout.width!==texture.width||layout.height!==texture.height)throw new Error(`界面原画尺寸与坐标不一致: ${key}`);
    }
    const rank=this.rankLayout.rank,result=this.rankLayout.result;
    const check=(rect:any,layout:any)=>Array.isArray(rect)&&rect.length===4&&rect.every(Number.isFinite)&&rect[0]>=0&&rect[1]>=0&&rect[2]>0&&rect[3]>0&&rect[0]+rect[2]<=layout.width&&rect[1]+rect[3]<=layout.height;
    for(const key of ['back','settings','daily','previous','next'])if(!check(rank[key],rank))throw new Error(`榜单热区不完整: ${key}`);
    for(const key of ['title','honor','movesLabel','movesValue','timeLabel','timeValue','note','primary','share','close'])if(!check(result[key],result))throw new Error(`结算坐标不完整: ${key}`);
    if(rank.width!==854||rank.height!==1842||rank.podium?.length!==3)throw new Error('榜单开放域设计尺寸不匹配');
  }
  private startGame(mode:string,key:string,home=false){
    this.cancelTurnMotion();
    try{this.puzzle=makePuzzle(mode,key);}catch(e){console.warn('unavailable challenge',e);this.toast('这个日期的挑战暂不可用');if(!this.puzzle){this.puzzle=makePuzzle('story','1');mode='story';key='1';home=true;}else return;}
    this.roundSerial++; // 同一关重开也不能领取上一局尚未结束的广告奖励。
    this.mode=mode;this.key=key;this.inHome=home;this.board=this.puzzle.board;this.direction=1;this.moves=0;this.hints=0;this.startAt=0;this.elapsed=0;this.won=false;this.busy=false;this.knobAngles=[0,0,0,0];this.modal='';this.rankSettings=false;this.hideBanner();this.draw();
  }
  private updateClock(){if(this.startAt&&!this.won&&!this.inHome)this.elapsed=(at()-this.startAt)/1000;if(this.clockLabel)this.clockLabel.string=clock(this.elapsed);}
  private clear(){
    this.cancelTurnMotion();if(this.inHome)this.knobAngles=[0,0,0,0];
    this.rankView=null;
    if(this.pageScroll){this.scrollOffsets[this.pageScrollKey]=Math.max(0,this.pageScroll.getScrollOffset().y);this.pageScroll=null;}
    this.clockLabel=null;this.tileNodes=[];this.knobNodes=[];this.knobArtNodes=[];this.boardContent=null;this.toastNode=null;for(const n of [...this.root.children]){n.active=false;n.removeFromParent();n.destroy();}
  }
  private createNode(name:string,x:number,y:number,w:number,h:number,parent:Node=this.root){const n=new Node(name);n.layer=Layers.Enum.UI_2D;parent.addChild(n);n.addComponent(UITransform).setContentSize(w,h);n.setPosition(x+w/2,-y-h/2);return n;}
  private group(name:string,x:number,y:number,w:number,h:number,parent:Node=this.root){const n=this.createNode(name,x,y,w,h,parent),content=new Node('Content');content.layer=Layers.Enum.UI_2D;content.addComponent(UITransform).setContentSize(w,h);n.addChild(content);content.setPosition(-w/2,h/2);return {node:n,content};}
  private pageContent(name:string,height:number,center=false){
    const available=Math.max(1,this.height-this.safeTop-this.safeBottom),overflow=height>available+.01;
    if(!overflow)return this.group(name,0,this.safeTop+(center?(available-height)/2:0),this.width,height).content;
    // 极短窗口仅纵向滚动；棋盘和按钮仍按屏幕宽度排布，不把整页缩成窄条。
    const viewport=this.createNode(name+' viewport',0,this.safeTop,this.width,available),mask=viewport.addComponent(Mask);mask.type=Mask.Type.RECT;
    const content=new Node(name+' content');content.layer=Layers.Enum.UI_2D;viewport.addChild(content);
    const transform=content.addComponent(UITransform);transform.setContentSize(this.width,height);transform.setAnchorPoint(0,1);content.setPosition(-this.width/2,available/2);
    const scroll=viewport.addComponent(ScrollView);scroll.content=content;scroll.horizontal=false;scroll.vertical=true;scroll.elastic=false;scroll.inertia=true;scroll.cancelInnerEvents=true;
    this.pageScroll=scroll;this.pageScrollKey=name==='Rank'?'rank':this.inHome?'home':this.mode+':'+this.key;
    scroll.scrollToOffset(new Vec2(0,Math.min(height-available,this.scrollOffsets[this.pageScrollKey]||0)),0);
    return content;
  }
  private shape(x:number,y:number,w:number,h:number,fill:string,stroke='',radius=10,parent:Node=this.root){
    const n=this.createNode('Panel',x,y,w,h,parent),g=n.addComponent(Graphics);g.fillColor=ink(fill);g.roundRect(-w/2,-h/2,w,h,radius);g.fill();
    if(stroke){g.strokeColor=ink(stroke);g.lineWidth=1.2;g.stroke();}return n;
  }
  private txt(value:string,x:number,y:number,w:number,h:number,size=14,color=C.dark,bold=false,parent:Node=this.root){
    const n=this.createNode('Text',x,y,w,h,parent),l=n.addComponent(Label);l.string=value;l.color=ink(color);l.fontSize=size;l.lineHeight=Math.max(size*1.25,16);
    l.horizontalAlign=Label.HorizontalAlign.CENTER;l.verticalAlign=Label.VerticalAlign.CENTER;l.overflow=Label.Overflow.SHRINK;l.isBold=bold;return l;
  }
  private art(name:string,x:number,y:number,w:number,h:number,parent:Node=this.root){
    const frame=this.frames[name];if(!frame)throw new Error(`Missing loaded sprite: ${name}`);
    const n=this.createNode(name,x,y,w,h,parent),sprite=n.addComponent(Sprite);sprite.sizeMode=Sprite.SizeMode.CUSTOM;sprite.type=Sprite.Type.SIMPLE;sprite.spriteFrame=frame;
    n.getComponent(UITransform).setContentSize(w,h);return n;
  }
  private bindButton(n:Node,action:()=>void,feedback:Node|null=null,allowBusy=false){
    let pressed=false;
    n.on(Node.EventType.TOUCH_START,(e:any)=>{e.propagationStopped=true;if((this.busy&&!allowBusy)||this.disposed||!n.isValid)return;pressed=true;if(feedback)feedback.active=true;Tween.stopAllByTarget(n);tween(n).to(.06,{scale:new Vec3(.975,.975,1)}).start();});
    n.on(Node.EventType.TOUCH_CANCEL,()=>{pressed=false;if(feedback)feedback.active=false;Tween.stopAllByTarget(n);tween(n).to(.08,{scale:new Vec3(1,1,1)}).start();});
    n.on(Node.EventType.TOUCH_END,(e:any)=>{e.propagationStopped=true;if(!pressed)return;pressed=false;if(feedback)feedback.active=false;Tween.stopAllByTarget(n);n.setScale(1,1,1);if((!this.busy||allowBusy)&&!this.disposed&&n.isValid&&n.activeInHierarchy!==false)action();});
    return n;
  }
  private artHit(name:string,rect:number[],scale:number,parent:Node,action:()=>void,minTop=-Infinity){
    const [x,y,w,h]=rect.map(v=>v*scale),hitW=Math.max(44,w),hitH=Math.max(44,h),left=x+(w-hitW)/2,top=Math.max(minTop,y+(h-hitH)/2);
    const g=this.group(name,left,top,hitW,hitH,parent),feedback=this.shape(0,0,hitW,hitH,'#FFF6DD28','',Math.min(18,hitH/3),g.content);feedback.active=false;
    this.bindButton(g.node,action,feedback);return {node:g.node,x:left,y:top,w:hitW,h:hitH};
  }
  private btn(value:string,x:number,y:number,w:number,h:number,action:()=>void,kind='creamButton',size=16,parent:Node=this.root,allowBusy=false){
    const g=this.group(value||kind,x,y,w,h,parent);
    if(this.assetsReady)this.art(kind,0,0,w,h,g.content);else this.shape(0,0,w,h,C.surface,C.edge,14,g.content);
    if(value)this.txt(value,8,0,w-16,h-3,size,C.dark,true,g.content);return this.bindButton(g.node,action,null,allowBusy);
  }
  private iconButton(frame:string,x:number,y:number,size:number,action:()=>void,allowBusy=false){return this.btn('',x,y,size,size,action,frame,16,this.root,allowBusy);}
  private drawLoading(){
    this.shape(0,0,this.width,this.height,C.background,'',0);
    this.txt('四格诡局',40,280,this.width-80,60,34,C.dark,true);
    this.txt(this.loadError||'正在展开星图…',35,368,this.width-70,35,16,C.muted);
    if(this.loadError)this.btn('重新加载',80,431,this.width-160,54,()=>this.loadArt(),'creamButton',18);
    else {this.shape(70,426,this.width-140,7,'#E5BC88','',3);this.shape(70,426,Math.max(7,(this.width-140)*this.loadProgress/Object.keys(ART_PATHS).length),7,C.gold2,'',3);}
  }
  private draw(){
    if(!this.root)return;this.clear();
    if(!this.assetsReady){this.drawLoading();return;}
    this.shape(0,0,this.width,this.height,C.background,'',0);
    if(this.modal==='rank'||(this.modal==='settings'&&this.rankSettings)){this.drawRankPage();if(this.modal==='settings')this.drawModal();return;}
    if(this.inHome)this.drawHome();else this.drawGame();
    if(this.modal)this.drawModal();
  }
  private homeGeometry(width:number,height:number){
    const menuW=width*.8,entries=['goldButton','creamButton','lavenderButton'];
    const buttonHeights=entries.map(key=>{const r=this.manifest.atlas.frames[key];return Math.max(44,menuW*r.h/r.w);});
    const menuH=buttonHeights.reduce((sum,h)=>sum+h,0)+10,regularH=width*1140/854+16+menuH+16;
    const compact=regularH>height,heroW=compact?width-8:width,cropTop=compact?128:0,heroH=heroW*(1140-cropTop)/854;
    const gap=compact?4:16,contentH=heroH+gap+menuH+(compact?8:16),y=compact?4+Math.max(0,(height-contentH)/2):0;
    let menuY=y+heroH+gap;
    const buttons=buttonHeights.map(h=>{const rect={x:(width-menuW)/2,y:menuY,w:menuW,h};menuY+=h+5;return rect;});
    return {compact,contentH:Math.max(height,contentH),hero:{x:(width-heroW)/2,y,w:heroW,h:heroH},cropTop,buttons,settings:{x:12,y:compact?Math.max(10,y+3):14,w:44,h:44}};
  }
  private dailyGeometry(width:number,height:number){
    // 与网页layout.mjs共用同一组公式：可用高度只选择排布，不缩整张原画。
    const box=(x:number,y:number,w:number,h:number)=>({x,y,w,h}),fit=(w:number,sw:number,sh:number)=>w*sh/sw;
    const c=width-16,cardW=(c-8)/2,directionW=(c-8)/2,statsH=fit(cardW,380,181),boardH=fit(c,817,765);
    const directionH=Math.max(44,fit(directionW,412,123)),hintW=c*401/817,shareW=c*764/817;
    const hintH=Math.max(44,fit(hintW,401,92)),shareH=Math.max(44,fit(shareW,764,143));
    const regularHeights=[44,fit(c,807,213),statsH,boardH,directionH,hintH,shareH],regularTotal=regularHeights.reduce((a,b)=>a+b,0)+6*6+16;
    const compact=regularTotal>height,gap=compact?3:6,pad=compact?6:8,bannerW=compact?c-72:c,bannerH=fit(bannerW,807,213);
    const footerHintW=(c-8)*.36,footerShareW=(c-8)*.64,footerH=Math.max(44,fit(footerHintW,401,92),fit(footerShareW,764,143));
    const heights=compact?[Math.max(44,bannerH),statsH,boardH,directionH,footerH]:regularHeights,total=heights.reduce((a,b)=>a+b,0)+gap*(heights.length-1)+pad*2;
    let y=pad+Math.max(0,(height-total)/2);
    const rows=heights.map(h=>{const rect=box(8,y,c,h);y+=h+gap;return rect;});
    const bannerRow=compact?rows[0]:rows[1],statsRow=compact?rows[1]:rows[2],boardRow=compact?rows[2]:rows[3],directionRow=compact?rows[3]:rows[4],navY=rows[0].y+(rows[0].h-44)/2;
    const hint=compact?box(8,rows[4].y,footerHintW,footerH):box((width-hintW)/2,rows[5].y,hintW,hintH);
    const share=compact?box(16+footerHintW,rows[4].y,footerShareW,footerH):box((width-shareW)/2,rows[6].y,shareW,shareH);
    return {compact,contentH:Math.max(height,total),back:box(compact?0:8,navY,44,44),settings:box(width-(compact?44:52),navY,44,44),iconWidth:compact?32:40,
      banner:box((width-bannerW)/2,bannerRow.y+(bannerRow.h-bannerH)/2,bannerW,bannerH),moves:box(8,statsRow.y,cardW,statsH),
      timer:box(16+cardW,statsRow.y+(statsH-fit(cardW,379,180))/2,cardW,fit(cardW,379,180)),board:boardRow,
      cw:box(8,directionRow.y,directionW,directionH),ccw:box(16+directionW,directionRow.y,directionW,directionH),hint,share};
  }
  private drawHome(){
    const w=this.width,uiScale=w/390,layout=this.homeGeometry(w,this.height-this.safeTop-this.safeBottom),parent=this.pageContent('Home',layout.contentH);
    const entries=[
      {text:'✦ 进入星图',frame:'goldButton',size:22,action:()=>this.startGame('story',String(this.unlocked()))},
      {text:'◇ 每日挑战',frame:'creamButton',size:21,action:()=>this.startGame('daily',todayCN())},
      {text:'♛ 好友荣誉榜',frame:'lavenderButton',size:21,action:()=>this.showRank()},
    ];
    // 只裁掉顶部装饰和底部空白，标题/书本保持完整；短屏菜单独立占80%屏宽。
    const hero=layout.hero;this.art(layout.compact?'homeHeroCompact':'homeHero',hero.x,hero.y,hero.w,hero.h,parent);
    entries.forEach((entry,i)=>{
      const r=this.manifest.atlas.frames[entry.frame],rect=layout.buttons[i],buttonH=rect.w*r.h/r.w;
      const button=this.btn(entry.text,rect.x,rect.y+(rect.h-buttonH)/2,rect.w,buttonH,entry.action,entry.frame,entry.size*uiScale,parent);
      // 点击范围可扩大，内部原画仍按素材比例绘制。
      if(buttonH<44)button.getComponent(UITransform).setContentSize(rect.w,44);
    });
    const settings=layout.settings;this.iconButton('settingsButton',settings.x,this.safeTop+settings.y,44,()=>{this.modal='settings';this.draw();});
  }
  private referenceNumber(value:string,x:number,y:number,w:number,h:number,color=C.dark,parent:Node=this.root){
    const l=this.txt(value,x,y,w,h,h*.94,color,true,parent);l.fontFamily='Georgia';l.lineHeight=h;return l;
  }
  private statCard(frame:string,label:string,value:string,x:number,y:number,w:number,h:number,isClock=false,parent:Node=this.root){
    const timer=frame==='timeCard',card=this.reference.components[timer?'timerCard':'movesCard'];
    const patch=this.reference.dynamicPatches[timer?'timer':'moves'],scale=Math.min(w/card[2],h/card[3]);
    const dx=x+(w-card[2]*scale)/2,dy=y+(h-card[3]*scale)/2;
    this.art(timer?'referenceTimerCard':'referenceMovesCard',dx,dy,card[2]*scale,card[3]*scale,parent);
    const l=this.referenceNumber(value,dx+(patch[0]-card[0])*scale,dy+(patch[1]-card[1])*scale,patch[2]*scale,patch[3]*scale,C.dark,parent);
    if(isClock){this.clockLabel=l;this.updateClock();}
  }
  private drawGame(){
    if(this.mode==='daily'){this.drawReferenceDaily();return;}
    const w=this.width,top=Math.max(24,this.safeTop+8),bottom=this.height-this.safeBottom-12;
    this.iconButton('backButton',16,top,42,()=>{this.inHome=true;this.modal='';this.hideBanner();this.draw();},true);
    this.iconButton('settingsButton',w-58,top,42,()=>{this.modal='settings';this.draw();},true);
    this.art('creamButton',87,top-2,w-174,52);this.txt(`第${this.key}关`,93,top+1,w-186,44,27,C.dark,true);
    const statsY=top+67,statW=(w-42)/2,statH=statW*this.reference.components.movesCard[3]/this.reference.components.movesCard[2];
    this.statCard('stepsCard','当前步数',String(this.moves).padStart(2,'0'),15,statsY,statW,statH);
    this.statCard('timeCard','本局用时',clock(this.elapsed),27+statW,statsY,statW,statH,true);
    const shareY=bottom-52,hintY=shareY-8-36,directionY=hintY-7-44;
    const minBoardY=statsY+statH+10,maxBoardBottom=directionY-14,size=Math.min(w-34,maxBoardBottom-minBoardY);
    const by=minBoardY+Math.max(0,(maxBoardBottom-minBoardY-size)/2),bx=(w-size)/2;
    this.drawBoard(bx,by,size);
    this.btn('↻ 顺时针',14,directionY,(w-35)/2,44,()=>{this.direction=1;this.draw();},this.direction===1?'goldButton':'creamButton',17);
    this.btn('↺ 逆时针',21+(w-35)/2,directionY,(w-35)/2,44,()=>{this.direction=-1;this.draw();},this.direction===-1?'goldButton':'creamButton',17);
    this.btn(`✧ 提示 ${this.hintsLeft()}/${hintLimit(this.mode)}`,88,hintY,w-176,36,()=>this.askHint(),'creamButton',16);
    this.btn('✦ 发起同关挑战',16,shareY,w-32,52,()=>this.share(),'goldButton',20);
  }
  private referenceControl(name:string,rect:number[],ox:number,oy:number,scale:number,action:()=>void,selected=false,dim=false,parent:Node=this.root,allowBusy=false){
    const [rx,ry,rw,rh]=rect,w=rw*scale,h=rh*scale,hitW=Math.max(44,w),hitH=Math.max(44,h);
    const n=this.createNode(name,ox+rx*scale-(hitW-w)/2,oy+ry*scale-(hitH-h)/2,hitW,hitH,parent),g=n.addComponent(Graphics);
    let pressed=false;
    const feedback=()=>{
      g.clear();if(!pressed&&!selected&&!dim)return;
      g.roundRect(-w/2+1,-h/2+1,w-2,h-2,Math.min(w,h)*.38);
      g.fillColor=ink(pressed?'#FFF4D332':dim?'#4B31272B':'#FFDB8208');g.fill();
      if(pressed||selected){g.strokeColor=ink(pressed?'#FFF1CE':'#FFD06E');g.lineWidth=Math.max(1.5,4*scale);g.stroke();}
    };
    feedback();
    n.on(Node.EventType.TOUCH_START,(e:any)=>{e.propagationStopped=true;if((this.busy&&!allowBusy)||this.disposed||!n.isValid)return;pressed=true;feedback();});
    n.on(Node.EventType.TOUCH_CANCEL,()=>{pressed=false;feedback();});
    n.on(Node.EventType.TOUCH_END,(e:any)=>{e.propagationStopped=true;if(!pressed)return;pressed=false;feedback();if((!this.busy||allowBusy)&&!this.disposed&&n.isValid&&n.activeInHierarchy!==false)action();});
    return n;
  }
  private drawReferenceDaily(){
    const r=this.reference,layout=this.dailyGeometry(this.width,this.height-this.safeTop-this.safeBottom),parent=this.pageContent('Daily',layout.contentH);
    const piece=(key:string,rect:any,maxWidth=rect.w)=>{
      const source=r.components[key],scale=Math.min(maxWidth/source[2],rect.h/source[3]);
      const w=source[2]*scale,h=source[3]*scale,x=rect.x+(rect.w-w)/2,y=rect.y+(rect.h-h)/2;
      this.art(key==='banner'?'referenceBanner':'referenceControl'+key,x,y,w,h,parent);
      return {ox:x-source[0]*scale,oy:y-source[1]*scale,scale};
    };
    const control=(key:string,name:string,rect:any,action:()=>void,selected=false,dim=false,maxWidth=rect.w)=>{
      const p=piece(key,rect,maxWidth);this.referenceControl(name,r.components[key],p.ox,p.oy,p.scale,action,selected,dim,parent,key==='back'||key==='settings');
    };
    control('back','返回主页',layout.back,()=>{this.inHome=true;this.modal='';this.hideBanner();this.draw();},false,false,layout.iconWidth);
    control('settings','设置',layout.settings,()=>{this.modal='settings';this.draw();},false,false,layout.iconWidth);
    // 横幅、信息牌和按钮都是原稿独立裁片；仅各组件内的实时文字覆盖清理区域。
    const banner=piece('banner',layout.banner),date=r.dynamicPatches.date,dateParts=this.key.split('-');
    const dateX=banner.ox+date[0]*banner.scale,dateY=banner.oy+date[1]*banner.scale,dateW=date[2]*banner.scale,dateH=date[3]*banner.scale;
    this.art('referencePatchdate',dateX,dateY,dateW,dateH,parent);
    this.referenceNumber(`${Number(dateParts[1])}月${Number(dateParts[2])}日`,dateX,dateY,dateW,dateH,C.white,parent);
    const moves=layout.moves,timer=layout.timer;
    this.statCard('stepsCard','当前步数',String(this.moves).padStart(2,'0'),moves.x,moves.y,moves.w,moves.h,false,parent);
    this.statCard('timeCard','本局用时',clock(this.elapsed),timer.x,timer.y,timer.w,timer.h,true,parent);
    const board=layout.board,outer=r.boardOuter,boardScale=board.w/outer[2];
    this.art('referenceBoardFrame',board.x,board.y,board.w,board.h,parent);
    this.drawReferenceBoard(board.x-outer[0]*boardScale,board.y-outer[1]*boardScale,boardScale,parent);
    control('clockwise','↻ 顺时针',layout.cw,()=>{this.direction=1;this.draw();},false,this.direction<0);
    control('counterclockwise','↺ 逆时针',layout.ccw,()=>{this.direction=-1;this.draw();},this.direction<0);
    control('hint','✧ 提示',layout.hint,()=>this.askHint(),false,this.hintsLeft()===0);
    const badge={x:layout.hint.x+layout.hint.w-33,y:layout.hint.y+layout.hint.h/2-9};
    this.shape(badge.x,badge.y,31,18,C.surface,C.gold2,9,parent);
    this.txt(`${this.hintsLeft()}/${hintLimit(this.mode)}`,badge.x,badge.y,31,18,11,this.hintsLeft()?C.dark:C.muted,true,parent);
    control('share','✦ 发起同关挑战',layout.share,()=>this.share());
  }
  private drawBoard(bx:number,by:number,size:number){
    const outer=this.reference.boardOuter,outerW=Math.min(this.width-16,size+14),scale=outerW/outer[2],outerH=outer[3]*scale;
    const x=bx+(size-outerW)/2,y=by+(size-outerH)/2;
    this.art('referenceBoardFrame',x,y,outerW,outerH);
    this.drawReferenceBoard(x-outer[0]*scale,y-outer[1]*scale,scale);
  }
  private drawReferenceBoard(ox:number,oy:number,scale:number,parent:Node=this.root){
    const r=this.reference,a=r.tileArea,w=a[2]*scale,h=a[3]*scale,bx=ox+a[0]*scale,by=oy+a[1]*scale;
    this.boardLayout={x:bx,y:by,size:w,unit:w/3,height:h};
    const boardLayer=this.group('Reference board',bx,by,w,h,parent),mask=boardLayer.node.addComponent(Mask);mask.type=Mask.Type.RECT;this.boardContent=boardLayer.content;
    // 遮住底图所有旧棋子和旋钮，换位动画的空隙也不会透出固定数字。
    this.shape(0,0,w,h,C.night,'',0,boardLayer.content);
    for(const seam of r.seams){const p=seam.rect;this.art(seam.name,(p[0]-a[0])*scale,(p[1]-a[1])*scale,p[2]*scale,p[3]*scale,boardLayer.content);}
    for(let i=0;i<9;i++){
      const p=r.slotRects[i],token=Number(this.board[i]),tw=p[2]*scale,th=p[3]*scale;
      const tile=this.group('Tile '+token,(p[0]-a[0])*scale,(p[1]-a[1])*scale,tw,th,boardLayer.content);
      this.art('referenceTile'+token,0,0,tw,th,tile.content);this.tileNodes[i]=tile.node;
    }
    for(let q=0;q<4;q++){
      const center=r.knobCenters[q],crop=r.knobCropRects[q],d=r.knobClipRadius*2*scale,hitD=Math.max(44,d);
      const cx=(center[0]-a[0])*scale,cy=(center[1]-a[1])*scale;
      const hit=this.group('Rotate '+q,cx-hitD/2,cy-hitD/2,hitD,hitD,boardLayer.content);
      const circle=this.group('Knob circle',(hitD-d)/2,(hitD-d)/2,d,d,hit.content),clip=circle.node.addComponent(Mask);clip.type=Mask.Type.ELLIPSE;clip.segments=64;
      const cw=crop[2]*scale,ch=crop[3]*scale,knob=this.art('referenceKnob'+q,(d-cw)/2,(d-ch)/2,cw,ch,circle.content);
      if(this.direction<0)knob.setScale(-1,1,1);knob.angle=-this.knobAngles[q];this.knobNodes[q]=hit.node;this.knobArtNodes[q]=knob;this.bindButton(hit.node,()=>this.spin(q));
    }
  }
  private spin(q:number){
    if(this.disposed||this.inHome||this.won||this.modal||this.busy||!this.assetsReady||!Number.isInteger(q)||!SQUARES[q]||!this.boardContent)return;
    const squares=SQUARES[q],tiles=squares.map(index=>this.tileNodes[index]),knob=this.knobArtNodes[q],hit=this.knobNodes[q];
    if(tiles.some(node=>!node?.isValid)||!knob?.isValid||!hit?.isValid)return;
    const rects=tiles.map(node=>{const t=node.getComponent(UITransform);return {x:node.position.x-t.width/2,y:-node.position.y-t.height/2,width:t.width,height:t.height};});
    const geometry=createTurnMotion(rects,this.direction,{x:hit.position.x,y:-hit.position.y});
    const states=this.tileNodes.map(node=>{const opacity=node.getComponent(UIOpacity)||node.addComponent(UIOpacity);return {node,position:node.position.clone(),scale:node.scale.clone(),opacity,value:opacity.opacity};});
    const bounds=geometry.bounds,width=bounds.right-bounds.left,height=bounds.bottom-bounds.top,effects:Node[]=[];
    const outline=this.turnOutline('Turn selection',bounds.left,bounds.top,width,height,7,'#FFD56C44',this.boardContent);effects.push(outline);
    const edge=this.turnOutline('Turn selection edge',bounds.left,bounds.top,width,height,2.4,'#FFE5A0',this.boardContent);effects.push(edge);
    const d=knob.getComponent(UITransform).width+10;
    const pivot=this.turnOutline('Turn pivot glow',geometry.pivot.x-d/2,geometry.pivot.y-d/2,d,d,5,'#FFD15B77',this.boardContent,d/2);effects.push(pivot);
    const ring=this.turnOutline('Turn pivot ring',geometry.pivot.x-d/2,geometry.pivot.y-d/2,d,d,2,'#FFF0B2',this.boardContent,d/2);effects.push(ring);
    const flashes=tiles.map((node,index)=>{const r=rects[index],flash=this.shape(0,0,r.width,r.height,'#FFF5C9','',3,node.children[0]);flash.name='Turn landing flash';flash.addComponent(UIOpacity).opacity=0;effects.push(flash);return flash;});
    if(!this.startAt)this.startAt=at();this.busy=true;
    const motion={serial:++this.motionSerial,round:this.roundSerial,board:this.board,q,dir:this.direction,elapsed:0,geometry,tiles,states,knob,knobStart:this.knobAngles[q],parent:this.boardContent,effects,focus:[outline,edge,pivot,ring],flashes};
    this.turnMotion=motion;this.applyTurnFrame(motion,0);
  }
  private turnOutline(name:string,x:number,y:number,width:number,height:number,lineWidth:number,color:string,parent:Node,radius=11){
    const node=this.createNode(name,x,y,width,height,parent),g=node.addComponent(Graphics),inset=lineWidth/2+1;
    g.roundRect(-width/2+inset,-height/2+inset,Math.max(1,width-2*inset),Math.max(1,height-2*inset),Math.max(1,Math.min(radius,Math.min(width,height)/2-inset)));
    g.fillColor=ink('#FFD77508');g.fill();g.strokeColor=ink(color);g.lineWidth=lineWidth;g.stroke();node.addComponent(UIOpacity).opacity=0;return node;
  }
  private turnIsCurrent(motion:any){
    return this.turnMotion===motion&&motion.serial===this.motionSerial&&motion.round===this.roundSerial&&motion.board===this.board&&!this.disposed&&!this.inHome&&!this.won&&!this.modal&&this.assetsReady&&this.boardContent===motion.parent&&motion.parent.isValid&&motion.tiles.every((node:Node)=>node.isValid);
  }
  private applyTurnFrame(motion:any,progress:number){
    const first=sampleTurn(motion.geometry,0,progress),focus=first.focus;
    motion.tiles.forEach((node:Node,index:number)=>{
      const point=index?sampleTurn(motion.geometry,index,progress):first;
      // 共享数学使用y向下；Cocos节点局部坐标y向上。图块自身不旋转。
      node.setPosition(point.x,-point.y);node.setScale(point.scaleX,point.scaleY,1);
    });
    motion.states.forEach((state:any)=>{state.opacity.opacity=Math.round(state.value*(motion.tiles.includes(state.node)?1:1-.44*focus));});
    motion.knob.angle=-(motion.knobStart+first.angle);
    motion.focus.forEach((node:Node)=>{node.getComponent(UIOpacity).opacity=Math.round(255*focus);});
    const landing=Math.max(0,Math.min(1,(progress-.9)/.1)),flash=Math.round(58*Math.sin(Math.PI*landing));
    motion.flashes.forEach((node:Node)=>{node.getComponent(UIOpacity).opacity=Math.max(0,flash);});
  }
  update(deltaTime:number){
    const motion=this.turnMotion;if(!motion)return;
    if(!this.turnIsCurrent(motion)){this.cancelTurnMotion();return;}
    if(!Number.isFinite(deltaTime)||deltaTime<=0)return;
    motion.elapsed=Math.min(TURN_DURATION_MS,motion.elapsed+deltaTime*1000);
    const progress=motion.elapsed/TURN_DURATION_MS;this.applyTurnFrame(motion,progress);
    if(progress<1)return;
    // 唯一提交点：整段460ms完成后再更新棋盘与步数，不排队补跑连续点击。
    const next=rotate(motion.board,motion.q,motion.dir),angle=(motion.knobStart+motion.dir*90)%360;
    this.cancelTurnMotion(false);this.knobAngles[motion.q]=angle;this.board=next;this.moves++;
    if(isSolved(this.board)){this.won=true;this.elapsed=(at()-this.startAt)/1000;this.complete();}
    this.draw();
  }
  private cancelTurnMotion(restore=true){
    this.motionSerial++;const motion=this.turnMotion;this.turnMotion=null;if(!motion)return;
    for(const state of motion.states){
      if(!state.node.isValid)continue;Tween.stopAllByTarget(state.node);
      if(restore){state.node.setPosition(state.position);state.node.setScale(state.scale);}
      state.opacity.opacity=state.value;
    }
    if(motion.knob.isValid){Tween.stopAllByTarget(motion.knob);if(restore)motion.knob.angle=-motion.knobStart;}
    for(const effect of motion.effects)if(effect.isValid){effect.active=false;effect.removeFromParent();effect.destroy();}
    this.busy=false;
  }
  private onAppHide=()=>{this.cancelTurnMotion();};
  onDisable(){this.cancelTurnMotion();}
  private complete(){
    const result={moves:this.moves,par:this.puzzle.par,seconds:Math.floor(this.elapsed),hints:this.hints,score:resultScore(this.moves,this.elapsed,this.hints),day:this.key};
    const prev=this.storeRead('best:'+this.storageKey(),null);
    const best=isBetterResult(result,prev)?result:{...prev,score:resultScore(prev.moves,prev.seconds,prev.hints)};
    this.storeWrite('best:'+this.storageKey(),best);
    if(this.mode==='story')this.storeWrite('unlocked',Math.max(this.unlocked(),Math.min(18,Number(this.key)+1)));
    if(this.mode==='daily'&&this.key===todayCN())this.uploadScore(best);
    this.modal='result';this.showBanner();wxSDK()?.vibrateShort?.({type:'light'});
  }
  private uploadScore(result:any){
    const sdk=wxSDK();if(!sdk?.setUserCloudStorage)return;
    const value=[todayCN(),String(result.score),String(result.moves),String(result.seconds)].join('|');
    try{sdk.setUserCloudStorage({KVDataList:[{key:KEY,value}],fail:(e:any)=>console.warn('ranking cloud sync unavailable',e)});}catch(e){console.warn('ranking cloud sync failed',e);}
  }
  private nextLevel(round=this.roundSerial){
    // 关闭和继续共用同一条通关路由；被销毁弹窗的迟到点击不能再推进新一局。
    if(this.disposed||round!==this.roundSerial||this.resultAdvanceRound===round||this.modal!=='result'||!this.won)return;
    this.resultAdvanceRound=round;
    if(this.mode==='daily')this.startGame('story',String(this.unlocked()));
    else if(Number(this.key)<18)this.startGame('story',String(Number(this.key)+1));
    else this.startGame('daily',todayCN());
    if(this.roundSerial===round)this.resultAdvanceRound=-1; // 日期不可用时保留重试机会。
  }
  private hintsLeft(){return Math.max(0,hintLimit(this.mode)-this.hints);}
  private applyHint(){
    if(this.won||this.disposed||this.inHome)return;
    if(!this.hintsLeft()){this.toast(`本局 ${hintLimit(this.mode)} 次提示已用完`);return;}
    const path=shortestPath(this.board);if(!path.length)return;
    this.hints++;this.direction=path[0].dir;this.draw();
    this.toast(`第 ${path[0].q+1} 个旋转点（从左上到右下）· 剩余 ${this.hintsLeft()} 次`);
  }
  private hintRequestCurrent(request:any){return !this.disposed&&this.hintRequest===request&&request.round===this.roundSerial&&!this.inHome&&!this.won;}
  private releaseHintRequest(request:any){
    if(this.hintRequest!==request)return;this.hintRequest=null;
    try{request.ad.offClose?.(request.onClose);}catch(e){console.warn('hint close listener cleanup failed',e);}
    try{request.ad.offError?.(request.onError);}catch(e){console.warn('hint error listener cleanup failed',e);}
  }
  private failHintRequest(request:any){
    const current=this.hintRequestCurrent(request);this.releaseHintRequest(request);
    if(current)this.toast('提示广告暂不可用，请稍后再试');
  }
  private async askHint(){
    if(this.disposed||this.won||this.inHome||this.busy||!this.assetsReady)return;
    if(!this.hintsLeft()){this.toast(`本局 ${hintLimit(this.mode)} 次提示已用完`);return;}
    const sdk=wxSDK();
    // 免费期不创建广告对象；以后填入 ID 也不会自动改变玩家当前的提示方式。
    if(HINT_MODE==='free'){this.applyHint();return;}
    if(this.hintRequest)return;
    if(!AD_IDS.rewarded||typeof sdk?.createRewardedVideoAd!=='function'){this.toast('提示广告暂不可用，请稍后再试');return;}
    let request:any=null;
    try{
      const ad=this.rewardAd||(this.rewardAd=sdk.createRewardedVideoAd({adUnitId:AD_IDS.rewarded}));
      request={ad,round:this.roundSerial,opening:true,onClose:null,onError:null};this.hintRequest=request;
      request.onClose=(res:any)=>{
        const current=this.hintRequestCurrent(request);this.releaseHintRequest(request);
        if(!current)return;
        if(res?.isEnded===true)this.applyHint();else this.toast('看完视频才能获得提示');
      };
      request.onError=(err:any)=>{
        if(this.hintRequest!==request||this.disposed)return;
        console.warn('hint ad unavailable',err);
        // 展示/加载阶段由 Promise 统一重试、结算，避免同一次失败处理两遍。
        if(!request.opening)this.failHintRequest(request);
      };
      ad.onClose(request.onClose);ad.onError(request.onError);
      try{await ad.show();}catch{
        if(!this.hintRequestCurrent(request)){this.releaseHintRequest(request);return;}
        await ad.load();
        if(!this.hintRequestCurrent(request)){this.releaseHintRequest(request);return;}
        await ad.show();
      }
      request.opening=false;
      if(!this.hintRequestCurrent(request))this.releaseHintRequest(request);
    }catch(e){
      if(this.disposed)return;
      console.warn('hint ad request failed',e);
      if(request)this.failHintRequest(request);else this.toast('提示广告暂不可用，请稍后再试');
    }
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
    try{sdk.shareAppMessage({title:this.won?`我用了 ${this.moves} 步复原星图，你呢？`:'四格诡局｜来挑战同一关星图',query:query+(this.won?`&beat=${this.moves}`:'')});}catch{this.toast('当前微信环境不支持分享');}
  }
  private showRank(){this.rankSettings=false;this.modal='rank';this.hideBanner();this.draw();}
  private openRankSettings(){if(this.modal!=='rank')return;this.rankSettings=true;this.modal='settings';this.hideBanner();this.draw();}
  private rankPage(delta:number){
    if(this.disposed||this.modal!=='rank'||!this.rankView)return;
    try{wxSDK()?.getOpenDataContext?.().postMessage({type:'fourfold-rank-page',delta});}catch(e){console.warn('rank page unavailable',e);this.toast('好友榜暂不可用，请稍后重试');}
  }
  private drawRankPage(){
    const r=this.rankLayout.rank,scale=this.width/r.width,height=r.height*scale;
    // 原画按窗口宽度等比显示；短屏通过原生ScrollView浏览，不再缩成居中窄条。
    const parent=this.pageContent('Rank',height,true),day=todayCN(),date=day.split('-'),best=this.storeRead('best:daily:'+day,null);
    this.art('rankScene',0,0,this.width,height,parent);
    const centered=(value:string,point:number[],width:number,lineHeight:number,size:number,color=C.dark,bold=false)=>this.txt(value,(point[0]-width/2)*scale,(point[1]-lineHeight/2)*scale,width*scale,lineHeight*scale,size*scale,color,bold,parent);
    centered(`${Number(date[1])}月${Number(date[2])}日 · 每日挑战`,r.date,550,52,36,C.white,true);
    const hasBest=best&&Number.isFinite(Number(best.moves))&&Number(best.moves)>=1&&Number.isFinite(Number(best.seconds))&&Number(best.seconds)>=0;
    centered(hasBest?String(best.moves):'—',r.bestMoves,230,86,68,C.dark,true);
    centered(hasBest?clock(Number(best.seconds)):'—:—',r.bestTime,280,86,62,C.dark,true);
    const sdk=wxSDK(),canUseFriends=typeof sdk?.getOpenDataContext==='function'&&!!this.rankTemplate;
    const empty=(title:string,note:string)=>{
      for(const slot of r.podium){centered('—',slot.name,170,44,29);centered('— 步',slot.moves,165,42,29);centered('—:—',slot.time,165,44,31);}
      this.shape(64*scale,1081*scale,726*scale,80*scale,'#FFF1D7F7','',4*scale,parent);
      centered(title,[427,1105],650,42,30,C.dark,true);centered(note,[427,1144],650,32,23,C.muted);
      centered('—',[427,1258],146,28,19,C.muted);
    };
    if(canUseFriends){
      try{
        // 模板与透明开放域均固定854×1842，好友数据与底图共用源像素坐标。
        const node=instantiate(this.rankTemplate);node.name='OpenDataRank';node.layer=Layers.Enum.UI_2D;
        node.getComponent(UITransform).setContentSize(this.width,height);parent.addChild(node);node.setPosition(this.width/2,-height/2);
        this.rankView=node;node.active=true;node.getComponent(SubContextView).fps=10;
        this.scheduleOnce(()=>{
          if(this.disposed||this.modal!=='rank'||this.rankView!==node||!node.isValid)return;
          try{sdk.getOpenDataContext().postMessage({type:'fourfold-rank',day,key:KEY,width:r.width,height:r.height,page:0});}
          catch(e){console.warn('rank context unavailable',e);node.active=false;empty('好友榜暂时无法读取','请返回后重新打开排行榜');}
        },0);
      }catch(e){console.warn('rank view unavailable',e);empty('好友榜暂时无法读取','请返回后重新打开排行榜');}
    }else empty('微信好友榜','在微信小游戏中查看好友成绩');
    this.artHit('Rank back',r.back,scale,parent,()=>this.closeModal());
    this.artHit('Rank settings',r.settings,scale,parent,()=>this.openRankSettings());
    this.artHit('Rank previous',r.previous,scale,parent,()=>{if(canUseFriends)this.rankPage(-1);});
    this.artHit('Rank next',r.next,scale,parent,()=>{if(canUseFriends)this.rankPage(1);});
    this.artHit('Rank daily',r.daily,scale,parent,()=>this.startGame('daily',todayCN()));
  }
  private closeModal(){
    if(this.modal==='result'){this.nextLevel();return;}
    this.modal=this.modal==='settings'&&this.rankSettings?'rank':'';this.rankSettings=false;this.hideBanner();this.draw();
  }
  private drawModal(){
    if(this.modal==='result'){this.drawResultModal();return;}
    const w=this.width,h=this.height,close=()=>this.closeModal();
    const shade=this.shape(0,0,w,h,'#32201CCB','',0);shade.addComponent(BlockInputEvents);shade.on(Node.EventType.TOUCH_END,close);
    const top=Math.max(this.safeTop+24,(h-456)/2),height=456;
    const panel=this.shape(24,top,w-48,height,C.surface,C.edge,20);panel.addComponent(BlockInputEvents);
    this.btn('×',w-69,top+12,35,35,close,'creamButton',21);
    if(this.modal==='settings'){
      this.txt('设置',62,top+29,w-124,44,28,C.dark,true);
      if(!this.inHome)this.btn('重新开始本关',43,top+110,w-86,54,()=>this.startGame(this.mode,this.key),'goldButton',18);
      this.btn('好友荣誉榜',43,top+(this.inHome?112:180),w-86,54,()=>this.showRank(),'creamButton',18);
      this.btn(this.inHome?'进入星图':'返回主页',43,top+250,w-86,54,()=>{if(this.inHome)this.startGame('story',String(this.unlocked()));else{this.inHome=true;this.modal='';this.rankSettings=false;this.hideBanner();this.draw();}},'creamButton',18);
      this.btn('继续',86,top+366,w-172,45,()=>this.closeModal(),'creamButton',17);
    }
  }
  private drawResultModal(){
    const r=this.rankLayout.result,round=this.roundSerial,advance=()=>this.nextLevel(round);
    const available=Math.max(1,this.height-this.safeTop-this.safeBottom),scale=Math.min((this.width-24)/r.width,Math.max(1,available-20)/r.height);
    const width=r.width*scale,height=r.height*scale,left=(this.width-width)/2,top=this.safeTop+Math.max(0,(available-height)/2);
    const shade=this.shape(0,0,this.width,this.height,'#211A32C9','',0);shade.addComponent(BlockInputEvents);shade.on(Node.EventType.TOUCH_END,advance);
    const panel=this.group('Result artwork',left,top,width,height);panel.node.addComponent(BlockInputEvents);this.art('resultPanel',0,0,width,height,panel.content);
    const text=(value:string,key:string,size:number,color=C.dark,bold=true)=>{const p=r[key];return this.txt(value,p[0]*scale,p[1]*scale,p[2]*scale,p[3]*scale,size*scale,color,bold,panel.content);};
    text('星图已复原','title',78,C.white);
    text(honor(this.moves,this.puzzle.par,this.hints),'honor',44);
    text('当前步数','movesLabel',38);text('本局用时','timeLabel',38);
    text(String(this.moves).padStart(2,'0'),'movesValue',78);text(clock(this.elapsed),'timeValue',73);
    text(`最优步数 ${this.puzzle.par} 步`,'note',38,C.muted,false);
    const primary=this.mode==='daily'?'继续闯关':Number(this.key)>=18?'挑战每日关卡':'挑战下一关';
    text(primary,'primary',63);text('分享此关给好友','share',44);
    this.artHit('Result close',r.close,scale,panel.content,advance);
    const primaryHit=this.artHit('Result next',r.primary,scale,panel.content,advance);
    // 小尺寸时分享按钮的点击区向下扩展，和上一个44px点击区保持间隔。
    this.artHit('Result share',r.share,scale,panel.content,()=>{if(this.modal==='result'&&this.roundSerial===round)this.share();},primaryHit.y+primaryHit.h+2);
  }
  private toast(message:string){
    if(!this.root)return;if(this.toastNode){this.toastNode.active=false;this.toastNode.destroy();}
    const y=this.height-this.safeBottom-154,g=this.group('Toast',25,y,this.width-50,50);this.toastNode=g.node;
    this.shape(0,0,this.width-50,50,C.surface,C.edge,15,g.content);this.txt(message,10,3,this.width-70,44,13,C.dark,true,g.content);
    this.scheduleOnce(()=>{if(this.toastNode===g.node)this.toastNode=null;if(g.node.isValid)g.node.destroy();},2.5);
  }
  onDestroy(){
    this.disposed=true;this.cancelTurnMotion();this.roundSerial++;screen.off('window-resize',this.onWindowResize,this);this.loadSerial++;
    try{this.hideSDK?.offHide?.(this.onAppHide);}catch{}this.hideSDK=null;
    if(this.hintRequest)this.releaseHintRequest(this.hintRequest);
    this.hideBanner();try{this.rewardAd?.destroy?.();}catch{}this.rewardAd=null;this.disposeArt();
  }
}
