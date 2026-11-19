import { Pass } from '../render-scene/core/pass';
import { Model } from '../render-scene/scene/model';
import { Device, RenderPass, CommandBuffer } from '../gfx';
import { SubModel } from '../render-scene/scene/submodel';
import { Light } from '../render-scene/scene/light';
import { Camera } from '../render-scene/scene/camera';
import { PipelineRuntime } from './custom/pipeline';
/**
 * @zh 叠加光照队列。
 */
export declare class RenderAdditiveLightQueue {
    private _pipeline;
    private _device;
    private _lightPasses;
    private _instancedLightPassPool;
    private _shadowUBO;
    private _lightBufferCount;
    private _lightBufferStride;
    private _lightBufferElementCount;
    private _lightBuffer;
    private _firstLightBufferView;
    private _lightBufferData;
    private _instancedQueues;
    private _lightMeterScale;
    constructor(pipeline: PipelineRuntime);
    clear(): void;
    destroy(): void;
    private _bindForwardAddLight;
    gatherLightPasses(camera: Camera, cmdBuff: CommandBuffer, passLayout?: string): void;
    recordCommandBuffer(device: Device, renderPass: RenderPass, cmdBuff: CommandBuffer): void;
    protected _lightCulling(model: Model, validPunctualLights: Light[]): void;
    protected _addRenderQueue(pass: Pass, subModel: SubModel, model: Model, lightPassIdx: number): void;
    protected _updateLightDescriptorSet(camera: Camera, cmdBuff: CommandBuffer): void;
    protected _updateUBOs(camera: Camera, cmdBuff: CommandBuffer): void;
}
