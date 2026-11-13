// Keep the browser cache and offline renderer on the same asset manifest.
export function assetFiles(art) {
 if(art.fullBody)return [art.atlas,art.fullBody.atlas];
 return [...new Set([art.atlas, ...Object.values(art.partAtlases || {}),
  ...Object.values(art.faceAtlases || {}), ...(art.fullBody ? [art.fullBody.atlas] : [])])];
}
