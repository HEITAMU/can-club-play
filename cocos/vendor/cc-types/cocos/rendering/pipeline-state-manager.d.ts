import { Shader, RenderPass, InputAssembler, Device, PipelineState } from '../gfx';
import { Pass } from '../render-scene/core/pass';
export declare class PipelineStateManager {
    private constructor();
    private static _PSOHashMap;
    static getOrCreatePipelineState(device: Device, pass: Pass, shader: Shader, renderPass: RenderPass, ia: InputAssembler): PipelineState;
}
