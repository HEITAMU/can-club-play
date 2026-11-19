import { ModelRenderer } from '../../misc/model-renderer';
import { IBatcher } from '../renderer/i-batcher';
import { Stage } from '../renderer/stencil-manager';
import { Component } from '../../scene-graph/component';
import { RenderEntity } from '../renderer/render-entity';
import { RenderData } from '../renderer/render-data';
/**
 * @en
 * The component of model.
 * When you place particles or models in the UI, you must add this component to render.
 * The component must be placed on a node with the [[MeshRenderer]] or the [[ParticleSystem]].
 *
 * @zh
 * UI 模型基础组件。
 * 当你在 UI 中放置模型或者粒子的时候，必须添加该组件才能渲染。该组件必须放置在带有 [[MeshRenderer]] 或者 [[ParticleSystem]] 组件的节点上。
 * @deprecated This component is not recommended to be used, please use Render Texture instead.
 * See [UIMeshRenderer Reference](https://docs.cocos.com/creator/manual/en/ui-system/components/editor/ui-model.html)
 */
export declare class UIMeshRenderer extends Component {
    constructor();
    /**
     * @en Get the model component on this node
     * @zh 获取同节点的 model 组件
     */
    get modelComponent(): ModelRenderer | null;
    private _modelComponent;
    private _UIModelNativeProxy;
    protected _renderEntity: RenderEntity;
    _dirtyVersion: number;
    _internalId: number;
    __preload(): void;
    onEnable(): void;
    onDisable(): void;
    onLoad(): void;
    onDestroy(): void;
    /**
     * @en Render data submission procedure, it update and assemble the render data to 2D data buffers before all children submission process.
     * Usually called each frame when the ui flow assemble all render data to geometry buffers.
     * Don't call it unless you know what you are doing.
     * @zh 渲染数据组装程序，这个方法会在所有子节点数据组装之前更新并组装当前组件的渲染数据到 UI 的顶点数据缓冲区中。
     * 一般在 UI 渲染流程中调用，用于组装所有的渲染数据到顶点数据缓冲区。
     * 注意：不要手动调用该函数，除非你理解整个流程。
     * @deprecated Since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    _render(render: IBatcher): boolean;
    /**
     * @deprecated Since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    fillBuffers(render: IBatcher): void;
    /**
     * @deprecated Since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    updateRenderer(): void;
    private _uploadRenderData;
    /**
     * @en Post render data submission procedure, it's executed after assembler updated for all children.
     * It may assemble some extra render data to the geometry buffers, or it may only change some render states.
     * Don't call it unless you know what you are doing.
     * @zh 后置渲染数据组装程序，它会在所有子节点的渲染数据组装完成后被调用。
     * 它可能会组装额外的渲染数据到顶点数据缓冲区，也可能只是重置一些渲染状态。
     * 注意：不要手动调用该函数，除非你理解整个流程。
     */
    postUpdateAssembler(render: IBatcher): void;
    update(): void;
    private _fitUIRenderQueue;
    /**
     * @deprecated Since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    markForUpdateRenderData(enable?: boolean): void;
    /**
     * An internal method that marks the render data of the current component as modified so that the render data is recalculated.
     * Adding this method is to minify the function name by `@mangle` since this method is frequently used in the engine.
     * To keep the compatibility, the original method is still kept.
     * @engineInternal
     * @mangle
     */
    _markForUpdateRenderData(enable?: boolean): void;
    /**
     * @deprecated Since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    stencilStage: Stage;
    /**
     * @deprecated Since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    setNodeDirty(): void;
    /**
     * @deprecated Since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    setTextureDirty(): void;
    protected _canRender(): boolean;
    /**
     * @deprecated Since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    get renderEntity(): RenderEntity;
    protected _renderData: RenderData | null;
    /**
     * @deprecated Since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    get renderData(): RenderData | null;
}
