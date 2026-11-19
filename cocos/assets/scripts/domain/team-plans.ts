// @ts-nocheck
// Migrated verbatim from Preview11 source 28eb867; only module specifiers changed.
export const TEAM_PLANS=[
 {id:'ink',name:'飞鱼破阵',core:'ink',party:['orange','bolt','ink','milk','star'],order:['ink','orange','milk','bolt','star'],focus:'先养阿墨：信物、爪套与输出词条优先给他；橘座补生存，奶盖保续航，扳手破甲，星斑补能。',use:'推关与单体首领；破甲后刷装备。'},
 {id:'pudding',name:'护盾震街',core:'pudding',party:['pudding','orange','spark','milk','mint'],order:['pudding','orange','milk','mint','spark'],focus:'先养石墩：信物、生命与护盾装备优先给他；橘座补盾，奶盖续航，薄荷控场，火花清群怪。',use:'推关与材料群怪；护盾重拳打装备守卫。'}
];
export const teamPlan=s=>TEAM_PLANS.find(p=>p.id===s.teamPlan)||TEAM_PLANS[0];
export function applyTeamPlan(s,id){const p=TEAM_PLANS.find(p=>p.id===id);if(!p)return false;s.teamPlan=id;const owned=new Set(s.roster.owned);s.party=p.party.map(x=>owned.has(x)?x:null);if(!s.party.some(Boolean))s.party=['orange'];while(s.party.length&&!s.party.at(-1))s.party.pop();return true;}
