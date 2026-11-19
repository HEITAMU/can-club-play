import { Device, DescriptorSet } from '../../gfx';
import { Mesh } from './mesh';
import { IMacroPatch } from '../../render-scene';
/**
 * @en Interface for classes which control the rendering of morph resources.
 * @zh 支持形变网格渲染的基类。
 */
export interface MorphRendering {
    createInstance(): MorphRenderingInstance;
}
/**
 * @en The instance of [[MorphRendering]] for dedicated control in the mesh renderer.
 * The root [[MorphRendering]] is owned by [[Mesh]] asset, each [[MeshRenderer]] can have its own morph rendering instance.
 * @zh 用于网格渲染器中独立控制 [[MorphRendering]] 的实例。原始 [[MorphRendering]] 被 [[Mesh]] 资源持有，每个 [[MeshRenderer]] 都持有自己的形变网格渲染实例。
 */
export interface MorphRenderingInstance {
    /**
     * Sets weights of targets of specified sub mesh.
     * @param subMeshIndex
     * @param weights
     */
    setWeights(subMeshIndex: number, weights: number[]): void;
    /**
     * Adapts pipeline state to do the rendering.
     * @param subMeshIndex
     * @param pipelineState
     */
    adaptPipelineState(subMeshIndex: number, descriptorSet: DescriptorSet): void;
    /**
     * Acquire the define overrides needed to do the rendering.
     */
    requiredPatches(subMeshIndex: number): IMacroPatch[] | null;
    /**
     * Destroy the rendering instance.
     */
    destroy(): void;
}
/**
 * @en Create morph rendering from mesh which contains morph targets data.
 * @zh 从包含形变对象的网格资源中创建形变网格渲染对象。
 * @param mesh @en The mesh to create morph rendering from. @zh 用于创建形变网格渲染对象的原始网格资源。
 * @param gfxDevice @en The device instance acquired from [[Root]]. @zh 设备对象实例，可以从 [[Root]] 获取。
 */
export declare function createMorphRendering(mesh: Mesh, gfxDevice: Device): MorphRendering;
/**
 * @en Standard morph rendering class, it supports both GPU and CPU based morph blending.
 * If sub mesh morph targets count is less than [[pipeline.UBOMorphEnum.MAX_MORPH_TARGET_COUNT]], then GPU based blending is enabled.
 * Each of the sub-mesh morph has its own [[MorphRenderingInstance]],
 * its morph target weights, render pipeline state and strategy of morph blending are controlled separately.
 * @zh 标准形变网格渲染类，它同时支持 CPU 和 GPU 的形变混合计算。
 * 如果子网格形变目标数量少于 [[pipeline.UBOMorphEnum.MAX_MORPH_TARGET_COUNT]]，那么就会使用基于 GPU 的形变混合计算。
 * 每个子网格形变都使用自己独立的 [[MorphRenderingInstance]]，它的形变目标权重、渲染管线状态和形变混合计算策略都是独立控制的。
 */
export declare class StdMorphRendering implements MorphRendering {
    private _mesh;
    private _subMeshRenderings;
    constructor(mesh: Mesh, gfxDevice: Device);
    createInstance(): MorphRenderingInstance;
}
