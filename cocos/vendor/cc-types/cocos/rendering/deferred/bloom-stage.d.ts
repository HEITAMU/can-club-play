import { Camera } from '../../render-scene/scene';
import { RenderFlow } from '../render-flow';
import { IRenderStageInfo, RenderStage } from '../render-stage';
import { RenderPipeline } from '../render-pipeline';
/**
 * @en The bloom post-process stage
 * @zh Bloom 后处理阶段。
 */
export declare class BloomStage extends RenderStage {
    static initInfo: IRenderStageInfo;
    threshold: number;
    intensity: number;
    iterations: number;
    private _bloomMaterial;
    private _renderArea;
    private _bloomUBO;
    constructor();
    initialize(info: IRenderStageInfo): boolean;
    activate(pipeline: RenderPipeline, flow: RenderFlow): void;
    destroy(): void;
    render(camera: Camera): void;
    private _prefilterPass;
    private _downsamplePass;
    private _upsamplePass;
    private _combinePass;
}
