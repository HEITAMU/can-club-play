import { Model } from '../../render-scene/scene/model';
import { MorphRenderingInstance } from '../assets/morph-rendering';
import { Material } from '../../asset/assets/material';
import { RenderingSubMesh } from '../../asset/assets/rendering-sub-mesh';
import { DescriptorSet } from '../../gfx';
import { IMacroPatch } from '../../render-scene';
/**
 * @en
 * The model that support morph target rendering.
 * @zh
 * 支持渲染蒙皮形变的模型。
 */
export declare class MorphModel extends Model {
    private _morphRenderingInstance;
    private _usedMaterials;
    constructor();
    /**
     * @en Acquire the material's macro patches for the given sub model.
     * @zh 获取指定子模型的材质宏组合。
     * @param subModelIndex @en The index for the requested sub model. @zh 子模型的序号。
     * @returns @en The macro patches. @zh 材质宏组合
     */
    getMacroPatches(subModelIndex: number): IMacroPatch[] | null;
    /**
     * @en Initialize a sub model with the sub mesh data and the material.
     * @zh 用子网格数据和材质初始化一个子模型。
     * @param idx @en The index of the sub model @zh 子模型的序号
     * @param subMeshData @en The sub mesh data to be set @zh 需要设置的子网格
     * @param mat sub material
     */
    initSubModel(subModelIndex: number, subMeshData: RenderingSubMesh, material: Material): void;
    destroy(): void;
    /**
     * @en Sets the material for a given sub model.
     * @zh 给指定的子模型设置材质。
     * @param subModelIndex @en The index of the sub model @zh 子模型的序号
     * @param material @en The material to be set @zh 需要设置的材质
     * @returns void
     */
    setSubModelMaterial(subModelIndex: number, material: Material): void;
    /**
     * Sets morph rendering instance for the model, it's managed by the MeshRenderer
     * @internal
     */
    setMorphRendering(morphRendering: MorphRenderingInstance): void;
    protected _updateLocalDescriptors(submodelIdx: number, descriptorSet: DescriptorSet): void;
    private _launderMaterial;
}
