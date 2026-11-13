// The twelve painted poses have fixed foot pivots and share one physical scale.
// Position and weight shifts stay continuous; poses switch without double limbs.
export function fullBodyFrame(pose,time=0){
 if(pose.bodyFrame!==undefined)return pose.bodyFrame;
 if(pose.phase==='受控')return 11;
 if(pose.run)return Math.floor(Math.max(0,time)*9)%2?3:2;
 if(pose.phase==='蓄力'||pose.phase==='锁定盾量')return (pose.windup||0)<.22?6:(pose.windup||0)<.72?7:8;
 if(pose.phase==='轰拳')return (pose.punch||0)>.72?9:8;
 if(pose.phase==='收拳')return (pose.punch||0)>.5?10:6;
 if(pose.phase==='起手')return 4;
 if(pose.phase==='挥击'||pose.phase==='命中')return 5;
 if(pose.phase==='收招')return 6;
 return Math.sin(time*2.4)>.65?1:0;
}
export function paintFullBody(ctx,image,art,pose,x,y,size,options={}){
 const set=art.fullBody,index=fullBodyFrame(pose,options.time??pose.time??0);
 const frame=set.frames[index],s=size/set.height,[px,py]=frame.pivot;
 const breath=pose.breath||0;
 // The artwork already contains the torso turn and punching arm. Do not rotate
 // or stretch them a second time with the old cutout-arm pose.
 ctx.save();ctx.translate(x,y+size*(pose.bob||0));
 const lean=pose.phase==='接近'||pose.phase==='归位'?(pose.lean||0)*.25:0;
 ctx.rotate(lean);ctx.scale(s*(1-breath*.12),s*(1+breath*.15));
 ctx.drawImage(image,...frame.rect,-px,-py,frame.rect[2],frame.rect[3]);ctx.restore();
 return fullBodyMuzzle(set,pose,x,y,size,index);
}
export function fullBodyMuzzle(set,pose,x,y,size,index=fullBodyFrame(pose,pose.time||0)){
 const [fx,fy]=set.frames[index].fist,s=size/set.height,breath=pose.breath||0;
 const dx=fx*s*(1-breath*.12),dy=fy*s*(1+breath*.15);
 const a=pose.phase==='接近'||pose.phase==='归位'?(pose.lean||0)*.25:0;
 return{x:x+dx*Math.cos(a)-dy*Math.sin(a),y:y+dx*Math.sin(a)+dy*Math.cos(a)+size*(pose.bob||0)};
}
