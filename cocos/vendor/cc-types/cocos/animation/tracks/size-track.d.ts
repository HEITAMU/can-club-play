import { RealCurve, Size } from '../../core';
import { createEvalSymbol } from '../define';
import { RealChannel, Track, TrackEval } from './track';
/**
 * @en
 * A size track animates a size attribute of target.
 * @zh
 * 尺寸轨道描述目标上某个尺寸属性的动画。
 */
export declare class SizeTrack extends Track {
    constructor();
    /**
     * @en The width channel and the height channel of the track.
     * @zh 返回此轨道的宽度通道和高度通道。
     * @returns An readonly array in which
     * the first element is the width channel and the second element is the height channel.
     */
    channels(): [RealChannel, RealChannel];
    /**
     * @internal
     */
    [createEvalSymbol](): SizeTrackEval;
    private _channels;
}
export declare class SizeTrackEval implements TrackEval<Size> {
    private _width;
    private _height;
    constructor(_width: RealCurve | undefined, _height: RealCurve | undefined);
    get requiresDefault(): boolean;
    evaluate(time: number, defaultValue?: Readonly<Size>): Size;
    private _result;
}
