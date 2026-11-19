import { Collider } from './collider';
import { ITerrainShape } from '../../../spec/i-physics-shape';
import { ITerrainAsset } from '../../../spec/i-external';
/**
 * @en
 * Terrain collider component.
 * @zh
 * 地形碰撞器。
 */
export declare class TerrainCollider extends Collider {
    /**
     * @en
     * Gets or sets the terrain assets referenced by this collider.
     * @zh
     * 获取或设置此碰撞体引用的网格资源.
     */
    get terrain(): ITerrainAsset | null;
    set terrain(value: ITerrainAsset | null);
    /**
     * @en
     * Gets the wrapper object, through which the lowLevel instance can be accessed.
     * @zh
     * 获取封装对象，通过此对象可以访问到底层实例。
     */
    get shape(): ITerrainShape;
    protected onEnable(): void;
    private _terrain;
    constructor();
}
