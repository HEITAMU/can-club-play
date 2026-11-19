import { BezierControlPoints } from '../core';
import type * as legacy from './legacy-clip-data';
/**
 * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
 */
export declare class RatioSampler {
    ratios: number[];
    private _findRatio;
    constructor(ratios: number[]);
    sample(ratio: number): number;
}
/**
 * @en
 * Animation curve.
 * @zh
 * 动画曲线。
 * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
 */
export declare class AnimCurve {
    static Linear: null;
    static Bezier(controlPoints: number[]): BezierControlPoints;
    types?: Array<(legacy.LegacyEasingMethod | null)>;
    type?: legacy.LegacyEasingMethod | null;
    /**
     * The values of the keyframes. (y)
     */
    private _values;
    /**
     * Lerp function used. If undefined, no lerp is performed.
     */
    private _lerp;
    private _duration;
    private _array?;
    constructor(propertyCurveData: Omit<legacy.LegacyClipCurveData, 'keys'>, duration: number);
    hasLerp(): boolean;
    valueAt(index: number): any;
    valueBetween(ratio: number, from: number, fromRatio: number, to: number, toRatio: number): any;
    empty(): boolean;
    /**
     * Returns if this curve only yields constants.
     */
    constant(): boolean;
}
export declare class EventInfo {
    events: any[];
    /**
     * @param func event function
     * @param params event params
     */
    add(func: string, params: any[]): void;
}
/**
 * @zh
 * 采样动画曲线。
 * @en
 * Samples an animation curve.
 * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
 * @param curve @zh 动画曲线。@en The curve.
 * @param sampler @zh 采样器。@en The sampler.
 * @param ratio @zh 采样比率。@en Sample ratio([0, 1]).
 */
export declare function sampleAnimationCurve(curve: AnimCurve, sampler: RatioSampler, ratio: number): any;
/**
 * @en
 * Compute a new ratio by curve type.
 * @zh
 * 根据曲线类型计算新的比例。
 * @param ratio - The origin ratio
 * @param type - If it's Array, then ratio will be computed with bezierByTime.
 * If it's string, then ratio will be computed with cc.easing function
 * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
 */
export declare function computeRatioByType(ratio: number, type: legacy.LegacyEasingMethod): number;
