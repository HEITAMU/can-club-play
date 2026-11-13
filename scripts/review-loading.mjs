import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
const require=createRequire(new URL('../wechat/package.json',import.meta.url));
const {createCanvas,loadImage,Image,GlobalFonts}=require('@napi-rs/canvas'),sharp=require('sharp');
import {FINISHED_ROSTER} from '../finished-roster-data.mjs';
import {FINISHED_SPARK} from '../finished-spark-data.mjs';
import {prepareRosterFrames,setRosterCanvasFactory} from '../finished-roster-renderer.mjs';
import {setFinishedCanvasFactory} from '../finished-spark-renderer.mjs';
import {renderPuppetFrame} from '../rig-renderer.mjs';
import {rigPose} from '../rig-motion.mjs';
import {webAsset} from '../web-assets.mjs';
const out='docs/review/loading-v0251';await fs.mkdir(out,{recursive:true});
GlobalFonts.registerFromPath('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc','Review CJK');
const pending=[];setRosterCanvasFactory(createCanvas,c=>{const img=new Image();pending.push(new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=reject;img.src=c.toBuffer('image/png');}));return img;});setFinishedCanvasFactory(createCanvas);
const ids=['orange','ink','milk','spark','mint','bolt','pudding','star'],atlases=[];
for(const id of ids){const src=id==='spark'?FINISHED_SPARK.atlas:FINISHED_ROSTER[id].atlas;const pair=await Promise.all([loadImage(src),loadImage(webAsset(src))]);atlases.push(pair);if(id!=='spark')for(const a of pair)prepareRosterFrames(id,a);}
await Promise.all(pending);
const sheet=createCanvas(1280,520),ctx=sheet.getContext('2d');ctx.fillStyle='#304a50';ctx.fillRect(0,0,1280,520);ctx.font='17px Review CJK';ctx.fillStyle='#f1dfb5';ctx.fillText('原图 / Original',15,28);ctx.fillText('移动资源 / Mobile',15,280);
for(const [i,id]of ids.entries()){for(let r=0;r<2;r++){const cel=createCanvas(200,200);renderPuppetFrame(cel.getContext('2d'),id,rigPose(id,{hp:100},1),atlases[i][r],200,200,null,{to:'neutral',from:'neutral',mix:1});ctx.drawImage(cel,i*160-20,44+r*250,200,200);}ctx.fillStyle='#f1dfb5';ctx.font='13px Review CJK';ctx.fillText(id,i*160+45,248);}
await sharp(sheet.toBuffer('image/png')).jpeg({quality:90}).toFile(out+'/art-comparison.jpg');
const {harness}=await import('../wechat/tests/harness.mjs');const G=await import('../core.mjs');const E=await import('../equipment.mjs');const state=G.initialState();state.onboarded=true;state.highest=600;state.runCleared=60;state.stage=61;state.roster.owned=G.CATS.map(x=>x.id);state.gold=100000;
for(const c of G.CATS)state.levels[c.id]=40;
for(const slot of E.GEAR_SLOTS)for(const set of ['guard','spring'])E.addGear(state,120,{slot:slot.id,set,quality:2});
const h=await harness({state}),app=h.app;app.change('cats');app.mode='equipment';app.render();await sharp(app.canvas.toBuffer('image/png')).jpeg({quality:88}).toFile(out+'/native-equipment.jpg');app.change('relics');app.render();await sharp(app.canvas.toBuffer('image/png')).jpeg({quality:88}).toFile(out+'/native-bag.jpg');app.openStreet('materials','escort');app.render();await sharp(app.canvas.toBuffer('image/png')).jpeg({quality:88}).toFile(out+'/native-street.jpg');h.stop();console.log('Wrote artwork comparison and native render review (not browser screenshots).');
