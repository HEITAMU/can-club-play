import { RealCurve } from '../../core';
import { SingleChannelTrack } from './track';
/**
 * @en
 * A real track animates a scalar attribute of target.
 * @zh
 * 实数轨道描述目标上某个标量属性的动画。
 */
export declare class RealTrack extends SingleChannelTrack<RealCurve> {
    /**
     * @internal
     */
    protected createCurve(): RealCurve;
}
