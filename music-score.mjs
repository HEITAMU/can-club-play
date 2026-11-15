// Original quiet harbour theme: 4/4, sparse melody, extended harmony.
export const SCORE=[
 [null,72,null,76,null,null,74,null],[71,null,null,null,67,null,null,null],
 [null,69,null,72,null,null,71,null],[67,null,null,null,null,null,null,null],
 [null,69,null,null,72,null,76,null],[74,null,null,72,null,null,null,null],
 [71,null,null,69,null,67,null,null],[64,null,null,null,null,null,null,null],
 [null,76,null,null,79,null,76,null],[74,null,null,null,71,null,null,null],
 [null,72,null,76,null,null,74,null],[71,null,null,null,67,null,null,null],
 [69,null,null,72,null,null,71,null],[67,null,null,null,64,null,null,null],
 [null,67,null,69,null,71,null,null],[72,null,null,null,null,null,null,null]
];
export const HARMONY=[
 [48,55,59,64],[43,53,57,62],[45,52,55,59],[40,55,59,62],
 [41,52,57,60],[48,55,59,64],[43,53,57,62],[48,55,59,64],
 [48,55,59,64],[43,53,57,62],[45,52,55,59],[40,55,59,62],
 [41,52,57,60],[48,55,59,64],[43,53,57,62],[48,55,59,64]
];
// A little variation without changing the simulation RNG or save state.
export function musicEvents(step,scene='alley'){
 const bar=Math.floor(step/8)%16,k=step%8,chord=HARMONY[bar],events=[];
 const melody=SCORE[bar][k];
 if(melody!==null)events.push({midi:melody,kind:'piano',gain:.25+(bar%3)*.012,duration:1.35,offset:k%2?.018:0,pan:.12});
 if(k===0){
  events.push({midi:chord[0]-12,kind:'bass',gain:.28,duration:2.6,offset:0,pan:0});
  for(const [i,n] of chord.slice(1).entries())events.push({midi:n,kind:'pad',gain:.075,duration:2.8,offset:i*.025,pan:(i-1)*.3});
 }
 if(k===3||k===6)events.push({midi:chord[k===3?1:2],kind:'guitar',gain:k===3?.105:.075,duration:.9,offset:.025,pan:-.25});
 if(scene==='battle'&&(k===2||k===6))events.push({kind:'brush',gain:.018,duration:.14,offset:.012});
 return events;
}
export function instrumentPCM(midi,kind,sampleRate=24000){
 const duration=kind==='pad'?4:kind==='bass'?3:kind==='piano'?3:1.8;
 const a=new Float32Array(Math.ceil(sampleRate*duration)),f=440*2**((midi-69)/12);
 if(kind!=='pad'&&kind!=='bass'){
  const piano=kind==='piano';
  // Recurrences avoid expensive per-sample trigonometry on the game thread.
  for(let h=1;h<=8&&f*h<sampleRate*.43;h++){
   const frequency=f*h*(piano?Math.sqrt(1+.00008*h*h):1),angle=2*Math.PI*frequency/sampleRate;
   const rotation=Math.cos(angle),sine=Math.sin(angle),decay=Math.exp(-((piano?1.5:2.8)+h*.55)/sampleRate);
   let x=1,y=0,amplitude=piano?1/Math.pow(h,1.65):Math.sin(h*1.13)/Math.pow(h,1.6);
   for(let i=0;i<a.length;i++){a[i]+=y*amplitude;const next=x*rotation-y*sine;y=y*rotation+x*sine;x=next;amplitude*=decay;}
  }
  for(let i=0;i<a.length;i++){const t=i/sampleRate;a[i]*=Math.min(1,t/(piano?.012:.004))*.38*Math.min(1,(duration-t)/.06);}
  return a;
 }
 for(let i=0;i<a.length;i++){
  const t=i/sampleRate;let v=0;
  if(kind==='pad'){
   const envelope=(1-Math.exp(-t*3.5))*Math.exp(-t*.7)*Math.min(1,(duration-t)/.7);
   v=(Math.sin(2*Math.PI*f*t)+.22*Math.sin(2*Math.PI*f*1.003*t)+.12*Math.sin(2*Math.PI*f*2*t))*envelope*.25;
  }else{
   v=(Math.sin(2*Math.PI*f*t)+.16*Math.sin(2*Math.PI*f*2*t))*Math.min(1,t/.022)*Math.exp(-t*1.7)*.46;
  }
  a[i]=v*Math.min(1,(duration-t)/.06);
 }
 return a;
}
