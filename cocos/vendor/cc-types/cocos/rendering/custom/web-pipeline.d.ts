/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
import { DescriptorSetLayout, Device, Format, Sampler, Swapchain, Texture, ClearFlagBit, DescriptorSet, Viewport, CommandBuffer, SamplerInfo, LoadOp, StoreOp, ShaderStageFlagBit, BufferInfo, TextureInfo, TextureType, ResolveMode, SampleCount, Color } from '../../gfx';
import { AccessType, CopyPair, LightInfo, LightingMode, MovePair, QueueHint, ResolvePair, ResourceDimension, ResourceFlags, ResourceResidency, SceneFlags, UpdateFrequency, UploadPair } from './types';
import { ComputePass, CopyPass, MovePass, RasterPass, RasterSubpass, RenderData, RenderGraph, RenderQueue, ResourceGraph, SceneData } from './render-graph';
import { ComputePassBuilder, ComputeQueueBuilder, BasicPipeline, RenderQueueBuilder, RenderSubpassBuilder, PipelineType, BasicRenderPassBuilder, PipelineCapabilities, BasicMultisampleRenderPassBuilder, SceneBuilder } from './pipeline';
import { PipelineSceneData } from '../pipeline-scene-data';
import { Model, Camera } from '../../render-scene/scene';
import { Light } from '../../render-scene/scene/light';
import { DescriptorSetData, LayoutGraphData } from './layout-graph';
import { RenderWindow } from '../../render-scene/core/render-window';
import { MacroRecord, RenderScene } from '../../render-scene';
import { GlobalDSManager } from '../global-descriptor-set-manager';
import { GeometryRenderer } from '../geometry-renderer';
import { Material } from '../../asset/assets';
import { WebSetter } from './web-pipeline-types';
export declare class WebSceneBuilder extends WebSetter implements SceneBuilder {
    constructor(data: RenderData, layoutGraph: LayoutGraphData, rg: RenderGraph, sceneId: number, scene: SceneData);
    update(data: RenderData, layoutGraph: LayoutGraphData, rg: RenderGraph, sceneId: number, scene: SceneData): void;
    useLightFrustum(light: Light, csmLevel?: number, optCamera?: Camera | undefined): void;
    private _renderGraph;
    private _scene;
}
export declare class WebRenderQueueBuilder extends WebSetter implements RenderQueueBuilder {
    constructor(data: RenderData, renderGraph: RenderGraph, layoutGraph: LayoutGraphData, vertID: number, queue: RenderQueue, pipeline: PipelineSceneData);
    update(data: RenderData, renderGraph: RenderGraph, layoutGraph: LayoutGraphData, vertID: number, queue: RenderQueue, pipeline: PipelineSceneData): void;
    setArrayBuffer(name: string, arrayBuffer: ArrayBuffer): void;
    get name(): string;
    set name(name: string);
    addSceneOfCamera(camera: Camera, light: LightInfo, sceneFlags?: SceneFlags, name?: string): void;
    addScene(camera: Camera, sceneFlags?: SceneFlags, light?: Light | undefined | null, scene?: RenderScene | undefined): SceneBuilder;
    addFullscreenQuad(material: Material, passID: number, sceneFlags?: SceneFlags, name?: string): void;
    addCameraQuad(camera: Camera, material: Material, passID: number, sceneFlags?: SceneFlags): void;
    addDraw3D(camera: Camera, models: Model[], sceneFlags?: SceneFlags): void;
    addDraw2D(camera: Camera): void;
    addProfiler(camera: Camera): void;
    clearRenderTarget(name: string, color?: Color): void;
    setViewport(viewport: Viewport): void;
    addCustomCommand(customBehavior: string): void;
    private _renderGraph;
    private _queue;
    private _pipeline;
}
export declare class WebRenderSubpassBuilder extends WebSetter implements RenderSubpassBuilder {
    constructor(data: RenderData, renderGraph: RenderGraph, layoutGraph: LayoutGraphData, vertID: number, subpass: RasterSubpass, pipeline: PipelineSceneData);
    update(data: RenderData, renderGraph: RenderGraph, layoutGraph: LayoutGraphData, vertID: number, subpass: RasterSubpass, pipeline: PipelineSceneData): void;
    addRenderTarget(name: string, accessType: AccessType, slotName?: string | undefined, loadOp?: LoadOp | undefined, storeOp?: StoreOp | undefined, color?: Color | undefined): void;
    setCustomShaderStages(name: string, stageFlags: ShaderStageFlagBit): void;
    setArrayBuffer(name: string, arrayBuffer: ArrayBuffer): void;
    get name(): string;
    set name(name: string);
    addDepthStencil(name: string, accessType: AccessType, depthSlotName?: string, stencilSlotName?: string, loadOp?: LoadOp, storeOp?: StoreOp, depth?: number, stencil?: number, clearFlag?: ClearFlagBit): void;
    addTexture(name: string, slotName: string, sampler?: Sampler | null): void;
    addStorageBuffer(name: string, accessType: AccessType, slotName: string): void;
    addStorageImage(name: string, accessType: AccessType, slotName: string): void;
    setViewport(viewport: Viewport): void;
    addQueue(hint?: QueueHint, layoutName?: string, passName?: string): RenderQueueBuilder;
    get showStatistics(): boolean;
    set showStatistics(enable: boolean);
    get subpassID(): number;
    get subpassLayoutID(): number;
    private _renderGraph;
    private _layoutID;
    private _subpass;
    private _pipeline;
}
export declare class WebRenderPassBuilder extends WebSetter implements BasicMultisampleRenderPassBuilder {
    constructor(data: RenderData, renderGraph: RenderGraph, layoutGraph: LayoutGraphData, resourceGraph: ResourceGraph, vertID: number, pass: RasterPass, pipeline: PipelineSceneData);
    update(data: RenderData, renderGraph: RenderGraph, layoutGraph: LayoutGraphData, resourceGraph: ResourceGraph, vertID: number, pass: RasterPass, pipeline: PipelineSceneData): void;
    setCustomShaderStages(name: string, stageFlags: ShaderStageFlagBit): void;
    setArrayBuffer(name: string, arrayBuffer: ArrayBuffer): void;
    setVersion(name: string, version: number): void;
    get name(): string;
    set name(name: string);
    get passID(): number;
    get passLayoutID(): number;
    addRenderTarget(name: string, loadOp?: LoadOp, storeOp?: StoreOp, clearColor?: Color): void;
    addDepthStencil(name: string, loadOp?: LoadOp, storeOp?: StoreOp, depth?: number, stencil?: number, clearFlag?: ClearFlagBit): void;
    resolveRenderTarget(source: string, target: string): void;
    resolveDepthStencil(source: string, target: string, depthMode?: ResolveMode, stencilMode?: ResolveMode): void;
    private _addComputeResource;
    addTexture(name: string, slotName: string, sampler?: Sampler | null): void;
    addStorageBuffer(name: string, accessType: AccessType, slotName: string): void;
    addStorageImage(name: string, accessType: AccessType, slotName: string): void;
    addRenderSubpass(layoutName?: string): RenderSubpassBuilder;
    addQueue(hint?: QueueHint, layoutName?: string, passName?: string): WebRenderQueueBuilder;
    addFullscreenQuad(material: Material, passID: number, sceneFlags?: SceneFlags, name?: string): void;
    addCameraQuad(camera: Camera, material: Material, passID: number, sceneFlags: SceneFlags, name?: string): void;
    setViewport(viewport: Viewport): void;
    get showStatistics(): boolean;
    set showStatistics(enable: boolean);
    private _renderGraph;
    private _layoutID;
    private _subpassID;
    private _pass;
    private _pipeline;
    private _resourceGraph;
}
export declare class WebComputeQueueBuilder extends WebSetter implements ComputeQueueBuilder {
    constructor(data: RenderData, renderGraph: RenderGraph, layoutGraph: LayoutGraphData, vertID: number, queue: RenderQueue, pipeline: PipelineSceneData);
    update(data: RenderData, renderGraph: RenderGraph, layoutGraph: LayoutGraphData, vertID: number, queue: RenderQueue, pipeline: PipelineSceneData): void;
    setArrayBuffer(name: string, arrayBuffer: ArrayBuffer): void;
    get name(): string;
    set name(name: string);
    addDispatch(threadGroupCountX: number, threadGroupCountY: number, threadGroupCountZ: number, material?: Material | null, passID?: number, name?: string): void;
    private _renderGraph;
    private _queue;
    private _pipeline;
}
export declare class WebComputePassBuilder extends WebSetter implements ComputePassBuilder {
    constructor(data: RenderData, renderGraph: RenderGraph, layoutGraph: LayoutGraphData, resourceGraph: ResourceGraph, vertID: number, pass: ComputePass, pipeline: PipelineSceneData);
    update(data: RenderData, renderGraph: RenderGraph, layoutGraph: LayoutGraphData, resourceGraph: ResourceGraph, vertID: number, pass: ComputePass, pipeline: PipelineSceneData): void;
    setCustomShaderStages(name: string, stageFlags: ShaderStageFlagBit): void;
    setArrayBuffer(name: string, arrayBuffer: ArrayBuffer): void;
    get name(): string;
    set name(name: string);
    addTexture(name: string, slotName: string, sampler?: Sampler | null): void;
    addStorageBuffer(name: string, accessType: AccessType, slotName: string): void;
    addStorageImage(name: string, accessType: AccessType, slotName: string): void;
    addMaterialTexture(resourceName: string, flags?: ShaderStageFlagBit | undefined): void;
    addQueue(layoutName?: string, passName?: string): WebComputeQueueBuilder;
    private _addComputeResource;
    private _renderGraph;
    private _resourceGraph;
    private _layoutID;
    private _pass;
    private _pipeline;
}
export declare class WebMovePassBuilder {
    constructor(renderGraph: RenderGraph, vertID: number, pass: MovePass);
    setCustomBehavior(name: string): void;
    get name(): string;
    set name(name: string);
    addPair(pair: MovePair): void;
    private readonly _renderGraph;
    private readonly _vertID;
    private readonly _pass;
}
export declare class WebCopyPassBuilder {
    constructor(renderGraph: RenderGraph, vertID: number, pass: CopyPass);
    addPair(pair: CopyPair): void;
    setCustomBehavior(name: string): void;
    get name(): string;
    set name(name: string);
    private readonly _renderGraph;
    private readonly _vertID;
    private readonly _pass;
}
export declare class WebPipeline extends WebSetter implements BasicPipeline {
    constructor(layoutGraph: LayoutGraphData);
    globalDSManager: GlobalDSManager;
    descriptorSetLayout: DescriptorSetLayout;
    descriptorSet: DescriptorSet;
    get type(): PipelineType;
    get capabilities(): PipelineCapabilities;
    get enableCpuLightCulling(): boolean;
    set enableCpuLightCulling(enable: boolean);
    addCustomBuffer(name: string, info: BufferInfo, type: string): number;
    addCustomTexture(name: string, info: TextureInfo, type: string): number;
    tryAddRenderWindowDepthStencil(width: number, height: number, depthStencilName?: string, swapchain?: Swapchain): void;
    addRenderWindow(name: string, format: Format, width: number, height: number, renderWindow: RenderWindow, depthStencilName?: string): number;
    updateRenderWindow(name: string, renderWindow: RenderWindow, depthStencilName?: string): void;
    updateStorageBuffer(name: string, size: number, format?: Format): void;
    updateRenderTarget(name: string, width: number, height: number, format?: Format): void;
    updateDepthStencil(name: string, width: number, height: number, format?: Format): void;
    updateStorageTexture(name: string, width: number, height: number, format?: Format): void;
    updateShadingRateTexture(name: string, width: number, height: number): void;
    addBuffer(name: string, size: number, flags: ResourceFlags, residency: ResourceResidency): number;
    updateBuffer(name: string, size: number): void;
    addExternalTexture(name: string, texture: Texture, flags: ResourceFlags): number;
    updateExternalTexture(name: string, texture: Texture): void;
    addTexture(name: string, textureType: TextureType, format: Format, width: number, height: number, depth: number, arraySize: number, mipLevels: number, sampleCount: SampleCount, flags: ResourceFlags, residency: ResourceResidency): number;
    updateTexture(name: string, format: Format, width: number, height: number, depth: number, arraySize: number, mipLevels: number, sampleCount: SampleCount): void;
    addResource(name: string, dimension: ResourceDimension, format: Format, width: number, height: number, depth: number, arraySize: number, mipLevels: number, sampleCount: SampleCount, flags: ResourceFlags, residency: ResourceResidency): number;
    updateResource(name: string, format: Format, width: number, height: number, depth: number, arraySize: number, mipLevels: number, sampleCount: SampleCount): void;
    containsResource(name: string): boolean;
    addResolvePass(resolvePairs: ResolvePair[]): void;
    addComputePass(passName: string): ComputePassBuilder;
    addUploadPass(uploadPairs: UploadPair[]): void;
    addCopyPass(copyPairs: CopyPair[]): void;
    get name(): string;
    protected _generateConstantMacros(clusterEnabled: boolean): void;
    setCustomPipelineName(name: string): void;
    getGlobalDescriptorSetData(): DescriptorSetData | undefined;
    private _initCombineSignY;
    getCombineSignY(): number;
    get globalDescriptorSetData(): DescriptorSetData;
    get defaultSampler(): Sampler;
    get defaultShadowTexture(): Texture;
    private _compileMaterial;
    activate(swapchain: Swapchain): boolean;
    destroy(): boolean;
    get device(): Device;
    get lightingMode(): LightingMode;
    set lightingMode(mode: LightingMode);
    get usesDeferredPipeline(): boolean;
    get macros(): MacroRecord;
    get profilerDescriptorSet(): DescriptorSet;
    get commandBuffers(): CommandBuffer[];
    get pipelineSceneData(): PipelineSceneData;
    get constantMacros(): string;
    get profiler(): Model | null;
    set profiler(profiler: Model | null);
    get geometryRenderer(): GeometryRenderer | null;
    get shadingScale(): number;
    set shadingScale(scale: number);
    getMacroString(name: string): string;
    getMacroInt(name: string): number;
    getMacroBool(name: string): boolean;
    getSamplerInfo(name: string): SamplerInfo | null;
    setMacroString(name: string, value: string): void;
    setMacroInt(name: string, value: number): void;
    setMacroBool(name: string, value: boolean): void;
    onGlobalPipelineStateChanged(): void;
    beginSetup(): void;
    endSetup(): void;
    addStorageBuffer(name: string, format: Format, size: number, residency?: ResourceResidency): number;
    addRenderTarget(name: string, format: Format, width: number, height: number, residency?: ResourceResidency): number;
    updateDepthStencilImpl(resId: number, width: number, height: number, format: Format, swapchain?: Swapchain): void;
    addDepthStencilImpl(name: string, format: Format, width: number, height: number, residency: ResourceResidency, swapchain?: Swapchain): number;
    addDepthStencil(name: string, format: Format, width: number, height: number, residency?: ResourceResidency): number;
    addStorageTexture(name: string, format: Format, width: number, height: number, residency?: ResourceResidency): number;
    addShadingRateTexture(name: string, width: number, height: number, residency?: ResourceResidency): number;
    beginFrame(): void;
    update(camera: Camera): void;
    endFrame(): void;
    compile(): void;
    execute(): void;
    protected _applySize(cameras: Camera[]): void;
    private _width;
    private _height;
    get width(): number;
    get height(): number;
    render(cameras: Camera[]): void;
    addBuiltinReflectionProbePass(camera: Camera): void;
    addRenderPassImpl(width: number, height: number, layoutName: string, count?: number, quality?: number): BasicMultisampleRenderPassBuilder;
    addRenderPass(width: number, height: number, layoutName?: string): BasicRenderPassBuilder;
    addMultisampleRenderPass(width: number, height: number, count: number, quality: number, layoutName?: string): BasicMultisampleRenderPassBuilder;
    getDescriptorSetLayout(shaderName: string, freq: UpdateFrequency): DescriptorSetLayout;
    get renderGraph(): RenderGraph | null;
    get resourceGraph(): ResourceGraph;
    get layoutGraph(): LayoutGraphData;
    get resourceUses(): string[];
    protected _updateRasterPassConstants(setter: WebSetter, width: number, height: number, layoutName?: string): void;
    static MAX_BLOOM_FILTER_PASS_NUM: number;
    private _usesDeferredPipeline;
    private _copyPassMat;
    private _device;
    private _defaultSampler;
    private _profilerDescriptorSet;
    private readonly _macros;
    private readonly _pipelineSceneData;
    private _constantMacros;
    private _lightingMode;
    private _profiler;
    private _cameras;
    private _resourceUses;
    private readonly _resourceGraph;
    private _renderGraph;
    private _compiler;
    private _executor;
    private _customPipelineName;
    private _globalDescSetData;
    private _combineSignY;
    static CSM_UNIFORM_VECTORS: number;
    static GLOBAL_UNIFORM_VECTORS: number;
}
