// Experimental WebGL1 painted mesh. No DOM dependency: accepts a wx canvas/context.
import {rosterCel,rosterVertex} from './finished-roster-renderer.mjs';
import {sparkCel,sparkVertex} from './finished-spark-renderer.mjs';
const clamp=x=>Math.max(0,Math.min(1,x));
export function prototypeLayers(id,pose){
 const value=Math.max(0,Math.min(id==='spark'?5:4,pose[id==='spark'?'sparkCel':'rosterCel']||0));
 const a=Math.floor(value),b=Math.ceil(value),key=id==='spark'?'sparkCel':'rosterCel',cel=id==='spark'?sparkCel:rosterCel;
 // Hold the authored silhouette; limit double-image transitions to the middle
 // 18% of each pose interval, instead of dissolving throughout the whole action.
 const f=clamp((value-a-.41)/.18),mix=f*f*(3-2*f);
 const first=cel({...pose,[key]:a}),second=cel({...pose,[key]:b});
 return first===second?[[first,1]]:[[first,1-mix],[second,mix]].filter(x=>x[1]>0);
}
export function createPaintedGPU(canvas,images){
 const gl=canvas.getContext('webgl',{alpha:true,premultipliedAlpha:true,antialias:false,preserveDrawingBuffer:false});
 if(!gl)throw new Error('WebGL unavailable');
 const shader=(type,source)=>{const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s));return s;};
 const program=gl.createProgram();const shaders=[shader(gl.VERTEX_SHADER,'attribute vec2 p;attribute vec2 uv;varying vec2 v;void main(){v=uv;gl_Position=vec4(p,0.,1.);}'),shader(gl.FRAGMENT_SHADER,'precision mediump float;uniform sampler2D art;uniform float opacity;varying vec2 v;void main(){vec4 c=texture2D(art,v);gl_FragColor=vec4(c.rgb*c.a,c.a)*opacity;}')];
 for(const s of shaders)gl.attachShader(program,s);gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program));gl.useProgram(program);
 const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);const p=gl.getAttribLocation(program,'p'),uv=gl.getAttribLocation(program,'uv');gl.enableVertexAttribArray(p);gl.enableVertexAttribArray(uv);gl.vertexAttribPointer(p,2,gl.FLOAT,false,16,0);gl.vertexAttribPointer(uv,2,gl.FLOAT,false,16,8);
 const opacity=gl.getUniformLocation(program,'opacity');gl.uniform1i(gl.getUniformLocation(program,'art'),0);
 const textures={};for(const [id,img] of Object.entries(images)){const tex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tex);gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,false);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,img);textures[id]=tex;}
 const xs=[0,110,256,512],ys=[0,258,335,420,470,518,544],vertices=new Float32Array(36*3*4);gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE);
 return {draw(id,pose){gl.viewport(0,0,canvas.width,canvas.height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.bindTexture(gl.TEXTURE_2D,textures[id]);let draws=0;
 for(const [cel,alpha] of prototypeLayers(id,pose)){let n=0;const points=[];const angle=Math.max(-.10,Math.min(.32,(pose.lean||0)*.22)),co=Math.cos(angle),si=Math.sin(angle);
 for(const y of ys)for(const x of xs){const [dx,dy]=id==='spark'?sparkVertex(x,y,pose):rosterVertex(id,x,y,pose);const xx=(dx-256)*.91/480,yy=(dy-518)*.91/480;const X=.5+xx*co-yy*si,Y=.92+(pose.sink||0)+xx*si+yy*co;points.push([(X+.22)/1.44*2-1,1-(Y+.20)/1.38*2,((cel%4)*512+x)/2048,(Math.floor(cel/4)*544+y)/(id==='spark'?1900:1632)]);}
 for(let y=0;y<6;y++)for(let x=0;x<3;x++){const a=y*4+x;for(const i of [a,a+1,a+5,a,a+5,a+4])for(const v of points[i])vertices[n++]=v;}
 gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.DYNAMIC_DRAW);gl.uniform1f(opacity,alpha*(pose.alpha??1));gl.drawArrays(gl.TRIANGLES,0,108);draws++;}return draws;},dispose(){Object.values(textures).forEach(t=>gl.deleteTexture(t));gl.deleteBuffer(buffer);gl.deleteProgram(program);shaders.forEach(s=>gl.deleteShader(s));}};
}
