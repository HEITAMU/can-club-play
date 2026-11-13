import {addGear,equipGear} from '../../equipment.mjs';
import fs from "node:fs/promises";
import path from "node:path";
import { harness, root } from "./harness.mjs";
import * as G from "../../core.mjs";
const { initialState } = G;
const out = path.join(root, "qa/wechat-review");
await fs.mkdir(out, { recursive: true });
const state = {
  ...initialState(),
  onboarded: true,
  highest: 60,
  roster:{...G.initialState().roster,owned:G.CATS.map(c=>c.id)},
  runCleared: 45,
  stage: 46,
  gold: 32000,
  party: ["orange", "ink", "milk", "mint", "bolt"],
  levels: {
    orange: 28,
    ink: 50,
    milk: 13,
    spark: 1,
    mint: 1,
    bolt: 1,
    pudding: 1,
    star: 1,
  },
};
const h = await harness({ state }),
  a = h.app;
async function shot(name) {
  a.render();
  await fs.writeFile(
    path.join(out, name + ".png"),
    h.canvas.toBuffer("image/png"),
  );
}
await shot("battle");
a.running = true;
h.tick(0.1);
a.can();
for (let i = 0; i < 5; i++) h.tick(0.1);
await shot("can-open");
for (let i = 0; i < 5; i++) h.tick(0.1);
await shot("can-hit");
a.running = false;
a.battle.heroes[4].hp = 0;
await shot("incapacitated");
a.change("cats");
a.selected = "milk";
await shot("crew");
a.scroll = 270;
await shot("skills");
a.mode = "formation";
a.scroll = 0;
await shot("formation");
a.change("map");
await shot("map");
a.mapPlace="stall";await shot("stall-business");a.mapPlace="arena";await shot("weekly-board");a.mapPlace="journal";await shot("daily-journal");a.scroll=720;await shot("growth-road");a.mapPlace=null;
a.change("relics");
for(const slot of ['collar','brace']){const e=addGear(a.state,60,{slot,set:'guard',quality:2}).item;equipGear(a.state,e.id,'orange',['orange']);}
a.state.inventory.materials.scrap=360;a.state.inventory.materials.essence=12;
a.bagTab='equipment';a.scroll=0;await shot('equipment');
a.bagTab='materials';a.scroll=0;await shot('materials');
a.bagTab='equipment';a.bagDetail=a.state.inventory.equipped.orange.rune;a.scroll=0;await shot('trick-card');
a.bagDetail=a.state.inventory.equipped.orange.collar;a.scroll=0;await shot('gear-detail');
a.bagDetail=null;a.scroll=650;await shot('gear-list');
a.scroll=0;await shot('relics');
a.modal = { type: "settings" };
await shot("settings");
a.modal = null;
h.resize(320, 568);
a.change("battle");
await shot("small");
h.resize(430, 932);
a.change("cats");
a.mode = "profile";
a.scroll = 0;
await shot("large");
console.log(out);
