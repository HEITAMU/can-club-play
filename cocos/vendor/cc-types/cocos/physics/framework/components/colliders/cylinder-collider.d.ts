import { Collider } from './collider';
import { ICylinderShape } from '../../../spec/i-physics-shape';
import { EAxisDirection } from '../../physics-enum';
/**
 * @en
 * Cylinder collider component.
 * @zh
 * 圆柱体碰撞器。
 */
export declare class CylinderCollider extends Collider {
    /**
     * @en
     * Gets or sets the radius of the circle on the cylinder body, in local space.
     * @zh
     * 获取或设置圆柱体上圆面半径。
     */
    get radius(): number;
    set radius(value: number);
    /**
     * @en
     * Gets or sets the cylinder body is at the corresponding axial height, in local space.
     * @zh
     * 获取或设置圆柱体在相应轴向的高度。
     */
    get height(): number;
    set height(value: number);
    /**
     * @en
     * Gets or sets the cylinder direction, in local space.
     * @zh
     * 获取或设置在圆柱体本地空间上的方向。
     */
    get direction(): EAxisDirection;
    set direction(value: EAxisDirection);
    get shape(): ICylinderShape;
    private _radius;
    private _height;
    private _direction;
    constructor();
}
