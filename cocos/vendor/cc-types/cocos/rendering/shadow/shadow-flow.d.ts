import { IRenderFlowInfo, RenderFlow } from '../render-flow';
import { Swapchain } from '../../gfx';
import { RenderPipeline } from '../render-pipeline';
import { Light } from '../../render-scene/scene/light';
import { Camera } from '../../render-scene/scene';
/**
 * @en Shadow map render flow
 * @zh 阴影贴图绘制流程
 */
export declare class ShadowFlow extends RenderFlow {
    /**
     * @en A common initialization info for shadow map render flow
     * @zh 一个通用的 ShadowFlow 的初始化信息对象
     */
    static initInfo: IRenderFlowInfo;
    private _shadowRenderPass;
    constructor();
    initialize(info: IRenderFlowInfo): boolean;
    activate(pipeline: RenderPipeline): void;
    render(camera: Camera): void;
    destroy(): void;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _initShadowFrameBuffer(pipeline: RenderPipeline, light: Light, swapchain: Swapchain): void;
    private _renderStage;
    private clearShadowMap;
    private resizeShadowMap;
}
