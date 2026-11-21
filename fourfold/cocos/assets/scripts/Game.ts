// @ts-nocheck
/** Cocos Creator 3.8.8 主域：已确认原画拆分为 Sprite，操作、棋盘和数值仍为原生节点。 */
import {
  _decorator,Component,Node,Canvas,Camera,Layers,UITransform,UIOpacity,Label,LabelOutline,instantiate,
  Graphics,Color,view,screen,ResolutionPolicy,director,SubContextView,tween,Tween,Vec2,Vec3,
  Sprite,SpriteFrame,Texture2D,ImageAsset,JsonAsset,Rect,Size,resources,BlockInputEvents,Mask,ScrollView,
  AudioClip,AudioSource,game as engineGame,Game as EngineGame,
} from 'cc';
import {GOAL,SQUARES,makePuzzle,todayCN,rotate,isSolved,shortestPath,honor,resultScore,hintLimit,isBetterResult} from './Core';
import {TURN_DURATION_MS,createTurnMotion,sampleTurn} from './TurnMotion';
import {HOME_ART,HOME_UI,HOME_COLORS,homeLayout,homeStoryLabel} from './HomeScene';
import {getTileTheme,buildThemeArtwork} from './TileThemes';
const {ccclass}=_decorator;
const HINT_MODE:'free'|'rewarded'='free'; // 未开通广告时，正式上线也免费提示；开通后再显式切换。
const AD_IDS={rewarded:'',banner:''}; // 接入时只填写微信公众平台提供的真实 adUnitId。
const C={background:'#F8DEB7',surface:'#FFF1D6',gold:'#F5CB79',gold2:'#C88B4D',white:'#FFF4D7',muted:'#977253',dark:'#5B301F',edge:'#825037',night:'#1B2345',shadow:'#B27C50'};
const ART_PATHS={home:'art/'+HOME_ART.resource,homeUI:'art/'+HOME_UI.resource,atlas:'art/ui-atlas',referenceOriginal:'art/reference-daily',referenceClean:'art/reference-clean',rankScene:'art/rank-scene',resultPanel:'art/result-panel'};
const AUDIO_PATHS={ui:'audio/ui-stone-press-v1',turn:'audio/stone-turn-v1'};
const REQUIRED_FRAMES=['goldButton','creamButton','lavenderButton','stepsCard','timeCard','rotateKnob','settingsButton','backButton'];
const at=()=>typeof performance!=='undefined'&&performance.now?performance.now():Date.now();
const wxSDK=()=>typeof wx!=='undefined'?(wx as any):null;
const KEY='FF_DAILY_V1';
function ink(hex:string){const c=new Color();Color.fromHEX(c,hex);return c;}
function clock(seconds:number){return `${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(Math.floor(seconds%60)).padStart(2,'0')}`;}

@ccclass('FourfoldGame')
export class FourfoldGame extends Component {
  private canvasNode:Node;private root:Node;private cam:Camera;private width=390;private height=844;
  private safeTop=0;private safeBottom=0;private windowScale=1;private inHome=true;private mode='story';private key='1';private puzzle:any;
  private board=GOAL;private direction=1;private moves=0;private hints=0;private elapsed=0;private startAt=0;private won=false;private modal='';private busy=false;
  private showNumbers=this.storeRead('showNumbers',true)!==false;private admiring=false;private completedRound=-1;private uiSerial=0;
  private clockLabel:Label|null=null;private rewardAd:any=null;private banner:any=null;private toastNode:Node|null=null;
  private numberLayers=new Map<Label,Label[]>();
  private roundSerial=0;private hintRequest:any=null;private disposed=false;private resultAdvanceRound=-1;
  private hintGuide:{q:number;dir:number;stage:'direction'|'target';round:number;board:string}|null=null;
  private hintVisualNodes:Node[]=[];
  private rankTemplate:Node|null=null;private rankView:Node|null=null;private rankSettings=false;
  private assetsReady=false;private loading=false;private loadError='';private loadProgress=0;private loadSerial=0;
  private pendingResourceLoads=new Set<()=>void>();
  private textures:Record<string,Texture2D>={};private frames:Record<string,SpriteFrame>={};private images:ImageAsset[]=[];private manifest:any=null;private reference:any=null;private rankLayout:any=null;
  private activeTheme:any=null;private themeArtwork:any=null;private themeImage:ImageAsset|null=null;private themeLoading=false;private themeError='';private themeSerial=0;
  private tileNodes:Node[]=[];private knobNodes:Node[]=[];private knobArtNodes:Node[]=[];private knobAngles=[0,0,0,0];private boardContent:Node|null=null;
  private motionSerial=0;private turnMotion:any=null;private hideSDK:any=null;
  private soundEnabled=this.storeRead('sound',true)!==false;private audioHidden=false;private audioDisabled=false;
  private audioNode:Node|null=null;private audioSources:Partial<Record<'ui'|'turn',AudioSource>>={};private audioClips:Partial<Record<'ui'|'turn',AudioClip>>={};
  private audioWanted={ui:false,turn:false};
  private audioLoading=false;private audioSerial=0;private audioLifecycleAttached=false;
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
        if(typeof sdk.onShow==='function'){sdk.onShow(this.onAppShow);this.hideSDK=sdk;}
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
    engineGame.on(EngineGame.EVENT_HIDE,this.onAppHide,this);engineGame.on(EngineGame.EVENT_SHOW,this.onAppShow,this);this.audioLifecycleAttached=true;
    screen.on('window-resize',this.onWindowResize,this);
    this.schedule(()=>this.updateClock(),.2);
    void this.prepareAudio(); // Optional audio loads independently of the playable artwork.
    this.loadArt();
  }

  private fitViewport(){
    const sdk=wxSDK(),frame=view.getFrameSize();let info:any={},cap:any=null;
    try{info=sdk?.getWindowInfo?.()||sdk?.getSystemInfoSync?.()||{};cap=sdk?.getMenuButtonBoundingClientRect?.();}catch(e){console.warn('window safe area unavailable',e);}
    const ww=Number(info.windowWidth)||frame.width||this.width,wh=Number(info.windowHeight)||frame.height||this.height;
    const scale=this.width/ww;this.windowScale=scale;this.height=wh*scale;
    const top=Math.max(Number(cap?.bottom)||0,Number(info.safeArea?.top)||0);
    this.safeTop=top?Math.max(0,(top+6)*scale):0;
    this.safeBottom=Math.max(0,(wh-(Number(info.safeArea?.bottom)||wh))*scale);
    // 固定逻辑宽度，按真实窗口推导高度；不再把整个390×844画面缩成两边留白的窄条。
    view.setDesignResolutionSize(this.width,this.height,ResolutionPolicy.FIXED_WIDTH);
  }
  private onWindowResize(){
    if(this.disposed)return;
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
  private async prepareAudio(){
    if(this.disposed||this.audioLoading||!this.canvasNode?.isValid)return;
    if(!this.audioNode){
      try{
        this.audioNode=new Node('Fourfold audio');this.canvasNode.addChild(this.audioNode);
        for(const kind of ['ui','turn'] as const){
          const node=new Node(kind+' sound');this.audioNode.addChild(node);
          const source=node.addComponent(AudioSource);source.playOnAwake=false;source.loop=false;source.volume=kind==='ui' ? .65 : .8;
          this.audioSources[kind]=source;
          // A delayed platform start must never revive a muted or cancelled sound.
          node.on(AudioSource.EventType.STARTED,()=>{if(!this.audioWanted[kind]||!this.canPlayAudio()||(kind==='turn'&&!this.turnMotion))this.stopAudio(kind);});
          node.on(AudioSource.EventType.ENDED,()=>{this.audioWanted[kind]=false;});
        }
      }catch(error){console.warn('Optional audio unavailable',error);this.disposeAudio();return;}
    }
    const missing=(['ui','turn'] as const).filter(kind=>!this.audioClips[kind]);if(!missing.length)return;
    const serial=this.audioSerial;this.audioLoading=true;
    await Promise.allSettled(missing.map(async kind=>{
      const clip=await this.loadResource(AUDIO_PATHS[kind],AudioClip);
      if(this.disposed||serial!==this.audioSerial||!this.audioNode?.isValid)return;
      clip.addRef();this.audioClips[kind]=clip;this.audioSources[kind].clip=clip;
      // Loading never queues a previously missed click or turn for later playback.
    }));
    if(serial===this.audioSerial)this.audioLoading=false;
  }
  private canPlayAudio(){return this.soundEnabled&&!this.audioHidden&&!this.audioDisabled&&!this.disposed;}
  private playAudio(kind:'ui'|'turn'){
    const source=this.audioSources[kind];
    if(!this.canPlayAudio()||!this.audioClips[kind]||!source?.isValid||(kind==='turn'&&!this.turnMotion))return;
    try{
      if(kind==='turn')this.stopAudio('ui');
      // One controllable source per effect avoids stacked clicks and allows
      // immediate cancellation, including when the platform is still loading.
      this.stopAudio(kind);this.audioWanted[kind]=true;source.play();
    }catch{this.stopAudio(kind);} // Sound support or autoplay failure never interrupts an action.
  }
  private stopAudio(kind?:'ui'|'turn'){
    for(const key of kind?[kind]:['ui','turn']){this.audioWanted[key]=false;try{this.audioSources[key]?.stop();}catch{}}
  }
  private disposeAudio(){
    this.audioSerial++;this.audioLoading=false;this.stopAudio();
    for(const source of Object.values(this.audioSources))try{source.clip=null;}catch{}
    if(this.audioNode?.isValid){this.audioNode.active=false;this.audioNode.removeFromParent();this.audioNode.destroy();}
    this.audioNode=null;this.audioSources={};
    for(const clip of Object.values(this.audioClips))clip.decRef();this.audioClips={};
  }
  private toggleSound(round=this.roundSerial,ui=this.uiSerial){
    if(this.disposed||this.modal!=='settings'||round!==this.roundSerial||ui!==this.uiSerial)return false;
    this.soundEnabled=!this.soundEnabled;this.storeWrite('sound',this.soundEnabled);
    if(this.soundEnabled)void this.prepareAudio();else this.stopAudio();
    this.draw();return true;
  }
  private loadResource(path:string,type:any){
    if(this.disposed)return Promise.reject(new Error('Fourfold resource load cancelled'));
    return new Promise<any>((resolve,reject)=>{
      let settled=false,timer:any=null;
      const finish=(error:any,asset?:any)=>{
        if(settled)return;
        settled=true;if(timer!==null)clearTimeout(timer);this.pendingResourceLoads.delete(cancel);
        if(error)reject(error);else if(this.disposed)reject(new Error('Fourfold resource load cancelled'));else resolve(asset);
      };
      const cancel=()=>finish(new Error('Fourfold resource load cancelled'));
      this.pendingResourceLoads.add(cancel);
      timer=setTimeout(()=>finish(new Error(`Fourfold resource load timed out: ${path}`)),25000);
      // A timeout cannot cancel the engine's request. Its late callback must not
      // settle this attempt again or acquire ownership of a stale image.
      try{resources.load(path,type,finish);}catch(error){finish(error);}
    });
  }
  private async loadArt(){
    if(this.loading||this.disposed)return;
    const serial=++this.loadSerial;this.loading=true;this.loadError='';this.assetsReady=false;this.loadProgress=0;this.draw();
    const current=()=>!this.disposed&&serial===this.loadSerial;
    try{
      const [manifestAsset,referenceAsset,rankAsset]=await Promise.all([this.loadResource('art/assetManifest',JsonAsset),this.loadResource('art/referenceLayout',JsonAsset),this.loadResource('art/rankLayout',JsonAsset)]);
      if(!current())return;
      this.manifest=manifestAsset.json;this.reference=referenceAsset.json;this.rankLayout=rankAsset.json;
      const rects=this.manifest?.atlas?.frames;
      if(!rects||REQUIRED_FRAMES.some(name=>!rects[name]))throw new Error('美术清单缺少必要组件');
      const paths=ART_PATHS;
      this.disposeArt();
      const names=Object.keys(paths);
      let next=0;
      // At most three requests in this attempt. Each continuation checks its
      // generation before retaining an image or creating rendering resources.
      const worker=async()=>{
        while(current()){
          const index=next++;if(index>=names.length)return;
          const name=names[index],source=await this.loadResource(paths[name],ImageAsset);
          if(!current())return;
          source.addRef();this.images.push(source);
          const texture=new Texture2D();this.textures[name]=texture;texture.image=source;
          this.frames[name]=this.makeFrame(texture,0,0,texture.width,texture.height);
          this.loadProgress++;this.draw();
        }
      };
      await Promise.all(Array.from({length:Math.min(3,names.length)},()=>worker()));
      if(!current())return;
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
      }else if(this.inHome)this.draw();else this.prepareTheme(this.roundSerial);
    }catch(e){
      if(!current())return;
      // Invalidate sibling workers before exposing retry or releasing partial
      // art. Their pending engine callbacks can no longer write into this view
      // or a subsequent attempt.
      this.loadSerial++;this.loading=false;this.assetsReady=false;this.disposeArt();
      console.error('Fourfold artwork load failed',e);this.loadError='美术资源未加载完成';this.draw();
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
    for(let q=0;q<4;q++)add('referenceKnob'+q,r.knobCropRects[q],original);
    for(const key of ['date','moves','timer'])add('referencePatch'+key,r.dynamicPatches[key]);
    add('referenceBoardFrame',r.boardOuter,original);
    add('referenceMovesCard',r.components.movesCard);add('referenceTimerCard',r.components.timerCard);
    add('referenceBanner',r.components.banner,original);
    for(const key of ['back','settings','clockwise','counterclockwise','hint','share'])add('referenceControl'+key,r.components[key],original);
    for(const [key,name] of [['story','homeStoryButton'],['daily','homeDailyButton'],['rank','homeRankButton']])add(name,HOME_UI.frames[key],this.textures.homeUI);
  }
  private disposeArt(){
    this.themeSerial++;this.themeLoading=false;this.themeError='';this.activeTheme=null;this.themeArtwork=null;this.themeImage=null;
    for(const frame of Object.values(this.frames))frame.destroy();this.frames={};
    for(const texture of Object.values(this.textures))texture.destroy();this.textures={};
    for(const image of this.images)image.decRef();this.images=[];
  }
  private releaseTheme(){
    for(const name of ['mural',...Array.from({length:9},(_,i)=>'referenceTile'+(i+1))]){this.frames[name]?.destroy();delete this.frames[name];}
    this.textures.mural?.destroy();delete this.textures.mural;
    if(this.themeImage){this.images=this.images.filter(image=>image!==this.themeImage);this.themeImage.decRef();this.themeImage=null;}
    this.activeTheme=null;this.themeArtwork=null;
  }
  private async prepareTheme(round=this.roundSerial){
    if(this.disposed||!this.assetsReady)return;
    const theme=getTileTheme(this.mode,this.key),serial=++this.themeSerial;
    const current=()=>!this.disposed&&this.assetsReady&&serial===this.themeSerial&&round===this.roundSerial;
    this.themeError='';
    if(this.activeTheme?.id===theme.id&&this.textures.mural){this.themeLoading=false;this.draw();return;}
    this.themeLoading=true;this.draw();
    let image:ImageAsset|null=null,texture:Texture2D|null=null,nextFrames:Record<string,SpriteFrame>={};
    const discard=()=>{for(const frame of Object.values(nextFrames))frame.destroy();nextFrames={};texture?.destroy();texture=null;image?.decRef();image=null;};
    try{
      image=await this.loadResource('art/'+theme.resource,ImageAsset);image.addRef();
      if(!current()){discard();return;}
      texture=new Texture2D();texture.image=image;
      const artwork=buildThemeArtwork(this.reference.tileArtwork,theme,texture.width,texture.height);
      nextFrames.mural=this.makeFrame(texture,0,0,texture.width,texture.height);
      for(const token of GOAL){
        const [x,y,w,h]=artwork.sourceRectByToken[token];
        // Each theme uses the same goal windows, with the gold rail intervals
        // kept intact. No tile is independently inset or rounded to pixels.
        nextFrames['referenceTile'+token]=this.makeFrame(texture,x,y,w,h);
      }
      if(!current()){discard();return;}
      // The old board has been removed by the loading view. Commit all nine
      // frames together, then release the preceding theme instead of caching seven.
      this.releaseTheme();this.textures.mural=texture;Object.assign(this.frames,nextFrames);this.images.push(image);
      this.themeImage=image;this.activeTheme=theme;this.themeArtwork=artwork;
      image=null;texture=null;nextFrames={};this.themeLoading=false;this.draw();
    }catch(error){
      discard();if(!current())return;
      console.error('Fourfold theme load failed',error);this.themeLoading=false;this.themeError='星图暂时未能展开';this.draw();
    }
  }
  private validateSceneArtwork(){
    const home=this.manifest?.images?.homeScene,texture=this.textures.home;
    if(!home||home.resource!==HOME_ART.resource||home.width!==HOME_ART.width||home.height!==HOME_ART.height||texture.width!==home.width||texture.height!==home.height)throw new Error('主页原画尺寸与坐标不一致');
    const menu=this.manifest?.images?.homeMenu,menuTexture=this.textures.homeUI;
    if(!menu||menu.resource!==HOME_UI.resource||menu.width!==HOME_UI.width||menu.height!==HOME_UI.height||menuTexture.width!==menu.width||menuTexture.height!==menu.height)throw new Error('主页按钮尺寸与坐标不一致');
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
    if(this.disposed)return;
    this.cancelTurnMotion();
    try{this.puzzle=makePuzzle(mode,key);}catch(e){console.warn('unavailable challenge',e);this.toast('这个日期的挑战暂不可用');if(!this.puzzle){this.puzzle=makePuzzle('story','1');mode='story';key='1';home=true;}else return;}
    this.clearHintGuide();if(this.hintRequest)this.releaseHintRequest(this.hintRequest);
    this.roundSerial++; // 同一关重开也不能领取上一局尚未结束的广告奖励。
    this.mode=mode;this.key=key;this.inHome=home;this.board=this.puzzle.board;this.direction=1;this.moves=0;this.hints=0;this.startAt=0;this.elapsed=0;this.won=false;this.busy=false;this.knobAngles=[0,0,0,0];this.modal='';this.rankSettings=false;this.admiring=false;this.completedRound=-1;this.resultAdvanceRound=-1;this.hideBanner();
    // Keep round changes synchronous: an old victory callback must not advance
    // a second time while the next theme is still arriving.
    if(home){this.themeSerial++;this.themeLoading=false;this.themeError='';this.draw();}else this.prepareTheme(this.roundSerial);
  }
  private goHome(){
    if(this.disposed)return;
    this.clearHintGuide();if(this.hintRequest)this.releaseHintRequest(this.hintRequest);
    this.cancelTurnMotion();this.themeSerial++;this.themeLoading=false;this.themeError='';this.inHome=true;this.modal='';this.rankSettings=false;this.admiring=false;this.hideBanner();this.draw();
  }
  private updateClock(){
    if(this.startAt&&!this.won&&!this.inHome)this.elapsed=(at()-this.startAt)/1000;
    if(this.clockLabel){const value=clock(this.elapsed);for(const label of this.numberLayers.get(this.clockLabel)||[this.clockLabel])label.string=value;}
  }
  private clear(){
    this.uiSerial++;
    this.clearHintVisuals(); // Redraw replaces nodes; the two-step hint itself survives.
    this.cancelTurnMotion();if(this.inHome)this.knobAngles=[0,0,0,0];
    this.rankView=null;
    if(this.pageScroll){this.scrollOffsets[this.pageScrollKey]=Math.max(0,this.pageScroll.getScrollOffset().y);this.pageScroll=null;}
    this.clockLabel=null;this.numberLayers.clear();this.tileNodes=[];this.knobNodes=[];this.knobArtNodes=[];this.boardContent=null;this.toastNode=null;for(const n of [...this.root.children]){n.active=false;n.removeFromParent();n.destroy();}
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
  private numberText(value:string,x:number,y:number,w:number,h:number,size:number,parent:Node=this.root){
    // A thin bronze bevel uses live labels, so the clock remains sharp at every
    // device scale and all highlight layers update with the same real value.
    const g=this.group('Bronze numeral',x,y,w,h,parent),layers:Label[]=[],unit=Math.max(.45,size/36);
    const pass=(name:string,color:string,dy=0,owner=g.content)=>{
      const label=this.txt(value,0,dy,w,h,size,color,true,owner);label.node.name=name;
      label.fontFamily='Times New Roman';label.lineHeight=h;label.enableWrapText=false;layers.push(label);return label;
    };
    pass('Numeral lower shadow','#52291960',.7*unit);
    pass('Numeral fine light edge','#FFF6DCCC',-.45*unit);
    const face=pass('Numeral face','#4E291B');
    const band=(name:string,start:number,end:number,color:string)=>{
      const top=h*start,clip=this.group(name,0,top,w,h*(end-start),g.content),mask=clip.node.addComponent(Mask);mask.type=Mask.Type.RECT;
      pass(name+' face',color,-top,clip.content);
    };
    band('Numeral upper sheen',0,.43,'#956035');
    band('Numeral lower reflection',.64,.78,'#784423');
    const outline=face.node.addComponent(LabelOutline);outline.color=ink('#542D1C66');outline.width=.2*unit;
    this.numberLayers.set(face,layers);return face;
  }
  private art(name:string,x:number,y:number,w:number,h:number,parent:Node=this.root){
    const frame=this.frames[name];if(!frame)throw new Error(`Missing loaded sprite: ${name}`);
    const n=this.createNode(name,x,y,w,h,parent),sprite=n.addComponent(Sprite);sprite.sizeMode=Sprite.SizeMode.CUSTOM;sprite.type=Sprite.Type.SIMPLE;sprite.spriteFrame=frame;
    n.getComponent(UITransform).setContentSize(w,h);return n;
  }
  private bindButton(n:Node,action:()=>unknown,feedback:Node|null=null,allowBusy=false,clickSound=true){
    let pressed=false;
    n.on(Node.EventType.TOUCH_START,(e:any)=>{e.propagationStopped=true;if((this.busy&&!allowBusy)||this.disposed||!n.isValid)return;pressed=true;if(feedback)feedback.active=true;Tween.stopAllByTarget(n);tween(n).to(.06,{scale:new Vec3(.975,.975,1)}).start();});
    n.on(Node.EventType.TOUCH_CANCEL,()=>{pressed=false;if(feedback)feedback.active=false;Tween.stopAllByTarget(n);tween(n).to(.08,{scale:new Vec3(1,1,1)}).start();});
    n.on(Node.EventType.TOUCH_END,(e:any)=>{e.propagationStopped=true;if(!pressed)return;pressed=false;if(feedback)feedback.active=false;Tween.stopAllByTarget(n);n.setScale(1,1,1);if((!this.busy||allowBusy)&&!this.disposed&&n.isValid&&n.activeInHierarchy!==false){const accepted=action();if(clickSound&&accepted!==false)this.playAudio('ui');}});
    return n;
  }
  private artHit(name:string,rect:number[],scale:number,parent:Node,action:()=>void,minTop=-Infinity){
    const [x,y,w,h]=rect.map(v=>v*scale),hitW=Math.max(44*this.windowScale,w),hitH=Math.max(44*this.windowScale,h),left=x+(w-hitW)/2,top=Math.max(minTop,y+(h-hitH)/2);
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
  private drawThemeLoading(){
    this.iconButton('backButton',16,this.safeTop+8,44,()=>this.goHome(),true);
    const center=this.safeTop+(this.height-this.safeTop-this.safeBottom)/2;
    this.txt(this.mode==='daily'?'每日挑战':`第${this.key}关`,35,center-85,this.width-70,48,28,C.dark,true);
    this.txt(this.themeError||'正在展开星图…',35,center-22,this.width-70,34,16,C.muted);
    if(this.themeError)this.btn('重新加载星图',80,center+35,this.width-160,54,()=>this.prepareTheme(this.roundSerial),'creamButton',18);
  }
  private draw(){
    if(this.disposed||!this.root)return;this.clear();
    if(!this.assetsReady){this.drawLoading();return;}
    const homeSurface=this.inHome&&this.modal!=='rank'&&!(this.modal==='settings'&&this.rankSettings);
    const background=homeSurface?HOME_COLORS.background:C.background;
    this.shape(0,0,this.width,this.height,background,'',0);if(this.cam)this.cam.clearColor=ink(background);
    if(this.modal==='rank'||(this.modal==='settings'&&this.rankSettings)){this.drawRankPage();if(this.modal==='settings')this.drawModal();return;}
    if(this.inHome)this.drawHome();else if(this.themeLoading||this.themeError||!this.activeTheme)this.drawThemeLoading();else this.drawGame();
    if(this.modal)this.drawModal();
  }
  private homeGeometry(width:number,height:number){
    // Shared layout dimensions are viewport pixels; convert them back to the
    // native 390-wide logical canvas so fixed spacing and 44px targets agree.
    const scale=this.windowScale,layout=homeLayout(width/scale,height/scale);
    const rect=(r:any)=>({x:r.x*scale,y:r.y*scale,w:r.w*scale,h:r.h*scale});
    return {...layout,contentH:layout.contentH*scale,textScale:layout.textScale*scale,
      hero:rect(layout.hero),image:rect(layout.image),title:rect(layout.title),subtitle:rect(layout.subtitle),
      buttons:layout.buttons.map(rect),buttonArtwork:layout.buttonArtwork.map(rect),buttonLabels:layout.buttonLabels.map(rect),
      buttonFontSizes:layout.buttonFontSizes.map(size=>size*scale),settings:rect(layout.settings)};
  }
  private dailyGeometry(width:number,height:number){
    // Mirror dailyLayout in viewport pixels, then convert to the fixed-width
    // native canvas. Short screens scroll; 44px controls never shrink with it.
    const uiScale=this.windowScale;width/=uiScale;height/=uiScale;
    const box=(x:number,y:number,w:number,h:number)=>({x,y,w,h}),fit=(w:number,sw:number,sh:number)=>w*sh/sw;
    const c=width-16,cardW=(c-8)/2,directionW=(c-8)/2,toolW=(c-8)/2,statsH=fit(cardW,380,181),boardH=fit(c,817,765);
    const directionH=Math.max(44,fit(directionW,412,123)),shareW=c*764/817;
    const toolH=Math.max(44,fit(toolW,401,92)),shareH=Math.max(44,fit(shareW,764,143));
    const regularHeights=[44,fit(c,807,213),statsH,boardH,directionH,toolH,shareH],regularTotal=regularHeights.reduce((a,b)=>a+b,0)+6*6+16;
    const compact=regularTotal>height,gap=compact?3:6,pad=compact?6:8,bannerW=compact?c-72:c,bannerH=fit(bannerW,807,213);
    const heights=compact?[Math.max(44,bannerH),statsH,boardH,directionH,toolH,shareH]:regularHeights,total=heights.reduce((a,b)=>a+b,0)+gap*(heights.length-1)+pad*2;
    let y=pad+Math.max(0,(height-total)/2);
    const rows=heights.map(h=>{const rect=box(8,y,c,h);y+=h+gap;return rect;});
    const bannerRow=compact?rows[0]:rows[1],statsRow=compact?rows[1]:rows[2],boardRow=compact?rows[2]:rows[3],directionRow=compact?rows[3]:rows[4],navY=rows[0].y+(rows[0].h-44)/2;
    const toolRow=compact?rows[4]:rows[5],shareRow=compact?rows[5]:rows[6];
    const hint=box(8,toolRow.y,toolW,toolH),numbers=box(16+toolW,toolRow.y,toolW,toolH),share=box((width-shareW)/2,shareRow.y,shareW,shareH);
    const cw=box(8,directionRow.y,directionW,directionH),ccw=box(16+directionW,directionRow.y,directionW,directionH);
    const layout:any={compact,contentH:Math.max(height,total),back:box(compact?0:8,navY,44,44),settings:box(width-(compact?44:52),navY,44,44),iconWidth:compact?32:40,
      banner:box((width-bannerW)/2,bannerRow.y+(bannerRow.h-bannerH)/2,bannerW,bannerH),moves:box(8,statsRow.y,cardW,statsH),
      timer:box(16+cardW,statsRow.y+(statsH-fit(cardW,379,180))/2,cardW,fit(cardW,379,180)),board:boardRow,
      cw,ccw,hint,numbers,share,appreciate:{...cw},next:{...ccw},details:box((width-toolW)/2,toolRow.y,toolW,toolH)};
    const scaled:any={...layout,contentH:layout.contentH*uiScale,iconWidth:layout.iconWidth*uiScale};
    for(const key of ['back','settings','banner','moves','timer','board','cw','ccw','hint','numbers','share','appreciate','next','details']){
      const r=layout[key];scaled[key]=box(r.x*uiScale,r.y*uiScale,r.w*uiScale,r.h*uiScale);
    }
    return scaled;
  }
  private drawHome(){
    const w=this.width,layout=this.homeGeometry(w,this.height-this.safeTop-this.safeBottom),parent=this.pageContent('Home',layout.contentH);
    const launchStory=()=>this.startGame('story',String(this.unlocked()));
    const entries=[
      {text:homeStoryLabel(this.unlocked()),frame:'homeStoryButton',source:'story',action:launchStory},
      {text:'每日挑战',frame:'homeDailyButton',source:'daily',action:()=>this.startGame('daily',todayCN())},
      {text:'好友荣誉榜',frame:'homeRankButton',source:'rank',action:()=>this.showRank()},
    ];
    // Gold-edged star-map fragments float over the warm cream page. The three
    // menu panels retain independent artwork, live captions and touch regions.
    const hero=layout.hero,scene=this.group('Home hero',hero.x,hero.y,hero.w,hero.h,parent);
    this.art('home',0,0,hero.w,hero.h,scene.content);
    const titleRect=layout.title,subtitleRect=layout.subtitle;
    const title=this.txt('四格诡局',titleRect.x,titleRect.y,titleRect.w,titleRect.h,HOME_ART.titleSize*layout.textScale,HOME_COLORS.title,true,scene.content);
    title.node.name='Home title';title.fontFamily='serif';title.lineHeight=titleRect.h;title.enableWrapText=false;
    const titleOutline=title.node.addComponent(LabelOutline);titleOutline.color=ink('#FFF6E5AA');titleOutline.width=this.windowScale;
    const subtitle=this.txt('FOURFOLD',subtitleRect.x,subtitleRect.y,subtitleRect.w,subtitleRect.h,HOME_ART.subtitleSize*layout.textScale,HOME_COLORS.subtitle,true,scene.content);
    subtitle.node.name='Home subtitle';subtitle.fontFamily='Times New Roman';subtitle.lineHeight=subtitleRect.h;subtitle.enableWrapText=false;
    entries.forEach((entry,i)=>{
      const rect=layout.buttons[i],art=layout.buttonArtwork[i],caption=layout.buttonLabels[i];
      const button=this.group('Home '+entry.source+' entry',rect.x,rect.y,rect.w,rect.h,parent);
      this.art(entry.frame,art.x,art.y,art.w,art.h,button.content);
      const label=this.txt(entry.text,caption.x,caption.y,caption.w,caption.h,layout.buttonFontSizes[i],HOME_COLORS.menu,true,button.content);
      label.node.name='Home menu label';label.fontFamily='serif';label.lineHeight=caption.h;label.enableWrapText=false;
      this.bindButton(button.node,entry.action);
    });
    const settings=layout.settings;this.btn('',settings.x,settings.y,settings.w,settings.h,()=>{this.modal='settings';this.draw();},'settingsButton',16,parent);
  }
  private referenceNumber(value:string,x:number,y:number,w:number,h:number,color=C.dark,parent:Node=this.root){
    if(color===C.dark)return this.numberText(value,x,y,w,h,h*.94,parent);
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
    const w=this.width,u=this.windowScale,available=this.height-this.safeTop-this.safeBottom,top=16*u,buttonH=44*u;
    const contentW=w-16*u,half=(contentW-8*u)/2,statsY=top+60*u,statH=half*this.reference.components.movesCard[3]/this.reference.components.movesCard[2];
    const boardY=statsY+statH+10*u,boardH=contentW*this.reference.boardOuter[3]/this.reference.boardOuter[2];
    const directionY=boardY+boardH+12*u,toolsY=directionY+buttonH+7*u,shareY=toolsY+buttonH+8*u,shareH=52*u;
    const contentH=shareY+shareH+12*u,parent=this.pageContent('Story',Math.max(available,contentH));
    const box=(x:number,y:number,width:number,height:number)=>({x,y,w:width,h:height});
    const layout={cw:box(8*u,directionY,half,buttonH),ccw:box(16*u+half,directionY,half,buttonH),hint:box(8*u,toolsY,half,buttonH),numbers:box(16*u+half,toolsY,half,buttonH),
      appreciate:box(8*u,directionY,half,buttonH),next:box(16*u+half,directionY,half,buttonH),details:box((w-half)/2,toolsY,half,buttonH)};
    this.btn('',8*u,top,buttonH,buttonH,()=>this.goHome(),'backButton',16,parent,true);
    this.btn('',w-52*u,top,buttonH,buttonH,()=>{this.modal='settings';this.draw();},'settingsButton',16,parent,true);
    this.art('creamButton',68*u,top-2*u,w-136*u,52*u,parent);this.txt(`第${this.key}关`,76*u,top+u,w-152*u,44*u,27*u,C.dark,true,parent);
    this.statCard('stepsCard','当前步数',String(this.moves).padStart(2,'0'),8*u,statsY,half,statH,false,parent);
    this.statCard('timeCard','本局用时',clock(this.elapsed),16*u+half,statsY,half,statH,true,parent);
    this.drawBoard(8*u,boardY,contentW,parent);
    if(this.won)this.drawCompletionControls(layout,parent);
    else{
      const round=this.roundSerial,ui=this.uiSerial;
      this.btn('↻ 顺时针',layout.cw.x,layout.cw.y,half,buttonH,()=>this.setDirection(1,round,ui),this.direction===1?'goldButton':'creamButton',17*u,parent);
      this.btn('↺ 逆时针',layout.ccw.x,layout.ccw.y,half,buttonH,()=>this.setDirection(-1,round,ui),this.direction===-1?'goldButton':'creamButton',17*u,parent);
      this.drawHintDirection(layout,parent);
      this.btn(`✧ 提示 ${this.hintsLeft()}/${hintLimit(this.mode)}`,layout.hint.x,toolsY,half,buttonH,()=>this.askHint(),'creamButton',16*u,parent);
      this.drawNumbersControl(layout.numbers,parent);
    }
    this.btn('✦ 发起同关挑战',8*u,shareY,contentW,shareH,()=>this.share(),'goldButton',20*u,parent);
  }
  private drawNumbersControl(rect:any,parent:Node){
    const round=this.roundSerial,ui=this.uiSerial;
    this.btn(this.showNumbers?'隐藏数字':'显示数字',rect.x,rect.y,rect.w,rect.h,()=>this.toggleNumbers(round,ui),'creamButton',16*this.windowScale,parent);
  }
  private nextLevelLabel(){return this.mode==='daily'?'继续闯关':Number(this.key)>=18?'挑战每日关卡':'下一关';}
  private drawCompletionControls(layout:any,parent:Node){
    const round=this.roundSerial,ui=this.uiSerial;
    const button=(text:string,key:string,action:()=>void,skin='creamButton')=>{
      const r=layout[key];this.btn(text,r.x,r.y,r.w,r.h,action,skin,16*this.windowScale,parent);
    };
    button(this.admiring?'返回棋盘':'欣赏星图','appreciate',()=>this.toggleAdmiration(round,ui));
    button(this.nextLevelLabel(),'next',()=>this.nextLevel(round,ui),'goldButton');
    button('成绩详情','details',()=>this.openResultDetails(round,ui));
  }
  private referenceControl(name:string,rect:number[],ox:number,oy:number,scale:number,action:()=>unknown,selected=false,dim=false,parent:Node=this.root,allowBusy=false){
    const [rx,ry,rw,rh]=rect,w=rw*scale,h=rh*scale,hitW=Math.max(44*this.windowScale,w),hitH=Math.max(44*this.windowScale,h);
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
    n.on(Node.EventType.TOUCH_END,(e:any)=>{e.propagationStopped=true;if(!pressed)return;pressed=false;feedback();if((!this.busy||allowBusy)&&!this.disposed&&n.isValid&&n.activeInHierarchy!==false){const accepted=action();if(accepted!==false)this.playAudio('ui');}});
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
    control('back','返回主页',layout.back,()=>this.goHome(),false,false,layout.iconWidth);
    control('settings','设置',layout.settings,()=>{this.modal='settings';this.draw();},false,false,layout.iconWidth);
    // 横幅、信息牌和按钮都是原稿独立裁片；仅各组件内的实时文字覆盖清理区域。
    const banner=piece('banner',layout.banner),date=r.dynamicPatches.date,dateParts=this.key.split('-');
    const dateX=banner.ox+date[0]*banner.scale,dateY=banner.oy+date[1]*banner.scale,dateW=date[2]*banner.scale,dateH=date[3]*banner.scale;
    this.art('referencePatchdate',dateX,dateY,dateW,dateH,parent);
    this.referenceNumber(`${Number(dateParts[1])}月${Number(dateParts[2])}日`,dateX,dateY,dateW,dateH,C.white,parent);
    const moves=layout.moves,timer=layout.timer;
    this.statCard('stepsCard','当前步数',String(this.moves).padStart(2,'0'),moves.x,moves.y,moves.w,moves.h,false,parent);
    this.statCard('timeCard','本局用时',clock(this.elapsed),timer.x,timer.y,timer.w,timer.h,true,parent);
    const board=layout.board;this.drawBoard(board.x,board.y,board.w,parent);
    if(this.won)this.drawCompletionControls(layout,parent);
    else{
      const round=this.roundSerial,ui=this.uiSerial;
      control('clockwise','↻ 顺时针',layout.cw,()=>this.setDirection(1,round,ui),false,this.direction<0);
      control('counterclockwise','↺ 逆时针',layout.ccw,()=>this.setDirection(-1,round,ui),this.direction<0);
      this.drawHintDirection(layout,parent);
      control('hint','✧ 提示',layout.hint,()=>this.askHint(),false,this.hintsLeft()===0&&!this.currentHintGuide());
      const u=this.windowScale,badge={x:layout.hint.x+layout.hint.w-33*u,y:layout.hint.y+layout.hint.h/2-9*u};
      this.shape(badge.x,badge.y,31*u,18*u,C.surface,C.gold2,9*u,parent);
      this.txt(`${this.hintsLeft()}/${hintLimit(this.mode)}`,badge.x,badge.y,31*u,18*u,11*u,this.hintsLeft()?C.dark:C.muted,true,parent);
      this.drawNumbersControl(layout.numbers,parent);
    }
    control('share','✦ 发起同关挑战',layout.share,()=>this.share());
  }
  private drawBoard(x:number,y:number,width:number,parent:Node=this.root){
    const outer=this.reference.boardOuter,scale=width/outer[2],height=outer[3]*scale;
    this.art('referenceBoardFrame',x,y,width,height,parent);
    this.drawReferenceBoard(x-outer[0]*scale,y-outer[1]*scale,scale,parent);
  }
  private drawReferenceBoard(ox:number,oy:number,scale:number,parent:Node=this.root){
    const r=this.reference,a=r.tileArea,w=a[2]*scale,h=a[3]*scale,bx=ox+a[0]*scale,by=oy+a[1]*scale;
    this.boardLayout={x:bx,y:by,size:w,unit:w/3,height:h};
    // Cover the full inner opening, including the original artwork's rounded
    // corners outside tileArea. This clean bed is the only opaque blue underlay.
    const bed=r.boardBed,p=bed.rect;
    this.shape(ox+p[0]*scale,oy+p[1]*scale,p[2]*scale,p[3]*scale,bed.color,'',bed.cornerRadius*scale,parent).name='Clean board bed';
    const boardLayer=this.group('Reference board',bx,by,w,h,parent),mask=boardLayer.node.addComponent(Mask);mask.type=Mask.Type.RECT;this.boardContent=boardLayer.content;
    if(this.won&&this.admiring){
      // The full, unchanged theme frame occupies the same inner opening. No
      // tile masks, rails, knobs or labels are built over the approved artwork.
      this.art('mural',0,0,w,h,boardLayer.content).name='Complete mural';return;
    }
    this.cleanBoardRails(scale,boardLayer.content);
    for(let i=0;i<9;i++){
      const p=r.slotRects[i],token=Number(this.board[i]),tw=p[2]*scale,th=p[3]*scale;
      const tile=this.group('Tile '+token,(p[0]-a[0])*scale,(p[1]-a[1])*scale,tw,th,boardLayer.content);
      const radius=Math.min(r.tileSurface.cornerRadius*scale,Math.min(tw,th)/2),clip=tile.node.addComponent(Mask);clip.type=Mask.Type.GRAPHICS_STENCIL;
      const stencil=tile.node.getComponent(Graphics)||tile.node.addComponent(Graphics);stencil.clear();stencil.fillColor=ink('#FFFFFF');stencil.roundRect(-tw/2,-th/2,tw,th,radius);stencil.fill();
      this.art('referenceTile'+token,0,0,tw,th,tile.content);
      this.tileSurface(tw,th,radius,r.tileSurface.rimInset*scale,scale,tile.content);
      this.tileIndex(token,tw,th,scale,tile.content);this.tileNodes[i]=tile.node;
    }
    for(let q=0;q<4;q++){
      const center=r.knobCenters[q],crop=r.knobCropRects[q],d=r.knobClipRadius*2*scale,hitD=Math.max(44*this.windowScale,d);
      const cx=(center[0]-a[0])*scale,cy=(center[1]-a[1])*scale;
      const hit=this.group('Rotate '+q,cx-hitD/2,cy-hitD/2,hitD,hitD,boardLayer.content);
      const circle=this.group('Knob circle',(hitD-d)/2,(hitD-d)/2,d,d,hit.content),clip=circle.node.addComponent(Mask);clip.type=Mask.Type.ELLIPSE;clip.segments=64;
      const cw=crop[2]*scale,ch=crop[3]*scale,knob=this.art('referenceKnob'+q,(d-cw)/2,(d-ch)/2,cw,ch,circle.content);
      if(this.direction<0)knob.setScale(-1,1,1);knob.angle=-this.knobAngles[q];this.knobNodes[q]=hit.node;this.knobArtNodes[q]=knob;this.bindButton(hit.node,()=>this.spin(q),null,false,false);
    }
    this.drawHintTarget(scale,boardLayer.content);
  }
  private tileIndex(token:number,w:number,h:number,scale:number,parent:Node){
    if(!this.showNumbers)return;
    // The token stays separate from the illustration; its inset also leaves
    // room for the 48px source-radius knobs at the inner grid intersections.
    const width=38*scale,height=52*scale,right=36*scale,bottom=14*scale;
    const theme=this.activeTheme;
    const label=this.txt(String(token),w-right-width,h-bottom-height,width,height,44*scale,theme?.indexColor||'#FFF2C5',true,parent);
    label.node.name='Tile index '+token;label.fontFamily='Times New Roman';label.isItalic=true;label.lineHeight=height;label.enableWrapText=false;
    label.enableShadow=true;label.shadowColor=ink(theme?.indexShadowColor||'#080E29C2');label.shadowOffset=new Vec2(0,-1.6*scale);label.shadowBlur=1.2*scale;
    const outline=label.node.addComponent(LabelOutline);outline.color=ink(theme?.indexOutlineColor||'#0F193099');outline.width=1.2*scale;
  }
  private cleanBoardRails(scale:number,parent:Node){
    const r=this.reference,a=r.tileArea,slots=r.slotRects;
    const bands=[{end:.16,color:'#8D522E'},{end:.34,color:'#C98C50'},{end:.58,color:'#F9D698'},{end:.8,color:'#E7B06F'},{end:1,color:'#D18C51'}];
    const rail=(name:string,x:number,y:number,w:number,h:number,vertical:boolean)=>{
      const g=this.group(name,x*scale,y*scale,w*scale,h*scale,parent);let from=0;
      for(const band of bands){
        const start=from,span=band.end-start;from=band.end;
        const bx=vertical?w*start:0,by=vertical?0:h*start,bw=vertical?w*span:w,bh=vertical?h:h*span;
        this.shape(bx*scale,by*scale,bw*scale,bh*scale,band.color,'',0,g.content).name=name+' metal band';
      }
    };
    // Do not sample neighbouring artwork into the rails. Only clean,
    // procedural metal remains beneath the movable illustrated cards.
    for(let i=0;i<2;i++){
      const x=slots[i][0]+slots[i][2],nextX=slots[i+1][0],row=i*3,y=slots[row][1]+slots[row][3],nextY=slots[row+3][1];
      rail('Clean vertical rail '+i,x-a[0],0,nextX-x,a[3],true);
      rail('Clean horizontal rail '+i,0,y-a[1],a[2],nextY-y,false);
    }
  }
  private tileSurface(w:number,h:number,radius:number,inset:number,scale:number,parent:Node){
    // Each movable card has its own enamel finish. All layers stay inside the
    // existing round mask, so neither image UVs nor solved-image alignment move.
    const rounded=(name:string,pad:number,color:string,width:number)=>{
      const g=this.createNode(name,0,0,w,h,parent).addComponent(Graphics);
      g.roundRect(-w/2+pad,-h/2+pad,w-pad*2,h-pad*2,Math.max(1,radius-pad));g.strokeColor=ink(color);g.lineWidth=width;g.stroke();
    };
    const accent=(name:string,x1:number,y1:number,x2:number,y2:number,color:string,width=1.4*scale)=>{
      const path=this.createNode(name,0,0,w,h,parent).addComponent(Graphics);
      path.moveTo(x1,y1);path.lineTo(x2,y2);path.strokeColor=ink(color);path.lineWidth=width;path.stroke();
    };
    // Low-opacity diagonal bands approximate the same upper-left reflection as
    // the web finish without another texture or any noise over the star map.
    const clipBand=(points:any[],bound:number,above:boolean)=>{
      const out:any[]=[];
      for(let i=0;i<points.length;i++){
        const a=points[i],b=points[(i+1)%points.length],da=a.x+a.y-bound,db=b.x+b.y-bound,insideA=above?da>=0:da<=0,insideB=above?db>=0:db<=0;
        if(insideA)out.push(a);
        if(insideA!==insideB){const t=da/(da-db);out.push({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t});}
      }
      return out;
    };
    const sheen=(name:string,start:number,end:number,color:string)=>{
      const points=clipBand(clipBand([{x:0,y:0},{x:1,y:0},{x:1,y:1},{x:0,y:1}],start,true),end,false);
      const g=this.createNode(name,0,0,w,h,parent).addComponent(Graphics);
      points.forEach((p:any,i:number)=>{const x=p.x*w-w/2,y=h/2-p.y*h;if(i)g.lineTo(x,y);else g.moveTo(x,y);});
      g.lineTo(points[0].x*w-w/2,h/2-points[0].y*h);g.fillColor=ink(color);g.fill();
    };
    sheen('Tile enamel upper reflection',0,.26,'#FFF7DC18');
    sheen('Tile enamel soft reflection',.26,.56,'#DCE8FF08');
    sheen('Tile enamel reflection falloff',.56,.9,'#DCE8FF02');
    sheen('Tile enamel lower falloff',1.56,1.8,'#060D2C0D');
    sheen('Tile enamel lower reflection',1.8,2,'#060D2C25');
    this.shape(0,h-11.8*scale,w,7*scale,'#07112B32','',0,parent).name='Tile lower soft shade';
    this.shape(0,h-4.8*scale,w,4.8*scale,'#5B3C30C9','',0,parent).name='Tile copper thickness';
    rounded('Tile satin rim',1.5*scale,'#67422ED9',1.8*scale);
    accent('Tile upper bevel',-w/2+radius,h/2-1.5*scale,w/2-radius,h/2-1.5*scale,'#B18C5B70',3*scale);
    accent('Tile upper champagne edge',-w/2+radius,h/2-1.5*scale,w/2-radius,h/2-1.5*scale,'#F7E0AFBF',1.8*scale);
    accent('Tile left champagne edge',-w/2+1.5*scale,-h/2+radius,-w/2+1.5*scale,h/2-radius,'#F7E0AFBF',1.8*scale);
    rounded('Tile inner rim',inset,'#D9BC8570',1.4*scale);
    accent('Tile upper light',-w/2+radius,h/2-inset,w/2-radius,h/2-inset,'#FFE6AC8C');
    accent('Tile lower shade',-w/2+radius,-h/2+inset,w/2-radius,-h/2+inset,'#5B392BD9');
    accent('Tile right shade',w/2-inset,-h/2+radius,w/2-inset,h/2-radius,'#85543280');
    rounded('Tile navy edge',.6*scale,'#0B1535D9',1.2*scale);
  }
  private spin(q:number){
    if(this.disposed||this.inHome||this.won||this.modal||this.busy||!this.assetsReady||this.themeLoading||this.themeError||!this.activeTheme||!Number.isInteger(q)||!SQUARES[q]||!this.boardContent)return;
    const guide=this.currentHintGuide();
    if(guide?.stage==='direction'){this.toast(this.hintGuideMessage(guide));return;}
    const squares=SQUARES[q],tiles=squares.map(index=>this.tileNodes[index]),knob=this.knobArtNodes[q],hit=this.knobNodes[q];
    if(tiles.some(node=>!node?.isValid)||!knob?.isValid||!hit?.isValid)return;
    const rects=tiles.map(node=>{const t=node.getComponent(UITransform);return {x:node.position.x-t.width/2,y:-node.position.y-t.height/2,width:t.width,height:t.height};});
    const geometry=createTurnMotion(rects,this.direction,{x:hit.position.x,y:-hit.position.y});
    this.clearHintGuide(); // Any chosen turn consumes the shown guidance, never another allowance.
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
    this.turnMotion=motion;this.applyTurnFrame(motion,0);this.playAudio('turn');
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
    // 唯一提交点：整段动画完成后再更新棋盘与步数，不排队补跑连续点击。
    const next=rotate(motion.board,motion.q,motion.dir),angle=(motion.knobStart+motion.dir*90)%360;
    this.cancelTurnMotion(false);this.knobAngles[motion.q]=angle;this.board=next;this.moves++;
    if(isSolved(this.board)){this.won=true;this.elapsed=(at()-this.startAt)/1000;this.complete(motion.round);}
    this.draw();
  }
  private cancelTurnMotion(restore=true){
    this.stopAudio('turn');
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
  private onAppHide=()=>{this.audioHidden=true;this.cancelTurnMotion();this.stopAudio();};
  private onAppShow=()=>{if(!this.disposed)this.audioHidden=false;};
  onEnable(){this.audioDisabled=false;}
  onDisable(){this.audioDisabled=true;this.cancelTurnMotion();this.stopAudio();}
  private toggleNumbers(round=this.roundSerial,ui=this.uiSerial){
    if(this.disposed||this.inHome||this.won||this.modal||this.busy||round!==this.roundSerial||ui!==this.uiSerial||this.themeLoading||this.themeError||!this.activeTheme)return false;
    this.showNumbers=!this.showNumbers;this.storeWrite('showNumbers',this.showNumbers);this.draw();return true;
  }
  private completedRoundCurrent(round:number){
    return !this.disposed&&!this.inHome&&round===this.roundSerial&&this.completedRound===round&&this.won&&isSolved(this.board);
  }
  private toggleAdmiration(round=this.roundSerial,ui=this.uiSerial){
    if(!this.completedRoundCurrent(round)||ui!==this.uiSerial||this.modal||this.busy||this.themeLoading||this.themeError||!this.activeTheme)return false;
    this.admiring=!this.admiring;this.draw();return true;
  }
  private openResultDetails(round=this.roundSerial,ui=this.uiSerial){
    if(!this.completedRoundCurrent(round)||ui!==this.uiSerial||this.modal||this.busy)return false;
    this.modal='result';this.hideBanner();this.draw();this.showBanner();return true;
  }
  private complete(round=this.roundSerial){
    // update() marks won before calling this. The separate round marker guards
    // storage, unlocks and cloud upload without suppressing the first record.
    if(this.disposed||this.inHome||round!==this.roundSerial||this.completedRound===round||!this.won||!this.puzzle||!isSolved(this.board))return false;
    this.clearHintGuide();if(this.hintRequest)this.releaseHintRequest(this.hintRequest);
    this.completedRound=round;this.admiring=false;this.modal='';this.hideBanner();
    const result={moves:this.moves,par:this.puzzle.par,seconds:Math.floor(this.elapsed),hints:this.hints,score:resultScore(this.moves,this.elapsed,this.hints),day:this.key};
    const prev=this.storeRead('best:'+this.storageKey(),null);
    const best=isBetterResult(result,prev)?result:{...prev,score:resultScore(prev.moves,prev.seconds,prev.hints)};
    this.storeWrite('best:'+this.storageKey(),best);
    if(this.mode==='story')this.storeWrite('unlocked',Math.max(this.unlocked(),Math.min(18,Number(this.key)+1)));
    if(this.mode==='daily'&&this.key===todayCN())this.uploadScore(best);
    wxSDK()?.vibrateShort?.({type:'light'});return true;
  }
  private uploadScore(result:any){
    const sdk=wxSDK();if(!sdk?.setUserCloudStorage)return;
    const value=[todayCN(),String(result.score),String(result.moves),String(result.seconds)].join('|');
    try{sdk.setUserCloudStorage({KVDataList:[{key:KEY,value}],fail:(e:any)=>console.warn('ranking cloud sync unavailable',e)});}catch(e){console.warn('ranking cloud sync failed',e);}
  }
  private nextLevel(round=this.roundSerial,ui=this.uiSerial){
    // Only explicit next buttons use this route. Each captures its rendered
    // round and view, so double taps or an old dialog cannot advance again.
    if(!this.completedRoundCurrent(round)||ui!==this.uiSerial||this.resultAdvanceRound===round||(this.modal!==''&&this.modal!=='result'))return false;
    this.resultAdvanceRound=round;
    if(this.mode==='daily')this.startGame('story',String(this.unlocked()));
    else if(Number(this.key)<18)this.startGame('story',String(Number(this.key)+1));
    else this.startGame('daily',todayCN());
    if(this.roundSerial===round)this.resultAdvanceRound=-1; // 日期不可用时保留重试机会。
    return this.roundSerial!==round;
  }
  private clearHintVisuals(){
    for(const node of this.hintVisualNodes)if(node.isValid){node.active=false;node.removeFromParent();node.destroy();}
    this.hintVisualNodes=[];
  }
  private clearHintGuide(){this.hintGuide=null;this.clearHintVisuals();}
  private currentHintGuide(){
    const guide=this.hintGuide;
    if(guide&&(guide.round!==this.roundSerial||guide.board!==this.board||this.inHome||this.won||this.disposed)){this.clearHintGuide();return null;}
    return guide;
  }
  private hintGuideMessage(guide=this.currentHintGuide()){
    return guide?.stage==='direction'?`先点击高亮的${guide.dir===1?'顺时针':'逆时针'}`:'再点击高亮旋转点';
  }
  private showHintGuide(){
    const guide=this.currentHintGuide();if(!guide)return;
    this.draw();this.toast(this.hintGuideMessage(guide));
  }
  private drawHintOutline(name:string,rect:any,parent:Node,radius=12*this.windowScale){
    const {x,y,w,h}=rect,u=this.windowScale,node=this.createNode(name,x,y,w,h,parent),g=node.addComponent(Graphics),inset=4*u;
    g.roundRect(-w/2+inset,-h/2+inset,Math.max(1,w-2*inset),Math.max(1,h-2*inset),Math.max(1,Math.min(radius,Math.min(w,h)/2-inset)));
    g.fillColor=ink('#FFE7A90D');g.fill();g.strokeColor=ink('#FFD16B80');g.lineWidth=7*u;g.stroke();g.strokeColor=ink('#FFF0BD');g.lineWidth=2.4*u;g.stroke();
    this.hintVisualNodes.push(node);return node;
  }
  private drawHintDirection(layout:any,parent:Node){
    const guide=this.currentHintGuide();if(guide?.stage!=='direction')return;
    this.drawHintOutline('Hint direction '+guide.dir,guide.dir===1?layout.cw:layout.ccw,parent,17*this.windowScale);
  }
  private drawHintTarget(scale:number,parent:Node){
    const guide=this.currentHintGuide();if(guide?.stage!=='target')return;
    const r=this.reference,a=r.tileArea,rects=SQUARES[guide.q].map(index=>r.slotRects[index]);
    const left=Math.min(...rects.map(p=>p[0])),top=Math.min(...rects.map(p=>p[1])),right=Math.max(...rects.map(p=>p[0]+p[2])),bottom=Math.max(...rects.map(p=>p[1]+p[3]));
    this.drawHintOutline('Hint target region',{x:(left-a[0])*scale,y:(top-a[1])*scale,w:(right-left)*scale,h:(bottom-top)*scale},parent);
    const center=r.knobCenters[guide.q],d=r.knobClipRadius*2*scale+12*this.windowScale;
    this.drawHintOutline('Hint target knob '+guide.q,{x:(center[0]-a[0])*scale-d/2,y:(center[1]-a[1])*scale-d/2,w:d,h:d},parent,d/2);
  }
  private setDirection(direction:number,round=this.roundSerial,ui=this.uiSerial){
    if(this.disposed||this.inHome||this.won||this.modal||this.busy||round!==this.roundSerial||ui!==this.uiSerial||!this.assetsReady||this.themeLoading||this.themeError||!this.activeTheme||(direction!==1&&direction!==-1))return false;
    this.direction=direction;const guide=this.currentHintGuide();
    // Even an already-selected direction needs an explicit click to advance.
    if(guide)guide.stage=direction===guide.dir?'target':'direction';
    this.draw();if(guide)this.toast(this.hintGuideMessage(guide));return true;
  }
  private hintsLeft(){return Math.max(0,hintLimit(this.mode)-this.hints);}
  private applyHint(){
    if(this.won||this.disposed||this.inHome||this.busy||this.modal||!this.assetsReady||this.themeLoading||this.themeError||!this.activeTheme)return;
    if(this.currentHintGuide()){this.showHintGuide();return;}
    if(!this.hintsLeft()){this.toast(`本局 ${hintLimit(this.mode)} 次提示已用完`);return;}
    const path=shortestPath(this.board);if(!path.length)return;
    this.hints++;this.hintGuide={q:path[0].q,dir:path[0].dir,stage:'direction',round:this.roundSerial,board:this.board};this.showHintGuide();
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
    if(this.disposed||this.won||this.inHome||this.busy||this.modal||!this.assetsReady||this.themeLoading||this.themeError||!this.activeTheme)return;
    if(this.currentHintGuide()){this.showHintGuide();return;}
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
    const centeredNumber=(value:string,point:number[],width:number,lineHeight:number,size:number)=>this.numberText(value,(point[0]-width/2)*scale,(point[1]-lineHeight/2)*scale,width*scale,lineHeight*scale,size*scale,parent);
    centeredNumber(hasBest?String(best.moves):'—',r.bestMoves,230,86,68);
    centeredNumber(hasBest?clock(Number(best.seconds)):'—:—',r.bestTime,280,86,62);
    const sdk=wxSDK(),canUseFriends=typeof sdk?.getOpenDataContext==='function'&&!!this.rankTemplate;
    const empty=(title:string,note:string)=>{
      for(const slot of r.podium){centered('—',slot.name,170,44,29);centeredNumber('— 步',slot.moves,165,42,29);centeredNumber('—:—',slot.time,165,44,31);}
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
  private closeModal(round=this.roundSerial,ui=this.uiSerial){
    if(this.disposed||round!==this.roundSerial||ui!==this.uiSerial||!this.modal)return false;
    this.modal=this.modal==='settings'&&this.rankSettings?'rank':'';this.rankSettings=false;this.hideBanner();this.draw();return true;
  }
  private drawModal(){
    if(this.modal==='result'){this.drawResultModal();return;}
    const w=this.width,h=this.height,round=this.roundSerial,ui=this.uiSerial,close=()=>this.closeModal(round,ui);
    const shade=this.shape(0,0,w,h,'#32201CCB','',0);shade.addComponent(BlockInputEvents);shade.on(Node.EventType.TOUCH_END,close);
    const top=Math.max(this.safeTop+24,(h-456)/2),height=456;
    const panel=this.shape(24,top,w-48,height,C.surface,C.edge,20);panel.addComponent(BlockInputEvents);
    this.btn('×',w-69,top+12,35,35,close,'creamButton',21);
    if(this.modal==='settings'){
      this.txt('设置',62,top+29,w-124,44,28,C.dark,true);
      if(!this.inHome)this.btn('重新开始本关',43,top+110,w-86,54,()=>this.startGame(this.mode,this.key),'goldButton',18);
      this.btn('好友荣誉榜',43,top+(this.inHome?112:180),w-86,54,()=>this.showRank(),'creamButton',18);
      this.btn(this.inHome?'进入星图':'返回主页',43,top+250,w-86,54,()=>{if(this.inHome)this.startGame('story',String(this.unlocked()));else this.goHome();},'creamButton',18);
      this.btn(this.soundEnabled?'音效：开':'音效：关',86,top+312,w-172,44,()=>this.toggleSound(round,ui),'creamButton',17);
      this.btn('继续',86,top+366,w-172,45,()=>this.closeModal(),'creamButton',17);
    }
  }
  private drawResultModal(){
    const r=this.rankLayout.result,round=this.roundSerial,ui=this.uiSerial,advance=()=>this.nextLevel(round,ui),close=()=>this.closeModal(round,ui);
    const available=Math.max(1,this.height-this.safeTop-this.safeBottom),scale=Math.min((this.width-24)/r.width,Math.max(1,available-20)/r.height);
    const width=r.width*scale,height=r.height*scale,left=(this.width-width)/2,top=this.safeTop+Math.max(0,(available-height)/2);
    const shade=this.shape(0,0,this.width,this.height,'#211A32C9','',0);shade.addComponent(BlockInputEvents);shade.on(Node.EventType.TOUCH_END,close);
    const panel=this.group('Result artwork',left,top,width,height);panel.node.addComponent(BlockInputEvents);this.art('resultPanel',0,0,width,height,panel.content);
    const text=(value:string,key:string,size:number,color=C.dark,bold=true)=>{const p=r[key];return this.txt(value,p[0]*scale,p[1]*scale,p[2]*scale,p[3]*scale,size*scale,color,bold,panel.content);};
    text('星图已复原','title',78,C.white);
    text(honor(this.moves,this.puzzle.par,this.hints),'honor',44);
    text('当前步数','movesLabel',38);text('本局用时','timeLabel',38);
    for(const [value,key,size] of [[String(this.moves).padStart(2,'0'),'movesValue',78],[clock(this.elapsed),'timeValue',73]] as any){const p=r[key];this.numberText(value,p[0]*scale,p[1]*scale,p[2]*scale,p[3]*scale,size*scale,panel.content);}
    text(`最优步数 ${this.puzzle.par} 步`,'note',38,C.muted,false);
    const primary=this.nextLevelLabel();
    text(primary,'primary',63);text('分享此关给好友','share',44);
    this.artHit('Result close',r.close,scale,panel.content,close);
    const primaryHit=this.artHit('Result next',r.primary,scale,panel.content,advance);
    // 小尺寸时分享按钮的点击区向下扩展，和上一个44px点击区保持间隔。
    this.artHit('Result share',r.share,scale,panel.content,()=>{if(this.modal==='result'&&this.roundSerial===round&&this.uiSerial===ui)this.share();},primaryHit.y+primaryHit.h+2);
  }
  private toast(message:string){
    if(!this.root)return;if(this.toastNode){this.toastNode.active=false;this.toastNode.destroy();}
    const y=this.height-this.safeBottom-154,g=this.group('Toast',25,y,this.width-50,50);this.toastNode=g.node;
    this.shape(0,0,this.width-50,50,C.surface,C.edge,15,g.content);this.txt(message,10,3,this.width-70,44,13,C.dark,true,g.content);
    this.scheduleOnce(()=>{if(this.toastNode===g.node)this.toastNode=null;if(g.node.isValid)g.node.destroy();},2.5);
  }
  onDestroy(){
    this.disposed=true;this.clearHintGuide();this.cancelTurnMotion();this.roundSerial++;screen.off('window-resize',this.onWindowResize,this);this.loadSerial++;
    this.disposeAudio();
    for(const cancel of [...this.pendingResourceLoads])cancel();
    try{this.hideSDK?.offHide?.(this.onAppHide);this.hideSDK?.offShow?.(this.onAppShow);}catch{}this.hideSDK=null;
    if(this.audioLifecycleAttached){engineGame.off(EngineGame.EVENT_HIDE,this.onAppHide,this);engineGame.off(EngineGame.EVENT_SHOW,this.onAppShow,this);this.audioLifecycleAttached=false;}
    if(this.hintRequest)this.releaseHintRequest(this.hintRequest);
    this.hideBanner();try{this.rewardAd?.destroy?.();}catch{}this.rewardAd=null;
    // This canvas is a scene child, not a child of the component's own node.
    // Remove its renderers before destroying the textures they still reference.
    if(this.canvasNode?.isValid){this.canvasNode.active=false;this.canvasNode.removeFromParent();this.canvasNode.destroy();}
    this.disposeArt();
  }
}
