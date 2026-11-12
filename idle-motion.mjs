// Readable at the 48px battle size. Every idle keeps the painted foot pivot fixed.
export const IDLE_PROFILES={
 orange:{period:2.55,breath:.047,sway:2.4,lean:.5,phase:.2,label:'稳稳呼吸 · 锅盖轻摇'},
 ink:{period:2.15,breath:.042,sway:3.0,lean:.65,phase:1.3,label:'轻轻蓄势 · 侧身张望'},
 milk:{period:2.75,breath:.055,sway:2.3,lean:.4,phase:2.4,label:'轻柔呼吸 · 放松摇摆'},
 spark:{period:1.95,breath:.047,sway:2.8,lean:.6,phase:3.1,label:'身体轻晃 · 火苗闪动',accent:{x:75,y:48,type:'ember'}},
 mint:{period:2.85,breath:.043,sway:2.35,lean:.45,phase:4.3,label:'缓缓呼吸 · 冰晶微闪',accent:{x:81,y:24,type:'crystal'}},
 bolt:{period:2.3,breath:.054,sway:3.1,lean:.6,phase:5.1,label:'舒展身体 · 扳手轻晃'},
 pudding:{period:2.9,breath:.061,sway:2.2,lean:.4,phase:1.8,label:'慢慢呼吸 · 重心轻移'},
 star:{period:2.65,breath:.046,sway:2.7,lean:.5,phase:3.7,label:'轻轻摇摆 · 星光闪烁',accent:{x:80,y:35,type:'star'}}
};
export function idlePose(id,time=0){
 const p=IDLE_PROFILES[id]||{period:3.6,breath:.012,sway:.5,lean:.2,phase:0},t=time*2*Math.PI/p.period+p.phase,b=Math.sin(t),s=Math.sin(t+p.phase);
 return {angle:s*p.sway+Math.sin(t*.23)*p.lean,sx:1-b*p.breath*.3,sy:1+b*p.breath,y:0,accent:Math.max(0,Math.sin(t*1.7+p.phase))**3};
}
export function idleLabel(id){return IDLE_PROFILES[id]?.label||'安静呼吸';}
