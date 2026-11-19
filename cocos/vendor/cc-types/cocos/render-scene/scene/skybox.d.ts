import { Material } from '../../asset/assets/material';
import { TextureCube } from '../../asset/assets/texture-cube';
import { MaterialInstance } from '../core/material-instance';
import { Model } from './model';
import type { SkyboxInfo } from '../../scene-graph/scene-globals';
import { GlobalDSManager } from '../../rendering/global-descriptor-set-manager';
export declare enum EnvironmentLightingType {
    /**
     * @zh
     * 半球漫反射
     * @en
     * hemisphere diffuse
     * @readonly
     */
    HEMISPHERE_DIFFUSE = 0,
    /**
     * @zh
     * 半球漫反射和环境反射
     * @en
     * hemisphere diffuse and Environment reflection
     * @readonly
     */
    AUTOGEN_HEMISPHERE_DIFFUSE_WITH_REFLECTION = 1,
    /**
     * @zh
     * 漫反射卷积图和环境反射
     * @en
     * diffuse convolution map and environment reflection
     * @readonly
     */
    DIFFUSEMAP_WITH_REFLECTION = 2
}
/**
 * @en The skybox configuration of the render scene,
 * currently some rendering options like hdr and ibl lighting configuration is also here.
 * @zh 渲染场景的天空盒配置，目前一些渲染配置，比如 HDR 模式和环境光照配置也在 Skybox 中。
 */
export declare class Skybox {
    /**
     * @en The Model object of the skybox
     * @zh 天空盒的 Model 对象
     */
    get model(): Model | null;
    /**
     * @en Whether activate skybox in the scene
     * @zh 是否启用天空盒？
     */
    get enabled(): boolean;
    set enabled(val: boolean);
    /**
     * @en Whether HDR mode is enabled
     * @zh 是否启用HDR？
     */
    get useHDR(): boolean;
    set useHDR(val: boolean);
    /**
     * @en Whether use image based lighting for PBR materials
     * @zh 是否启用IBL？
     */
    get useIBL(): boolean;
    set useIBL(val: boolean);
    /**
     * @en Whether use diffuse convolution map lighting
     * @zh 是否为IBL启用漫反射卷积图？
     */
    get useDiffuseMap(): boolean;
    set useDiffuseMap(val: boolean);
    /**
     * @en Whether enable RGBE data support in skybox shader
     * @zh 是否需要开启 shader 内的 RGBE 数据支持？
     */
    get isRGBE(): boolean;
    /**
     * @en Whether to use offline baked convolutional maps
     * @zh 是否使用离线烘焙的卷积图？
     */
    get useConvolutionMap(): boolean;
    /**
     * @en The texture cube used for the skybox
     * @zh 使用的立方体贴图
     */
    get envmap(): TextureCube | null;
    set envmap(val: TextureCube | null);
    /**
     * @en The texture cube used diffuse convolution map
     * @zh 使用的漫反射卷积图
     */
    get diffuseMap(): TextureCube | null;
    set diffuseMap(val: TextureCube | null);
    get reflectionMap(): TextureCube | null;
    get editableMaterial(): MaterialInstance | null;
    protected _envmapLDR: TextureCube | null;
    protected _envmapHDR: TextureCube | null;
    protected _diffuseMapLDR: TextureCube | null;
    protected _diffuseMapHDR: TextureCube | null;
    protected _globalDSManager: GlobalDSManager | null;
    protected _model: Model | null;
    protected _default: TextureCube | null;
    protected _enabled: boolean;
    protected _useIBL: boolean;
    protected _useHDR: boolean;
    protected _useDiffuseMap: boolean;
    protected _editableMaterial: MaterialInstance | null;
    protected _activated: boolean;
    protected _reflectionHDR: TextureCube | null;
    protected _reflectionLDR: TextureCube | null;
    protected _rotationAngle: number;
    initialize(skyboxInfo: SkyboxInfo): void;
    /**
     * @en Set the environment maps for HDR and LDR mode
     * @zh 为 HDR 和 LDR 模式设置环境贴图
     * @param envmapHDR @en Environment map for HDR mode @zh HDR 模式下的环境贴图
     * @param envmapLDR @en Environment map for LDR mode @zh LDR 模式下的环境贴图
     */
    setEnvMaps(envmapHDR: TextureCube | null, envmapLDR: TextureCube | null): void;
    /**
     * @en Set the diffuse maps
     * @zh 设置环境光漫反射贴图
     * @param diffuseMapHDR @en Diffuse map for HDR mode @zh HDR 模式下的漫反射贴图
     * @param diffuseMapLDR  @en Diffuse map for LDR mode @zh LDR 模式下的漫反射贴图
     */
    setDiffuseMaps(diffuseMapHDR: TextureCube | null, diffuseMapLDR: TextureCube | null): void;
    /**
     * @en Set custom skybox material
     * @zh 设置自定义的天空盒材质
     * @param skyboxMat  @en Skybox material @zh 天空盒材质
     */
    setSkyboxMaterial(skyboxMat: Material | null): void;
    /**
     * @en Set the environment reflection convolution map
     * @zh 设置环境反射卷积图
     * @param reflectionHDR  @en Reflection convolution map for HDR mode @zh HDR 模式下的反射卷积图
     * @param reflectionLDR  @en Reflection convolution map for LDR mode @zh LDR 模式下的反射卷积图
     */
    setReflectionMaps(reflectionHDR: TextureCube | null, reflectionLDR: TextureCube | null): void;
    /**
     * @en Set skybox rotation angle
     * @zh 设置天空盒旋转角度
     * @param angle  @en rotation angle @zh 旋转角度
     */
    setRotationAngle(angle: number): void;
    getRotationAngle(): number;
    updateMaterialRenderInfo(): void;
    activate(): void;
    protected _updatePipeline(): void;
    protected _updateGlobalBinding(): void;
    protected _updateSubModes(): void;
}
