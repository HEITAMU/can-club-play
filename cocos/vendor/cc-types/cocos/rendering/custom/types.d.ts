/**
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 * The following section is auto-generated.
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 */
import { ResolveMode } from '../../gfx';
import type { ReflectionProbe } from '../../render-scene/scene/reflection-probe';
import type { Light } from '../../render-scene/scene';
import type { OutputArchive, InputArchive } from './archive';
export declare enum UpdateFrequency {
    PER_INSTANCE = 0,
    PER_BATCH = 1,
    PER_PHASE = 2,
    PER_PASS = 3,
    COUNT = 4
}
export declare const enum ParameterType {
    CONSTANTS = 0,
    CBV = 1,
    UAV = 2,
    SRV = 3,
    TABLE = 4,
    SSV = 5
}
export declare enum ResourceResidency {
    MANAGED = 0,
    MEMORYLESS = 1,
    PERSISTENT = 2,
    EXTERNAL = 3,
    BACKBUFFER = 4
}
export declare enum QueueHint {
    NONE = 0,
    OPAQUE = 1,
    MASK = 2,
    BLEND = 3,
    RENDER_OPAQUE = 1,
    RENDER_CUTOUT = 2,
    RENDER_TRANSPARENT = 3
}
export declare enum ResourceDimension {
    BUFFER = 0,
    TEXTURE1D = 1,
    TEXTURE2D = 2,
    TEXTURE3D = 3
}
export declare enum ResourceFlags {
    NONE = 0,
    UNIFORM = 1,
    INDIRECT = 2,
    STORAGE = 4,
    SAMPLED = 8,
    COLOR_ATTACHMENT = 16,
    DEPTH_STENCIL_ATTACHMENT = 32,
    INPUT_ATTACHMENT = 64,
    SHADING_RATE = 128,
    TRANSFER_SRC = 256,
    TRANSFER_DST = 512
}
export declare const enum TaskType {
    SYNC = 0,
    ASYNC = 1
}
export declare enum SceneFlags {
    NONE = 0,
    OPAQUE = 1,
    MASK = 2,
    BLEND = 4,
    /**
     * @deprecated Please use OPAQUE.
     */
    OPAQUE_OBJECT = 1,
    /**
     * @deprecated Please use MASK.
     */
    CUTOUT_OBJECT = 2,
    /**
     * @deprecated Please use BLEND.
     */
    TRANSPARENT_OBJECT = 4,
    SHADOW_CASTER = 8,
    /**
     * @deprecated Please add 2D node in the render graph.
     */
    UI = 16,
    DEFAULT_LIGHTING = 32,
    VOLUMETRIC_LIGHTING = 64,
    CLUSTERED_LIGHTING = 128,
    PLANAR_SHADOW = 256,
    GEOMETRY = 512,
    /**
     * @deprecated Please add profiler node in the render graph.
     */
    PROFILER = 1024,
    DRAW_INSTANCING = 2048,
    DRAW_NON_INSTANCING = 4096,
    REFLECTION_PROBE = 8192,
    GPU_DRIVEN = 16384,
    NON_BUILTIN = 32768,
    ALL = 4294967295
}
export declare const enum LightingMode {
    NONE = 0,
    DEFAULT = 1,
    CLUSTERED = 2
}
export declare const enum AttachmentType {
    RENDER_TARGET = 0,
    DEPTH_STENCIL = 1,
    SHADING_RATE = 2
}
export declare enum AccessType {
    READ = 0,
    READ_WRITE = 1,
    WRITE = 2
}
export declare const enum ClearValueType {
    NONE = 0,
    FLOAT_TYPE = 1,
    INT_TYPE = 2
}
export declare class LightInfo {
    constructor(light?: Light | null, level?: number, culledByLight?: boolean, probe?: ReflectionProbe | null);
    reset(light: Light | null, level: number, culledByLight: boolean, probe: ReflectionProbe | null): void;
    light: Light | null;
    probe: ReflectionProbe | null;
    level: number;
    culledByLight: boolean;
}
export declare const enum ResolveFlags {
    NONE = 0,
    COLOR = 1,
    DEPTH = 2,
    STENCIL = 4
}
export declare class ResolvePair {
    constructor(source?: string, target?: string, resolveFlags?: ResolveFlags, mode?: ResolveMode, mode1?: ResolveMode);
    reset(source: string, target: string, resolveFlags: ResolveFlags, mode: ResolveMode, mode1: ResolveMode): void;
    source: string;
    target: string;
    resolveFlags: ResolveFlags;
    mode: ResolveMode;
    mode1: ResolveMode;
}
export declare class CopyPair {
    constructor(source?: string, target?: string, mipLevels?: number, numSlices?: number, sourceMostDetailedMip?: number, sourceFirstSlice?: number, sourcePlaneSlice?: number, targetMostDetailedMip?: number, targetFirstSlice?: number, targetPlaneSlice?: number);
    reset(source: string, target: string, mipLevels: number, numSlices: number, sourceMostDetailedMip: number, sourceFirstSlice: number, sourcePlaneSlice: number, targetMostDetailedMip: number, targetFirstSlice: number, targetPlaneSlice: number): void;
    source: string;
    target: string;
    mipLevels: number;
    numSlices: number;
    sourceMostDetailedMip: number;
    sourceFirstSlice: number;
    sourcePlaneSlice: number;
    targetMostDetailedMip: number;
    targetFirstSlice: number;
    targetPlaneSlice: number;
}
export declare class UploadPair {
    constructor(source?: Uint8Array, target?: string, mipLevels?: number, numSlices?: number, targetMostDetailedMip?: number, targetFirstSlice?: number, targetPlaneSlice?: number);
    reset(target: string, mipLevels: number, numSlices: number, targetMostDetailedMip: number, targetFirstSlice: number, targetPlaneSlice: number): void;
    readonly source: Uint8Array;
    target: string;
    mipLevels: number;
    numSlices: number;
    targetMostDetailedMip: number;
    targetFirstSlice: number;
    targetPlaneSlice: number;
}
export declare class MovePair {
    constructor(source?: string, target?: string, mipLevels?: number, numSlices?: number, targetMostDetailedMip?: number, targetFirstSlice?: number, targetPlaneSlice?: number);
    reset(source: string, target: string, mipLevels: number, numSlices: number, targetMostDetailedMip: number, targetFirstSlice: number, targetPlaneSlice: number): void;
    source: string;
    target: string;
    mipLevels: number;
    numSlices: number;
    targetMostDetailedMip: number;
    targetFirstSlice: number;
    targetPlaneSlice: number;
}
export declare class PipelineStatistics {
    reset(): void;
    numRenderPasses: number;
    numManagedTextures: number;
    totalManagedTextures: number;
    numUploadBuffers: number;
    numUploadBufferViews: number;
    numFreeUploadBuffers: number;
    numFreeUploadBufferViews: number;
    numDescriptorSets: number;
    numFreeDescriptorSets: number;
    numInstancingBuffers: number;
    numInstancingUniformBlocks: number;
}
export declare class RenderCommonObjectPool {
    constructor();
    reset(): void;
    createLightInfo(light?: Light | null, level?: number, culledByLight?: boolean, probe?: ReflectionProbe | null): LightInfo;
    createResolvePair(source?: string, target?: string, resolveFlags?: ResolveFlags, mode?: ResolveMode, mode1?: ResolveMode): ResolvePair;
    createCopyPair(source?: string, target?: string, mipLevels?: number, numSlices?: number, sourceMostDetailedMip?: number, sourceFirstSlice?: number, sourcePlaneSlice?: number, targetMostDetailedMip?: number, targetFirstSlice?: number, targetPlaneSlice?: number): CopyPair;
    createUploadPair(target?: string, mipLevels?: number, numSlices?: number, targetMostDetailedMip?: number, targetFirstSlice?: number, targetPlaneSlice?: number): UploadPair;
    createMovePair(source?: string, target?: string, mipLevels?: number, numSlices?: number, targetMostDetailedMip?: number, targetFirstSlice?: number, targetPlaneSlice?: number): MovePair;
    createPipelineStatistics(): PipelineStatistics;
    private readonly li;
    private readonly rp;
    private readonly cp;
    private readonly up;
    private readonly mp;
    private readonly ps;
}
export declare function saveLightInfo(a: OutputArchive, v: LightInfo): void;
export declare function loadLightInfo(a: InputArchive, v: LightInfo): void;
export declare function saveResolvePair(a: OutputArchive, v: ResolvePair): void;
export declare function loadResolvePair(a: InputArchive, v: ResolvePair): void;
export declare function saveCopyPair(a: OutputArchive, v: CopyPair): void;
export declare function loadCopyPair(a: InputArchive, v: CopyPair): void;
export declare function saveMovePair(a: OutputArchive, v: MovePair): void;
export declare function loadMovePair(a: InputArchive, v: MovePair): void;
export declare function savePipelineStatistics(a: OutputArchive, v: PipelineStatistics): void;
export declare function loadPipelineStatistics(a: InputArchive, v: PipelineStatistics): void;
