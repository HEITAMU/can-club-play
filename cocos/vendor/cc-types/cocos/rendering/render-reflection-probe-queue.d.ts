import { Device, RenderPass, CommandBuffer } from '../gfx';
import { Model } from '../render-scene/scene/model';
import { ReflectionProbe } from '../render-scene/scene/reflection-probe';
import { Camera } from '../render-scene/scene/camera';
import { PipelineRuntime } from './custom/pipeline';
/**
 * @zh
 * 反射探针渲染队列
 */
export declare class RenderReflectionProbeQueue {
    private _pipeline;
    private _subModelsArray;
    private _passArray;
    private _shaderArray;
    private _rgbeSubModelsArray;
    private _instancedQueue;
    private _patches;
    constructor(pipeline: PipelineRuntime);
    gatherRenderObjects(probe: ReflectionProbe, camera: Camera, cmdBuff: CommandBuffer): void;
    clear(): void;
    add(model: Model): void;
    /**
     * @zh
     * record CommandBuffer
     */
    recordCommandBuffer(device: Device, renderPass: RenderPass, cmdBuff: CommandBuffer): void;
    resetRGBEMacro(): void;
}
