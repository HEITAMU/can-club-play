// Pack-only profiles. Combat formulas and progression remain in the reviewed proposal.
export const ORDER=['orange','ink','milk','spark','mint','bolt','pudding','star','night','inkstone'];
export const BASES={
 compact:{body:.55,head:.58,chin:.51,near:[.34,.54],far:[.66,.53],tail:.30},
 broad:{body:.56,head:.60,chin:.50,near:[.31,.54],far:[.69,.54],tail:.29},
 tall:{body:.57,head:.55,chin:.50,near:[.35,.50],far:[.65,.51],tail:.32}
};
const arm=(h,anchor)=>({h,anchor});
export const CHARACTERS={
 orange:{name:'橘座',base:'broad',personality:'嘴硬心软的护卫大哥',color:'#d7a25a',delivery:'melee',weapon:'farLeftArm',shield:true,near:arm(.34,[.41,.08]),far:arm(.49,[.16,.18]),reach:.40,tempo:1.08,behaviors:['ward','guard','absorb']},
 ink:{name:'阿墨',base:'tall',personality:'寡言、耐心，出手准确',color:'#9bad7b',delivery:'ranged',weapon:'farLeftArm',bow:true,near:arm(.30,[.25,.08]),far:arm(.56,[.09,.38]),reach:.40,tempo:1,behaviors:['mark','volley','pursuit']},
 milk:{name:'奶盖',base:'compact',personality:'温柔细心，照顾每位伙伴',color:'#a5cdb6',delivery:'ranged',weapon:'nearRightArm',near:arm(.29,[.21,.10]),far:arm(.23,[.13,.16]),reach:.33,tempo:1.12,behaviors:['heal','healTeam','foam']},
 spark:{name:'火花',base:'compact',personality:'急性子、好奇又爱逞强',color:'#ed995d',delivery:'ranged',weapon:'nearRightArm',lantern:true,near:arm(.39,[.43,.07]),far:arm(.24,[.16,.12]),reach:.32,tempo:.90,behaviors:['burn','flare','embers']},
 mint:{name:'薄荷',base:'tall',personality:'冷静克制，习惯先观察',color:'#91c4cf',delivery:'ranged',weapon:'farLeftArm',near:arm(.30,[.32,.08]),far:arm(.53,[.10,.48]),reach:.46,tempo:1.08,behaviors:['chill','freeze','mist']},
 bolt:{name:'螺丝',base:'compact',personality:'爱说话、点子多，手比嘴快',color:'#b6bd87',delivery:'melee',weapon:'nearRightArm',near:arm(.36,[.23,.09]),far:arm(.28,[.24,.08]),reach:.38,tempo:.91,behaviors:['mark','break','precision']},
 pudding:{name:'玄岳',base:'broad',personality:'沉默沉稳，蓄势后重拳破阵',color:'#e3b66b',delivery:'melee',weapon:'nearRightArm',head:.70,chin:.66,body:.54,near:arm(.43,[.27,.10]),far:arm(.35,[.26,.10]),reach:.36,tempo:1.26,behaviors:['selfShield','shieldPunch','returnEnergy']},
 star:{name:'星斑',base:'compact',personality:'腼腆爱幻想，认真时很专注',color:'#bd9dc9',delivery:'ranged',weapon:'nearRightArm',head:.68,near:arm(.34,[.15,.12]),far:arm(.26,[.14,.10]),reach:.36,tempo:1.13,behaviors:['energy','constellation','echo','bond']},
 night:{name:'夜航',base:'tall',personality:'成熟松弛，关键时刻干净果断',color:'#cf8b69',delivery:'melee',weapon:'nearRightArm',near:arm(.46,[.16,.08]),far:arm(.31,[.27,.08]),reach:.50,tempo:.81,behaviors:['feather','multicut','shadow','stealth']},
 inkstone:{name:'砚台',base:'broad',personality:'不善言辞，沉稳而有分量',color:'#a6b0bb',delivery:'melee',weapon:'nearRightArm',near:arm(.38,[.43,.08]),far:arm(.33,[.30,.08]),reach:.33,tempo:1.20,behaviors:['weaken','inkBurst','defer']}
};
export const PASSIVES=new Set(['absorb','pursuit','foam','embers','mist','precision','echo','bond','shadow','stealth','defer','returnEnergy']);
export const SUPPORT=new Set(['ward','guard','absorb','heal','healTeam','foam','convert','selfShield','shieldPunch','returnEnergy','energy','constellation','echo','bond','shadow','stealth','defer','returnEnergy']);
export function behavior(id,index){return index<0?'normal':CHARACTERS[id].behaviors[index];}
