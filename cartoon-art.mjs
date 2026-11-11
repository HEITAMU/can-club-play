// Original flat 2D illustration. Solid inks, no lighting, bevels, gradients or cast shadows.
const INK='#263E4E', PAPER='#FFF8EB';
const palette={
 orange:['#EEAA59','#FCDEAA','#3B786F'],ink:['#354D60','#F5EAD3','#E58A72'],
 milk:['#F2DDBD','#FFF8EB','#D889A0'],spark:['#E99559','#F9DBAE','#4F8290'],
 mint:['#B7D3C3','#F7F3D9','#4B9389'],bolt:['#9DBBC8','#E7F0E9','#CE9C57'],
 pudding:['#D5B487','#F5E2BE','#C76A65'],star:['#C1AFD6','#F6EBDD','#8877AF']
};
const line=(d,color=INK,width=3)=>`<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;
const star=(x,y,r=10,color='#F3BB60')=>`<path d="M${x} ${y-r}l${r*.3} ${r*.67} ${r*.7} ${r*.1}-${r*.51} ${r*.5} ${r*.13} ${r*.73}-${r*.62}-${r*.35}-${r*.62} ${r*.35} ${r*.13}-${r*.73}-${r*.51}-${r*.5} ${r*.7}-${r*.1}z" fill="${color}"/>`;
const paw='<circle cx="0" cy="3" r="5"/><circle cx="-6" cy="-4" r="2.3"/><circle cx="0" cy="-6" r="2.3"/><circle cx="6" cy="-4" r="2.3"/>';
function weapon(id){return ({
 orange:`${line('M128 147l-11 20',INK,8)}<circle cx="139" cy="134" r="24" fill="${INK}"/><circle cx="139" cy="134" r="18" fill="#C8DCD8"/><g transform="translate(139 134)" fill="#497A76">${paw}</g>`,
 ink:`${line('M140 98Q165 129 140 160','#BB8753',5)}<path class="bow-string" d="M138 97L126 128 138 160" stroke="${INK}" stroke-width="1.5" fill="none"/><g class="arrow-loaded">${line('M106 128h56',INK,2.5)}<path d="M159 122l11 6-11 6z" fill="#EC9C66"/>${line('M109 123l5 5-5 5','#EC9C66',3)}</g>`,
 milk:`<path d="M128 119h16v12l5 7v23q-14 7-28 0v-23l7-7z" fill="#FFF8EB" stroke="#A86A83" stroke-width="2"/><rect x="126" y="116" width="20" height="7" rx="2" fill="#D889A0"/><rect x="124" y="140" width="22" height="15" rx="2" fill="#D889A0"/>${line('M135 143v9m-4-4h8',PAPER,2.5)}`,
 spark:`<rect x="122" y="126" width="28" height="37" rx="5" fill="#D86D52"/><path d="M122 131h28m-28 27h28" stroke="#F4CB96" stroke-width="3"/><path d="M130 149q17 9 12-10-2 11-12 10" fill="#FFF1D7"/>${line('M140 138l4-4','#4A7965',3)}`,
 mint:`<path d="M137 107l20 15-5 23h-28l-7-23z" fill="#A7D8D4"/>${line('M137 115v23m-9-18l18 12m-18 0l18-12','#367F82',2.5)}${star(159,103,5,'#4B9389')}`,
 bolt:`<path d="M130 153l13-44q-15-9-6-24l6 12 9-1 4-13q13 17-2 27l-13 46q-8 5-11-3z" fill="#496A7C"/><circle cx="137" cy="149" r="2.5" fill="#A8C3CC"/>`,
 pudding:`<path d="M112 119h44v27q-3 22-22 32-19-11-22-32z" fill="#354F60"/><path d="M119 126h30v19q-2 17-15 25-14-9-15-25z" fill="#E4B76D"/><path d="M122 146q16-13 23 0-7 12-23 0l-5 4v-8z" fill="#FFF4DB"/>`,
 star:`${line('M122 162l22-53','#6B6586',5)}${star(146,102,21,'#F2B85D')}${star(167,126,5,'#8877AF')}`
 })[id];}
function outfit(id,cloth){const front=`<path d="M64 115q25-10 49 0l10 51q-32 16-65 0z" fill="${cloth}"/>`;
 return ({
 orange:`<path d="M63 111q24 10 50 0l-12 19-19-3-10 13-5-17z" fill="${cloth}"/><circle cx="88" cy="121" r="4" fill="#F8E8C7"/>`,
 ink:`<path d="M62 112q26 9 52 0l-4 13H66z" fill="${cloth}"/><path d="M67 118l-28 17 29-2 12-12z" fill="${cloth}"/>`,
 milk:`<path d="M69 124l13 8h18l10-8 7 43H65z" fill="${cloth}"/>${line('M91 143v13m-6-6h12',PAPER,4)}`,
 spark:`${front}<path d="M65 114l23 13 24-13-6 18-18 5-17-8z" fill="#D58067"/><rect x="77" y="143" width="25" height="14" rx="3" fill="#C1D8D4"/>`,
 mint:`${front}${line('M64 115l24 15 25-15m-25 15v41','#DFEACF',4)}<circle cx="88" cy="132" r="4" fill="#F2BC68"/>`,
 bolt:`<path d="M69 116l8 15h24l8-15 9 51H62z" fill="${cloth}"/><rect x="77" y="138" width="25" height="18" rx="3" fill="#F2E2BF"/>${line('M85 139v16','#AE824C',2)}`,
 pudding:`${front}<path d="M61 114q26 13 54 0l-4 11q-24 9-47 0z" fill="#F0C77C"/><circle cx="89" cy="127" r="5" fill="#F0C77C"/>`,
 star:`${front}${line('M65 115l23 17 25-17m-25 17v37','#F2D6A0',3)}${star(72,153,6,'#F2D6A0')}${star(106,156,4,'#F2D6A0')}`
 })[id];}
function hat(id){return ({
 milk:`<path d="M62 46V29q24-6 49 0v17z" fill="#FFF8EB" stroke="#D889A0" stroke-width="2"/>${line('M87 31v11m-5-5h10','#CE8097',3.5)}`,
 spark:`${line('M51 53h76','#486B78',6)}<rect x="59" y="39" width="28" height="20" rx="8" fill="#355967"/><rect x="94" y="39" width="28" height="20" rx="8" fill="#355967"/><rect x="64" y="43" width="18" height="12" rx="4" fill="#A8D3D7"/><rect x="99" y="43" width="18" height="12" rx="4" fill="#A8D3D7"/>`,
 bolt:`<path d="M56 47q0-33 34-33t35 33z" fill="#F0BD62"/><rect x="50" y="44" width="81" height="8" rx="4" fill="#BA8648"/><rect x="84" y="18" width="10" height="26" rx="3" fill="#F7D99A"/>`,
 star:`<path d="M58 47L93 9q5 25 30 38z" fill="#8877AF"/><path d="M51 48q38-5 78 0v7H51z" fill="#6B5B94"/>${star(91,31,6,'#F3C879')}`
 })[id]||'';}
export function cartoonCat(id,portrait=false){const [fur,cream,cloth]=palette[id]||palette.orange;
 const faceInk=id==='ink'?'#FFF4DD':INK;
 return `<svg class="cat-art motion-art cartoon-rig" data-rig="hero" data-cat="${id}" data-frame="0" viewBox="${portrait?'22 6 140 153':'8 2 172 188'}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g stroke-linecap="round" stroke-linejoin="round">
 <g class="rig-tail">${line('M66 152Q30 169 37 139',fur,13)}</g>
 <g class="rig-leg-left"><path d="M68 153h17l-3 24q-7 8-23 3v-8l7-3z" fill="${fur}"/></g><g class="rig-leg-right"><path d="M98 153h15l3 17 9 3v8q-17 6-24-4z" fill="${fur}"/></g>
 <g class="rig-body"><g class="rig-arm-back"><path d="M67 117q-19-1-24 23-1 12 11 11l20-26z" fill="${fur}"/></g>
 <path d="M64 109q-12 25-7 57 31 16 64 0 4-31-12-57z" fill="${fur}"/><path d="M78 119q13-6 25 0l5 43q-18 9-34-1z" fill="${cream}"/>${outfit(id,cloth)}
 <g class="rig-head">${id==='mint'?'<path d="M43 84Q32 29 86 17q54 6 51 67l-12 27H53z" fill="#4B9389"/>':''}
 <path d="M47 67L43 24q22 3 36 24h25q12-21 30-24l-2 44q13 16 5 33-8 19-43 21-40 1-50-20-9-18 3-35z" fill="${fur}"/>
 <path d="M51 36l3 24 15-12zM124 36l-13 13 15 11z" fill="${id==='ink'?'#D88E87':'#DB8C7D'}"/>
 ${id==='orange'?'<path d="M77 47l3 15h5l2-16zm18-1l1 16h5l6-14z" fill="#CE873F"/>':''}
 <path d="M73 96q10-9 23-3 14-7 25 3-1 18-24 19-23 0-24-19z" fill="${cream}"/>
 <g class="eyes-open" fill="${faceInk}"><rect x="70" y="77" width="5.5" height="10" rx="2.75"/><rect x="108" y="77" width="5.5" height="10" rx="2.75"/></g>
 <g class="eyes-shut" style="display:none">${line('M68 82l8 3m30 0l8-3',faceInk,2.5)}</g>
 ${line(id==='ink'?'M66 70l11 2m29 0l10-3':'M68 69h8m30 0h8',faceInk,2)}
 <path d="M89 94h11l-5.5 6z" fill="${INK}"/>${line('M95 99v4m-5 1q5 5 11 0',INK,1.8)}
 <circle cx="62" cy="96" r="4" fill="${id==='ink'?'#D88E87':'#E8A08A'}"/><circle cx="124" cy="94" r="4" fill="${id==='ink'?'#D88E87':'#E8A08A'}"/>
 ${line('M45 94l11 3m-11 6 11-1m66-6 12-3m-12 9 12 1',faceInk,1.5)}${hat(id)}</g>
 <g class="rig-arm-front"><path d="M112 117q14 1 20 18 1 10-11 12l-17-18z" fill="${fur}"/><g class="rig-weapon">${weapon(id)}</g></g></g></g></svg>`;
}
const face=`<g class="eyes-open" fill="${INK}"><rect x="69" y="80" width="7" height="13" rx="3.5"/><rect x="104" y="80" width="7" height="13" rx="3.5"/>${line('M66 73l13 4m22 0l13-4',INK,3)}</g><g class="eyes-shut" style="display:none">${line('M68 82l10 6-10 6m44-12l-10 6 10 6',INK,3)}</g>${line('M85 106q8 6 15-1',INK,2.5)}`;
export function cartoonEnemy(type,boss=false){if(type==='boxBoss'){type='box';boss=true;}const colors={dust:'#A6B9A3',box:'#D9AA71',mop:'#C0ADD2',battery:'#91B9A4',bag:'#E7C797',drone:'#A1BDCF',vacuum:'#A69BC2',fridge:'#A0CED3',sign:'#C59FBB',clock:'#E4BC77',vendor:'#A6B6D1'},c=colors[type]||'#A6B9A3';
 const shapes={
 dust:`<path d="M47 66q-9-22 13-27 9-19 29-9 22-10 32 10 27 0 20 27 21 16 1 34 9 26-17 30-11 20-34 9-26 15-39-9-27-1-20-27-20-20 15-38z" fill="${c}"/><path d="M86 34Q57 29 61 15q23-3 25 19m3 0q-5-29 15-29 14 14-15 29" fill="#6C9777"/>`,
 box:`<rect x="47" y="51" width="91" height="94" rx="9" fill="${c}"/><path d="M47 51l15-19h59l17 19-20 12-26-11-24 11z" fill="#EBCB94"/><rect x="86" y="118" width="12" height="27" fill="#BB8C57"/>`,
 mop:`${line('M90 51V16','#B89363',9)}<path d="M52 59q38-25 76 0l15 80-13-4-9 14-15-8-18 12-16-12-17 8-10-15-12 7z" fill="${c}"/>${line('M57 113l-8 23m26-18l-4 23m36-23l6 23m13-29l7 22','#E5D5E8',5)}<path d="M87 55l-17-8v15l17-7 18-8v15z" fill="#AD789D"/>`,
 battery:`<rect x="77" y="28" width="26" height="14" rx="4" fill="#557B6C"/><rect x="51" y="39" width="79" height="110" rx="17" fill="${c}"/><path d="M53 52h75m-75 83h75" stroke="#D8E8CE" stroke-width="6"/><path d="M91 115l-14 16h13l-3 13 19-21H94l7-8z" fill="#F7DB88"/>`,
 bag:`<path d="M53 50l12-8 14 7 14-7 15 7 17-7 9 107H46z" fill="${c}"/>${line('M66 44V31q0-20 22-20t22 20v13','#AB7C51',5)}${line('M57 61l6 23-8 51m68-74l-6 23 8 51','#CCA36D',2.5)}`,
 drone:`${line('M56 68L39 44m86 24 17-24','#6A879B',6)}<g class="rotor-left"><rect x="10" y="37" width="56" height="6" rx="3" fill="#58778B"/></g><g class="rotor-right"><rect x="114" y="37" width="56" height="6" rx="3" fill="#58778B"/></g><path d="M52 65q38-19 77 0l10 47-21 25H63l-20-25z" fill="${c}"/><rect x="57" y="72" width="69" height="31" rx="13" fill="#DBE9E7"/><circle cx="91" cy="122" r="6" fill="#F2CA79"/>`,
 vacuum:`<path d="M52 50q39-9 76 0l11 91H44z" fill="${c}"/><rect x="52" y="46" width="76" height="10" rx="5" fill="#83789F"/>${line('M72 40V26h35v14','#766C91',7)}<rect x="71" y="119" width="39" height="18" rx="4" fill="#F2D6A7"/>${line('M78 125h24m-24 6h24','#AA8F74',2)}`,
 fridge:`<rect x="50" y="34" width="82" height="118" rx="13" fill="${c}"/>${line('M50 72h82m-13-21v10m0 25v18','#508F9C',3)}${line('M75 118v25m-10-19l20 13m-20 0l20-13','#EEF5E8',3)}`,
 sign:`<rect x="38" y="43" width="108" height="108" rx="14" fill="#906D94"/><rect x="47" y="52" width="90" height="90" rx="8" fill="${c}"/>${line('M61 62h60m-60 69h60','#F8D896',4)}`,
 clock:`<circle cx="91" cy="94" r="55" fill="${c}"/><circle cx="91" cy="94" r="45" fill="#F9EBCB"/>${line('M91 57v8m-34 30h7m55 0h7m-35 28v8','#B29360',3)}${line('M91 94v16l15 6','#A98753',3)}${line('M49 47L37 31m95 16 13-16','#BE944F',7)}`,
 vendor:`<rect x="47" y="33" width="88" height="121" rx="12" fill="${c}"/><rect x="57" y="42" width="63" height="27" rx="4" fill="#DDEAE2"/><rect x="64" y="48" width="12" height="17" rx="2" fill="#D69274"/><rect x="83" y="48" width="12" height="17" rx="2" fill="#DFC476"/><rect x="102" y="48" width="12" height="17" rx="2" fill="#80AC94"/><rect x="66" y="126" width="49" height="16" rx="3" fill="#587286"/>${line('M123 87h6m-6 10h6','#F9E7C4',3)}`
 };
 return `<svg class="enemy-art motion-art cartoon-rig" data-rig="enemy" data-type="${type}" data-frame="0" viewBox="0 0 180 190" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g stroke-linecap="round" stroke-linejoin="round"><g class="rig-leg-left"><path d="M67 141h16l-5 35H49v-8l13-3z" fill="${c}"/></g><g class="rig-leg-right"><path d="M103 143h16l3 22 13 3v8h-30z" fill="${c}"/></g><g class="rig-body"><g class="rig-arm-back"><path d="M53 87q-21 0-25 28l14 9 22-28z" fill="${c}"/></g>${shapes[type]||shapes.dust}<g class="rig-head">${face}${boss?'<path d="M67 35l-7-23 18 11 13-20 13 20 18-11-7 23z" fill="#ECAF56"/>':''}</g><g class="rig-arm-front">${type==='vacuum'?line('M126 90q36-6 29 34l-8 14','#766C91',10)+'<path d="M133 131l28 7-5 17-28-8z" fill="#C2B8D7"/>':'<path d="M126 87q21 0 27 21l-10 18-22-17z" fill="'+c+'"/>'}</g></g></g></svg>`;
}

const mix=(a,b,k)=>a+(b-a)*k;
export function poseRig(svg,frame,context){const root=svg?.matches?.('.cartoon-rig')?svg:svg?.querySelector('.cartoon-rig');if(!root)return;root.dataset.frame=frame;const hero=root.dataset.rig==='hero',id=root.dataset.cat,a=context?.actor,time=context?.time||0;let swing=0,lean=0,back=0,head=0,step=0;
 const action=a?.action;if(action){const t=action.elapsed,w=action.windup,impact=action.impactAt,end=action.duration;let k;if(t<w){k=t/w;swing=mix(0,-65,k);back=mix(0,35,k);lean=-6*k;}else if(t<impact){k=Math.min(1,(t-w)/action.travel);k=1-(1-k)**3;swing=mix(-65,65,k);back=mix(35,-25,k);lean=mix(-6,7,k);step=10*k;}else{k=Math.min(1,(t-impact)/(end-impact));swing=mix(65,0,k);back=mix(-25,0,k);lean=mix(7,0,k);step=10*(1-k);}if(action.kind==='skill'){swing*=1.13;lean*=1.2;}head=-lean*.55;}else if(frame===5&&hero||frame===3&&!hero){lean=-9;head=-8;swing=-22;back=15;}else if(frame===1||frame===6){swing=-55;back=28;lean=-5;}else if(frame===2||frame===7){swing=55;back=-20;lean=6;}
 if(id==='ink'&&action){swing*=.12;back*=1.4;}if(['milk','mint','star'].includes(id))swing*=.5;
 const part=(cls,transform)=>{const el=root.querySelector('.'+cls);if(el)el.setAttribute('transform',transform);};
 part('rig-body',`rotate(${lean} 90 157)`);part('rig-head',`rotate(${head} 90 99)`);part('rig-arm-front',`rotate(${swing} 113 121)`);part('rig-arm-back',`rotate(${back} 65 121)`);part('rig-leg-left',`rotate(${-step*.45} 76 157)`);part('rig-leg-right',`rotate(${step*.5} 106 157)`);part('rig-tail',`rotate(${Math.sin(time*2.1)*9-lean} 63 151)`);
 const shut=hero?frame===4||frame===5:frame===3;root.querySelector('.eyes-open')?.setAttribute('style',shut?'display:none':'');root.querySelector('.eyes-shut')?.setAttribute('style',shut?'':'display:none');
 const string=root.querySelector('.bow-string');if(string){const pull=action&&action.elapsed<action.windup?18*action.elapsed/action.windup:0;string.setAttribute('d',`M138 97L${126-pull} 128 138 160`);root.querySelector('.arrow-loaded')?.setAttribute('opacity',action&&action.elapsed>=action.windup?'0':'1');}
 if(root.dataset.type==='drone'){const k=.45+Math.abs(Math.cos(time*23))*.55;part('rotor-left',`translate(38 40) scale(${k} 1) translate(-38 -40)`);part('rotor-right',`translate(142 40) scale(${k} 1) translate(-142 -40)`);}
}
