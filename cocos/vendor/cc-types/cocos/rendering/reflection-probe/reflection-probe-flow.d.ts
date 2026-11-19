import { IRenderFlowInfo, RenderFlow } from '../render-flow';
import { RenderPipeline } from '../render-pipeline';
import { Camera } from '../../render-scene/scene/camera';
/**
 * @en reflection probe render flow
 * @zh 反射探针rendertexture绘制流程
 */
export declare class ReflectionProbeFlow extends RenderFlow {
    static initInfo: IRenderFlowInfo;
    initialize(info: IRenderFlowInfo): boolean;
    activate(pipeline: RenderPipeline): void;
    render(camera: Camera): void;
    destroy(): void;
    private _renderStage;
}
