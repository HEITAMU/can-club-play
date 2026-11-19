import { RenderPass } from '../gfx';
import { Camera } from '../render-scene/scene/camera';
import { RenderPipeline } from './render-pipeline';
export declare class UIPhase {
    private _phaseID;
    private _pipeline;
    constructor();
    activate(pipeline: RenderPipeline): void;
    render(camera: Camera, renderPass: RenderPass): void;
}
