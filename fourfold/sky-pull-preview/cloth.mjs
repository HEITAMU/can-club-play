// A real deforming textured mesh; no readback or per-frame image uploads.
export function makeCloth(canvas,imageURL){
 const gl=canvas.getContext('webgl',{alpha:false,antialias:false,powerPreference:'low-power'});if(!gl)return makeCanvasCloth(canvas,imageURL);
 function shader(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s));return s;}
 const vertex=shader(gl.VERTEX_SHADER,`attribute vec2 aPos;uniform vec2 uAnchor;uniform vec2 uPull;varying vec2 vUV;varying float vFold;void main(){vec2 diff=aPos-uAnchor;float d=length(diff);float w=exp(-dot(diff,diff)/0.0961);float edge=smoothstep(0.0,0.07,min(min(aPos.x,1.0-aPos.x),min(aPos.y,1.0-aPos.y)));vec2 point=aPos+uPull*w*edge;vUV=aPos*0.68+0.16;vFold=length(uPull)*w*sin(d*43.0)*edge;gl_Position=vec4(point.x*2.0-1.0,1.0-point.y*2.0,0.0,1.0);}`);
 const fragment=shader(gl.FRAGMENT_SHADER,`precision mediump float;uniform sampler2D uTex;varying vec2 vUV;varying float vFold;void main(){vec3 color=texture2D(uTex,vUV).rgb;color*=0.65+vFold*1.2;gl_FragColor=vec4(color,1.0);}`);
 const program=gl.createProgram();gl.attachShader(program,vertex);gl.attachShader(program,fragment);gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program));gl.useProgram(program);
 const vertices=[],steps=36;for(let y=0;y<steps;y++)for(let x=0;x<steps;x++){const a=x/steps,b=y/steps,c=(x+1)/steps,d=(y+1)/steps;vertices.push(a,b,c,b,a,d,c,b,c,d,a,d);}
 const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices),gl.STATIC_DRAW);const position=gl.getAttribLocation(program,'aPos');gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
 const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([35,26,65,255]));
 const img=new Image();img.onload=()=>{gl.bindTexture(gl.TEXTURE_2D,texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,img);};img.src=imageURL;
 const anchor=gl.getUniformLocation(program,'uAnchor'),pull=gl.getUniformLocation(program,'uPull');
 return {kind:'webgl',resize(w,h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h);},draw(a,p){if(gl.isContextLost())return;gl.clearColor(.08,.06,.16,1);gl.clear(gl.COLOR_BUFFER_BIT);gl.uniform2f(anchor,a.x/1000,a.y/1000);gl.uniform2f(pull,p.x/1000,p.y/1000);gl.drawArrays(gl.TRIANGLES,0,vertices.length/2);}};
}

// CPU mesh fallback keeps the same deformation where WebGL is unavailable.
function makeCanvasCloth(canvas,imageURL){
 const ctx=canvas.getContext('2d'),image=new Image(),texture=document.createElement('canvas');texture.width=texture.height=256;const tc=texture.getContext('2d');let ready=false,lastKey='';
 image.onload=()=>{const inset=image.width*.16,side=image.width*.68;tc.drawImage(image,inset,inset,side,side,0,0,256,256);ready=true;lastKey='';};image.src=imageURL;
 const steps=12,coords=[];for(let y=0;y<=steps;y++)for(let x=0;x<=steps;x++)coords.push({x:x/steps,y:y/steps});
 function triangle(source,dest){
  const [s0,s1,s2]=source,[p0,p1,p2]=dest,ax=s1.x-s0.x,ay=s1.y-s0.y,bx=s2.x-s0.x,by=s2.y-s0.y,det=ax*by-ay*bx;
  const a=((p1.x-p0.x)*by-(p2.x-p0.x)*ay)/det,b=((p1.y-p0.y)*by-(p2.y-p0.y)*ay)/det,c=((p2.x-p0.x)*ax-(p1.x-p0.x)*bx)/det,d=((p2.y-p0.y)*ax-(p1.y-p0.y)*bx)/det;
  ctx.save();ctx.beginPath();ctx.moveTo(p0.x,p0.y);ctx.lineTo(p1.x,p1.y);ctx.lineTo(p2.x,p2.y);ctx.closePath();ctx.clip();ctx.transform(a,b,c,d,p0.x-a*s0.x-c*s0.y,p0.y-b*s0.x-d*s0.y);ctx.drawImage(texture,0,0);ctx.restore();
 }
 return {kind:'canvas-mesh',resize(w,h){canvas.width=w;canvas.height=h;lastKey='';},draw(anchor,pull){
  const key=[Math.round(anchor.x),Math.round(anchor.y),Math.round(pull.x*2),Math.round(pull.y*2),ready,canvas.width].join(',');if(key===lastKey)return;lastKey=key;ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='#1d1739';ctx.fillRect(0,0,canvas.width,canvas.height);if(!ready)return;
  const w=canvas.width,h=canvas.height;if(Math.hypot(pull.x,pull.y)<.5){ctx.drawImage(texture,0,0,w,h);}else{
   const vertices=coords.map(p=>{const dx=p.x-anchor.x/1000,dy=p.y-anchor.y/1000,e=Math.min(p.x,1-p.x,p.y,1-p.y),t=Math.max(0,Math.min(1,e/.07)),edge=t*t*(3-2*t),weight=Math.exp(-(dx*dx+dy*dy)/.0961)*edge;return {x:(p.x+pull.x/1000*weight)*w,y:(p.y+pull.y/1000*weight)*h};});
   for(let y=0;y<steps;y++)for(let x=0;x<steps;x++){const i=y*(steps+1)+x;for(const ids of [[i,i+1,i+steps+1],[i+1,i+steps+2,i+steps+1]])triangle(ids.map(n=>({x:coords[n].x*256,y:coords[n].y*256})),ids.map(n=>vertices[n]));}
  }
  ctx.fillStyle='#09091d50';ctx.fillRect(0,0,w,h);
 }};
}
