import {test} from 'node:test';
import assert from 'node:assert/strict';
import {dailyLayout} from '../layout.mjs';
import {nativeFixture} from './helpers/runtime-fixtures.mjs';

// Compare the actual two production layout functions. These are geometry
// assertions, not claims about browser paint, font metrics, or device scaling.
const plain=value=>JSON.parse(JSON.stringify(value));
const near=(a,b,message)=>assert.ok(Math.abs(a-b)<1e-8,`${message}: ${a} != ${b}`);
const overlap=(a,b)=>Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x)>1e-8&&Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y)>1e-8;

test('web/native daily layouts mirror every field across short/tall and narrow/wide viewports',()=>{
  const {game}=nativeFixture();let compact=0,regular=0;
  for(const width of [320,360,390,430,768])for(const height of [400,568,667,844,1100,1800]){
    game.windowScale=1;
    const web=dailyLayout(width,height),native=plain(game.dailyGeometry(width,height));
    assert.deepEqual(native,web,`${width}×${height} must keep both production layout formulas in sync`);
    // Also exercise the actual fixed-390 native canvas conversion, so a 44
    // logical-pixel button cannot accidentally become smaller on a 320px phone.
    const scale=390/width;game.windowScale=scale;
    const physical=plain(game.dailyGeometry(390,height*scale));
    assert.equal(physical.compact,web.compact);
    for(const name of ['contentH','iconWidth'])near(physical[name]/scale,web[name],`physical ${name}`);
    for(const [name,rect] of Object.entries(web))if(rect&&typeof rect==='object')for(const axis of ['x','y','w','h'])near(physical[name][axis]/scale,rect[axis],`physical ${name}.${axis}`);
    web.compact?compact++:regular++;
    near(web.board.w,width-16,'the board retains available width instead of shrinking with height');
    near(web.board.h/web.board.w,765/817,'reference board aspect ratio');
    for(const [name,rect] of Object.entries(web))if(rect&&typeof rect==='object'){
      for(const axis of ['x','y','w','h'])assert(Number.isFinite(rect[axis]),`${name}.${axis}`);
      assert(rect.x>=-1e-8&&rect.y>=-1e-8&&rect.w>0&&rect.h>0,`${name} positive within page`);
      assert(rect.x+rect.w<=width+1e-8&&rect.y+rect.h<=web.contentH+1e-8,`${name} within ${width}×${web.contentH}`);
    }
    for(const name of ['back','settings','cw','ccw','hint','numbers','share','appreciate','next','details']){
      assert(web[name].w>=44&&web[name].h>=44,`${name} needs a 44px target at ${width}×${height}`);
    }
    // Playing and completed controls deliberately occupy the same rows; only
    // compare controls that are simultaneously visible in a real screen state.
    for(const names of [['back','settings','board','cw','ccw','hint','numbers','share'],['back','settings','board','appreciate','next','details','share']]){
      for(let a=0;a<names.length;a++)for(let b=a+1;b<names.length;b++)assert.equal(overlap(web[names[a]],web[names[b]]),false,`${names[a]} overlaps ${names[b]} at ${width}×${height}`);
    }
  }
  assert(compact>0&&regular>0,'exercise both layout branches');
});

test('native rendered knob hit regions retain 44 physical pixels with separated targets',()=>{
  for(const physicalWidth of [320,360,390,430,768]){
    const f=nativeFixture(),g=f.game;g.startGame('story','1');g.windowScale=g.width/physicalWidth;
    const start=f.groups.length;g.drawReferenceBoard(0,0,(g.width-16)/817);
    const targets=f.groups.slice(start).filter(item=>/^Rotate [0-3]$/.test(item.name));
    assert.equal(targets.length,4);
    for(const target of targets){assert(target.w/g.windowScale>=44-1e-8);assert(target.h/g.windowScale>=44-1e-8);}
    for(let a=0;a<targets.length;a++)for(let b=a+1;b<targets.length;b++)assert.equal(overlap(targets[a],targets[b]),false);
  }
});
