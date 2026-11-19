// @ts-nocheck
// Pure skill text extracted unchanged from Preview11 crew-profile.mjs.
import {skillTuning} from "./skill-training";
import {mulDiv} from "./integer-math";
const effect=(value,type)=>'<strong class="skill-'+type+'">'+value+'</strong>';
const scaling=text=>'<span class="skill-scaling">（'+text+'）</span>';
export function crewSkill(id,level,stats){
 const sk=skillTuning(stats.skillRank),awake=level>=5,amount=(ratio,stat='atk')=>mulDiv(stats[stat],Math.round(ratio*100)).toLocaleString('zh-CN');
 const skills={
  orange:{description:'自身获得 '+effect(amount(sk.orangeSelf/100,'hp'),'shield')+scaling(''+sk.orangeSelf+'% 最大生命值')+' 护盾，其他队友获得各自 '+effect(''+sk.orangeTeam+'% 最大生命值','shield')+' 护盾。',passive:'受到的伤害降低 '+effect(sk.orangeGuard+'%','shield')+'。'},
  ink:{description:'三连击攻击生命值最低的敌人，合计造成 '+effect(sk.inkHit+'% 攻击力','damage')+' 物理伤害，获得 '+effect(''+sk.inkPen+' 点护甲穿透','armor')+'。'+(sk.inkRetarget?'目标死亡后，剩余攻击转向生命值最低的敌人。':''),passive:'暴击率提高 '+effect('15%','damage')+'。'},
  milk:{description:'为全体队友恢复 '+effect(amount(sk.milkHeal/100,'hp'),'heal')+scaling('奶盖最大生命值的 '+sk.milkHeal+'%')+' 生命值。',passive:'普攻额外回复 '+effect('10','energy')+' 能量。'},
  spark:{description:'对全体敌人造成 '+effect(sk.sparkHit+'% 攻击力','damage')+' 法术伤害，并灼烧目标 '+effect(sk.sparkDuration+' 回合','control')+'，每回合造成 '+effect(((awake?sk.sparkBurn:60)*(level>=40?1.2:1))+'% 攻击力','damage')+' 法术伤害。',passive:'每回合灼烧提高至 '+effect(sk.sparkBurn+'% 攻击力','damage')+'。'+(sk.sparkDetonate?'再次施加灼烧时，立即造成剩余灼烧伤害的 50%。':'')},
  mint:{description:'攻击一名敌人，造成 '+effect((sk.mintHit+(awake?30:0))+'% 攻击力','damage')+' 法术伤害，使其 '+effect('眩晕 1 回合','control')+'。优先攻击蓄力中的敌人，其次为治疗者。',passive:'主动技能伤害额外提高 '+effect('30% 攻击力','damage')+'。'},
  bolt:{description:'使敌方前排目标的当前护甲降低 '+effect(((awake?60:40)+sk.boltShred)+'%','armor')+'（下限为初始护甲的 20%），随后造成 '+effect(sk.boltHit+'% 攻击力','damage')+' 物理伤害。',passive:'技能护甲削减提高 '+effect('20%','armor')+'。'},
  pudding:{description:'获得 '+effect(amount(sk.puddingSelf/100,'hp'),'shield')+scaling(sk.puddingSelf+'% 最大生命值')+' 护盾。护盾达到 30% 最大生命值时蓄力，蓄力期间每次自身回合开始回复 50 能量；再获得 15% 最大生命值的护盾后，消耗当前护盾，对目标前排及其身后两名敌人造成 '+effect(sk.puddingShieldHit+'% 当前护盾值','damage')+' 的物理伤害。护盾破裂或受到控制时中断蓄力。冷却 2 回合，最快在开始蓄力的下一回合出拳。',passive:'护盾吸收伤害时也回复能量。'},
  star:{description:'为其他队友回复 '+effect(((level>=80?44:36)+sk.starEnergy)+' 点能量','energy')+'，并为全体队友恢复 '+effect(amount(sk.starHeal/100),'heal')+scaling(sk.starHeal+'% 攻击力')+' 生命值。'+(sk.starOverflow?'每溢出 10 点能量，转为目标最大生命值 2% 的护盾，上限 8%。':''),passive:'战斗开始时，额外获得 '+effect('40 点能量','energy')+'。'}
 };
 return skills[id];
}
