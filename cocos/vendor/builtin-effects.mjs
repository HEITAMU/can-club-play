// Real Cocos 3.8.8 EffectAsset instances for the source-runtime smoke harness.
// Shader math and blend modes follow official builtin-sprite/builtin-graphics effects.
// Creator normally generates these descriptors through its effect importer.
import {registerPaintedBlend} from './painted-blend-shader.mjs';
export async function registerBuiltinEffects(cc, chunks) {
  const { gfx, EffectAsset, Material, builtinResMgr } = cc;
  const clean = (s) => s.replace(/\/\/[^\n]*/g, '').replace(/#pragma[^\n]*/g, '').replace(/layout\([^)]*\)\s*/g, '');
  const globalBlock = clean(chunks['cc-global']);
  const localBlock = clean(chunks['cc-local']);
  const uniforms = (block, gl3) => gl3 ? block.replace(/uniform\s+(\w+)\s*\{/g, 'layout(std140) uniform $1 {') : block.replace(/uniform\s+\w+\s*\{([\s\S]*?)\};/g, (_, body) => body.split(';').map(x => x.trim()).filter(Boolean).map(x => `uniform ${x};`).join('\n'));
  const builtin = (blocks = [], textures = []) => ({ buffers: [], blocks: blocks.map(name => ({name, defines:[]})), samplerTextures: textures.map(name => ({name, defines:[]})), images: [] });
  const attr = (name, format, location) => ({ name, format, location, isNormalized: false, stream: 0, isInstanced: false, defines: [] });
  let serial = 54001;
  function shader(name, kind) {
    const graphics = kind === 'graphics';
    const clear = kind === 'clear';
    const build = gl3 => {
      const ai = gl3 ? 'in' : 'attribute';
      const vo = gl3 ? 'out' : 'varying';
      const fi = gl3 ? 'in' : 'varying';
      const tex = gl3 ? 'texture' : 'texture2D';
      const vertex = clear
        ? `precision highp float; ${ai} vec3 a_position; void main(){gl_Position=vec4(a_position,1.0);}`
        : `precision highp float;\n${uniforms(globalBlock, gl3)}\n#if USE_LOCAL\n${uniforms(localBlock, gl3)}\n#endif\n${ai} vec3 a_position;\n${ai} vec4 a_color;\n${vo} vec4 v_color;\n${graphics ? `${ai} float a_dist;\n${vo} float v_dist;` : `${ai} vec2 a_texCoord;\n${vo} vec2 v_uv;`}\nvoid main(){vec4 p=vec4(a_position,1.0);\n#if USE_LOCAL\np=cc_matWorld*p;\n#endif\ngl_Position=cc_matViewProj*p;v_color=a_color;${graphics ? 'v_dist=a_dist;' : 'v_uv=a_texCoord;'}}`;
      const outDecl = gl3 ? 'out vec4 fragColor;' : '';
      const out = gl3 ? 'fragColor' : 'gl_FragColor';
      let fragment = clear
        ? `precision highp float;${outDecl} void main(){${out}=vec4(1.0);}`
        : graphics
          ? `${gl3 ? '' : '#extension GL_OES_standard_derivatives : enable\n'}precision highp float;${fi} vec4 v_color;${fi} float v_dist;${outDecl}\nvoid main(){\n${gl3 ? 'float aa=fwidth(v_dist);' : '#ifdef GL_OES_standard_derivatives\nfloat aa=fwidth(v_dist);\n#else\nfloat aa=0.05;\n#endif'}\nfloat a=1.0-smoothstep(-aa,0.0,abs(v_dist)-1.0);vec4 c=v_color;c.rgb*=c.a;${out}=c*a;}`
          : `precision highp float;${fi} vec4 v_color;${fi} vec2 v_uv;${outDecl}\n#if USE_TEXTURE\nuniform sampler2D cc_spriteTexture;\n#endif\nvoid main(){vec4 c=v_color;\n#if USE_TEXTURE\nc*=${tex}(cc_spriteTexture,v_uv);\n#endif\n#if USE_GRAY\nc.rgb=vec3(dot(c.rgb,vec3(0.2126,0.7152,0.0722)));\n#endif\n${out}=c;}`;
      return { vert: vertex, frag: fragment };
    };
    const attributes = clear ? [attr('a_position',gfx.Format.RGB32F,0)] : graphics
      ? [attr('a_position',gfx.Format.RGB32F,0),attr('a_color',gfx.Format.RGBA32F,1),attr('a_dist',gfx.Format.R32F,2)]
      : [attr('a_position',gfx.Format.RGB32F,0),attr('a_texCoord',gfx.Format.RG32F,1),attr('a_color',gfx.Format.RGBA32F,2)];
    return { name, hash: serial++, glsl1: build(false), glsl3: build(true), glsl4: build(true),
      builtins: { globals:builtin(clear?[]:['CCGlobal','CCCamera']), locals:builtin(clear?[]:['CCLocal'],graphics||clear?[]:['cc_spriteTexture']), statistics:{} },
      defines:[{name:'USE_TEXTURE',type:'boolean'},{name:'USE_LOCAL',type:'boolean'},{name:'USE_GRAY',type:'boolean'}],
      attributes, blocks:[],samplerTextures:[],samplers:[],textures:[],buffers:[],images:[],subpassInputs:[],descriptors:[] };
  }
  function effect(name, kind, techniques=1) {
    const s=shader(`smoke/${name}`,kind);
    const e=new EffectAsset();e.name=name;e.shaders=[s];
    const pass={program:s.name,properties:{},rasterizerState:{cullMode:gfx.CullMode.NONE},depthStencilState:{depthTest:false,depthWrite:false},blendState:{targets:[{blend:true,blendSrc:kind==='graphics'?gfx.BlendFactor.ONE:gfx.BlendFactor.SRC_ALPHA,blendDst:gfx.BlendFactor.ONE_MINUS_SRC_ALPHA,blendSrcAlpha:gfx.BlendFactor.ONE,blendDstAlpha:gfx.BlendFactor.ONE_MINUS_SRC_ALPHA}]}};
    e.techniques=Array.from({length:techniques},()=>({passes:[JSON.parse(JSON.stringify(pass))]}));e.onLoaded();return e;
  }
  const sprite=effect('builtin-sprite','sprite');
  const graphics=effect('builtin-graphics','graphics');
  const stencil=effect('builtin-clear-stencil','clear');
  // The forward pipeline creates these unused 3D materials during initialization.
  effect('internal/builtin-geometry-renderer','clear',6);
  effect('internal/builtin-occlusion-query','clear');
  function material(key,e,defines={}){const m=new Material();m.name=key;m.initialize({effectAsset:e,defines});builtinResMgr.addAsset(key,m);}
  material('ui-sprite-material',sprite,{USE_TEXTURE:true,USE_LOCAL:false});
  material('ui-sprite-gray-material',sprite,{USE_TEXTURE:true,USE_LOCAL:false,USE_GRAY:true});
  material('ui-sprite-alpha-sep-material',sprite,{USE_TEXTURE:true,USE_LOCAL:false});
  material('ui-sprite-gray-alpha-sep-material',sprite,{USE_TEXTURE:true,USE_LOCAL:false,USE_GRAY:true});
  material('ui-base-material',sprite,{USE_TEXTURE:false,USE_LOCAL:false});
  material('ui-graphics-material',graphics,{USE_LOCAL:true});
  material('default-clear-stencil',stencil);
  registerPaintedBlend(cc,chunks);
}
