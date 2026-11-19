import { Camera } from '../../render-scene/scene/camera';
import { IRenderStageInfo, RenderStage } from '../render-stage';
import { MainFlow } from './main-flow';
import { DeferredPipeline } from './deferred-pipeline';
import { Pass } from '../../render-scene/core/pass';
/**
 * @en The lighting render stage
 * @zh 前向渲染阶段。
 */
export declare class LightingStage extends RenderStage {
    private _deferredLitsBufs;
    private _maxDeferredLights;
    private _lightBufferData;
    private _lightMeterScale;
    private _descriptorSet;
    private _renderArea;
    private _planarQueue;
    private _uiPhase;
    private _deferredMaterial;
    private renderQueues;
    private _phaseID;
    private _renderQueues;
    static initInfo: IRenderStageInfo;
    constructor();
    initialize(info: IRenderStageInfo): boolean;
    gatherLights(camera: Camera): void;
    protected _createStageDescriptor(pass: Pass): void;
    activate(pipeline: DeferredPipeline, flow: MainFlow): void;
    destroy(): void;
    render(camera: Camera): void;
}
