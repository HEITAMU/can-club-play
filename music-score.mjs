// Original bass-led electronic loop: 4/4, minor harmony and syncopation.
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
 [45,52,55,59],[41,48,52,57],[48,55,59,62],[43,50,53,57],
 [45,52,55,59],[41,48,52,57],[48,55,59,62],[43,50,53,57],
 [45,52,55,59],[41,48,52,57],[48,55,59,62],[43,50,53,57],
 [41,48,52,57],[43,50,53,57],[45,52,55,59],[45,52,55,59]
];
export function musicEvents(step,scene='alley'){
 const bar=Math.floor(step/8)%16,k=step%8,chord=HARMONY[bar],events=[],battle=scene==='battle';
 // Four-on-the-floor kick, syncopated saturated bass, restrained upper register.
 if(k%2===0)events.push({midi:36,kind:'kick',gain:battle?.65:.52,duration:.38,offset:0,pan:0});
 if([0,3,4,6,7].includes(k))events.push({midi:chord[0]-12+(k===7&&bar%4===3?7:0),kind:'bass',gain:battle?.68:.59,duration:k===0?.24:.18,offset:k%2===0?.08:.012,pan:0});
 if(k%2===1)events.push({kind:'hat',gain:battle?.025:.016,duration:.055,offset:.012});
 if(k===2||k===6)events.push({kind:'clap',gain:battle?.045:.028,duration:.12,offset:.006});
 if(k===0)for(const [i,n] of chord.slice(1).entries())events.push({midi:n,kind:'pad',gain:.085,duration:1.7,offset:0,pan:(i-1)*.3});
 if(k===3||k===7)for(const n of chord.slice(1))events.push({midi:n,kind:'synth',gain:.085,duration:.13,offset:.012,pan:-.12});
 const melody=SCORE[bar][k];
 if(melody!==null&&bar%4!==3)events.push({midi:melody-12,kind:'lead',gain:.12,duration:.42,offset:.016,pan:.15});
 return events;
}
export function instrumentPCM(midi,kind,sampleRate=24000){
 const duration=kind==='pad'?3:kind==='kick'?.65:kind==='bass'?.8:1.2;
 const a=new Float32Array(Math.ceil(sampleRate*duration)),f=440*2**((midi-69)/12);
 if(['synth','lead'].includes(kind)){
  for(let h=1;h<=7&&f*h<sampleRate*.43;h++){
   const angle=2*Math.PI*f*h/sampleRate,rotation=Math.cos(angle),sine=Math.sin(angle),decay=Math.exp(-(3+h*1.5)/sampleRate);
   let x=1,y=0,amplitude=1/(h*h);
   for(let i=0;i<a.length;i++){a[i]+=y*amplitude;const next=x*rotation-y*sine;y=y*rotation+x*sine;x=next;amplitude*=decay;}
  }
  for(let i=0;i<a.length;i++){const t=i/sampleRate;a[i]*=Math.min(1,t/.015)*.38*Math.min(1,(duration-t)/.06);}
  return a;
 }
 for(let i=0;i<a.length;i++){
  const t=i/sampleRate;let v=0;
  if(kind==='pad'){
   const envelope=(1-Math.exp(-t*3.5))*Math.exp(-t*.7)*Math.min(1,(duration-t)/.7);
   v=(Math.sin(2*Math.PI*f*t)+.22*Math.sin(2*Math.PI*f*1.003*t)+.12*Math.sin(2*Math.PI*f*2*t))*envelope*.25;
  }else if(kind==='kick'){
   const phase=2*Math.PI*(48*t+90/35*(1-Math.exp(-35*t)));
   v=Math.sin(phase)*Math.min(1,t/.002)*Math.exp(-t*9)*.85;
  }else{
   const tone=Math.sin(2*Math.PI*f*t)+.36*Math.sin(2*Math.PI*f*2*t)+.18*Math.sin(2*Math.PI*f*3*t)+.08*Math.sin(2*Math.PI*f*4*t);
   v=Math.tanh(tone*1.6)*Math.min(1,t/.008)*Math.exp(-t*4)*.65;
  }
  a[i]=v*Math.min(1,(duration-t)/.06);
 }
 return a;
}
