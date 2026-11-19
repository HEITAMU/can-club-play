import { RenderStage } from './render-stage';
import { RenderPipeline } from './render-pipeline';
import { Camera } from '../render-scene/scene';
/**
 * @en Render flow information descriptor
 * @zh 渲染流程描述信息。
 */
export interface IRenderFlowInfo {
    name: string;
    priority: number;
    stages: RenderStage[];
    tag?: number;
}
/**
 * @en Render flow is a sub process of the [[RenderPipeline]], it dispatch the render task to all the [[RenderStage]]s.
 * @zh 渲染流程是渲染管线（[[RenderPipeline]]）的一个子过程，它将渲染任务派发到它的所有渲染阶段（[[RenderStage]]）中执行。
 */
export declare abstract class RenderFlow {
    /**
     * @en The name of the render flow
     * @zh 渲染流程的名字
     */
    get name(): string;
    /**
     * @en Priority of the current flow
     * @zh 当前渲染流程的优先级。
     */
    get priority(): number;
    /**
     * @en Tag of the current flow
     * @zh 当前渲染流程的标签。
     */
    get tag(): number;
    /**
     * @en The stages of flow.
     * @zh 渲染流程 stage 列表。
     * @readonly
     */
    get stages(): RenderStage[];
    protected _name: string;
    protected _priority: number;
    protected _tag: number;
    protected _stages: RenderStage[];
    protected _pipeline: RenderPipeline;
    /**
     * @en Get pipeline
     * @zh 获取pipeline
     */
    get pipeline(): RenderPipeline;
    /**
     * @en The initialization process, user shouldn't use it in most case, only useful when need to generate render pipeline programmatically.
     * @zh 初始化函数，正常情况下不会用到，仅用于程序化生成渲染管线的情况。
     * @param info The render flow information
     */
    initialize(info: IRenderFlowInfo): boolean;
    /**
     * @en Activate the current render flow in the given pipeline
     * @zh 为指定的渲染管线开启当前渲染流程
     * @param pipeline The render pipeline to activate this render flow
     */
    activate(pipeline: RenderPipeline): void;
    /**
     * @en Render function, it basically run all render stages in sequence for the given view.
     * @zh 渲染函数，对指定的渲染视图按顺序执行所有渲染阶段。
     * @param view Render view。
     */
    render(camera: Camera): void;
    /**
     * @en Destroy function.
     * @zh 销毁函数。
     */
    destroy(): void;
}
