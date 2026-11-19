import { Quat, Vec2, Vec3, Vec4 } from '../core';
import { ILerpable } from './types';
interface ICubicSplineValue<T> extends ILerpable {
    dataPoint: T;
    inTangent: T;
    outTangent: T;
    lerp(to: ICubicSplineValue<T>, t: number, dt: number): T;
    getNoLerp(): T;
}
type CubicSplineValueConstructor<T> = new (dataPoint: T, inTangent: T, outTangent: T) => ICubicSplineValue<T>;
/**
 * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
 */
export declare const CubicSplineVec2Value: CubicSplineValueConstructor<Vec2>;
/**
 * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
 */
export type CubicSplineVec2Value = ICubicSplineValue<Vec2>;
/**
 * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
 */
export declare const CubicSplineVec3Value: CubicSplineValueConstructor<Vec3>;
/**
 * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
 */
export type CubicSplineVec3Value = ICubicSplineValue<Vec3>;
/**
 * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
 */
export declare const CubicSplineVec4Value: CubicSplineValueConstructor<Vec4>;
/**
 * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
 */
export type CubicSplineVec4Value = ICubicSplineValue<Vec4>;
/**
 * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
 */
export declare const CubicSplineQuatValue: CubicSplineValueConstructor<Quat>;
/**
 * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
 */
export declare class CubicSplineNumberValue implements ICubicSplineValue<number> {
    dataPoint: number;
    inTangent: number;
    outTangent: number;
    constructor(dataPoint: number, inTangent: number, outTangent: number);
    lerp(to: CubicSplineNumberValue, t: number, dt: number): number;
    getNoLerp(): number;
}
export {};
