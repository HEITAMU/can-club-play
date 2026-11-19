import { Node } from '../scene-graph/node';
import { AnimationClip } from './animation-clip';
import { Playable } from './playable';
import { WrapMode, WrappedInfo } from './types';
import { AnimationMask } from './marionette/animation-mask';
import { BlendStateBuffer } from '../3d/skeletal-animation/skeletal-animation-blending';
/**
 * @en The event type supported by Animation
 * @zh Animation 支持的事件类型。
 */
export declare enum AnimationStateEventType {
    /**
     * @en Emit when begin playing animation
     * @zh 开始播放时触发。
     */
    PLAY = "play",
    /**
     * @en Emit when stop playing animation
     * @zh 停止播放时触发。
     */
    STOP = "stop",
    /**
     * @en Emit when pause animation
     * @zh 暂停播放时触发。
     */
    PAUSE = "pause",
    /**
     * @en Emit when resume animation
     * @zh 恢复播放时触发。
     */
    RESUME = "resume",
    /**
     * @en If animation repeat count is larger than 1, emit when animation play to the last frame.
     * @zh 假如动画循环次数大于 1，当动画播放到最后一帧时触发。
     */
    LASTFRAME = "lastframe",
    /**
     * @en Triggered when finish playing animation.
     * @zh 动画完成播放时触发。
     */
    FINISHED = "finished"
}
/**
 * @en
 * The AnimationState gives full control over animation playback process.
 * In most cases the Animation Component is sufficient and easier to use. Use the AnimationState if you need full control.
 * @zh
 * AnimationState 完全控制动画播放过程。<br/>
 * 大多数情况下 动画组件 是足够和易于使用的。如果您需要更多的动画控制接口，请使用 AnimationState。
 *
 */
export declare class AnimationState extends Playable {
    /**
     * @en The clip that is being played by this animation state.
     * @zh 此动画状态正在播放的剪辑。
     */
    get clip(): AnimationClip;
    /**
     * @en The name of the playing animation.
     * @zh 动画的名字。
     */
    get name(): string;
    get length(): number;
    /**
     * @en
     * Wrapping mode of the playing animation.
     * Notice : dynamic change wrapMode will reset time and repeatCount property
     * @zh
     * 动画循环方式。
     * 需要注意的是，动态修改 wrapMode 时，会重置 time 以及 repeatCount。
     * @default: WrapMode.Normal
     */
    get wrapMode(): WrapMode;
    set wrapMode(value: WrapMode);
    /**
     * @en The animation's iteration count property.
     *
     * A real number greater than or equal to zero (including positive infinity) representing the number of times
     * to repeat the animation node.
     *
     * Values less than zero and NaN values are treated as the value 1.0 for the purpose of timing model
     * calculations.
     *
     * @zh 迭代次数，指动画播放多少次后结束, normalize time。 如 2.5（2次半）。
     *
     * @default 1
     */
    get repeatCount(): number;
    set repeatCount(value: number);
    /**
     * @en The start delay which represents the number of seconds from an animation's start time to the start of
     * the active interval.
     * @zh 延迟多少秒播放。
     * @default 0
     */
    get delay(): number;
    set delay(value: number);
    /**
     * @en The iteration duration of this animation in seconds. (length)
     * @zh 单次动画的持续时间，秒。（动画长度）
     * @readOnly
     */
    duration: number;
    /**
     * @en
     * Gets or sets the playback range.
     * The `min` and `max` field of the range are measured in seconds.
     * While setting, the range object should be a valid range.
     * The actual playback range would be the inclusion of this field and [0, duration].
     * Set this field would reset the accumulated play time.
     * If `min === max`, the animation always play at `min`.
     * @zh
     * 获取或设置播放范围。
     * 范围的 `min`、`max` 字段都是以秒为单位的。
     * 设置时，应当指定一个有效的范围；实际的播放范围是该字段和 [0, 周期] 之间的交集。
     * 设置播放范围时将重置累计播放时间。
     * 如果 `min === max`，该动画将一直在 `min` 处播放。
     */
    get playbackRange(): Readonly<{
        min: number;
        max: number;
    }>;
    set playbackRange(value: Readonly<{
        min: number;
        max: number;
    }>);
    /**
     * @en The animation's playback speed. 1 is normal playback speed.
     * @zh 播放速率。
     * @default: 1.0
     */
    get speed(): number;
    set speed(value: number);
    /**
     * @en The current accumulated time of this animation in seconds.
     * @zh 动画当前**累计播放**的时间，单位为秒。
     * @default 0
     */
    time: number;
    /**
     * @en Gets the time progress, in seconds.
     * @zh 获取动画的时间进度，单位为秒。
     */
    get current(): number;
    /**
     * @en Gets the playback ratio.
     * @zh 获取动画播放的比例时间。
     */
    get ratio(): number;
    /**
     * @en
     * The weight of this animation state.
     * @zh
     * 此动画状态的权重。
     */
    get weight(): number;
    set weight(value: number);
    frameRate: number;
    /**
     * @internal This field is only visible from within internal.
     */
    protected _targetNode: Node | null;
    /**
     * @internal This field is only visible from within internal.
     */
    protected _curveLoaded: boolean;
    private _clip;
    private _speed;
    private _useSimpleProcess;
    private _target;
    private _wrapMode;
    private _repeatCount;
    private _delay;
    private _delayTime;
    /**
     * Mark whether the current frame is played.
     * When set new time to animation state, we should ensure the frame at the specified time being played at next update.
     */
    private _currentFramePlayed;
    private _name;
    private _lastIterations;
    private _lastWrapInfo;
    private _wrappedInfo;
    private _allowLastFrame;
    private _blendStateWriterHost;
    private _playbackRange;
    private _playbackDuration;
    private _invDuration;
    private _poseOutput;
    private _weight;
    private _clipEval;
    private _clipEventEval;
    private _clipEmbeddedPlayerEval;
    /**
     * @internal For internal usage. Really hack...
     */
    protected _doNotCreateEval: boolean;
    constructor(clip: AnimationClip, name?: string);
    /**
     * This method is used for internal purpose only.
     */
    get curveLoaded(): boolean;
    initialize(root: Node, blendStateBuffer?: BlendStateBuffer, mask?: AnimationMask): void;
    destroy(): void;
    /**
     * @deprecated Since V1.1.1, animation states were no longer defined as event targets.
     * To process animation events, use `Animation` instead.
     */
    emit(...args: any[]): void;
    /**
     * @deprecated Since V1.1.1, animation states were no longer defined as event targets.
     * To process animation events, use `Animation` instead.
     */
    on(type: string, callback: Function, target?: any): void | null;
    /**
     * @deprecated Since V1.1.1, animation states were no longer defined as event targets.
     * To process animation events, use `Animation` instead.
     */
    once(type: string, callback: Function, target?: any): void | null;
    /**
     * @deprecated Since V1.1.1, animation states were no longer defined as event targets.
     * To process animation events, use `Animation` instead.
     */
    off(type: string, callback: Function, target?: any): void;
    /**
     * @zh
     * 是否允许触发 `LastFrame` 事件。
     * 该方法仅用作内部用途。
     * @en
     * Whether `LastFrame` should be triggered.
     * @param allowed True if the last frame events may be triggered.
     * This method is only used for internal purpose only.
     */
    allowLastFrameEvent(allowed: boolean): void;
    /**
     * This method is used for internal purpose only.
     * @internal
     */
    _setEventTarget(target: any): void;
    setTime(time: number): void;
    update(delta: number): void;
    sample(): WrappedInfo;
    protected onPlay(): void;
    protected onStop(): void;
    protected onResume(): void;
    protected onPause(): void;
    /**
     * @internal
     */
    protected _sampleCurves(time: number): void;
    private _process;
    private process;
    private simpleProcess;
    private _needReverse;
    private getWrappedInfo;
    private _getPlaybackStart;
    private _sampleEvents;
    private _sampleEmbeddedPlayers;
    private _emit;
    private _onReplayOrResume;
    private _onPauseOrStop;
}
