import { RenderPipeline, IRenderPipelineInfo, PipelineRenderData } from '../render-pipeline';
import { RenderTextureConfig } from '../pipeline-serialization';
import { Texture, Framebuffer, Swapchain } from '../../gfx';
import { Camera } from '../../render-scene/scene';
export declare class DeferredRenderData extends PipelineRenderData {
    gbufferFrameBuffer: Framebuffer;
    gbufferRenderTargets: Texture[];
    constructor();
}
/**
 * @en The deferred render pipeline
 * @zh 延迟渲染管线。
 */
export declare class DeferredPipeline extends RenderPipeline {
    private _gbufferRenderPass;
    private _lightingRenderPass;
    protected renderTextures: RenderTextureConfig[];
    constructor();
    initialize(info: IRenderPipelineInfo): boolean;
    activate(swapchain: Swapchain): boolean;
    destroy(): boolean;
    onGlobalPipelineStateChanged(): void;
    getPipelineRenderData(): DeferredRenderData;
    private _activeRenderer;
    private _destroyUBOs;
    private _destroyDeferredData;
    protected _ensureEnoughSize(cameras: Camera[]): void;
    private _generateDeferredRenderData;
}
