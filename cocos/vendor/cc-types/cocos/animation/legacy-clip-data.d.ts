import { TargetPath } from './target-path';
import { IValueProxyFactory } from './value-proxy';
import { easing, RealKeyframeValue, BezierControlPoints, CompactValueTypeArray } from '../core';
import { AnimCurve, RatioSampler } from './animation-curve';
import { Track } from './tracks/track';
/**
 * 表示曲线值，曲线值可以是任意类型，但必须符合插值方式的要求。
 */
export type LegacyCurveValue = any;
/**
 * 表示曲线的目标对象。
 */
export type LegacyCurveTarget = Record<string, any>;
/**
 * 内置帧时间渐变方式名称。
 */
export type LegacyEasingMethodName = keyof (typeof easing);
/**
 * 帧时间渐变方式。可能为内置帧时间渐变方式的名称或贝塞尔控制点。
 */
export type LegacyEasingMethod = LegacyEasingMethodName | BezierControlPoints;
export type LegacyCompressedEasingMethods = Record<number, LegacyEasingMethod>;
export type LegacyLerpFunction<T = any> = (from: T, to: T, t: number, dt: number) => T;
export interface LegacyClipCurveData {
    /**
     * 曲线使用的时间轴。
     * @see {AnimationClip.keys}
     */
    keys: number;
    /**
     * 曲线值。曲线值的数量应和 `keys` 所引用时间轴的帧数相同。
     */
    values: LegacyCurveValue[];
    /**
     * 曲线任意两帧时间的渐变方式。仅当 `easingMethods === undefined` 时本字段才生效。
     */
    easingMethod?: LegacyEasingMethod;
    /**
     * 描述了每一帧时间到下一帧时间之间的渐变方式。
     */
    easingMethods?: LegacyEasingMethod[] | LegacyCompressedEasingMethods;
    /**
     * 是否进行插值。
     * @default true
     */
    interpolate?: boolean;
    /**
     * For internal usage only.
     */
    _arrayLength?: number;
}
export interface LegacyClipCurve {
    commonTarget?: number;
    modifiers: TargetPath[];
    valueAdapter?: IValueProxyFactory;
    data: LegacyClipCurveData;
}
export interface LegacyCommonTarget {
    modifiers: TargetPath[];
    valueAdapter?: IValueProxyFactory;
}
export type LegacyMaybeCompactCurve = Omit<LegacyClipCurve, 'data'> & {
    data: Omit<LegacyClipCurveData, 'values'> & {
        values: any[] | CompactValueTypeArray;
    };
};
export type LegacyMaybeCompactKeys = Array<number[] | CompactValueTypeArray>;
export type LegacyRuntimeCurve = Pick<LegacyClipCurve, 'modifiers' | 'valueAdapter' | 'commonTarget'> & {
    /**
     * 属性曲线。
     */
    curve: AnimCurve;
    /**
     * 曲线采样器。
     */
    sampler: RatioSampler | null;
};
export declare class AnimationClipLegacyData {
    constructor(duration: number);
    get keys(): number[][];
    set keys(value: number[][]);
    get curves(): LegacyClipCurve[];
    set curves(value: LegacyClipCurve[]);
    get commonTargets(): LegacyCommonTarget[];
    set commonTargets(value: LegacyCommonTarget[]);
    /**
     * 此动画的数据。
     */
    get data(): Uint8Array | null;
    getPropertyCurves(): readonly LegacyRuntimeCurve[];
    toTracks(): Track[];
    private _keys;
    private _curves;
    private _commonTargets;
    private _ratioSamplers;
    private _runtimeCurves?;
    private _data;
    private _duration;
    protected _createPropertyCurves(): void;
}
export interface LegacyObjectCurveData {
    [propertyName: string]: LegacyClipCurveData;
}
export interface LegacyComponentsCurveData {
    [componentName: string]: LegacyObjectCurveData;
}
export interface LegacyNodeCurveData {
    props?: LegacyObjectCurveData;
    comps?: LegacyComponentsCurveData;
}
/**
 * Legacy curve uses time based bezier curve interpolation.
 * That's, interpolate time 'x'(time ratio between two frames, eg.[0, 1])
 * and then use the interpolated time to sample curve.
 * Now we need to compute the the end tangent of previous frame and the start tangent of the next frame.
 * @param timeBezierPoints Bezier points used for legacy time interpolation.
 * @param previousTime Time of the previous keyframe.
 * @param previousValue Value of the previous keyframe.
 * @param nextTime Time of the next keyframe.
 * @param nextValue Value of the next keyframe.
 */
export declare function timeBezierToTangents(timeBezierPoints: BezierControlPoints, previousTime: number, previousKeyframe: RealKeyframeValue, nextTime: number, nextKeyframe: RealKeyframeValue): void;
