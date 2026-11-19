import { AddressableGraph, AdjI, AdjacencyGraph, BidirectionalGraph, ComponentGraph, ED, InEI, MutableGraph, MutableReferenceGraph, NamedGraph, OutE, OutEI, PolymorphicGraph, PropertyGraph, ReferenceGraph, VertexListGraph } from './graph';
import type { DescriptorSet, DescriptorSetLayout, PipelineLayout } from '../../gfx';
import { DescriptorSetLayoutInfo, Format, MemoryAccessBit, SampleType, ShaderStageFlagBit, Type, UniformBlock, ViewDimension } from '../../gfx';
import { ParameterType, UpdateFrequency, RenderCommonObjectPool } from './types';
import type { OutputArchive, InputArchive } from './archive';
export declare const enum LayoutType {
    VULKAN = 0,
    WEBGPU = 1
}
export declare class Layout {
    static type: LayoutType;
    static isWebGPU: boolean;
}
export declare const enum DescriptorTypeOrder {
    UNIFORM_BUFFER = 0,
    DYNAMIC_UNIFORM_BUFFER = 1,
    SAMPLER_TEXTURE = 2,
    SAMPLER = 3,
    TEXTURE = 4,
    STORAGE_BUFFER = 5,
    DYNAMIC_STORAGE_BUFFER = 6,
    STORAGE_IMAGE = 7,
    INPUT_ATTACHMENT = 8
}
export declare class Descriptor {
    constructor(type?: Type);
    reset(type: Type): void;
    type: Type;
    count: number;
}
export declare class DescriptorBlock {
    reset(): void;
    readonly descriptors: Map<string, Descriptor>;
    readonly uniformBlocks: Map<string, UniformBlock>;
    capacity: number;
    count: number;
}
export declare class DescriptorBlockFlattened {
    reset(): void;
    readonly descriptorNames: string[];
    readonly uniformBlockNames: string[];
    readonly descriptors: Descriptor[];
    readonly uniformBlocks: UniformBlock[];
    capacity: number;
    count: number;
}
export declare class DescriptorBlockIndex {
    constructor(updateFrequency?: UpdateFrequency, parameterType?: ParameterType, descriptorType?: DescriptorTypeOrder, visibility?: ShaderStageFlagBit);
    updateFrequency: UpdateFrequency;
    parameterType: ParameterType;
    descriptorType: DescriptorTypeOrder;
    visibility: ShaderStageFlagBit;
}
export declare class DescriptorGroupBlockIndex {
    constructor(updateFrequency?: UpdateFrequency, parameterType?: ParameterType, descriptorType?: DescriptorTypeOrder, visibility?: ShaderStageFlagBit, accessType?: MemoryAccessBit, viewDimension?: ViewDimension, sampleType?: SampleType, format?: Format);
    updateFrequency: UpdateFrequency;
    parameterType: ParameterType;
    descriptorType: DescriptorTypeOrder;
    visibility: ShaderStageFlagBit;
    accessType: MemoryAccessBit;
    viewDimension: ViewDimension;
    sampleType: SampleType;
    format: Format;
}
export declare class DescriptorDB {
    reset(): void;
    readonly blocks: Map<string, DescriptorBlock>;
    readonly groupBlocks: Map<string, DescriptorBlock>;
}
export declare class RenderPhase {
    reset(): void;
    readonly shaders: Set<string>;
}
export declare const enum RenderPassType {
    SINGLE_RENDER_PASS = 0,
    RENDER_PASS = 1,
    RENDER_SUBPASS = 2
}
export declare const enum LayoutGraphValue {
    RenderStage = 0,
    RenderPhase = 1
}
export declare function getLayoutGraphValueName(e: LayoutGraphValue): string;
export interface LayoutGraphValueType {
    [LayoutGraphValue.RenderStage]: RenderPassType;
    [LayoutGraphValue.RenderPhase]: RenderPhase;
}
export interface LayoutGraphVisitor {
    renderStage(value: RenderPassType): unknown;
    renderPhase(value: RenderPhase): unknown;
}
export type LayoutGraphObject = RenderPassType | RenderPhase;
export declare class LayoutGraphVertex {
    readonly id: LayoutGraphValue;
    readonly object: LayoutGraphObject;
    constructor(id: LayoutGraphValue, object: LayoutGraphObject);
    /** Out edge list */
    readonly o: OutE[];
    /** In edge list */
    readonly i: OutE[];
    /** Polymorphic object Id */
    readonly t: LayoutGraphValue;
    /** Polymorphic object */
    j: LayoutGraphObject;
}
export declare const enum LayoutGraphComponent {
    Name = 0,
    Descriptors = 1
}
export interface LayoutGraphComponentType {
    [LayoutGraphComponent.Name]: string;
    [LayoutGraphComponent.Descriptors]: DescriptorDB;
}
export declare class LayoutGraph implements BidirectionalGraph, AdjacencyGraph, VertexListGraph, MutableGraph, PropertyGraph, NamedGraph, ComponentGraph, PolymorphicGraph, ReferenceGraph, MutableReferenceGraph, AddressableGraph {
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
    addVertex<T extends LayoutGraphValue>(id: T, object: LayoutGraphValueType[T], name: string, descriptors: DescriptorDB, u?: number): number;
    addEdge(u: number, v: number): ED | null;
    vertexName(v: number): string;
    getName(v: number): string;
    getDescriptors(v: number): DescriptorDB;
    h(id: LayoutGraphValue, v: number): boolean;
    w(v: number): LayoutGraphValue;
    object(v: number): LayoutGraphObject;
    value<T extends LayoutGraphValue>(id: T, v: number): LayoutGraphValueType[T];
    visitVertex(visitor: LayoutGraphVisitor, v: number): unknown;
    j<T extends LayoutGraphObject>(v: number): T;
    reference(u: number, v: number): boolean;
    parent(e: ED): number;
    child(e: ED): number;
    children(v: number): OutEI;
    numChildren(v: number): number;
    getParent(v: number): number;
    addReference(u: number, v: number): ED | null;
    locateChild(u: number, name: string): number;
    locate(absPath: string): number;
    locateRelative(path: string, start?: number): number;
    path(v: number): string;
    readonly x: LayoutGraphVertex[];
    readonly _names: string[];
    readonly _descriptors: DescriptorDB[];
}
export declare class UniformData {
    constructor(uniformID?: number, uniformType?: Type, offset?: number);
    reset(uniformID: number, uniformType: Type, offset: number): void;
    uniformID: number;
    uniformType: Type;
    offset: number;
    size: number;
}
export declare class UniformBlockData {
    reset(): void;
    bufferSize: number;
    readonly uniforms: UniformData[];
}
export declare class DescriptorData {
    constructor(descriptorID?: number, type?: Type, count?: number);
    reset(descriptorID: number, type: Type, count: number): void;
    descriptorID: number;
    type: Type;
    count: number;
}
export declare class DescriptorBlockData {
    constructor(type?: DescriptorTypeOrder, visibility?: ShaderStageFlagBit, capacity?: number, accessType?: MemoryAccessBit, viewDimension?: ViewDimension, sampleType?: SampleType, format?: Format);
    reset(type: DescriptorTypeOrder, visibility: ShaderStageFlagBit, capacity: number, accessType: MemoryAccessBit, viewDimension: ViewDimension, sampleType: SampleType, format: Format): void;
    type: DescriptorTypeOrder;
    visibility: ShaderStageFlagBit;
    offset: number;
    capacity: number;
    accessType: MemoryAccessBit;
    viewDimension: ViewDimension;
    sampleType: SampleType;
    format: Format;
    readonly descriptors: DescriptorData[];
}
export declare class DescriptorSetLayoutData {
    constructor(slot?: number, capacity?: number, descriptorBlocks?: DescriptorBlockData[], uniformBlocks?: Map<number, UniformBlock>, bindingMap?: Map<number, number>);
    reset(slot: number, capacity: number): void;
    slot: number;
    capacity: number;
    uniformBlockCapacity: number;
    samplerTextureCapacity: number;
    readonly descriptorBlocks: DescriptorBlockData[];
    readonly uniformBlocks: Map<number, UniformBlock>;
    readonly bindingMap: Map<number, number>;
}
export declare class DescriptorSetData {
    constructor(descriptorSetLayoutData?: DescriptorSetLayoutData, descriptorSetLayout?: DescriptorSetLayout | null, descriptorSet?: DescriptorSet | null);
    reset(descriptorSetLayout: DescriptorSetLayout | null, descriptorSet: DescriptorSet | null): void;
    readonly descriptorSetLayoutData: DescriptorSetLayoutData;
    readonly descriptorSetLayoutInfo: DescriptorSetLayoutInfo;
    descriptorSetLayout: DescriptorSetLayout | null;
    descriptorSet: DescriptorSet | null;
}
export declare class PipelineLayoutData {
    reset(): void;
    getSets(): Map<UpdateFrequency, DescriptorSetData>;
    getSet(frequency: UpdateFrequency): DescriptorSetData | undefined;
    readonly descriptorSets: Map<UpdateFrequency, DescriptorSetData>;
    readonly descriptorGroups: Map<UpdateFrequency, DescriptorSetData>;
}
export declare class ShaderBindingData {
    reset(): void;
    readonly descriptorBindings: Map<number, number>;
}
export declare class ShaderLayoutData {
    reset(): void;
    readonly layoutData: Map<UpdateFrequency, DescriptorSetLayoutData>;
    readonly bindingData: Map<UpdateFrequency, ShaderBindingData>;
}
export declare class TechniqueData {
    reset(): void;
    readonly passes: ShaderLayoutData[];
}
export declare class EffectData {
    reset(): void;
    readonly techniques: Map<string, TechniqueData>;
}
export declare class ShaderProgramData {
    reset(): void;
    readonly layout: PipelineLayoutData;
    pipelineLayout: PipelineLayout | null;
}
export declare class RenderStageData {
    reset(): void;
    readonly descriptorVisibility: Map<number, ShaderStageFlagBit>;
}
export declare class RenderPhaseData {
    reset(): void;
    rootSignature: string;
    readonly shaderPrograms: ShaderProgramData[];
    readonly shaderIndex: Map<string, number>;
    pipelineLayout: PipelineLayout | null;
}
export declare const enum LayoutGraphDataValue {
    RenderStage = 0,
    RenderPhase = 1
}
export declare function getLayoutGraphDataValueName(e: LayoutGraphDataValue): string;
export interface LayoutGraphDataValueType {
    [LayoutGraphDataValue.RenderStage]: RenderStageData;
    [LayoutGraphDataValue.RenderPhase]: RenderPhaseData;
}
export interface LayoutGraphDataVisitor {
    renderStage(value: RenderStageData): unknown;
    renderPhase(value: RenderPhaseData): unknown;
}
export type LayoutGraphDataObject = RenderStageData | RenderPhaseData;
export declare class LayoutGraphDataVertex {
    readonly id: LayoutGraphDataValue;
    readonly object: LayoutGraphDataObject;
    constructor(id: LayoutGraphDataValue, object: LayoutGraphDataObject);
    /** Out edge list */
    readonly o: OutE[];
    /** In edge list */
    readonly i: OutE[];
    /** Polymorphic object Id */
    readonly t: LayoutGraphDataValue;
    /** Polymorphic object */
    j: LayoutGraphDataObject;
}
export declare const enum LayoutGraphDataComponent {
    Name = 0,
    Update = 1,
    Layout = 2
}
export interface LayoutGraphDataComponentType {
    [LayoutGraphDataComponent.Name]: string;
    [LayoutGraphDataComponent.Update]: UpdateFrequency;
    [LayoutGraphDataComponent.Layout]: PipelineLayoutData;
}
export declare class LayoutGraphData implements BidirectionalGraph, AdjacencyGraph, VertexListGraph, MutableGraph, PropertyGraph, NamedGraph, ComponentGraph, PolymorphicGraph, ReferenceGraph, MutableReferenceGraph, AddressableGraph {
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
    addVertex<T extends LayoutGraphDataValue>(id: T, object: LayoutGraphDataValueType[T], name: string, update: UpdateFrequency, layout: PipelineLayoutData, u?: number): number;
    addEdge(u: number, v: number): ED | null;
    vertexName(v: number): string;
    getName(v: number): string;
    getUpdate(v: number): UpdateFrequency;
    setUpdate(v: number, value: UpdateFrequency): void;
    getLayout(v: number): PipelineLayoutData;
    h(id: LayoutGraphDataValue, v: number): boolean;
    w(v: number): LayoutGraphDataValue;
    object(v: number): LayoutGraphDataObject;
    value<T extends LayoutGraphDataValue>(id: T, v: number): LayoutGraphDataValueType[T];
    visitVertex(visitor: LayoutGraphDataVisitor, v: number): unknown;
    j<T extends LayoutGraphDataObject>(v: number): T;
    reference(u: number, v: number): boolean;
    parent(e: ED): number;
    child(e: ED): number;
    children(v: number): OutEI;
    numChildren(v: number): number;
    getParent(v: number): number;
    addReference(u: number, v: number): ED | null;
    locateChild(u: number, name: string): number;
    locate(absPath: string): number;
    locateRelative(path: string, start?: number): number;
    path(v: number): string;
    readonly x: LayoutGraphDataVertex[];
    readonly _names: string[];
    readonly _updateFrequencies: UpdateFrequency[];
    readonly _layouts: PipelineLayoutData[];
    readonly valueNames: string[];
    readonly attributeIndex: Map<string, number>;
    readonly constantIndex: Map<string, number>;
    readonly shaderLayoutIndex: Map<string, number>;
    readonly effects: Map<string, EffectData>;
    constantMacros: string;
}
export declare class LayoutGraphObjectPool {
    constructor(renderCommon: RenderCommonObjectPool);
    reset(): void;
    createLayout(): Layout;
    createDescriptor(type?: Type): Descriptor;
    createDescriptorBlock(): DescriptorBlock;
    createDescriptorBlockFlattened(): DescriptorBlockFlattened;
    createDescriptorBlockIndex(updateFrequency?: UpdateFrequency, parameterType?: ParameterType, descriptorType?: DescriptorTypeOrder, visibility?: ShaderStageFlagBit): DescriptorBlockIndex;
    createDescriptorGroupBlockIndex(updateFrequency?: UpdateFrequency, parameterType?: ParameterType, descriptorType?: DescriptorTypeOrder, visibility?: ShaderStageFlagBit, accessType?: MemoryAccessBit, viewDimension?: ViewDimension, sampleType?: SampleType, format?: Format): DescriptorGroupBlockIndex;
    createDescriptorDB(): DescriptorDB;
    createRenderPhase(): RenderPhase;
    createLayoutGraph(): LayoutGraph;
    createUniformData(uniformID?: number, uniformType?: Type, offset?: number): UniformData;
    createUniformBlockData(): UniformBlockData;
    createDescriptorData(descriptorID?: number, type?: Type, count?: number): DescriptorData;
    createDescriptorBlockData(type?: DescriptorTypeOrder, visibility?: ShaderStageFlagBit, capacity?: number, accessType?: MemoryAccessBit, viewDimension?: ViewDimension, sampleType?: SampleType, format?: Format): DescriptorBlockData;
    createDescriptorSetLayoutData(slot?: number, capacity?: number): DescriptorSetLayoutData;
    createDescriptorSetData(descriptorSetLayout?: DescriptorSetLayout | null, descriptorSet?: DescriptorSet | null): DescriptorSetData;
    createPipelineLayoutData(): PipelineLayoutData;
    createShaderBindingData(): ShaderBindingData;
    createShaderLayoutData(): ShaderLayoutData;
    createTechniqueData(): TechniqueData;
    createEffectData(): EffectData;
    createShaderProgramData(): ShaderProgramData;
    createRenderStageData(): RenderStageData;
    createRenderPhaseData(): RenderPhaseData;
    createLayoutGraphData(): LayoutGraphData;
    readonly renderCommon: RenderCommonObjectPool;
    private readonly l;
    private readonly d;
    private readonly db;
    private readonly dbf;
    private readonly dbi;
    private readonly dgbi;
    private readonly dd;
    private readonly rp;
    private readonly lg;
    private readonly ud;
    private readonly ubd;
    private readonly dd1;
    private readonly dbd;
    private readonly dsld;
    private readonly dsd;
    private readonly pld;
    private readonly sbd;
    private readonly sld;
    private readonly td;
    private readonly ed;
    private readonly spd;
    private readonly rsd;
    private readonly rpd;
    private readonly lgd;
}
export declare function saveDescriptor(a: OutputArchive, v: Descriptor): void;
export declare function loadDescriptor(a: InputArchive, v: Descriptor): void;
export declare function saveDescriptorBlock(a: OutputArchive, v: DescriptorBlock): void;
export declare function loadDescriptorBlock(a: InputArchive, v: DescriptorBlock): void;
export declare function saveDescriptorBlockFlattened(a: OutputArchive, v: DescriptorBlockFlattened): void;
export declare function loadDescriptorBlockFlattened(a: InputArchive, v: DescriptorBlockFlattened): void;
export declare function saveDescriptorBlockIndex(a: OutputArchive, v: DescriptorBlockIndex): void;
export declare function loadDescriptorBlockIndex(a: InputArchive, v: DescriptorBlockIndex): void;
export declare function saveDescriptorGroupBlockIndex(a: OutputArchive, v: DescriptorGroupBlockIndex): void;
export declare function loadDescriptorGroupBlockIndex(a: InputArchive, v: DescriptorGroupBlockIndex): void;
export declare function saveDescriptorDB(a: OutputArchive, v: DescriptorDB): void;
export declare function loadDescriptorDB(a: InputArchive, v: DescriptorDB): void;
export declare function saveRenderPhase(a: OutputArchive, v: RenderPhase): void;
export declare function loadRenderPhase(a: InputArchive, v: RenderPhase): void;
export declare function saveLayoutGraph(a: OutputArchive, g: LayoutGraph): void;
export declare function loadLayoutGraph(a: InputArchive, g: LayoutGraph): void;
export declare function saveUniformData(a: OutputArchive, v: UniformData): void;
export declare function loadUniformData(a: InputArchive, v: UniformData): void;
export declare function saveUniformBlockData(a: OutputArchive, v: UniformBlockData): void;
export declare function loadUniformBlockData(a: InputArchive, v: UniformBlockData): void;
export declare function saveDescriptorData(a: OutputArchive, v: DescriptorData): void;
export declare function loadDescriptorData(a: InputArchive, v: DescriptorData): void;
export declare function saveDescriptorBlockData(a: OutputArchive, v: DescriptorBlockData): void;
export declare function loadDescriptorBlockData(a: InputArchive, v: DescriptorBlockData): void;
export declare function saveDescriptorSetLayoutData(a: OutputArchive, v: DescriptorSetLayoutData): void;
export declare function loadDescriptorSetLayoutData(a: InputArchive, v: DescriptorSetLayoutData): void;
export declare function saveDescriptorSetData(a: OutputArchive, v: DescriptorSetData): void;
export declare function loadDescriptorSetData(a: InputArchive, v: DescriptorSetData): void;
export declare function savePipelineLayoutData(a: OutputArchive, v: PipelineLayoutData): void;
export declare function loadPipelineLayoutData(a: InputArchive, v: PipelineLayoutData): void;
export declare function saveShaderBindingData(a: OutputArchive, v: ShaderBindingData): void;
export declare function loadShaderBindingData(a: InputArchive, v: ShaderBindingData): void;
export declare function saveShaderLayoutData(a: OutputArchive, v: ShaderLayoutData): void;
export declare function loadShaderLayoutData(a: InputArchive, v: ShaderLayoutData): void;
export declare function saveTechniqueData(a: OutputArchive, v: TechniqueData): void;
export declare function loadTechniqueData(a: InputArchive, v: TechniqueData): void;
export declare function saveEffectData(a: OutputArchive, v: EffectData): void;
export declare function loadEffectData(a: InputArchive, v: EffectData): void;
export declare function saveShaderProgramData(a: OutputArchive, v: ShaderProgramData): void;
export declare function loadShaderProgramData(a: InputArchive, v: ShaderProgramData): void;
export declare function saveRenderStageData(a: OutputArchive, v: RenderStageData): void;
export declare function loadRenderStageData(a: InputArchive, v: RenderStageData): void;
export declare function saveRenderPhaseData(a: OutputArchive, v: RenderPhaseData): void;
export declare function loadRenderPhaseData(a: InputArchive, v: RenderPhaseData): void;
export declare function saveLayoutGraphData(a: OutputArchive, g: LayoutGraphData): void;
export declare function loadLayoutGraphData(a: InputArchive, g: LayoutGraphData): void;
