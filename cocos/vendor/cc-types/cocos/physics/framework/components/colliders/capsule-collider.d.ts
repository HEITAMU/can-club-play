import { Collider } from './collider';
import { ICapsuleShape } from '../../../spec/i-physics-shape';
import { EAxisDirection } from '../../physics-enum';
/**
 * @en
 * Capsule collider component.
 * @zh
 * 胶囊体碰撞器。
 */
export declare class CapsuleCollider extends Collider {
    /**
     * @en
     * Gets or sets the radius of the sphere on the capsule body, in local space.
     * @zh
     * 获取或设置胶囊体在本地坐标系下的球半径。
     */
    get radius(): number;
    set radius(value: number);
    /**
     * @en
     * Gets or sets the cylinder on the capsule body is at the corresponding axial height, in local space.
     * @zh
     * 获取或设置在本地坐标系下的胶囊体上圆柱体的高度。
     */
    get cylinderHeight(): number;
    set cylinderHeight(value: number);
    /**
     * @en
     * Gets or sets the capsule direction, in local space.
     * @zh
     * 获取或设置在本地坐标系下胶囊体的方向。
     */
    get direction(): EAxisDirection;
    set direction(value: EAxisDirection);
    /**
     * @en
     * Gets or sets the capsule height, in local space, with the minimum value being the diameter of the sphere.
     * @zh
     * 获取或设置在本地坐标系下胶囊体的高度，最小值为球的直径。
     */
    get height(): number;
    set height(value: number);
    /**
     * @en
     * Gets the capsule body is at the corresponding axial height, in world space.
     * @zh
     * 获取胶囊体在世界坐标系下相应胶囊体朝向上的高度，只读属性。
     */
    get worldHeight(): number;
    /**
     * @en
     * Gets the wrapper object, through which the lowLevel instance can be accessed.
     * @zh
     * 获取封装对象，通过此对象可以访问到底层实例。
     */
    get shape(): ICapsuleShape;
    private _radius;
    private _cylinderHeight;
    private _direction;
    constructor();
    private _getRadiusScale;
    private _getHeightScale;
}
