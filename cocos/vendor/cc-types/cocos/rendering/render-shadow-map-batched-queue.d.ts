import { Device, RenderPass, CommandBuffer } from '../gfx';
import { Light } from '../render-scene/scene/light';
import { Model } from '../render-scene/scene/model';
import { Camera } from '../render-scene/scene';
import { PipelineRuntime } from './custom/pipeline';
/**
 * @zh
 * 阴影渲染队列
 */
export declare class RenderShadowMapBatchedQueue {
    private _pipeline;
    private _subModelsArray;
    private _passArray;
    private _shaderArray;
    private _instancedQueue;
    constructor(pipeline: PipelineRuntime);
    gatherLightPasses(camera: Camera, light: Light, cmdBuff: CommandBuffer, level?: number): void;
    /**
     * @zh
     * clear light-Batched-Queue
     */
    clear(): void;
    add(model: Model, level: number): void;
    /**
     * @zh
     * record CommandBuffer
     */
    recordCommandBuffer(device: Device, renderPass: RenderPass, cmdBuff: CommandBuffer): void;
}
