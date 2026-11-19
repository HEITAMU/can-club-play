/// <reference types="./@types/globals" />
import { Queue } from './queue';
import { Buffer } from './buffer';
import { Texture } from './texture';
import { Swapchain } from './swapchain';
import { RenderPass } from './render-pass';
import { DescriptorSetLayout } from './descriptor-set-layout';
import { Sampler } from './states/sampler';
import { GeneralBarrier } from './states/general-barrier';
import { GCObject } from '../../core/data/gc-object';
/**
  * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
  * The following section is auto-generated from native/cocos/renderer/core/gfx/GFXDef-common.h
  * by the script native/tools/gfx-define-generator/generate.js.
  * Changes to these public interfaces should be made there first and synced back.
  * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
  */
/**
 * @en Graphics object type
 * @zh 图形API对象的类型
 */
export declare enum ObjectType {
    UNKNOWN = 0,
    SWAPCHAIN = 1,
    BUFFER = 2,
    TEXTURE = 3,
    RENDER_PASS = 4,
    FRAMEBUFFER = 5,
    SAMPLER = 6,
    SHADER = 7,
    DESCRIPTOR_SET_LAYOUT = 8,
    PIPELINE_LAYOUT = 9,
    PIPELINE_STATE = 10,
    DESCRIPTOR_SET = 11,
    INPUT_ASSEMBLER = 12,
    COMMAND_BUFFER = 13,
    QUEUE = 14,
    QUERY_POOL = 15,
    GLOBAL_BARRIER = 16,
    TEXTURE_BARRIER = 17,
    BUFFER_BARRIER = 18,
    COUNT = 19
}
export declare enum Status {
    UNREADY = 0,
    FAILED = 1,
    SUCCESS = 2
}
export declare enum API {
    UNKNOWN = 0,
    GLES2 = 1,
    GLES3 = 2,
    METAL = 3,
    VULKAN = 4,
    NVN = 5,
    WEBGL = 6,
    WEBGL2 = 7,
    WEBGPU = 8
}
export declare enum SurfaceTransform {
    IDENTITY = 0,
    ROTATE_90 = 1,
    ROTATE_180 = 2,
    ROTATE_270 = 3
}
export declare enum Feature {
    ELEMENT_INDEX_UINT = 0,
    INSTANCED_ARRAYS = 1,
    MULTIPLE_RENDER_TARGETS = 2,
    BLEND_MINMAX = 3,
    COMPUTE_SHADER = 4,
    INPUT_ATTACHMENT_BENEFIT = 5,
    SUBPASS_COLOR_INPUT = 6,
    SUBPASS_DEPTH_STENCIL_INPUT = 7,
    RASTERIZATION_ORDER_NOCOHERENT = 8,
    MULTI_SAMPLE_RESOLVE_DEPTH_STENCIL = 9,
    COUNT = 10
}
export declare enum Format {
    UNKNOWN = 0,
    A8 = 1,
    L8 = 2,
    LA8 = 3,
    R8 = 4,
    R8SN = 5,
    R8UI = 6,
    R8I = 7,
    R16F = 8,
    R16UI = 9,
    R16I = 10,
    R32F = 11,
    R32UI = 12,
    R32I = 13,
    RG8 = 14,
    RG8SN = 15,
    RG8UI = 16,
    RG8I = 17,
    RG16F = 18,
    RG16UI = 19,
    RG16I = 20,
    RG32F = 21,
    RG32UI = 22,
    RG32I = 23,
    RGB8 = 24,
    SRGB8 = 25,
    RGB8SN = 26,
    RGB8UI = 27,
    RGB8I = 28,
    RGB16F = 29,
    RGB16UI = 30,
    RGB16I = 31,
    RGB32F = 32,
    RGB32UI = 33,
    RGB32I = 34,
    RGBA8 = 35,
    BGRA8 = 36,
    SRGB8_A8 = 37,
    RGBA8SN = 38,
    RGBA8UI = 39,
    RGBA8I = 40,
    RGBA16F = 41,
    RGBA16UI = 42,
    RGBA16I = 43,
    RGBA32F = 44,
    RGBA32UI = 45,
    RGBA32I = 46,
    R5G6B5 = 47,
    R11G11B10F = 48,
    RGB5A1 = 49,
    RGBA4 = 50,
    RGB10A2 = 51,
    RGB10A2UI = 52,
    RGB9E5 = 53,
    DEPTH = 54,
    DEPTH_STENCIL = 55,
    BC1 = 56,
    BC1_ALPHA = 57,
    BC1_SRGB = 58,
    BC1_SRGB_ALPHA = 59,
    BC2 = 60,
    BC2_SRGB = 61,
    BC3 = 62,
    BC3_SRGB = 63,
    BC4 = 64,
    BC4_SNORM = 65,
    BC5 = 66,
    BC5_SNORM = 67,
    BC6H_UF16 = 68,
    BC6H_SF16 = 69,
    BC7 = 70,
    BC7_SRGB = 71,
    ETC_RGB8 = 72,
    ETC2_RGB8 = 73,
    ETC2_SRGB8 = 74,
    ETC2_RGB8_A1 = 75,
    ETC2_SRGB8_A1 = 76,
    ETC2_RGBA8 = 77,
    ETC2_SRGB8_A8 = 78,
    EAC_R11 = 79,
    EAC_R11SN = 80,
    EAC_RG11 = 81,
    EAC_RG11SN = 82,
    PVRTC_RGB2 = 83,
    PVRTC_RGBA2 = 84,
    PVRTC_RGB4 = 85,
    PVRTC_RGBA4 = 86,
    PVRTC2_2BPP = 87,
    PVRTC2_4BPP = 88,
    ASTC_RGBA_4X4 = 89,
    ASTC_RGBA_5X4 = 90,
    ASTC_RGBA_5X5 = 91,
    ASTC_RGBA_6X5 = 92,
    ASTC_RGBA_6X6 = 93,
    ASTC_RGBA_8X5 = 94,
    ASTC_RGBA_8X6 = 95,
    ASTC_RGBA_8X8 = 96,
    ASTC_RGBA_10X5 = 97,
    ASTC_RGBA_10X6 = 98,
    ASTC_RGBA_10X8 = 99,
    ASTC_RGBA_10X10 = 100,
    ASTC_RGBA_12X10 = 101,
    ASTC_RGBA_12X12 = 102,
    ASTC_SRGBA_4X4 = 103,
    ASTC_SRGBA_5X4 = 104,
    ASTC_SRGBA_5X5 = 105,
    ASTC_SRGBA_6X5 = 106,
    ASTC_SRGBA_6X6 = 107,
    ASTC_SRGBA_8X5 = 108,
    ASTC_SRGBA_8X6 = 109,
    ASTC_SRGBA_8X8 = 110,
    ASTC_SRGBA_10X5 = 111,
    ASTC_SRGBA_10X6 = 112,
    ASTC_SRGBA_10X8 = 113,
    ASTC_SRGBA_10X10 = 114,
    ASTC_SRGBA_12X10 = 115,
    ASTC_SRGBA_12X12 = 116,
    COUNT = 117
}
export declare enum FormatType {
    NONE = 0,
    UNORM = 1,
    SNORM = 2,
    UINT = 3,
    INT = 4,
    UFLOAT = 5,
    FLOAT = 6
}
export declare enum SampleType {
    FLOAT = 0,
    UNFILTERABLE_FLOAT = 1,
    SINT = 2,
    UINT = 3
}
export declare enum Type {
    UNKNOWN = 0,
    BOOL = 1,
    BOOL2 = 2,
    BOOL3 = 3,
    BOOL4 = 4,
    INT = 5,
    INT2 = 6,
    INT3 = 7,
    INT4 = 8,
    UINT = 9,
    UINT2 = 10,
    UINT3 = 11,
    UINT4 = 12,
    FLOAT = 13,
    FLOAT2 = 14,
    FLOAT3 = 15,
    FLOAT4 = 16,
    MAT2 = 17,
    MAT2X3 = 18,
    MAT2X4 = 19,
    MAT3X2 = 20,
    MAT3 = 21,
    MAT3X4 = 22,
    MAT4X2 = 23,
    MAT4X3 = 24,
    MAT4 = 25,
    SAMPLER1D = 26,
    SAMPLER1D_ARRAY = 27,
    SAMPLER2D = 28,
    SAMPLER2D_ARRAY = 29,
    SAMPLER3D = 30,
    SAMPLER_CUBE = 31,
    SAMPLER = 32,
    TEXTURE1D = 33,
    TEXTURE1D_ARRAY = 34,
    TEXTURE2D = 35,
    TEXTURE2D_ARRAY = 36,
    TEXTURE3D = 37,
    TEXTURE_CUBE = 38,
    IMAGE1D = 39,
    IMAGE1D_ARRAY = 40,
    IMAGE2D = 41,
    IMAGE2D_ARRAY = 42,
    IMAGE3D = 43,
    IMAGE_CUBE = 44,
    SUBPASS_INPUT = 45,
    COUNT = 46
}
export declare enum BufferUsageBit {
    NONE = 0,
    TRANSFER_SRC = 1,
    TRANSFER_DST = 2,
    INDEX = 4,
    VERTEX = 8,
    UNIFORM = 16,
    STORAGE = 32,
    INDIRECT = 64
}
export declare enum BufferFlagBit {
    NONE = 0,
    ENABLE_STAGING_WRITE = 1
}
export declare enum MemoryAccessBit {
    NONE = 0,
    READ_ONLY = 1,
    WRITE_ONLY = 2,
    READ_WRITE = 3
}
export declare enum MemoryUsageBit {
    NONE = 0,
    DEVICE = 1,
    HOST = 2
}
export declare enum TextureType {
    TEX1D = 0,
    TEX2D = 1,
    TEX3D = 2,
    CUBE = 3,
    TEX1D_ARRAY = 4,
    TEX2D_ARRAY = 5
}
export declare enum ViewDimension {
    UNKNOWN = 0,
    BUFFER = 1,
    TEX1D = 2,
    TEX1D_ARRAY = 3,
    TEX2D = 4,
    TEX2D_ARRAY = 5,
    TEX2DMS = 6,
    TEX2DMS_ARRAY = 7,
    TEX3D = 8,
    TEXCUBE = 9,
    TEXCUBE_ARRAY = 10,
    RAYTRACING_ACCELERATION_STRUCTURE = 11
}
export declare enum TextureUsageBit {
    NONE = 0,
    TRANSFER_SRC = 1,
    TRANSFER_DST = 2,
    SAMPLED = 4,
    STORAGE = 8,
    COLOR_ATTACHMENT = 16,
    DEPTH_STENCIL_ATTACHMENT = 32,
    INPUT_ATTACHMENT = 64,
    SHADING_RATE = 128
}
export declare enum TextureFlagBit {
    NONE = 0,
    GEN_MIPMAP = 1,
    GENERAL_LAYOUT = 2,
    EXTERNAL_OES = 4,
    EXTERNAL_NORMAL = 8,
    LAZILY_ALLOCATED = 16,
    MUTABLE_VIEW_FORMAT = 64,
    MUTABLE_STORAGE = 128
}
export declare enum FormatFeatureBit {
    NONE = 0,
    RENDER_TARGET = 1,
    SAMPLED_TEXTURE = 2,
    LINEAR_FILTER = 4,
    STORAGE_TEXTURE = 8,
    VERTEX_ATTRIBUTE = 16,
    SHADING_RATE = 32
}
export declare enum SampleCount {
    X1 = 1,
    X2 = 2,
    X4 = 4,
    X8 = 8,
    X16 = 16,
    X32 = 32,
    X64 = 64
}
export declare enum VsyncMode {
    OFF = 0,
    ON = 1,
    RELAXED = 2,
    MAILBOX = 3,
    HALF = 4
}
export declare enum Filter {
    NONE = 0,
    POINT = 1,
    LINEAR = 2,
    ANISOTROPIC = 3
}
export declare enum Address {
    WRAP = 0,
    MIRROR = 1,
    CLAMP = 2,
    BORDER = 3
}
export declare enum ComparisonFunc {
    NEVER = 0,
    LESS = 1,
    EQUAL = 2,
    LESS_EQUAL = 3,
    GREATER = 4,
    NOT_EQUAL = 5,
    GREATER_EQUAL = 6,
    ALWAYS = 7
}
export declare enum StencilOp {
    ZERO = 0,
    KEEP = 1,
    REPLACE = 2,
    INCR = 3,
    DECR = 4,
    INVERT = 5,
    INCR_WRAP = 6,
    DECR_WRAP = 7
}
export declare enum BlendFactor {
    ZERO = 0,
    ONE = 1,
    SRC_ALPHA = 2,
    DST_ALPHA = 3,
    ONE_MINUS_SRC_ALPHA = 4,
    ONE_MINUS_DST_ALPHA = 5,
    SRC_COLOR = 6,
    DST_COLOR = 7,
    ONE_MINUS_SRC_COLOR = 8,
    ONE_MINUS_DST_COLOR = 9,
    SRC_ALPHA_SATURATE = 10,
    CONSTANT_COLOR = 11,
    ONE_MINUS_CONSTANT_COLOR = 12,
    CONSTANT_ALPHA = 13,
    ONE_MINUS_CONSTANT_ALPHA = 14
}
export declare enum BlendOp {
    ADD = 0,
    SUB = 1,
    REV_SUB = 2,
    MIN = 3,
    MAX = 4
}
export declare enum ColorMask {
    NONE = 0,
    R = 1,
    G = 2,
    B = 4,
    A = 8,
    ALL = 15
}
export declare enum ShaderStageFlagBit {
    NONE = 0,
    VERTEX = 1,
    CONTROL = 2,
    EVALUATION = 4,
    GEOMETRY = 8,
    FRAGMENT = 16,
    COMPUTE = 32,
    ALL = 63
}
export declare enum LoadOp {
    LOAD = 0,
    CLEAR = 1,
    DISCARD = 2
}
export declare enum StoreOp {
    STORE = 0,
    DISCARD = 1
}
export declare enum AccessFlagBit {
    NONE = 0,
    INDIRECT_BUFFER = 1,
    INDEX_BUFFER = 2,
    VERTEX_BUFFER = 4,
    VERTEX_SHADER_READ_UNIFORM_BUFFER = 8,
    VERTEX_SHADER_READ_TEXTURE = 16,
    VERTEX_SHADER_READ_OTHER = 32,
    FRAGMENT_SHADER_READ_UNIFORM_BUFFER = 64,
    FRAGMENT_SHADER_READ_TEXTURE = 128,
    FRAGMENT_SHADER_READ_COLOR_INPUT_ATTACHMENT = 256,
    FRAGMENT_SHADER_READ_DEPTH_STENCIL_INPUT_ATTACHMENT = 512,
    FRAGMENT_SHADER_READ_OTHER = 1024,
    COLOR_ATTACHMENT_READ = 2048,
    DEPTH_STENCIL_ATTACHMENT_READ = 4096,
    COMPUTE_SHADER_READ_UNIFORM_BUFFER = 8192,
    COMPUTE_SHADER_READ_TEXTURE = 16384,
    COMPUTE_SHADER_READ_OTHER = 32768,
    TRANSFER_READ = 65536,
    HOST_READ = 131072,
    PRESENT = 262144,
    VERTEX_SHADER_WRITE = 524288,
    FRAGMENT_SHADER_WRITE = 1048576,
    COLOR_ATTACHMENT_WRITE = 2097152,
    DEPTH_STENCIL_ATTACHMENT_WRITE = 4194304,
    COMPUTE_SHADER_WRITE = 8388608,
    TRANSFER_WRITE = 16777216,
    HOST_PREINITIALIZED = 33554432,
    HOST_WRITE = 67108864,
    SHADING_RATE = 134217728
}
export declare enum ResolveMode {
    NONE = 0,
    SAMPLE_ZERO = 1,
    AVERAGE = 2,
    MIN = 3,
    MAX = 4
}
export declare enum PipelineBindPoint {
    GRAPHICS = 0,
    COMPUTE = 1,
    RAY_TRACING = 2
}
export declare enum PrimitiveMode {
    POINT_LIST = 0,
    LINE_LIST = 1,
    LINE_STRIP = 2,
    LINE_LOOP = 3,
    LINE_LIST_ADJACENCY = 4,
    LINE_STRIP_ADJACENCY = 5,
    ISO_LINE_LIST = 6,
    TRIANGLE_LIST = 7,
    TRIANGLE_STRIP = 8,
    TRIANGLE_FAN = 9,
    TRIANGLE_LIST_ADJACENCY = 10,
    TRIANGLE_STRIP_ADJACENCY = 11,
    TRIANGLE_PATCH_ADJACENCY = 12,
    QUAD_PATCH_LIST = 13
}
export declare enum PolygonMode {
    FILL = 0,
    POINT = 1,
    LINE = 2
}
export declare enum ShadeModel {
    GOURAND = 0,
    FLAT = 1
}
export declare enum CullMode {
    NONE = 0,
    FRONT = 1,
    BACK = 2
}
export declare enum DynamicStateFlagBit {
    NONE = 0,
    LINE_WIDTH = 1,
    DEPTH_BIAS = 2,
    BLEND_CONSTANTS = 4,
    DEPTH_BOUNDS = 8,
    STENCIL_WRITE_MASK = 16,
    STENCIL_COMPARE_MASK = 32
}
export declare enum StencilFace {
    FRONT = 1,
    BACK = 2,
    ALL = 3
}
export declare enum DescriptorType {
    UNKNOWN = 0,
    UNIFORM_BUFFER = 1,
    DYNAMIC_UNIFORM_BUFFER = 2,
    STORAGE_BUFFER = 4,
    DYNAMIC_STORAGE_BUFFER = 8,
    SAMPLER_TEXTURE = 16,
    SAMPLER = 32,
    TEXTURE = 64,
    STORAGE_IMAGE = 128,
    INPUT_ATTACHMENT = 256
}
export declare enum QueueType {
    GRAPHICS = 0,
    COMPUTE = 1,
    TRANSFER = 2
}
export declare enum QueryType {
    OCCLUSION = 0,
    PIPELINE_STATISTICS = 1,
    TIMESTAMP = 2
}
export declare enum CommandBufferType {
    PRIMARY = 0,
    SECONDARY = 1
}
export declare enum ClearFlagBit {
    NONE = 0,
    COLOR = 1,
    DEPTH = 2,
    STENCIL = 4,
    DEPTH_STENCIL = 6,
    ALL = 7
}
export declare enum BarrierType {
    FULL = 0,
    SPLIT_BEGIN = 1,
    SPLIT_END = 2
}
export declare enum PassType {
    RASTER = 0,
    COMPUTE = 1,
    COPY = 2,
    MOVE = 3,
    RAYTRACE = 4,
    PRESENT = 5
}
export type BufferUsage = BufferUsageBit;
export type BufferFlags = BufferFlagBit;
export type MemoryAccess = MemoryAccessBit;
export type MemoryUsage = MemoryUsageBit;
export type TextureUsage = TextureUsageBit;
export type TextureFlags = TextureFlagBit;
export type FormatFeature = FormatFeatureBit;
export type ShaderStageFlags = ShaderStageFlagBit;
export type AccessFlags = AccessFlagBit;
export type DynamicStateFlags = DynamicStateFlagBit;
export type ClearFlags = ClearFlagBit;
export declare class Size {
    x: number;
    y: number;
    z: number;
    private _token;
    constructor(x?: number, y?: number, z?: number);
    copy(info: Readonly<Size>): Size;
}
export declare class DeviceCaps {
    maxVertexAttributes: number;
    maxVertexUniformVectors: number;
    maxFragmentUniformVectors: number;
    maxTextureUnits: number;
    maxImageUnits: number;
    maxVertexTextureUnits: number;
    maxColorRenderTargets: number;
    maxShaderStorageBufferBindings: number;
    maxShaderStorageBlockSize: number;
    maxUniformBufferBindings: number;
    maxUniformBlockSize: number;
    maxTextureSize: number;
    maxCubeMapTextureSize: number;
    maxArrayTextureLayers: number;
    max3DTextureSize: number;
    uboOffsetAlignment: number;
    maxComputeSharedMemorySize: number;
    maxComputeWorkGroupInvocations: number;
    maxComputeWorkGroupSize: Size;
    maxComputeWorkGroupCount: Size;
    supportQuery: boolean;
    supportVariableRateShading: boolean;
    supportSubPassShading: boolean;
    clipSpaceMinZ: number;
    screenSpaceSignY: number;
    clipSpaceSignY: number;
    private _token;
    constructor(maxVertexAttributes?: number, maxVertexUniformVectors?: number, maxFragmentUniformVectors?: number, maxTextureUnits?: number, maxImageUnits?: number, maxVertexTextureUnits?: number, maxColorRenderTargets?: number, maxShaderStorageBufferBindings?: number, maxShaderStorageBlockSize?: number, maxUniformBufferBindings?: number, maxUniformBlockSize?: number, maxTextureSize?: number, maxCubeMapTextureSize?: number, maxArrayTextureLayers?: number, max3DTextureSize?: number, uboOffsetAlignment?: number, maxComputeSharedMemorySize?: number, maxComputeWorkGroupInvocations?: number, maxComputeWorkGroupSize?: Size, maxComputeWorkGroupCount?: Size, supportQuery?: boolean, supportVariableRateShading?: boolean, supportSubPassShading?: boolean, clipSpaceMinZ?: number, screenSpaceSignY?: number, clipSpaceSignY?: number);
    copy(info: Readonly<DeviceCaps>): DeviceCaps;
}
export declare class DeviceOptions {
    enableBarrierDeduce: boolean;
    private _token;
    constructor(enableBarrierDeduce?: boolean);
    copy(info: Readonly<DeviceOptions>): DeviceOptions;
}
export declare class Offset {
    x: number;
    y: number;
    z: number;
    private _token;
    constructor(x?: number, y?: number, z?: number);
    copy(info: Readonly<Offset>): Offset;
}
export declare class Rect {
    x: number;
    y: number;
    width: number;
    height: number;
    private _token;
    constructor(x?: number, y?: number, width?: number, height?: number);
    copy(info: Readonly<Rect>): Rect;
}
export declare class Extent {
    width: number;
    height: number;
    depth: number;
    private _token;
    constructor(width?: number, height?: number, depth?: number);
    copy(info: Readonly<Extent>): Extent;
}
export declare class TextureSubresLayers {
    mipLevel: number;
    baseArrayLayer: number;
    layerCount: number;
    private _token;
    constructor(mipLevel?: number, baseArrayLayer?: number, layerCount?: number);
    copy(info: Readonly<TextureSubresLayers>): TextureSubresLayers;
}
export declare class TextureSubresRange {
    baseMipLevel: number;
    levelCount: number;
    baseArrayLayer: number;
    layerCount: number;
    private _token;
    constructor(baseMipLevel?: number, levelCount?: number, baseArrayLayer?: number, layerCount?: number);
    copy(info: Readonly<TextureSubresRange>): TextureSubresRange;
}
export declare class TextureCopy {
    srcSubres: TextureSubresLayers;
    srcOffset: Offset;
    dstSubres: TextureSubresLayers;
    dstOffset: Offset;
    extent: Extent;
    private _token;
    constructor(srcSubres?: TextureSubresLayers, srcOffset?: Offset, dstSubres?: TextureSubresLayers, dstOffset?: Offset, extent?: Extent);
    copy(info: Readonly<TextureCopy>): TextureCopy;
}
export declare class TextureBlit {
    srcSubres: TextureSubresLayers;
    srcOffset: Offset;
    srcExtent: Extent;
    dstSubres: TextureSubresLayers;
    dstOffset: Offset;
    dstExtent: Extent;
    private _token;
    constructor(srcSubres?: TextureSubresLayers, srcOffset?: Offset, srcExtent?: Extent, dstSubres?: TextureSubresLayers, dstOffset?: Offset, dstExtent?: Extent);
    copy(info: Readonly<TextureBlit>): TextureBlit;
}
export declare class BufferTextureCopy {
    buffOffset: number;
    buffStride: number;
    buffTexHeight: number;
    texOffset: Offset;
    texExtent: Extent;
    texSubres: TextureSubresLayers;
    private _token;
    constructor(buffOffset?: number, buffStride?: number, buffTexHeight?: number, texOffset?: Offset, texExtent?: Extent, texSubres?: TextureSubresLayers);
    copy(info: Readonly<BufferTextureCopy>): BufferTextureCopy;
}
export declare class Viewport {
    left: number;
    top: number;
    width: number;
    height: number;
    minDepth: number;
    maxDepth: number;
    private _token;
    constructor(left?: number, top?: number, width?: number, height?: number, minDepth?: number, maxDepth?: number);
    copy(info: Readonly<Viewport>): Viewport;
    reset(): void;
}
export declare class Color {
    x: number;
    y: number;
    z: number;
    w: number;
    private _token;
    constructor(x?: number, y?: number, z?: number, w?: number);
    copy(info: Readonly<Color>): Color;
    set(x: number, y: number, z: number, w: number): Color;
    reset(): void;
}
export declare class MarkerInfo {
    name: string;
    color: Color;
    private _token;
    constructor(name?: string, color?: Color);
    copy(info: Readonly<MarkerInfo>): MarkerInfo;
}
export declare class BindingMappingInfo {
    maxBlockCounts: number[];
    maxSamplerTextureCounts: number[];
    maxSamplerCounts: number[];
    maxTextureCounts: number[];
    maxBufferCounts: number[];
    maxImageCounts: number[];
    maxSubpassInputCounts: number[];
    setIndices: number[];
    private _token;
    constructor(maxBlockCounts?: number[], maxSamplerTextureCounts?: number[], maxSamplerCounts?: number[], maxTextureCounts?: number[], maxBufferCounts?: number[], maxImageCounts?: number[], maxSubpassInputCounts?: number[], setIndices?: number[]);
    copy(info: Readonly<BindingMappingInfo>): BindingMappingInfo;
}
export declare class SwapchainInfo {
    windowId: number;
    windowHandle: HTMLCanvasElement;
    vsyncMode: VsyncMode;
    width: number;
    height: number;
    private _token;
    constructor(windowId?: number, windowHandle?: HTMLCanvasElement, vsyncMode?: VsyncMode, width?: number, height?: number);
    copy(info: Readonly<SwapchainInfo>): SwapchainInfo;
}
export declare class DeviceInfo {
    bindingMappingInfo: BindingMappingInfo;
    private _token;
    constructor(bindingMappingInfo?: BindingMappingInfo);
    copy(info: Readonly<DeviceInfo>): DeviceInfo;
}
export declare class BufferInfo {
    usage: BufferUsage;
    memUsage: MemoryUsage;
    size: number;
    stride: number;
    flags: BufferFlags;
    private _token;
    constructor(usage?: BufferUsage, memUsage?: MemoryUsage, size?: number, stride?: number, flags?: BufferFlags);
    copy(info: Readonly<BufferInfo>): BufferInfo;
}
export declare class BufferViewInfo {
    buffer: Buffer;
    offset: number;
    range: number;
    private _token;
    constructor(buffer?: Buffer, offset?: number, range?: number);
    copy(info: Readonly<BufferViewInfo>): BufferViewInfo;
}
export declare class DrawInfo {
    vertexCount: number;
    firstVertex: number;
    indexCount: number;
    firstIndex: number;
    vertexOffset: number;
    instanceCount: number;
    firstInstance: number;
    private _token;
    constructor(vertexCount?: number, firstVertex?: number, indexCount?: number, firstIndex?: number, vertexOffset?: number, instanceCount?: number, firstInstance?: number);
    copy(info: Readonly<DrawInfo>): DrawInfo;
}
export declare class DispatchInfo {
    groupCountX: number;
    groupCountY: number;
    groupCountZ: number;
    indirectBuffer: Buffer | null;
    indirectOffset: number;
    private _token;
    constructor(groupCountX?: number, groupCountY?: number, groupCountZ?: number, indirectBuffer?: Buffer | null, indirectOffset?: number);
    copy(info: Readonly<DispatchInfo>): DispatchInfo;
}
export declare class IndirectBuffer {
    drawInfos: DrawInfo[];
    private _token;
    constructor(drawInfos?: DrawInfo[]);
    copy(info: Readonly<IndirectBuffer>): IndirectBuffer;
}
export declare class TextureInfo {
    type: TextureType;
    usage: TextureUsage;
    format: Format;
    width: number;
    height: number;
    flags: TextureFlags;
    layerCount: number;
    levelCount: number;
    samples: SampleCount;
    depth: number;
    externalRes: number;
    private _token;
    constructor(type?: TextureType, usage?: TextureUsage, format?: Format, width?: number, height?: number, flags?: TextureFlags, layerCount?: number, levelCount?: number, samples?: SampleCount, depth?: number, externalRes?: number);
    copy(info: Readonly<TextureInfo>): TextureInfo;
}
export declare class TextureViewInfo {
    texture: Texture;
    type: TextureType;
    format: Format;
    baseLevel: number;
    levelCount: number;
    baseLayer: number;
    layerCount: number;
    basePlane: number;
    planeCount: number;
    private _token;
    constructor(texture?: Texture, type?: TextureType, format?: Format, baseLevel?: number, levelCount?: number, baseLayer?: number, layerCount?: number, basePlane?: number, planeCount?: number);
    copy(info: Readonly<TextureViewInfo>): TextureViewInfo;
}
export declare class SamplerInfo {
    minFilter: Filter;
    magFilter: Filter;
    mipFilter: Filter;
    addressU: Address;
    addressV: Address;
    addressW: Address;
    maxAnisotropy: number;
    cmpFunc: ComparisonFunc;
    private _token;
    constructor(minFilter?: Filter, magFilter?: Filter, mipFilter?: Filter, addressU?: Address, addressV?: Address, addressW?: Address, maxAnisotropy?: number, cmpFunc?: ComparisonFunc);
    copy(info: Readonly<SamplerInfo>): SamplerInfo;
}
export declare class Uniform {
    name: string;
    type: Type;
    count: number;
    private _token;
    constructor(name?: string, type?: Type, count?: number);
    copy(info: Readonly<Uniform>): Uniform;
}
export declare class UniformBlock {
    set: number;
    binding: number;
    name: string;
    members: Uniform[];
    count: number;
    flattened: number;
    private _token;
    constructor(set?: number, binding?: number, name?: string, members?: Uniform[], count?: number, flattened?: number);
    copy(info: Readonly<UniformBlock>): UniformBlock;
}
export declare class UniformSamplerTexture {
    set: number;
    binding: number;
    name: string;
    type: Type;
    count: number;
    flattened: number;
    private _token;
    constructor(set?: number, binding?: number, name?: string, type?: Type, count?: number, flattened?: number);
    copy(info: Readonly<UniformSamplerTexture>): UniformSamplerTexture;
}
export declare class UniformSampler {
    set: number;
    binding: number;
    name: string;
    count: number;
    flattened: number;
    private _token;
    constructor(set?: number, binding?: number, name?: string, count?: number, flattened?: number);
    copy(info: Readonly<UniformSampler>): UniformSampler;
}
export declare class UniformTexture {
    set: number;
    binding: number;
    name: string;
    type: Type;
    count: number;
    flattened: number;
    private _token;
    constructor(set?: number, binding?: number, name?: string, type?: Type, count?: number, flattened?: number);
    copy(info: Readonly<UniformTexture>): UniformTexture;
}
export declare class UniformStorageImage {
    set: number;
    binding: number;
    name: string;
    type: Type;
    count: number;
    memoryAccess: MemoryAccess;
    flattened: number;
    private _token;
    constructor(set?: number, binding?: number, name?: string, type?: Type, count?: number, memoryAccess?: MemoryAccess, flattened?: number);
    copy(info: Readonly<UniformStorageImage>): UniformStorageImage;
}
export declare class UniformStorageBuffer {
    set: number;
    binding: number;
    name: string;
    count: number;
    memoryAccess: MemoryAccess;
    flattened: number;
    private _token;
    constructor(set?: number, binding?: number, name?: string, count?: number, memoryAccess?: MemoryAccess, flattened?: number);
    copy(info: Readonly<UniformStorageBuffer>): UniformStorageBuffer;
}
export declare class UniformInputAttachment {
    set: number;
    binding: number;
    name: string;
    count: number;
    flattened: number;
    private _token;
    constructor(set?: number, binding?: number, name?: string, count?: number, flattened?: number);
    copy(info: Readonly<UniformInputAttachment>): UniformInputAttachment;
}
export declare class ShaderStage {
    stage: ShaderStageFlagBit;
    source: string;
    private _token;
    constructor(stage?: ShaderStageFlagBit, source?: string);
    copy(info: Readonly<ShaderStage>): ShaderStage;
}
export declare class Attribute {
    name: string;
    format: Format;
    isNormalized: boolean;
    stream: number;
    isInstanced: boolean;
    location: number;
    private _token;
    constructor(name?: string, format?: Format, isNormalized?: boolean, stream?: number, isInstanced?: boolean, location?: number);
    copy(info: Readonly<Attribute>): Attribute;
}
export declare class ShaderInfo {
    name: string;
    stages: ShaderStage[];
    attributes: Attribute[];
    blocks: UniformBlock[];
    buffers: UniformStorageBuffer[];
    samplerTextures: UniformSamplerTexture[];
    samplers: UniformSampler[];
    textures: UniformTexture[];
    images: UniformStorageImage[];
    subpassInputs: UniformInputAttachment[];
    hash: number;
    private _token;
    constructor(name?: string, stages?: ShaderStage[], attributes?: Attribute[], blocks?: UniformBlock[], buffers?: UniformStorageBuffer[], samplerTextures?: UniformSamplerTexture[], samplers?: UniformSampler[], textures?: UniformTexture[], images?: UniformStorageImage[], subpassInputs?: UniformInputAttachment[], hash?: number);
    copy(info: Readonly<ShaderInfo>): ShaderInfo;
}
export declare class InputAssemblerInfo {
    attributes: Attribute[];
    vertexBuffers: Buffer[];
    indexBuffer: Buffer | null;
    indirectBuffer: Buffer | null;
    private _token;
    constructor(attributes?: Attribute[], vertexBuffers?: Buffer[], indexBuffer?: Buffer | null, indirectBuffer?: Buffer | null);
    copy(info: Readonly<InputAssemblerInfo>): InputAssemblerInfo;
}
export declare class ColorAttachment {
    format: Format;
    sampleCount: SampleCount;
    loadOp: LoadOp;
    storeOp: StoreOp;
    barrier: GeneralBarrier;
    private _token;
    constructor(format?: Format, sampleCount?: SampleCount, loadOp?: LoadOp, storeOp?: StoreOp, barrier?: GeneralBarrier);
    copy(info: Readonly<ColorAttachment>): ColorAttachment;
}
export declare class DepthStencilAttachment {
    format: Format;
    sampleCount: SampleCount;
    depthLoadOp: LoadOp;
    depthStoreOp: StoreOp;
    stencilLoadOp: LoadOp;
    stencilStoreOp: StoreOp;
    barrier: GeneralBarrier;
    private _token;
    constructor(format?: Format, sampleCount?: SampleCount, depthLoadOp?: LoadOp, depthStoreOp?: StoreOp, stencilLoadOp?: LoadOp, stencilStoreOp?: StoreOp, barrier?: GeneralBarrier);
    copy(info: Readonly<DepthStencilAttachment>): DepthStencilAttachment;
}
export declare class SubpassInfo {
    inputs: number[];
    colors: number[];
    resolves: number[];
    preserves: number[];
    depthStencil: number;
    depthStencilResolve: number;
    shadingRate: number;
    depthResolveMode: ResolveMode;
    stencilResolveMode: ResolveMode;
    private _token;
    constructor(inputs?: number[], colors?: number[], resolves?: number[], preserves?: number[], depthStencil?: number, depthStencilResolve?: number, shadingRate?: number, depthResolveMode?: ResolveMode, stencilResolveMode?: ResolveMode);
    copy(info: Readonly<SubpassInfo>): SubpassInfo;
}
export declare class SubpassDependency {
    srcSubpass: number;
    dstSubpass: number;
    generalBarrier: GeneralBarrier;
    prevAccesses: AccessFlags;
    nextAccesses: AccessFlags;
    private _token;
    constructor(srcSubpass?: number, dstSubpass?: number, generalBarrier?: GeneralBarrier, prevAccesses?: AccessFlags, nextAccesses?: AccessFlags);
    copy(info: Readonly<SubpassDependency>): SubpassDependency;
}
export declare class RenderPassInfo {
    colorAttachments: ColorAttachment[];
    depthStencilAttachment: DepthStencilAttachment;
    depthStencilResolveAttachment: DepthStencilAttachment;
    subpasses: SubpassInfo[];
    dependencies: SubpassDependency[];
    private _token;
    constructor(colorAttachments?: ColorAttachment[], depthStencilAttachment?: DepthStencilAttachment, depthStencilResolveAttachment?: DepthStencilAttachment, subpasses?: SubpassInfo[], dependencies?: SubpassDependency[]);
    copy(info: Readonly<RenderPassInfo>): RenderPassInfo;
}
export declare class ResourceRange {
    width: number;
    height: number;
    depthOrArraySize: number;
    firstSlice: number;
    numSlices: number;
    mipLevel: number;
    levelCount: number;
    basePlane: number;
    planeCount: number;
    private _token;
    constructor(width?: number, height?: number, depthOrArraySize?: number, firstSlice?: number, numSlices?: number, mipLevel?: number, levelCount?: number, basePlane?: number, planeCount?: number);
    copy(info: Readonly<ResourceRange>): ResourceRange;
}
export declare class GeneralBarrierInfo {
    prevAccesses: AccessFlags;
    nextAccesses: AccessFlags;
    type: BarrierType;
    private _token;
    constructor(prevAccesses?: AccessFlags, nextAccesses?: AccessFlags, type?: BarrierType);
    copy(info: Readonly<GeneralBarrierInfo>): GeneralBarrierInfo;
}
export declare class TextureBarrierInfo {
    prevAccesses: AccessFlags;
    nextAccesses: AccessFlags;
    type: BarrierType;
    range: ResourceRange;
    discardContents: boolean;
    srcQueue: Queue | null;
    dstQueue: Queue | null;
    private _token;
    constructor(prevAccesses?: AccessFlags, nextAccesses?: AccessFlags, type?: BarrierType, range?: ResourceRange, discardContents?: boolean, srcQueue?: Queue | null, dstQueue?: Queue | null);
    copy(info: Readonly<TextureBarrierInfo>): TextureBarrierInfo;
}
export declare class BufferBarrierInfo {
    prevAccesses: AccessFlags;
    nextAccesses: AccessFlags;
    type: BarrierType;
    offset: number;
    size: number;
    discardContents: boolean;
    srcQueue: Queue | null;
    dstQueue: Queue | null;
    private _token;
    constructor(prevAccesses?: AccessFlags, nextAccesses?: AccessFlags, type?: BarrierType, offset?: number, size?: number, discardContents?: boolean, srcQueue?: Queue | null, dstQueue?: Queue | null);
    copy(info: Readonly<BufferBarrierInfo>): BufferBarrierInfo;
}
export declare class FramebufferInfo {
    renderPass: RenderPass;
    colorTextures: Texture[];
    depthStencilTexture: Texture | null;
    depthStencilResolveTexture: Texture | null;
    private _token;
    constructor(renderPass?: RenderPass, colorTextures?: Texture[], depthStencilTexture?: Texture | null, depthStencilResolveTexture?: Texture | null);
    copy(info: Readonly<FramebufferInfo>): FramebufferInfo;
}
export declare class DescriptorSetLayoutBinding {
    binding: number;
    descriptorType: DescriptorType;
    count: number;
    stageFlags: ShaderStageFlags;
    access: MemoryAccess;
    viewDimension: ViewDimension;
    sampleType: SampleType;
    format: Format;
    immutableSamplers: Sampler[];
    private _token;
    constructor(binding?: number, descriptorType?: DescriptorType, count?: number, stageFlags?: ShaderStageFlags, access?: MemoryAccess, viewDimension?: ViewDimension, sampleType?: SampleType, format?: Format, immutableSamplers?: Sampler[]);
    copy(info: Readonly<DescriptorSetLayoutBinding>): DescriptorSetLayoutBinding;
}
export declare class DescriptorSetLayoutInfo {
    bindings: DescriptorSetLayoutBinding[];
    private _token;
    constructor(bindings?: DescriptorSetLayoutBinding[]);
    copy(info: Readonly<DescriptorSetLayoutInfo>): DescriptorSetLayoutInfo;
}
export declare class DescriptorSetInfo {
    layout: DescriptorSetLayout;
    private _token;
    constructor(layout?: DescriptorSetLayout);
    copy(info: Readonly<DescriptorSetInfo>): DescriptorSetInfo;
}
export declare class PipelineLayoutInfo {
    setLayouts: DescriptorSetLayout[];
    private _token;
    constructor(setLayouts?: DescriptorSetLayout[]);
    copy(info: Readonly<PipelineLayoutInfo>): PipelineLayoutInfo;
}
export declare class InputState {
    attributes: Attribute[];
    private _token;
    constructor(attributes?: Attribute[]);
    copy(info: Readonly<InputState>): InputState;
}
export declare class CommandBufferInfo {
    queue: Queue;
    type: CommandBufferType;
    private _token;
    constructor(queue?: Queue, type?: CommandBufferType);
    copy(info: Readonly<CommandBufferInfo>): CommandBufferInfo;
}
export declare class QueueInfo {
    type: QueueType;
    private _token;
    constructor(type?: QueueType);
    copy(info: Readonly<QueueInfo>): QueueInfo;
}
export declare class QueryPoolInfo {
    type: QueryType;
    maxQueryObjects: number;
    forceWait: boolean;
    private _token;
    constructor(type?: QueryType, maxQueryObjects?: number, forceWait?: boolean);
    copy(info: Readonly<QueryPoolInfo>): QueryPoolInfo;
}
export declare class FormatInfo {
    name: string;
    size: number;
    count: number;
    type: FormatType;
    hasAlpha: boolean;
    hasDepth: boolean;
    hasStencil: boolean;
    isCompressed: boolean;
    private _token;
    constructor(name?: string, size?: number, count?: number, type?: FormatType, hasAlpha?: boolean, hasDepth?: boolean, hasStencil?: boolean, isCompressed?: boolean);
    copy(info: Readonly<FormatInfo>): FormatInfo;
}
export declare class MemoryStatus {
    bufferSize: number;
    textureSize: number;
    private _token;
    constructor(bufferSize?: number, textureSize?: number);
    copy(info: Readonly<MemoryStatus>): MemoryStatus;
}
export declare class DynamicStencilStates {
    writeMask: number;
    compareMask: number;
    reference: number;
    private _token;
    constructor(writeMask?: number, compareMask?: number, reference?: number);
    copy(info: Readonly<DynamicStencilStates>): DynamicStencilStates;
}
export declare class DynamicStates {
    viewport: Viewport;
    scissor: Rect;
    blendConstant: Color;
    lineWidth: number;
    depthBiasConstant: number;
    depthBiasClamp: number;
    depthBiasSlope: number;
    depthMinBounds: number;
    depthMaxBounds: number;
    stencilStatesFront: DynamicStencilStates;
    stencilStatesBack: DynamicStencilStates;
    private _token;
    constructor(viewport?: Viewport, scissor?: Rect, blendConstant?: Color, lineWidth?: number, depthBiasConstant?: number, depthBiasClamp?: number, depthBiasSlope?: number, depthMinBounds?: number, depthMaxBounds?: number, stencilStatesFront?: DynamicStencilStates, stencilStatesBack?: DynamicStencilStates);
    copy(info: Readonly<DynamicStates>): DynamicStates;
}
/**
  * ========================= !DO NOT CHANGE THE ABOVE SECTION MANUALLY! =========================
  * The above section is auto-generated from native/cocos/renderer/core/gfx/GFXDef-common.h
  * by the script native/tools/gfx-define-generator/generate.js.
  * Changes to these public interfaces should be made there first and synced back.
  * ========================= !DO NOT CHANGE THE ABOVE SECTION MANUALLY! =========================
  */
/**
  * @en GFX base object.
  * @zh GFX 基类对象。
  */
export declare class GFXObject extends GCObject {
    get objectType(): ObjectType;
    get objectID(): number;
    get typedID(): number;
    /** @mangle */
    protected _objectType: ObjectType;
    /** @mangle */
    protected _objectID: number;
    /** @mangle */
    protected _typedID: number;
    private static _idTable;
    constructor(objectType: ObjectType);
}
export interface ISwapchainTextureInfo {
    swapchain: Swapchain;
    format: Format;
    width: number;
    height: number;
}
export declare enum AttributeName {
    ATTR_POSITION = "a_position",
    ATTR_NORMAL = "a_normal",
    ATTR_TANGENT = "a_tangent",
    ATTR_BITANGENT = "a_bitangent",
    ATTR_WEIGHTS = "a_weights",
    ATTR_JOINTS = "a_joints",
    ATTR_COLOR = "a_color",
    ATTR_COLOR1 = "a_color1",
    ATTR_COLOR2 = "a_color2",
    ATTR_TEX_COORD = "a_texCoord",
    ATTR_TEX_COORD1 = "a_texCoord1",
    ATTR_TEX_COORD2 = "a_texCoord2",
    ATTR_TEX_COORD3 = "a_texCoord3",
    ATTR_TEX_COORD4 = "a_texCoord4",
    ATTR_TEX_COORD5 = "a_texCoord5",
    ATTR_TEX_COORD6 = "a_texCoord6",
    ATTR_TEX_COORD7 = "a_texCoord7",
    ATTR_TEX_COORD8 = "a_texCoord8",
    ATTR_BATCH_ID = "a_batch_id",
    ATTR_BATCH_UV = "a_batch_uv"
}
export declare const FormatInfos: readonly FormatInfo[];
export declare const DESCRIPTOR_BUFFER_TYPE: number;
export declare const DESCRIPTOR_SAMPLER_TYPE: number;
export declare const DESCRIPTOR_DYNAMIC_TYPE: number;
export declare const DESCRIPTOR_STORAGE_BUFFER_TYPE: number;
export declare const DRAW_INFO_SIZE = 28;
export type BufferSource = ArrayBuffer | IndirectBuffer;
export declare function IsPowerOf2(x: number): boolean;
/**
  * @en Get memory size of the specified fomat.
  * @zh 获取指定格式对应的内存大小。
  * @param format The target format.
  * @param width The target width.
  * @param height The target height.
  * @param depth The target depth.
  */
export declare function FormatSize(format: Format, width: number, height: number, depth: number): number;
/**
  * @en Get memory size of the specified surface.
  * @zh GFX 格式表面内存大小。
  * @param format The target format.
  * @param width The target width.
  * @param height The target height.
  * @param depth The target depth.
  * @param mips The target mip levels.
  */
export declare function FormatSurfaceSize(format: Format, width: number, height: number, depth: number, mips: number): number;
/**
  * @en Get the memory size of the specified type.
  * @zh 得到 GFX 数据类型的大小。
  * @param type The target type.
  */
export declare function GetTypeSize(type: Type): number;
export declare function getTypedArrayConstructor(info: FormatInfo): TypedArrayConstructor;
export interface FormatAlignment {
    width: number;
    height: number;
}
export declare function formatAlignment(format: Format): FormatAlignment;
export declare function alignTo(size: number, alignment: number): number;
declare interface GPUTexture {
}
export type TextureHandle = GPUTexture | number;
export {};
