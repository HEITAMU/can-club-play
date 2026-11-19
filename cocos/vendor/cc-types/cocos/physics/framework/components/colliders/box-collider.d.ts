import { Vec3 } from '../../../../core';
import { Collider } from './collider';
import { IBoxShape } from '../../../spec/i-physics-shape';
/**
 * @en
 * Box collider component.
 * @zh
 * 盒子碰撞器。
 */
export declare class BoxCollider extends Collider {
    /**
     * @en
     * Gets or sets the size of the box, in local space.
     * @zh
     * 获取或设置盒的大小。
     */
    get size(): Vec3;
    set size(value: Vec3);
    /**
     * @en
     * Gets the wrapper object, through which the lowLevel instance can be accessed.
     * @zh
     * 获取封装对象，通过此对象可以访问到底层实例。
     */
    get shape(): IBoxShape;
    private _size;
    constructor();
}
