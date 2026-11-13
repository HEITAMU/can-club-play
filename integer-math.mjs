// Gameplay amounts use integer units; ratios are integer percentages.
// Time-based income/DoT keeps an integer remainder so frame rate cannot mint or
// erase resources. Animation interpolation is separate from these amounts.
export const integer=n=>Number.isFinite(n)?Math.round(n):0;
export const mulDiv=(value,numerator,denominator=100)=>Math.round(value*numerator/denominator);
export function accrueUnits(owner,key,unitsPerSecond,milliseconds){
 const amount=(owner[key]||0)+integer(unitsPerSecond)*integer(milliseconds),whole=Math.floor(amount/1000);
 owner[key]=amount-whole*1000;return whole;
}
export function resizeAmount(owner,key,oldMax,newMax){
 const saved=owner[key+'Basis'];
 const basis=saved&&saved.value===owner[key]&&saved.max===oldMax?saved:{numerator:Math.floor(owner[key]),denominator:oldMax};
 const value=Math.floor(basis.numerator*newMax/basis.denominator);
 owner[key+'Basis']={...basis,value,max:newMax};return value;
}
