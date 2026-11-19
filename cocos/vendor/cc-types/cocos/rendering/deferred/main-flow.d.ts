import { Camera } from '../../render-scene/scene';
import { IRenderFlowInfo, RenderFlow } from '../render-flow';
import { RenderPipeline } from '../render-pipeline';
/**
 * @en The main flow in deferred render pipeline
 * @zh 延迟渲染流程。
 */
export declare class MainFlow extends RenderFlow {
    /**
     * @en The shared initialization information of main render flow
     * @zh 共享的延迟渲染流程初始化参数
     */
    static initInfo: IRenderFlowInfo;
    initialize(info: IRenderFlowInfo): boolean;
    activate(pipeline: RenderPipeline): void;
    render(camera: Camera): void;
    destroy(): void;
}
