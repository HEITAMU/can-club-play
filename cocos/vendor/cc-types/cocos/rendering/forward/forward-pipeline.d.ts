import { RenderPipeline, IRenderPipelineInfo } from '../render-pipeline';
import { RenderTextureConfig } from '../pipeline-serialization';
import { Swapchain, RenderPass } from '../../gfx';
import { Camera } from '../../render-scene/scene';
export declare function createDefaultPipeline(): ForwardPipeline;
/**
 * @en The forward render pipeline
 * @zh 前向渲染管线。
 */
export declare class ForwardPipeline extends RenderPipeline {
    protected renderTextures: RenderTextureConfig[];
    protected _postRenderPass: RenderPass | null;
    constructor();
    get postRenderPass(): RenderPass | null;
    initialize(info: IRenderPipelineInfo): boolean;
    activate(swapchain: Swapchain): boolean;
    protected _ensureEnoughSize(cameras: Camera[]): void;
    destroy(): boolean;
    private _activeRenderer;
    private _destroyUBOs;
}
