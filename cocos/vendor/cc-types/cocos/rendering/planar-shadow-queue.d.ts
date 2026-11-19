import { CommandBuffer, Device, RenderPass } from '../gfx';
import { Camera } from '../render-scene/scene';
import { PipelineRuntime } from './custom/pipeline';
export declare class PlanarShadowQueue {
    private _subModelArray;
    private _shaderArray;
    private _passArray;
    private _castModels;
    private _instancedQueue;
    private _pipeline;
    constructor(pipeline: PipelineRuntime);
    /**
     * @en
     * clear planar-shadow queue
     * @zh
     * 清除 planar-shadow 渲染队列数据
     */
    clear(): void;
    gatherShadowPasses(camera: Camera, cmdBuff: CommandBuffer): void;
    recordCommandBuffer(device: Device, renderPass: RenderPass, cmdBuff: CommandBuffer): void;
}
