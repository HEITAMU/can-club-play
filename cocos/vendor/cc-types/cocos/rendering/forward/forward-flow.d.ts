import { IRenderFlowInfo, RenderFlow } from '../render-flow';
import { RenderPipeline } from '../render-pipeline';
import { Camera } from '../../render-scene/scene';
/**
 * @en The forward flow in forward render pipeline
 * @zh 前向渲染流程。
 */
export declare class ForwardFlow extends RenderFlow {
    /**
     * @en The shared initialization information of forward render flow
     * @zh 共享的前向渲染流程初始化参数
     */
    static initInfo: IRenderFlowInfo;
    initialize(info: IRenderFlowInfo): boolean;
    activate(pipeline: RenderPipeline): void;
    render(camera: Camera): void;
    destroy(): void;
}
