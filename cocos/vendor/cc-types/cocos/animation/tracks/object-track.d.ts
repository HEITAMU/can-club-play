import { ObjectCurve } from '../../core';
import { SingleChannelTrack } from './track';
/**
 * @en
 * An object track animates an object of attribute of target.
 * @zh
 * 对象轨道描述目标上某个对象类型的属性的动画。
 */
export declare class ObjectTrack<T> extends SingleChannelTrack<ObjectCurve<T>> {
    /**
     * @internal
     */
    protected createCurve(): ObjectCurve<T>;
}
