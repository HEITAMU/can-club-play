import { QuatCurve, Quat } from '../../core';
import { createEvalSymbol } from '../define';
import { SingleChannelTrack, TrackEval } from './track';
/**
 * @en
 * A quaternion track animates a quaternion(rotation) attribute of target.
 * @zh
 * 四元数轨道描述目标上某个四元数（旋转）属性的动画。
 */
export declare class QuatTrack extends SingleChannelTrack<QuatCurve> {
    /**
     * @internal
     */
    protected createCurve(): QuatCurve;
    /**
     * @internal
     */
    [createEvalSymbol](): QuatTrackEval;
}
export declare class QuatTrackEval implements TrackEval<Quat> {
    private _curve;
    constructor(_curve: QuatCurve);
    get requiresDefault(): boolean;
    evaluate(time: number): Quat;
    private _result;
}
