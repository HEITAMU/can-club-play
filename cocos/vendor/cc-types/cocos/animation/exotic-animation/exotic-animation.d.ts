import { Quat, Vec3 } from '../../core';
import { AnimationClipGraphBindingContext } from '../marionette/animation-graph-animation-clip-binding';
import { TransformHandle } from '../core/animation-handle';
import { Pose } from '../core/pose';
import { Binder } from '../tracks/track';
/**
 * Animation that:
 * - does not exposed by users;
 * - does not compatible with regular animation;
 * - non-editable;
 * - currently only generated imported from model file.
 */
export declare class ExoticAnimation {
    createEvaluator(binder: Binder): ExoticTrsAnimationEvaluator;
    createEvaluatorForAnimationGraph(context: AnimationClipGraphBindingContext): ExoticTrsAGEvaluation;
    addNodeAnimation(path: string): ExoticNodeAnimation;
    collectAnimatedJoints(): string[];
    split(from: number, to: number): ExoticAnimation;
    /**
     * @internal
     */
    toHashString(): string;
    private _nodeAnimations;
}
declare class ExoticNodeAnimation {
    constructor(path: string);
    createPosition(times: FloatArray, values: FloatArray): void;
    createRotation(times: FloatArray, values: FloatArray): void;
    createScale(times: FloatArray, values: FloatArray): void;
    createEvaluator(binder: Binder): ExoticNodeAnimationEvaluator;
    createEvaluatorForAnimationGraph(context: AnimationClipGraphBindingContext): ExoticNodeAnimationAGEvaluation | null;
    split(from: number, to: number, splitInfoCache: SplitInfo): ExoticNodeAnimation;
    get path(): string;
    /**
     * @internal
     */
    toHashString(): string;
    private _path;
    private _position;
    private _rotation;
    private _scale;
}
interface ExoticTrackValues<TValue> {
    readonly precision: FloatPrecision;
    get(index: number, resultValue: TValue): void;
    lerp(prevIndex: number, nextIndex: number, ratio: number, prevValue: TValue, nextValue: TValue, resultValue: TValue): void;
}
type MayBeQuantized = FloatArray | QuantizedFloatArray;
declare class ExoticVectorLikeTrackValues {
    constructor(values: FloatArray);
    get precision(): FloatPrecision;
    quantize(type: QuantizationType): void;
    /**
     * @internal
     */
    toHashString(): string;
    protected _values: MayBeQuantized;
    protected _isQuantized: boolean;
}
declare class ExoticVec3TrackValues extends ExoticVectorLikeTrackValues implements ExoticTrackValues<Vec3> {
    static imitate(values: FloatArray, model: ExoticVec3TrackValues): ExoticVec3TrackValues;
    get(index: number, resultValue: Vec3): void;
    lerp(prevIndex: number, nextIndex: number, ratio: number, prevValue: Vec3, nextValue: Vec3, resultValue: Vec3): void;
}
declare class ExoticQuatTrackValues extends ExoticVectorLikeTrackValues implements ExoticTrackValues<Quat> {
    static imitate(values: FloatArray, model: ExoticQuatTrackValues): ExoticQuatTrackValues;
    get(index: number, resultValue: Quat): void;
    lerp(prevIndex: number, nextIndex: number, ratio: number, prevValue: Quat, nextValue: Quat, resultValue: Quat): void;
}
declare class ExoticTrack<TTrackValues extends {
    toHashString(): string;
}> {
    constructor(times: FloatArray, values: TTrackValues);
    times: FloatArray;
    values: TTrackValues;
    /**
     * @internal
     */
    toHashString(): string;
}
type ExoticVec3Track = ExoticTrack<ExoticVec3TrackValues>;
type ExoticQuatTrack = ExoticTrack<ExoticQuatTrackValues>;
declare class SplitInfo {
    preLerpIndex: number;
    preLerpRatio: number;
    directKeyframesBegin: number;
    directKeyframesEnd: number;
    postLerpIndex: number;
    postLerpRatio: number;
    constructor();
    get keyframesCount(): number;
    calculate(times: ArrayLike<number>, from: number, to: number): void;
    private _reset;
}
declare class ExoticTrsAnimationEvaluator {
    constructor(nodeAnimations: ExoticNodeAnimation[], binder: Binder);
    evaluate(time: number): void;
    private _nodeEvaluations;
}
declare class ExoticNodeAnimationEvaluator {
    constructor(path: string, position: ExoticVec3Track | null, rotation: ExoticQuatTrack | null, scale: ExoticVec3Track | null, binder: Binder);
    evaluate(time: number): void;
    private _position;
    private _rotation;
    private _scale;
}
/**
 * Exotic TRS animation graph evaluator.
 */
export declare class ExoticTrsAGEvaluation {
    constructor(nodeAnimations: ExoticNodeAnimation[], context: AnimationClipGraphBindingContext);
    destroy(): void;
    evaluate(time: number, pose: Pose): void;
    private _nodeEvaluations;
}
declare class ExoticNodeAnimationAGEvaluation {
    constructor(transformHandle: TransformHandle, position: ExoticVec3Track | null, rotation: ExoticQuatTrack | null, scale: ExoticVec3Track | null);
    destroy(): void;
    evaluate(time: number, pose: Pose): void;
    private _position;
    private _rotation;
    private _scale;
    private _transformHandle;
}
type UintArray = Uint8Array | Uint16Array | Uint32Array;
type FloatArray = Float32Array | Float64Array;
type QuantizationType = 'uint8' | 'uint16';
declare enum FloatPrecision {
    FLOAT_32 = 0,
    FLOAT_64 = 1
}
declare class QuantizedFloatArray {
    originalPrecision: FloatPrecision;
    min: number;
    extent: number;
    values: UintArray;
    get quantizationType(): QuantizationType;
    constructor(originalPrecision: FloatPrecision, values: UintArray, extent: number, min?: number);
    /**
     * @internal
     */
    toHashString(): string;
}
export {};
