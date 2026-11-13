import fs from 'node:fs/promises';import path from 'node:path';
import {harness,root} from '../wechat/tests/harness.mjs';import * as G from '../core.mjs';
const out=path.join(root,'docs/review/street-growth');await fs.mkdir(out,{recursive:true});
const state=G.initialState();Object.assign(state,{onboarded:true,highest:600,runCleared:60,stage:61});state.roster.shards.milk=18;
const h=await harness({state}),a=h.app;
async function shot(name){a.render();await fs.writeFile(path.join(out,name+'.png'),h.canvas.toBuffer('image/png'));}
a.openStreet('recruit','milk');await shot('recruit-top');a.scroll=330;await shot('recruit-action');
a.openStreet('materials','escort');await shot('materials');
a.openStreet('hunt','market');await shot('hunt');
a.state.activities.cleared['hard:coldstore']=2;a.openStreet('hard','coldstore');a.streetView.tier=3;await shot('hard');
a.change('cats');a.selected='orange';a.scroll=900;await shot('growth');
h.resize(320,568);a.openStreet('materials','escort');a.scroll=210;await shot('small-materials');
h.stop();console.log(out);
