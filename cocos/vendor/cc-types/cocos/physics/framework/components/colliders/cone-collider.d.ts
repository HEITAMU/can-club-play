import { Collider } from './collider';
import { IConeShape } from '../../../spec/i-physics-shape';
import { EAxisDirection } from '../../physics-enum';
/**
 * @en
 * Cone collider component.
 * @zh
 * 圆锥体碰撞器。
 */
export declare class ConeCollider extends Collider {
    /**
     * @en
     * Gets or sets the radius of the circle on the cone body, in local space.
     * @zh
     * 获取或设置圆锥体上圆面半径。
     */
    get radius(): number;
    set radius(value: number);
    /**
     * @en
     * Gets or sets the cone body is at the corresponding axial height, in local space.
     * @zh
     * 获取或设置圆锥体在相应轴向的高度。
     */
    get height(): number;
    set height(value: number);
    /**
     * @en
     * Gets or sets the cone direction, in local space.
     * @zh
     * 获取或设置在圆锥体本地空间上的方向。
     */
    get direction(): EAxisDirection;
    set direction(value: EAxisDirection);
    get shape(): IConeShape;
    private _radius;
    private _height;
    private _direction;
    constructor();
}
