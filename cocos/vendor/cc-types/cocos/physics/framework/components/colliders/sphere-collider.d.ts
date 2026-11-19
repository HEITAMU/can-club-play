import { Collider } from './collider';
import { ISphereShape } from '../../../spec/i-physics-shape';
/**
 * @en
 * Sphere collider component.
 * @zh
 * 球碰撞器。
 */
export declare class SphereCollider extends Collider {
    /**
     * @en
     * Gets or sets the radius of the sphere.
     * @zh
     * 获取或设置球的半径。
     */
    get radius(): number;
    set radius(value: number);
    /**
     * @en
     * Gets the wrapper object, through which the lowLevel instance can be accessed.
     * @zh
     * 获取封装对象，通过此对象可以访问到底层实例。
     */
    get shape(): ISphereShape;
    private _radius;
    constructor();
}
