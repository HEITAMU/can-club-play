import { RealCurve, Vec2, Vec3, Vec4 } from '../../core';
import { createEvalSymbol } from '../define';
import { RealChannel, Track, TrackEval } from './track';
/**
 * @en
 * A vector track animates a vector(in 2, 3, 4 dimension) attribute of target.
 * @zh
 * 向量轨道描述目标上某个（二、三、四维）向量属性的动画。
 */
export declare class VectorTrack extends Track {
    constructor();
    /**
     * @en Gets or sets the count of components(dimension) available while evaluating of this track.
     * @zh 获取或设置此轨道在求值时有效的分量数（维度）。
     */
    get componentsCount(): number;
    set componentsCount(value: number);
    /**
     * @en The four channel of the track.
     * @zh 返回此轨道的四条通道。
     * @returns An readonly four length array in which
     * the element at n denotes the channel of n-th vector component.
     */
    channels(): [RealChannel, RealChannel, RealChannel, RealChannel];
    /**
     * @internal
     */
    [createEvalSymbol](): Vec2TrackEval | Vec3TrackEval | Vec4TrackEval;
    private _channels;
    private _nComponents;
}
export declare class Vec2TrackEval implements TrackEval<Vec2> {
    private _x;
    private _y;
    constructor(_x: RealCurve | undefined, _y: RealCurve | undefined);
    get requiresDefault(): boolean;
    evaluate(time: number, defaultValue?: Readonly<Vec2>): Vec2;
    private _result;
}
export declare class Vec3TrackEval implements TrackEval<Vec3> {
    private _x;
    private _y;
    private _z;
    constructor(_x: RealCurve | undefined, _y: RealCurve | undefined, _z: RealCurve | undefined);
    get requiresDefault(): boolean;
    evaluate(time: number, defaultValue?: Readonly<Vec3>): Vec3;
    private _result;
}
export declare class Vec4TrackEval implements TrackEval<Vec4> {
    private _x;
    private _y;
    private _z;
    private _w;
    constructor(_x: RealCurve | undefined, _y: RealCurve | undefined, _z: RealCurve | undefined, _w: RealCurve | undefined);
    get requiresDefault(): boolean;
    evaluate(time: number, defaultValue?: Readonly<Vec4>): Vec4;
    private _result;
}
