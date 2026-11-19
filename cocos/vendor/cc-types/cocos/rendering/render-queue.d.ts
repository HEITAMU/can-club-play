import { CachedArray } from '../core';
import { IRenderObject, IRenderPass, IRenderQueueDesc } from './define';
import { RenderPass, Device, CommandBuffer } from '../gfx';
import { RenderQueueDesc } from './pipeline-serialization';
/**
 * @en Comparison sorting function. Opaque objects are sorted by priority -> depth front to back -> shader ID.
 * @zh 比较排序函数。不透明对象按优先级 -> 深度由前向后 -> Shader ID 顺序排序。
 */
export declare function opaqueCompareFn(a: IRenderPass, b: IRenderPass): number;
/**
 * @en Comparison sorting function. Transparent objects are sorted by priority -> depth back to front -> shader ID.
 * @zh 比较排序函数。半透明对象按优先级 -> 深度由后向前 -> Shader ID 顺序排序。
 */
export declare function transparentCompareFn(a: IRenderPass, b: IRenderPass): number;
/**
 * @en The render queue. It manages a GFX [[RenderPass]] queue which will be executed by the [[RenderStage]].
 * @zh 渲染队列。它管理一个 GFX [[RenderPass]] 队列，队列中的渲染过程会被 [[RenderStage]] 所执行。
 */
export declare class RenderQueue {
    /**
     * @en A cached array of render passes
     * @zh 基于缓存数组的渲染过程队列。
     */
    queue: CachedArray<IRenderPass>;
    private _passDesc;
    private _passPool;
    /**
     * @en Construct a RenderQueue with render queue descriptor
     * @zh 利用渲染队列描述来构造一个 RenderQueue。
     * @param desc Render queue descriptor
     */
    constructor(desc: IRenderQueueDesc);
    /**
     * @en Clear the render queue
     * @zh 清空渲染队列。
     */
    clear(): void;
    /**
     * @en Insert a render pass into the queue
     * @zh 插入渲染过程。
     * @param renderObj The render object of the pass
     * @param modelIdx The model id
     * @param passIdx The pass id
     * @returns Whether the new render pass is successfully added
     */
    insertRenderPass(renderObj: IRenderObject, subModelIdx: number, passIdx: number): boolean;
    /**
     * @en Sort the current queue
     * @zh 排序渲染队列。
     */
    sort(): void;
    recordCommandBuffer(device: Device, renderPass: RenderPass, cmdBuff: CommandBuffer): void;
}
export declare function convertRenderQueue(desc: RenderQueueDesc): RenderQueue;
/**
 * @en Clear the given render queue
 * @zh 清空指定的渲染队列
 * @param rq The render queue
 */
export declare function renderQueueClearFunc(rq: RenderQueue): void;
/**
 * @en Sort the given render queue
 * @zh 对指定的渲染队列执行排序
 * @param rq The render queue
 */
export declare function renderQueueSortFunc(rq: RenderQueue): void;
