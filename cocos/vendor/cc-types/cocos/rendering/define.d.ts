import { Pass } from '../render-scene/core/pass';
import { Model } from '../render-scene/scene/model';
import { SubModel } from '../render-scene/scene/submodel';
import { RecyclePool } from '../core';
import { BindingMappingInfo, UniformStorageBuffer, DescriptorSetLayoutBinding, UniformBlock, UniformSamplerTexture, UniformStorageImage, Device, Texture } from '../gfx';
export declare const PIPELINE_FLOW_MAIN = "MainFlow";
export declare const PIPELINE_FLOW_FORWARD = "ForwardFlow";
export declare const PIPELINE_FLOW_SHADOW = "ShadowFlow";
export declare const PIPELINE_FLOW_SMAA = "SMAAFlow";
export declare const PIPELINE_FLOW_TONEMAP = "ToneMapFlow";
/**
 * @en The predefined render pass stage ids
 * @zh 预设的渲染阶段。
 */
export declare enum RenderPassStage {
    DEFAULT = 100,
    UI = 200
}
/**
 * @en The predefined render priorities
 * @zh 预设的渲染优先级。
 */
export declare enum RenderPriority {
    MIN = 0,
    MAX = 255,
    DEFAULT = 128
}
/**
 * @en Render object interface
 * @zh 渲染对象接口。
 */
export interface IRenderObject {
    model: Model;
    depth: number;
}
export interface IRenderPass {
    priority: number;
    hash: number;
    depth: number;
    shaderId: number;
    subModel: SubModel;
    passIdx: number;
}
/**
 * @en Render batch interface
 * @zh 渲染批次接口。
 */
export interface IRenderBatch {
    pass: Pass;
}
/**
 * @en Render queue descriptor
 * @zh 渲染队列描述。
 */
export interface IRenderQueueDesc {
    isTransparent: boolean;
    phases: number;
    sortFunc: (a: IRenderPass, b: IRenderPass) => number;
}
export interface IDescriptorSetLayoutInfo {
    bindings: DescriptorSetLayoutBinding[];
    layouts: Record<string, UniformBlock | UniformSamplerTexture | UniformStorageImage | UniformStorageBuffer>;
}
export declare const globalDescriptorSetLayout: IDescriptorSetLayoutInfo;
export declare const localDescriptorSetLayout: IDescriptorSetLayoutInfo;
/**
 * @en The uniform bindings
 * @zh Uniform 参数绑定。
 */
export declare enum PipelineGlobalBindings {
    UBO_GLOBAL = 0,
    UBO_CAMERA = 1,
    UBO_SHADOW = 2,
    UBO_CSM = 3,
    SAMPLER_SHADOWMAP = 4,
    SAMPLER_ENVIRONMENT = 5,
    SAMPLER_SPOT_SHADOW_MAP = 6,
    SAMPLER_DIFFUSEMAP = 7,
    COUNT = 8
}
export declare enum ModelLocalBindings {
    UBO_LOCAL = 0,
    UBO_FORWARD_LIGHTS = 1,
    UBO_SKINNING_ANIMATION = 2,
    UBO_SKINNING_TEXTURE = 3,
    UBO_MORPH = 4,
    UBO_UI_LOCAL = 5,
    UBO_SH = 6,
    SAMPLER_JOINTS = 7,
    SAMPLER_MORPH_POSITION = 8,
    SAMPLER_MORPH_NORMAL = 9,
    SAMPLER_MORPH_TANGENT = 10,
    SAMPLER_LIGHTMAP = 11,
    SAMPLER_SPRITE = 12,
    SAMPLER_REFLECTION_PROBE_CUBE = 13,
    SAMPLER_REFLECTION_PROBE_PLANAR = 14,
    SAMPLER_REFLECTION_PROBE_DATA_MAP = 15,
    COUNT = 16
}
export declare enum SetIndex {
    GLOBAL = 0,
    MATERIAL = 1,
    LOCAL = 2,
    COUNT = 3
}
export declare const bindingMappingInfo: BindingMappingInfo;
export declare enum UBOGlobalEnum {
    TIME_OFFSET = 0,
    SCREEN_SIZE_OFFSET = 4,
    NATIVE_SIZE_OFFSET = 8,
    PROBE_INFO_OFFSET = 12,
    DEBUG_VIEW_MODE_OFFSET = 16,
    COUNT = 20,
    SIZE = 80
}
/**
 * @en The global uniform buffer object
 * @zh 全局 UBO。
 */
export declare class UBOGlobal {
    static readonly TIME_OFFSET: UBOGlobalEnum;
    static readonly SCREEN_SIZE_OFFSET: UBOGlobalEnum;
    static readonly NATIVE_SIZE_OFFSET: UBOGlobalEnum;
    static readonly PROBE_INFO_OFFSET: UBOGlobalEnum;
    static readonly DEBUG_VIEW_MODE_OFFSET: UBOGlobalEnum;
    static readonly COUNT: UBOGlobalEnum;
    static readonly SIZE: UBOGlobalEnum;
    static readonly NAME = "CCGlobal";
    static readonly BINDING = PipelineGlobalBindings.UBO_GLOBAL;
    static readonly DESCRIPTOR: DescriptorSetLayoutBinding;
    static readonly LAYOUT: UniformBlock;
}
export declare enum UBOCameraEnum {
    MAT_VIEW_OFFSET = 0,
    MAT_VIEW_INV_OFFSET = 16,
    MAT_PROJ_OFFSET = 32,
    MAT_PROJ_INV_OFFSET = 48,
    MAT_VIEW_PROJ_OFFSET = 64,
    MAT_VIEW_PROJ_INV_OFFSET = 80,
    CAMERA_POS_OFFSET = 96,
    SURFACE_TRANSFORM_OFFSET = 100,
    SCREEN_SCALE_OFFSET = 104,
    EXPOSURE_OFFSET = 108,
    MAIN_LIT_DIR_OFFSET = 112,
    MAIN_LIT_COLOR_OFFSET = 116,
    AMBIENT_SKY_OFFSET = 120,
    AMBIENT_GROUND_OFFSET = 124,
    GLOBAL_FOG_COLOR_OFFSET = 128,
    GLOBAL_FOG_BASE_OFFSET = 132,
    GLOBAL_FOG_ADD_OFFSET = 136,
    NEAR_FAR_OFFSET = 140,
    VIEW_PORT_OFFSET = 144,
    COUNT = 148,
    SIZE = 592
}
/**
 * @en The global camera uniform buffer object
 * @zh 全局相机 UBO。
 */
export declare class UBOCamera {
    static readonly MAT_VIEW_OFFSET: UBOCameraEnum;
    static readonly MAT_VIEW_INV_OFFSET: UBOCameraEnum;
    static readonly MAT_PROJ_OFFSET: UBOCameraEnum;
    static readonly MAT_PROJ_INV_OFFSET: UBOCameraEnum;
    static readonly MAT_VIEW_PROJ_OFFSET: UBOCameraEnum;
    static readonly MAT_VIEW_PROJ_INV_OFFSET: UBOCameraEnum;
    static readonly CAMERA_POS_OFFSET: UBOCameraEnum;
    static readonly SURFACE_TRANSFORM_OFFSET: UBOCameraEnum;
    static readonly SCREEN_SCALE_OFFSET: UBOCameraEnum;
    static readonly EXPOSURE_OFFSET: UBOCameraEnum;
    static readonly MAIN_LIT_DIR_OFFSET: UBOCameraEnum;
    static readonly MAIN_LIT_COLOR_OFFSET: UBOCameraEnum;
    static readonly AMBIENT_SKY_OFFSET: UBOCameraEnum;
    static readonly AMBIENT_GROUND_OFFSET: UBOCameraEnum;
    static readonly GLOBAL_FOG_COLOR_OFFSET: UBOCameraEnum;
    static readonly GLOBAL_FOG_BASE_OFFSET: UBOCameraEnum;
    static readonly GLOBAL_FOG_ADD_OFFSET: UBOCameraEnum;
    static readonly NEAR_FAR_OFFSET: UBOCameraEnum;
    static readonly VIEW_PORT_OFFSET: UBOCameraEnum;
    static readonly COUNT: UBOCameraEnum;
    static readonly SIZE: UBOCameraEnum;
    static readonly NAME = "CCCamera";
    static readonly BINDING = PipelineGlobalBindings.UBO_CAMERA;
    static readonly DESCRIPTOR: DescriptorSetLayoutBinding;
    static readonly LAYOUT: UniformBlock;
}
export declare enum UBOShadowEnum {
    MAT_LIGHT_VIEW_OFFSET = 0,
    MAT_LIGHT_VIEW_PROJ_OFFSET = 16,
    SHADOW_INV_PROJ_DEPTH_INFO_OFFSET = 32,
    SHADOW_PROJ_DEPTH_INFO_OFFSET = 36,
    SHADOW_PROJ_INFO_OFFSET = 40,
    SHADOW_NEAR_FAR_LINEAR_SATURATION_INFO_OFFSET = 44,
    SHADOW_WIDTH_HEIGHT_PCF_BIAS_INFO_OFFSET = 48,
    SHADOW_LIGHT_PACKING_NBIAS_NULL_INFO_OFFSET = 52,
    SHADOW_COLOR_OFFSET = 56,
    PLANAR_NORMAL_DISTANCE_INFO_OFFSET = 60,
    COUNT = 64,
    SIZE = 256
}
/**
 * @en The uniform buffer object for 'cast shadow(fixed || csm)' && 'dir fixed area shadow' && 'spot shadow' && 'sphere shadow' && 'planar shadow'
 * @zh 这个 UBO 仅仅只给 'cast shadow(fixed || csm)' && 'dir fixed area shadow' && 'spot shadow' && 'sphere shadow' && 'planar shadow' 使用
 */
export declare class UBOShadow {
    static readonly MAT_LIGHT_VIEW_OFFSET: UBOShadowEnum;
    static readonly MAT_LIGHT_VIEW_PROJ_OFFSET: UBOShadowEnum;
    static readonly SHADOW_INV_PROJ_DEPTH_INFO_OFFSET: UBOShadowEnum;
    static readonly SHADOW_PROJ_DEPTH_INFO_OFFSET: UBOShadowEnum;
    static readonly SHADOW_PROJ_INFO_OFFSET: UBOShadowEnum;
    static readonly SHADOW_NEAR_FAR_LINEAR_SATURATION_INFO_OFFSET: UBOShadowEnum;
    static readonly SHADOW_WIDTH_HEIGHT_PCF_BIAS_INFO_OFFSET: UBOShadowEnum;
    static readonly SHADOW_LIGHT_PACKING_NBIAS_NULL_INFO_OFFSET: UBOShadowEnum;
    static readonly SHADOW_COLOR_OFFSET: UBOShadowEnum;
    static readonly PLANAR_NORMAL_DISTANCE_INFO_OFFSET: UBOShadowEnum;
    static readonly COUNT: UBOShadowEnum;
    static readonly SIZE: UBOShadowEnum;
    static readonly NAME = "CCShadow";
    static readonly BINDING = PipelineGlobalBindings.UBO_SHADOW;
    static readonly DESCRIPTOR: DescriptorSetLayoutBinding;
    static readonly LAYOUT: UniformBlock;
}
export declare enum UBOCSMEnum {
    CSM_LEVEL_COUNT = 4,
    CSM_VIEW_DIR_0_OFFSET = 0,
    CSM_VIEW_DIR_1_OFFSET = 16,
    CSM_VIEW_DIR_2_OFFSET = 32,
    CSM_ATLAS_OFFSET = 48,
    MAT_CSM_VIEW_PROJ_OFFSET = 64,
    CSM_PROJ_DEPTH_INFO_OFFSET = 128,
    CSM_PROJ_INFO_OFFSET = 144,
    CSM_SPLITS_INFO_OFFSET = 160,
    COUNT = 164,
    SIZE = 656
}
/**
 * @en The uniform buffer object only for dir csm shadow(level: 1 ~ 4)
 * @zh 级联阴影使用的UBO
 */
export declare class UBOCSM {
    static readonly CSM_LEVEL_COUNT: UBOCSMEnum;
    static readonly CSM_VIEW_DIR_0_OFFSET: UBOCSMEnum;
    static readonly CSM_VIEW_DIR_1_OFFSET: UBOCSMEnum;
    static readonly CSM_VIEW_DIR_2_OFFSET: UBOCSMEnum;
    static readonly CSM_ATLAS_OFFSET: UBOCSMEnum;
    static readonly MAT_CSM_VIEW_PROJ_OFFSET: UBOCSMEnum;
    static readonly CSM_PROJ_DEPTH_INFO_OFFSET: UBOCSMEnum;
    static readonly CSM_PROJ_INFO_OFFSET: UBOCSMEnum;
    static readonly CSM_SPLITS_INFO_OFFSET: UBOCSMEnum;
    static readonly COUNT: number;
    static readonly SIZE: UBOCSMEnum;
    static readonly NAME = "CCCSM";
    static readonly BINDING = PipelineGlobalBindings.UBO_CSM;
    static readonly DESCRIPTOR: DescriptorSetLayoutBinding;
    static readonly LAYOUT: UniformBlock;
}
export declare const UNIFORM_SHADOWMAP_BINDING = PipelineGlobalBindings.SAMPLER_SHADOWMAP;
export declare const UNIFORM_ENVIRONMENT_BINDING = PipelineGlobalBindings.SAMPLER_ENVIRONMENT;
export declare const UNIFORM_DIFFUSEMAP_BINDING = PipelineGlobalBindings.SAMPLER_DIFFUSEMAP;
export declare const UNIFORM_SPOT_SHADOW_MAP_TEXTURE_BINDING = PipelineGlobalBindings.SAMPLER_SPOT_SHADOW_MAP;
export declare enum UBOLocalEnum {
    MAT_WORLD_OFFSET = 0,
    MAT_WORLD_IT_OFFSET = 16,
    LIGHTINGMAP_UVPARAM = 32,
    LOCAL_SHADOW_BIAS = 36,
    REFLECTION_PROBE_DATA1 = 40,
    REFLECTION_PROBE_DATA2 = 44,
    REFLECTION_PROBE_BLEND_DATA1 = 48,
    REFLECTION_PROBE_BLEND_DATA2 = 52,
    COUNT = 56,
    SIZE = 224,
    BINDING = 0
}
/**
 * @en The local uniform buffer object
 * @zh 本地 UBO。
 */
export declare class UBOLocal {
    static readonly MAT_WORLD_OFFSET: UBOLocalEnum;
    static readonly MAT_WORLD_IT_OFFSET: UBOLocalEnum;
    static readonly LIGHTINGMAP_UVPARAM: UBOLocalEnum;
    static readonly LOCAL_SHADOW_BIAS: UBOLocalEnum;
    static readonly REFLECTION_PROBE_DATA1: UBOLocalEnum;
    static readonly REFLECTION_PROBE_DATA2: UBOLocalEnum;
    static readonly REFLECTION_PROBE_BLEND_DATA1: UBOLocalEnum;
    static readonly REFLECTION_PROBE_BLEND_DATA2: UBOLocalEnum;
    static readonly COUNT: UBOLocalEnum;
    static readonly SIZE: UBOLocalEnum;
    static readonly NAME = "CCLocal";
    static readonly BINDING: UBOLocalEnum;
    static readonly DESCRIPTOR: DescriptorSetLayoutBinding;
    static readonly LAYOUT: UniformBlock;
}
/**
 * @en The world bound uniform buffer object
 * @zh 世界空间包围盒 UBO。
 */
export declare class UBOWorldBound {
    static readonly WORLD_BOUND_CENTER = 0;
    static readonly WORLD_BOUND_HALF_EXTENTS: number;
    static readonly COUNT: number;
    static readonly SIZE: number;
    static readonly NAME = "CCWorldBound";
    static readonly BINDING = ModelLocalBindings.UBO_LOCAL;
    static readonly DESCRIPTOR: DescriptorSetLayoutBinding;
    static readonly LAYOUT: UniformBlock;
}
export declare const INST_MAT_WORLD = "a_matWorld0";
export declare const INST_SH = "a_sh_linear_const_r";
export declare class UBOLocalBatched {
    static readonly BATCHING_COUNT = 10;
    static readonly MAT_WORLDS_OFFSET = 0;
    static readonly COUNT: number;
    static readonly SIZE: number;
    static readonly NAME = "CCLocalBatched";
    static readonly BINDING = ModelLocalBindings.UBO_LOCAL;
    static readonly DESCRIPTOR: DescriptorSetLayoutBinding;
    static readonly LAYOUT: UniformBlock;
}
export declare enum UBOForwardLightEnum {
    LIGHTS_PER_PASS = 1,
    LIGHT_POS_OFFSET = 0,
    LIGHT_COLOR_OFFSET = 4,
    LIGHT_SIZE_RANGE_ANGLE_OFFSET = 8,
    LIGHT_DIR_OFFSET = 12,
    LIGHT_BOUNDING_SIZE_VS_OFFSET = 16,
    COUNT = 20,
    SIZE = 80
}
/**
 * @en The uniform buffer object for forward lighting
 * @zh 前向灯光 UBO。
 */
export declare class UBOForwardLight {
    static readonly LIGHTS_PER_PASS: UBOForwardLightEnum;
    static readonly LIGHT_POS_OFFSET: UBOForwardLightEnum;
    static readonly LIGHT_COLOR_OFFSET: UBOForwardLightEnum;
    static readonly LIGHT_SIZE_RANGE_ANGLE_OFFSET: UBOForwardLightEnum;
    static readonly LIGHT_DIR_OFFSET: UBOForwardLightEnum;
    static readonly LIGHT_BOUNDING_SIZE_VS_OFFSET: UBOForwardLightEnum;
    static readonly COUNT: UBOForwardLightEnum;
    static readonly SIZE: UBOForwardLightEnum;
    static readonly NAME = "CCForwardLight";
    static readonly BINDING = ModelLocalBindings.UBO_FORWARD_LIGHTS;
    static readonly DESCRIPTOR: DescriptorSetLayoutBinding;
    static readonly LAYOUT: UniformBlock;
}
export declare class UBODeferredLight {
    static readonly LIGHTS_PER_PASS = 10;
}
export declare const JOINT_UNIFORM_CAPACITY = 30;
/**
 * @en The uniform buffer object for skinning texture
 * @zh 骨骼贴图 UBO。
 */
export declare class UBOSkinningTexture {
    static readonly JOINTS_TEXTURE_INFO_OFFSET = 0;
    static readonly COUNT: number;
    static readonly SIZE: number;
    static readonly NAME = "CCSkinningTexture";
    static readonly BINDING = ModelLocalBindings.UBO_SKINNING_TEXTURE;
    static readonly DESCRIPTOR: DescriptorSetLayoutBinding;
    static readonly LAYOUT: UniformBlock;
}
export declare class UBOSkinningAnimation {
    static readonly JOINTS_ANIM_INFO_OFFSET = 0;
    static readonly COUNT: number;
    static readonly SIZE: number;
    static readonly NAME = "CCSkinningAnimation";
    static readonly BINDING = ModelLocalBindings.UBO_SKINNING_ANIMATION;
    static readonly DESCRIPTOR: DescriptorSetLayoutBinding;
    static readonly LAYOUT: UniformBlock;
}
export declare const INST_JOINT_ANIM_INFO = "a_jointAnimInfo";
export declare class UBOSkinning {
    private static _jointUniformCapacity;
    static get JOINT_UNIFORM_CAPACITY(): number;
    private static _count;
    static get COUNT(): number;
    private static _size;
    static get SIZE(): number;
    static readonly NAME = "CCSkinning";
    static readonly BINDING = ModelLocalBindings.UBO_SKINNING_TEXTURE;
    static readonly DESCRIPTOR: DescriptorSetLayoutBinding;
    static readonly LAYOUT: UniformBlock;
    /**
     * @internal This method only used init UBOSkinning configure.
    */
    static initLayout(capacity: number): void;
}
/**
 * @internal This method only used to init localDescriptorSetLayout.layouts[UBOSkinning.NAME]
 * @engineInternal
*/
export declare function localDescriptorSetLayout_ResizeMaxJoints(maxCount: number): void;
export declare enum UBOMorphEnum {
    MAX_MORPH_TARGET_COUNT = 60,
    OFFSET_OF_WEIGHTS = 0,
    OFFSET_OF_DISPLACEMENT_TEXTURE_WIDTH = 240,
    OFFSET_OF_DISPLACEMENT_TEXTURE_HEIGHT = 244,
    OFFSET_OF_VERTICES_COUNT = 248,
    COUNT_BASE_4_BYTES = 64,
    SIZE = 256
}
/**
 * @en The uniform buffer object for morph setting
 * @zh 形变配置的 UBO
 */
export declare class UBOMorph {
    static readonly MAX_MORPH_TARGET_COUNT: UBOMorphEnum;
    static readonly OFFSET_OF_WEIGHTS: UBOMorphEnum;
    static readonly OFFSET_OF_DISPLACEMENT_TEXTURE_WIDTH: UBOMorphEnum;
    static readonly OFFSET_OF_DISPLACEMENT_TEXTURE_HEIGHT: UBOMorphEnum;
    static readonly OFFSET_OF_VERTICES_COUNT: UBOMorphEnum;
    static readonly COUNT_BASE_4_BYTES: UBOMorphEnum;
    static readonly SIZE: UBOMorphEnum;
    static readonly NAME = "CCMorph";
    static readonly BINDING = ModelLocalBindings.UBO_MORPH;
    static readonly DESCRIPTOR: DescriptorSetLayoutBinding;
    static readonly LAYOUT: UniformBlock;
}
export declare class UBOUILocal {
    private constructor();
    static readonly NAME = "CCUILocal";
    static readonly BINDING = ModelLocalBindings.UBO_UI_LOCAL;
    static readonly DESCRIPTOR: DescriptorSetLayoutBinding;
    static readonly LAYOUT: UniformBlock;
}
export declare enum UBOSHEnum {
    SH_LINEAR_CONST_R_OFFSET = 0,
    SH_LINEAR_CONST_G_OFFSET = 4,
    SH_LINEAR_CONST_B_OFFSET = 8,
    SH_QUADRATIC_R_OFFSET = 12,
    SH_QUADRATIC_G_OFFSET = 16,
    SH_QUADRATIC_B_OFFSET = 20,
    SH_QUADRATIC_A_OFFSET = 24,
    COUNT = 28,
    SIZE = 112,
    BINDING = 6
}
/**
 * @en The SH uniform buffer object
 * @zh 球谐 UBO。
 */
export declare class UBOSH {
    static readonly SH_LINEAR_CONST_R_OFFSET: UBOSHEnum;
    static readonly SH_LINEAR_CONST_G_OFFSET: UBOSHEnum;
    static readonly SH_LINEAR_CONST_B_OFFSET: UBOSHEnum;
    static readonly SH_QUADRATIC_R_OFFSET: UBOSHEnum;
    static readonly SH_QUADRATIC_G_OFFSET: UBOSHEnum;
    static readonly SH_QUADRATIC_B_OFFSET: UBOSHEnum;
    static readonly SH_QUADRATIC_A_OFFSET: UBOSHEnum;
    static readonly COUNT: UBOSHEnum;
    static readonly SIZE: UBOSHEnum;
    static readonly NAME = "CCSH";
    static readonly BINDING: UBOSHEnum;
    static readonly DESCRIPTOR: DescriptorSetLayoutBinding;
    static readonly LAYOUT: UniformBlock;
}
export declare const UNIFORM_JOINT_TEXTURE_BINDING = ModelLocalBindings.SAMPLER_JOINTS;
export declare const UNIFORM_REALTIME_JOINT_TEXTURE_BINDING = ModelLocalBindings.SAMPLER_JOINTS;
export declare const UNIFORM_POSITION_MORPH_TEXTURE_BINDING = ModelLocalBindings.SAMPLER_MORPH_POSITION;
export declare const UNIFORM_NORMAL_MORPH_TEXTURE_BINDING = ModelLocalBindings.SAMPLER_MORPH_NORMAL;
export declare const UNIFORM_TANGENT_MORPH_TEXTURE_BINDING = ModelLocalBindings.SAMPLER_MORPH_TANGENT;
export declare const UNIFORM_LIGHTMAP_TEXTURE_BINDING = ModelLocalBindings.SAMPLER_LIGHTMAP;
export declare const UNIFORM_SPRITE_TEXTURE_BINDING = ModelLocalBindings.SAMPLER_SPRITE;
export declare const UNIFORM_REFLECTION_PROBE_CUBEMAP_BINDING = ModelLocalBindings.SAMPLER_REFLECTION_PROBE_CUBE;
export declare const UNIFORM_REFLECTION_PROBE_TEXTURE_BINDING = ModelLocalBindings.SAMPLER_REFLECTION_PROBE_PLANAR;
export declare const UNIFORM_REFLECTION_PROBE_DATA_MAP_BINDING = ModelLocalBindings.SAMPLER_REFLECTION_PROBE_DATA_MAP;
export declare const UNIFORM_REFLECTION_PROBE_BLEND_CUBEMAP_BINDING: number;
/**
 * @engineInternal
 */
export declare const ENABLE_PROBE_BLEND = false;
export declare const CAMERA_DEFAULT_MASK: number;
export declare const CAMERA_EDITOR_MASK: number;
export declare const MODEL_ALWAYS_MASK: number;
/**
 * @en Does the device support single-channeled half float texture? (for both color attachment and sampling)
 * @zh 当前设备是否支持单通道半浮点贴图？（颜色输出和采样）
 */
export declare function supportsR16HalfFloatTexture(device: Device): boolean;
export declare function getDefaultShadowTexture(device: Device): Texture;
/**
 * @en Does the device support single-channeled float texture? (for both color attachment and sampling)
 * @zh 当前设备是否支持单通道浮点贴图？（颜色输出和采样）
 */
export declare function supportsR32FloatTexture(device: Device): boolean;
/**
 * @en Does the device support 4-channeled float texture? (for both color attachment and sampling)
 * @zh 当前设备是否支持4通道浮点贴图？（颜色输出和采样）
 */
export declare function supportsRGBA16HalfFloatTexture(device: Device): boolean;
/**
 * @en Does the device support 4-channeled float texture? (for both color attachment and sampling)
 * @zh 当前设备是否支持4通道浮点贴图？（颜色输出和采样）
 */
export declare function supportsRGBA32FloatTexture(device: Device): boolean;
export declare function isEnableEffect(): boolean;
export declare function getPassPool(): RecyclePool<IRenderPass>;
