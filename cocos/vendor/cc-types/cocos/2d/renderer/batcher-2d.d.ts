import { Camera, Model } from '../../render-scene/scene';
import type { UIStaticBatch } from '../components/ui-static-batch';
import { Material } from '../../asset/assets/material';
import { RenderRoot2D, UIRenderer } from '../framework';
import { Texture, Device, Attribute, Sampler, InputAssembler } from '../../gfx';
import { CachedArray } from '../../core';
import { Root } from '../../root';
import { Node } from '../../scene-graph';
import { DrawBatch2D } from './draw-batch';
import { SpriteFrame } from '../assets';
import { TextureBase } from '../../asset/assets/texture-base';
import { IBatcher } from './i-batcher';
import { StaticVBAccessor } from './static-vb-accessor';
import { BaseRenderData } from './render-data';
import { UIMeshRenderer } from '../components/ui-mesh-renderer';
import { NativeBatcher2d } from './native-2d';
import { MeshBuffer } from './mesh-buffer';
import { IAssembler } from './base';
/**
 * @engineInternal
 */
export declare function _setSorting2DCount(v: number): void;
/**
 * @en UI rendering process
 * @zh UI 渲染流程
 */
export declare class Batcher2D implements IBatcher {
    private _root;
    protected _nativeObj: NativeBatcher2d;
    get nativeObj(): NativeBatcher2d;
    get currBufferAccessor(): StaticVBAccessor;
    get batches(): CachedArray<DrawBatch2D>;
    set currStaticRoot(value: UIStaticBatch | null);
    /**
     * @deprecated since v3.8.7
     */
    set currIsStatic(value: boolean);
    device: Device;
    private _screens;
    private _staticVBBuffer;
    private _bufferAccessors;
    private _drawBatchPool;
    private _batches;
    private _currBID;
    private _indexStart;
    private _emptyMaterial;
    private _currRenderData;
    private _currMaterial;
    private _currTexture;
    private _currSampler;
    private _currStaticRoot;
    private _currComponent;
    private _currTransform;
    private _currTextureHash;
    private _currSamplerHash;
    private _currLayer;
    private _currDepthStencilStateStage;
    private _currHash;
    private _currIsMiddleware;
    private _middlewareEnableBatch;
    private _middlewareBuffer;
    private _middlewareIndexStart;
    private _middlewareIndexCount;
    private _pOpacity;
    private _opacityDirty;
    private _descriptorSetCache;
    private _meshDataArray;
    private _maskClearModel;
    private _maskClearMtl;
    private _maskModelMesh;
    private _recordedRendererInfoQueue;
    constructor(_root: Root);
    private getRecordedRendererInfoQueue;
    initialize(): boolean;
    destroy(): void;
    private syncRootNodesToNative;
    /**
     * @en
     * Add the managed Canvas.
     *
     * @zh
     * 添加屏幕组件管理。
     *
     * @param comp @en The render root of 2d.
     *             @zh 2d 渲染入口组件。
     */
    addScreen(comp: RenderRoot2D): void;
    /**
     * @zh
     * Removes the Canvas from the list.
     *
     * @param comp @en The target to removed.
     *             @zh 被移除的屏幕。
     */
    removeScreen(comp: RenderRoot2D): void;
    sortScreens(): void;
    getFirstRenderCamera(node: Node): Camera | null;
    update(): void;
    uploadBuffers(): void;
    reset(): void;
    /**
     * @zh 如果有必要，为相应的顶点布局切换网格缓冲区。
     * @en Switch the mesh buffer for corresponding vertex layout if necessary.
     * @param attributes use VertexFormat.vfmtPosUvColor by default
     */
    switchBufferAccessor(attributes?: Attribute[]): StaticVBAccessor;
    registerBufferAccessor(key: number, accessor: StaticVBAccessor): void;
    updateBuffer(attributes: Attribute[], bid: number): void;
    /**
     * @en
     * Render component data submission process of UI.
     * The submitted vertex data is the UI for world coordinates.
     * For example: The UI components except Graphics and UIModel.
     *
     * @zh
     * UI 渲染组件数据提交流程（针对提交的顶点数据是世界坐标的提交流程，例如：除 Graphics 和 UIModel 的大部分 ui 组件）。
     * 此处的数据最终会生成需要提交渲染的 model 数据。
     *
     * @param comp - The committed renderable component
     * @param renderData - The render data being committed
     * @param frame - Texture or sprite frame related to the draw batch, could be null
     * @param assembler - The assembler for the current component, could be null
     * @param transform - Node type transform, if passed, then batcher will consider it's using model matrix, could be null
     */
    commitComp(comp: UIRenderer, renderData: BaseRenderData | null, frame: TextureBase | SpriteFrame | null, assembler: IAssembler, transform: Node | null): void;
    /**
     * @en
     * Render component data submission process for individual [[gfx.InputAssembler]]
     * @zh
     * 渲染组件中针对独立 [[gfx.InputAssembler]] 的提交流程
     * 例如：Spine 和 DragonBones 等包含动态数据和材质的组件在内部管理 IA 并提交批次
     * @param comp - The committed renderable component
     * @param ia - The committed [[gfx.InputAssembler]]
     * @param tex - The texture used
     * @param mat - The material used
     * @param [transform] - The related node transform if the render data is based on node's local coordinates
     * @deprecated since v3.6.2, please use [[commitMiddleware]] instead
     */
    commitIA(renderComp: UIRenderer, ia: InputAssembler, tex?: TextureBase, mat?: Material, transform?: Node): void;
    /**
     * @en
     * Render component data submission process for middleware2d components
     * @zh
     * 渲染组件中针对2D中间件组件渲染数据的提交流程
     * 例如：Spine 和 DragonBones 包含动态数据和材质的组件
     * @param comp - The committed renderable component
     * @param meshBuffer - The MeshBuffer used
     * @param indexOffset - indices offset
     * @param indexCount - indices count
     * @param tex - The texture used
     * @param mat - The material used
     * @param enableBatch - component support multi draw batch or not
     */
    commitMiddleware(comp: UIRenderer, meshBuffer: MeshBuffer, indexOffset: number, indexCount: number, tex: TextureBase, mat: Material, enableBatch: boolean): void;
    /**
     * @en
     * Render component data submission process of UI.
     * The submitted vertex data is the UI for local coordinates.
     * For example: The UI components of Graphics and UIModel.
     *
     * @zh
     * UI 渲染组件数据提交流程（针对例如： Graphics 和 UIModel 等数据量较为庞大的 ui 组件）。
     *
     * @param comp - The committed renderable component
     * @param model - The committed model
     * @param mat - The material used, could be null
     */
    commitModel(comp: UIMeshRenderer | UIRenderer, model: Model | null, mat: Material | null): void;
    setupStaticBatch(staticComp: UIStaticBatch, bufferAccessor: StaticVBAccessor): void;
    endStaticBatch(): void;
    /**
     * @en
     * Submit separate render data.
     * This data does not participate in the batch.
     *
     * @zh
     * 提交独立渲染数据.
     * @param comp @en The UIStaticBatch component.
     *             @zh 静态组件
     */
    commitStaticBatch(comp: UIStaticBatch): void;
    /**
     * @en
     * End a section of render data and submit according to the batch condition.
     *
     * @zh
     * 根据合批条件，结束一段渲染数据并提交。
     */
    autoMergeBatches(renderComp?: UIRenderer): void;
    private mergeBatchesForMiddleware;
    /**
     * @en
     * Force changes to current batch data and merge
     *
     * @zh
     * 强行修改当前批次数据并合并。
     *
     * @param material @en The material of the current batch.
     *                 @zh 当前批次的材质。
     * @param sprite @en Sprite frame of current batch.
     *               @zh 当前批次的精灵帧。
     */
    forceMergeBatches(material: Material, frame: TextureBase | SpriteFrame | null, renderComp: UIRenderer): void;
    resetRenderStates(): void;
    /**
     * @en
     * Forced to merge the data of the previous batch to start a new batch.
     *
     * @zh
     * 强制合并上一个批次的数据，开启新一轮合批。
     */
    finishMergeBatches(): void;
    /**
     * @en
     * Force to change the current material.
     *
     * @zh
     * 强制刷新材质。
     */
    flushMaterial(mat: Material): void;
    private _handleUIRenderer;
    private _recordUIRenderer;
    private _flushRecordedUIRenderers;
    walk(node: Node, level?: number): void;
    private _screenSort;
    /**
     * @engineInternal
     * @mangle
     */
    _releaseDescriptorSetCache(textureHash: number | Texture | null, sampler?: Sampler | null): void;
    private _createClearModel;
    private _insertMaskBatch;
    syncMeshBuffersToNative(accId: number, buffers: MeshBuffer[]): void;
}
