// Frozen v0.26.68 baseline, used only by review pages. Never imported by game build.
import {drawFinishedRoster} from './motion-baseline-roster.mjs';
import {drawFinishedSpark} from './motion-baseline-spark.mjs';
export function renderBaselineFrame(ctx,id,pose,atlas,width,height,enemySource=null,face){
 ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,width,height);
 const sx=width/1.44,sy=height/1.38;ctx.setTransform(sx,0,0,sy,.22*sx,.20*sy);ctx.globalAlpha=pose.alpha;
 if(id==='spark')drawFinishedSpark(ctx,pose,atlas,face);else drawFinishedRoster(ctx,id,pose,atlas,face);
 ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;
}
