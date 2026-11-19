import { Material } from '../../asset/assets/material';
import { RenderingSubMesh } from '../../asset/assets/rendering-sub-mesh';
import { Mesh } from '../assets/mesh';
import { Skeleton } from '../assets/skeleton';
import { DescriptorSet, Attribute } from '../../gfx';
import { Node } from '../../scene-graph/node';
import { MorphModel } from './morph-model';
import { IMacroPatch } from '../../render-scene';
import { SubModel } from '../../render-scene/scene';
/**
 * @en
 * The skinning model that is using real-time pose calculation.
 * @zh
 * 实时计算动画的蒙皮模型。
 */
export declare class SkinningModel extends MorphModel {
    private _buffers;
    private _dataArray;
    private _joints;
    private _bufferIndices;
    private _realTimeJointTexture;
    private _realTimeTextureMode;
    constructor();
    destroy(): void;
    /**
     * @en Abstract function for [[BakedSkinningModel]], empty implementation.
     * @zh 由 [[BakedSkinningModel]] 继承的空函数。
     */
    uploadAnimation(): void;
    /**
     * @en Bind the skeleton with its skinning root node and the mesh data.
     * @zh 在模型中绑定一个骨骼，需要提供骨骼的蒙皮根节点和蒙皮网格数据。
     * @param skeleton @en The skeleton to be bound @zh 要绑定的骨骼
     * @param skinningRoot @en The skinning root of the skeleton @zh 骨骼的蒙皮根节点
     * @param mesh @en The mesh @zh 蒙皮网格
     * @returns void
     */
    bindSkeleton(skeleton?: Skeleton | null, skinningRoot?: Node | null, mesh?: Mesh | null): void;
    /**
     * @en Update world transform and bounding boxes for the model
     * @zh 更新模型的世界矩阵和包围盒
     * @param stamp @en The update time stamp @zh 更新的时间戳
     */
    updateTransform(stamp: number): void;
    /**
     * @en Update uniform buffer objects for rendering.
     * @zh 更新用于渲染的 UBO
     * @param stamp @en The update time stamp @zh 更新的时间戳
     * @returns @en successful or not @zh 更新是否成功
     */
    updateUBOs(stamp: number): boolean;
    /**
     * @en Initialize sub model with the sub mesh data and the material
     * @zh 用子网格数据和材质初始化一个子模型
     * @param idx @en The index of the sub model to be initialized @zh 需要初始化的子模型序号
     * @param subMeshData @en The sub mesh data @zh 子网格数据
     * @param mat @en The material @zh 子模型材质
     */
    initSubModel(idx: number, subMeshData: RenderingSubMesh, mat: Material): void;
    getMacroPatches(subModelIndex: number): IMacroPatch[] | null;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _updateLocalDescriptors(submodelIdx: number, descriptorSet: DescriptorSet): void;
    protected _updateInstancedAttributes(attributes: Attribute[], subModel: SubModel): void;
    private _ensureEnoughBuffers;
    private _initRealTimeJointTexture;
    private _bindRealTimeJointTexture;
    private _updateRealTimeJointTextureBuffer;
}
