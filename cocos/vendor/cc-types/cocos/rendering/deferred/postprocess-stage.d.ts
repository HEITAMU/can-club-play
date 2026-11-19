import { Camera } from '../../render-scene/scene';
import { IRenderStageInfo, RenderStage } from '../render-stage';
import { RenderPipeline } from '../render-pipeline';
import { RenderFlow } from '../render-flow';
/**
  * @en The postprocess render stage
  * @zh 后处理渲染阶段。
  */
export declare class PostProcessStage extends RenderStage {
    static initInfo: IRenderStageInfo;
    private _postProcessMaterial;
    private renderQueues;
    private _renderArea;
    private _uiPhase;
    private _stageDesc;
    private _localUBO;
    constructor();
    initialize(info: IRenderStageInfo): boolean;
    activate(pipeline: RenderPipeline, flow: RenderFlow): void;
    destroy(): void;
    render(camera: Camera): void;
}
