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
import { RecyclePool } from '../../core';
import { Buffer, Color, CommandBuffer, DescriptorSet, Device, Framebuffer, Rect, RenderPass, Swapchain, Texture, Viewport } from '../../gfx';
import { Camera } from '../../render-scene/scene/camera';
import { Root } from '../../root';
import { IRenderPass } from '../define';
import { PipelineSceneData } from '../pipeline-scene-data';
import { PipelineInputAssemblerData } from '../render-types';
import { DescriptorSetData, LayoutGraphData, PipelineLayoutData, RenderPhaseData, RenderStageData } from './layout-graph';
import { BasicPipeline } from './pipeline';
import { Blit, ComputePass, ComputeView, ManagedBuffer, ManagedResource, PersistentBuffer, PersistentTexture, RasterPass, RenderData, RenderGraph, RenderQueue, RenderSwapchain, ResourceDesc, ResourceGraph, ResourceTraits, SceneData } from './render-graph';
import { QueueHint } from './types';
import { DefaultVisitor, ReferenceGraphView } from './graph';
import { VectorGraphColorMap } from './effect';
import { RenderPassMergeInfo } from './define';
import { LightResource, SceneCulling } from './scene-culling';
import { Pass, RenderScene } from '../../render-scene';
interface RecordingInterface {
    preRecord(): void;
    record(): void;
    postRecord(): void;
}
declare class DeviceResource {
    protected _name: string;
    constructor(name: string);
    get name(): string;
}
declare class DeviceTexture extends DeviceResource {
    protected _texture: Texture | null;
    protected _swapchain: Swapchain | null;
    protected _framebuffer: Framebuffer | null;
    protected _desc: ResourceDesc | null;
    protected _trait: ResourceTraits | null;
    get texture(): Texture | null;
    set framebuffer(val: Framebuffer | null);
    get framebuffer(): Framebuffer | null;
    get description(): ResourceDesc | null;
    get trait(): ResourceTraits | null;
    get swapchain(): Swapchain | null;
    constructor(name: string, tex: PersistentTexture | Framebuffer | RenderSwapchain | ManagedResource);
    private createTextureFromDesc;
    getGPUTexture(): Texture;
    release(): void;
}
declare class DeviceBuffer extends DeviceResource {
    private _buffer;
    get buffer(): Buffer | null;
    constructor(name: string, buffer: ManagedBuffer | PersistentBuffer);
    private calculateBufferUsage;
    release(): void;
}
declare class BlitDesc {
    private _isUpdate;
    private _isGatherLight;
    private _blit;
    private _screenQuad;
    private _stageDesc;
    private _lightVolumeBuffer;
    private _lightMeterScale;
    private _lightBufferData;
    get screenQuad(): PipelineInputAssemblerData | null;
    get blit(): Blit;
    set blit(blit: Blit);
    get stageDesc(): DescriptorSet | undefined;
    constructor(blit: Blit);
    /**
     * @zh
     * 创建四边形输入汇集器。
     */
    protected _createQuadInputAssembler(): PipelineInputAssemblerData;
    createScreenQuad(): void;
    private _gatherVolumeLights;
    update(): void;
    reset(): void;
    createStageDescriptor(): void;
}
declare class DeviceComputeQueue implements RecordingInterface {
    preRecord(): void;
    postRecord(): void;
    private _devicePass;
    private _hint;
    private _phaseID;
    private _renderPhase;
    private _descSetData;
    private _layoutID;
    private _isUpdateUBO;
    private _isUploadInstance;
    private _isUploadBatched;
    private _queueId;
    init(devicePass: DeviceComputePass, renderQueue: RenderQueue, id: number): void;
    get phaseID(): number;
    set layoutID(value: number);
    get layoutID(): number;
    get descSetData(): DescriptorSetData | null;
    get renderPhase(): RenderPhaseData | null;
    set queueId(val: number);
    get queueId(): number;
    set isUpdateUBO(update: boolean);
    get isUpdateUBO(): boolean;
    set isUploadInstance(value: boolean);
    get isUploadInstance(): boolean;
    set isUploadBatched(value: boolean);
    get isUploadBatched(): boolean;
    reset(): void;
    set queueHint(value: QueueHint);
    get queueHint(): QueueHint;
    get devicePass(): DeviceComputePass;
    record(): void;
}
declare class DeviceRenderQueue implements RecordingInterface {
    private _renderScenes;
    private _devicePass?;
    private _hint;
    private _graphQueue;
    private _phaseID;
    private _renderPhase;
    private _descSetData;
    private _viewport;
    private _scissor;
    private _layoutID;
    private _isUpdateUBO;
    private _isUploadInstance;
    private _isUploadBatched;
    get phaseID(): number;
    set layoutID(value: number);
    get layoutID(): number;
    get descSetData(): DescriptorSetData | null;
    get renderPhase(): RenderPhaseData | null;
    get viewport(): Viewport | null;
    get scissor(): Rect | null;
    private _blitDesc;
    private _queueId;
    set queueId(val: number);
    get queueId(): number;
    set isUpdateUBO(update: boolean);
    get isUpdateUBO(): boolean;
    set isUploadInstance(value: boolean);
    get isUploadInstance(): boolean;
    set isUploadBatched(value: boolean);
    get isUploadBatched(): boolean;
    init(devicePass: any, renderQueue: RenderQueue, id: number): void;
    createBlitDesc(blit: Blit): void;
    setScene(sceneID: number, scene?: SceneData, blit?: Blit): DeviceRenderScene;
    reset(): void;
    get graphQueue(): RenderQueue;
    get blitDesc(): BlitDesc | null;
    get renderScenes(): DeviceRenderScene[];
    set queueHint(value: QueueHint);
    get queueHint(): QueueHint;
    get devicePass(): DeviceRenderPass;
    preRecord(): void;
    record(): void;
    postRecord(): void;
}
declare class RenderPassLayoutInfo {
    protected _layoutID: number;
    protected _vertID: number;
    private _resID;
    protected _stage: RenderStageData | null;
    protected _layout: PipelineLayoutData;
    protected _inputName: string;
    protected _descriptorSet: DescriptorSet | null;
    constructor(layoutId: number, vertId: number, input: [string, ComputeView[]]);
    private bindDescriptor;
    get descriptorSet(): DescriptorSet | null;
    get layoutID(): number;
    get vertID(): number;
    get stage(): RenderStageData | null;
    get layout(): PipelineLayoutData;
}
declare class DeviceRenderPass implements RecordingInterface {
    protected _renderPass: RenderPass;
    protected _framebuffer: Framebuffer;
    protected _clearColor: Color[];
    protected _deviceQueues: Map<number, DeviceRenderQueue>;
    protected _resolveTextures: Map<string, DeviceTexture>;
    protected _clearDepth: number;
    protected _clearStencil: number;
    protected _passID: number;
    protected _rasterID: number;
    protected _rasterPass: RasterPass;
    protected _layoutName: string;
    protected _viewport: Viewport | null;
    private _layout;
    private _idxOfRenderData;
    private _traversalResolves;
    private _getOrCreateDeviceTex;
    private _applyResolve;
    constructor(rasterID: number, rasterPass: RasterPass);
    get passMergeInfo(): RenderPassMergeInfo;
    get indexOfRD(): number;
    get rasterID(): number;
    get layoutName(): string;
    get passID(): number;
    get renderLayout(): RenderPassLayoutInfo | null;
    get renderPass(): RenderPass;
    get framebuffer(): Framebuffer;
    get clearColor(): Color[];
    get clearDepth(): number;
    get clearStencil(): number;
    get deviceQueues(): Map<number, DeviceRenderQueue>;
    get viewport(): Viewport | null;
    addIdxOfRD(): void;
    visitResource(resName: string): void;
    addQueue(queue: DeviceRenderQueue): void;
    preRecord(): void;
    protected _applyRenderLayout(input: [string, ComputeView[]]): void;
    getGlobalDescData(): DescriptorSetData;
    protected _applyViewport(frameTex: Texture): void;
    bindGlobalDesc(): void;
    beginPass(): void;
    endPass(): void;
    record(): void;
    postRecord(): void;
    private _processRenderLayout;
    processRenderLayout(): void;
    private _createFramebuffer;
    resetResource(id: number, pass: RasterPass): void;
}
declare class ComputePassInfo {
    protected _id: number;
    protected _pass: ComputePass;
    get id(): number;
    get pass(): ComputePass;
    applyInfo(id: number, pass: ComputePass): void;
}
declare class DeviceComputePass implements RecordingInterface {
    protected _deviceQueues: DeviceComputeQueue[];
    protected _passID: number;
    protected _layoutName: string;
    protected _viewport: Viewport | null;
    private _computeInfo;
    private _layout;
    constructor(passInfo: ComputePassInfo);
    preRecord(): void;
    postRecord(): void;
    get layoutName(): string;
    get passID(): number;
    get renderLayout(): RenderPassLayoutInfo | null;
    get deviceQueues(): DeviceComputeQueue[];
    get computePassInfo(): ComputePassInfo;
    visitResource(resName: string): void;
    addQueue(queue: DeviceComputeQueue): void;
    protected _applyRenderLayout(input: [string, ComputeView[]]): void;
    getGlobalDescData(): DescriptorSetData;
    record(): void;
    resetResource(id: number, pass: ComputePass): void;
}
declare class DeviceRenderScene implements RecordingInterface {
    protected _currentQueue: DeviceRenderQueue;
    protected _renderPass: RenderPass;
    protected _scene: RenderScene | null;
    protected _camera: Camera | null;
    protected _sceneData?: SceneData;
    protected _blit?: Blit;
    protected _sceneID: number;
    get blit(): Blit | undefined;
    get sceneData(): SceneData | undefined;
    get sceneID(): number;
    get camera(): Camera | null;
    preRecord(): void;
    postRecord(): void;
    init(queue: DeviceRenderQueue, sceneID: number, scene?: SceneData, blit?: Blit): void;
    protected _record3D(): void;
    protected _recordUI(): void;
    protected _showProfiler(): void;
    private _recordBlit;
    protected _updateGlobal(data: RenderData, sceneId: number): void;
    protected _updateRenderData(): void;
    private _applyViewport;
    record(): void;
}
declare class ExecutorPools {
    constructor();
    addDeviceQueue(): DeviceRenderQueue;
    addComputeQueue(): DeviceComputeQueue;
    addDeviceScene(): DeviceRenderScene;
    reset(): void;
    readonly deviceQueuePool: RecyclePool<DeviceRenderQueue>;
    readonly computeQueuePool: RecyclePool<DeviceComputeQueue>;
    readonly passPool: RecyclePool<IRenderPass>;
    readonly deviceScenePool: RecyclePool<DeviceRenderScene>;
}
declare class BlitInfo {
    private _pipelineIAData;
    private _context;
    private _width;
    private _height;
    private _lightVolumeBuffer;
    private _lightBufferData;
    private _deferredLitsBufView;
    private _localUBO;
    private _stageDescs;
    get pipelineIAData(): PipelineInputAssemblerData;
    get deferredLitsBufView(): Buffer;
    get lightVolumeBuffer(): Buffer;
    get lightBufferData(): Float32Array;
    get stageDescs(): Map<Pass, DescriptorSet>;
    get emptyLocalUBO(): Buffer;
    constructor(context: ExecutorContext);
    resize(width: any, height: any): void;
    private _createLightVolumes;
    private _genQuadVertexData;
    private _createQuadInputAssembler;
}
declare class ExecutorContext {
    constructor(pipeline: BasicPipeline, device: Device, resourceGraph: ResourceGraph, renderGraph: RenderGraph, layoutGraph: LayoutGraphData, width: number, height: number, descriptorSet?: null);
    reset(): void;
    resize(width: number, height: number): void;
    readonly device: Device;
    readonly pipeline: BasicPipeline;
    readonly commandBuffer: CommandBuffer;
    readonly pipelineSceneData: PipelineSceneData;
    readonly resourceGraph: ResourceGraph;
    readonly devicePasses: Map<number, DeviceRenderPass>;
    readonly deviceTextures: Map<string, DeviceTexture>;
    readonly deviceBuffers: Map<string, DeviceBuffer>;
    readonly layoutGraph: LayoutGraphData;
    readonly root: Root;
    readonly pools: ExecutorPools;
    readonly culling: SceneCulling;
    private _blit;
    get blit(): BlitInfo;
    lightResource: LightResource;
    renderGraph: RenderGraph;
    width: number;
    height: number;
    cullCamera: any;
    passDescriptorSet: DescriptorSet | null;
    profilerDescriptorSet: DescriptorSet;
    passShowStatistics: boolean;
}
export declare class Executor {
    constructor(pipeline: BasicPipeline, device: Device, resourceGraph: ResourceGraph, layoutGraph: LayoutGraphData, width: number, height: number);
    resize(width: number, height: number): void;
    private _removeDeviceResource;
    execute(rg: RenderGraph): void;
    release(): void;
    readonly _context: ExecutorContext;
    private _visitor;
}
export declare class RenderVisitor extends DefaultVisitor {
    private _preVisitor;
    private _postVisitor;
    private _graphView;
    private _colorMap;
    constructor();
    get graphView(): ReferenceGraphView<RenderGraph>;
    get colorMap(): VectorGraphColorMap;
    discoverVertex(u: number, gv: ReferenceGraphView<RenderGraph>): void;
    finishVertex(v: number, gv: ReferenceGraphView<RenderGraph>): void;
}
export {};
