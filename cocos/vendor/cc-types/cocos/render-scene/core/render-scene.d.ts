import { Root } from '../../root';
import { Node } from '../../scene-graph';
import { Camera } from '../scene/camera';
import { DirectionalLight } from '../scene/directional-light';
import { Model } from '../scene/model';
import { SphereLight } from '../scene/sphere-light';
import { SpotLight } from '../scene/spot-light';
import { PointLight } from '../scene/point-light';
import { RangedDirectionalLight } from '../scene/ranged-directional-light';
import { DrawBatch2D } from '../../2d/renderer/draw-batch';
import { LODGroup } from '../scene/lod-group';
export interface IRenderSceneInfo {
    name: string;
}
export interface ISceneNodeInfo {
    name: string;
    isStatic?: boolean;
}
/**
 * @en The result of one raycast operation
 * @zh 一次射线检测的结果
 */
export interface IRaycastResult {
    node: Node;
    distance: number;
}
/**
 * @en The render scene which is created by the [[Root]] and provides all basic render scene elements for the render process.
 * It manages:
 * 1. [[Camera]]s
 * 2. [[Light]]s
 * 3. Renderable objects: [[renderer.Model]]s and `DrawBatchs`
 * @zh 渲染场景，由 [[Root]] 创建，并提供用于渲染流程的所有场景基础元素。它管理：
 * 1. [[Camera]]s：相机
 * 2. [[Light]]s：光源
 * 3. 渲染元素：[[renderer.Model]]s 和 `DrawBatchs`
 */
export declare class RenderScene {
    /**
     * @en The root manager of the renderer.
     * @zh 基础渲染管理器。
     */
    get root(): Root;
    /**
     * @en The name of the render scene.
     * @zh 渲染场景的名称。
     */
    get name(): string;
    /**
     * @en All cameras of the render scene.
     * @zh 渲染场景管理的所有相机。
     */
    get cameras(): Camera[];
    /**
     * @en The main directional light source of the render scene.
     * @zh 渲染场景管理的主方向光源。
     */
    get mainLight(): DirectionalLight | null;
    /**
     * @en All sphere light sources of the render scene.
     * @zh 渲染场景管理的所有球面光源。
     */
    get sphereLights(): Readonly<SphereLight[]>;
    /**
     * @en All spot light sources of the render scene.
     * @zh 渲染场景管理的所有聚光灯光源。
     */
    get spotLights(): Readonly<SpotLight[]>;
    /**
     * @en All point light sources of the render scene.
     * @zh 渲染场景管理的所有点光源。
     */
    get pointLights(): Readonly<PointLight[]>;
    /**
     * @en All ranged directional light sources of the render scene.
     * @zh 渲染场景管理的所有范围平行光光源。
     */
    get rangedDirLights(): Readonly<RangedDirectionalLight[]>;
    /**
     * @en All active models of the render scene.
     * @zh 渲染场景管理的所有模型。
     */
    get models(): Model[];
    /**
     * @en All active 2d draw batches of the render scene.
     * @zh 渲染场景管理的所有 2D 渲染批次对象。
     */
    get batches(): DrawBatch2D[];
    /**
     * @engineInternal
     * @en All LOD groups of the render scene.
     * @zh 渲染场景管理的所有 LOD 组。
     */
    get lodGroups(): readonly LODGroup[];
    private _root;
    private _name;
    private _cameras;
    private _models;
    private _lodGroups;
    private _batches;
    private _directionalLights;
    private _sphereLights;
    private _spotLights;
    private _pointLights;
    private _rangedDirLights;
    private _mainLight;
    private _modelId;
    private _lodStateCache;
    /**
     * Register the creation function of the render scene to root.
     * @internal
     */
    static registerCreateFunc(root: Root): void;
    constructor(root: Root);
    /**
     * @en Initialize the render scene
     * @zh 初始化渲染场景
     * @returns Successful
     */
    initialize(info: IRenderSceneInfo): boolean;
    /**
     * @en The update process of the render scene, it updates all rendering related data for the lights and the models.
     * @zh 渲染场景的更新流程，会更新所有光源和模型的渲染相关数据。
     * @param stamp The update time stamp
     * @returns void
     */
    update(stamp: number): void;
    /**
     * @en Destroy the render scene, dangerous, please do not invoke manually.
     * @zh 销毁渲染场景，请不要手动销毁，会造成未知行为。
     */
    destroy(): void;
    isCulledByLod(camera: Camera, model: Model): boolean;
    /**
     * @en Attach a camera to the render scene
     * @zh 向渲染场景挂载一个相机
     */
    addCamera(cam: Camera): void;
    /**
     * @en Detach a camera to the render scene
     * @zh 从渲染场景移除一个相机
     */
    removeCamera(camera: Camera): void;
    /**
     * @en Detach all cameras to the render scene
     * @zh 从渲染场景移除所有相机
     */
    removeCameras(): void;
    /**
     * @en Sets the main light source for the render scene
     * @zh 给渲染场景设置主光源
     * @param dl The main directional light source
     */
    setMainLight(dl: DirectionalLight | null): void;
    /**
     * @en Remove the main light source from the render scene
     * @zh 从渲染场景移除主光源
     * @param dl The main directional light source, if it's not the actual main light, nothing happens.
     */
    unsetMainLight(dl: DirectionalLight): void;
    /**
     * @en Add a directional light source, only one directional light is active and act as the main light source.
     * @zh 增加一个方向光源，场景中只会有一个方向光是起效的，并且会作为主光源。
     * @param dl The directional light.
     */
    addDirectionalLight(dl: DirectionalLight): void;
    /**
     * @en Remove a directional light source.
     * @zh 删除一个方向光源。
     * @param dl The directional light.
     */
    removeDirectionalLight(dl: DirectionalLight): void;
    /**
     * @en Add a sphere light source.
     * @zh 增加一个球面光源。
     * @param pl The sphere light.
     */
    addSphereLight(pl: SphereLight): void;
    /**
     * @en Remove a sphere light source.
     * @zh 删除一个球面光源。
     * @param pl The sphere light.
     */
    removeSphereLight(pl: SphereLight): void;
    /**
     * @en Add a spot light source.
     * @zh 增加一个聚光灯光源。
     * @param sl The spot light.
     */
    addSpotLight(sl: SpotLight): void;
    /**
     * @en Remove a spot light source.
     * @zh 删除一个聚光灯光源。
     * @param sl The spot light.
     */
    removeSpotLight(sl: SpotLight): void;
    /**
     * @en Remove all sphere light sources.
     * @zh 删除所有球面光源。
     */
    removeSphereLights(): void;
    /**
     * @en Remove all spot light sources.
     * @zh 删除所有聚光灯光源。
     */
    removeSpotLights(): void;
    /**
     * @en Add a point light source.
     * @zh 增加一个点光源。
     * @param pl @en The point light. @zh 点光源。
     */
    addPointLight(pl: PointLight): void;
    /**
     * @en Remove a sphere light source.
     * @zh 删除一个点光源。
     * @param pl @en The point light. @zh 点光源。
     */
    removePointLight(pl: PointLight): void;
    /**
     * @en Remove all point light sources.
     * @zh 删除所有点光源。
     */
    removePointLights(): void;
    /**
     * @en Add a ranged directional light source.
     * @zh 增加一个范围平行光源。
     * @param l @en The ranged directional light. @zh 范围平行光。
     */
    addRangedDirLight(l: RangedDirectionalLight): void;
    /**
     * @en Remove a ranged directional light source.
     * @zh 删除一个范围平行光源。
     * @param l @en The ranged directional light. @zh 范围平行光。
     */
    removeRangedDirLight(l: RangedDirectionalLight): void;
    /**
     * @en Remove all ranged directional light sources.
     * @zh 删除所有范围平行光源。
     */
    removeRangedDirLights(): void;
    /**
     * @en Add a model, all models attached to the render scene will be submitted for rendering.
     * @zh 增加一个模型，渲染场景上挂载的所有模型都会被提交渲染。
     * @param m The model.
     */
    addModel(m: Model): void;
    /**
     * @en Remove a model, model removed will no longer be submitted for rendering.
     * @zh 删除一个模型，移除的模型将不再被提交渲染。
     * @param m The model.
     */
    removeModel(model: Model): void;
    /**
     * @en Remove all models.
     * @zh 删除所有模型。
     */
    removeModels(): void;
    /**
     * @en Add a draw batch of 2d objects, all draw batches attached to the render scene will be submitted for rendering.
     * @zh 增加一个 2D 渲染批次，渲染场景上挂载的所有 2D 渲染批次都会被提交渲染。
     * @param batch The draw batch.
     * @internal
     * @deprecated since v3.6.0, this is an engine private interface that will be removed in the future.
     */
    addBatch(batch: DrawBatch2D): void;
    /**
     * @en Remove a draw batch of 2d objects, draw batch removed will no longer be submitted for rendering.
     * @zh 删除一个 2D 渲染批次，移除的 2D 渲染批次将不再被提交渲染。
     * @param batch The draw batch.
     * @internal
     * @deprecated since v3.6.0, this is an engine private interface that will be removed in the future.
     */
    removeBatch(batch: DrawBatch2D): void;
    /**
     * @en Remove all 2d draw batches.
     * @zh 删除所有 2D 渲染批次。
     * @internal
     * @deprecated since v3.6.0, this is an engine private interface that will be removed in the future.
     */
    removeBatches(): void;
    /**
     * @engineInternal
     * @en Add a LOD group， all LOD groups attached to the render scene will be submitted for rendering.
     * @zh 增加一个LOD 组，渲染场景上挂载的所有LOD 组都会被提交渲染。
     * @param lodGroup the LOD group
     */
    addLODGroup(lodGroup: LODGroup): void;
    /**
     * @engineInternal
     * @mangle
     * @en Remove a LOD group, the LOD group removed will no longer be submitted for rendering.
     * @zh 删除一个LOD 组，移除的LOD 组将不再被提交渲染。
     * @param lodGroup the LOD group
     */
    removeLODGroup(lodGroup: LODGroup): void;
    /**
     * @engineInternal
     * @mangle
     * @en Remove all LOD groups.
     * @zh 删除所有LOD 组。
     */
    removeLODGroups(): void;
    /**
     * @en Notify all models that the global pipeline state have been updated so that they can update their render data and states.
     * @zh 通知所有模型全局管线状态已更新，需要更新自身状态。
     */
    onGlobalPipelineStateChanged(): void;
    /**
     * @en Generate a new model id.
     * @zh 生成一个新的模型 ID
     * @returns The model id
     */
    generateModelId(): number;
}
