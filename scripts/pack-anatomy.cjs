// Technical atlas packing only: preserve generated pixels and alpha; omit rejected cells.
const fs=require('node:fs'),path=require('node:path');
const {createCanvas,loadImage}=require('@napi-rs/canvas');
const sharp=require('sharp');
const root=path.resolve(__dirname,'..'),out=path.join(root,'assets/anatomy');
const ids=[['orange','ink'],['milk','spark'],['mint','bolt'],['pudding','star']];
const faceCells={neutral:[1,0],blink:[1,1],attack:[1,2],skill:[1,3],hurt:[2,0],victory:[2,2],down:[2,3]};
(async()=>{
 fs.mkdirSync(out,{recursive:true});const data={};
 const attackImage=process.argv[6]?await loadImage(process.argv[6]):null;
 let attackPixels;
 if(attackImage){const c=createCanvas(attackImage.width,attackImage.height),ctx=c.getContext('2d');ctx.drawImage(attackImage,0,0);attackPixels=ctx.getImageData(0,0,c.width,c.height).data;}
 function attackBox(index){
  const cw=attackImage.width/4,ch=attackImage.height/2,x0=Math.floor(index%4*cw),y0=Math.floor(index/4)*ch;
  let l=attackImage.width,t=attackImage.height,r=-1,b=-1;
  for(let y=Math.floor(y0);y<Math.floor(y0+ch);y++)for(let x=x0;x<Math.floor(x0+cw);x++)if(attackPixels[(y*attackImage.width+x)*4+3]>24){l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y);}
  return [l,t,r-l+1,b-t+1];
 }
 for(let i=0;i<4;i++){
  const image=await loadImage(process.argv[i+2]);
  const source=createCanvas(image.width,image.height),s=source.getContext('2d');s.drawImage(image,0,0);
  const packed=createCanvas(image.width,image.height),p=packed.getContext('2d'),cw=image.width/4,ch=image.height/6;
  // Generated grids can drift by a few pixels. Follow connected painted shapes rather than cutting limbs at grid lines.
  const raw=s.getImageData(0,0,image.width,image.height).data,seen=new Uint8Array(image.width*image.height),queue=new Int32Array(seen.length),components=[];
  for(let at=0;at<seen.length;at++)if(!seen[at]&&raw[at*4+3]>24){
   let q=0,end=1,l=image.width,t=image.height,r=-1,b=-1,count=0;queue[0]=at;seen[at]=1;
   while(q<end){const z=queue[q++],xx=z%image.width,yy=Math.floor(z/image.width);l=Math.min(l,xx);r=Math.max(r,xx);t=Math.min(t,yy);b=Math.max(b,yy);count++;
    for(const n of [xx>0?z-1:-1,xx+1<image.width?z+1:-1,yy>0?z-image.width:-1,yy+1<image.height?z+image.width:-1])if(n>=0&&!seen[n]&&raw[n*4+3]>24){seen[n]=1;queue[end++]=n;}
   }
   if(count>=32)components.push({l,t,r,b,count,col:Math.min(3,Math.floor((l+r)/2/cw)),row:Math.min(5,Math.floor((t+b)/2/ch))});
  }
  function cell(row,col){
   let l=image.width,t=image.height,r=-1,b=-1;
   for(const c of components.filter(c=>c.row===row&&c.col===col)){l=Math.min(l,c.l);t=Math.min(t,c.t);r=Math.max(r,c.r);b=Math.max(b,c.b);}
   if(r<0)throw Error('Empty sprite cell '+[i,row,col]);
   l=Math.max(0,l-2);t=Math.max(0,t-2);r=Math.min(image.width-1,r+2);b=Math.min(image.height-1,b+2);
   const box=[l,t,r-l+1,b-t+1];p.drawImage(image,...box,...box);return box;
  }
  for(let k=0;k<2;k++){
   const id=ids[i][k],row=k*3;
   data[id]={atlas:'./assets/anatomy/cats-'+String.fromCharCode(97+i)+'.webp',width:image.width,height:image.height,parts:{},faces:{}};
   ['body','leftArm','rightArm','tail'].forEach((name,col)=>data[id].parts[name]=cell(row,col));
   for(const [name,[r,c]] of Object.entries(faceCells))data[id].faces[name]=cell(row+r,c);
   if(attackImage){
    const box=data[id].faces.attack,src=attackBox(i*2+k),scale=Math.min(box[2]/src[2],box[3]/src[3]),w=Math.round(src[2]*scale),h=Math.round(src[3]*scale);
    const target=[Math.round(box[0]+(box[2]-w)/2),box[1]+box[3]-h,w,h];
    p.clearRect(...box);p.drawImage(attackImage,...src,...target);data[id].faces.attack=target;
   }
  }
  await sharp(packed.toBuffer('image/png')).webp({quality:94,alphaQuality:100,effort:6}).toFile(path.join(out,'cats-'+String.fromCharCode(97+i)+'.webp'));
 }
 fs.writeFileSync(path.join(root,'anatomy-data.mjs'),'// Explicit left/right limbs; seven expressions. Rejected tear faces are excluded.\nexport const ANATOMY='+JSON.stringify(data)+';\n');
 console.log(JSON.stringify({characters:Object.keys(data),expressions:Object.keys(faceCells),files:fs.readdirSync(out).filter(x=>x.endsWith('.webp')).map(name=>({name,bytes:fs.statSync(path.join(out,name)).size}))}));
})().catch(e=>{console.error(e);process.exitCode=1;});
