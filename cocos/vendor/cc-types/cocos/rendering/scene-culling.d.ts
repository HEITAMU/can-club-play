import { Camera } from '../render-scene/scene/camera';
import { PipelineUBO } from './pipeline-ubo';
import { PipelineSceneData } from './pipeline-scene-data';
import { ShadowLayerVolume } from './shadow/csm-layers';
export declare function validPunctualLightsCulling(sceneData: PipelineSceneData, camera: Camera): void;
export declare function shadowCulling(camera: Camera, sceneData: PipelineSceneData, layer: ShadowLayerVolume): void;
export declare function sceneCulling(sceneData: PipelineSceneData, pipelineUBO: PipelineUBO, camera: Camera): void;
