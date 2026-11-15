// One physical scale for each companion, shared by every full-body appearance.
export const companionScale=id=>id==='pudding'?1.22:1;
export const companionSize=(unit,id)=>unit*companionScale(id);
export const battleUnitSize=(width,height)=>Math.max(36,Math.min(65,height*.202,width*.162));

// Head crops in the original portrait coordinates; hats/ears stay inside the tile.
export const HEAD_CROPS={
 orange:[168,54,294],ink:[160,38,264],milk:[169,84,246],
 spark:[170,60,260],mint:[175,95,260],bolt:[180,65,284],
 pudding:[164,70,250],star:[100,30,320]
};
