import { Asset } from '../asset/assets/asset';
import { SpriteFrame } from '../2d/assets/sprite-frame';
import { Mat4, Quat, Vec3, RealCurve } from '../core';
import { WrapMode as AnimationWrapMode, WrapMode } from './types';
import { Node } from '../scene-graph/node';
import type { PoseOutput } from './pose-output';
import * as legacy from './legacy-clip-data';
import { BAKE_SKELETON_CURVE_SYMBOL } from './internal-symbols';
import { RuntimeBinding, Track, TrackEval } from './tracks/track';
import { UntypedTrackRefine } from './tracks/untyped-track';
import { Range } from './tracks/utils';
import type { ExoticAnimation } from './exotic-animation/exotic-animation';
import './exotic-animation/exotic-animation';
import type { AnimationMask } from './marionette/animation-mask';
import { EmbeddedPlayer } from './embedded-player/embedded-player';
export declare namespace AnimationClip {
    export interface IEvent {
        frame: number;
        func: string;
        params: string[];
    }
    /**
     * @internal
     */
    export type { legacy as _legacy };
}
export declare const searchForRootBonePathSymbol: unique symbol;
interface SkeletonAnimationBakeInfo {
    samples: number;
    frames: number;
    joints: Record<string, {
        transforms?: Mat4[];
    }>;
}
export declare const exoticAnimationTag: unique symbol;
export declare const embeddedPlayerCountTag: unique symbol;
export declare const getEmbeddedPlayersTag: unique symbol;
export declare const addEmbeddedPlayerTag: unique symbol;
export declare const removeEmbeddedPlayerTag: unique symbol;
export declare const clearEmbeddedPlayersTag: unique symbol;
/**
 * Tag to access the additive settings associated on animation clip.
 */
export declare const additiveSettingsTag: unique symbol;
/**
 * @zh 动画剪辑表示一段使用动画编辑器编辑的关键帧动画或是外部美术工具生产的骨骼动画。
 * 它的数据主要被分为几层：轨道、关键帧和曲线。
 * @en The animation clip represents a sequence of key frame animation created with the animation editor or skeletal animation other DCC tools.
 * The data is divided in different levels: tracks, key frames, curves.
 */
export declare class AnimationClip extends Asset {
    static WrapMode: typeof AnimationWrapMode;
    /**
     * @en Crate clip with a set of sprite frames
     * @zh 使用一组序列帧图片来创建动画剪辑
     * @example
     * ```
     * import { AnimationClip } from 'cc';
     * const clip = AnimationClip.createWithSpriteFrames(spriteFrames, 10);
     * ```
     */
    static createWithSpriteFrames(spriteFrames: SpriteFrame[], sample: number): AnimationClip;
    /**
     * @zh 动画帧率，单位为帧/秒。注意此属性仅用于编辑器动画编辑。
     * @en Animation frame rate: frames per second.
     * Note this property is only used for animation editing in Editor.
     */
    sample: number;
    /**
     * @zh 动画的播放速度。
     * @en Animation playback speed.
     */
    speed: number;
    /**
     * @zh 动画的循环模式。
     * @en Animation loop mode.
     */
    wrapMode: AnimationWrapMode;
    /**
     * Sets if node TRS curves in this animation can be blended.
     * Normally this flag is enabled for model animation and disabled for other case.
     * @internal This is an internal slot. Never use it in your code.
     */
    enableTrsBlending: boolean;
    constructor(name?: string);
    /**
     * @zh 动画的周期。
     * @en Animation duration.
     */
    get duration(): number;
    set duration(value: number);
    /**
     * @en
     * Gets the count of tracks this animation owns.
     * @zh
     * 获取此动画中的轨道数量。
     */
    get tracksCount(): number;
    /**
     * @en
     * Gets an iterable to tracks.
     * @zh
     * 获取可用于迭代轨道的对象。
     */
    get tracks(): Iterable<Track>;
    get hash(): number;
    /**
     * @zh 动画包含的事件数据。
     * @en Associated event data.
     */
    get events(): AnimationClip.IEvent[];
    set events(value: AnimationClip.IEvent[]);
    get [exoticAnimationTag](): ExoticAnimation | null;
    set [exoticAnimationTag](value: ExoticAnimation | null);
    /**
     * Gets if this animation clip contains additive animation.
     * @experimental
     */
    get isAdditive_experimental(): boolean;
    /**
     * Accesses the additive animation settings.
     * @internal
     */
    get [additiveSettingsTag](): AdditiveSettings;
    onLoaded(): void;
    /**
     * @en
     * Counts the time range that the tracks within this animation span.
     * @zh
     * 获取此动画所有轨道占据的时间范围。
     * @returns The time range.
     */
    range(): Range;
    /**
     * @en
     * Gets the specified track.
     * @zh
     * 获取指定的轨道。
     * @param index Index to the track.
     * @returns The track.
     */
    getTrack(index: number): Track;
    /**
     * @en
     * Adds a track into this animation.
     * @zh
     * 添加一个轨道到此动画中。
     * @param track The track.
     * @returns Index to the track.
     */
    addTrack(track: Track): number;
    /**
     * @en
     * Removes a track from this animation.
     * @zh
     * 移除此动画中的指定轨道。
     * @param index Index to the track.
     */
    removeTrack(index: number): void;
    /**
     * @en
     * Removes all tracks from this animation.
     * @zh
     * 移除此动画的所有轨道。
     */
    clearTracks(): void;
    /**
     * Returns if this clip has any event.
     * @internal Do not use this in your code.
     */
    containsAnyEvent(): boolean;
    /**
     * Creates an event evaluator for this animation.
     * @param targetNode Target node used to fire events.
     * @internal Do not use this in your code.
     */
    createEventEvaluator(targetNode: Node): EventEvaluator;
    /**
     * Returns if this clip has any embedded player.
     * @internal Do not use this in your code.
     */
    containsAnyEmbeddedPlayer(): boolean;
    /**
     * Creates an embedded player evaluator for this animation.
     * @param targetNode Target node.
     * @internal Do not use this in your code.
     */
    createEmbeddedPlayerEvaluator(targetNode: Node): EmbeddedPlayerEvaluation;
    /**
     * Creates an evaluator for this animation.
     * @param context The context.
     * @returns The evaluator.
     * @internal Do not use this in your code.
     */
    createEvaluator(context: AnimationClipEvalContext): AnimationClipEvaluation;
    destroy(): boolean;
    [BAKE_SKELETON_CURVE_SYMBOL](start: number, samples: number, frames: number): SkeletonAnimationBakeInfo;
    /**
     * Convert all untyped tracks into typed ones and delete the original.
     * @param refine How to decide the type on specified path.
     * @internal DO NOT USE THIS IN YOUR CODE.
     */
    upgradeUntypedTracks(refine: UntypedTrackRefine): void;
    /**
     * @internal Export for test.
     */
    [searchForRootBonePathSymbol](): string;
    /**
     * @zh 曲线可引用的所有时间轴。
     * @en Frame keys referenced by curves.
     * @deprecated Since V3.3. Please reference to the track/channel/curve mechanism introduced in V3.3.
     */
    get keys(): number[][];
    set keys(value: number[][]);
    /**
     * @zh 此动画包含的所有曲线。
     * @en Curves this animation contains.
     * @deprecated Since V3.3. Please reference to the track/channel/curve mechanism introduced in V3.3.
     */
    get curves(): legacy.LegacyClipCurve[];
    set curves(value: legacy.LegacyClipCurve[]);
    /**
     * @deprecated Since V3.3. Please reference to the track/channel/curve mechanism introduced in V3.3.
     */
    get commonTargets(): legacy.LegacyCommonTarget[];
    set commonTargets(value: legacy.LegacyCommonTarget[]);
    /**
     * @en
     * The animation's data.
     * @zh
     * 此动画的数据。
     * @deprecated Since V3.3. Please reference to the track/channel/curve mechanism introduced in V3.3.
     */
    get data(): Uint8Array | null;
    /**
     * @deprecated Since V3.3. Please reference to the track/channel/curve mechanism introduced in V3.3.
     */
    getPropertyCurves(): readonly legacy.LegacyRuntimeCurve[];
    /**
     * @deprecated Since V3.3. Please reference to the track/channel/curve mechanism introduced in V3.3.
     */
    get eventGroups(): readonly IAnimationEventGroup[];
    /**
     * @zh 提交事件数据的修改。
     * 当你修改了 `this.events` 时，必须调用 `this.updateEventDatas()` 使修改生效。
     * @en
     * Commit event data update.
     * You should call this function after you changed the `events` data to take effect.
     * @deprecated Since V3.3. Please Assign to `this.events`.
     */
    updateEventDatas(): void;
    /**
     * @zh 返回本动画是否包含事件数据。
     * @en Returns if this animation contains event data.
     * @protected
     */
    hasEvents(): boolean;
    /**
     * Migrates legacy data into tracks.
     * NOTE: This method tend to be used as internal purpose or patch.
     * DO NOT use it in your code since it might be removed for the future at any time.
     * @internal Since V3.3. Please reference to the track/channel/curve mechanism introduced in V3.3.
     */
    syncLegacyData(): void;
    /**
     * @internal
     */
    get [embeddedPlayerCountTag](): number;
    /**
     * @internal
     */
    [getEmbeddedPlayersTag](): Iterable<EmbeddedPlayer>;
    /**
     * @internal
     */
    [addEmbeddedPlayerTag](embeddedPlayer: EmbeddedPlayer): void;
    /**
     * @internal
     */
    [removeEmbeddedPlayerTag](embeddedPlayer: EmbeddedPlayer): void;
    /**
     * @internal
     */
    [clearEmbeddedPlayersTag](): void;
    /**
     * @zh 获取此动画剪辑中的辅助曲线数量。
     * @en Gets the count of auxiliary curves within this animation clip.
     */
    get auxiliaryCurveCount_experimental(): number;
    /**
     * @zh 返回此动画剪辑中所有辅助曲线的名称。
     * @en Returns names of all auxiliary curves within this animation clip.
     */
    getAuxiliaryCurveNames_experimental(): readonly string[];
    /**
     * @zh 返回此动画剪辑中是否存在指定的辅助曲线。
     * @en Returns if the specified auxiliary curve exists in this animation clip.
     */
    hasAuxiliaryCurve_experimental(name: string): boolean;
    /**
     * @zh 添加一条辅助曲线。如果已存在同名的辅助曲线，则直接返回。
     * @en Adds an auxiliary curve. Directly return if there is already such named auxiliary curve.
     * @param name @zh 辅助曲线的名称。@en The auxiliary curve's name.
     * @returns @zh 新增或已存在的辅助曲线。 @en The newly created or existing auxiliary curve.
     * @experimental
     */
    addAuxiliaryCurve_experimental(name: string): RealCurve;
    /**
     * @zh 获取指定的辅助曲线。
     * @en Gets the specified auxiliary curve.
     * @param name @zh 辅助曲线的名称。@en The auxiliary curve's name.
     * @returns @zh 指定的辅助曲线。@en The specified auxiliary curve.
     * @experimental
     */
    getAuxiliaryCurve_experimental(name: string): RealCurve;
    /**
     * @zh 重命名指定的辅助曲线。
     * @en Renames the specified auxiliary curve.
     * @param name @zh 要重命名的辅助曲线的名称。@en Name of the auxiliary curve to rename.
     * @param newName @zh 新名称。@en New name.
     */
    renameAuxiliaryCurve_experimental(name: string, newName: string): void;
    /**
     * @zh 移除指定的辅助曲线。
     * @en Removes the specified auxiliary curve.
     * @param name @zh 辅助曲线的名称。@en The auxiliary curve's name.
     * @experimental
     */
    removeAuxiliaryCurve_experimental(name: string): void;
    /**
     * @internal
     */
    _trySyncLegacyData(): void;
    private _duration;
    private _hash;
    private frameRate;
    private _tracks;
    private _exoticAnimation;
    private _legacyData;
    private _legacyDataDirty;
    private _events;
    private _embeddedPlayers;
    private _additiveSettings;
    private _auxiliaryCurveEntries;
    private _runtimeEvents;
    private _createEvalWithBinder;
    private _createRootMotionEvaluation;
    private _searchForRootBonePath;
    private _getLegacyData;
    private _toLegacy;
    private _fromLegacy;
    private _collectAnimatedJoints;
    private _findAuxiliaryCurveEntry;
}
declare class AdditiveSettings {
    enabled: boolean;
    refClip: AnimationClip | null;
}
export { AdditiveSettings as AnimationClipAdditiveSettings };
type WrapMode_ = WrapMode;
export declare namespace AnimationClip {
    type WrapMode = WrapMode_;
}
declare class TrackEvalStatus<TValue> {
    constructor(binding: RuntimeBinding<TValue>, trackEval: TrackEval<TValue>);
    evaluate(time: number): void;
    private _binding;
    private _trackEval;
    private _shouldEvaluateDefault;
}
interface AnimationClipEvalContext {
    /**
     * The output pose.
     */
    pose?: PoseOutput;
    /**
     * The root animating target(should be scene node now).
     */
    target: unknown;
    /**
     * The animation mask applied.
     */
    mask?: AnimationMask;
    /**
     * Path to the root bone.
     */
    rootMotion?: RootMotionOptions;
}
interface RootMotionOptions {
}
type ExoticAnimationEvaluator = ReturnType<ExoticAnimation['createEvaluator']>;
declare class EmbeddedPlayerEvaluation {
    constructor(embeddedPlayers: ReadonlyArray<EmbeddedPlayer>, rootNode: Node);
    destroy(): void;
    /**
     * Evaluates the embedded players.
     * @param time The time([0, clipDuration]).
     * @param iterations The iterations the evaluation occurred. Should be integral.
     */
    evaluate(time: number, iterations: number): void;
    notifyHostSpeedChanged(speed: number): void;
    /**
     * Notifies that the host has ran into **playing** state.
     * @param time The time where host ran into playing state.
     */
    notifyHostPlay(time: number): void;
    /**
     * Notifies that the host has ran into **pause** state.
     */
    notifyHostPause(time: number): void;
    /**
     * Notifies that the host has ran into **stopped** state.
     */
    notifyHostStop(): void;
    private _embeddedPlayers;
    private _embeddedPlayerEvaluationInfos;
}
declare class AnimationClipEvaluation {
    constructor(trackEvalStatuses: TrackEvalStatus<unknown>[], exoticAnimationEvaluator: ExoticAnimationEvaluator | undefined, rootMotionEvaluation: RootMotionEvaluation | undefined);
    /**
     * Evaluates this animation.
     * @param time The time.
     */
    evaluate(time: number): void;
    /**
     * Gets the root bone motion.
     * @param startTime Start time.
     * @param endTime End time.
     */
    evaluateRootMotion(time: number, motionLength: number): void;
    private _exoticAnimationEvaluator;
    private _trackEvalStatues;
    private _rootMotionEvaluation;
}
declare class BoneTransform {
    position: Vec3;
    scale: Vec3;
    rotation: Quat;
    eulerAngles: Vec3;
    getTransform(out: Mat4): void;
}
declare class RootMotionEvaluation {
    private _rootBone;
    private _duration;
    private _boneTransform;
    private _trackEvalStatuses;
    constructor(_rootBone: Node, _duration: number, _boneTransform: BoneTransform, _trackEvalStatuses: TrackEvalStatus<unknown>[]);
    evaluate(time: number, motionLength: number): void;
    private _calcMotionTransform;
    private _evaluateAt;
    private _initialTransformCache;
    private _clipEndTransformCache;
    private _startTransformCache;
    private _endTransformCache;
    private _motionTransformCache;
    private _translationMotionCache;
    private _rotationMotionCache;
    private _scaleMotionCache;
}
interface IAnimationEvent {
    functionName: string;
    parameters: string[];
}
interface IAnimationEventGroup {
    events: IAnimationEvent[];
}
declare class EventEvaluator {
    private _targetNode;
    private _ratios;
    private _eventGroups;
    private _wrapMode;
    constructor(_targetNode: Node, _ratios: readonly number[], _eventGroups: readonly IAnimationEventGroup[], _wrapMode: WrapMode);
    setWrapMode(wrapMode: WrapMode): void;
    ignore(ratio: number, direction: number): void;
    reset(): void;
    sample(ratio: number, direction: number, iterations: number): void;
    private _lastFrameIndex;
    private _lastIterations;
    private _lastDirection;
    private _ignoreIndex;
    private _sampled;
    private _doFire;
    private _checkAndFire;
}
