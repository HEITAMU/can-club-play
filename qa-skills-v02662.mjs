// Isolated review; never reads or writes player saves.
import {CATS,initialState} from './core.mjs';import {crewProfileHTML} from './crew-profile.mjs';
const s=initialState();s.roster.owned=CATS.map(c=>c.id);for(const c of CATS)s.levels[c.id]=80;let selected='pudding';
const draw=()=>document.querySelector('#preview').innerHTML=crewProfileHTML(s,selected);
document.querySelector('#cats').innerHTML=CATS.map(c=>`<button data-cat="${c.id}">${c.name}</button>`).join('');document.querySelector('#ranks').innerHTML=[0,1,2,3].map(r=>`<button data-rank="${r}">技能 ${r+1} 级</button>`).join('');
for(const b of document.querySelectorAll('[data-cat]'))b.onclick=()=>{selected=b.dataset.cat;draw();};for(const b of document.querySelectorAll('[data-rank]'))b.onclick=()=>{s.breakthroughs[selected]=Number(b.dataset.rank);draw();};draw();
