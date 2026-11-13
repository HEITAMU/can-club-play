// Technical packing of the supplied painted sheets. No art is redrawn here.
const fs=require('node:fs'),path=require('node:path'),sharp=require('sharp');
const root=__dirname;
const ids=['orange','ink','milk','spark','mint','bolt','pudding','star','night','inkstone'];
async function sheet(name,columns,rows){
 const file=path.join(root,'source',name),{data,info}=await sharp(file).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 const boxes=[];
 for(let i=0;i<columns*rows;i++){
  const x0=Math.round(i%columns*info.width/columns),x1=Math.round((i%columns+1)*info.width/columns);
  const y0=Math.round(Math.floor(i/columns)*info.height/rows),y1=Math.round((Math.floor(i/columns)+1)*info.height/rows);
  let l=x1,t=y1,r=-1,b=-1;
  for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++)if(data[(y*info.width+x)*4+3]>32){l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y);}
  if(r<0)throw Error('Empty painted cell '+name+':'+i);
  l=Math.max(x0,l-2);t=Math.max(y0,t-2);r=Math.min(x1-1,r+2);b=Math.min(y1-1,b+2);
  boxes.push([l,t,r-l+1,b-t+1]);
 }
 const atlas='assets/'+name;await sharp(file).webp({quality:98,alphaQuality:100,effort:4}).toFile(path.join(root,atlas));
 return {atlas,boxes,width:info.width,height:info.height};
}
async function upgrade(meta){
 const bodies=await sheet('neck-bodies-v2.webp',5,2);
 for(const [i,id]of ids.entries()){
  const art=meta.characters[id];art.parts.body=bodies.boxes[i];
  art.partAtlases={...art.partAtlases,body:bodies.atlas};
  // Shoulder pivots lie inside the painted upper-arm sockets, below the neck.
  art.bodyRig={near:[.21,.28],far:[.82,.28],neck:[.54,.065]};
 }
 const poses=await sheet('xuanyue-poses-v2.webp',4,3);
 // Foot pivots are in sheet coordinates, independent of tails and extended fists.
 // A common scale preserves the crouch instead of enlarging each shorter frame.
 const pivots=[[205,339],[565,339],[941,339],[1295,339],
  [205,701],[565,701],[920,701],[1282,701],
  [205,1067],[562,1067],[922,1067],[1287,1067]];
 const fists=[[158,229],[518,235],[875,188],[1250,163],
  [159,545],[690,496],[838,569],[1182,569],
  [257,889],[692,879],[1048,912],[1206,993]];
 const names=['idle','breathe','runA','runB','ready','jab','guard','sink','coil','drive','impact','controlled'];
 meta.characters.pudding.fullBody={atlas:poses.atlas,width:poses.width,height:poses.height,
  source:'xuanyue-poses-v2.webp',height:330,
  frames:poses.boxes.map((rect,i)=>({name:names[i],rect,pivot:[pivots[i][0]-rect[0],pivots[i][1]-rect[1]],fist:[fists[i][0]-pivots[i][0],fists[i][1]-pivots[i][1]]}))};
 meta.version='0.2.0-review';
 meta.bodyUpgrade={source:'neck-bodies-v2.webp',provenance:'source/upgrade-provenance.json'};
 return meta;
}
module.exports={upgrade};
if(require.main===module)upgrade(JSON.parse(fs.readFileSync(path.join(root,'assets/atlas.json')))).then(meta=>{
 fs.writeFileSync(path.join(root,'assets/atlas.json'),JSON.stringify(meta,null,2)+'\n');
 console.log('Packed 10 necked bodies and 12 full-body Xuanyue poses.');
}).catch(error=>{console.error(error);process.exitCode=1;});
