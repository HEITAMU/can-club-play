import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {SQUARES} from '../cocos/assets/scripts/Core.js';
import {
  TURN_DURATION_MS,TURN_KEYFRAME_COUNT,createTurnMotion,sampleTurn,
} from '../cocos/assets/scripts/TurnMotion.js';

const reference=JSON.parse(readFileSync(new URL('../cocos/assets/resources/art/referenceLayout.json',import.meta.url),'utf8'));
const slots=reference.slotRects.map(([x,y,width,height])=>({x,y,width,height}));
const pivots=reference.knobCenters.map(([x,y])=>({x,y}));
const EPS=1e-6;
const viewportWidths=[320,390,460];
const progressSteps=Array.from({length:TURN_KEYFRAME_COUNT},(_,i)=>i/(TURN_KEYFRAME_COUNT-1));

function near(actual,expected,message,tolerance=EPS){
  assert.ok(Number.isFinite(actual),message+' is not finite');
  assert.ok(Math.abs(actual-expected)<=tolerance,message+': '+actual+' != '+expected);
}
function center(rect){return {x:rect.x+rect.width/2,y:rect.y+rect.height/2};}
function bounds(rects){
  return {left:Math.min(...rects.map(r=>r.x)),top:Math.min(...rects.map(r=>r.y)),
    right:Math.max(...rects.map(r=>r.x+r.width)),bottom:Math.max(...rects.map(r=>r.y+r.height))};
}
function edges(rect){return {left:rect.x,top:rect.y,right:rect.x+rect.width,bottom:rect.y+rect.height};}
function displayed(source,sample){
  const width=source.width*sample.scaleX,height=source.height*sample.scaleY;
  return {left:sample.x-width/2,top:sample.y-height/2,right:sample.x+width/2,bottom:sample.y+height/2};
}
function overlap(a,b){
  return Math.min(a.right,b.right)-Math.max(a.left,b.left)>EPS
    &&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>EPS;
}
function transformRect(rect,scale,tx,ty){
  return {x:rect.x*scale+tx,y:rect.y*scale+ty,width:rect.width*scale,height:rect.height*scale};
}
function motionCase(q,direction,scale=1,tx=0,ty=0){
  const all=slots.map(r=>transformRect(r,scale,tx,ty)),indices=SQUARES[q];
  const rects=indices.map(index=>all[index]),pivot={x:pivots[q].x*scale+tx,y:pivots[q].y*scale+ty};
  return {q,direction,rects,pivot,all,indices,label:'q='+q+' dir='+direction+' scale='+scale};
}
function eachCase(callback){
  for(let q=0;q<SQUARES.length;q++)for(const direction of [1,-1])callback(motionCase(q,direction));
}
function samplesAt(motion,progress){return [0,1,2,3].map(index=>sampleTurn(motion,index,progress));}
function validateFrame(c,samples,label){
  const selectedBounds=bounds(c.rects),boxes=samples.map((sample,index)=>{
    for(const field of ['x','y','dx','dy','scaleX','scaleY','angle','focus'])assert.ok(Number.isFinite(sample[field]),label+' '+field+' is not finite');
    assert.ok(sample.scaleX>0&&sample.scaleY>0,label+' a tile disappeared');
    assert.ok(sample.focus>=-EPS&&sample.focus<=1+EPS,label+' focus outside 0..1');
    const box=displayed(c.rects[index],sample);
    assert.ok(box.left>=selectedBounds.left-EPS&&box.right<=selectedBounds.right+EPS
      &&box.top>=selectedBounds.top-EPS&&box.bottom<=selectedBounds.bottom+EPS,
    label+' tile '+index+' crosses the selected 2x2 boundary');
    near(sample.dx,sample.x-center(c.rects[index]).x,label+' tile '+index+' dx');
    near(sample.dy,sample.y-center(c.rects[index]).y,label+' tile '+index+' dy');
    return box;
  });
  for(let a=0;a<4;a++)for(let b=a+1;b<4;b++)assert.ok(!overlap(boxes[a],boxes[b]),label+' selected tiles '+a+'/'+b+' overlap');
  for(const [index,rect] of c.all.entries()){
    if(c.indices.includes(index))continue;
    for(let a=0;a<4;a++)assert.ok(!overlap(boxes[a],edges(rect)),label+' moving tile '+a+' overlaps stationary slot '+index);
  }
}

test('quarter-turn endpoints land on the real unequal target rectangles without drift',()=>{
  assert.equal(TURN_DURATION_MS,1200);
  assert.equal(TURN_KEYFRAME_COUNT,49);
  eachCase(c=>{
    const original=structuredClone(c.rects);
    for(const pivot of [c.pivot,undefined]){
      const motion=createTurnMotion(c.rects,c.direction,pivot);
      c.rects.forEach((source,index)=>{
        const start=sampleTurn(motion,index,0),end=sampleTurn(motion,index,1);
        const target=c.rects[(index+c.direction+4)%4],from=center(source),to=center(target);
        near(start.x,from.x,c.label+' start x');near(start.y,from.y,c.label+' start y');
        near(start.dx,0,c.label+' start dx');near(start.dy,0,c.label+' start dy');
        near(start.scaleX,1,c.label+' start width');near(start.scaleY,1,c.label+' start height');
        near(end.x,to.x,c.label+' final x');near(end.y,to.y,c.label+' final y');
        near(end.dx,to.x-from.x,c.label+' final dx');near(end.dy,to.y-from.y,c.label+' final dy');
        near(source.width*end.scaleX,target.width,c.label+' final width');
        near(source.height*end.scaleY,target.height,c.label+' final height');
        near(start.angle,0,c.label+' starting angle');near(end.angle,90*c.direction,c.label+' final angle');
        near(start.focus,0,c.label+' starting focus');near(end.focus,0,c.label+' final focus');
      });
    }
    assert.deepEqual(c.rects,original,'the shared motion must not mutate reference slot geometry');
  });
});

test('all four regions and both directions keep tile edges visible and separate at each rendered keyframe',()=>{
  for(const width of viewportWidths)for(let q=0;q<4;q++)for(const direction of [1,-1]){
    const scale=(width-16)/reference.boardOuter[2],c=motionCase(q,direction,scale,8,31.25);
    const motion=createTurnMotion(c.rects,direction,c.pivot),frames=progressSteps.map(progress=>samplesAt(motion,progress));
    frames.forEach((samples,index)=>validateFrame(c,samples,c.label+' frame='+index));
    // Web Animations interpolate keyframe values. Check their actual half-way
    // rectangles too, rather than only re-evaluating the ideal mathematical arc.
    for(let i=0;i<frames.length-1;i++){
      const between=frames[i].map((sample,index)=>Object.fromEntries(Object.keys(sample).map(field=>[field,(sample[field]+frames[i+1][index][field])/2])));
      validateFrame(c,between,c.label+' between frames '+i+'/'+(i+1));
    }
  }
});

test('the midpoint follows the selected direction along a visible arc, not a straight exchange',()=>{
  eachCase(c=>{
    const motion=createTurnMotion(c.rects,c.direction,c.pivot);
    c.rects.forEach((source,index)=>{
      const start=center(source),target=center(c.rects[(index+c.direction+4)%4]),mid=sampleTurn(motion,index,.5);
      const distance=Math.hypot(target.x-start.x,target.y-start.y);
      assert.ok(Math.hypot(mid.x-start.x,mid.y-start.y)>distance*.25,c.label+' midpoint still at its origin');
      assert.ok(Math.hypot(mid.x-target.x,mid.y-target.y)>distance*.25,c.label+' midpoint already at its destination');
      const chordDistance=Math.abs((target.x-start.x)*(mid.y-start.y)-(target.y-start.y)*(mid.x-start.x))/distance;
      assert.ok(chordDistance>distance*.05,c.label+' arc is indistinguishable from a straight chord');
      const turnCross=(start.x-c.pivot.x)*(mid.y-c.pivot.y)-(start.y-c.pivot.y)*(mid.x-c.pivot.x);
      assert.ok(turnCross*c.direction>0,c.label+' midpoint travels in the wrong direction');
      assert.ok(mid.focus>.9,c.label+' selected region is not focused while moving');
      let previous=0;
      for(const progress of progressSteps){
        const angle=sampleTurn(motion,index,progress).angle*c.direction;
        assert.ok(angle>=previous-EPS&&angle>=-EPS&&angle<=90+EPS,c.label+' knob angle reverses or overshoots');
        previous=angle;
      }
    });
  });
});

test('320/390/460px layouts and translated origins preserve the same motion',()=>{
  eachCase(c=>{
    const original=createTurnMotion(c.rects,c.direction,c.pivot);
    for(const width of viewportWidths){
      const scale=(width-16)/reference.boardOuter[2],tx=17.25,ty=-83.5;
      const scaled=motionCase(c.q,c.direction,scale,tx,ty),motion=createTurnMotion(scaled.rects,scaled.direction,scaled.pivot);
      for(const progress of progressSteps)for(let index=0;index<4;index++){
        const a=sampleTurn(original,index,progress),b=sampleTurn(motion,index,progress);
        near(b.x,a.x*scale+tx,c.label+' scaled x');near(b.y,a.y*scale+ty,c.label+' scaled y');
        near(b.dx,a.dx*scale,c.label+' scaled dx');near(b.dy,a.dy*scale,c.label+' scaled dy');
        for(const field of ['scaleX','scaleY','angle','focus'])near(b[field],a[field],c.label+' invariant '+field);
      }
    }
  });
});

test('dense sampling reports shrink and endpoint error and detects discontinuous jumps',t=>{
  const report={clockwise:{minScaleX:Infinity,minScaleY:Infinity,maxEndpointError:0,maxScaleStep:0,maxCenterStep:0},
    counterclockwise:{minScaleX:Infinity,minScaleY:Infinity,maxEndpointError:0,maxScaleStep:0,maxCenterStep:0}};
  eachCase(c=>{
    const motion=createTurnMotion(c.rects,c.direction,c.pivot),summary=c.direction===1?report.clockwise:report.counterclockwise;
    const b=bounds(c.rects),diagonal=Math.hypot(b.right-b.left,b.bottom-b.top);
    let previous=samplesAt(motion,0);
    for(let step=0;step<=1000;step++){
      const samples=samplesAt(motion,step/1000);
      samples.forEach((sample,index)=>{
        const prior=previous[index],scaleStep=Math.max(Math.abs(sample.scaleX-prior.scaleX),Math.abs(sample.scaleY-prior.scaleY));
        const centerStep=Math.hypot(sample.x-prior.x,sample.y-prior.y);
        summary.minScaleX=Math.min(summary.minScaleX,sample.scaleX);summary.minScaleY=Math.min(summary.minScaleY,sample.scaleY);
        summary.maxScaleStep=Math.max(summary.maxScaleStep,scaleStep);summary.maxCenterStep=Math.max(summary.maxCenterStep,centerStep);
        assert.ok(scaleStep<.01,c.label+' scale jumps by at least 1% within 0.1% of the duration');
        assert.ok(centerStep<diagonal*.01,c.label+' center jumps within 0.1% of the duration');
        if(step===1000){
          const target=c.rects[(index+c.direction+4)%4],to=center(target),source=c.rects[index];
          summary.maxEndpointError=Math.max(summary.maxEndpointError,Math.abs(sample.x-to.x),Math.abs(sample.y-to.y),
            Math.abs(source.width*sample.scaleX-target.width),Math.abs(source.height*sample.scaleY-target.height));
        }
      });
      previous=samples;
    }
  });
  for(const [direction,values] of Object.entries(report)){
    assert.ok(values.minScaleX>0&&values.minScaleY>0,direction+' tiles vanished');
    assert.ok(values.maxEndpointError<EPS,direction+' endpoint error');
    t.diagnostic(direction+' '+JSON.stringify(values)+`; center distances are original-art pixels, adjacent sample dt=0.001 (${TURN_DURATION_MS/1000}ms)`);
  }
});
