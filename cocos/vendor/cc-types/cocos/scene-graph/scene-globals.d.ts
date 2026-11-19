import { TextureCube } from '../asset/assets/texture-cube';
import { Color, Vec3, Vec2, Vec4 } from '../core/math';
import { Ambient } from '../render-scene/scene/ambient';
import { Shadows } from '../render-scene/scene/shadows';
import { Skybox, EnvironmentLightingType } from '../render-scene/scene/skybox';
import { Octree } from '../render-scene/scene/octree';
import { Skin } from '../render-scene/scene/skin';
import { Fog } from '../render-scene/scene/fog';
import { LightProbesData, LightProbes } from '../gi/light-probe/light-probe';
import { Node } from './node';
import { Material, MaterialPropertyFull } from '../asset/assets/material';
import { Scene } from './scene';
import { PostSettings } from '../render-scene/scene/post-settings';
/**
 * @en Environment lighting configuration in the Scene
 * @zh 场景的环境光照相关配置
 */
export declare class AmbientInfo {
    /**
     * @en The sky color in HDR mode
     * @zh HDR 模式下的天空光照色
     */
    get skyColorHDR(): Readonly<Vec4>;
    /**
     * @en The ground color in HDR mode
     * @zh HDR 模式下的地面光照色
     */
    get groundAlbedoHDR(): Readonly<Vec4>;
    /**
     * @en Sky illuminance in HDR mode
     * @zh HDR 模式下的天空亮度
     */
    get skyIllumHDR(): number;
    /**
     * @en The sky color in LDR mode
     * @zh LDR 模式下的天空光照色
     */
    get skyColorLDR(): Readonly<Vec4>;
    /**
     * @en The ground color in LDR mode
     * @zh LDR 模式下的地面光照色
     */
    get groundAlbedoLDR(): Readonly<Vec4>;
    /**
     * @en Sky illuminance in LDR mode
     * @zh LDR 模式下的天空亮度
     */
    get skyIllumLDR(): number;
    /**
     * @en Sky lighting color configurable in editor with color picker
     * @zh 编辑器中可配置的天空光照颜色（通过颜色拾取器）
     */
    set skyLightingColor(val: Color);
    get skyLightingColor(): Color;
    /**
     * @internal
     */
    set skyColor(val: Vec4);
    /**
     * @en Sky illuminance
     * @zh 天空亮度
     */
    set skyIllum(val: number);
    get skyIllum(): number;
    /**
     * @en Ground lighting color configurable in editor with color picker
     * @zh 编辑器中可配置的地面光照颜色（通过颜色拾取器）
     */
    set groundLightingColor(val: Color);
    get groundLightingColor(): Color;
    /**
     * @internal
     */
    set groundAlbedo(val: Vec4);
    protected _skyColorHDR: Vec4;
    protected _skyIllumHDR: number;
    protected _groundAlbedoHDR: Vec4;
    protected _skyColorLDR: Vec4;
    protected _skyIllumLDR: number;
    protected _groundAlbedoLDR: Vec4;
    protected _resource: Ambient | null;
    /**
     * @en Activate the ambient lighting configuration in the render scene, no need to invoke manually.
     * @zh 在渲染场景中启用环境光照设置，不需要手动调用
     * @param resource The ambient configuration object in the render scene
     */
    activate(resource: Ambient): void;
}
/**
 * @en Skybox related configuration
 * @zh 天空盒相关配置
 */
export declare class SkyboxInfo {
    /**
     * @en Whether to use diffuse convolution map. Enabled -> Will use map specified. Disabled -> Will revert to hemispheric lighting
     * @zh 是否为IBL启用漫反射卷积图？不启用的话将使用默认的半球光照
     */
    set applyDiffuseMap(val: boolean);
    get applyDiffuseMap(): boolean;
    /**
     * @en Whether activate skybox in the scene
     * @zh 是否启用天空盒？
     */
    set enabled(val: boolean);
    get enabled(): boolean;
    /**
     * @zh 环境反射类型
     * @en environment reflection type
     */
    set envLightingType(val: number);
    get envLightingType(): number;
    /**
     * @en Whether use environment lighting
     * @zh 是否启用环境光照？
     */
    set useIBL(val: boolean);
    get useIBL(): boolean;
    /**
     * @en Toggle HDR (TODO: This SHOULD be moved into it's own subgroup away from skybox)
     * @zh 是否启用HDR？
     */
    set useHDR(val: boolean);
    get useHDR(): boolean;
    /**
     * @en The texture cube used for the skybox
     * @zh 使用的立方体贴图
     */
    set envmap(val: TextureCube | null);
    get envmap(): TextureCube | null;
    /**
     * @en Rotate the skybox
     * @zh 旋转天空盒
     */
    set rotationAngle(val: number);
    get rotationAngle(): number;
    /**
     * @en The optional diffusion convolution map used in tandem with IBL
     * @zh 使用的漫反射卷积图
     */
    set diffuseMap(val: TextureCube | null);
    get diffuseMap(): TextureCube | null;
    /**
     * @en Convolutional map using environmental reflections
     * @zh 使用环境反射卷积图
     */
    set reflectionMap(val: TextureCube | null);
    get reflectionMap(): TextureCube | null;
    /**
     * @en Use custom skybox material
     * @zh 使用自定义的天空盒材质
     */
    set skyboxMaterial(val: Material | null);
    get skyboxMaterial(): Material | null;
    protected _envLightingType: EnvironmentLightingType;
    protected _envmapHDR: TextureCube | null;
    protected _envmapLDR: TextureCube | null;
    protected _diffuseMapHDR: TextureCube | null;
    protected _diffuseMapLDR: TextureCube | null;
    protected _enabled: boolean;
    protected _useHDR: boolean;
    protected _editableMaterial: Material | null;
    protected _reflectionHDR: TextureCube | null;
    protected _reflectionLDR: TextureCube | null;
    protected _rotationAngle: number;
    protected _resource: Skybox | null;
    /**
     * @en Activate the skybox configuration in the render scene, no need to invoke manually.
     * @zh 在渲染场景中启用天空盒设置，不需要手动调用
     * @param resource The skybox configuration object in the render scene
     */
    activate(resource: Skybox): void;
    /**
     * @en When the environment map changed will call this function to update scene.
     * @zh 环境贴图发生变化时，会调用此函数更新场景。
     * @param val environment map
     */
    updateEnvMap(val: TextureCube): void;
    /**
     * @en
     * Set custom skybox material properties.
     * @zh
     * 设置自定义的天空盒材质属性。
     * @param name @en The target property name. @zh 目标 property 名称。
     * @param val @en The target value. @zh 需要设置的目标值。
     * @param passIdx
     * @en The pass to apply to. Will apply to all passes if not specified.
     * @zh 设置此属性的 pass 索引，如果没有指定，则会设置此属性到所有 pass 上。
     */
    setMaterialProperty(name: string, val: MaterialPropertyFull | MaterialPropertyFull[], passIdx?: number): void;
}
/**
 * @zh 全局雾相关配置
 * @en Global fog configuration
 */
export declare class FogInfo {
    static FogType: {
        LINEAR: number;
        EXP: number;
        EXP_SQUARED: number;
        LAYERED: number;
    };
    /**
     * @zh 是否启用全局雾效
     * @en Enable global fog
     */
    set enabled(val: boolean);
    get enabled(): boolean;
    /**
     * @zh 是否启用精确雾效(像素雾)计算
     * @en Enable accurate fog (pixel fog)
     */
    set accurate(val: boolean);
    get accurate(): boolean;
    /**
     * @zh 全局雾颜色
     * @en Global fog color
     */
    set fogColor(val: Readonly<Color>);
    get fogColor(): Readonly<Color>;
    /**
     * @zh 全局雾类型
     * @en Global fog type
     */
    get type(): number;
    set type(val: number);
    /**
     * @zh 全局雾浓度
     * @en Global fog density
     */
    get fogDensity(): number;
    set fogDensity(val: number);
    /**
     * @zh 雾效起始位置
     * @en Global fog start position
     */
    get fogStart(): number;
    set fogStart(val: number);
    /**
     * @zh 雾效结束位置，只适用于线性雾
     * @en Global fog end position, only for linear fog
     */
    get fogEnd(): number;
    set fogEnd(val: number);
    /**
     * @zh 雾效衰减
     * @en Global fog attenuation
     */
    get fogAtten(): number;
    set fogAtten(val: number);
    /**
     * @zh 雾效顶部范围，只适用于层级雾
     * @en Global fog top range, only for layered fog
     */
    get fogTop(): number;
    set fogTop(val: number);
    /**
     * @zh 雾效范围，只适用于层级雾
     * @en Global fog range, only for layered fog
     */
    get fogRange(): number;
    set fogRange(val: number);
    protected _type: number;
    protected _fogColor: Color;
    protected _enabled: boolean;
    protected _fogDensity: number;
    protected _fogStart: number;
    protected _fogEnd: number;
    protected _fogAtten: number;
    protected _fogTop: number;
    protected _fogRange: number;
    protected _accurate: boolean;
    protected _resource: Fog | null;
    /**
     * @en Activate the fog configuration in the render scene, no need to invoke manually.
     * @zh 在渲染场景中启用雾效设置，不需要手动调用
     * @param resource The fog configuration object in the render scene
     */
    activate(resource: Fog): void;
}
/**
 * @en Scene level shadow related configuration
 * @zh 场景级别阴影相关的配置
 */
export declare class ShadowsInfo {
    /**
     * @en Whether activate planar shadow
     * @zh 是否启用平面阴影？
     */
    set enabled(val: boolean);
    get enabled(): boolean;
    /**
     * @en The type of the shadow
     * @zh 阴影渲染的类型
     */
    set type(val: number);
    get type(): number;
    /**
     * @en Shadow color
     * @zh 阴影颜色
     */
    set shadowColor(val: Readonly<Color>);
    get shadowColor(): Readonly<Color>;
    /**
     * @en The normal of the plane which receives shadow
     * @zh 阴影接收平面的法线
     */
    set planeDirection(val: Readonly<Vec3>);
    get planeDirection(): Readonly<Vec3>;
    /**
     * @en The distance from coordinate origin to the receiving plane.
     * @zh 阴影接收平面与原点的距离
     */
    set planeHeight(val: number);
    get planeHeight(): number;
    /**
     * @en Positional offset values in planar shading calculations.
     * @zh 平面阴影计算中的位置偏移值。
     */
    set planeBias(val: number);
    get planeBias(): number;
    /**
     * @en get or set shadow max received
     * @zh 获取或者设置阴影接收的最大光源数量
     */
    set maxReceived(val: number);
    get maxReceived(): number;
    /**
     * @en get or set shadow map size
     * @zh 获取或者设置阴影纹理大小
     */
    set shadowMapSize(value: number);
    get shadowMapSize(): number;
    protected _enabled: boolean;
    protected _type: number;
    protected _normal: Vec3;
    protected _distance: number;
    protected _planeBias: number;
    protected _shadowColor: Color;
    protected _maxReceived: number;
    protected _size: Vec2;
    protected _resource: Shadows | null;
    /**
     * @en Set plane which receives shadow with the given node's world transformation
     * @zh 根据指定节点的世界变换设置阴影接收平面的信息
     * @param node The node for setting up the plane
     */
    setPlaneFromNode(node: Node): void;
    /**
     * @en Activate the shadow configuration in the render scene, no need to invoke manually.
     * @zh 在渲染场景中启用阴影设置，不需要手动调用
     * @param resource The shadow configuration object in the render scene
     */
    activate(resource: Shadows): void;
}
export declare const DEFAULT_WORLD_MIN_POS: Vec3;
export declare const DEFAULT_WORLD_MAX_POS: Vec3;
export declare const DEFAULT_OCTREE_DEPTH = 8;
/**
 * @en Scene management and culling configuration based on octree
 * @zh 基于八叉树的场景剔除配置
 */
export declare class OctreeInfo {
    /**
     * @en Whether activate scene culling based on octree
     * @zh 是否启用八叉树加速剔除？
     */
    set enabled(val: boolean);
    get enabled(): boolean;
    /**
     * @en The minimal position of the scene bounding box.
     * Objects entirely outside the bounding box will be culled, other objects will be managed dynamically.
     * @zh 场景包围盒的最小位置，完全超出包围盒的物体会被剔除，其他物体根据情况被动态剔除。
     */
    set minPos(val: Vec3);
    get minPos(): Vec3;
    /**
     * @en The maximum position of the scene bounding box.
     * Objects entirely outside the bounding box will be culled, other objects will be managed dynamically.
     * @zh 场景包围盒的最大位置，完全超出包围盒的物体会被剔除，其他物体根据情况被动态剔除。
     */
    set maxPos(val: Vec3);
    get maxPos(): Vec3;
    /**
     * @en The depth of the octree.
     * @zh 八叉树的深度。
     */
    set depth(val: number);
    get depth(): number;
    protected _enabled: boolean;
    protected _minPos: Vec3;
    protected _maxPos: Vec3;
    protected _depth: number;
    protected _resource: Octree | null;
    /**
     * @en Activate the octree configuration in the render scene, no need to invoke manually.
     * @zh 在渲染场景中启用八叉树设置，不需要手动调用
     * @param resource The octree configuration object in the render scene
     */
    activate(resource: Octree): void;
}
/**
 * @en Global skin in the render scene.
 * @zh 渲染场景中的全局皮肤后处理设置。
 */
export declare class SkinInfo {
    /**
     * @en Enable skip.
     * @zh 是否开启皮肤后效。
     */
    set enabled(val: boolean);
    get enabled(): boolean;
    /**
     * @en Getter/Setter sampler width.
     * @zh 设置或者获取采样宽度。
     */
    set blurRadius(val: number);
    get blurRadius(): number;
    /**
     * @en Getter/Setter depth unit scale.
     * @zh 设置或者获取深度单位比例。
     */
    set sssIntensity(val: number);
    get sssIntensity(): number;
    protected _enabled: boolean;
    protected _blurRadius: number;
    protected _sssIntensity: number;
    protected _resource: Skin | null;
    /**
     * @en Activate the skin configuration in the render scene, no need to invoke manually.
     * @zh 在渲染场景中启用皮肤设置，不需要手动调用
     * @param resource The skin configuration object in the render scene
     */
    activate(resource: Skin): void;
}
export declare class PostSettingsInfo {
    /**
     * @zh 色调映射类型
     * @en Tone mapping type
     */
    set toneMappingType(val: number);
    get toneMappingType(): number;
    protected _toneMappingType: number;
    protected _resource: PostSettings | null;
    activate(resource: PostSettings): void;
}
export interface ILightProbeNode {
    node: Node;
    probes: Vec3[] | null;
}
/**
 * @en light probe configuration
 * @zh 光照探针配置
 */
export declare class LightProbeInfo {
    /**
     * @en GI multiplier
     * @zh GI乘数
     */
    set giScale(val: number);
    get giScale(): number;
    /**
     * @en GI sample counts
     * @zh GI 采样数量
     */
    set giSamples(val: number);
    get giSamples(): number;
    /**
     * @en light bounces
     * @zh 光照反弹次数
     */
    set bounces(val: number);
    get bounces(): number;
    /**
     * @en Reduce ringing of light probe
     * @zh 减少光照探针的振铃效果
     */
    set reduceRinging(val: number);
    get reduceRinging(): number;
    /**
     * @en Whether to show light probe
     * @zh 是否显示光照探针
     */
    set showProbe(val: boolean);
    get showProbe(): boolean;
    /**
     * @en Whether to show light probe's connection
     * @zh 是否显示光照探针连线
     */
    set showWireframe(val: boolean);
    get showWireframe(): boolean;
    /**
     * @en Whether to show light probe's convex
     * @zh 是否显示光照探针凸包
     */
    set showConvex(val: boolean);
    get showConvex(): boolean;
    /**
     * @en light probe's vertex and tetrahedron data
     * @zh 光照探针顶点及四面体数据
     */
    set data(val: LightProbesData | null);
    get data(): LightProbesData | null;
    /**
     * @en The value of all light probe sphere display size
     * @zh 光照探针全局显示大小
     */
    set lightProbeSphereVolume(val: number);
    get lightProbeSphereVolume(): number;
    protected _giScale: number;
    protected _giSamples: number;
    protected _bounces: number;
    protected _reduceRinging: number;
    protected _showProbe: boolean;
    protected _showWireframe: boolean;
    protected _showConvex: boolean;
    protected _data: LightProbesData | null;
    protected _lightProbeSphereVolume: number;
    protected _nodes: ILightProbeNode[];
    protected _scene: Scene | null;
    protected _resource: LightProbes | null;
    activate(scene: Scene, resource: LightProbes): void;
    onProbeBakeFinished(): void;
    onProbeBakeCleared(): void;
    private onProbeBakingChanged;
    clearSHCoefficients(): void;
    isUniqueNode(): boolean;
    addNode(node: Node): boolean;
    removeNode(node: Node): boolean;
    syncData(node: Node, probes: Vec3[]): void;
    update(updateTet?: boolean): void;
    private clearAllSHUBOs;
    private resetAllTetraIndices;
}
/**
 * @en All scene related global parameters, it affects all content in the corresponding scene
 * @zh 各类场景级别的渲染参数，将影响全场景的所有物体
 */
export declare class SceneGlobals {
    /**
     * @en The environment lighting configuration
     * @zh 场景的环境光照相关配置
     */
    ambient: AmbientInfo;
    /**
     * @en Scene level shadow related configuration
     * @zh 平面阴影相关配置
     */
    shadows: ShadowsInfo;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _skybox: SkyboxInfo;
    /**
     * @en Global fog configuration
     * @zh 全局雾相关配置
     */
    fog: FogInfo;
    /**
     * @en Skybox related configuration
     * @zh 天空盒相关配置
     */
    get skybox(): SkyboxInfo;
    set skybox(value: SkyboxInfo);
    /**
     * @en Octree related configuration
     * @zh 八叉树相关配置
     */
    octree: OctreeInfo;
    /**
     * @en Octree related configuration
     * @zh 八叉树相关配置
     */
    skin: SkinInfo;
    /**
     * @en Light probe related configuration
     * @zh 光照探针相关配置
     */
    lightProbeInfo: LightProbeInfo;
    /**
     * @en Tone mapping related configuration
     * @zh 色调映射相关配置
     */
    postSettings: PostSettingsInfo;
    /**
     * @en bake with stationary main light
     * @zh 主光源是否以静止状态烘培
     */
    bakedWithStationaryMainLight: boolean;
    /**
     * @en bake lightmap with highp mode
     * @zh 是否使用高精度模式烘培光照图
     */
    bakedWithHighpLightmap: boolean;
    /**
     * @en disable light map
     * @zh 关闭光照图效果
     */
    disableLightmap: boolean;
    /**
     * @en Activate and initialize the global configurations of the scene, no need to invoke manually.
     * @zh 启用和初始化场景全局配置，不需要手动调用
     */
    activate(scene: Scene): void;
}
