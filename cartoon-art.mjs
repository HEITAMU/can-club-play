// Original storybook art: flat gouache-like color shapes and warm, uneven ink lines.
// Each limb stays separate so the game can animate the illustration, not a static card.
const INK='#615145', PAPER='#FFF8E8';
const palette={
 orange:['#EDB774','#FFF0CB','#88AF99'],ink:['#869FA7','#F9ECD3','#DD9F91'],
 milk:['#F9EBD2','#FFF9E9','#E0A9AD'],spark:['#E5AA78','#FAE4C1','#88AEB6'],
 mint:['#CFDBBA','#FFF3D7','#91B6A1'],bolt:['#B2C8C5','#F8EDCF','#E4BE79'],
 pudding:['#E0C6A0','#FFF0CF','#CD9593'],star:['#D0BEDB','#FFF1DA','#AB9CBC']
};
const line=(d,color=INK,width=2.5)=>`<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;
const shape=(d,fill,stroke=INK,width=2.6)=>`<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${width}"/>`;
const oval=(x,y,rx,ry,fill,outline=false)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${outline?INK:'none'}" stroke-width="2.5"/>`;
const star=(x,y,r=10,color='#E8C477')=>shape(`M${x} ${y-r}q${r*.1} ${r*.4} ${r*.3} ${r*.68}l${r*.7} ${r*.09}-${r*.5} ${r*.48} ${r*.12} ${r*.72}-${r*.62}-${r*.34}-${r*.62} ${r*.34} ${r*.12}-${r*.72}-${r*.5}-${r*.48} ${r*.7}-${r*.09}z`,color,INK,1.8);
const paw=`${oval(0,3,6,5,'#8DAA91')}${oval(-7,-4,2.8,3.5,'#8DAA91')}${oval(0,-7,2.8,3.5,'#8DAA91')}${oval(7,-4,2.8,3.5,'#8DAA91')}`;
const fish=(x,y,color='#FFF1CC')=>`<g transform="translate(${x} ${y})">${shape('M-12 0q11-13 23 0-12 13-23 0l-7 6v-12z',color,INK,1.6)}${oval(5,-1,1.2,1.2,INK)}</g>`;
function weapon(id){return ({
 orange:`${shape('M124 145l-13 22q-2 6 4 8l16-26z','#B28C68')}<g transform="rotate(8 141 133)">${shape('M116 115q24-9 46 1l-2 31q-5 15-22 17-16-5-22-19z','#C8DAB9')}${line('M121 119q20-5 35 0m-36 28 7 8','#879E7D',1.8)}<g transform="translate(139 133)">${paw}</g></g>`,
 ink:`${line('M140 101Q172 130 141 162','#A47F5F',6)}${line('M140 103q21 25 2 56','#F1D7AA',2)}<path class="bow-string" d="M138 97L126 128 138 160" stroke="${INK}" stroke-width="1.6" fill="none"/><g class="arrow-loaded">${line('M105 128h57',INK,2.2)}${shape('M159 123l11 5-11 5z','#B5C9BC',INK,1.7)}${shape('M109 128l-9-6-2 5 10 4-10 3 4 4z','#D9A095',INK,1.5)}</g>`,
 milk:`${shape('M126 120q10-4 21 0v12l5 9v22q-16 7-31-1v-21l5-10z','#FFF8E8')}${shape('M125 117q12-2 23 0v7h-23z','#E7BAB6',INK,2)}${shape('M124 141q12-3 25 0v15q-13 3-25 0z','#E7BAB6',INK,1.5)}${shape('M136 145q-7-6-7 1 0 5 7 8 8-4 8-9-1-5-8 0z','#FFF8E8','none')}${line('M128 162h10','#D9CFBC',1.5)}`,
 spark:`${shape('M121 128q15-5 31 0l-1 35q-16 5-30-1z','#DDA091')}${shape('M121 126q16-4 31 0v5q-16 3-31 0z','#F2D8B5',INK,2)}${line('M125 159q12 3 23 0','#F7E5C9',2)}${shape('M132 151q-3-5 3-11l5 6q7-5 5 3-1 10-13 2z','#FFF0C8','none')}${line('M137 139l4-5','#889D78',2)}`,
 mint:`${line('M132 162l8-44','#8CA28C',5)}${shape('M139 103l18 15-7 24h-24l-7-22z','#BBD8D0')}${line('M138 111v23m-8-18 17 13m-17 0 17-13','#728C87',2)}${oval(126,112,2,2,PAPER)}${star(163,105,5,'#E4CF99')}`,
 bolt:`${shape('M128 155l14-43q-15-10-8-25l9 12 8-1 3-13q14 15-1 28l-13 45q-6 6-12-3z','#A2B8B9')}${line('M135 149l9-30','#DCE5D7',2)}${oval(136,150,2.4,2.4,INK)}`,
 pudding:`${shape('M113 118q20-6 43 0l-2 29q-4 22-20 31-19-10-23-31z','#D4A09A')}${shape('M118 124q17-4 33 0l-2 22q-4 16-15 24-12-8-16-24z','#F1D6A1',INK,1.6)}${fish(136,144)}${line('M121 127l5-1m18 35-5 4','#A58A60',1.4)}`,
 star:`${line('M122 165l22-54','#9F88A7',5)}${line('M126 155l6 3m-2-11 6 3','#F1D8AD',2)}${star(146,100,21,'#F1D99D')}${shape('M149 84q-13 3-13 13t13 14q-7-10 0-27z','#D3B87D','none')}${star(168,126,5,'#DEC7D1')}`
 })[id];}
function outfit(id,cloth){const apron=shape('M64 119q24-13 48 0l10 48q-29 14-61 0z',cloth,INK,2);
 return ({
 orange:`${shape('M61 113q28 10 53-1l-12 19-17-4-14 10-5-14z',cloth,INK,2)}${line('M74 122l8 5 9-3','#F0EBD0',1.8)}${oval(93,121,3.5,3.5,'#EFD39A',true)}`,
 ink:`${shape('M62 114q26 8 52-1l-3 13-45 1z',cloth,INK,2)}${shape('M68 121q-15-3-29 11l20 5 17-10z',cloth,INK,2)}${line('M47 131l7-2m13-7 9 2','#F3D3BD',1.5)}`,
 milk:`${shape('M69 119l10 11h21l9-12 8 49q-26 11-51 0z',cloth,INK,2)}${shape('M77 141h27l-1 18q-14 6-26-1z','#F9E4D2',INK,1.5)}${line('M90 145v9m-4-4h8','#BD8686',2.5)}`,
 spark:`${apron}${shape('M63 114l24 10 25-10-4 12-20 7-20-7z','#E8BB98',INK,1.7)}${shape('M76 141l26-1v18H77z','#E8E7C9',INK,1.6)}${line('M82 144l-1 6m15-7v6','#B3B89E',1.4)}`,
 mint:`${apron}${shape('M61 112q25 14 54 0l-11 15-15-5-15 6z','#B3CCAF',INK,1.8)}${line('M89 126v40','#DCE7C6',2)}${oval(89,131,3,3,'#EBD19C',true)}`,
 bolt:`${shape('M67 117l11 15h22l9-15 9 50q-28 12-55 0z',cloth,INK,2)}${shape('M77 140h26l-2 17H79z','#F5E5BB',INK,1.6)}${line('M83 143v10m-13-29 7 12m27 0 8-12','#AA9069',1.7)}${oval(75,137,2,2,INK)}${oval(104,137,2,2,INK)}`,
 pudding:`${apron}${shape('M60 114q28 10 55 0l-8 12q-17 6-38 0z','#F3D899',INK,1.7)}${oval(87,128,4,4,'#EBC579',true)}${line('M73 147l6 1m21 9 8-1','#E7C0AB',2)}`,
 star:`${apron}${shape('M64 114l24 13 26-13-6 13-19 8-19-8z','#D9C7D5',INK,1.7)}${line('M89 135v30','#E8DAE0',1.7)}${star(73,153,5,'#EFD9AA')}${star(108,155,3,'#EFD9AA')}`
 })[id];}
function hat(id){return ({
 milk:`${shape('M59 44l5-18q23-9 48 1l5 18z','#FFF9E9',INK,2.2)}${line('M65 40q24-5 46 1','#E3BAB4',2)}${shape('M88 29l3 6 6 1-5 4-6-3-5 3 1-7z','#D6A3A3','none')}`,
 spark:`${line('M47 51q40-15 82 0','#9C7C63',4)}${shape('M57 40q14-4 26 0v17q-14 4-25 0z','#BFA078',INK,2)}${shape('M94 40q15-3 27 2l-2 17q-12 2-25-2z','#BFA078',INK,2)}${shape('M62 43l17 1v10H62z','#BDD2CD','none')}${shape('M98 44l18 1-1 10-17-1z','#BDD2CD','none')}${line('M84 48h8',INK,2.5)}`,
 bolt:`${shape('M54 46q3-32 36-33 33 2 37 33z','#E8C67E')}${shape('M51 45q38-5 79 1l-1 8q-39-3-78-1z','#EDD49F',INK,2)}${line('M85 19l-2 22m13-21 2 21','#C1A268',2)}${line('M61 36l4-6m-3 10 3-3','#B69A6B',1.5)}`,
 star:`${shape('M57 48Q77 35 84 10q8-1 20 10l-3 13 22 18z','#B8A6C9')}${shape('M52 48q34-5 77 3l1 7q-41-3-80-1z','#CCB8D4',INK,2)}${shape('M87 20q-10 9 1 16 6 1 10-3-10 0-11-13z','#F0D6A1','none')}`
 })[id]||'';}
function faceDetails(id,fur,cream){const dark=INK;
 const patches={orange:shape('M77 40q1 13 6 16l4-17m10 1-1 16 6-2 6-11','#CB935A','none'),ink:shape('M49 65q9-17 24-18 4 23 0 39-10 9-27-1z','#708B96','none')+shape('M84 87q10-8 22-1l12 14q-25 15-47-1z',cream,'none'),milk:shape('M50 65q13-12 22-13l-2 17z','#E7D3BB','none'),spark:shape('M44 70l17 2-1 6-19 1m89-10-15 4 1 6 16-1','#C88E66','none'),mint:'',bolt:shape('M75 42l4 14 6 1 2-16m11 0-2 16 6-1 6-12','#8EA9AB','none'),pudding:shape('M44 71l18 3-1 5-19 2m89-10-17 4 1 5 18-2','#BCA07D','none'),star:shape('M93 44l7 6-6 6-6-7z','#B39AC4','none')};
 let eyes;
 if(id==='pudding') eyes=line('M67 80q5-6 10 0m27 0q6-6 11 0',dark,2.8);
 else if(id==='milk') eyes=oval(73,80,3.6,5.7,dark)+oval(110,80,3.6,5.7,dark)+line('M68 72l6-1m32 0 6 1',dark,1.6);
 else eyes=oval(73,80,4.4,6.2,dark)+oval(110,80,4.4,6.2,dark)+oval(74,77.5,1.25,1.6,PAPER)+oval(111,77.5,1.25,1.6,PAPER)+(id==='ink'?line('M67 69l8 1m31-1 8-2',dark,1.8):'');
 return `${patches[id]||''}${oval(62,94,8,4.8,'#E6B0A0')}${oval(122,93,8,4.8,'#E6B0A0')}${line('M58 93l2 3m4-3 2 3m52-4 2 3m4-4 2 3','#CF9687',.8)}<g class="eyes-open">${eyes}</g><g class="eyes-shut" style="display:none">${line('M68 80q4 5 9 0m28 0q5 5 10 0',dark,2.8)}</g>${shape('M88 91q5-3 9 0l-4 4z','#AA7E6D','none')}${line('M93 95v4m0-1q-5 7-9 1m9-1q5 7 10 0',dark,1.6)}${line('M44 86l9 3m-10 5h9m73-7 9-3m-8 10 9 1','#8D7460',1.2)}${line('M57 66l4-2m55 2 4 2','#9F856C',1.2)}`;
}
export function cartoonCat(id,portrait=false){const [fur,cream,cloth]=palette[id]||palette.orange;
 return `<svg class="cat-art motion-art cartoon-rig handdrawn-art" data-rig="hero" data-cat="${id}" data-frame="0" viewBox="${portrait?'20 4 146 155':'4 0 178 190'}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g stroke-linecap="round" stroke-linejoin="round">
 <g class="rig-tail">${line('M66 155Q32 170 31 149q-2-13 9-12',INK,15)}${line('M66 155Q32 170 31 149q-2-13 9-12',fur,10.5)}${line('M33 151l7-1m-2 11 4-5','#B89D79',1.6)}</g>
 <g class="rig-leg-left">${shape('M68 155l17 2-2 18q-2 10-15 9-15 0-12-7l9-7z',fur)}${line('M64 176v4m6-4v5','#A38971',1.3)}</g><g class="rig-leg-right">${shape('M99 155l16 1 3 16q15 0 12 8-1 6-16 5-11 0-13-9z',fur)}${line('M117 177v5m6-4v4','#A38971',1.3)}</g>
 <g class="rig-body"><g class="rig-arm-back">${shape('M64 118q-13-4-22 13-9 11-1 18 9 7 16-5l16-19z',fur)}${line('M43 140l4 4m-7 0 4 4','#A38971',1.3)}</g>
 ${shape('M65 110q23-11 46 2 13 20 10 48-1 16-31 17-29 0-33-13-4-30 8-54z',fur)}${shape('M77 127q15-9 26 1l6 32q-16 12-35 0z',cream,'none')}${outfit(id,cloth)}
 <g class="rig-head">${id==='mint'?shape('M42 78q-10-48 39-61 40-2 56 42l-1 41-13 18-69-3z','#A6C4AB'):''}
 ${shape('M45 65Q33 45 40 23q18 0 36 18 16-5 30 0 16-17 31-18 5 24-6 43 15 13 9 32-4 10-14 12l3 5-12 1q-13 10-29 8-22 1-37-11l-10-2 5-5q-17-16-1-41z',fur)}
 ${shape('M46 32q-2 16 4 24l16-12z','#DDA793','none')}${shape('M128 33l-13 13 13 11q4-12 0-24z','#DDA793','none')}
 ${id!=='ink'?shape('M75 93q10-8 18-3 12-5 22 4 2 14-20 18-19-1-20-19z',cream,'none'):''}
 ${line('M76 43l7-3 5 3 8-3','#A28A70',1.4)}${faceDetails(id,fur,cream)}${hat(id)}</g>
 <g class="rig-arm-front">${shape('M111 119q13-3 22 14 7 9-1 15-10 7-17-5l-10-15z',fur)}${line('M123 140l4 3m-1-7 4 3','#A38971',1.3)}<g class="rig-weapon">${weapon(id)}</g></g></g></g></svg>`;
}
function enemyFace(type){let e=oval(72,83,4,5.8,INK)+oval(109,83,4,5.8,INK);
 if(type==='dust'||type==='mop')e=line('M67 82q5-7 11 0m26 0q6-7 11 0',INK,2.6);
 if(type==='clock')e=oval(72,83,4.8,5.8,INK)+oval(109,83,4.8,5.8,INK)+line('M68 73l8-1m29 0 8 1',INK,1.6);
 const mouth=type==='bag'?oval(92,105,4,5,'#9A7964'):line('M85 103q7 7 14 0',INK,2.2);
 return `<g class="eyes-open">${e}</g><g class="eyes-shut" style="display:none">${line('M68 81l8 4-8 3m44-7-8 4 8 3',INK,2.5)}</g>${oval(59,98,6.5,3.5,'#D8A898')}${oval(122,98,6.5,3.5,'#D8A898')}${mouth}`;
}
export function cartoonEnemy(type,boss=false){if(type==='boxBoss'){type='box';boss=true;}
 const colors={dust:'#C7D4B4',box:'#E6C999',mop:'#D4C2D8',battery:'#B7CDB8',bag:'#E9D7B4',drone:'#BDD0CE',vacuum:'#C6BCD4',fridge:'#C2D9D3',sign:'#DDBFCB',clock:'#EBD29C',vendor:'#BFCED2'},c=colors[type]||'#C7D4B4';
 const shapes={
 dust:`${shape('M45 63q-9-15 6-24 10-9 23-2 13-15 28-5 20-8 29 9 19 1 14 23 18 11 7 28 10 15-7 29-5 21-26 16-14 13-30 3-18 8-29-7-23 1-23-21-18-16-5-34-2-9 13-15z',c)}${shape('M86 38q-23-5-20-24 20 2 20 24m3-1q0-23 17-24 4 18-17 24z','#A9BF8F',INK,2)}${line('M48 66l5-3m75 51-4 6m-61 2 5 3','#92AC86',1.5)}`,
 box:`${shape('M45 51l92-2 2 91q-43 10-93 0z',c)}${shape('M45 52l14-20 30 8 36-8 13 20-24 13-23-13-23 14z','#F1DCB3')}${shape('M85 119h12v24H85z','#CDAE7D','none')}${line('M51 124l13 1m-11 5 9 1m60-12 9-1','#B39870',1.5)}${fish(117,123,'#EEDCB6')}`,
 mop:`${line('M89 57l2-42','#8B725A',9)}${line('M90 55l1-37','#DCC295',4)}${shape('M51 59q39-24 76 0l14 78q-8 8-14-1-5 17-16 6-9 18-21 4-15 14-24 0-13 11-17-5-12 7-17-1z',c)}${line('M54 108l-6 27m25-20-3 25m36-25 5 24m12-31 7 22','#EEE0E5',4)}${shape('M88 58l-16-9-3 15 19-6 18-7 1 14z','#BE99AD',INK,1.7)}`,
 battery:`${shape('M78 29q11-3 25 0v15H78z','#9CB3A0')}${shape('M55 39q35-4 73 0l2 100q-1 12-39 12-39-1-40-14z',c)}${line('M56 51q34-3 67 0m-67 84q34 4 68 1','#DCE5CC',6)}${shape('M93 115l-14 17 12-1-3 14 17-22H95l6-8z','#F7E0A9',INK,1.5)}`,
 bag:`${shape('M49 48l15-7 14 7 15-6 13 7 20-7 10 104q-48 9-91-1z',c)}${line('M66 44V30q0-19 22-19t22 20v13','#9A8062',5)}${line('M55 65l5 17-8 51m72-70-5 18 8 52','#C7B08D',2)}${fish(92,127,'#F2E4C4')}`,
 drone:`${line('M55 67L39 45m85 22 18-22','#829A96',5)}<g class="rotor-left">${shape('M12 39q24-4 53 0v5H12z','#A4BAB1',INK,2)}</g><g class="rotor-right">${shape('M116 39q24-4 52 0v5h-52z','#A4BAB1',INK,2)}</g>${shape('M51 66q36-17 76 0l10 45-20 25-50 1-24-24z',c)}${shape('M58 73q30-5 65 0v27q-31 5-65 0z','#EAF0DE',INK,1.6)}${shape('M84 117l9-7 9 7-9 11z','#E8CD91',INK,1.5)}`,
 vacuum:`${shape('M53 48q36-6 75 1l10 90q-43 13-92 0z',c)}${shape('M52 46q35-5 77 0v11q-39-5-77 0z','#DED1DF',INK,2)}${line('M73 40V28q18-5 35 0v12','#8E7F99',6)}${shape('M70 119q17-4 39 0v17q-20 4-39 0z','#EED9AF',INK,1.6)}${line('M77 125h25m-25 5h25','#A39075',1.5)}`,
 fridge:`${shape('M51 35q40-5 81 0l1 112q-38 9-82 0z',c)}${line('M52 70q40 2 79 0m-12-20v10m0 26v16','#8AA59A',3)}${line('M76 117v22m-9-17 18 11m-18 0 18-11','#F7F3DC',3)}${shape('M97 119l14-3 4 14-16 3z','#F1D7B5',INK,1)}`,
 sign:`${shape('M38 44q54-6 108 0v102q-56 6-108 0z','#CBA6BB')}${shape('M47 53q43-4 90 0v85q-45 4-90 0z',c,INK,1.6)}${line('M60 63h62m-62 65h62','#F7E5B9',3)}${oval(42,49,2,2,PAPER)}${oval(141,49,2,2,PAPER)}${oval(42,142,2,2,PAPER)}${oval(141,142,2,2,PAPER)}`,
 clock:`${shape('M37 92q0-51 54-53 55 1 56 54-2 55-56 55-53-1-54-56z',c)}${shape('M47 93q1-43 44-44 45 1 45 44-1 45-45 45-44-1-44-45z','#FFF3D3',INK,1.8)}${line('M91 55v9m-39 30h8m64 0h8m-41 32v7','#BBA17A',2)}${line('M91 94v18l14 6','#9D8363',2.5)}${shape('M37 36q12-13 28 0l-7 10-17-1z','#E4BF88')}${shape('M119 36q14-13 27 0l-4 10-16-1z','#E4BF88')}`,
 vendor:`${shape('M47 34q41-5 88 0v116q-44 6-88 0z',c)}${shape('M57 43q32-2 62 0v26H57z','#F5EBD5',INK,1.6)}${shape('M63 50h12v13H63z','#D7AAA0',INK,1)}${shape('M83 49h12v14H83z','#E2CA96',INK,1)}${shape('M102 50h11v13h-11z','#A7BEA4',INK,1)}${shape('M65 125h49v16H65z','#8EA7A8',INK,1.5)}${oval(126,86,2,2,'#EBD4A3',true)}${oval(126,97,2,2,'#EBD4A3',true)}`
 };
 return `<svg class="enemy-art motion-art cartoon-rig handdrawn-art" data-rig="enemy" data-type="${type}" data-frame="0" viewBox="0 0 180 190" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g stroke-linecap="round" stroke-linejoin="round"><g class="rig-leg-left">${shape('M67 141l15 2-3 25q-1 12-20 11-15 0-8-8l11-4z',c)}${line('M57 172v4m6-4v4','#A08E73',1.3)}</g><g class="rig-leg-right">${shape('M103 142l16-1 4 26q14 2 11 9-3 6-26 3z',c)}${line('M121 172v4m6-4v4','#A08E73',1.3)}</g><g class="rig-body"><g class="rig-arm-back">${shape('M52 86q-19 1-25 24-2 11 9 12l22-24z',c)}</g>${shapes[type]||shapes.dust}<g class="rig-head">${enemyFace(type)}${boss?shape('M67 34l-6-23 17 12L91 4l13 19 18-12-6 24z','#E8C783',INK,2)+oval(91,25,2.5,2.5,'#C89F83'):''}</g><g class="rig-arm-front">${type==='vacuum'?line('M127 91q29-6 29 19 0 13-10 26','#9A8AA8',10)+line('M127 91q29-6 29 19 0 13-10 26',INK,1.5)+shape('M134 132l27 8-6 17-26-9z','#DED1DF'):shape('M127 88q20 2 25 21 4 11-8 15-11 0-17-15l-7-13z',c)}</g></g></g></svg>`;
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
