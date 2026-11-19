import { Camera } from '../../render-scene/scene';
import { RenderQueue } from '../render-queue';
import { IRenderStageInfo, RenderStage } from '../render-stage';
import { DeferredPipeline } from './deferred-pipeline';
import { RenderQueueDesc } from '../pipeline-serialization';
import { MainFlow } from './main-flow';
/**
 * @en The gbuffer render stage
 * @zh 前向渲染阶段。
 */
export declare class GbufferStage extends RenderStage {
    static initInfo: IRenderStageInfo;
    protected renderQueues: RenderQueueDesc[];
    protected _renderQueues: RenderQueue[];
    private _renderArea;
    private _instancedQueue;
    private _phaseID;
    constructor();
    initialize(info: IRenderStageInfo): boolean;
    activate(pipeline: DeferredPipeline, flow: MainFlow): void;
    destroy(): void;
    render(camera: Camera): void;
}
