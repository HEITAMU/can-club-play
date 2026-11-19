/** CPU reference of the shared painted-blend GLSL, for Canvas parity checks. */
export type PaintedSample = [number,number,number,number];
export type PaintedBlendMode = 'lighter'|'source-over';
export function mixPaintedSamples(first:PaintedSample,second:PaintedSample,weightA:number,weightB:number,opacity=1,mode:PaintedBlendMode='lighter'):PaintedSample {
  const firstAlpha=first[3]*weightA*opacity,secondAlpha=second[3]*weightB*opacity;
  const remainder=mode==='lighter'?1:1-secondAlpha;
  const clamp=(v:number)=>Math.max(0,Math.min(1,v));
  return [
    clamp(first[0]*firstAlpha*remainder+second[0]*secondAlpha),
    clamp(first[1]*firstAlpha*remainder+second[1]*secondAlpha),
    clamp(first[2]*firstAlpha*remainder+second[2]*secondAlpha),
    clamp(firstAlpha*remainder+secondAlpha),
  ];
}

/** Map unrotated first-frame UVs to the same point in the second frame. */
export function paintedSecondaryUV(first:ReadonlyArray<number>,second:ReadonlyArray<number>):PaintedSample {
  const sx=(second[6]-second[4])/(first[6]-first[4]);
  const sy=(second[1]-second[5])/(first[1]-first[5]);
  return [sx,sy,second[4]-first[4]*sx,second[5]-first[5]*sy];
}
