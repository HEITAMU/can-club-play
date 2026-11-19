import { RealCurve } from '../curves';
/**
 * @en
 * A key frame in the curve.
 * @zh
 * 曲线中的一个关键帧。
 */
export declare class Keyframe {
    /**
     * @en Current frame time.
     * @zh 当前帧时间。
     */
    time: number;
    /**
     * @en Current frame value.
     * @zh 当前帧的值。
     */
    value: number;
    /**
     * @en In tangent value.
     * @zh 左切线。
     */
    inTangent: number;
    /**
     * @en Out tangent value.
     * @zh 右切线。
     */
    outTangent: number;
}
/**
 * @engineInternal
 */
export declare class OptimizedKey {
    index: number;
    time: number;
    endTime: number;
    coefficient: Float32Array;
    constructor();
    evaluate(T: number): number;
}
/**
 * @engineInternal
 */
export declare function evalOptCurve(t: number, coefs: Float32Array | number[]): number;
/**
 * @en
 * Describe a curve in which three times Hermite interpolation is used for each adjacent key frame.
 * @zh
 * 描述一条曲线，其中每个相邻关键帧采用三次hermite插值计算。
 */
export declare class AnimationCurve {
    /**
     * @dontmangle
     * NOTE: _curve is a serializable property set by `CCClass.fastDefine`,
     * so it should not be mangled while `mangleProtected` is true in `<<ProjectRoot>>/engine-mangle-config.json`.
     */
    private _curve;
    private static defaultKF;
    /**
     * For internal usage only.
     * @internal
     */
    get _internalCurve(): RealCurve;
    /**
     * @en
     * The key frame of the curve.
     * @zh
     * 曲线的关键帧。
     */
    get keyFrames(): Keyframe[];
    set keyFrames(value: Keyframe[]);
    /**
     * @en
     * Loop mode [[AnimationClip.WrapMode]] when the sampling time exceeds the left end.
     * @zh
     * 当采样时间超出左端时采用的循环模式[[AnimationClip.WrapMode]]。
     */
    get preWrapMode(): WrapModeMask;
    set preWrapMode(value: WrapModeMask);
    /**
     * @en
     * Cycle mode [[AnimationClip.WrapMode]] when the sampling time exceeds the right end.
     * @zh
     * 当采样时间超出右端时采用的循环模式[[AnimationClip.WrapMode]]。
     */
    get postWrapMode(): WrapModeMask;
    set postWrapMode(value: WrapModeMask);
    private cachedKey;
    /**
     * @en Construct a curve with key frames
     * @zh 通过关键帧构造一条曲线。
     * @param keyFrames @zh 关键帧 @en Key frames
     */
    constructor(keyFrames?: Keyframe[] | null | RealCurve);
    /**
     * @en
     * Add a keyframe.
     * @zh
     * 添加一个关键帧。
     * @param keyFrame @en A keyframe. @zh 关键帧。
     */
    addKey(keyFrame: Keyframe | null): void;
    /**
     * @ignore
     * @param time
     */
    evaluate_slow(time: number): number;
    /**
     * @en
     * Calculate the curve interpolation at a given point in time.
     * @zh
     * 计算给定时间点的曲线插值。
     * @param time @en The time. @zh 时间。
     */
    evaluate(time: number): number;
    /**
     * @ignore
     * @param optKey
     * @param leftIndex
     * @param rightIndex
     */
    calcOptimizedKey(optKey: OptimizedKey, leftIndex: number, rightIndex: number): void;
    /**
     * @ignore
     * @param optKey
     * @param t
     */
    private findIndex;
}
/**
 * @engineInternal
 */
export declare enum WrapModeMask {
    Default = 0,
    Normal = 1,
    Loop = 2,
    ShouldWrap = 4,
    Clamp = 8,
    PingPong = 22,
    Reverse = 36
}
/**
 * Same as but more effective than `new LegacyCurve()._internalCurve`.
 * @engineInternal
 */
export declare function constructLegacyCurveAndConvert(): RealCurve;
