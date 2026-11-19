// @ts-nocheck
// Every modal is a native Cocos node tree. Domain mutations stay in GameSession.
import { Node, UITransform, EditBox, Label, BlockInputEvents } from 'cc';
import * as G from '../domain/core';
import * as E from '../domain/equipment';
import * as A from '../domain/activities';
import * as C from '../domain/campaign';
import { recruitQuote, starQuote } from '../domain/companions';
import { EQUIPMENT_ROUTES, equipmentRoute, EQUIPMENT_SERIES } from '../domain/equipment-routes';
import { KEEPSAKES } from '../domain/keepsakes';
import { BADGE_NAMES } from '../domain/growth-visual';
import { MATERIAL_NAMES } from '../domain/loot-data';
import { MATERIAL_INFO, materialHave } from '../domain/material-info';
import { skillSummary, SKILL_STUDY } from '../domain/skill-training';
import { tokenRewardReady } from '../domain/token-rewards';
import { teamPlan } from '../domain/team-plans';
import { crewSkill } from '../domain/crew-skill';
import { P, fmt, clean, cat, contentHeight, line, progress, keepsakeArt, materialArt, gearArt, gearTile, rewardRow, costs, badge, paw, anchorRect, sceneCard } from './Pages';

const GROUPS=[{id:'recruit',name:'失物追寻',copy:'每日三次 · 随机信物与广告自选'},{id:'notes',name:'后巷清扫',copy:'研习技能所需的笔记'},{id:'badges',name:'夜班护送',copy:'研习技能所需的勋章'},{id:'scrap',name:'旧件回收场',copy:'强化装备所需的零件'},{id:'essence',name:'熄灯工坊',copy:'洗炼副属性所需的打磨砂'},{id:'equipment',name:EQUIPMENT_SERIES,copy:'三处旧街据点 · 按部位寻宝'},{id:'hard',name:'街区硬仗',copy:'历练印记与首通装备'}];
const JOBS={notes:'sweep',badges:'escort',scrap:'parts',essence:'polish'};
export const groupFor = kind => ({sweep:'notes',escort:'badges',parts:'scrap',polish:'essence',salvage:'equipment',wardrobe:'equipment',nightwatch:'equipment',hunt:'equipment'}[kind]||kind);
const requestFor=(group,id='',tier=1,runeSearch=false)=>({... (group==='equipment'?{kind:equipmentRoute(id)?id:'salvage',id:''}:JOBS[group]?{kind:JOBS[group],id:''}:group==='materials'?{kind:id,id:''}:{kind:group,id}),tier,runeSearch});
const choicesFor=group=>group==='recruit'?[{id:'all',name:'失物追寻'}]:group==='equipment'?EQUIPMENT_ROUTES:JOBS[group]?A.MATERIAL_JOBS.filter(x=>x.id===JOBS[group]):group==='hard'?A.HARD_JOBS:group==='hunt'?A.HUNTS:A.MATERIAL_JOBS;
const rewardFor=q=>({...A.activityReward(q),gear:q.rewardable!==false&&(equipmentRoute(q.kind)||q.kind==='hard'&&q.first||q.kind==='hunt')?1:0});

export class Dialogs {
  ui; session; cb; width=390; height=844; type=''; data={}; tokenSelected=''; tokenTicket=null; busy=false; gearExpanded=new Set(); importText=''; exportText='';
  constructor(ui,session,callbacks){this.ui=ui;this.session=session;this.cb=callbacks;}
  close(){if(this.type==='pause')this.session.resume?.();this.cb.close();}
  dismiss(){if(this.type==='street'&&this.data.detail!==false){this.open('street',{...this.data,detail:false});return;}this.close();}
  open(type,data?){if(type==='equipment')this.session.guideEvent('gear');this.cb.open(type,data);}
  refresh(){this.cb.refresh();}
  anchor(node){return anchorRect(node,this.renderRoot);}
  act(fn,done?){
    const value=fn();if(value&&typeof value.then==='function')return value.then(r=>{if(r!==false&&r!==null)done?.(r);this.refresh();return r;});
    if(value!==false&&value!==null)done?.(value);this.refresh();return value;
  }
  render(parent,width,height,type,data={}){
    this.width=width;this.height=height;this.renderRoot=parent;this.type=type;this.data=data||{};
    const blocked=type==='intro',outside=type==='report'?()=>this.dismissReport():()=>this.dismiss();
    const backdrop=this.ui.panel(parent,0,0,width,height,{fill:['equipment','material','set'].includes(type)?'#00000000':'#211927bb',stroke:'#00000000',radius:0});backdrop.name='modal-backdrop';backdrop.addComponent(BlockInputEvents);if(!blocked)backdrop.on(Node.EventType.TOUCH_END,outside);
    if(type==='report')return this.report(parent);
    if(type==='intro')return this.intro(parent);
    const titles={equipment:'装备',inherit:'培养继承','cat-tag':'猫牌升阶',skill:'技能升级',set:'套装属性',keepsake:'伙伴信物',material:'材料',arena:'猫巷委托板',street:'委托',stall:'鱼摊',journal:'猫巷手账',challenges:'街头挑战',quests:'接下来做什么',settings:'猫猫休息室',export:'把猫猫存档带走',import:'导入一份存档','confirm-import':'这份存档可以读取',reset:'从头开始？',pause:'歇一会儿',victory:'这条街，已经走遍。',routes:'街区开拓',recruit:'新队员加入'};
    const method={'cat-tag':'ascension','confirm-import':'confirmImport',arena:'hub',set:'gearSet',export:'exportSave',import:'importSave'}[type]||type;
    const defaultH={equipment:570,inherit:400,'cat-tag':530,skill:510,set:350,keepsake:380,material:310,stall:630,settings:430,export:480,import:490,'confirm-import':340,reset:280,pause:310,victory:200,recruit:480}[type];
    const popover=['equipment','material','keepsake','set'].includes(type),boxH=Math.min(popover?height*.7:height-36,defaultH||height-50),boxW=Math.min(width-24,popover?270:368),a=this.data.anchor;
    const x=a?Math.max(12,Math.min(width-boxW-12,a.x+a.w/2<width/2?a.x+a.w+8:a.x-boxW-8)):(width-boxW)/2,y=a?Math.max(12,Math.min(height-boxH-12,a.y)):(height-boxH)/2;
    const panel=this.ui.panel(parent,x,y,boxW,boxH,{fill:'#e9d8b5',stroke:'#654731',radius:13});
    panel.addComponent(BlockInputEvents);
    panel.name='dialog-'+type;
    this.ui.label(panel,titles[type]||'',15,13,boxW-66,29,{size:19,bold:true,color:P.ink});
    this.ui.button(panel,'×',boxW-44,10,32,30,()=>this.dismiss(),{name:'modal-close',size:23,fill:'#ceb18a'});
    const body=this.ui.scroll(panel,12,53,boxW-24,boxH-65,boxH-65);
    body.name='dialog-content';
    if(typeof this[method]==='function')this[method](body,boxW-24,boxH-65,this.data);
    else line(this.ui,body,'',0,0,boxW-24);
    return panel;
  }
  heightOf(node,w,h){node.getComponent(UITransform)?.setContentSize(w,Math.max(1,h));}
  intro(parent){
    const {ui}=this,w=Math.min(350,this.width-34),h=295,x=(this.width-w)/2,y=(this.height-h)/2;
    const p=ui.panel(parent,x,y,w,h,{fill:'#e9d8b5',stroke:P.rim,radius:13});p.name='intro';ui.image(p,'assets/mobile/street-0-v02684.webp',5,5,w-10,108,[0,235,418,145]);
    ui.character(p,'orange',w*.36,107,this.ui.fullBodyUnit||62);ui.character(p,'ink',w*.65,107,this.ui.fullBodyUnit||62);
    ui.label(p,'罐头远征队',12,118,w-24,38,{size:27,bold:true,color:P.ink,align:'center'});
    line(ui,p,'橘座和阿墨准备好了。先从第 1 关出发，伙伴会自动战斗。',23,163,w-46,13,P.muted,52);
    ui.button(p,'出发',20,229,w-40,43,()=>{this.close();this.session.beginIntro();},{primary:true,name:'intro-start'});
  }
  equipment(body,w,h,{uid,id=this.session.selected,inspect=false}){
    const {ui,session:s}=this,state=s.state,e=state.inventory.items.find(e=>e.id===uid);if(!e){this.close();return;}
    const owner=E.gearOwner(state,uid),q=E.enhanceQuote(e),set=E.GEAR_SETS.find(set=>set.id===e.set);
    gearArt(ui,body,e,5,8,56);ui.label(body,E.GEAR_SLOTS.find(x=>x.id===e.slot).name,73,1,w-73,21,{size:11,color:P.muted});
    line(ui,body,E.gearName(e)+(e.enhance?' +'+e.enhance:''),73,24,w-73,16,P.ink,50);
    let y=82;Object.entries(E.gearValues(e)).forEach(([k,v])=>{ui.panel(body,0,y,w,30,{fill:'#d8c197',stroke:'#b59a6e',radius:5});ui.label(body,E.attrText(k,v),9,y+3,w-18,24,{size:13,bold:true,color:P.ink});y+=35;});
    if(e.slot==='rune'){const desc=E.RUNES.find(r=>r.id===e.rune).desc,dh=contentHeight(desc,w-10,12);line(ui,body,desc,5,y,w-10,12,P.ink,dh);y+=dh+13;}
    else {ui.label(body,set.name,3,y,w-6,23,{size:14,bold:true,color:P.ink});y+=26;for(const [n,t]of [[2,set.two],[4,set.four]]){const txt=n+' 件 · '+t,dh=contentHeight(txt,w-10,12);line(ui,body,txt,5,y,w-10,12,P.muted,dh);y+=dh+8;}}
    if(inspect){this.heightOf(body,w,y+8);return;}
    ui.button(body,owner===id?'卸下':'穿戴 · '+cat(id).name,0,y,w,39,()=>this.act(()=>owner===id?s.unequip(id,e.slot):s.equip(uid,id),()=>{if(s.state.guideStep===23)this.close();}),{primary:true,name:'gear-equip'});y+=47;
    const expanded=this.gearExpanded.has(uid);ui.button(body,'强化与管理　'+(expanded?'▾':'▸'),0,y,w,31,()=>{if(expanded)this.gearExpanded.delete(uid);else this.gearExpanded.add(uid);this.refresh();},{name:'gear-more',size:12});y+=39;
    if(expanded){if(e.slot!=='rune'){
      const costLine=q.maxed?'强化已满 +'+E.GEAR_MAX:'强化　'+fmt(q.gold)+' 鱼币 / '+q.scrap+' 零件';
      ui.button(body,costLine,0,y,w,37,()=>this.act(()=>s.enhance(uid)),{disabled:q.maxed||state.gold<q.gold||state.inventory.materials.scrap<q.scrap,name:'gear-enhance',size:12});y+=44;
      e.subs.forEach((sub,i)=>{ui.button(body,'洗炼 · '+E.ATTRS[sub.key].name+'　2 打磨砂',0,y,w,33,()=>this.act(()=>s.reforge(uid,i)),{disabled:state.inventory.materials.essence<2,name:'gear-reforge-'+i,size:11});y+=39;});
    }
    ui.button(body,e.locked?'解锁':'锁定',0,y,(w-8)/2,32,()=>this.act(()=>s.lockGear(uid)),{name:'gear-lock',size:12});
    ui.button(body,'分解',(w+8)/2,y,(w-8)/2,32,()=>this.act(()=>s.dismantle(uid),()=>this.close()),{disabled:!!owner||e.locked,name:'gear-dismantle',size:12});y+=45;}
    const story=E.gearStory(e),sh=contentHeight(story,w-10,11);line(ui,body,story,5,y,w-10,11,P.muted,sh);this.heightOf(body,w,y+sh+8);
  }
  inherit(body,w,h,{id=this.session.selected}){
    const {ui,session:s}=this,level=s.state.levels[id],rows=G.unlocked(s.state).filter(c=>s.state.levels[c.id]>level);
    ui.label(body,'把培养转给'+cat(id).name,2,3,w-4,26,{size:15,bold:true,color:P.ink});
    rows.forEach((c,i)=>{const n=ui.button(body,'',0,40+i*84,w,76,()=>this.act(()=>s.inherit(c.id,id),()=>this.close()),{name:'inherit-from-'+c.id,fill:'#dfc8a1'});ui.portrait(n,c.id,8,11,46);ui.label(n,cat(id).name+' Lv.'+level+' → Lv.'+s.state.levels[c.id],64,9,w-74,24,{size:12,bold:true,color:P.ink});ui.label(n,c.name+' Lv.'+s.state.levels[c.id]+' → Lv.'+level,64,35,w-74,20,{size:11,color:P.muted});});
    if(!rows.length)line(ui,body,'没有培养等级更高的伙伴。',8,48,w-16,12,P.muted,40);
    this.heightOf(body,w,Math.max(h,50+rows.length*84));
  }
  ascension(body,w,h,{id=this.session.selected}){
    const {ui,session:s}=this,state=s.state,q=starQuote(state,id),before=G.catStats(state,id),after=G.catStats({...state,roster:{...state.roster,stars:{...state.roster.stars,[id]:q.nextRank},tagSteps:{...state.roster.tagSteps,[id]:q.nextStep}}},id);
    ui.label(body,cat(id).name+'的猫牌',0,0,w,26,{size:16,bold:true,color:P.ink,align:'center'});
    const positions=q.maxed?[w/2-57]:[17,w-131];
    positions.forEach((x,i)=>{const rank=i?q.nextRank:q.rank;paw(ui,body,rank,x+13,38,88);ui.label(body,i?'下一品质':'当前',x,28,114,16,{size:10,color:P.muted,align:'center'});ui.label(body,BADGE_NAMES[rank],x,124,114,25,{size:16,bold:true,color:P.ink,align:'center'});ui.label(body,'生命、攻击 +'+(i?q.nextBonus:q.bonus)+'%',x-6,153,126,24,{size:11,color:P.muted,align:'center'});});
    let y=188;
    if(!q.maxed){
      ui.panel(body,0,y,w,93,{fill:'#d8c6a2',stroke:'#a88d61',radius:7});
      ui.label(body,'本次生命、攻击提升 '+q.gain+'%',8,y+8,w-16,24,{size:15,bold:true,color:'#806234',align:'center'});
      ui.label(body,'攻击 '+fmt(before.atk)+' → '+fmt(after.atk),10,y+39,w-20,21,{size:12,color:P.ink,align:'center'});
      ui.label(body,'生命 '+fmt(before.hp)+' → '+fmt(after.hp),10,y+64,w-20,21,{size:12,color:P.ink,align:'center'});y+=104;
      y+=costs(ui,body,state,{shards:q.shards,notes:q.notes},id,0,y,w,(t,d)=>this.open(t,d));
    }
    const can=q.owned&&!q.maxed&&q.have>=q.shards&&state.growth.notes>=q.notes;
    ui.button(body,q.maxed?'已满阶':can?'升阶':'材料不足',0,y,w,41,()=>this.act(()=>s.ascend(id)),{primary:true,disabled:!can,name:'cat-tag-upgrade'});y+=51;
    if(!q.maxed){ui.button(body,'获取信物',0,y,(w-8)/2,31,()=>this.open('street',{group:'recruit',id:'all',detail:true}),{size:11,name:'cat-tag-shards'});ui.button(body,'获取笔记',(w+8)/2,y,(w-8)/2,31,()=>this.open('street',{group:'notes',id:'sweep',detail:true}),{size:11,name:'cat-tag-notes'});y+=38;}
    this.heightOf(body,w,Math.max(h,y));
  }
  skill(body,w,h,{id=this.session.selected}){
    const {ui,session:s}=this,rank=s.state.breakthroughs[id]||0;
    ui.label(body,SKILL_STUDY[id].name,0,0,w,25,{size:16,bold:true,color:P.ink});let y=33;
    [0,1,2,3].forEach(r=>{const txt=skillSummary(id,r),dh=contentHeight(txt,w-26,12),panel=ui.panel(body,0,y,w,42+dh,{fill:r===rank?'#e3d29e':'#d8c5a4',stroke:r===rank?'#9b6d36':'#a28a68',radius:7});ui.label(panel,'Lv.'+(r+1)+(r===rank?' · 当前':''),10,7,w-20,22,{size:14,bold:true,color:P.ink});line(ui,panel,txt,12,35,w-24,12,P.muted,dh);y+=51+dh;});
    const q=G.breakthroughQuote(s.state,id);y+=costs(ui,body,s.state,{badges:q.cost,notes:q.notes,seals:q.seals},id,0,y,w,(t,d)=>this.open(t,d));
    ui.button(body,q.maxed?'已满级':'研习',0,y,w,38,()=>this.act(()=>s.breakthrough(id)),{primary:true,disabled:q.maxed||!q.canAfford,name:'study-skill'});this.heightOf(body,w,y+48);
  }
  gearSet(body,w,h,{id,companion=this.session.selected}){
    const {ui}=this,set=E.GEAR_SETS.find(s=>s.id===id),n=E.gearBonuses(this.session.state,companion).counts[id]||0;
    ui.label(body,set.name+' · '+n+'件',0,2,w,29,{size:20,bold:true,color:P.ink});
    line(ui,body,'2 件 · '+set.two,0,45,w,14,n>=2?P.green:P.muted,53);line(ui,body,'4 件 · '+set.four,0,110,w,14,n>=4?P.green:P.muted,85);
  }
  material(body,w,h,{id,companion,inspect=false}){
    const {ui}=this,info=MATERIAL_INFO[id]||{},title=id==='shards'&&companion?cat(companion).name+'的信物':MATERIAL_NAMES[id]||id;
    materialArt(ui,body,id,w/2-24,3,48,companion);ui.label(body,title,0,61,w,25,{size:17,bold:true,color:P.ink,align:'center'});
    let y=96,dh=contentHeight(info.description,w-12,12);line(ui,body,info.description||'',6,y,w-12,12,P.muted,dh);y+=dh+10;
    if(info.source){const sh=contentHeight(info.source,w-12,11);line(ui,body,info.source,6,y,w-12,11,P.muted,sh);y+=sh+8;}
    ui.label(body,'当前持有：'+fmt(materialHave(this.session.state,id,companion)),6,y,w-12,24,{size:12,color:P.ink});y+=33;
    if(info.group&&!inspect){ui.button(body,'前往获取',0,y,w,36,()=>this.open('street',{group:info.group,id:id==='shards'?'all':info.route,detail:true}),{primary:true,name:'material-go'});y+=45;}
    this.heightOf(body,w,Math.max(h,y));
  }
  keepsake(body,w,h,{id}){
    const {ui,session:s}=this,[owner,name,desc]=KEEPSAKES[id],q=recruitQuote(s.state,id);
    keepsakeArt(ui,body,id,w/2-36,2,72);ui.label(body,name,0,79,w,28,{size:18,bold:true,color:P.ink,align:'center'});
    ui.label(body,owner+' · 持有 '+fmt(q.have)+' / '+(q.owned?'升阶所需信物':q.cost),0,110,w,22,{size:12,color:P.muted,align:'center'});
    const dh=contentHeight(desc,w-14,12);line(ui,body,desc,7,144,w-14,12,P.muted,dh);let y=154+dh;
    ui.button(body,q.owned?'查看伙伴升阶':'邀入远征队 · '+q.have+'/'+q.cost,0,y,w,37,()=>{if(q.owned){this.open('cat-tag',{id});}else this.act(()=>s.recruit(id),()=>this.open('recruit',{id}));},{primary:true,disabled:!q.owned&&q.have<q.cost,name:'recruit-'+id,size:12});y+=46;
    ui.button(body,'去失物追寻',0,y,w,32,()=>this.open('street',{group:'recruit',id:'all',detail:true}),{name:'keepsake-source',size:12});this.heightOf(body,w,y+43);
  }
  recruit(body,w,h,{id}){
    const {ui,session:s}=this,c=cat(id),skill=crewSkill(id,s.state.levels[id],G.catStats(s.state,id));
    ui.character(body,id,w/2,96,this.ui.fullBodyUnit||62);ui.label(body,c.name+' · '+c.job,0,111,w,28,{size:20,bold:true,color:P.ink,align:'center'});
    line(ui,body,'“'+c.quote+'”',8,148,w-16,12,P.muted,40);ui.label(body,c.skill,0,194,w,25,{size:15,bold:true,color:P.ink});
    const dh=contentHeight(skill.description,w-10,12);line(ui,body,skill.description,5,226,w-10,12,P.ink,dh);ui.button(body,'欢迎入队！',0,238+dh,w,39,()=>this.close(),{primary:true,name:'recruit-ok'});this.heightOf(body,w,289+dh);
  }
  hub(body,w,h){
    const {ui}=this,cw=(w-9)/2,cardH=145;
    GROUPS.forEach((g,i)=>{const request=requestFor(g.id,g.id==='equipment'?'salvage':''),card=ui.button(body,'',i%2*(cw+9),Math.floor(i/2)*(cardH+10),cw,cardH,()=>{this.session.guideEvent(g.id==='equipment'?'equipment-source':g.id);this.open('street',{group:g.id,detail:false});},{fill:'#ddc29a',name:'street-group-'+g.id});sceneCard(ui,card,request,3,3,cw-6,79);ui.label(card,g.name,8,88,cw-16,24,{size:13,bold:true,color:P.ink});line(ui,card,g.copy,8,116,cw-16,9,P.muted,25);});
    const y=Math.ceil(GROUPS.length/2)*(cardH+10);this.chapterLink(body,w,y,'journal','猫巷手账');this.chapterLink(body,w,y+89,'challenges','街头挑战');this.heightOf(body,w,y+180);
  }
  chapterLink(body,w,y,kind,title){const {ui}=this,n=ui.button(body,'',0,y,w,79,()=>this.open(kind),{name:'open-'+kind,fill:'#ddc5a0'});ui.image(n,'assets/ui/journal-challenge-v02677.webp',0,0,73,79,[kind==='journal'?3:771,3,762,1018]);ui.label(n,title,88,23,w-100,30,{size:17,bold:true,color:P.ink});}
  street(body,w,h,data){
    const {ui,session:s}=this,state=s.state,view={group:'recruit',tier:1,detail:true,runeSearch:false,...data};
    if(view.group==='materials')view.group=groupFor(view.id);if(view.group==='hunt')view.group='equipment';
    const choices=choicesFor(view.group);if(!choices.some(x=>x.id===view.id))view.id=choices[0]?.id||'all';
    let q=A.activityInfo(state,requestFor(view.group,view.id,Math.max(1,view.tier||1),view.runeSearch));view.tier=q.tier;
    const navigate=updates=>this.open('street',{...view,...updates});
    ui.button(body,view.detail===false?'返回委托板':'返回委托目录',0,0,w,29,()=>view.detail===false?this.open('arena'):navigate({detail:false}),{size:11,name:'street-back'});
    if(view.detail===false){
      const groupsH=Math.ceil(GROUPS.length/3)*31;
      GROUPS.forEach((g,i)=>ui.button(body,g.name,i%3*(w+5)/3,39+Math.floor(i/3)*31,(w-10)/3,27,()=>{s.guideEvent(g.id==='equipment'?'equipment-source':g.id);navigate({group:g.id,id:'',detail:false,tier:1});},{primary:g.id===view.group,name:'street-group-'+g.id,size:9}));
      let y=48+groupsH;
      choices.forEach(choice=>{const info=A.activityInfo(state,requestFor(view.group,choice.id)),reason=A.activityLockReason(state,{...info,exhausted:false}),card=ui.button(body,'',0,y,w,133,()=>{if(reason){this.cb.toast(reason);return;}s.guideEvent(choice.id);navigate({id:choice.id,tier:1,detail:true});},{fill:'#d9bd95',name:'street-choice-'+choice.id});sceneCard(ui,card,info,3,3,108,126);ui.label(card,choice.name,122,12,w-134,28,{size:17,bold:true,color:P.ink});
        if(view.group==='equipment')this.dropSlots(card,info,120,47,w-130);
        else rewardRow(ui,card,rewardFor(info),122,47,w-132,{onMaterial:(id,companion)=>this.open('material',{id,companion})});
        if(reason)line(ui,card,reason,122,104,w-132,10,'#9c3e30',26);y+=143;
      });
      if(view.group==='recruit'){
        ui.label(body,'伙伴信物',0,y,w,25,{size:15,bold:true,color:P.ink});y+=33;
        G.CATS.forEach((c,i)=>{const rq=recruitQuote(state,c.id),n=ui.button(body,'',i%2*(w+9)/2,y+Math.floor(i/2)*86,(w-9)/2,78,()=>this.open('keepsake',{id:c.id}),{fill:'#e8d1ad',name:'recruit-card-'+c.id});keepsakeArt(ui,n,c.id,4,9,48);ui.label(n,c.name,57,8,(w-9)/2-63,22,{size:13,bold:true,color:P.ink});ui.label(n,rq.owned?'已结识':rq.have+'/'+rq.cost,57,34,(w-9)/2-63,22,{size:11,color:rq.have>=rq.cost?P.green:P.muted});});y+=Math.ceil(G.CATS.length/2)*86;
      }
      this.heightOf(body,w,y+10);return;
    }
    sceneCard(ui,body,q,0,40,w,143);ui.label(body,q.name,4,192,w-8,30,{size:22,bold:true,color:P.ink});
    let y=230,story=q.dropSlots||q.kind==='recruit'?q.rule:q.story,sh=contentHeight(story,w-12,12);line(ui,body,story,6,y,w-12,12,P.muted,sh);y+=sh+13;
    if(q.dropSlots){this.dropSlots(body,q,0,y,w);y+=64;}
    if(q.kind==='nightwatch'){
      const p=ui.panel(body,0,y,w,119,{fill:q.runeSearch?'#d9bd92':'#dbcdaf',stroke:P.rim,radius:8});ui.label(p,'每日 0 点轮换 · 北京时间',10,5,w-20,19,{size:10,color:P.muted});
      ui.button(p,'寻觅妙招　'+(q.runeSearch?'已开启':'未开启'),9,28,w-18,31,()=>navigate({runeSearch:!q.runeSearch}),{primary:q.runeSearch,name:'rune-search-toggle',size:12});
      ui.label(p,'妙招牌概率 '+(q.runeSearch?'3%':'0.1%')+' / 次领奖',10,65,w-20,21,{size:12,bold:true,color:P.ink});line(ui,p,'守卫生命 ×3、攻击 ×2，追兵绕后袭击。',10,90,w-20,11,P.red,25);y+=130;
    }
    if(['sweep','escort','parts','polish'].includes(q.kind)){
      const stageNames=['门口','外街','后巷','深院','禁区'];stageNames.forEach((name,i)=>{const tier=i+1,info=A.activityInfo(state,{...q.request,tier}),n=ui.button(body,'',0,y,w,63,()=>{if(!info.open){this.cb.toast(A.activityLockReason(state,info));return;}navigate({tier});},{primary:tier===q.tier,name:'street-level-'+tier,fill:tier===q.tier?'#e4c07e':'#dcc6a0'});ui.label(n,tier+' · '+name,10,8,96,23,{size:14,bold:true,color:P.ink});ui.label(n,'◆'.repeat(tier),10,34,96,18,{size:10,color:P.muted});rewardRow(ui,n,A.activityReward({...info,rewardable:true}),120,4,w-130,{});y+=70;});
    }else if(q.kind==='recruit'){
      ui.label(body,'今日剩余 '+q.quota.remaining+' / 3 次',0,y,w,29,{size:16,bold:true,color:P.ink,align:'center'});y+=34;ui.label(body,'每次随机 5 个信物 · 每日 0 点恢复',0,y,w,23,{size:12,color:P.muted,align:'center'});y+=32;
    }else{
      ui.label(body,'委托难度　'+q.tier,0,y,w,23,{size:13,bold:true,color:P.ink});y+=31;
      const start=q.max>8?Math.max(1,Math.min(q.tier-2,q.max-4)):1,end=q.max>8?Math.min(q.max,start+4):q.max,cw=(w-24)/5;
      for(let tier=start;tier<=end;tier++){const info=A.activityInfo(state,{...q.request,tier}),i=tier-start;ui.button(body,String(tier)+(tier<=info.cleared?' ✓':''),i%5*(cw+6),y+Math.floor(i/5)*43,cw,37,()=>{if(!info.open){this.cb.toast(A.activityLockReason(state,info));return;}navigate({tier});},{primary:q.tier===tier,name:'street-level-'+tier,size:12});}y+=Math.ceil((end-start+1)/5)*43;
      if(q.max>8){ui.button(body,'上一难度',0,y,(w-8)/2,30,()=>navigate({tier:Math.max(1,q.tier-1)}),{disabled:q.tier<=1,size:11});ui.button(body,'下一难度',(w+8)/2,y,(w-8)/2,30,()=>navigate({tier:Math.min(q.max,q.tier+1)}),{disabled:q.tier>=q.max,size:11});y+=39;}
      ui.label(body,q.first?'首通奖励':q.rewardable?'今日重复领奖 '+q.quota.remaining+'/'+q.quota.limit:'今日奖励已领完 · 可练习',0,y,w,24,{size:11,color:P.muted,align:'center'});y+=31;
    }
    if(!q.dropSlots){y+=rewardRow(ui,body,rewardFor(q),0,y,w,{onMaterial:(id,companion)=>this.open('material',{id,companion})})+9;}
    ui.button(body,q.open?(q.rewardable?'接下委托 · 出发':'练习挑战'):q.exhausted?'已完成':'尚未开启',0,y,w,42,()=>{if(!q.open){this.cb.toast(A.activityLockReason(state,q));return;}s.guideEvent('depart');this.close();s.startActivity(q.request);},{primary:true,name:'street-fight'});this.heightOf(body,w,y+51);
  }
  dropSlots(parent,q,x,y,w){
    const {ui}=this,slots=[...(q.dropSlots||[]),...(q.kind==='nightwatch'?['rune']:[])],size=36,cw=w/Math.max(slots.length,1),cells={claw:0,brace:1,coat:2,collar:3};
    slots.forEach((slot,i)=>{if(slot==='rune')gearArt(ui,parent,{slot:'rune',rune:'focus',enhance:0},x+i*cw+(cw-size)/2,y,size);else{const cell=cells[slot];ui.image(parent,'assets/ui/equipment-slots-v0281.webp',x+i*cw+(cw-size)/2,y,size,size,[cell%2*256,Math.floor(cell/2)*256,256,256]);}ui.label(parent,E.GEAR_SLOTS.find(s=>s.id===slot).name+(slot==='rune'?' '+(q.runeSearch?'3%':'0.1%'):''),x+i*cw,y+39,cw,17,{size:9,color:P.ink,align:'center'});});
  }
  stall(body,w,h){
    const {ui,session:s}=this,state=s.state;
    ui.image(body,'assets/ui/income-stall-v0272.webp',5,2,68,68);ui.label(body,fmt(G.idleRate(state))+' 鱼币 / 分钟',83,9,w-88,24,{size:15,bold:true,color:P.ink});ui.label(body,G.supplyRate(state)+' 物资 / 分钟',83,38,w-88,23,{size:12,color:P.muted});
    ui.button(body,'收取 '+fmt(state.idle)+' 鱼币 / '+fmt(state.idleSupplies)+' 物资',0,85,w,40,()=>this.act(()=>s.claimIdle()),{primary:true,name:'idle-claim',size:12});let y=140;
    G.STALL_UPGRADES.forEach(u=>{const q=G.stallQuote(state,u.id),after={...state,stall:{...state.stall,[u.id]:q.level+1}},preview=q.maxed?'已满级':u.id==='stall'||u.id==='sign'?fmt(G.idleRate(state))+' → '+fmt(G.idleRate(after))+' 鱼币 / 分钟':u.id==='cart'?G.supplyRate(state)+' → '+G.supplyRate(after)+' 物资 / 分钟':G.idleMinutes(state)+' → '+G.idleMinutes(after)+' 分钟';
      const p=ui.panel(body,0,y,w,112,{fill:'#d6c29e',stroke:'#a4875e',radius:8});materialArt(ui,p,{stall:'supplies',sign:'gold',icebox:'essence',cart:'scrap'}[u.id],8,10,35);ui.label(p,u.name+'　Lv.'+q.level,53,8,w-64,24,{size:14,bold:true,color:P.ink});line(ui,p,u.effect.replace('每级',''),53,35,w-65,11,P.muted,21);ui.label(p,preview,8,62,w-16,20,{size:10,color:P.green});
      ui.button(p,q.maxed?'已满级':'升级 · '+q.cost+' 物资',8,84,w-16,23,()=>this.act(()=>s.upgradeStall(u.id)),{primary:true,disabled:q.maxed||state.supplies<q.cost,size:10,name:'stall-upgrade-'+u.id});y+=122;});
    this.heightOf(body,w,y);
  }
  journal(body,w,h){
    const {ui,session:s}=this,state=s.state,c=C.refreshCampaign(state),reward=C.dailyReward(state);let y=0;
    C.DAILY_TASKS.forEach(task=>{const p=ui.panel(body,0,y,w,113,{fill:'#decaab',stroke:'#ad8f64',radius:8});ui.label(p,task.name,10,7,w-20,26,{size:14,bold:true,color:P.ink});ui.label(p,c.progress[task.id]+' / '+task.goal,10,36,95,23,{size:12,color:P.muted});rewardRow(ui,p,reward,110,34,w-120,{});ui.button(p,c.claimed.includes(task.id)?'已领取':'领取',10,82,w-20,25,()=>this.act(()=>s.claimDaily(task.id)),{primary:true,disabled:c.claimed.includes(task.id)||c.progress[task.id]<task.goal,name:'daily-'+task.id,size:11});y+=123;});
    ui.button(body,c.chest?'交班礼已领取':'交班礼 · '+c.claimed.length+'/3',0,y,w,37,()=>this.act(()=>s.claimDailyChest()),{primary:true,disabled:c.chest||c.claimed.length<3,name:'daily-chest',size:12});y+=48;
    ui.label(body,'成长之路 · '+c.journey.length+' / 30',0,y,w,28,{size:17,bold:true,color:P.ink});y+=36;
    C.JOURNEY.forEach(j=>{const p=ui.panel(body,0,y,w,97,{fill:'#dacaab',stroke:'#ac9169',radius:7});ui.label(p,j.index+'. '+j.name,9,6,w-18,24,{size:13,bold:true,color:P.ink});ui.label(p,'通关第 '+j.stage+' 关',9,32,w-18,19,{size:11,color:P.muted});ui.button(p,c.journey.includes(j.id)?'已领取':state.highest<j.stage?'进行中':'领取 '+fmt(j.gold)+' 鱼币',9,61,w-18,28,()=>this.act(()=>s.claimJourney(j.id)),{disabled:c.journey.includes(j.id)||state.highest<j.stage,name:'journey-'+j.id,size:11});y+=106;});this.heightOf(body,w,y);
  }
  challenges(body,w,h){
    const {ui,session:s}=this,state=s.state;ui.label(body,'本周挑战 · '+C.weeklyInfo(state,1).name,0,0,w,29,{size:17,bold:true,color:P.ink});let y=38;
    [1,2,3].forEach(tier=>{const q=C.weeklyInfo(state,tier),p=ui.panel(body,0,y,w,103,{fill:'#dacaab',stroke:'#ad9168',radius:7});ui.label(p,['入门','进阶','极限'][tier-1],10,8,w-20,25,{size:15,bold:true,color:P.ink});rewardRow(ui,p,q.reward,8,39,w-95,{});ui.button(p,q.claimed?'再战':'挑战',w-85,43,75,37,()=>{if(!q.open){this.cb.toast('通关第 15 关后解锁');return;}this.close();s.startWeekly(tier);},{name:'weekly-'+tier,primary:true,size:12});y+=113;});
    ui.label(body,'街头擂台',0,y,w,28,{size:18,bold:true,color:P.ink});y+=39;
    for(let tier=1;tier<=G.ARENA_MAX;tier++){const info=G.arenaInfo(tier),open=G.arenaOpen(state,tier),p=ui.button(body,'',0,y,w,80,()=>{if(!open){this.cb.toast(state.highest<G.ARENA_UNLOCK?'通关第 '+G.ARENA_UNLOCK+' 关后解锁':'完成第 '+(tier-1)+' 擂后解锁');return;}this.close();s.startArena(tier);},{fill:'#d8c29c',name:'arena-tier-'+tier});ui.label(p,info.name+' '+tier,10,7,w-20,27,{size:15,bold:true,color:P.ink});line(ui,p,info.rule,10,36,w-20,10,P.muted,37);y+=89;}
    this.heightOf(body,w,y);
  }
  nextGrowth(){
    const s=this.session.state,b=this.session.battle;
    if(b&&!b.result&&b.mode==='activity')return{title:'正在挑战'+b.activity.name,text:'完成当前委托后领取奖励，点击结算中的奖励可以查看详情。',action:'battle',label:'查看战斗'};
    if(s.highest<3)return{title:'先通关第 3 关',text:'主线会自动推进。打不过时，先用鱼币给上阵伙伴升级。',action:'battle',label:'继续主线'};
    if(!s.activities.cleared.salvage)return{title:'去废件仓库拿装备',text:'街区 → 委托板 → 旧街寻宝 → 废件仓库。',action:'salvage',label:'前往废件仓库'};
    if(!s.guidance?.equipmentWorn&&s.inventory.items.some(e=>!E.gearOwner(s,e.id)))return{title:'给伙伴穿上新装备',text:'选中一位伙伴，点背包中的装备，再点“穿戴”。',action:'equipment',label:'前往穿戴'};
    const ready=teamPlan(s).order.filter(id=>s.party.includes(id)).find(id=>{const q=starQuote(s,id);return!q.maxed&&q.have>=q.shards&&s.growth.notes>=q.notes;});
    if(ready)return{title:cat(ready).name+'可以升阶',text:'这次生命和攻击提升 '+starQuote(s,ready).gain+'%，升阶后继续推进主线。',action:'cat-tag',id:ready,label:'前往升阶'};
    if(s.runCleared>=G.MAX_STAGE)return{title:'主线已通关，挑战街区硬仗',text:'继续挑战街区硬仗、街头擂台与每周委托。',action:'hard',label:'前往街区硬仗'};
    return{title:b?.result==='lose'?'积攒材料，给伙伴升阶':'继续推进主线',text:'伙伴信物来自失物追寻，训练笔记来自后巷清扫。',action:b?.result==='lose'?'cat-tag':'battle',id:teamPlan(s).core,label:b?.result==='lose'?'查看升阶':'回到战场'};
  }
  go(action,id?){const s=this.session;if(action==='cat-tag'){this.open('cat-tag',{id:id||s.selected});return;}if(['salvage','recruit','hard'].includes(action)){s.changeTab('map');this.open('street',{group:action==='salvage'?'equipment':action,id:action==='salvage'?'salvage':action==='hard'?'coldstore':'all',detail:true});return;}if(action==='arena'){s.changeTab('map');this.open('challenges');return;}this.close();if(action==='equipment'||action==='train'){s.selectCrew(s.state.party.find(Boolean)||'orange');s.setMode(action==='equipment'?'equipment':'profile');s.changeTab('cats');}else s.changeTab('battle');}
  quests(body,w,h){
    const {ui,session:s}=this,state=s.state,next=this.nextGrowth(),nh=contentHeight(next.text,w-22,12),p=ui.panel(body,0,0,w,115+nh,{fill:'#e4cda7',stroke:'#a58351',radius:8});
    ui.label(p,'当前目标',10,7,w-20,19,{size:10,color:P.muted});ui.label(p,next.title,10,30,w-20,28,{size:17,bold:true,color:P.ink});line(ui,p,next.text,11,66,w-22,12,P.muted,nh);ui.button(p,next.label,10,74+nh,w-20,32,()=>this.go(next.action,next.id),{primary:true,name:'growth-next',size:12});let y=128+nh;
    ui.button(body,'去拿装备',0,y,(w-8)/2,32,()=>this.go('salvage'),{size:11});ui.button(body,'穿戴 / 强化',(w+8)/2,y,(w-8)/2,32,()=>this.go('equipment'),{size:11});y+=45;
    const ready=G.QUESTS.filter(q=>!state.claimed.includes(q.id)&&G.questValue(state,q)>=q.goal);
    ui.label(body,'成长奖励',0,y,w*.45,30,{size:16,bold:true,color:P.ink});ui.button(body,ready.length?'领取 '+fmt(ready.reduce((n,q)=>n+q.reward,0))+' 鱼币':'暂无待领',w*.45,y,w*.55,30,()=>this.act(()=>s.claimQuests()),{disabled:!ready.length,primary:true,name:'claim-quests',size:10});y+=40;
    G.QUESTS.forEach(q=>{const v=Math.min(G.questValue(state,q),q.goal),claimed=state.claimed.includes(q.id),done=v>=q.goal,p=ui.panel(body,0,y,w,115,{fill:'#dfcda9',stroke:'#b0956b',radius:7});ui.label(p,q.name,10,7,w-20,24,{size:14,bold:true,color:P.ink});line(ui,p,q.desc,10,36,w-20,11,P.muted,22);progress(ui,p,10,66,w-110,6,v/q.goal);ui.label(p,v+' / '+q.goal,10,80,88,18,{size:10,color:P.muted});
      ui.label(p,fmt(q.reward)+' 鱼币',w-97,37,87,20,{size:10,color:P.muted,align:'right'});
      ui.button(p,claimed?'已领取':done?'领取':'前往',w-95,70,85,31,()=>{if(done){this.act(()=>s.claimQuests(q.id));return;}this.go(q.key==='upgrades'?'train':q.key==='relicCount'?'salvage':q.key==='cats'?'recruit':q.key==='arenaCleared'?'arena':'battle');},{disabled:claimed,primary:done,name:'growth-quest-'+q.id,size:11});y+=124;});this.heightOf(body,w,y);
  }
  settings(body,w,h){
    const {ui,session:s}=this,state=s.state;
    [['音效',state.sound,()=>s.toggleSound(),'toggle-sound'],['背景音乐',state.music,()=>s.toggleMusic(),'toggle-music']].forEach(([title,on,fn,name],i)=>{ui.label(body,title,4,i*48+7,w-110,26,{size:14,color:P.ink});ui.button(body,on?'已开启':'已关闭',w-101,i*48,97,37,()=>this.act(fn),{name,size:12});});
    ui.label(body,'本机保存',4,106,110,25,{size:12,color:P.muted});ui.label(body,s.saveOK===false?'不可用，请导出':'正常 · 自动保存',120,106,w-124,25,{size:12,color:P.ink,align:'right'});
    ui.label(body,'已通过 / 历史最高',4,141,w-8,24,{size:12,color:P.muted});ui.label(body,state.runCleared+' / '+state.highest,4,168,w-8,24,{size:17,bold:true,color:P.ink});
    [['导出存档','export'],['导入存档','import']].forEach(([title,type],i)=>ui.button(body,title,i*(w+8)/2,211,(w-8)/2,35,()=>this.open(type),{name:'save-'+type,size:12}));
    ui.button(body,'分享游戏',0,257,w,35,()=>this.cb.share?.(),{name:'share-game',size:12});ui.button(body,'从头开始',0,305,w,35,()=>this.open('reset'),{fill:'#d2a398',name:'reset-open',size:12});this.heightOf(body,w,352);
  }
  textInput(body,x,y,w,h,initial,placeholder,callback,readonly=false){
    const {ui}=this,p=ui.panel(body,x,y,w,h,{fill:'#f6ecd5',stroke:'#a89168',radius:6});p.name=readonly?'export-text':'import-text';
    const text=ui.label(p,initial,8,8,w-16,h-16,{size:11,color:P.ink,wrap:true}),hint=ui.label(p,placeholder,8,8,w-16,h-16,{size:12,color:'#a0937a',wrap:true});
    const e=p.addComponent(EditBox);e.textLabel=text;e.placeholderLabel=hint;e.inputMode=EditBox.InputMode.ANY;e.maxLength=100000;e.string=initial;e.returnType=EditBox.KeyboardReturnType.DONE;
    e.node.on('text-changed',edit=>callback(edit.string));if(readonly)e.node.on('editing-did-ended',()=>{e.string=initial;});return e;
  }
  exportSave(body,w,h){
    const {ui,session:s}=this;this.exportText=s.exportSave();line(ui,body,'下载存档文件，或复制完整存档文字。',0,0,w,12,P.muted,37);
    this.textInput(body,0,47,w,Math.max(135,h-155),this.exportText,'',()=>{},true);
    ui.button(body,'复制存档文字',0,h-90,w,34,()=>this.cb.setClipboard?.(this.exportText),{primary:true,name:'copy-save',size:12});ui.button(body,'下载存档文件',0,h-44,w,34,()=>this.cb.exportSave?.(this.exportText),{name:'download-save',size:12});
  }
  importSave(body,w,h){
    const {ui}=this;line(ui,body,'粘贴完整存档文字。校验通过后会先显示进度，确认后才会替换。',0,0,w,12,P.muted,52);
    this.textInput(body,0,60,w,Math.max(140,h-170),this.importText,'把完整存档文字粘贴到这里',value=>this.importText=value);
    ui.button(body,'从剪贴板粘贴',0,h-93,(w-8)/2,33,async()=>{const value=await this.cb.getClipboard?.();if(value){this.importText=value;this.refresh();}},{name:'paste-save',size:11});
    ui.button(body,'选择存档文件',(w+8)/2,h-93,(w-8)/2,33,async()=>{const value=await this.cb.importSave?.();if(value){this.importText=value;this.refresh();}},{name:'select-save',size:11});
    ui.button(body,'检查这份存档',0,h-44,w,35,()=>{try{const incoming=G.decodeSave(this.importText);this.open('confirm-import',{encoded:this.importText,incoming});}catch(e){this.cb.toast(e.message);}},{primary:true,name:'check-import',size:12});
  }
  confirmImport(body,w,h,{encoded,incoming}){
    const {ui}=this;ui.label(body,'历史最高关卡　'+incoming.highest,0,3,w,29,{size:16,bold:true,color:P.ink});ui.label(body,'鱼币　'+fmt(incoming.gold),0,42,w,29,{size:16,bold:true,color:P.ink});
    line(ui,body,'将替换当前进度。需要保留当前存档的话，请先关闭此窗口，再导出备份。',0,89,w,12,P.muted,75);
    ui.button(body,'确认替换当前进度',0,182,w,41,()=>{this.close();this.act(()=>this.session.importSave(encoded));},{primary:true,name:'apply-import',size:12});
  }
  reset(body,w,h){
    const {ui}=this;line(ui,body,'将清空这台设备当前进度，从第 1 关重新体验新手引导。',0,0,w,13,P.ink,58);line(ui,body,'想保留进度，请先导出存档。',0,68,w,12,P.muted,39);
    ui.button(body,'取消',0,130,(w-8)/2,37,()=>this.open('settings'),{name:'cancel-reset'});ui.button(body,'确认，从头开始',(w+8)/2,130,(w-8)/2,37,()=>{this.close();this.session.reset();},{fill:'#d19e8d',name:'confirm-reset',size:12});
  }
  pause(body,w,h){
    const {ui,session:s}=this;ui.button(body,'继续战斗',0,0,w,42,()=>{s.resume?.();this.close();},{primary:true,name:'battle-continue'});
    ui.button(body,'音乐 '+(s.state.music?'开':'关'),0,57,(w-8)/2,37,()=>this.act(()=>s.toggleMusic()),{name:'pause-music',size:12});ui.button(body,'音效 '+(s.state.sound?'开':'关'),(w+8)/2,57,(w-8)/2,37,()=>this.act(()=>s.toggleSound()),{name:'pause-sound',size:12});
    ui.button(body,'返回街区',0,111,w,39,()=>{this.close();s.returnToStreet();},{name:'battle-return',size:12});
  }
  victory(body,w,h){this.ui.button(body,'回到街区',0,15,w,41,()=>{this.session.changeTab('map');this.close();},{primary:true,name:'victory-map'});}
  routes(body,w,h){
    const {ui,session:s}=this,state=s.state;
    ui.button(body,state.runCleared>=G.MAX_STAGE?'街区已开拓':'继续第 '+state.stage+' 关',0,0,w,40,()=>{this.close();s.startBattle();},{primary:true,disabled:state.runCleared>=G.MAX_STAGE,name:'patrol-current'});
    for(let i=0;i<Math.ceil(G.MAX_STAGE/20);i++){const chapter=G.CHAPTERS[i%6],done=Math.min(20,Math.max(0,state.runCleared-i*20)),y=54+i*85,p=ui.panel(body,0,y,w,76,{fill:'#ddc7a4',stroke:'#b29364',radius:7});ui.image(p,'assets/mobile/street-'+(i%6)+'-v02684.webp',0,0,75,76);ui.label(p,chapter.name+' · '+(Math.floor(i/6)+1),87,10,w-97,27,{size:14,bold:true,color:P.ink});ui.label(p,done+'/20'+(done===20?'　✓':''),87,43,w-97,20,{size:11,color:P.muted});}
    this.heightOf(body,w,57+Math.ceil(G.MAX_STAGE/20)*85);
  }
  report(parent){
    const {ui,session:s}=this,r=s.report;if(!r)return;const w=Math.min(this.width-26,366),h=Math.min(this.height-70,r.tokenTicket?650:460),x=(this.width-w)/2,y=(this.height-h)/2;
    const p=ui.panel(parent,x,y,w,h,{fill:r.win?'#e6d1a7':'#ccbfae',stroke:P.rim,radius:13});p.name='result-layer';
    ui.image(p,'assets/ui/battle-results-v02641.webp',3,2,w-6,144,r.win?[0,0,512,512]:[512,0,512,512]);
    ui.label(p,r.win?'拿下了！':'暂时失利',12,146,w-24,36,{size:24,bold:true,color:P.ink,align:'center'});ui.label(p,r.title,12,185,w-24,29,{size:14,color:P.muted,align:'center'});
    let cy=226;if(r.rewardCapped){ui.label(p,'本次为练习',12,214,w-24,21,{size:11,color:P.muted,align:'center'});cy+=24;}cy+=rewardRow(ui,p,r.rewards,20,cy,w-40,{companion:r.companion,onMaterial:(id,companion)=>this.open('material',{id,companion,inspect:true}),onGear:()=>r.gearUid&&this.open('equipment',{uid:r.gearUid,id:s.selected,inspect:true})});
    if(r.gearUid){const e=s.state.inventory.items.find(e=>e.id===r.gearUid);if(e){gearTile(ui,p,e,w/2-26,cy+5,52,n=>this.open('equipment',{uid:e.id,id:s.selected,inspect:true,anchor:this.anchor(n)}),'result-gear');cy+=68;}}
    if(r.tokenTicket){
      if(this.tokenTicket!==r.tokenTicket){this.tokenTicket=r.tokenTicket;this.tokenSelected='';}
      ui.label(p,r.tokenClaimed?'自选信物已领取':'广告奖励 · 额外自选 5 个信物',12,cy+5,w-24,26,{size:14,bold:true,color:P.ink,align:'center'});cy+=40;
      const cw=(w-36)/4;G.CATS.forEach((c,i)=>{const n=ui.button(p,'',18+i%4*cw,cy+Math.floor(i/4)*65,cw-7,59,()=>{this.tokenSelected=c.id;this.refresh();},{primary:this.tokenSelected===c.id,disabled:r.tokenClaimed,name:'token-select-'+c.id,fill:this.tokenSelected===c.id?'#e7c481':'#d9c39d'});keepsakeArt(ui,n,c.id,(cw-7)/2-19,1,38);ui.label(n,c.name,2,39,cw-11,17,{size:10,color:P.ink,align:'center'});});cy+=137;
      ui.button(p,r.tokenClaimed?'已领取':this.busy?'广告准备中…':this.tokenSelected?'看广告 · '+cat(this.tokenSelected).name+'的信物 ×5':'选好伙伴后，看广告领取',16,cy,w-32,39,async()=>{if(this.busy||r.tokenClaimed)return;this.busy=true;this.refresh();try{await s.watchTokenReward(this.tokenSelected);}finally{this.busy=false;this.refresh();}},{primary:true,disabled:r.tokenClaimed||this.busy||!this.tokenSelected||!tokenRewardReady(s.state,r.tokenTicket),name:'token-ad-claim',size:12});cy+=48;
    }
    if(!r.win){ui.button(p,'再次挑战',16,h-62,(w-40)/2,38,()=>this.dismissReport('retry'),{primary:true,name:'result-retry',size:12});ui.button(p,'调整伙伴',24+(w-40)/2,h-62,(w-40)/2,38,()=>this.dismissReport('crew'),{name:'result-crew',size:12});}
    else ui.button(p,'收下奖励',16,Math.min(h-57,cy+9),w-32,37,()=>this.dismissReport(),{primary:true,name:'result-close',size:12});
  }
  dismissReport(action=''){
    // The host clears only its modal stack before closeReport emits guide/navigation.
    // An in-flight rewarded ad owns the report and must not be dismissed.
    if(!this.session.report||this.session.rewardPending)return false;
    if(this.cb.closeReport)return this.cb.closeReport(action);
    this.close();return this.session.closeReport(action);
  }
}
