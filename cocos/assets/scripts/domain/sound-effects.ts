// @ts-nocheck
// Migrated verbatim from Preview11 source 28eb867; only module specifiers changed.
// Continuous sweeps and noise layers, never a sequence of musical reward notes.
const tone=(from,to,duration,gain,wave='sine')=>({type:'tone',from,to,duration,gain,wave});
const noise=(frequency,duration,gain,filter='lowpass')=>({type:'noise',frequency,duration,gain,filter});
export const SKILL_SOUNDS={
 orange:[tone(220,105,.2,.22,'triangle'),noise(800,.12,.13)],
 ink:[noise(2600,.18,.18,'bandpass'),tone(360,130,.12,.1)],
 milk:[tone(260,390,.42,.12),noise(1500,.35,.035,'bandpass')],
 spark:[noise(700,.38,.2),tone(145,62,.32,.22)],
 mint:[noise(3200,.23,.1,'bandpass'),tone(780,430,.22,.09,'triangle')],
 bolt:[tone(950,210,.16,.17,'triangle'),noise(2100,.1,.16,'bandpass')],
 pudding:[tone(110,35,.38,.38),noise(430,.28,.24)],
 star:[tone(180,360,.45,.13),noise(2300,.3,.04,'bandpass')]
};
export function soundRecipe(kind,{catId,shieldPunch=false}={}){
 if(kind==='win'||kind==='lose')return [];
 if(kind==='skill')return catId==='pudding'&&!shieldPunch?[tone(145,85,.2,.18),noise(550,.14,.1)]:SKILL_SOUNDS[catId]||[];
 return ({'nav-battle':[noise(3000,.055,.06,'highpass'),tone(200,130,.08,.045)],'nav-cats':[tone(340,450,.12,.045)],'nav-relics':[noise(850,.07,.055),tone(190,150,.07,.035)],'nav-map':[noise(1500,.09,.04,'bandpass'),tone(270,310,.1,.035)],click:[noise(1100,.035,.065)],coin:[noise(2200,.055,.07,'bandpass')],hit:[noise(1600,.07,.12),tone(95,55,.08,.13)],can:[noise(4500,.1,.12,'highpass'),tone(150,85,.12,.12)]})[kind]||[];
}
export function skillAudioEvents(events,heroes){
 return events.filter(e=>e.type==='skill').flatMap(e=>{const actor=heroes.find(h=>h.id===e.from);return actor?.catId?[{catId:actor.catId,shieldPunch:!!e.shieldPunch}]:[];});
}
