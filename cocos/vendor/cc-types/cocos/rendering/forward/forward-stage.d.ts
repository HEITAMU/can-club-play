import { RenderQueue } from '../render-queue';
import { RenderInstancedQueue } from '../render-instanced-queue';
import { IRenderStageInfo, RenderStage } from '../render-stage';
import { ForwardFlow } from './forward-flow';
import { ForwardPipeline } from './forward-pipeline';
import { RenderQueueDesc } from '../pipeline-serialization';
import { Camera } from '../../render-scene/scene';
/**
 * @en The forward render stage
 * @zh 前向渲染阶段。
 */
export declare class ForwardStage extends RenderStage {
    static initInfo: IRenderStageInfo;
    protected renderQueues: RenderQueueDesc[];
    protected _renderQueues: RenderQueue[];
    private _renderArea;
    private _instancedQueue;
    private _phaseID;
    private _clearFlag;
    private _additiveLightQueue;
    private _planarQueue;
    private _uiPhase;
    additiveInstanceQueues: RenderInstancedQueue[];
    constructor();
    addRenderInstancedQueue(queue: RenderInstancedQueue): void;
    removeRenderInstancedQueue(queue: RenderInstancedQueue): void;
    initialize(info: IRenderStageInfo): boolean;
    activate(pipeline: ForwardPipeline, flow: ForwardFlow): void;
    destroy(): void;
    render(camera: Camera): void;
}
