/// <reference types="./@types/pal/audio" />
import { AudioPlayer } from 'pal/audio';
import { AudioPCMDataView, AudioState } from '../../pal/audio/type';
import { Component } from '../scene-graph/component';
import { AudioClip } from './audio-clip';
declare enum AudioSourceEventType {
    STARTED = "started",
    ENDED = "ended"
}
/**
 * @en
 * A representation of a single audio source, <br>
 * contains basic functionalities like play, pause and stop.
 * @zh
 * 音频组件，代表单个音源，提供播放、暂停、停止等基本功能。
 */
export declare class AudioSource extends Component {
    static get maxAudioChannel(): number;
    static AudioState: typeof AudioState;
    static EventType: typeof AudioSourceEventType;
    protected _clip: AudioClip | null;
    protected _player: AudioPlayer | null;
    private _hasRegisterListener;
    protected _loop: boolean;
    protected _playOnAwake: boolean;
    protected _volume: number;
    private _cachedCurrentTime;
    private _operationsBeforeLoading;
    private _isLoaded;
    private _lastSetClip;
    constructor();
    private _resetPlayer;
    /**
     * @en
     * The default AudioClip to be played for this audio source.
     * @zh
     * 设定要播放的音频。
     */
    set clip(val: AudioClip | null);
    get clip(): AudioClip | null;
    private _syncPlayer;
    private _registerListener;
    private _unregisterListener;
    /**
     * @en
     * Is looping enabled for this audio source?
     * @zh
     * 是否循环播放音频？
     */
    set loop(val: boolean);
    get loop(): boolean;
    /**
     * @en
     * Is the autoplay enabled? <br>
     * Note that for most platform autoplay will only start <br>
     * after a user gesture is received, according to the latest autoplay policy: <br>
     * https://www.chromium.org/audio-video/autoplay
     * @zh
     * 是否启用自动播放。 <br>
     * 请注意，根据最新的自动播放策略，现在对大多数平台，自动播放只会在第一次收到用户输入后生效。 <br>
     * 参考：https://www.chromium.org/audio-video/autoplay
     */
    set playOnAwake(val: boolean);
    get playOnAwake(): boolean;
    /**
     * @en
     * The volume of this audio source (0.0 to 1.0).<br>
     * Note: Volume control may be ineffective on some platforms.
     * @zh
     * 音频的音量（大小范围为 0.0 到 1.0）。<br>
     * 请注意，在某些平台上，音量控制可能不起效。<br>
     */
    set volume(val: number);
    get volume(): number;
    onLoad(): void;
    onEnable(): void;
    onDisable(): void;
    onDestroy(): void;
    /**
     * @en
     * Get PCM data from specified channel.
     * Currently it is only available in Native platform and Web Audio (including Web and ByteDance platforms).
     *
     * @zh
     * 通过指定的通道获取音频的 PCM data。
     * 目前仅在原生平台和 Web Audio（包括 Web 和 字节平台）中可用。
     *
     * @param channelIndex The channel index. 0 is left channel, 1 is right channel.
     * @returns A Promise to get the PCM data after audio is loaded.
     *
     * @example
     * ```ts
     * audioSource.getPCMData(0).then(dataView => {
     *   if (!dataView)  return;
     *   for (let i = 0; i < dataView.length; ++i) {
     *     console.log('data: ' + dataView.getData(i));
     *   }
     * });
     * ```
     */
    getPCMData(channelIndex: number): Promise<AudioPCMDataView | undefined>;
    /**
     * @en
     * Get the sample rate of audio.
     * Currently it is only available in Native platform and Web Audio (including Web and ByteDance platforms).
     *
     * @zh
     * 获取音频的采样率。
     * 目前仅在原生平台和 Web Audio（包括 Web 和 字节平台）中可用。
     *
     * @returns A Promise to get the sample rate after audio is loaded.
     */
    getSampleRate(): Promise<number>;
    private _getRootNode;
    /**
     * @en
     * Play the clip.<br>
     * Restart if already playing.<br>
     * Resume if paused.
     *
     * NOTE: On Web platforms, the Auto Play Policy bans auto playing audios at the first time, because the user gesture is required.
     * there are 2 ways to play audios at the first time:
     * - play audios in the callback of TOUCH_END or MOUSE_UP event
     * - play audios straightly, the engine will auto play audios at the next user gesture.
     *
     * @zh
     * 开始播放。<br>
     * 如果音频处于正在播放状态，将会重新开始播放音频。<br>
     * 如果音频处于暂停状态，则会继续播放音频。
     *
     * 注意:在 Web 平台，Auto Play Policy 禁止首次自动播放音频，因为需要发生用户交互之后才能播放音频。
     * 有两种方式实现音频首次自动播放：
     * - 在 TOUCH_END 或者 MOUSE_UP 的事件回调里播放音频。
     * - 直接播放音频，引擎会在下一次发生用户交互时自动播放。
     */
    play(): void;
    /**
     * @en
     * Pause the clip.
     * @zh
     * 暂停播放。
     */
    pause(): void;
    /**
     * @en
     * Stop the clip.
     * @zh
     * 停止播放。
     */
    stop(): void;
    /**
     * @en
     * Plays an AudioClip, and scales volume by volumeScale. The result volume is `audioSource.volume * volumeScale`. <br>
     * @zh
     * 以指定音量倍数播放一个音频一次。最终播放的音量为 `audioSource.volume * volumeScale`。 <br>
     * @param clip The audio clip to be played.
     * @param volumeScale volume scaling factor wrt. current value.
     */
    playOneShot(clip: AudioClip, volumeScale?: number): void;
    protected _syncStates(): void;
    /**
     * @en
     * Set current playback time, in seconds.
     * @zh
     * 以秒为单位设置当前播放时间。
     * @param num playback time to jump to.
     */
    set currentTime(num: number);
    /**
     * @en
     * Get the current playback time, in seconds.
     * @zh
     * 以秒为单位获取当前播放时间。
     */
    get currentTime(): number;
    /**
     * @en
     * Get the audio duration, in seconds.
     * @zh
     * 获取以秒为单位的音频总时长。
     */
    get duration(): number;
    /**
     * @en
     * Get current audio state.
     * @zh
     * 获取当前音频状态。
     */
    get state(): AudioState;
    /**
     * @en
     * Is the audio currently playing?
     * @zh
     * 当前音频是否正在播放？
     */
    get playing(): boolean;
}
export {};
