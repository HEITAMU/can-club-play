// @ts-nocheck
// Cocos Creator 3.8.8 entry. The editor, Web and WeChat builds all use this scene.
import './platform/Compatibility';
import { _decorator, Component, Node, Scene, Canvas, Camera, Layers, UITransform, Label, Button, ScrollView, BlockInputEvents, Graphics, Vec2, Vec3, Color, Director, director, view, ResolutionPolicy, input, Input, KeyCode, isValid } from 'cc';
import { GameSession } from './game/GameSession';
import { createSessionServices } from './platform/Services';
import { platform } from './platform/Platform';
import { readClipboard, importSaveFile, exportSaveFile } from './platform/SaveTransfer';
import { audio } from './platform/Audio';
import { assets } from './render/Assets';
import { UI, color, worldRect, fmt } from './render/UI';
import { BattleView } from './render/BattleView';
import { Pages } from './ui/Pages';
import { Dialogs, groupFor } from './ui/Dialogs';
import { CATS, unlocked } from './domain/core';
import { carrierId } from './domain/carrier-art';
import { paintedAtlasFor } from './render/PaintedActor';
import { skillAudioEvents } from './domain/sound-effects';
import { guideCardTop, guideNumber } from './domain/onboarding';
const {ccclass} = _decorator;
// Page-only artwork is requested by its native UI when that page first opens.
// Keep battle, navigation and rescue assets ready without decoding every page.
const COMMON_ART = ['painted/items.webp','ui/income-stall-v0272.webp','materials/harbor-materials-v02641.webp','ui/critical-physical-v02658.webp','ui/critical-magic-v02658.webp','vfx/effects-v0216.webp','vfx/can-rescue-v0192.webp'].map(p=>'assets/'+p);
const allNodes = (root:Node):Node[] => [root,...root.children.flatMap(allNodes)];
const afterDraw = () => new Promise<void>(resolve=>director.once(Director.EVENT_AFTER_DRAW,resolve));
let currentApp:any = null, starting:Promise<any>|null = null;

@ccclass('CanClubRuntime')
class CanClubRuntime extends Component {
  ui=new UI();session:GameSession;services:any;pages:Pages;dialogs:Dialogs;battleView:BattleView;
  w=390;h=844;safeTop=0;safeBottom=0;pageH=793;navH=51;ready=false;destroyed=false;
  canvasNode:Node;canvas:Canvas;camera:Camera;root:Node;battleRoot:Node;pageRoot:Node;navRoot:Node;modalRoot:Node;guideRoot:Node;toastRoot:Node;loadingRoot:Node;entranceRoot:Node;
  modal:any=null;dirty=true;guideDirty=true;navDirty=true;resizePending=false;loadSerial=0;loadMessage:Label;loadProgress:Label;loadingRetry:Node;
  toastUntil=0;toastText='';lastPage='';lastModal='';guideTarget='';guideTouchAt=-10;lastEntrance=false;lastIssueCount=0;retryRequest:any=null;
  private disposers:Function[]=[];
  initialize(scene:Scene){
    this.services=createSessionServices();this.session=new GameSession(this.services);this.session.setLoading(true);
    this.canvasNode=new Node('Canvas');scene.addChild(this.canvasNode);this.canvasNode.layer=Layers.Enum.UI_2D;this.canvasNode.addComponent(UITransform);
    this.canvas=this.canvasNode.addComponent(Canvas);
    const cameraNode=new Node('Camera');this.canvasNode.addChild(cameraNode);cameraNode.setPosition(0,0,1000);this.camera=cameraNode.addComponent(Camera);this.camera.projection=Camera.ProjectionType.ORTHO;this.camera.clearFlags=Camera.ClearFlag.SOLID_COLOR;this.camera.clearColor=color('#293f51');this.camera.near=.1;this.camera.far=2000;this.camera.visibility=Layers.Enum.UI_2D;this.canvas.cameraComponent=this.camera;
    const cb={open:(type,data)=>this.open(type,data),close:()=>this.close(),closeReport:action=>this.closeReport(action),refresh:()=>this.refresh(),toast:t=>this.toast(t),getClipboard:()=>this.transfer(readClipboard),setClipboard:text=>this.transfer(()=>platform.clipboard(text),'存档文字已复制'),exportSave:text=>this.transfer(()=>exportSaveFile(text)),importSave:()=>this.transfer(importSaveFile),share:()=>this.transfer(()=>platform.share())};
    this.pages=new Pages(this.ui,this.session,cb);this.dialogs=new Dialogs(this.ui,this.session,cb);this.cb=cb;
    this.ui.onSound=kind=>{this.configureAudio();audio.unlock();audio.play(kind);};
    this.ui.onAction=name=>{if(name.startsWith('tab-'))audio.play('nav-'+(name.slice(4)==='bag'?'relics':name.slice(4)));};
    this.disposers.push(this.session.subscribe(e=>this.sessionEvent(e)),platform.onHide(()=>{this.session.setHidden(true);this.configureAudio();}),platform.onShow(()=>{this.session.setHidden(false);this.configureAudio();}));
    input.on(Input.EventType.TOUCH_START,this.unlock,this);input.on(Input.EventType.KEY_DOWN,this.key,this);view.on('canvas-resize',this.resize,this);
    this.buildLayout();if(this.session.navigation)this.navigate(this.session.navigation);if(this.session.notice)this.toast(this.session.notice);this.render();
  }
  unlock(){this.configureAudio();audio.unlock();}
  key(e){this.unlock();if(e.keyCode===KeyCode.ESCAPE&&!this.session.guideActive){if(this.modal)this.dialogs.dismiss();else if(this.session.report)this.closeReport();}}
  resize(){this.resizePending=true;}
  configureAudio(){audio.configure({music:this.session.state.music,effects:this.session.state.sound,hidden:this.session.hidden,scene:this.session.tab==='battle'&&!this.visibleModal()?'battle':'alley'});}
  buildLayout(){
    const frame=view.getFrameSize(),ratio=frame.height/Math.max(1,frame.width),portrait=ratio>1.2;
    this.h=portrait?Math.max(620,Math.min(1020,Math.round(390*ratio))):844;
    view.setDesignResolutionSize(this.w,this.h,portrait&&ratio<2.62?ResolutionPolicy.FIXED_WIDTH:ResolutionPolicy.SHOW_ALL);
    const visible=view.getVisibleSize();this.h=visible.height;this.w=visible.width;this.safeTop=0;this.safeBottom=0;
    const wx=(globalThis as any).wx;if(wx){const win=wx.getWindowInfo?.()||wx.getSystemInfoSync?.(),safe=platform.safeArea(),scale=this.w/Math.max(1,win?.windowWidth||this.w);if(safe){this.safeTop=Math.max(0,safe.top*scale);this.safeBottom=Math.max(0,((win?.windowHeight||0)-safe.bottom)*scale);}const capsule=wx.getMenuButtonBoundingClientRect?.();if(capsule)this.safeTop=Math.max(this.safeTop,(capsule.bottom+5)*scale);}
    this.navH=this.h<=740?46:51;this.pageH=this.h-this.navH-this.safeBottom-this.safeTop;this.camera.orthoHeight=this.h/2;
    this.canvasNode.getComponent(UITransform).setContentSize(this.w,this.h);this.canvasNode.setPosition(this.w/2,this.h/2,0);
    if(this.root)this.ui.clear(this.root);else this.root=this.ui.group(this.canvasNode,-this.w/2,-this.h/2,this.w,this.h,'can-club');
    this.root.setPosition(-this.w/2,this.h/2);this.root.getComponent(UITransform).setContentSize(this.w,this.h);
    this.ui.panel(this.root,0,0,this.w,this.h,{fill:'#293f51',stroke:'#00000000',radius:0});
    this.battleRoot=this.ui.group(this.root,0,this.safeTop,this.w,this.pageH,'battle-page');this.pageRoot=this.ui.group(this.root,0,this.safeTop,this.w,this.pageH,'other-page');
    this.navRoot=this.ui.group(this.root,0,this.h-this.navH-this.safeBottom,this.w,this.navH+this.safeBottom,'bottom-navigation');
    this.entranceRoot=this.ui.group(this.root,0,this.safeTop,this.w,this.pageH,'battle-entrance');this.modalRoot=this.ui.group(this.root,0,this.safeTop,this.w,this.h-this.safeTop-this.safeBottom,'dialogs');
    this.guideRoot=this.ui.group(this.root,0,0,this.w,this.h,'tutorial');this.toastRoot=this.ui.group(this.root,0,0,this.w,this.h,'notifications');this.loadingRoot=this.ui.group(this.root,0,0,this.w,this.h,'loading');
    this.battleView=new BattleView(this.ui,this.session,this.battleRoot,this.w,this.pageH,this.cb);this.ui.fullBodyUnit=this.battleView.unit;if(this.retryRequest){this.battleView.bindBattle();this.battleView.showRetry(this.retryRequest);}
    this.dirty=this.navDirty=this.guideDirty=true;this.lastPage='';this.lastModal='';this.lastEntrance=false;this.renderLoading();if(this.toastText)this.paintToast();
  }
  visibleModal(){return this.modal?.type || (this.session.report?'report':this.session.intro?'intro':'');}
  open(type:string,data:any={}){if(type==='pause')this.session.pause();this.modal={type,data};this.dirty=true;this.guideDirty=true;this.configureAudio();}
  close(){if(this.modal?.type==='pause')this.session.resume();this.modal=null;this.dirty=true;this.guideDirty=true;this.configureAudio();}
  closeReport(action=''){if(this.session.rewardPending)return false;this.modal=null;this.dirty=true;this.guideDirty=true;return this.session.closeReport(action);}
  refresh(){this.dirty=true;this.guideDirty=true;this.navDirty=true;}
  async transfer(fn,message=''){try{const result=await fn();if(message)this.toast(message);else if(typeof result==='string'&&result.startsWith('存档文字'))this.toast(result);return result;}catch(error){this.toast(error.message||error.errMsg||'操作没有完成，请重试。');return '';}}
  toast(text:string){this.toastText=String(text||'');this.toastUntil=this.session.time+2.6;if(this.toastRoot)this.paintToast();}
  paintToast(){this.ui.clear(this.toastRoot);if(!this.toastText)return;const h=Math.min(110,31+Math.ceil(this.toastText.length/24)*18),w=this.w-32,y=this.h-this.navH-this.safeBottom-h-14;const p=this.ui.panel(this.toastRoot,16,y,w,h,{fill:'#263c48ed',stroke:'#ae9471',radius:10});this.ui.label(p,this.toastText,12,8,w-24,h-16,{size:12,color:'#f7e6c8',align:'center'});}
  navigate(nav){if(!nav)return;if(nav.panel==='formation'){this.modal=null;this.retryRequest=nav.retry;this.battleView.showRetry(nav.retry);this.session.tab='cats';this.session.mode='formation';}else if(nav.panel==='street'){const r=nav.route||{};this.modal={type:'street',data:{...r,group:r.group==='materials'?groupFor(r.id):r.group==='hunt'?'equipment':r.group,detail:nav.detail!==false}};}else this.modal={type:nav.panel,data:nav};this.refresh();}
  sessionEvent(e){
    if(e.type==='combat'){if(this.session.tab==='battle'&&!this.visibleModal()&&!this.session.loading){this.battleView?.consume(e.events);const skills=skillAudioEvents(e.events,this.session.battle.heroes);for(const details of skills)audio.play('skill',details);if(!skills.length&&e.events.some(x=>x.type==='hit'&&x.value>0))audio.play('hit');}this.session.drainEvents();return;}
    if(e.type==='notice'){this.toast(e.message);return;}
    if(e.type==='navigation'){this.navigate(e);return;}
    if(e.type==='battle-start'){this.retryRequest=null;this.battleView?.bindBattle();void this.prepareBattle();this.refresh();return;}
    if(e.type==='guide'){if(e.step===7||e.step===23||e.previous===23)this.modal=null;this.guideDirty=true;this.dirty=true;this.navDirty=true;return;}
    if(e.type==='save')return;
    if(e.type==='state'&&e.reason==='income'){this.updateWallets();return;}
    if(e.type==='battle-end'){if(e.report)this.modal=null;else if(e.result?.win)this.battleView.showRewards(e.result);}
    if(e.type==='state'&&['upgrade','inherit','ascend','enhance','claim-idle','quest-reward','daily-reward','daily-chest','journey-reward','business-reward','token-reward'].includes(e.reason))audio.play('coin');
    if(e.type==='state'&&e.reason==='can')audio.play('can');
    this.refresh();this.configureAudio();
  }
  scrollState(parent){return allNodes(parent).filter(n=>n.getComponent(ScrollView)).map(n=>{const offset=n.getComponent(ScrollView).getScrollOffset();return new Vec2(-offset.x,offset.y);});}
  restoreScroll(parent,offsets){const views=allNodes(parent).filter(n=>n.getComponent(ScrollView));views.forEach((n,i)=>{if(offsets[i])n.getComponent(ScrollView).scrollToOffset(offsets[i],0);});}
  render(){
    const pageKey=this.session.tab+':'+this.session.mode+':'+this.session.selected,modalKey=this.visibleModal();
    this.battleRoot.active=this.session.tab==='battle';this.pageRoot.active=!this.battleRoot.active;
    if(this.dirty){
      if(this.pageRoot.active){const scroll=pageKey===this.lastPage?this.scrollState(this.pageRoot):[];this.ui.clear(this.pageRoot);this.pages.render(this.pageRoot,this.w,this.pageH);this.restoreScroll(this.pageRoot,scroll);}
      this.lastPage=pageKey;
      const offsets=modalKey===this.lastModal?this.scrollState(this.modalRoot):[];this.ui.clear(this.modalRoot);
      if(modalKey)this.dialogs.render(this.modalRoot,this.w,this.h-this.safeTop-this.safeBottom,modalKey,this.modal?.data||{});
      this.restoreScroll(this.modalRoot,offsets);this.lastModal=modalKey;this.dirty=false;this.guideDirty=true;
    }
    if(this.navDirty){this.ui.clear(this.navRoot);this.ui.panel(this.navRoot,0,0,this.w,this.navH+this.safeBottom,{fill:'#29414b',stroke:'#a48b62',radius:0});[['battle','出战'],['cats','伙伴'],['bag','背包'],['map','街区']].forEach(([id,title],i)=>{const active=this.session.tab===id||(id==='cats'&&this.session.tab==='formation'),w=this.w/4,n=this.ui.button(this.navRoot,'',i*w,0,w,this.navH,()=>{if(this.session.report)return;this.close();this.session.changeTab(id);},{fill:active?'#c4a26e':'#29414b',stroke:'#00000000',name:'tab-'+id});this.ui.icon(n,id,w/2-11,2,23);this.ui.label(n,title,0,27,w,18,{size:15,bold:true,color:active?'#47372b':'#e1cead',align:'center'});if(id==='cats')this.ui.label(n,unlocked(this.session.state).length+'/8',w/2+16,3,26,16,{size:8,color:active?'#49382c':'#d8c59f'});});this.navDirty=false;}
    if(this.guideDirty)this.renderGuide();this.updateWallets();
  }
  updateWallets(){for(const n of allNodes(this.pageRoot)){const l=n.getComponent(Label);if(l&&n.name==='wallet-gold')l.string=fmt(this.session.state.gold);}}
  find(name){return allNodes(this.root).find(n=>n.name===name&&n.activeInHierarchy);}
  targetName(){const s=this.session.state.guideStep;return ({1:'battle-label',2:'tab-cats',3:'upgrade-orange',4:'crew-mode-equipment',5:'equipped-claw',6:'dialog-content',7:'tab-battle',8:'battle-label',11:'open-can',12:'open-can',13:'open-can',14:'battle-label',15:'tab-map',16:'district-board',17:'street-group-equipment',18:'street-choice-salvage',19:'street-fight',20:'equipment-bag',21:'gear-'+this.session.state.gearGuideItem,22:'gear-equip',23:'crew-equipment'})[s];}
  bounds(node:Node){const box=worldRect(node),p=this.root.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(box.x,box.y+box.height,0));return {x:p.x,y:-p.y,width:box.width,height:box.height,top:-p.y,bottom:-p.y+box.height};}
  revealTarget(target){let p=target.parent;while(p&&p!==this.root){const scroll=p.getComponent(ScrollView);if(scroll){const b=worldRect(target),v=worldRect(p);if(b.y<v.y+4||b.y+b.height>v.y+v.height-4){const local=scroll.content.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(b.x+b.width/2,b.y+b.height/2,0)),wanted=Math.max(0,-local.y-v.height/2);scroll.scrollToOffset(new Vec2(-scroll.getScrollOffset().x,wanted),0);}break;}p=p.parent;}}
  advanceGuide(){if(this.session.time-this.guideTouchAt<.24)return;this.guideTouchAt=this.session.time;const step=this.session.state.guideStep;if(step===6||step===23)this.modal=null;this.session.guideEvent('continue');this.refresh();}
  renderGuide(){
    this.ui.clear(this.guideRoot);this.guideDirty=false;if(this.session.loading||this.session.report||this.session.intro||!this.session.guideActive)return;
    if(this.modal&&this.modal.type!=='equipment'&&!(this.session.state.guideStep>=14&&['arena','street'].includes(this.modal.type)))return;
    const g=this.session.guide,target=this.find(this.targetName());if(target)this.revealTarget(target);const b=target?this.bounds(target):null,info=g.mode==='info';
    const block=(x,y,w,h)=>{if(w<=0||h<=0)return;const n=this.ui.panel(this.guideRoot,x,y,w,h,{fill:'#16212f8f',stroke:'#00000000',radius:0});n.addComponent(BlockInputEvents);if(info)n.on(Node.EventType.TOUCH_END,()=>this.advanceGuide());};
    if(!b)block(0,0,this.w,this.h);else{const x=Math.max(0,b.x-4),y=Math.max(0,b.y-4),r=Math.min(this.w,b.x+b.width+4),bottom=Math.min(this.h,b.y+b.height+4);block(0,0,this.w,y);block(0,bottom,this.w,this.h-bottom);block(0,y,x,bottom-y);block(r,y,this.w-r,bottom-y);if(info){const capture=this.ui.group(this.guideRoot,x,y,r-x,bottom-y,'guide-info-target');capture.addComponent(BlockInputEvents);capture.on(Node.EventType.TOUCH_END,()=>this.advanceGuide());}}
    if(b){const ring=this.ui.panel(this.guideRoot,b.x-3,b.y-3,b.width+6,b.height+6,{fill:'#00000000',stroke:'#ffd13d',radius:9,width:4});ring.name='guide-highlight';}
    const w=Math.min(290,this.w-24),titleH=Math.ceil(g.title.length/Math.floor((w-24)/17))*25,textH=Math.ceil(g.text.length/Math.floor((w-24)/13))*19,h=34+titleH+7+textH+45,y=b?guideCardTop(b,h,this.h-this.safeBottom):Math.max(18,(this.h-h)/2),p=this.ui.panel(this.guideRoot,(this.w-w)/2,y,w,h,{fill:'#fff2cf',stroke:'#e9b643',radius:12,width:3});p.addComponent(BlockInputEvents);p.name='guide-card';if(info)p.on(Node.EventType.TOUCH_END,()=>this.advanceGuide());
    const count=g.step>=14?'装备引导 '+(g.step<=19?g.step-13:g.step-19)+' / '+(g.step<=19?6:4):'新手引导 '+guideNumber(g.step)+' / 11';
    this.ui.label(p,count,12,8,w-84,20,{size:10,color:'#806a52'});this.ui.button(p,'跳过',w-67,7,55,22,()=>{this.modal=null;this.session.skipGuide();},{name:'guide-skip',fill:'#00000000',stroke:'#00000000',size:10});
    this.ui.label(p,g.title,12,34,w-24,titleH,{size:17,color:'#4b2d0f',bold:true});this.ui.label(p,g.text,12,41+titleH,w-24,textH,{size:13,color:'#583c21'});
    if(info)this.ui.button(p,'继续',12,h-37,w-24,28,()=>this.advanceGuide(),{name:'guide-continue',primary:true,size:12});
    else if(!target)this.ui.button(p,'返回当前引导',12,h-37,w-24,28,()=>{this.modal=null;this.session.restoreGuide();this.navigate(this.session.navigation);this.refresh();},{name:'guide-restore',primary:true,size:12});
    else this.ui.label(p,'点击高亮处继续',12,h-34,w-24,23,{size:11,bold:true,color:'#927041',align:'center'});
  }
  battleArt(_startup=false){
    const battle=this.session.battle,actors=[...battle.heroes,...battle.enemies];
    const ids=actors.map(a=>carrierId(a)||a.catId||(a.boss&&a.type==='box'?'boxBoss':a.type));
    const paths=[...COMMON_ART,...ids.map(paintedAtlasFor),...['heal-light','heal-light-vertical','heal-mote','heal-cross'].map(id=>'assets/cocos/effects/'+id+'.png')];
    if(ids.includes('pudding'))paths.push('assets/vfx/shidun-impact-v0211.webp');
    for(const id of new Set(battle.heroes.map(a=>a.catId).filter(Boolean))){if(id==='spark'){for(let cel=0;cel<9;cel++)for(const face of ['blink','hurt','victory','attack'])paths.push(`assets/cocos/expressions/spark-${cel}-${face}.png`);}else for(const face of ['blink','hurt','victory'])paths.push(`assets/cocos/expressions/${id}-0-${face}.png`);}
    paths.push(battle.activity?'assets/scenes/commissions-v02646.webp':`assets/mobile/street-${Math.floor((battle.stage-1)/20)%6}-v02684.webp`);return [...new Set(paths.filter(Boolean).map(p=>p.replace(/^\.\//,'')))];
  }
  renderLoading(){this.ui.clear(this.loadingRoot);this.loadingRoot.active=this.session.loading;if(!this.session.loading)return;this.ui.blocker(this.loadingRoot,this.w,this.h);this.ui.panel(this.loadingRoot,0,0,this.w,this.h,{fill:'#293f51',stroke:'#00000000',radius:0});const y=this.h*.4;this.ui.icon(this.loadingRoot,'can',this.w/2-23,y-55,46);this.ui.label(this.loadingRoot,'罐头远征队',20,y+4,this.w-40,40,{size:26,bold:true,color:'#f1deb8',align:'center'});this.loadMessage=this.ui.label(this.loadingRoot,'正在准备本场冒险',20,y+59,this.w-40,28,{size:13,color:'#e3cc9f',align:'center'});this.loadProgress=this.ui.label(this.loadingRoot,'0%',20,y+98,this.w-40,26,{size:16,bold:true,color:'#f4d69a',align:'center'});this.loadingRetry=this.ui.button(this.loadingRoot,'重新加载',60,y+145,this.w-120,38,()=>{void this.prepareBattle(!this.ready);},{name:'loading-retry',primary:true});this.loadingRetry.active=false;}
  async prepareBattle(startup=false){
    const serial=++this.loadSerial;this.session.setLoading(true);this.renderLoading();this.guideDirty=true;
    try{await assets.preload(this.battleArt(startup),(n,total)=>{if(serial===this.loadSerial)this.loadProgress.string=Math.round(n/total*100)+'% · '+n+'/'+total;});if(serial!==this.loadSerial)return false;
      this.battleView.bindBattle();this.battleView.update(0);this.ui.update(this.session.time,0);await this.ui.settleImages();await afterDraw();await afterDraw();if(serial!==this.loadSerial)return false;
      this.session.setLoading(false);this.ready=true;this.loadingRoot.active=false;this.refresh();return true;
    }catch(error){if(serial!==this.loadSerial)return false;const message=String(error.message||error);if(!this.ui.errors.includes(message))this.ui.errors.push(message);this.loadMessage.string='部分资源加载失败，请检查网络后重试';this.loadProgress.string='';this.loadingRetry.active=true;return false;}
  }
  paintEntrance(){const show=!this.session.loading&&this.session.entranceRemaining>0&&!this.session.guideActive&&!this.session.report&&this.session.tab==='battle';if(show===this.lastEntrance)return;this.lastEntrance=show;this.ui.clear(this.entranceRoot);if(!show)return;this.ui.blocker(this.entranceRoot,this.w,this.pageH);const b=this.session.battle,y=this.pageH/2-80;this.ui.label(this.entranceRoot,b.activity?'猫巷委托':'街区开拓',20,y,this.w-40,24,{size:12,color:'#f4dfb1',align:'center'});this.ui.label(this.entranceRoot,b.activity?.name||b.weekly?.name||(b.mode==='arena'?'第 '+b.arenaTier+' 擂':'第 '+b.stage+' 关'),15,y+32,this.w-30,35,{size:24,bold:true,color:'#ffe8bd',align:'center'});const ids=this.session.state.party.filter(Boolean);ids.forEach((id,i)=>this.ui.character(this.entranceRoot,id,this.w/2+(i-(ids.length-1)/2)*58,y+160,this.ui.fullBodyUnit));}
  update(delta:number){if(!this.session||this.destroyed)return;const dt=Math.min(.1,Math.max(0,delta));if(this.resizePending){this.resizePending=false;this.buildLayout();}this.session.update(dt);if(this.dirty||this.navDirty||this.guideDirty)this.render();this.battleView.update(dt);this.ui.update(this.session.time,dt);this.paintEntrance();if(this.toastText&&this.session.time>=this.toastUntil){this.toastText='';this.ui.clear(this.toastRoot);}if(this.ui.errors.length>this.lastIssueCount){for(const err of this.ui.errors.slice(this.lastIssueCount))console.error('[CanClub asset]',err);this.lastIssueCount=this.ui.errors.length;}}
  action(name:string){const n=this.find(name);if(!n)throw new Error('找不到操作：'+name);const b=n.getComponent(Button);if(!b?.interactable)throw new Error('操作当前不可用：'+name);n.emit(Button.EventType.CLICK,b);this.render();return this.inspect();}
  advance(dt:number){let remain=Math.max(0,dt);while(remain>0){this.update(Math.min(.1,remain));remain-=.1;}return this.inspect();}
  inspect(){const frame=view.getFrameSize(),s=Math.min(frame.width/this.w,frame.height/this.h),dx=(frame.width-this.w*s)/2,dy=(frame.height-this.h*s)/2;return {version:'0.28.0-cocos.1',engine:'Cocos Creator 3.8.8',ready:this.ready,running:this.session.running,loading:this.session.loading,tab:this.session.tab,modal:this.visibleModal(),guideStep:this.session.state.guideStep,stage:this.session.battle.stage,time:this.session.battle.time,errors:[...new Set(this.ui.errors)],nodeNames:allNodes(this.root).filter(n=>n.activeInHierarchy).map(n=>n.name),buttons:allNodes(this.root).filter(n=>n.activeInHierarchy&&n.getComponent(Button)?.interactable).map(n=>{const b=this.bounds(n);return {name:n.name,x:dx+b.x*s,y:dy+b.y*s,width:b.width*s,height:b.height*s};}),actors:[...this.session.battle.heroes,...this.session.battle.enemies].map(a=>({id:a.id,catId:a.catId,hp:a.hp,maxHp:a.maxHp,level:a.level})),size:{width:this.w,height:this.h}};}
  onDestroy(){this.destroyed=true;this.loadSerial++;for(const dispose of this.disposers)dispose();input.off(Input.EventType.TOUCH_START,this.unlock,this);input.off(Input.EventType.KEY_DOWN,this.key,this);view.off('canvas-resize',this.resize,this);this.services?.dispose();this.session?.save();audio.configure({hidden:true});if(currentApp===this)currentApp=null;}
}

@ccclass('CanClubGame')
export class CanClubGame extends Component { start(){void bootGame(this.node.scene);} }
export async function bootGame(scene?:Scene){
  if(currentApp&&isValid(currentApp.node,true))return currentApp;if(starting)return starting;
  starting=(async()=>{if(!scene){scene=new Scene('CanClub');director.runSceneImmediate(scene);}const node=new Node('GameController');scene.addChild(node);const app=node.addComponent(CanClubRuntime);currentApp=app;app.initialize(scene);if((globalThis as any).CAN_CLUB_CONFIG?.sourceRuntime)(globalThis as any).__CAN_CLUB_APP__=app;await app.prepareBattle(true);return app;})();
  try{return await starting;}finally{starting=null;}
}
