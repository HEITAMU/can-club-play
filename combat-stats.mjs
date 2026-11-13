import {integer,mulDiv} from './integer-math.mjs?v=0.25.1';
// Defense and penetration are ratings, not damage-reduction percentages.
// Physical and magic damage have independent defenses and flat penetration.
export const HERO_COMBAT={
 orange:{armor:30,magicResist:22,armorPen:0,magicPen:0,normalDamageType:'physical',skillDamageType:'physical'},
 ink:{armor:12,magicResist:12,armorPen:12,magicPen:0,normalDamageType:'physical',skillDamageType:'physical'},
 milk:{armor:10,magicResist:22,armorPen:0,magicPen:4,normalDamageType:'magic',skillDamageType:'magic'},
 spark:{armor:8,magicResist:16,armorPen:0,magicPen:14,normalDamageType:'magic',skillDamageType:'magic'},
 mint:{armor:12,magicResist:20,armorPen:0,magicPen:10,normalDamageType:'magic',skillDamageType:'magic'},
 bolt:{armor:20,magicResist:12,armorPen:18,magicPen:0,normalDamageType:'physical',skillDamageType:'physical'},
 pudding:{armor:34,magicResist:26,armorPen:6,magicPen:0,normalDamageType:'physical',skillDamageType:'physical'},
 star:{armor:10,magicResist:24,armorPen:0,magicPen:12,normalDamageType:'magic',skillDamageType:'magic'}
};
const ENEMY_COMBAT={
 dust:[0,8,'physical'],box:[54,12,'physical'],mop:[12,18,'physical'],
 battery:[10,42,'magic'],bag:[8,26,'physical'],drone:[18,20,'magic'],
 vacuum:[18,12,'physical'],fridge:[18,44,'magic'],sign:[16,28,'magic'],
 clock:[28,24,'physical'],vendor:[24,36,'magic']
};
export function heroCombatStats(id,level=1){
 const base=HERO_COMBAT[id],growth=Math.max(0,level-1);
 return {...base,armor:Math.round(base.armor+growth*.45),magicResist:Math.round(base.magicResist+growth*.4),
  armorPen:base.armorPen?Math.round(base.armorPen+growth*.18):0,
  magicPen:base.magicPen?Math.round(base.magicPen+growth*.18):0};
}
export function enemyCombatStats(type,stage=1,boss=false){
 const [baseArmor,baseMR,damageType]=ENEMY_COMBAT[type]||ENEMY_COMBAT.dust;
 const growth=Math.min(5,Math.floor((stage-1)/20)),armor=boss&&type==='box'?34:baseArmor,pen=growth*2;
 return {armor:armor+growth*4,magicResist:baseMR+growth*4,armorPen:damageType==='physical'?pen:0,magicPen:damageType==='magic'?pen:0,normalDamageType:damageType,skillDamageType:damageType};
}
export function effectiveDefense(target,source,type='physical',bonusPen=0){
 const defense=type==='magic'?'magicResist':'armor',penetration=type==='magic'?'magicPen':'armorPen';
 return Math.max(0,(target?.[defense]||0)-Math.max(0,source?.[penetration]||0)-Math.max(0,bonusPen));
}
export function mitigatedDamage(raw,target,source,type='physical',bonusPen=0){
 return mulDiv(Math.max(0,integer(raw)),100,100+integer(effectiveDefense(target,source,type,bonusPen)));
}
