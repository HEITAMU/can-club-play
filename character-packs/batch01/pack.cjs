// Technical alpha-bound atlas packing only; never redraw or recolor generated art.
const fs=require('node:fs'),path=require('node:path'),sharp=require('sharp');
const {createCanvas,loadImage}=require('@napi-rs/canvas');
const root=__dirname,selected=require('./selected-sources.json');
const ids=['orange','ink','milk','spark','mint','bolt','pudding','star','night','inkstone'];
const parts=['body','nearRightArm','farLeftArm','tail'];
const faces=['neutral','blink','skill','victory'];
const fx=['seed','release','impact','state'];
function components(data,w,h){
 const seen=new Uint8Array(w*h),queue=new Int32Array(w*h),out=[];
 for(let at=0;at<w*h;at++)if(!seen[at]&&data[at*4+3]>32){
  let q=0,e=1,l=w,t=h,r=0,b=0;seen[at]=1;queue[0]=at;
  while(q<e){const z=queue[q++],x=z%w,y=Math.floor(z/w);l=Math.min(l,x);t=Math.min(t,y);r=Math.max(r,x);b=Math.max(b,y);
   for(const n of [x>0?z-1:-1,x<w-1?z+1:-1,y>0?z-w:-1,y<h-1?z+w:-1])if(n>=0&&!seen[n]&&data[n*4+3]>32){seen[n]=1;queue[e++]=n;}
  }
  if(e>=8)out.push({l,t,r,b,n:e,cx:(l+r)/2,cy:(t+b)/2});
 }
 return out;
}
function bound(cs,w,h){if(!cs.length)throw Error('Missing painted component');const l=Math.max(0,Math.min(...cs.map(c=>c.l))-3),t=Math.max(0,Math.min(...cs.map(c=>c.t))-3),r=Math.min(w-1,Math.max(...cs.map(c=>c.r))+3),b=Math.min(h-1,Math.max(...cs.map(c=>c.b))+3);return[l,t,r-l+1,b-t+1];}
(async()=>{
 fs.mkdirSync(path.join(root,'assets'),{recursive:true});
 const meta={version:'0.1.0-review',coordinateSystem:'anatomical-right-is-near-camera; facing screen right',characters:{}};
 const headSheet=createCanvas(1280,640),hc=headSheet.getContext('2d');
 for(const id of ids){
  const p=path.join(root,'source',selected[id]);const im=await loadImage(p),w=im.width,h=im.height,cw=w/4,rh=h/5;
  const src=createCanvas(w,h),ctx=src.getContext('2d');ctx.drawImage(im,0,0);const raw=ctx.getImageData(0,0,w,h).data,cs=components(raw,w,h);
  const rowStart=id==='pudding'?[0,400,790,1060,1300,h]:[0,rh,rh*2,rh*3,rh*4,h];
  const cell=(row,col)=>{if(row===4){let l=w,t=h,r=-1,b=-1;for(let y=Math.ceil(rowStart[row]);y<h;y++)for(let x=Math.ceil(col*cw);x<Math.floor((col+1)*cw);x++)if(raw[(y*w+x)*4+3]>32){l=Math.min(l,x);t=Math.min(t,y);r=Math.max(r,x);b=Math.max(b,y);}if(r<0)throw Error(id+' empty FX '+col);return[l,t,r-l+1,b-t+1];}const group=cs.filter(c=>Math.floor(c.cx/cw)===col&&c.cy>=rowStart[row]&&c.cy<rowStart[row+1]);if(!group.length)throw Error(id+' missing cell '+row+','+col);return bound(group,w,h);};
  const item={atlas:`assets/${id}.webp`,width:w,height:h,source:selected[id],parts:{},faces:{},fx:{},reference:{}};
  parts.forEach((key,i)=>item.parts[key]=cell(2,i));faces.forEach((key,i)=>item.faces[key]=cell(3,i));fx.forEach((key,i)=>item.fx[key]=cell(4,i));
  for(let i=0;i<2;i++)item.reference[i?'action':'idle']=bound(cs.filter(c=>c.cy<(id==='pudding'?400:rh*2)&&Math.floor(c.cx/(cw*2))===i),w,h);
  const box=item.faces.neutral,idx=ids.indexOf(id),s=Math.min(236/box[2],288/box[3]);hc.drawImage(im,...box,idx%5*256+(256-box[2]*s)/2,Math.floor(idx/5)*320+304-box[3]*s,box[2]*s,box[3]*s);
  const dest=path.join(root,item.atlas);if(!fs.existsSync(dest)||fs.statSync(dest).mtimeMs<fs.statSync(p).mtimeMs||id==='mint')await sharp(p).webp({quality:96,alphaQuality:100,effort:4}).toFile(dest);
  meta.characters[id]=item;
 }
 // New attack heads and high-resolution corrected Mint arms are separate assets;
 // the rest of Mint's original crisp sheet is preserved without regeneration.
 async function extra(file,columns,rows){const p=path.join(root,'source',file),im=await loadImage(p),cv=createCanvas(im.width,im.height),ct=cv.getContext('2d');ct.drawImage(im,0,0);const cs=components(ct.getImageData(0,0,im.width,im.height).data,im.width,im.height);const boxes=[];for(let i=0;i<columns*rows;i++)boxes.push(bound(cs.filter(c=>Math.floor(c.cx/(im.width/columns))===i%columns&&Math.floor(c.cy/(im.height/rows))===Math.floor(i/columns)),im.width,im.height));const atlas='assets/'+file.replace(/\.(png|webp)$/,'.webp');await sharp(p).webp({quality:98,alphaQuality:100,effort:4}).toFile(path.join(root,atlas));return{atlas,boxes};}
 const attacks=await extra('attack-heads-v1.webp',5,2);
 ids.forEach((id,i)=>{meta.characters[id].faces.attack=attacks.boxes[i];meta.characters[id].faceAtlases={attack:attacks.atlas};});
 meta.characters.pudding.faces.attack=meta.characters.pudding.faces.victory;
 meta.characters.pudding.faceAtlases={};
 const hands=await extra('mint-arms-hires-v1.webp',2,1);
 for(let i=0;i<2;i++){const key=parts[i+1];meta.characters.mint.parts[key]=hands.boxes[i];}meta.characters.mint.partAtlases={nearRightArm:hands.atlas,farLeftArm:hands.atlas};
 const mintAction=await extra('mint-action-hires-v1.webp',1,1);meta.characters.mint.reference.action=mintAction.boxes[0];meta.characters.mint.referenceAtlases={action:mintAction.atlas};
 fs.writeFileSync(path.join(root,'assets/atlas.json'),JSON.stringify(meta,null,2)+'\n');
 fs.mkdirSync(path.join(root,'../../qa/batch01'),{recursive:true});
 fs.writeFileSync(path.join(root,'../../qa/batch01/neutral-heads-reference.png'),headSheet.toBuffer('image/png'));
 console.log(JSON.stringify({count:ids.length,rects:Object.fromEntries(ids.map(id=>[id,meta.characters[id].parts])),attackReference:'qa/batch01/neutral-heads-reference.png'},null,2));
})().catch(e=>{console.error(e);process.exitCode=1;});
