// Small, grounded idle performances; each cat has a separate rhythm and weight.
export const IDLE_PROFILES={
 orange:{period:3.8,breath:.018,sway:.65,lean:.45,phase:.2,label:'稳稳呼吸 · 锅盖轻摇'},
 ink:{period:3.1,breath:.016,sway:1.15,lean:.9,phase:1.3,label:'轻轻蓄势 · 侧身张望'},
 milk:{period:4.1,breath:.021,sway:.85,lean:.35,phase:2.4,label:'轻柔呼吸 · 放松摇摆'},
 spark:{period:2.9,breath:.018,sway:1.05,lean:.7,phase:3.1,label:'身体轻晃 · 火苗闪动',accent:{x:71,y:26,type:'ember'}},
 mint:{period:4.6,breath:.016,sway:.72,lean:.5,phase:4.3,label:'缓缓呼吸 · 冰晶微闪',accent:{x:79,y:15,type:'crystal'}},
 bolt:{period:3.6,breath:.021,sway:1.2,lean:.7,phase:5.1,label:'舒展身体 · 扳手轻晃'},
 pudding:{period:4.4,breath:.026,sway:.6,lean:.35,phase:1.8,label:'慢慢呼吸 · 重心轻移'},
 star:{period:4.0,breath:.017,sway:.95,lean:.5,phase:3.7,label:'轻轻摇摆 · 星光闪烁',accent:{x:78,y:45,type:'star'}}
};
export function idlePose(id,time=0){
 const p=IDLE_PROFILES[id]||{period:3.6,breath:.012,sway:.5,lean:.2,phase:0},t=time*2*Math.PI/p.period+p.phase,b=Math.sin(t),s=Math.sin(t*.57+p.phase);
 return {angle:s*p.sway+Math.sin(t*.23)*p.lean,sx:1-b*p.breath*.3,sy:1+b*p.breath,y:0,accent:Math.max(0,Math.sin(t*1.7+p.phase))**3};
}
export function idleLabel(id){return IDLE_PROFILES[id]?.label||'安静呼吸';}
