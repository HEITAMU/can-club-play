import { Device } from '../../gfx';
import { Material } from '../../asset/assets';
import { PipelineSceneData } from '../pipeline-scene-data';
export declare enum DeferredAntiAliasing {
    NONE = 0,
    FXAA = 1
}
export declare const BLOOM_PREFILTERPASS_INDEX = 0;
export declare const BLOOM_DOWNSAMPLEPASS_INDEX = 1;
export declare const BLOOM_UPSAMPLEPASS_INDEX: number;
export declare const BLOOM_COMBINEPASS_INDEX: number;
export declare class DeferredPipelineSceneData extends PipelineSceneData {
    protected _antiAliasing: DeferredAntiAliasing;
    constructor();
    set antiAliasing(value: DeferredAntiAliasing);
    get antiAliasing(): DeferredAntiAliasing;
    get bloomMaterial(): Material;
    set bloomMaterial(mat: Material);
    protected _bloomMaterial: Material;
    get postprocessMaterial(): Material;
    set postprocessMaterial(mat: Material);
    protected _postprocessMaterial: Material;
    updatePipelineSceneData(): void;
    private updateBloomPass;
    private updatePostProcessPass;
    initPipelinePassInfo(): void;
    get deferredLightingMaterial(): Material;
    set deferredLightingMaterial(mat: Material);
    protected _deferredLightingMaterial: Material;
    protected _deferredPostMaterial: Material;
    protected updatePipelinePassInfo(): void;
    activate(device: Device): boolean;
    private updateDeferredPassInfo;
    private updateDeferredLightPass;
}
