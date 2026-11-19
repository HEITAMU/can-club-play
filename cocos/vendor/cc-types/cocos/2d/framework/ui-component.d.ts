import { IBatcher } from '../renderer/i-batcher';
import { Component } from '../../scene-graph/component';
import { Node } from '../../scene-graph';
import { Stage } from '../renderer/stencil-manager';
/**
 * @en Legacy 2D base class for rendering component, please use [[UIRenderer]] instead.
 * This component will setup NodeUIProperties.uiComp in its owner [[Node]].
 * @zh 旧的 2D 渲染组件基类，请使用 [[UIRenderer]] 替代。
 * 这个组件会设置 [[Node]] 上的 NodeUIProperties.uiComp。
 * @deprecated since v3.4.1, please use [[UIRenderer]] instead.
 */
export declare class UIComponent extends Component {
    protected _lastParent: Node | null;
    constructor();
    __preload(): void;
    onEnable(): void;
    onDisable(): void;
    onDestroy(): void;
    /**
     * @en Post render data submission procedure, it's executed after assembler updated for all children.
     * It may assemble some extra render data to the geometry buffers, or it may only change some render states.
     * Don't call it unless you know what you are doing.
     * @zh 后置渲染数据组装程序，它会在所有子节点的渲染数据组装完成后被调用。
     * 它可能会组装额外的渲染数据到顶点数据缓冲区，也可能只是重置一些渲染状态。
     * 注意：不要手动调用该函数，除非你理解整个流程。
     * @deprecated since v3.4.1, please use [[UIRenderer]] instead.
     */
    postUpdateAssembler(render: IBatcher): void;
    /**
     * @deprecated since v3.4.1, please use [[UIRenderer]] instead.
     */
    markForUpdateRenderData(enable?: boolean): void;
    /**
     * @deprecated since v3.4.1, please use [[UIRenderer]] instead.
     */
    stencilStage: Stage;
    /**
     * @deprecated since v3.4.1, please use [[UIRenderer]] instead.
     */
    setNodeDirty(): void;
    /**
     * @deprecated since v3.4.1, please use [[UIRenderer]] instead.
     */
    setTextureDirty(): void;
}
