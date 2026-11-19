import { Component } from '../scene-graph/component';
import { AnimationClip } from './animation-clip';
import { AnimationState, AnimationStateEventType } from './animation-state';
import { CrossFade } from './cross-fade';
declare const Animation_base: new (...args: any[]) => Component & import("../core/event/eventify").IEventified;
/**
 * @en
 * Animation component governs a group of animation states to control playback of the states.
 * For convenient, it stores a group of animation clips.
 * Each of those clips would have an associated animation state uniquely created.
 * Animation component is eventful, it dispatch a serials playback status events.
 * See [[EventType]].
 * @zh
 * 动画组件管理一组动画状态，控制它们的播放。
 * 为了方便，动画组件还存储了一组动画剪辑。
 * 每个剪辑都会独自创建一个关联的动画状态对象。
 * 动画组件具有事件特性，它会派发一系列播放状态相关的事件。
 * 参考 [[EventType]]
 */
export declare class Animation extends Animation_base {
    /**
     * @en
     * Gets or sets clips this component governs.
     * When set, associated animation state of each existing clip will be stopped.
     * If the existing default clip is not in the set of new clips, default clip will be reset to null.
     * @zh
     * 获取或设置此组件管理的剪辑。
     * 设置时，已有剪辑关联的动画状态将被停止；若默认剪辑不在新的动画剪辑中，将被重置为空。
     */
    get clips(): (AnimationClip | null)[];
    set clips(value: (AnimationClip | null)[]);
    /**
     * @en
     * Gets or sets the default clip.
     * Two clips that both have same non-empty UUID are treat as equivalent.
     * @zh
     * 获取或设置默认剪辑。
     * 设置时，若指定的剪辑不在 `this.clips` 中则会被自动添加至 `this.clips`。
     * 具有相同的非空 UUID 的两个动画剪辑将被视为是相同的。
     * @see [[playOnLoad]]
     */
    get defaultClip(): AnimationClip | null;
    set defaultClip(value: AnimationClip | null);
    static EventType: typeof AnimationStateEventType;
    /**
     * @en
     * Whether the default clip should get into playing when this components starts.
     * Note, this field takes no effect if `crossFade()` or `play()` has been called before this component starts.
     * @zh
     * 是否在组件开始运行时自动播放默认剪辑。
     * 注意，若在组件开始运行前调用了 `crossFade` 或 `play()`，此字段将不会生效。
     */
    playOnLoad: boolean;
    /**
     * @internal
     */
    protected _crossFade: CrossFade;
    /**
     * @internal
     */
    protected _nameToState: Record<string, AnimationState>;
    /**
     * @internal
     */
    protected _clips: (AnimationClip | null)[];
    /**
     * @internal
     */
    protected _defaultClip: AnimationClip | null;
    /**
     * Whether if `crossFade()` or `play()` has been called before this component starts.
     */
    private _hasBeenPlayed;
    onLoad(): void;
    start(): void;
    onEnable(): void;
    onDisable(): void;
    onDestroy(): void;
    /**
     * @en
     * Switch to play specified animation state, without fading.
     * @zh
     * 立即切换到指定动画状态。
     * @param name The name of the animation to be played, if absent, the default clip will be played
     */
    play(name?: string): void;
    /**
     * @en
     * Smoothly switch to play specified animation state.
     * @zh
     * 平滑地切换到指定动画状态。
     * @param name The name of the animation to switch to
     * @param duration The duration of the cross fade, default value is 0.3s
     */
    crossFade(name: string, duration?: number): void;
    /**
     * @en
     * Pause all animation states and all switching.
     * @zh
     * 暂停所有动画状态，并暂停所有切换。
     */
    pause(): void;
    /**
     * @en
     * Resume all animation states and all switching.
     * @zh
     * 恢复所有动画状态，并恢复所有切换。
     */
    resume(): void;
    /**
     * @en
     * Stop all animation states and all switching.
     * @zh
     * 停止所有动画状态，并停止所有切换。
     */
    stop(): void;
    /**
     * @en
     * Get specified animation state.
     * @zh
     * 获取指定的动画状态。
     * @param name The name of the animation
     * @returns If no animation found, return null, otherwise the correspond animation state is returned
     */
    getState(name: string): AnimationState;
    /**
     * @en
     * Creates a state for specified clip.
     * If there is already a clip with same name, the existing animation state will be stopped and overridden.
     * @zh
     * 使用指定的动画剪辑创建一个动画状态。
     * 若指定名称的动画状态已存在，已存在的动画状态将先被设为停止并被覆盖。
     * @param clip The animation clip
     * @param name The animation state name, if absent, the default clip's name will be used
     * @returns The animation state created
     */
    createState(clip: AnimationClip, name?: string): AnimationState;
    /**
     * @en
     * Stops and removes specified clip.
     * @zh
     * 停止并移除指定的动画状态。
     * @param name The name of the animation state
     */
    removeState(name: string): void;
    /**
     * @zh
     * 添加一个动画剪辑到 `this.clips`中并以此剪辑创建动画状态。
     * @en
     * Adds an animation clip into this component and creates a animation state for this clip.
     * @param clip The animation clip
     * @param name The animation state name, if absent, the default clip's name will be used
     * @returns The created animation state
     */
    addClip(clip: AnimationClip, name?: string): AnimationState;
    /**
     * @en
     * Remove clip from the animation list. This will remove the clip and any animation states based on it.<br>
     * If there are animation states depend on the clip are playing or clip is defaultClip, it will not delete the clip.<br>
     * But if force is true, then will always remove the clip and any animation states based on it. If clip is defaultClip,
     * defaultClip will be reset to null
     * @zh
     * 从动画列表中移除指定的动画剪辑，<br/>
     * 如果依赖于 clip 的 AnimationState 正在播放或者 clip 是 defaultClip 的话，默认是不会删除 clip 的。<br/>
     * 但是如果 force 参数为 true，则会强制停止该动画，然后移除该动画剪辑和相关的动画。这时候如果 clip 是 defaultClip，defaultClip 将会被重置为 null。<br/>
     * @param force - If force is true, then will always remove the clip and any animation states based on it.
     */
    removeClip(clip: AnimationClip, force?: boolean): void;
    /**
     * @en
     * Register animation event callback.<bg>
     * The event arguments will provide the AnimationState which emit the event.<bg>
     * When play an animation, will auto register the event callback to the AnimationState,<bg>
     * and unregister the event callback from the AnimationState when animation stopped.
     * @zh
     * 注册动画事件回调。<bg>
     * 回调的事件里将会附上发送事件的 AnimationState。<bg>
     * 当播放一个动画时，会自动将事件注册到对应的 AnimationState 上，停止播放时会将事件从这个 AnimationState 上取消注册。
     * @param type The event type to listen to
     * @param callback The callback when event triggered
     * @param target The callee when invoke the callback, could be absent
     * @return The registered callback
     * @example
     * ```ts
     * onPlay: function (type, state) {
     *     // callback
     * }
     *
     * // register event to all animation
     * animation.on('play', this.onPlay, this);
     * ```
     */
    on<TFunction extends (...any: any[]) => void>(type: AnimationStateEventType, callback: TFunction, thisArg?: any, once?: boolean): TFunction;
    once<TFunction extends (...any: any[]) => void>(type: AnimationStateEventType, callback: TFunction, thisArg?: any): TFunction;
    /**
     * @en
     * Unregister animation event callback.
     * @zh
     * 取消注册动画事件回调。
     * @param {String} type The event type to unregister
     * @param {Function} callback The callback to unregister
     * @param {Object} target The callee of the callback, could be absent
     * @example
     * ```ts
     * // unregister event to all animation
     * animation.off('play', this.onPlay, this);
     * ```
     */
    off(type: AnimationStateEventType, callback?: (...any: any[]) => void, thisArg?: any): void;
    /**
     * @internal
     */
    protected _createState(clip: AnimationClip, name?: string): AnimationState;
    /**
     * @internal
     */
    protected _doCreateState(clip: AnimationClip, name: string): AnimationState;
    /**
     * @internal This method only friends to skeletal animation component.
     */
    protected doPlayOrCrossFade(state: AnimationState, duration: number): void;
    private _removeStateOfAutomaticClip;
    private _syncAllowLastFrameEvent;
    private _syncDisallowLastFrameEvent;
}
type EventType_ = AnimationStateEventType;
export declare namespace Animation {
    type EventType = EventType_;
}
/**
 * Alias of [[Animation]]
 * @deprecated Since v1.2
 */
export { Animation as AnimationComponent };
