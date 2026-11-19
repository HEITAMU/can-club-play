import { Vec3 } from '../../../../core';
import { Collider } from './collider';
import { IPlaneShape } from '../../../spec/i-physics-shape';
/**
 * @en
 * Plane collider component.
 * @zh
 * 静态平面碰撞器。
 */
export declare class PlaneCollider extends Collider {
    /**
     * @en
     * Gets or sets the normal of the plane, in local space.
     * @zh
     * 获取或设置平面在本地坐标系下的法线。
     */
    get normal(): Vec3;
    set normal(value: Vec3);
    /**
     * @en
     * Gets or sets the value of the plane moving along the normal, in local space.
     * @zh
     * 获取或设置平面在本地坐标系下沿着法线移动的数值。
     */
    get constant(): number;
    set constant(v: number);
    /**
     * @en
     * Gets the wrapper object, through which the lowLevel instance can be accessed.
     * @zh
     * 获取封装对象，通过此对象可以访问到底层实例。
     */
    get shape(): IPlaneShape;
    protected onEnable(): void;
    private _normal;
    private _constant;
    constructor();
}
