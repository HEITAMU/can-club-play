// Render the production score/voices for listening, never used by game playback.
// npm install web-audio-engine wav-encoder; node tools/render-music-preview.mjs
import {createRequire} from 'node:module';
import {mkdirSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {createGrooveTrack,createGrooveVoice} from '../music.mjs';
const require=createRequire(import.meta.url);
const renderer=process.env.FOURFOLD_RENDER_DEPS;
const engine=require(renderer?resolve(renderer,'web-audio-engine'):'web-audio-engine');
const encoder=require(renderer?resolve(renderer,'wav-encoder'):'wav-encoder');
const output=resolve(process.argv[2]||'music-output');mkdirSync(output,{recursive:true});
const track=createGrooveTrack(),sampleRate=44100;
const context=new engine.RenderingAudioContext({sampleRate,numberOfChannels:2,blockSize:128});
const voice=createGrooveVoice(context);
let maxVoices=0,index=0;
const events=[];
for(let cycle=0;cycle<2;cycle++)for(const event of track.events)events.push({...event,time:event.time+cycle*track.duration});
for(let time=0;time<track.duration*2+.05;time+=.1){
  while(index<events.length&&events[index].time<time+.1){const event=events[index++];voice.note(event,event.time);}
  maxVoices=Math.max(maxVoices,voice.nodes.size);context.processTo(time+.1);voice.reapVoices();
}
const data=context.exportAsAudioData();
const start=Math.round(track.duration*sampleRate),length=start;
const channelData=data.channelData.map(channel=>channel.slice(start,start+length));
const wav=await encoder.encode({sampleRate,channelData},{bitDepth:16});
writeFileSync(resolve(output,'fourfold-moon-turn-loop.wav'),Buffer.from(wav));
writeFileSync(resolve(output,'fourfold-moon-turn-score.json'),JSON.stringify(track,null,2));
let peak=0,squares=0;for(const channel of channelData)for(const value of channel){peak=Math.max(peak,Math.abs(value));squares+=value*value;}
const report={title:track.title,bpm:track.bpm,duration:track.duration,notes:track.events.length,maxVoices,peakDb:20*Math.log10(peak),rmsDb:10*Math.log10(squares/(length*2)),sampleRate,channels:2};
writeFileSync(resolve(output,'render-report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));voice.dispose();
