// Quality ascension uses personal tokens and shared training resources, without
// sacrificing another companion. Costs fit this game's three daily contracts.
export const ASCENSION_NAMES=['精英','精英+','史诗','史诗+','传说','传说+','神话','神话+','巅峰','巅峰+'];
export const ASCENSION_POWER=[100,240,540,1200,2250,3800,6000,8200,10000,12000];
export const ASCENSION_COSTS=[{shards:10,notes:0},{shards:15,notes:15},{shards:20,notes:0},{shards:25,notes:30},{shards:30,notes:0},{shards:40,notes:60},{shards:50,notes:0},{shards:0,notes:150},{shards:60,notes:100}];
export const ascensionPower=rank=>ASCENSION_POWER[Math.max(0,Math.min(9,Math.floor(rank||0)))];
export const ascensionFromPower=value=>ASCENSION_POWER.findIndex(p=>p>=value)<0?9:Math.max(0,ASCENSION_POWER.findIndex(p=>p>=value));
