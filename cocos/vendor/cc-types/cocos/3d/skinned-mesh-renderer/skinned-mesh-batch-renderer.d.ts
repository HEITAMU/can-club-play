import { Material } from '../../asset/assets/material';
import { Mesh } from '../assets/mesh';
import { Skeleton } from '../assets/skeleton';
import { Texture2D } from '../../asset/assets/texture-2d';
import { Mat4, Vec2 } from '../../core';
import { SkinnedMeshRenderer } from './skinned-mesh-renderer';
export declare class SkinnedMeshUnit {
    /**
     * @en Skinned mesh of this unit.
     * @zh 子蒙皮模型的网格模型。
     */
    mesh: Mesh | null;
    /**
     * @en Skeleton of this unit.
     * @zh 子蒙皮模型的骨骼。
     */
    skeleton: Skeleton | null;
    /**
     * @en Skinning material of this unit.
     * @zh 子蒙皮模型使用的材质。
     */
    material: Material | null;
    /**
     * @en Local transform matrix
     * @zh 本地变换矩阵
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _localTransform: Mat4;
    private _offset;
    private _size;
    /**
     * @en UV offset on texture atlas.
     * @zh 在图集中的 uv 坐标偏移。
     */
    set offset(offset: Vec2);
    get offset(): Vec2;
    /**
     * @en UV extent on texture atlas.
     * @zh 在图集中占的 UV 尺寸。
     */
    set size(size: Vec2);
    get size(): Vec2;
    /**
     * @en Convenient setter, copying all necessary information from target [[SkinnedMeshRenderer]] component.
     * @zh 复制目标 [[SkinnedMeshRenderer]] 的所有属性到本单元，方便快速配置。
     */
    set copyFrom(comp: SkinnedMeshRenderer | null);
    get copyFrom(): SkinnedMeshRenderer | null;
}
/**
 * @en The skinned mesh batch renderer component, batches multiple skeleton-sharing [[SkinnedMeshRenderer]].
 * @zh 蒙皮模型合批组件，用于合并绘制共享同一骨骼资源的所有蒙皮网格。
 */
export declare class SkinnedMeshBatchRenderer extends SkinnedMeshRenderer {
    /**
     * @en Size of the generated texture atlas.
     * @zh 合图生成的最终图集的边长。
     */
    atlasSize: number;
    /**
     * @en
     * Texture properties that will be actually using the generated atlas.<br>
     * The first unit's texture will be used if not specified.
     * @zh
     * 材质中真正参与合图的贴图属性，不参与的属性统一使用第一个 unit 的贴图。
     */
    batchableTextureNames: string[];
    /**
     * @en Source skinning model components, containing all the data to be batched.
     * @zh 合批前的子蒙皮模型数组，最主要的数据来源。
     */
    units: SkinnedMeshUnit[];
    private _textures;
    private _batchMaterial;
    constructor();
    get mesh(): Mesh | null;
    set mesh(val: Mesh | null);
    get skeleton(): Skeleton | null;
    set skeleton(val: Skeleton | null);
    onLoad(): void;
    onDestroy(): void;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _onMaterialModified(idx: number, material: Material | null): void;
    cook(): void;
    cookMaterials(): void;
    cookSkeletons(): void;
    cookMeshes(): void;
    protected cookTextures(target: Texture2D, prop: string, passIdx: number): void;
    protected createTexture(prop: string): Texture2D;
    protected resizeAtlases(): void;
    private _createUnitMesh;
}
