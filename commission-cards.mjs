// Shared painted locations, cropped inside panel boundaries to prevent atlas seams.
export function commissionArt(q={}){
 const hard=['coldstore','lifeline','ironwall','alarm','blackout','clockwork'];
 const special=q.kind==='hard',file=special?'quest-locations-v02672.webp':'commissions-v02646.webp';
 const i=special?Math.max(0,hard.indexOf(q.id)):q.kind==='hunt'?({market:1,depot:2,station:4}[q.id]??4):({sweep:0,escort:1,salvage:2,wardrobe:2,nightwatch:2,parts:0,polish:2,recruit:3,hunt:4,hard:5}[q.kind]??3);
 return `<span class="commission-art" aria-hidden="true"><svg viewBox="${i%3*512+3} ${Math.floor(i/3)*512+3} 506 ${special?506:300}" preserveAspectRatio="xMidYMid slice"><image href="./assets/scenes/${file}" width="1536" height="1024"/></svg></span>`;
}
