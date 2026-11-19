import { Framebuffer } from '../../gfx';
import { IRenderStageInfo, RenderStage } from '../render-stage';
import { ForwardPipeline } from '../forward/forward-pipeline';
import { ReflectionProbeFlow } from './reflection-probe-flow';
import { Camera, ReflectionProbe } from '../../render-scene/scene';
/**
 * @en reflection probe render stage
 * @zh 反射探针渲染阶段。
 */
export declare class ReflectionProbeStage extends RenderStage {
    /**
     * @en A common initialization info for reflection probe render stage
     * @zh 一个通用的 reflection probe stage 的初始化信息对象
     */
    static initInfo: IRenderStageInfo;
    private _frameBuffer;
    private _renderArea;
    private _probe;
    private _probeRenderQueue;
    private _rgbeColor;
    constructor();
    /**
     * @en Sets the probe info
     * @zh 设置probe信息
     * @param probe
     * @param frameBuffer
     */
    setUsageInfo(probe: ReflectionProbe, frameBuffer: Framebuffer): void;
    destroy(): void;
    clearFramebuffer(camera: Camera): void;
    render(camera: Camera): void;
    activate(pipeline: ForwardPipeline, flow: ReflectionProbeFlow): void;
}
