import {skillTuning,SKILL_STUDY} from './skill-training.mjs';
export const TALENTS={
 orange:[['护住小的','释放技能时，生命比例最低的队友额外获得 8% 最大生命护盾。'],['分你一口气','释放技能时，为其他队友回复 12 能量。']],
 ink:[['追击弱点','对生命低于 40% 的目标造成的直接伤害提高 25%。'],['连胜手感','击倒敌人后回复 35 能量。']],
 milk:[['留一点温热','治疗溢出量的 30% 转为护盾，单次不超过目标最大生命的 8%。'],['洗去疲惫','释放技能时清除全体队友的灼烧。']],
 spark:[['火候正好','自身灼烧伤害提高 20%。'],['余烬封锁','技能使敌人 4 秒内受到的治疗降低 50%。']],
 mint:[['趁凉动手','薄荷存活时，全队对眩晕目标的直接伤害提高 15%。'],['冷气入骨','技能命中后永久降低目标当前魔抗的 20%。']],
 bolt:[['松松螺帽','普攻降低目标 2 点护甲（下限为初始护甲的 40%）。'],['拆得顺手','扳手存活时，全队对护甲低于初始值 50% 的敌人造成的物理伤害提高 15%。']],
 pudding:[['扎稳下盘','有护盾时，受到的伤害降低 10%。'],['凝劲','自身获得的护盾提高 20%。']],
 star:[['星光分给你','开场给其他队友额外回复 12 能量。'],['群星回应','技能额外为其他队友回复 8 能量。']]
};
export const talentCards=(id,level,rank=0)=>{const t=skillTuning(rank);return TALENTS[id].map(([name,desc],i)=>({name,desc:id==='milk'&&i===0?`溢出治疗的 ${t.milkOverflow}% 转为护盾，单次上限为目标最大生命值的 ${t.milkOverflowCap}%。`:id==='mint'&&i===0?`薄荷存活时，全队对眩晕目标的直接伤害提高 ${t.mintVulnerable}%。`:id==='bolt'&&i===0?`普攻降低目标 ${t.boltNormal} 点护甲，下限为初始护甲的 ${t.boltFloor}%。`:desc,level:[40,80][i],active:level>=[40,80][i],rank:SKILL_STUDY[id].index===i+2?rank+1:1,trainable:SKILL_STUDY[id].index===i+2}));};
