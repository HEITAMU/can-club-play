import { RealCurve, Color } from '../../core';
import { createEvalSymbol } from '../define';
import { RealChannel, Track, TrackEval } from './track';
/**
 * @en
 * A color track animates a color attribute of target.
 * @zh
 * 颜色轨道描述目标上某个颜色属性的动画。
 */
export declare class ColorTrack extends Track {
    constructor();
    /**
     * @en The four channel of the track.
     * @zh 返回此轨道的四条通道。
     * @returns An readonly four length array in which
     * the element at n denotes the channel of n-th(in order of RGBA) color component(in form of integer within 0-255).
     */
    channels(): [RealChannel, RealChannel, RealChannel, RealChannel];
    /**
     * @internal
     */
    [createEvalSymbol](): ColorTrackEval;
    private _channels;
}
export declare class ColorTrackEval implements TrackEval<Color> {
    private _x;
    private _y;
    private _z;
    private _w;
    constructor(_x: RealCurve | undefined, _y: RealCurve | undefined, _z: RealCurve | undefined, _w: RealCurve | undefined);
    get requiresDefault(): boolean;
    evaluate(time: number, defaultValue?: Color): Color;
    private _result;
}
