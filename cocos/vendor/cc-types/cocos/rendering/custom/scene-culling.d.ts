import { RecyclePool } from '../../core';
import { CommandBuffer, Device } from '../../gfx';
import { RenderScene } from '../../render-scene';
import { Light, Model, Shadows } from '../../render-scene/scene';
import { PipelineSceneData } from '../pipeline-scene-data';
import { LayoutGraphData } from './layout-graph';
import { RenderGraph, SceneData } from './render-graph';
import { RenderQueue, RenderQueueQuery } from './web-pipeline-types';
import { WebProgramLibrary } from './web-program-library';
declare class CullingPools {
    frustumCullingKeyRecycle: RecyclePool<FrustumCullingKey>;
    frustumCullingsRecycle: RecyclePool<FrustumCulling>;
    lightBoundsCullingRecycle: RecyclePool<LightBoundsCulling>;
    lightBoundsCullingResultRecycle: RecyclePool<LightBoundsCullingResult>;
    lightBoundsCullingKeyRecycle: RecyclePool<LightBoundsCullingKey>;
    renderQueueRecycle: RecyclePool<RenderQueue>;
    renderQueueQueryRecycle: RecyclePool<RenderQueueQuery>;
}
declare class FrustumCullingKey {
    sceneData: SceneData | null;
    castShadows: boolean;
    constructor(sceneData?: SceneData | null, castShadows?: boolean);
    update(sceneData: SceneData, castShadows: boolean): void;
}
declare class LightBoundsCullingKey {
    sceneData: SceneData | null;
    frustumCullingID: FrustumCullingID;
    constructor(sceneData?: SceneData | null, frustumCullingID?: FrustumCullingID);
    update(sceneData?: SceneData | null, frustumCullingID?: FrustumCullingID): void;
}
declare class LightBoundsCulling {
    resultKeyIndex: Map<string, LightBoundsCullingKey>;
    resultIndex: Map<string, LightBoundsCullingID>;
    update(): void;
}
declare class LightBoundsCullingResult {
    instances: Model[];
    lightByteOffset: number;
    update(): LightBoundsCullingResult;
}
type FrustumCullingID = number;
type LightBoundsCullingID = number;
declare class FrustumCulling {
    resultIndex: Map<string, FrustumCullingID>;
    resultKeyIndex: Map<string, FrustumCullingKey>;
    update(): void;
}
export declare class SceneCulling {
    frustumCullings: Map<RenderScene, FrustumCulling>;
    frustumCullingResults: Array<Array<Model>>;
    lightBoundsCullings: Map<RenderScene, LightBoundsCulling>;
    lightBoundsCullingResults: Array<LightBoundsCullingResult>;
    renderQueueIndex: Map<string, number>;
    renderQueues: Array<RenderQueue>;
    renderQueueQueryIndex: Map<number, RenderQueueQuery>;
    cullingPools: CullingPools;
    numFrustumCulling: number;
    numLightBoundsCulling: number;
    numRenderQueues: number;
    layoutGraph: any;
    renderGraph: RenderGraph;
    enableLightCulling: boolean;
    readonly kFilterMask: number;
    readonly kDrawMask: number;
    readonly kAllMask: number;
    resetPool(): void;
    clear(): void;
    buildRenderQueues(rg: RenderGraph, lg: LayoutGraphData, pplSceneData: PipelineSceneData): void;
    private getOrCreateLightBoundsCulling;
    private getOrCreateFrustumCulling;
    private getOrCreateRenderQueue;
    private collectCullingQueries;
    uploadInstancing(cmdBuffer: CommandBuffer): void;
    private _getPhaseIdFromScene;
    private getBuiltinShadowFrustum;
    private batchFrustumCulling;
    private executeSphereLightCulling;
    private executeSpotLightCulling;
    private executePointLightCulling;
    private executeRangedDirectionalLightCulling;
    private batchLightBoundsCulling;
    private _getModelsByCullingResults;
    private fillRenderQueues;
}
export declare class LightResource {
    private cpuBuffer;
    private programLibrary?;
    private device;
    private elementSize;
    private maxNumLights;
    private binding;
    private resized;
    private lightBuffer?;
    private firstLightBufferView;
    private readonly lights;
    private readonly lightIndex;
    init(programLib: WebProgramLibrary, deviceIn: Device, maxNumLights: number): void;
    buildLights(sceneCulling: SceneCulling, bHDR: boolean, shadowInfo: Shadows | null): void;
    tryUpdateRenderSceneLocalDescriptorSet(sceneCulling: SceneCulling): void;
    clear(): void;
    addLight(light: Light, bHDR: boolean, exposure: number, shadowInfo: Shadows | null): number;
    buildLightBuffer(cmdBuffer: CommandBuffer): void;
}
export {};
