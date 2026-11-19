// Native Cocos UI primitives. Coordinates are logical pixels from the top left.
import { Node, UITransform, Label, Color, Graphics, Sprite, Button, ScrollView, Mask, UIOpacity, BlockInputEvents, Vec3, isValid } from 'cc';
import { assets } from './Assets';
import { PaintedActor } from './PaintedActor';
import { FINISHED_ROSTER } from '../domain/finished-roster-data';
import { HEAD_CROPS } from '../domain/companion-display';
import { ICON_BOUNDS } from '../domain/icon-bounds';

export const THEME = { ink:'#49352f', muted:'#856d59', paper:'#eedbb6', light:'#fff1d3', rim:'#9d734a', panel:'#e3c99f', gold:'#efc46f', dark:'#382f38', blue:'#424a5b', mint:'#84bba0', danger:'#ad5b4d' };
export const color = (hex:string='#ffffff') => { const c=new Color(); Color.fromHEX(c,hex==='transparent'?'#00000000':hex); return c; };
export const plain = (s:any) => String(s??'').replace(/<br\s*\/?\s*>/g,'\n').replace(/<[^>]*>/g,'').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&#39;/g,"'");
export const fmt = (n:number) => n>=1e8?Math.floor(n/1e8)+'亿':n>=1e4?Math.floor(n/1e4)+'万':Math.floor(n||0).toLocaleString('zh-CN');
// UITransform.getBoundingBoxToWorld includes children (including scroll content).
// Input and clipping use the host's own rectangle instead.
export function worldRect(node:Node){const t=node.getComponent(UITransform)!;const a=t.anchorPoint,w=t.width,h=t.height;const points=[[-a.x*w,-a.y*h],[(1-a.x)*w,-a.y*h],[-a.x*w,(1-a.y)*h],[(1-a.x)*w,(1-a.y)*h]].map(([x,y])=>t.convertToWorldSpaceAR(new Vec3(x,y,0)));const x=Math.min(...points.map(p=>p.x)),y=Math.min(...points.map(p=>p.y)),right=Math.max(...points.map(p=>p.x)),top=Math.max(...points.map(p=>p.y));return {x,y,width:right-x,height:top-y};}
type PaperOptions={paper?:number,paperBlend?:'multiply'|'normal',paperCenter?:boolean};
type PanelOptions=PaperOptions&{fill?:string,stroke?:string,radius?:number,asset?:string,width?:number};
type LabelOptions={size?:number,color?:string,align?:'left'|'center'|'right',bold?:boolean,wrap?:boolean,overflow?:number};
type ButtonOptions=PaperOptions&{primary?:boolean,disabled?:boolean,fill?:string,name?:string,size?:number,color?:string,stroke?:string};

export class UI {
  actors = new Set<PaintedActor>();
  errors:string[]=[];
  pendingLoads = new Set<Promise<any>>();
  onSound:(kind:string)=>void=()=>{};
  onAction:(name:string)=>void=()=>{};
  fullBodyUnit=62;
  track<T>(promise:Promise<T>):Promise<T>{this.pendingLoads.add(promise);promise.finally(()=>this.pendingLoads.delete(promise)).catch(()=>{});return promise;}
  async settleImages(){while(this.pendingLoads.size)await Promise.allSettled([...this.pendingLoads]);}
  group(parent:Node,x=0,y=0,w=0,h=0,name='group'):Node{
    const n=new Node(name);n.layer=parent.layer;parent.addChild(n);n.setPosition(x,-y,0);
    const tr=n.addComponent(UITransform);tr.setAnchorPoint(0,1);tr.setContentSize(w,h);return n;
  }
  clear(n:Node){for(const c of [...n.children]){c.removeFromParent();c.destroy();}this.cleanActors();}
  cleanActors(){for(const a of this.actors)if(!isValid(a.node,true))this.actors.delete(a);}
  panel(parent:Node,x:number,y:number,w:number,h:number,opts:PanelOptions={}):Node{
    const n=this.group(parent,x,y,w,h,'panel');
    const g=n.addComponent(Graphics),r=Math.min(opts.radius??10,w/2,h/2);
    g.fillColor=color(opts.fill??THEME.paper);g.strokeColor=color(opts.stroke??THEME.rim);g.lineWidth=opts.width??1.1;
    g.roundRect(.5,-h+.5,Math.max(0,w-1),Math.max(0,h-1),r);g.fill();
    if(opts.asset)this.image(n,opts.asset,0,0,w,h);
    if(opts.paper)this.paper(n,w,h,opts.fill??THEME.paper,opts.paper,opts.paperBlend??'multiply',opts.paperCenter??false,r);
    if((opts.stroke??THEME.rim)!=='transparent'&&g.strokeColor.a){
      if(opts.paper||opts.asset){const rim=this.group(n,0,0,w,h,'panel-rim').addComponent(Graphics);rim.strokeColor=g.strokeColor;rim.lineWidth=g.lineWidth;rim.roundRect(.5,-h+.5,Math.max(0,w-1),Math.max(0,h-1),r);rim.stroke();}
      else g.stroke();
    }
    return n;
  }
  clip(parent:Node,x:number,y:number,w:number,h:number,radius=0,topOnly=false):Node{
    const n=this.group(parent,x,y,w,h,'surface-clip'),mask=n.addComponent(Mask);mask.type=Mask.Type.GRAPHICS_STENCIL;
    const g=mask.subComp as Graphics,r=Math.min(radius,w/2,h/2);g.clear();
    if(topOnly&&r){g.moveTo(0,-h);g.lineTo(w,-h);g.lineTo(w,-r);g.quadraticCurveTo(w,0,w-r,0);g.lineTo(r,0);g.quadraticCurveTo(0,0,0,-r);g.close();}
    else g.roundRect(0,-h,w,h,r);
    g.fill();return n;
  }
  // The frozen paper is opaque RGB. Sprite tint therefore reproduces its CSS
  // background-blend-mode:multiply; white tint retains the normal paper surface.
  // A native tiled Sprite shares the original 384px texture across every panel.
  paper(parent:Node,w:number,h:number,fill:string,tile:number,blend:'multiply'|'normal'='multiply',center=false,radius=0):Node{
    const n=this.clip(parent,0,0,w,h,radius);n.name='paper-grain';
    const offset=(length:number)=>{const v=(length-tile)/2;return center?v-Math.ceil(v/tile)*tile:0;};
    const left=offset(w),top=offset(h),scale=tile/384;
    // TILED builds rows from the bottom. Whole rows preserve the CSS top origin;
    // the stencil clips the last row, rather than shifting the paper pattern.
    const art=this.image(n,'assets/ui/paper-grain-v02642.webp',left,top,Math.ceil((w-left)/tile)*384,Math.ceil((h-top)/tile)*384);
    art.setScale(scale,scale,1);const s=art.getComponent(Sprite)!;s.type=Sprite.Type.TILED;s.color=blend==='multiply'?color(fill):Color.WHITE;
    return n;
  }
  label(parent:Node,value:any,x:number,y:number,w:number,h:number,opts:LabelOptions={}):Label{
    const n=this.group(parent,x,y,w,h,'text:'+plain(value).slice(0,30));
    const l=n.addComponent(Label);l.string=plain(value);l.fontFamily='sans-serif';l.fontSize=opts.size??14;l.lineHeight=Math.round(l.fontSize*1.42);l.color=color(opts.color??THEME.ink);l.isBold=opts.bold??false;l.enableWrapText=opts.wrap??true;l.horizontalAlign=opts.align==='center'?1:opts.align==='right'?2:0;l.verticalAlign=1;l.overflow=opts.overflow??Label.Overflow.CLAMP;l.cacheMode=Label.CacheMode.CHAR;return l;
  }
  button(parent:Node,title:string,x:number,y:number,w:number,h:number,fn:(node?:Node)=>void,opts:ButtonOptions={}):Node{
    const n=this.group(parent,x,y,w,h,opts.name??'button:'+plain(title));
    const visual=this.group(n,w/2,h/2,w,h,'press-visual');visual.getComponent(UITransform)!.setAnchorPoint(.5,.5);
    const fill=opts.fill??(opts.primary?'#ab7544':'#dfc59d');
    this.panel(visual,-w/2,-h/2,w,h,{fill,stroke:opts.stroke??(fill.endsWith('00')?'#00000000':opts.primary?'#754e36':'#a17b50'),radius:8,paper:opts.paper,paperBlend:opts.paperBlend,paperCenter:opts.paperCenter});
    const l=this.label(visual,title,-w/2+4,-h/2,w-8,h,{size:opts.size??13,bold:true,align:'center',color:opts.color??(opts.primary?THEME.light:THEME.ink)});
    const b=n.addComponent(Button);b.transition=Button.Transition.SCALE;b.target=visual;b.zoomScale=.95;b.duration=.07;b.interactable=!opts.disabled;
    if(opts.disabled)n.addComponent(UIOpacity).opacity=135;
    n.on(Button.EventType.CLICK,()=>{if(!b.interactable)return;this.onSound('click');this.onAction(n.name);fn(n);});
    (n as any).__action=()=>{if(b.interactable)n.emit(Button.EventType.CLICK,b);};(n as any).__label=l;(n as any).__button=b;return n;
  }
  image(parent:Node,path:string,x:number,y:number,w:number,h:number,rect?:[number,number,number,number]):Node{
    const n=this.group(parent,x,y,w,h,'art:'+path),s=n.addComponent(Sprite);s.sizeMode=Sprite.SizeMode.CUSTOM;
    this.track(assets.frame(path,rect).then(frame=>{if(isValid(n,true)){s.spriteFrame=frame;s.sizeMode=Sprite.SizeMode.CUSTOM;n.getComponent(UITransform)!.setContentSize(w,h);}}).catch(e=>{this.errors.push(path+': '+String(e));}));return n;
  }
  imageFrame(parent:Node,frame:any,x:number,y:number,w:number,h:number):Node{const n=this.group(parent,x,y,w,h,'sprite');const s=n.addComponent(Sprite);s.spriteFrame=frame;s.sizeMode=Sprite.SizeMode.CUSTOM;return n;}
  portrait(parent:Node,id:string,x:number,y:number,size:number):Node{
    const p=id==='spark'?'./assets/finished/spark-portrait-v0211.webp':FINISHED_ROSTER[id]?.portrait||FINISHED_ROSTER.orange.portrait;
    const [cx,cy,side]=HEAD_CROPS[id]||HEAD_CROPS.orange;
    return this.image(parent,p,x,y,size,size,[cx,cy,side,side]);
  }
  character(parent:Node,id:string,x:number,footY:number,unitSize=this.fullBodyUnit):PaintedActor{
    const a=new PaintedActor(parent,id,this);a.place(x,footY,unitSize);this.actors.add(a);return a;
  }
  icon(parent:Node,key:string,x:number,y:number,size:number):Node{
    const material={gold:0,coin:0,supplies:1,badges:2,notes:3,seals:4,essence:5,scrap:6,gear:7,shards:8};
    if(key in material){const i=material[key];if(key==='scrap')return this.image(parent,'assets/materials/scrap-v02643.webp',x,y,size,size);return this.image(parent,'assets/materials/harbor-materials-v02641.webp',x,y,size,size,[i%3*418,Math.floor(i/3)*418,418,418]);}
    const nav={battle:5,can:5,cats:13,paw:13,bag:14,relics:14,map:15,gift:9,star:11,sword:12};
    if(key in nav){const i=nav[key];return this.image(parent,'assets/painted/items.webp',x,y,size,size,[i%4*256,Math.floor(i/4)*256,256,256]);}
    if(key.startsWith('gear:')){const i=+key.slice(5)||0,b=ICON_BOUNDS.equipment.boxes[i%24];return this.image(parent,'assets/ui/'+ICON_BOUNDS.equipment.file,x,y,size,size,b as any);}
    if(key.startsWith('rune:')){const i=+key.slice(5)||0,b=ICON_BOUNDS.runes.boxes[i%6];return this.image(parent,'assets/ui/'+ICON_BOUNDS.runes.file,x,y,size,size,b as any);}
    const n=this.group(parent,x,y,size,size,'icon:'+key);this.label(n,({settings:'⚙',close:'×',plus:'+',quest:'!'} as any)[key]||'◆',0,0,size,size,{size:size*.7,align:'center',bold:true});return n;
  }
  bar(parent:Node,x:number,y:number,w:number,h:number,ratio:number,fill='#80b68d',back='#493b35'):Node{
    const n=this.group(parent,x,y,w,h,'bar');const g=n.addComponent(Graphics);let lastRatio=NaN;const paint=(r:number)=>{r=Math.max(0,Math.min(1,r));if(r===lastRatio)return;lastRatio=r;g.clear();g.fillColor=color(back);g.roundRect(0,-h,w,h,h/2);g.fill();if(r>0){g.fillColor=color(fill);g.roundRect(0,-h,w*r,h,Math.min(h/2,w*r/2));g.fill();}};paint(ratio);(n as any).setRatio=paint;return n;
  }
  scroll(parent:Node,x:number,y:number,w:number,h:number,contentHeight:number):Node{
    const host=this.group(parent,x,y,w,h,'scroll-view');const mask=host.addComponent(Mask);mask.type=Mask.Type.GRAPHICS_RECT;
    const content=this.group(host,0,0,w,Math.max(h,contentHeight),'scroll-content');
    const scroll=host.addComponent(ScrollView);scroll.content=content;scroll.horizontal=false;scroll.vertical=true;scroll.inertia=true;scroll.elastic=true;scroll.brake=.75;(content as any).__scrollView=scroll;return content;
  }
  blocker(parent:Node,w:number,h:number,onClose?:()=>void):Node{
    const n=this.panel(parent,0,0,w,h,{fill:'#1d1522bb',stroke:'#00000000',radius:0});n.name='modal-backdrop';n.addComponent(BlockInputEvents);if(onClose)n.on(Node.EventType.TOUCH_END,onClose);return n;
  }
  update(time:number,dt:number){this.cleanActors();for(const a of this.actors)if(a.node.activeInHierarchy&&!a.controlled)a.update(null,time,dt);}
}
