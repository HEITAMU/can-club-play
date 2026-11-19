/**
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 * The following section is auto-generated.
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 */
import { AdjI, AdjacencyGraph, BidirectionalGraph, ComponentGraph, ED, InEI, MutableGraph, MutableReferenceGraph, NamedGraph, OutE, OutEI, PolymorphicGraph, PropertyGraph, ReferenceGraph, UuidGraph, VertexListGraph } from './graph';
import type { Material } from '../../asset/assets';
import type { Camera } from '../../render-scene/scene/camera';
import type { Buffer, Framebuffer, RenderPass, Sampler, SamplerInfo, Swapchain, Texture } from '../../gfx';
import { AccessFlagBit, ClearFlagBit, Color, Format, LoadOp, SampleCount, ShaderStageFlagBit, StoreOp, TextureFlagBit, TextureType, Viewport } from '../../gfx';
import type { CopyPair, MovePair, ResolvePair, UploadPair } from './types';
import { AccessType, AttachmentType, ClearValueType, LightInfo, QueueHint, ResourceDimension, ResourceFlags, ResourceResidency, SceneFlags, RenderCommonObjectPool } from './types';
import type { RenderScene } from '../../render-scene/core/render-scene';
import type { RenderWindow } from '../../render-scene/core/render-window';
import type { Light, Model } from '../../render-scene/scene';
export declare class ClearValue {
    constructor(x?: number, y?: number, z?: number, w?: number);
    reset(x: number, y: number, z: number, w: number): void;
    x: number;
    y: number;
    z: number;
    w: number;
}
export declare class RasterView {
    constructor(slotName?: string, accessType?: AccessType, attachmentType?: AttachmentType, loadOp?: LoadOp, storeOp?: StoreOp, clearFlags?: ClearFlagBit, clearColor?: Color, shaderStageFlags?: ShaderStageFlagBit);
    reset(slotName: string, accessType: AccessType, attachmentType: AttachmentType, loadOp: LoadOp, storeOp: StoreOp, clearFlags: ClearFlagBit, shaderStageFlags: ShaderStageFlagBit): void;
    slotName: string;
    slotName1: string;
    accessType: AccessType;
    attachmentType: AttachmentType;
    loadOp: LoadOp;
    storeOp: StoreOp;
    clearFlags: ClearFlagBit;
    readonly clearColor: Color;
    slotID: number;
    shaderStageFlags: ShaderStageFlagBit;
}
export declare class ComputeView {
    constructor(name?: string, accessType?: AccessType, clearFlags?: ClearFlagBit, clearValueType?: ClearValueType, clearValue?: ClearValue, shaderStageFlags?: ShaderStageFlagBit);
    reset(name: string, accessType: AccessType, clearFlags: ClearFlagBit, clearValueType: ClearValueType, shaderStageFlags: ShaderStageFlagBit): void;
    name: string;
    accessType: AccessType;
    plane: number;
    clearFlags: ClearFlagBit;
    clearValueType: ClearValueType;
    readonly clearValue: ClearValue;
    shaderStageFlags: ShaderStageFlagBit;
}
export declare class ResourceDesc {
    reset(): void;
    dimension: ResourceDimension;
    alignment: number;
    width: number;
    height: number;
    depthOrArraySize: number;
    mipLevels: number;
    format: Format;
    sampleCount: SampleCount;
    textureFlags: TextureFlagBit;
    flags: ResourceFlags;
    viewType: TextureType;
}
export declare class ResourceTraits {
    constructor(residency?: ResourceResidency);
    reset(residency: ResourceResidency): void;
    residency: ResourceResidency;
}
export declare class RenderSwapchain {
    constructor(swapchain?: Swapchain | null, isDepthStencil?: boolean);
    reset(swapchain: Swapchain | null, isDepthStencil: boolean): void;
    swapchain: Swapchain | null;
    renderWindow: RenderWindow | null;
    currentID: number;
    numBackBuffers: number;
    generation: number;
    isDepthStencil: boolean;
}
export declare class ResourceStates {
    reset(): void;
    states: AccessFlagBit;
}
export declare class ManagedBuffer {
    constructor(buffer?: Buffer | null);
    reset(buffer: Buffer | null): void;
    buffer: Buffer | null;
    fenceValue: number;
}
export declare class PersistentBuffer {
    constructor(buffer?: Buffer | null);
    reset(buffer: Buffer | null): void;
    buffer: Buffer | null;
    fenceValue: number;
}
export declare class ManagedTexture {
    constructor(texture?: Texture | null);
    reset(texture: Texture | null): void;
    texture: Texture | null;
    fenceValue: number;
}
export declare class PersistentTexture {
    constructor(texture?: Texture | null);
    reset(texture: Texture | null): void;
    texture: Texture | null;
    fenceValue: number;
}
export declare class ManagedResource {
    reset(): void;
    unused: number;
}
export declare class Subpass {
    reset(): void;
    readonly rasterViews: Map<string, RasterView>;
    readonly computeViews: Map<string, ComputeView[]>;
    readonly resolvePairs: ResolvePair[];
}
export declare class SubpassGraphVertex {
    /** Out edge list */
    readonly o: OutE[];
    /** In edge list */
    readonly i: OutE[];
}
export declare const enum SubpassGraphComponent {
    Name = 0,
    Subpass = 1
}
export interface SubpassGraphComponentType {
    [SubpassGraphComponent.Name]: string;
    [SubpassGraphComponent.Subpass]: Subpass;
}
export declare class SubpassGraph implements BidirectionalGraph, AdjacencyGraph, VertexListGraph, MutableGraph, PropertyGraph, NamedGraph, ComponentGraph {
    /** null vertex descriptor */
    readonly N = 4294967295;
    edge(u: number, v: number): boolean;
    source(e: ED): number;
    target(e: ED): number;
    oe(v: number): OutEI;
    od(v: number): number;
    ie(v: number): InEI;
    id(v: number): number;
    d(v: number): number;
    adj(v: number): AdjI;
    v(): IterableIterator<number>;
    nv(): number;
    ne(): number;
    clear(): void;
    addVertex(name: string, subpass: Subpass): number;
    addEdge(u: number, v: number): ED | null;
    vertexName(v: number): string;
    getName(v: number): string;
    setName(v: number, value: string): void;
    getSubpass(v: number): Subpass;
    readonly x: SubpassGraphVertex[];
    readonly _names: string[];
    readonly _subpasses: Subpass[];
}
export declare class RasterSubpass {
    constructor(subpassID?: number, count?: number, quality?: number);
    reset(subpassID: number, count: number, quality: number): void;
    readonly rasterViews: Map<string, RasterView>;
    readonly computeViews: Map<string, ComputeView[]>;
    readonly resolvePairs: ResolvePair[];
    readonly viewport: Viewport;
    subpassID: number;
    count: number;
    quality: number;
    showStatistics: boolean;
}
export declare class ComputeSubpass {
    constructor(subpassID?: number);
    reset(subpassID: number): void;
    readonly rasterViews: Map<string, RasterView>;
    readonly computeViews: Map<string, ComputeView[]>;
    subpassID: number;
}
export declare class RasterPass {
    reset(): void;
    readonly rasterViews: Map<string, RasterView>;
    readonly computeViews: Map<string, ComputeView[]>;
    readonly attachmentIndexMap: Map<string, number>;
    readonly textures: Map<string, ShaderStageFlagBit>;
    readonly subpassGraph: SubpassGraph;
    width: number;
    height: number;
    count: number;
    quality: number;
    readonly viewport: Viewport;
    versionName: string;
    version: number;
    hashValue: number;
    showStatistics: boolean;
}
export declare class PersistentRenderPassAndFramebuffer {
    constructor(renderPass?: RenderPass | null, framebuffer?: Framebuffer | null);
    reset(renderPass: RenderPass | null, framebuffer: Framebuffer | null): void;
    renderPass: RenderPass | null;
    framebuffer: Framebuffer | null;
    readonly clearColors: Color[];
    clearDepth: number;
    clearStencil: number;
}
export declare class FormatView {
    reset(): void;
    format: Format;
}
export declare class SubresourceView {
    reset(): void;
    textureView: Texture | null;
    format: Format;
    indexOrFirstMipLevel: number;
    numMipLevels: number;
    firstArraySlice: number;
    numArraySlices: number;
    firstPlane: number;
    numPlanes: number;
}
export declare const enum ResourceGraphValue {
    Managed = 0,
    ManagedBuffer = 1,
    ManagedTexture = 2,
    PersistentBuffer = 3,
    PersistentTexture = 4,
    Framebuffer = 5,
    Swapchain = 6,
    FormatView = 7,
    SubresourceView = 8
}
export declare function getResourceGraphValueName(e: ResourceGraphValue): string;
export interface ResourceGraphValueType {
    [ResourceGraphValue.Managed]: ManagedResource;
    [ResourceGraphValue.ManagedBuffer]: ManagedBuffer;
    [ResourceGraphValue.ManagedTexture]: ManagedTexture;
    [ResourceGraphValue.PersistentBuffer]: PersistentBuffer;
    [ResourceGraphValue.PersistentTexture]: PersistentTexture;
    [ResourceGraphValue.Framebuffer]: Framebuffer;
    [ResourceGraphValue.Swapchain]: RenderSwapchain;
    [ResourceGraphValue.FormatView]: FormatView;
    [ResourceGraphValue.SubresourceView]: SubresourceView;
}
export interface ResourceGraphVisitor {
    managed(value: ManagedResource): unknown;
    managedBuffer(value: ManagedBuffer): unknown;
    managedTexture(value: ManagedTexture): unknown;
    persistentBuffer(value: PersistentBuffer): unknown;
    persistentTexture(value: PersistentTexture): unknown;
    framebuffer(value: Framebuffer): unknown;
    swapchain(value: RenderSwapchain): unknown;
    formatView(value: FormatView): unknown;
    subresourceView(value: SubresourceView): unknown;
}
export type ResourceGraphObject = ManagedResource | ManagedBuffer | ManagedTexture | PersistentBuffer | PersistentTexture | Framebuffer | RenderSwapchain | FormatView | SubresourceView;
export declare class ResourceGraphVertex {
    readonly id: ResourceGraphValue;
    readonly object: ResourceGraphObject;
    constructor(id: ResourceGraphValue, object: ResourceGraphObject);
    /** Out edge list */
    readonly o: OutE[];
    /** In edge list */
    readonly i: OutE[];
    /** Polymorphic object Id */
    readonly t: ResourceGraphValue;
    /** Polymorphic object */
    j: ResourceGraphObject;
}
export declare const enum ResourceGraphComponent {
    Name = 0,
    Desc = 1,
    Traits = 2,
    States = 3,
    Sampler = 4
}
export interface ResourceGraphComponentType {
    [ResourceGraphComponent.Name]: string;
    [ResourceGraphComponent.Desc]: ResourceDesc;
    [ResourceGraphComponent.Traits]: ResourceTraits;
    [ResourceGraphComponent.States]: ResourceStates;
    [ResourceGraphComponent.Sampler]: SamplerInfo;
}
export declare class ResourceGraph implements BidirectionalGraph, AdjacencyGraph, VertexListGraph, MutableGraph, PropertyGraph, NamedGraph, ComponentGraph, PolymorphicGraph, ReferenceGraph, MutableReferenceGraph, UuidGraph<string> {
    /** null vertex descriptor */
    readonly N = 4294967295;
    edge(u: number, v: number): boolean;
    source(e: ED): number;
    target(e: ED): number;
    oe(v: number): OutEI;
    od(v: number): number;
    ie(v: number): InEI;
    id(v: number): number;
    d(v: number): number;
    adj(v: number): AdjI;
    v(): IterableIterator<number>;
    nv(): number;
    ne(): number;
    clear(): void;
    addVertex<T extends ResourceGraphValue>(id: T, object: ResourceGraphValueType[T], name: string, desc: ResourceDesc, traits: ResourceTraits, states: ResourceStates, sampler: SamplerInfo, u?: number): number;
    addEdge(u: number, v: number): ED | null;
    vertexName(v: number): string;
    getName(v: number): string;
    setName(v: number, value: string): void;
    getDesc(v: number): ResourceDesc;
    getTraits(v: number): ResourceTraits;
    getStates(v: number): ResourceStates;
    getSampler(v: number): SamplerInfo;
    h(id: ResourceGraphValue, v: number): boolean;
    w(v: number): ResourceGraphValue;
    object(v: number): ResourceGraphObject;
    value<T extends ResourceGraphValue>(id: T, v: number): ResourceGraphValueType[T];
    visitVertex(visitor: ResourceGraphVisitor, v: number): unknown;
    j<T extends ResourceGraphObject>(v: number): T;
    reference(u: number, v: number): boolean;
    parent(e: ED): number;
    child(e: ED): number;
    children(v: number): OutEI;
    numChildren(v: number): number;
    getParent(v: number): number;
    addReference(u: number, v: number): ED | null;
    contains(key: string): boolean;
    vertex(key: string): number;
    find(key: string): number;
    readonly x: ResourceGraphVertex[];
    readonly _names: string[];
    readonly _descs: ResourceDesc[];
    readonly _traits: ResourceTraits[];
    readonly _states: ResourceStates[];
    readonly _samplerInfo: SamplerInfo[];
    readonly _valueIndex: Map<string, number>;
    readonly renderPasses: Map<string, PersistentRenderPassAndFramebuffer>;
    nextFenceValue: number;
    version: number;
}
export declare class ComputePass {
    reset(): void;
    readonly computeViews: Map<string, ComputeView[]>;
    readonly textures: Map<string, ShaderStageFlagBit>;
}
export declare class ResolvePass {
    reset(): void;
    readonly resolvePairs: ResolvePair[];
}
export declare class CopyPass {
    reset(): void;
    readonly copyPairs: CopyPair[];
    readonly uploadPairs: UploadPair[];
}
export declare class MovePass {
    reset(): void;
    readonly movePairs: MovePair[];
}
export declare class RaytracePass {
    reset(): void;
    readonly computeViews: Map<string, ComputeView[]>;
}
export declare class ClearView {
    constructor(slotName?: string, clearFlags?: ClearFlagBit, clearColor?: Color);
    reset(slotName: string, clearFlags: ClearFlagBit): void;
    slotName: string;
    clearFlags: ClearFlagBit;
    readonly clearColor: Color;
}
export declare class RenderQueue {
    constructor(hint?: QueueHint, phaseID?: number, passLayoutID?: number);
    reset(hint: QueueHint, phaseID: number, passLayoutID: number): void;
    hint: QueueHint;
    phaseID: number;
    passLayoutID: number;
    viewport: Viewport | null;
}
export declare const enum CullingFlags {
    NONE = 0,
    CAMERA_FRUSTUM = 1,
    LIGHT_FRUSTUM = 2,
    LIGHT_BOUNDS = 4
}
export declare class SceneData {
    constructor(scene?: RenderScene | null, camera?: Camera | null, flags?: SceneFlags, light?: LightInfo, cullingFlags?: CullingFlags, shadingLight?: Light | null);
    reset(scene: RenderScene | null, camera: Camera | null, flags: SceneFlags, cullingFlags: CullingFlags, shadingLight: Light | null): void;
    scene: RenderScene | null;
    camera: Camera | null;
    readonly light: LightInfo;
    flags: SceneFlags;
    cullingFlags: CullingFlags;
    shadingLight: Light | null;
}
export declare class Dispatch {
    constructor(material?: Material | null, passID?: number, threadGroupCountX?: number, threadGroupCountY?: number, threadGroupCountZ?: number);
    reset(material: Material | null, passID: number, threadGroupCountX: number, threadGroupCountY: number, threadGroupCountZ: number): void;
    material: Material | null;
    passID: number;
    threadGroupCountX: number;
    threadGroupCountY: number;
    threadGroupCountZ: number;
}
export declare const enum BlitType {
    FULLSCREEN_QUAD = 0,
    DRAW_2D = 1,
    DRAW_PROFILE = 2,
    DRAW_3D = 3
}
export declare class Blit {
    constructor(material?: Material | null, passID?: number, sceneFlags?: SceneFlags, camera?: Camera | null, blitType?: BlitType);
    reset(material: Material | null, passID: number, sceneFlags: SceneFlags, camera: Camera | null, blitType: BlitType): void;
    material: Material | null;
    passID: number;
    sceneFlags: SceneFlags;
    camera: Camera | null;
    blitType: BlitType;
    readonly models: Model[];
}
export declare class RenderData {
    reset(): void;
    readonly constants: Map<number, number[]>;
    readonly buffers: Map<number, Buffer>;
    readonly textures: Map<number, Texture>;
    readonly samplers: Map<number, Sampler>;
    custom: string;
}
export declare const enum RenderGraphValue {
    RasterPass = 0,
    RasterSubpass = 1,
    ComputeSubpass = 2,
    Compute = 3,
    Resolve = 4,
    Copy = 5,
    Move = 6,
    Raytrace = 7,
    Queue = 8,
    Scene = 9,
    Blit = 10,
    Dispatch = 11,
    Clear = 12,
    Viewport = 13
}
export declare function getRenderGraphValueName(e: RenderGraphValue): string;
export interface RenderGraphValueType {
    [RenderGraphValue.RasterPass]: RasterPass;
    [RenderGraphValue.RasterSubpass]: RasterSubpass;
    [RenderGraphValue.ComputeSubpass]: ComputeSubpass;
    [RenderGraphValue.Compute]: ComputePass;
    [RenderGraphValue.Resolve]: ResolvePass;
    [RenderGraphValue.Copy]: CopyPass;
    [RenderGraphValue.Move]: MovePass;
    [RenderGraphValue.Raytrace]: RaytracePass;
    [RenderGraphValue.Queue]: RenderQueue;
    [RenderGraphValue.Scene]: SceneData;
    [RenderGraphValue.Blit]: Blit;
    [RenderGraphValue.Dispatch]: Dispatch;
    [RenderGraphValue.Clear]: ClearView[];
    [RenderGraphValue.Viewport]: Viewport;
}
export interface RenderGraphVisitor {
    rasterPass(value: RasterPass): unknown;
    rasterSubpass(value: RasterSubpass): unknown;
    computeSubpass(value: ComputeSubpass): unknown;
    compute(value: ComputePass): unknown;
    resolve(value: ResolvePass): unknown;
    copy(value: CopyPass): unknown;
    move(value: MovePass): unknown;
    raytrace(value: RaytracePass): unknown;
    queue(value: RenderQueue): unknown;
    scene(value: SceneData): unknown;
    blit(value: Blit): unknown;
    dispatch(value: Dispatch): unknown;
    clear(value: ClearView[]): unknown;
    viewport(value: Viewport): unknown;
}
export type RenderGraphObject = RasterPass | RasterSubpass | ComputeSubpass | ComputePass | ResolvePass | CopyPass | MovePass | RaytracePass | RenderQueue | SceneData | Blit | Dispatch | ClearView[] | Viewport;
export declare class RenderGraphVertex {
    readonly id: RenderGraphValue;
    readonly object: RenderGraphObject;
    constructor(id: RenderGraphValue, object: RenderGraphObject);
    /** Out edge list */
    readonly o: OutE[];
    /** In edge list */
    readonly i: OutE[];
    /** Child edge list */
    readonly c: OutE[];
    /** Parent edge list */
    readonly p: OutE[];
    /** Polymorphic object Id */
    readonly t: RenderGraphValue;
    /** Polymorphic object */
    j: RenderGraphObject;
}
export declare const enum RenderGraphComponent {
    Name = 0,
    Layout = 1,
    Data = 2,
    Valid = 3
}
export interface RenderGraphComponentType {
    [RenderGraphComponent.Name]: string;
    [RenderGraphComponent.Layout]: string;
    [RenderGraphComponent.Data]: RenderData;
    [RenderGraphComponent.Valid]: boolean;
}
export declare class RenderGraph implements BidirectionalGraph, AdjacencyGraph, VertexListGraph, MutableGraph, PropertyGraph, NamedGraph, ComponentGraph, PolymorphicGraph, ReferenceGraph, MutableReferenceGraph {
    /** null vertex descriptor */
    readonly N = 4294967295;
    edge(u: number, v: number): boolean;
    source(e: ED): number;
    target(e: ED): number;
    oe(v: number): OutEI;
    od(v: number): number;
    ie(v: number): InEI;
    id(v: number): number;
    d(v: number): number;
    adj(v: number): AdjI;
    v(): IterableIterator<number>;
    nv(): number;
    ne(): number;
    clear(): void;
    addVertex<T extends RenderGraphValue>(id: T, object: RenderGraphValueType[T], name: string, layout: string, data: RenderData, valid: boolean, u?: number): number;
    addEdge(u: number, v: number): ED | null;
    vertexName(v: number): string;
    getName(v: number): string;
    setName(v: number, value: string): void;
    getLayout(v: number): string;
    setLayout(v: number, value: string): void;
    getData(v: number): RenderData;
    getValid(v: number): boolean;
    setValid(v: number, value: boolean): void;
    h(id: RenderGraphValue, v: number): boolean;
    w(v: number): RenderGraphValue;
    object(v: number): RenderGraphObject;
    value<T extends RenderGraphValue>(id: T, v: number): RenderGraphValueType[T];
    visitVertex(visitor: RenderGraphVisitor, v: number): unknown;
    j<T extends RenderGraphObject>(v: number): T;
    reference(u: number, v: number): boolean;
    parent(e: ED): number;
    child(e: ED): number;
    children(v: number): OutEI;
    numChildren(v: number): number;
    getParent(v: number): number;
    addReference(u: number, v: number): ED | null;
    readonly x: RenderGraphVertex[];
    readonly _names: string[];
    readonly _layoutNodes: string[];
    readonly _data: RenderData[];
    readonly _valid: boolean[];
    readonly index: Map<string, number>;
    readonly sortedVertices: number[];
    readonly globalRenderData: RenderData;
}
export declare class RenderGraphObjectPool {
    constructor(renderCommon: RenderCommonObjectPool);
    reset(): void;
    createClearValue(x?: number, y?: number, z?: number, w?: number): ClearValue;
    createRasterView(slotName?: string, accessType?: AccessType, attachmentType?: AttachmentType, loadOp?: LoadOp, storeOp?: StoreOp, clearFlags?: ClearFlagBit, shaderStageFlags?: ShaderStageFlagBit): RasterView;
    createComputeView(name?: string, accessType?: AccessType, clearFlags?: ClearFlagBit, clearValueType?: ClearValueType, shaderStageFlags?: ShaderStageFlagBit): ComputeView;
    createResourceDesc(): ResourceDesc;
    createResourceTraits(residency?: ResourceResidency): ResourceTraits;
    createRenderSwapchain(swapchain?: Swapchain | null, isDepthStencil?: boolean): RenderSwapchain;
    createResourceStates(): ResourceStates;
    createManagedBuffer(buffer?: Buffer | null): ManagedBuffer;
    createPersistentBuffer(buffer?: Buffer | null): PersistentBuffer;
    createManagedTexture(texture?: Texture | null): ManagedTexture;
    createPersistentTexture(texture?: Texture | null): PersistentTexture;
    createManagedResource(): ManagedResource;
    createSubpass(): Subpass;
    createSubpassGraph(): SubpassGraph;
    createRasterSubpass(subpassID?: number, count?: number, quality?: number): RasterSubpass;
    createComputeSubpass(subpassID?: number): ComputeSubpass;
    createRasterPass(): RasterPass;
    createPersistentRenderPassAndFramebuffer(renderPass?: RenderPass | null, framebuffer?: Framebuffer | null): PersistentRenderPassAndFramebuffer;
    createFormatView(): FormatView;
    createSubresourceView(): SubresourceView;
    createResourceGraph(): ResourceGraph;
    createComputePass(): ComputePass;
    createResolvePass(): ResolvePass;
    createCopyPass(): CopyPass;
    createMovePass(): MovePass;
    createRaytracePass(): RaytracePass;
    createClearView(slotName?: string, clearFlags?: ClearFlagBit): ClearView;
    createRenderQueue(hint?: QueueHint, phaseID?: number, passLayoutID?: number): RenderQueue;
    createSceneData(scene?: RenderScene | null, camera?: Camera | null, flags?: SceneFlags, cullingFlags?: CullingFlags, shadingLight?: Light | null): SceneData;
    createDispatch(material?: Material | null, passID?: number, threadGroupCountX?: number, threadGroupCountY?: number, threadGroupCountZ?: number): Dispatch;
    createBlit(material?: Material | null, passID?: number, sceneFlags?: SceneFlags, camera?: Camera | null, blitType?: BlitType): Blit;
    createRenderData(): RenderData;
    createRenderGraph(): RenderGraph;
    readonly renderCommon: RenderCommonObjectPool;
    private readonly cv;
    private readonly rv;
    private readonly cv1;
    private readonly rd;
    private readonly rt;
    private readonly rs;
    private readonly rs1;
    private readonly mb;
    private readonly pb;
    private readonly mt;
    private readonly pt;
    private readonly mr;
    private readonly s;
    private readonly sg;
    private readonly rs2;
    private readonly cs;
    private readonly rp;
    private readonly prpaf;
    private readonly fv;
    private readonly sv;
    private readonly rg;
    private readonly cp;
    private readonly rp1;
    private readonly cp1;
    private readonly mp;
    private readonly rp2;
    private readonly cv2;
    private readonly rq;
    private readonly sd;
    private readonly d;
    private readonly b;
    private readonly rd1;
    private readonly rg1;
}
