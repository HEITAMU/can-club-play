import { IQuatLike, Quat } from '../math';
import { KeyframeCurve } from './keyframe-curve';
import { EasingMethod, ExtrapolationMode } from './curve';
import { deserializeTag, SerializationContext, SerializationInput, SerializationOutput, serializeTag } from '../data';
import { DeserializationContext } from '../data/custom-serializable';
/**
 * @en
 * The method used for interpolation between values of a quaternion keyframe and its next keyframe.
 * @zh
 * 在某四元数关键帧（前一帧）和其下一帧之间插值时使用的插值方式。
 */
export declare enum QuatInterpolationMode {
    /**
     * @en
     * Perform spherical linear interpolation between previous keyframe value and next keyframe value.
     * @zh
     * 在前一帧和后一帧之间执行球面线性插值。
     */
    SLERP = 0,
    /**
     * @en
     * Always use the value from this keyframe.
     * @zh
     * 永远使用前一帧的值。
     */
    CONSTANT = 1
}
/**
 * View to a quaternion frame value.
 * Note, the view may be invalidated due to keyframe change/add/remove.
 */
declare class QuatKeyframeValue {
    /**
     * @en
     * When perform interpolation, the interpolation method should be taken
     * when for this keyframe is used as starting keyframe.
     * @zh
     * 在执行插值时，当以此关键帧作为起始关键帧时应当使用的插值方式。
     */
    interpolationMode: QuatInterpolationMode;
    /**
     * @en
     * Value of the keyframe.
     * @zh
     * 该关键帧的值。
     */
    value: IQuatLike;
    /**
     * @internal Reserved for backward compatibility. Will be removed in future.
     */
    easingMethod: EasingMethod | [number, number, number, number];
    constructor({ value, interpolationMode, easingMethod, }?: Partial<QuatKeyframeValue>);
}
export type { QuatKeyframeValue };
/**
 * The parameter describing a real keyframe value.
 * In the case of partial keyframe value,
 * each component of the keyframe value is taken from the parameter.
 * For unspecified components, default values are taken:
 * - Interpolation mode: slerp
 * - Value: Identity quaternion
 * @zh
 * 用于描述实数关键帧值的参数。
 * 若是部分关键帧的形式，关键帧值的每个分量都是从该参数中取得。
 * 对于未指定的分量，使用默认值：
 * - 插值模式：球面线性插值
 * - 值：单位四元数
 */
type QuatKeyframeValueParameters = Partial<QuatKeyframeValue>;
/**
 * @en
 * Quaternion curve.
 * @zh
 * 四元数曲线
 */
export declare class QuatCurve extends KeyframeCurve<QuatKeyframeValue> {
    constructor();
    /**
     * @en
     * Gets or sets the pre-extrapolation-mode of this curve.
     * Defaults to `ExtrapolationMode.CLAMP`.
     * @zh
     * 获取或设置此曲线的前向外推模式。
     * 默认为 `ExtrapolationMode.CLAMP`。
     */
    preExtrapolation: ExtrapolationMode;
    /**
     * @en
     * Gets or sets the post-extrapolation-mode of this curve.
     * Defaults to `ExtrapolationMode.CLAMP`.
     * @zh
     * 获取或设置此曲线的后向外推模式。
     * 默认为 `ExtrapolationMode.CLAMP`。
     */
    postExtrapolation: ExtrapolationMode;
    /**
     * @en
     * Evaluates this curve at specified time.
     * @zh
     * 计算此曲线在指定时间上的值。
     * @param time Input time.
     * @param quat If specified, this value will be filled and returned.
     * Otherwise a new quaternion object will be filled and returned.
     * @returns Result value.
     */
    evaluate(time: number, quat?: Quat): Quat;
    /**
     * Adds a keyframe into this curve.
     * @param time Time of the keyframe.
     * @param value Value of the keyframe.
     * @returns The index to the new keyframe.
     */
    addKeyFrame(time: number, value: QuatKeyframeValueParameters): number;
    /**
     * Assigns all keyframes.
     * @param keyframes An iterable to keyframes. The keyframes should be sorted by their time.
     */
    assignSorted(keyframes: Iterable<[number, QuatKeyframeValueParameters]>): void;
    /**
       * Assigns all keyframes.
       * @param times Times array. Should be sorted.
       * @param values Values array. Corresponding to each time in `times`.
       */
    assignSorted(times: readonly number[], values: QuatKeyframeValueParameters[]): void;
    /**
     * @internal
     */
    [serializeTag](output: SerializationOutput, context: SerializationContext): void;
    /**
     * @internal
     */
    [deserializeTag](input: SerializationInput, context: DeserializationContext): void;
}
