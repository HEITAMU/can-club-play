/// <reference types="./@types/pal/audio" />
import { AudioPlayer, OneShotAudio } from 'pal/audio';
type ManagedAudio = AudioPlayer | OneShotAudio;
/** @mangle */
export declare class AudioManager {
    private _oneShotAudioInfoList;
    private _audioPlayerInfoList;
    constructor();
    private _findIndex;
    private _tryAddPlaying;
    addPlaying(audio: ManagedAudio): void;
    private _tryRemovePlaying;
    removePlaying(audio: ManagedAudio): void;
    discardOnePlayingIfNeeded(): void;
    pause(): void;
    resume(): void;
}
export declare const audioManager: AudioManager;
export {};
