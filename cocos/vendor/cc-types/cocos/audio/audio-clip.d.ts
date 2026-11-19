/// <reference types="./@types/pal/audio" />
import { AudioPlayer } from 'pal/audio';
import { Asset } from '../asset/assets/asset';
import { AudioState, AudioType } from '../../pal/audio/type';
export interface AudioMeta {
    player: AudioPlayer | null;
    url: string;
    type: AudioType;
    duration: number;
}
/**
 * @en
 * The audio clip asset.
 * @zh
 * 音频片段资源。
 */
export declare class AudioClip extends Asset {
    static AudioType: typeof AudioType;
    /**
     * @engineInternal
     */
    set duration(v: number);
    protected _duration: number;
    protected _loadMode: AudioType;
    protected _meta: AudioMeta | null;
    private _player;
    constructor(name?: string);
    destroy(): boolean;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    set _nativeAsset(meta: AudioMeta | null);
    get _nativeAsset(): AudioMeta | null;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    get _nativeDep(): {
        uuid: string;
        audioLoadMode: AudioType;
        ext: string;
        __isNative__: boolean;
    };
    get loadMode(): AudioType;
    validate(): boolean;
    getDuration(): number;
    /**
     * @deprecated since v3.1.0, please use AudioSource.prototype.state instead.
     */
    get state(): AudioState;
    /**
     * @deprecated since v3.1.0, please use AudioSource.prototype.getCurrentTime() instead.
     */
    getCurrentTime(): number;
    /**
     * @deprecated since v3.1.0, please use AudioSource.prototype.getVolume() instead.
     */
    getVolume(): number;
    /**
     * @deprecated since v3.1.0, please use AudioSource.prototype.getLoop() instead.
     */
    getLoop(): boolean;
    /**
     * @deprecated since v3.1.0, please use AudioSource.prototype.setCurrentTime() instead.
     */
    setCurrentTime(time: number): void;
    /**
     * @deprecated since v3.1.0, please use AudioSource.prototype.setVolume() instead.
     */
    setVolume(volume: number): void;
    /**
     * @deprecated since v3.1.0, please use AudioSource.prototype.setLoop() instead.
     */
    setLoop(loop: boolean): void;
    /**
     * @deprecated since v3.1.0, please use AudioSource.prototype.play() instead.
     */
    play(): void;
    /**
     * @deprecated since v3.1.0, please use AudioSource.prototype.pause() instead.
     */
    pause(): void;
    /**
     * @deprecated since v3.1.0, please use AudioSource.prototype.stop() instead.
     */
    stop(): void;
    /**
     * @deprecated since v3.1.0, please use AudioSource.prototype.playOneShot() instead.
     */
    playOneShot(volume?: number): void;
}
