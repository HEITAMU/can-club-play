import { Collider } from './collider';
import { Mesh } from '../../../../3d/assets';
import { ITrimeshShape } from '../../../spec/i-physics-shape';
/**
 * @en
 * Triangle mesh collider component.
 * @zh
 * 三角网格碰撞器。
 */
export declare class MeshCollider extends Collider {
    /**
     * @en
     * Gets or sets the mesh assets referenced by this collider.
     * @zh
     * 获取或设置此碰撞体引用的网格资源.
     */
    get mesh(): Mesh | null;
    set mesh(value: Mesh | null);
    /**
     * @en
     * Gets or sets whether the collider replaces the mesh with a convex shape.
     * @zh
     * 获取或设置此碰撞体是否用凸形状代替网格.
     */
    get convex(): boolean;
    set convex(value: boolean);
    /**
     * @en
     * Gets the wrapper object, through which the lowLevel instance can be accessed.
     * @zh
     * 获取封装对象，通过此对象可以访问到底层实例。
     */
    get shape(): ITrimeshShape;
    protected onEnable(): void;
    private _mesh;
    private _convex;
    constructor();
}
