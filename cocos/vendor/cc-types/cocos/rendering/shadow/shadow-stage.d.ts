import { Framebuffer, DescriptorSet } from '../../gfx';
import { IRenderStageInfo, RenderStage } from '../render-stage';
import { ForwardPipeline } from '../forward/forward-pipeline';
import { Light } from '../../render-scene/scene/light';
import { ShadowFlow } from './shadow-flow';
import { Camera } from '../../render-scene/scene/camera';
/**
 * @en Shadow map render stage
 * @zh 阴影渲染阶段。
 */
export declare class ShadowStage extends RenderStage {
    constructor();
    /**
     * @en A common initialization info for shadow map render stage
     * @zh 一个通用的 ShadowStage 的初始化信息对象
     */
    static initInfo: IRenderStageInfo;
    /**
     * @en Sets the render shadow map info
     * @zh 设置阴影渲染信息
     * @param light
     * @param shadowFrameBuffer
     * @param level 层级
     */
    setUsage(globalDS: DescriptorSet, light: Light, shadowFrameBuffer: Framebuffer, level?: number): void;
    private _additiveShadowQueue;
    private _shadowFrameBuffer;
    private _renderArea;
    private _light;
    private _globalDS;
    private _level;
    private _isShadowMapCleared;
    destroy(): void;
    clearFramebuffer(camera: Camera): void;
    render(camera: Camera): void;
    activate(pipeline: ForwardPipeline, flow: ShadowFlow): void;
}
