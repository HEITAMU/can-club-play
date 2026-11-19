// @ts-nocheck
// Native Cocos UI. All prices, growth and combat data come from the migrated domain.
import { Node, UITransform, Vec3, Vec2, Button, Graphics, Color, UIOpacity } from 'cc';
import { worldRect } from '../render/UI';
import * as G from '../domain/core';
import * as E from '../domain/equipment';
import { crewSkill } from '../domain/crew-skill';
import { skillSummary, SKILL_STUDY } from '../domain/skill-training';
import { talentCards } from '../domain/talents';
import { trainingCount } from '../domain/growth-curve';
import { TEAM_PLANS } from '../domain/team-plans';
import { BADGE_NAMES } from '../domain/growth-visual';
import { KEEPSAKES } from '../domain/keepsakes';
import { ICON_BOUNDS } from '../domain/icon-bounds';
import { MATERIAL_NAMES } from '../domain/loot-data';
import { materialHave } from '../domain/material-info';

export const P = { ink:'#523d30', muted:'#806d56', paper:'#e9d8b5', light:'#f4e6c8', rim:'#76543d', deep:'#29414b', blue:'#3d5863', gold:'#f0c77b', green:'#516d5f', red:'#9d4b3c' };
export const fmt = n => n >= 1e8 ? Math.floor(n/1e8)+'亿' : n >= 1e4 ? Math.floor(n/1e4)+'万' : Math.floor(Number(n)||0).toLocaleString('zh-CN');
export const clean = value => String(value ?? '').replace(/<br\s*\/?>/gi,'\n').replace(/<[^>]+>/g,'').replace(/&amp;/g,'&').replace(/&nbsp;/g,' ').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
export const cat = id => G.CATS.find(x=>x.id===id) || G.CATS[0];
export const contentHeight = (text,width,size=12) => Math.max(size*1.5, Math.ceil(clean(text).length / Math.max(1,Math.floor(width/size))) * size*1.55);
export const ownedGear = (s,slot='') => s.inventory.items.filter(e=>!E.gearOwner(s,e.id)&&(!slot||e.slot===slot)).sort((a,b)=>b.quality-a.quality||b.tier-a.tier||Number(b.id.slice(1))-Number(a.id.slice(1)));
export const rankColor = rank => ['#ffd387','#ff9e4f','#bdedff','#ffe658','#63ffd2','#ffc5fa','#ffb791','#ffda91','#ff9fb8','#ffe7b1'][rank]||'#ffd387';

export function line(ui,parent,text,x,y,w,size=12,color=P.ink,h?) {
  return ui.label(parent,clean(text),x,y,w,h||contentHeight(text,w,size),{size,color,wrap:true});
}
export function progress(ui,parent,x,y,w,h,ratio,fill=P.gold) {
  ui.panel(parent,x,y,w,h,{fill:'#263a41',stroke:'#7b7360',radius:h/2});
  return ui.panel(parent,x+1,y+1,Math.max(0,(w-2)*Math.max(0,Math.min(1,ratio))),h-2,{fill,stroke:fill,radius:(h-2)/2});
}
export function keepsakeArt(ui,parent,id,x,y,size) {
  const index=Object.keys(KEEPSAKES).indexOf(id);
  return ui.image(parent,'assets/ui/companion-keepsakes-v0282.webp',x,y,size,size,[index%4*240,Math.floor(index/4)*240,240,240]);
}
export function materialArt(ui,parent,id,x,y,size,companion?) {
  if(id==='shards'&&companion) return keepsakeArt(ui,parent,companion,x,y,size);
  if(id==='scrap') return ui.image(parent,'assets/materials/scrap-v02643.webp',x,y,size,size);
  const map={gold:0,supplies:1,badges:2,notes:3,seals:4,essence:5,scrap:6,gear:7,shards:8};
  const cell=map[id]??7;
  return ui.image(parent,'assets/materials/harbor-materials-v02641.webp',x,y,size,size,[cell%3*418,Math.floor(cell/3)*418,418,418]);
}
export function gearArt(ui,parent,e,x,y,size) {
  if(!e)return;
  const type=e.slot==='rune'?'runes':'equipment',kit=ICON_BOUNDS[type];
  const index=e.slot==='rune'?E.RUNES.findIndex(r=>r.id===e.rune):E.GEAR_SETS.findIndex(s=>s.id===e.set)*4+E.GEAR_SLOTS.findIndex(s=>s.id===e.slot);
  const rect=kit.boxes[Math.max(0,index)], ratio=rect[2]/rect[3];
  const w=ratio>1?size:size*ratio,h=ratio>1?size/ratio:size;
  ui.image(parent,'assets/ui/'+kit.file,x+(size-w)/2,y+(size-h)/2,w,h,rect);
  if(e.enhance) ui.label(parent,'+'+e.enhance,x-3,y-8,size+6,21,{size:15,bold:true,color:'#fff0b0',align:'right'});
}
export function gearTile(ui,parent,e,x,y,size,onClick,name?) {
  const tile=ui.button(parent,'',x,y,size,size,()=>onClick?.(tile),{fill:'#f0dfbc',name:name||'gear-'+e?.id});
  ui.panel(tile,2,2,size-4,size-4,{fill:'#f0dfbc',stroke:e?E.QUALITIES[e.quality].color:'#957448',radius:7});
  if(e)gearArt(ui,tile,e,6,6,size-12);
  return tile;
}
export function anchorRect(node,root){
  if(!node||!root)return null;const rect=worldRect(node),tr=root.getComponent(UITransform);if(!rect||!tr)return null;
  const tl=tr.convertToNodeSpaceAR(new Vec3(rect.x,rect.y+rect.height,0)),br=tr.convertToNodeSpaceAR(new Vec3(rect.x+rect.width,rect.y,0));return {x:tl.x,y:-tl.y,w:br.x-tl.x,h:tl.y-br.y};
}
export function rewardRow(ui,parent,reward,x,y,w,{companion,onMaterial,onGear}={}) {
  const entries=Object.entries(reward||{}).filter(([k,v])=>Number(v)>0&&MATERIAL_NAMES[k]);
  if(reward?.gearLoot?.item&&!entries.some(([k])=>k==='gear'))entries.push(['gear',1]);
  const cell=Math.min(78,w/Math.max(1,Math.min(entries.length,4)));
  entries.forEach(([k,v],i)=>{
    const px=x+i%4*cell,py=y+Math.floor(i/4)*57;
    const n=ui.button(parent,'',px,py,cell-5,52,()=>k==='gear'?onGear?.():onMaterial?.(k,companion),{fill:'#ead4aa',name:'reward-'+k});
    materialArt(ui,n,k,(cell-29)/2,2,26,companion);
    ui.label(n,fmt(v),2,29,cell-9,18,{size:11,bold:true,align:'center',color:P.ink});
  });
  return Math.ceil(entries.length/4)*57;
}
export function costs(ui,parent,s,values,id,x,y,w,open) {
  const rows=Object.entries(values).filter(([,n])=>n>0),cw=w/Math.max(rows.length,1);
  rows.forEach(([key,needed],i)=>{
    const have=materialHave(s,key,id),n=ui.button(parent,'',x+i*cw,y,cw-4,48,()=>open('material',{id:key,companion:id}),{fill:'#f0e0bd',name:'cost-'+key});
    materialArt(ui,n,key,4,10,24,id);
    ui.label(n,key==='shards'?'专属信物':MATERIAL_NAMES[key],31,4,cw-38,18,{size:9,color:P.muted});
    ui.label(n,fmt(have)+' / '+fmt(needed),31,22,cw-36,20,{size:11,bold:true,color:have>=needed?'#4c7153':'#a34536'});
  });
  return rows.length?52:0;
}
const ccColor=hex=>{const c=new Color();Color.fromHEX(c,hex);return c;};
function vectorPath(g,commands,scale=1){for(const [op,...p]of commands){if(op==='M')g.moveTo(p[0]*scale,-p[1]*scale);else if(op==='L')g.lineTo(p[0]*scale,-p[1]*scale);else if(op==='Q')g.quadraticCurveTo(p[0]*scale,-p[1]*scale,p[2]*scale,-p[3]*scale);else if(op==='Z')g.close();}}
export function badge(ui,parent,rank,x,y,w=100) {
  const n=ui.group(parent,x,y,w,w/2,'cat-tag-'+rank),base=ui.image(n,'assets/ui/cat-tag-wide-v02679.webp',0,0,w,w/2),s=w/100;
  if(rank%2){
    const rim=n.addComponent(Graphics),path=[['M',45,23],['Q',41,24,40,27],['L',38.5,35.5],['Q',38,39,50,43],['Q',62,39,61.5,35.5],['L',60,27],['Q',59,24,55,23],['Q',50,21,45,23],['Z']];
    rim.strokeColor=ccColor('#8d613a');rim.lineWidth=4*s;vectorPath(rim,path,s);rim.stroke();rim.strokeColor=ccColor(rankColor(rank));rim.lineWidth=2.7*s;vectorPath(rim,path,s);rim.stroke();rim.strokeColor=ccColor('#fffce4');rim.lineWidth=.7*s;vectorPath(rim,[['M',42,25],['Q',44,23,46,23],['M',40.6,29],['L',39.8,35],['Q',39.6,37.5,45,39.5],['M',57,25],['Q',59,26,59,29]],s);rim.stroke();
    const points=[[0,-10],[3,-3],[10,-3],[5,2],[6,9],[0,5],[-6,9],[-5,2],[-10,-3],[-3,-3]];
    for(const [sx,sy]of [[18,13],[35,16],[65,16],[82,13]]){const star=ui.group(n,sx*s,sy*s,0,0,'tag-star'),g=star.addComponent(Graphics);g.fillColor=ccColor(rankColor(rank));g.strokeColor=ccColor('#fff4ce');g.lineWidth=1.6*s;vectorPath(g,points.map(([px,py],i)=>[i?'L':'M',px*.72,py*.72]).concat([['Z']]),s);g.fill();g.stroke();g.fillColor=ccColor('#fffbe6');vectorPath(g,[['M',0,-7],['L',2,-2],['L',7,-2],['L',3,1],['L',0,0],['L',-3,2],['L',-2,-2],['Z']],s*.72);g.fill();}
  }
  return n;
}
export function paw(ui,parent,rank,x,y,size=88){
  const n=ui.group(parent,x,y,size,size,'cat-paw-'+rank),g=n.addComponent(Graphics),s=size/100;
  g.fillColor=ccColor('#9d7049');g.strokeColor=ccColor('#64452f');g.lineWidth=3*s;vectorPath(g,[['M',25,77],['Q',19,64,32,57],['Q',48,38,64,55],['Q',82,61,77,77],['Q',69,88,51,80],['Q',33,89,25,77],['Z']],s);g.fill();g.stroke();
  g.strokeColor=ccColor('#d9b680');g.lineWidth=2*s;vectorPath(g,[['M',32,72],['Q',29,63,39,59],['M',37,79],['Q',46,74,52,76]],s);g.stroke();
  for(const [px,py,r]of [[18,39,-28],[32,25,-12],[50,20,0],[68,25,12],[82,39,28]]){const pad=ui.group(n,px*s,py*s,0,0,'toe');pad.angle=-r;const p=pad.addComponent(Graphics);p.fillColor=ccColor(rank%2?rankColor(rank):'#9c8061');p.strokeColor=ccColor(rank%2?'#fff3cd':'#654c35');p.lineWidth=2.5*s;p.ellipse(0,0,7*s,10*s);p.fill();p.stroke();}
  return n;
}
export function sceneCard(ui,parent,q,x,y,w,h) {
  const hard=['coldstore','lifeline','ironwall','alarm','blackout','clockwork'];
  const special=q.kind==='hard',file=special?'quest-locations-v02672.webp':'commissions-v02646.webp';
  const index=special?Math.max(0,hard.indexOf(q.id)):q.kind==='hunt'?({market:1,depot:2,station:4}[q.id]??4):({sweep:0,escort:1,salvage:2,wardrobe:2,nightwatch:2,parts:0,polish:2,recruit:3,hunt:4,hard:5}[q.kind]??3);
  return ui.image(parent,'assets/scenes/'+file,x,y,w,h,[index%3*512+3,Math.floor(index/3)*512+3,506,special?506:300]);
}

export class Pages {
  ui; session; cb; width=390; height=760; bagTab='equipment'; bagSlot=''; equipSlot=''; formationSelected=null; lastDrag=0; draggingId=null;
  constructor(ui,session,callbacks){this.ui=ui;this.session=session;this.cb=callbacks;}
  refresh(){this.cb.refresh();}
  anchor(node){return anchorRect(node,this.renderRoot);}
  open(type,data?){if(type==='equipment')this.session.guideEvent('gear');this.cb.open(type,data);}
  act(fn){const result=fn();if(result!==false&&result!==null)this.refresh();return result;}
  render(parent,width,height){
    this.width=width;this.height=height;this.renderRoot=parent;const {ui,session:s}=this;
    ui.panel(parent,0,0,width,height,{fill:'#293f51',stroke:'#293f51',radius:0});
    if(s.tab==='map')this.map(parent);
    else if(s.tab==='bag'||s.tab==='relics')this.bag(parent);
    else this.crew(parent);
  }
  crew(parent){
    const {ui,session:s}=this,w=this.width;
    const tabs=[['profile','养成'],['equipment','装备'],['formation','阵容']],tw=(w-58)/3;
    ui.panel(parent,10,5,w-20,42,{fill:'#514453',stroke:'#82707c',radius:10});ui.icon(parent,'can',14,13,24);
    tabs.forEach(([id,title],i)=>{ui.button(parent,title,42+i*tw,8,tw-4,35,()=>{s.setMode(id);this.refresh();},{fill:s.mode===id?'#d2a65e':'#00000000',stroke:'#00000000',color:s.mode===id?'#342d30':'#dacdbd',name:'crew-mode-'+id,size:13});});
    materialArt(ui,parent,'gold',w-179,51,19);ui.label(parent,Math.floor(s.state.gold).toLocaleString('zh-CN'),w-155,48,116,25,{size:13,bold:true,color:'#f5dfac',align:'right'}).node.name='wallet-gold';ui.label(parent,'鱼币',w-34,50,28,22,{size:10,color:'#d5cbb1'});
    if(s.tab==='formation'||s.mode==='formation')return this.formation(parent,82);
    this.avatarRail(parent,10,79,w-20,s.selected);
    if(s.mode==='equipment')return this.equipment(parent,161);
    this.profile(parent,161);
  }
  avatarRail(parent,x,y,w,selected){
    const {ui,session:s}=this,rows=G.unlocked(s.state),rail=ui.panel(parent,x,y,w,70,{fill:'#344b4e',stroke:'#a58c65',radius:9});rail.name='crew-roster';
    const content=ui.scroll(rail,7,7,w-14,56,56),scroll=content.__scrollView;
    content.getComponent(UITransform)?.setContentSize(Math.max(w-14,rows.length*64-8),56);
    if(scroll){scroll.horizontal=true;scroll.vertical=false;}
    rows.forEach((c,i)=>{const n=ui.button(content,'',i*64,0,56,56,()=>{s.selectCrew(c.id);this.refresh();},{fill:selected===c.id?'#b99560':'#deca9e',stroke:selected===c.id?'#ffdc8a':'#b59a72',name:'crew-pick-'+c.id});ui.portrait(n,c.id,3,3,50);});
  }
  profile(parent,top){
    const {ui,session:s}=this,state=s.state,id=s.selected,c=cat(id),level=state.levels[id],stats=G.catStats(state,id),skill=crewSkill(id,level,stats);
    const w=this.width-20,left=(w-10)*.425,right=w-left-10,unit=this.ui.fullBodyUnit||62;
    const passive=talentCards(id,level,stats.skillRank),descH=contentHeight(skill.description,w-30,12),passH=contentHeight(skill.passive,w-34,12);
    const skillH=160+descH+passH+passive.reduce((n,t)=>n+50+contentHeight(t.desc,w-34,12),0);
    const total=286+skillH+190;
    const content=ui.scroll(parent,10,top,w,this.height-top-6,Math.max(this.height-top-6,total));content.name='crew-detail';
    const hero=ui.panel(content,0,0,left,180,{fill:'#b89366',stroke:'#674a38',radius:10});
    ui.label(hero,c.job,9,9,left-18,18,{size:11,color:'#583e31'});
    ui.label(hero,c.name,9,26,left-18,28,{size:22,bold:true,color:'#442e25'});
    ui.label(hero,'Lv. '+level,9,54,left-18,20,{size:12,bold:true,color:'#5b3927'});
    const slot=state.party.indexOf(id);ui.label(hero,slot<0?'未出战':slot<2?'前排 '+(slot+1):'后排 '+(slot-1),9,75,left-18,18,{size:10,color:'#6b5140'});
    ui.character(hero,id,left*.53,143,unit);
    const tag=ui.button(hero,'',left/2-46,140,92,36,()=>this.open('cat-tag',{id}),{fill:'#00000000',stroke:'#00000000',name:'cat-tag-'+id});
    badge(ui,tag,state.roster.stars[id],0,0,92);
    const quote=G.upgradeQuote(level,state.guideStep===3?1:trainingCount(level),G.levelCap(state,id));
    ui.button(content,quote.levels?'升 '+quote.levels+' 级':'已满级',0,188,left,37,()=>this.act(()=>s.upgrade(id,quote.levels)),{primary:true,disabled:!quote.levels||state.gold<quote.cost,name:'upgrade-'+id});
    ui.label(content,quote.levels?'消耗 '+quote.cost.toLocaleString('zh-CN')+' 鱼币':'',0,226,left,17,{size:10,color:'#ecd9af',align:'center'});
    ui.button(content,'培养继承',0,246,left,33,()=>this.open('inherit',{id}),{disabled:!G.unlocked(state).some(c=>state.levels[c.id]>level),name:'inherit-'+id,size:12});
    const a=ui.panel(content,left+10,0,right,279,{fill:'#ecd9b4',stroke:'#a88c64',radius:7});
    ui.label(a,'人物属性',10,9,right-20,24,{size:15,bold:true,color:P.ink});
    ui.label(a,'普攻 · '+(stats.normalDamageType==='magic'?'法术':'物理'),10,35,right-20,19,{size:10,color:P.muted});
    [['生命',fmt(stats.hp)],['攻击',fmt(stats.atk)],['暴击',stats.crit+'%'],['护甲',stats.armor],['魔抗',stats.magicResist],['护甲穿透',stats.armorPen],['法术穿透',stats.magicPen]].forEach(([key,value],i)=>{
      ui.label(a,key,10,64+i*29,right*.55-10,22,{size:11,color:P.muted});ui.label(a,String(value),right*.5,64+i*29,right*.5-11,22,{size:13,color:P.ink,bold:true,align:'right'});
    });
    let y=291;
    const skills=ui.panel(content,0,y,w,skillH,{fill:'#e9d8b5',stroke:P.rim,radius:10});
    ui.label(skills,'角色技能',10,9,w-20,23,{size:15,bold:true,color:P.ink});
    const skillIndex=G.CATS.findIndex(c=>c.id===id);ui.image(skills,'assets/ui/skills-v02644.webp',12,34,32,32,[skillIndex%4*300,Math.floor(skillIndex/4)*300,300,300]);
    ui.label(skills,c.skill,49,39,w-145,23,{size:14,bold:true,color:P.ink});
    ui.label(skills,'主动 · Lv.'+(SKILL_STUDY[id].index===0?stats.skillRank+1:1),w-100,40,88,20,{size:10,color:P.muted,align:'right'});
    line(ui,skills,skill.description,12,66,w-24,12,P.ink,descH);
    let sy=66+descH+8;
    ui.button(skills,'技能升级',12,sy,w-24,28,()=>this.open('skill',{id}),{name:'skill-level-'+id,size:11});sy+=38;
    const passiveName={orange:'稳稳接住',ink:'一击中的',milk:'加满一杯',spark:'余温未散',mint:'冷静一下',bolt:'彻底拆解',pudding:'硬气护体',star:'星光先行'}[id];
    ui.label(skills,passiveName,12,sy,w-146,21,{size:12,bold:true,color:level>=5?P.green:P.muted});ui.label(skills,level>=5?'被动 · Lv.'+(SKILL_STUDY[id].index===1?stats.skillRank+1:1):'角色 Lv.5 解锁',w-137,sy,124,21,{size:10,color:P.muted,align:'right'});sy+=25;
    line(ui,skills,skill.passive,12,sy,w-24,12,level>=5?P.ink:P.muted,passH);sy+=passH+10;
    passive.forEach(t=>{
      ui.label(skills,t.name,12,sy,w-134,21,{size:13,bold:true,color:t.active?P.ink:P.muted});ui.label(skills,t.active?'被动 · Lv.'+t.rank:'Lv.'+t.level+' 解锁',w-126,sy,113,21,{size:10,color:P.muted,align:'right'});sy+=25;
      const h=contentHeight(t.desc,w-24,12);line(ui,skills,t.desc,12,sy,w-24,12,t.active?P.ink:P.muted,h);sy+=h+12;
    });
    y+=skillH+10;
    const bq=G.breakthroughQuote(state,id),next=bq.maxed?'技能已满级':'下一级：'+skillSummary(id,bq.rank+1),studyH=42+contentHeight(next,w-24,11)+94;
    const study=ui.panel(content,0,y,w,studyH,{fill:'#d6c3a1',stroke:P.rim,radius:8});
    ui.label(study,'绝活研习 · '+SKILL_STUDY[id].name,10,9,w-20,23,{size:13,bold:true,color:P.ink});
    const nh=contentHeight(next,w-24,11);line(ui,study,next,12,37,w-24,11,P.muted,nh);
    const cy=42+nh;costs(ui,study,state,{badges:bq.cost,notes:bq.notes,seals:bq.seals},id,10,cy,w-20,(t,d)=>this.open(t,d));
    ui.button(study,bq.maxed?'已满级':bq.canAfford?'研习':'材料不足',10,cy+53,w-20,32,()=>this.act(()=>s.breakthrough(id)),{primary:true,disabled:bq.maxed||!bq.canAfford,name:'breakthrough-'+id,size:12});
    y+=studyH+10;content.getComponent(UITransform)?.setContentSize(w,y);
  }
  avatars(parent,x,y,w,selected){
    const {ui,session:s}=this,rows=G.unlocked(s.state),size=48,gap=7,columns=Math.max(1,Math.floor((w+gap)/(size+gap)));
    rows.forEach((c,i)=>{
      const n=ui.button(parent,'',x+i%columns*(size+gap),y+Math.floor(i/columns)*(size+gap),size,size,()=>{s.selectCrew(c.id);this.refresh();},{primary:selected===c.id,fill:selected===c.id?'#d9b777':'#e8d3ae',name:'crew-pick-'+c.id});
      ui.portrait(n,c.id,3,3,size-6);if(s.state.party.includes(c.id))ui.label(n,'●',size-12,0,10,12,{size:9,color:'#7eab82'});
    });
  }
  equipment(parent,top){
    const {ui,session:s}=this,state=s.state,id=s.selected,w=this.width-20,c=cat(id),bagW=Math.max(125,w*.40),leftW=w-bagW-10;
    const body=ui.scroll(parent,10,top,w,this.height-top-8,253);body.name='equipment-detail-scroll';const layout=ui.group(body,0,0,w,253,'crew-equipment');
    const stage=ui.panel(layout,0,0,leftW,165,{fill:'#d7c19a',stroke:'#846446',radius:11});stage.name='equipment-stage';
    ui.panel(stage,7,7,leftW-14,151,{fill:'#00000000',stroke:'#a4875b80',radius:6});
    ui.label(stage,c.name,leftW/2-35,21,70,22,{size:14,bold:true,color:'#513c2b',align:'center'});ui.label(stage,'Lv.'+state.levels[id],leftW/2-35,44,70,14,{size:9,color:'#7e6547',align:'center'});
    ui.character(stage,id,leftW*.5,111,this.ui.fullBodyUnit||62);
    const pos={claw:[10,13],collar:[leftW-50,13],coat:[10,69],brace:[leftW-50,69],rune:[leftW/2-20,115]};
    E.GEAR_SLOTS.forEach(slot=>{const e=state.inventory.items.find(e=>e.id===state.inventory.equipped[id]?.[slot.id]),[x,y]=pos[slot.id],node=gearTile(ui,stage,e,x,y,40,n=>{if(e)this.open('equipment',{uid:e.id,id,anchor:this.anchor(n)});else{this.equipSlot=this.equipSlot===slot.id?'':slot.id;this.refresh();}},'equipped-'+slot.id);if(!e)ui.label(node,'＋',0,2,40,34,{size:23,color:'#957448',align:'center'});});
    const bag=ui.panel(layout,leftW+10,0,bagW,253,{fill:'#233848',stroke:'#687f8a',radius:9});bag.name='equipment-bag';
    ui.label(bag,'背包',9,8,44,22,{size:12,bold:true,color:'#f1d7a6'});ui.button(bag,this.equipSlot?E.GEAR_SLOTS.find(x=>x.id===this.equipSlot).name:'全部',56,6,bagW-64,26,()=>{this.equipSlot='';this.refresh();},{size:10,name:'equipment-clear-filter',fill:'#00000000',stroke:'#00000000',color:'#f1d7a6'});
    const items=ownedGear(state,this.equipSlot),size=(bagW-19)/2,grid=ui.scroll(bag,7,38,bagW-14,207,Math.max(207,Math.ceil(Math.max(items.length,6)/2)*(size+5)));grid.name='equipment-bag-grid';
    for(let i=0;i<Math.max(6,items.length);i++)gearTile(ui,grid,items[i],i%2*(size+5),Math.floor(i/2)*(size+5),size,n=>items[i]&&this.open('equipment',{uid:items[i].id,id,anchor:this.anchor(n)}));
    const bonus=E.gearBonuses(state,id),effects=E.GEAR_SETS.filter(x=>bonus.counts[x.id]>=2).flatMap(set=>[{set,pieces:2,text:set.two},...(bonus.counts[set.id]>=4?[{set,pieces:4,text:set.four}]:[])]);
    if(effects.length){const strip=ui.panel(layout,0,173,leftW,Math.max(43,effects.length*34+10),{fill:'#d6d6b9',stroke:'#7b8667',radius:7});strip.name='equipment-set-strip';effects.forEach((effect,i)=>{const n=ui.button(strip,'',6,5+i*34,leftW-12,31,()=>this.open('set',{id:effect.set.id,companion:id}),{fill:'#00000000',stroke:'#00000000',name:'set-'+effect.set.id+'-'+effect.pieces});ui.label(n,effect.set.name+' · '+effect.pieces+'件  ›',0,0,leftW-12,14,{size:9,bold:true,color:'#526046'});ui.label(n,effect.text,0,14,leftW-12,17,{size:10,color:'#5c6048',wrap:false});});}
  }
  formation(parent,top){
    const {ui,session:s}=this,w=this.width-20,columns=Math.max(1,Math.floor((w-11)/55)),boardH=Math.min(350,Math.max(270,this.height-top-360)),benchH=49+Math.ceil(G.unlocked(s.state).length/columns)*55,contentH=429+boardH+benchH;
    const content=ui.scroll(parent,10,top,w,this.height-top-5,contentH);content.name='formation-scroll';this.formationNodes=new Map();
    TEAM_PLANS.forEach((plan,i)=>{
      const card=ui.panel(content,0,i*186,w,176,{fill:i===0?'#d6c3a4':'#c7c5aa',stroke:P.rim,radius:9});
      ui.label(card,plan.name,12,9,w-24,24,{size:15,bold:true,color:P.ink});
      plan.party.forEach((id,j)=>{ui.portrait(card,id,11+j*45,39,38);});
      line(ui,card,plan.focus,12,80,w-24,10,P.ink,38);line(ui,card,plan.use,12,119,w-24,10,P.muted,20);
      ui.button(card,s.state.teamPlan===plan.id?'重新上阵已结识伙伴':'采用这套阵容',12,141,w-24,28,()=>this.act(()=>s.applyTeam(plan.id)),{primary:true,size:11,name:'team-plan-'+plan.id});
    });
    const by=379,board=ui.panel(content,0,by,w,boardH,{fill:'#73533e',stroke:P.rim,radius:10});
    ui.image(board,'assets/scenes/formation-room-v02620.webp',0,0,w,boardH);
    ui.label(board,'后排',15,10,80,23,{size:13,bold:true,color:'#553b29'});ui.label(board,'前排',w-95,10,80,23,{size:13,bold:true,color:'#553b29',align:'right'});
    const slots=[[69,42],[69,75],[31,29],[31,56],[31,83]],hitNodes=[];
    slots.forEach(([px,py],i)=>{
      const id=s.state.party[i],x=w*px/100,y=boardH*py/100;
      const b=ui.button(board,'',x-42,y-55,84,78,()=>{
        if(this.draggingId||Date.now()-this.lastDrag<350)return;
        if(this.formationSelected){const chosen=this.formationSelected;this.formationSelected=null;this.act(()=>s.setParty(i,chosen));}
        else if(id){this.formationSelected=id;this.refresh();}
      },{fill:this.formationSelected===id?'#ffdf8044':'#00000000',stroke:'#00000000',name:'formation-slot-'+i});
      hitNodes[i]=b;
      if(id){ui.character(b,id,42,61,this.ui.fullBodyUnit||62);ui.label(b,cat(id).name,0,61,84,18,{size:10,bold:true,color:'#503726',align:'center'});}
      else ui.label(b,'＋',0,14,84,48,{size:30,color:'#c9b18b',align:'center'});
    });
    const benchY=by+boardH+11,bench=ui.panel(content,0,benchY,w,benchH,{fill:'#cbb28a',stroke:'#805e40',radius:8});
    ui.label(bench,this.formationSelected?'已选 '+cat(this.formationSelected).name:'伙伴',10,7,w-110,24,{size:12,bold:true,color:P.ink});
    ui.button(bench,'下场',w-83,6,73,27,()=>{if(this.formationSelected){const id=this.formationSelected;this.formationSelected=null;this.act(()=>s.removeParty(id));}},{disabled:!this.formationSelected,size:11,name:'formation-dismiss'});
    G.unlocked(s.state).forEach((c,i)=>{
      const b=ui.button(bench,'',9+i%columns*55,40+Math.floor(i/columns)*55,48,48,()=>{if(this.draggingId||Date.now()-this.lastDrag<350)return;this.formationSelected=this.formationSelected===c.id?null:c.id;this.refresh();},{primary:this.formationSelected===c.id,name:'formation-bench-'+c.id});
      ui.portrait(b,c.id,2,2,44);if(s.state.party.includes(c.id))ui.label(b,'出战',13,33,34,13,{size:8,color:'#fff2d5',align:'center'});
      this.bindDrag(b,c.id,false,content,hitNodes,bench);
    });
    hitNodes.forEach((n,i)=>{const id=s.state.party[i];if(id)this.bindDrag(n,id,true,content,hitNodes,bench);});
    this.formationHint=ui.label(content,'拖动换位 · 下拖下场',0,benchY+benchH+7,w,21,{size:11,color:'#e8c99c',align:'center'});
  }
  bindDrag(node,id,fromBoard,parent,slots,bench){
    let drag=null,ghost=null;const {ui,session:s}=this,scroll=parent.__scrollView;
    if(!this.formationNodes.has(id))this.formationNodes.set(id,[]);this.formationNodes.get(id).push(node);
    const targetAt=p=>{
      const br=worldRect(bench);
      if(fromBoard&&p.y<=br.y+br.height+6&&p.x>=br.x-20&&p.x<=br.x+br.width+20)return 'bench';
      const r=worldRect(slots[0].parent);
      if(p.x<r.x-18||p.x>r.x+r.width+18||p.y<r.y-8||p.y>r.y+r.height+16)return null;
      let target=null,distance=Infinity;slots.forEach((n,i)=>{const r=worldRect(n),cx=r.x+r.width/2,cy=r.y+r.height/2,d=(cx-p.x)**2+(cy-p.y)**2;if(d<distance){target=i;distance=d;}});return target;
    };
    // A formation touch belongs to the piece. Empty board space still scrolls.
    node.on(Node.EventType.TOUCH_START,e=>{const p=e.getUILocation();drag={x:p.x,y:p.y,active:false,scrollEnabled:scroll?.enabled,hidden:[]};if(scroll){scroll.stopAutoScroll();scroll.enabled=false;}});
    node.on(Node.EventType.TOUCH_MOVE,e=>{
      if(!drag)return;const p=e.getUILocation();if(!drag.active&&Math.hypot(p.x-drag.x,p.y-drag.y)<5)return;drag.active=true;this.draggingId=id;this.lastDrag=Date.now();
      if(!ghost){ghost=ui.group(parent,0,0,80,90,'formation-drag-ghost');ui.character(ghost,id,40,80,this.ui.fullBodyUnit||62);for(const source of this.formationNodes.get(id)||[]){const opacity=source.getComponent(UIOpacity)||source.addComponent(UIOpacity);drag.hidden.push([opacity,opacity.opacity]);opacity.opacity=0;}}
      if(scroll){const bounds=worldRect(scroll.node),offset=scroll.getScrollOffset(),max=scroll.getMaxScrollOffset(),dy=p.y>bounds.y+bounds.height-24?-6:p.y<bounds.y+20?6:0;if(dy)scroll.scrollToOffset(new Vec2(-offset.x,Math.max(0,Math.min(max.y,offset.y+dy))),0);}
      const local=parent.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(p.x,p.y,0));ghost.setPosition(local.x-40,local.y+55);e.propagationStopped=true;
      const target=targetAt(p);if(this.formationHint)this.formationHint.string=target==='bench'?'松手下场':target===null?'拖动换位 · 下拖下场':cat(id).name+' → '+(target<2?'前排 '+(target+1):'后排 '+(target-1));
    });
    const finish=(e,cancel=false)=>{
      if(!drag)return;const was=drag.active;this.draggingId=null;if(scroll)scroll.enabled=drag.scrollEnabled;for(const [opacity,value]of drag.hidden)if(opacity.isValid!==false)opacity.opacity=value;drag=null;ghost?.destroy();ghost=null;if(this.formationHint)this.formationHint.string='拖动换位 · 下拖下场';if(!was||cancel)return;
      this.lastDrag=Date.now();this.formationSelected=null;const target=targetAt(e.getUILocation());
      if(target==='bench')s.removeParty(id);else if(target!==null)s.setParty(target,id);this.refresh();
    };
    node.on(Node.EventType.TOUCH_END,e=>finish(e));
    // Cocos 3.8.8 changes an outside TOUCH_END to node-level TOUCH_CANCEL.
    // getEventCode retains the input phase, so a valid off-piece drop still lands.
    node.on(Node.EventType.TOUCH_CANCEL,e=>finish(e,e.simulate||e.getEventCode?.()!==Node.EventType.TOUCH_END));
  }
  bag(parent){
    const {ui,session:s}=this,state=s.state,w=this.width-20;
    const wallet=ui.panel(parent,10,10,w,48,{fill:'#e6ceaa',stroke:'#af8759',radius:9});
    materialArt(ui,wallet,'gold',10,11,26);ui.label(wallet,fmt(state.gold),41,7,w*.48-41,23,{size:16,bold:true,color:P.ink}).node.name='wallet-gold';ui.label(wallet,'鱼币',41,29,55,14,{size:9,color:P.muted});
    materialArt(ui,wallet,'badges',w*.53,11,26);ui.label(wallet,fmt(state.badges),w*.53+31,7,w*.47-38,23,{size:16,bold:true,color:P.ink}).node.name='wallet-badges';ui.label(wallet,'护送勋章',w*.53+31,29,90,14,{size:9,color:P.muted});
    [['equipment','装备'],['materials','材料'],['keepsakes','信物']].forEach(([id,title],i)=>ui.button(parent,title,10+i*(w+5)/3,68,(w-10)/3,35,()=>{this.bagTab=id;this.refresh();},{primary:this.bagTab===id,name:'bag-tab-'+id,size:12}));
    const sy=114,h=this.height-sy-8;
    const body=ui.panel(parent,10,sy,w,h,{fill:'#d9bd96',stroke:'#ad8354',radius:10});
    if(this.bagTab==='equipment'){
      const filters=[{id:'',name:'全部'},...E.GEAR_SLOTS],fw=(w-18)/3;
      filters.forEach((f,i)=>ui.button(body,f.name,6+i%3*fw,7+Math.floor(i/3)*30,fw-4,26,()=>{this.bagSlot=f.id;this.refresh();},{primary:this.bagSlot===f.id,name:'bag-filter-'+(f.id||'all'),size:10}));
      const items=ownedGear(state,this.bagSlot),size=(w-40)/5,grid=ui.scroll(body,9,75,w-18,h-85,Math.max(h-85,Math.ceil(Math.max(items.length,20)/5)*(size+6)));
      for(let i=0;i<Math.max(items.length,20);i++)gearTile(ui,grid,items[i],i%5*(size+5),Math.floor(i/5)*(size+6),size,n=>items[i]&&this.open('equipment',{uid:items[i].id,id:s.selected,anchor:this.anchor(n)}));
    }else if(this.bagTab==='materials'){
      const rows=E.materialRows(state).filter(r=>r.count>0),cw=(w-28)/2,grid=ui.scroll(body,9,10,w-18,h-20,Math.max(h-20,Math.ceil(rows.length/2)*105));
      rows.forEach((m,i)=>{const n=ui.button(grid,'',i%2*(cw+9),Math.floor(i/2)*105,cw,97,()=>this.open('material',{id:m.id}),{fill:'#e9d6b4',name:'material-'+m.id});materialArt(ui,n,m.id,cw/2-19,7,38);ui.label(n,m.name,4,49,cw-8,20,{size:12,bold:true,color:P.ink,align:'center'});ui.label(n,fmt(m.count),4,72,cw-8,18,{size:12,color:P.muted,align:'center'});});
      if(!rows.length)ui.label(grid,'还没有材料',0,40,w-18,30,{size:13,color:P.muted,align:'center'});
    }else{
      const rows=Object.entries(KEEPSAKES).filter(([id])=>state.roster.shards[id]>0),cw=(w-39)/4,grid=ui.scroll(body,9,10,w-18,h-20,Math.max(h-20,Math.ceil(rows.length/4)*109));
      rows.forEach(([id,[owner,name]],i)=>{const n=ui.button(grid,'',i%4*(cw+7),Math.floor(i/4)*109,cw,101,()=>this.open('keepsake',{id}),{fill:'#ead4b0',name:'keepsake-'+id});keepsakeArt(ui,n,id,cw/2-22,7,44);ui.label(n,name,3,54,cw-6,24,{size:10,bold:true,color:P.ink,align:'center'});ui.label(n,owner+' · '+fmt(state.roster.shards[id]),2,80,cw-4,18,{size:9,color:P.muted,align:'center'});});
      if(!rows.length)line(ui,grid,'去失物追寻带回伙伴信物。',20,40,w-58,13,P.muted,55);
    }
  }
  map(parent){
    const {ui}=this,w=this.width,h=this.height;
    ui.image(parent,'assets/scenes/neighborhood-v0220.webp',0,0,w,h);
    const stall=ui.button(parent,'',0,h*.475,w*.44,h*.35,()=>this.open('stall'),{fill:'#00000000',stroke:'#00000000',name:'district-stall'});
    const board=ui.button(parent,'',w*.60,h*.637,w*.36,h*.16,()=>{this.session.guideEvent('board');this.open('arena');},{fill:'#00000000',stroke:'#00000000',name:'district-board'});
    ui.button(parent,'成长清单',12,12,100,32,()=>this.open('quests'),{fill:'#ead4ad',name:'growth-quests',size:11});
    ui.button(parent,'设置',w-69,12,57,32,()=>this.open('settings'),{fill:'#ead4ad',name:'settings',size:11});
    // Touch targets match the actual painted shop and noticeboard; no screenshot UI.
  }
}
