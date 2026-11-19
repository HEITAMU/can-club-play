/// <reference types="./@types/globals" />
import { Texture2D, TextureCube } from '../../asset/assets';
import { Material } from '../../asset/assets/material';
import { Mesh } from '../assets/mesh';
import { Vec4, EventTarget } from '../../core';
import { scene } from '../../render-scene';
import { ModelRenderer } from '../../misc/model-renderer';
import { Texture } from '../../gfx';
import { ReflectionProbeType } from '../reflection-probe/reflection-probe-enum';
import type { Model } from '../../render-scene/scene';
/**
 * @en Shadow projection mode.
 * @zh 阴影投射方式。
 */
declare const ModelShadowCastingMode: {
    /**
     * @en Disable shadow projection.
     * @zh 不投射阴影。
     */
    OFF: number;
    /**
     * @en Enable shadow projection.
     * @zh 开启阴影投射。
     */
    ON: number;
};
/**
 * @en Shadow receive mode.
 * @zh 阴影接收方式。
 */
declare const ModelShadowReceivingMode: {
    /**
     * @en Disable shadow receiving.
     * @zh 不接收阴影。
     */
    OFF: number;
    /**
     * @en Enable shadow receiving.
     * @zh 开启阴影投射。
     */
    ON: number;
};
declare enum ModelBakeSettingsEvent {
    /**
     * @en The event which will be triggered when the useLightProbe is changed.
     * @zh useLightProbe属性修改时触发的事件
     */
    USE_LIGHT_PROBE_CHANGED = "use_light_probe_changed",
    /**
     * @en The event which will be triggered when the reflectionProbe is changed.
     * @zh reflectionProbe 属性修改时触发的事件
     */
    REFLECTION_PROBE_CHANGED = "reflection_probe_changed",
    /**
     * @en The event which will be triggered when the bakeToReflectionProbe is changed.
     * @zh bakeToReflectionProbe 属性修改时触发的事件
     */
    BAKE_TO_REFLECTION_PROBE_CHANGED = "bake_to_reflection_probe_changed"
}
/**
 * @en Model's bake settings.
 * @zh 模型烘焙设置
 */
declare class ModelBakeSettings extends EventTarget {
    /**
     * @en The event which will be triggered when the useLightProbe is changed.
     * @zh useLightProbe属性修改时触发的事件
     */
    static readonly USE_LIGHT_PROBE_CHANGED = ModelBakeSettingsEvent.USE_LIGHT_PROBE_CHANGED;
    /**
     * @en The event which will be triggered when the reflectionProbe is changed.
     * @zh reflectionProbe 属性修改时触发的事件
     */
    static readonly REFLECTION_PROBE_CHANGED = ModelBakeSettingsEvent.REFLECTION_PROBE_CHANGED;
    /**
     * @en The event which will be triggered when the bakeToReflectionProbe is changed.
     * @zh bakeToReflectionProbe 属性修改时触发的事件
     */
    static readonly BAKE_TO_REFLECTION_PROBE_CHANGED = ModelBakeSettingsEvent.BAKE_TO_REFLECTION_PROBE_CHANGED;
    texture: Texture2D | null;
    uvParam: Vec4;
    protected _bakeable: boolean;
    protected _castShadow: boolean;
    protected _receiveShadow: boolean;
    protected _lightmapSize: number;
    protected _useLightProbe: boolean;
    protected _bakeToLightProbe: boolean;
    protected _reflectionProbeType: ReflectionProbeType;
    protected _bakeToReflectionProbe: boolean;
    probeCubemap: TextureCube | null;
    probeBlendCubemap: TextureCube | null;
    probePlanarmap: Texture | null;
    constructor();
    /**
     * @en Whether the model is static and bake-able with light map.
     * Notice: the model's vertex data must have the second UV attribute to enable light map baking.
     * @zh 模型是否是静态的并可以烘培光照贴图。
     * 注意：模型顶点数据必须包含第二套 UV 属性来支持光照贴图烘焙。
     */
    get bakeable(): boolean;
    set bakeable(val: boolean);
    /**
     * @en Whether to cast shadow in light map baking.
     * @zh 在光照贴图烘焙中是否投射阴影。
     */
    get castShadow(): boolean;
    set castShadow(val: boolean);
    /**
     * @en Whether to receive shadow in light map baking.
     * @zh 在光照贴图烘焙中是否接受阴影。
     */
    get receiveShadow(): boolean;
    set receiveShadow(val: boolean);
    /**
     * @en The lightmap size.
     * @zh 光照图大小。
     */
    get lightmapSize(): number;
    set lightmapSize(val: number);
    /**
     * @en Whether to use light probe which provides indirect light to dynamic objects.
     * @zh 模型是否使用光照探针，光照探针为动态物体提供间接光。
     */
    get useLightProbe(): boolean;
    set useLightProbe(val: boolean);
    /**
     * @en Whether the model is used to calculate light probe
     * @zh 模型是否用于计算光照探针
     */
    get bakeToLightProbe(): boolean;
    set bakeToLightProbe(val: boolean);
    /**
     * @en Used to set whether to use the reflection probe or set probe's type.
     * @zh 用于设置是否使用反射探针或者设置反射探针的类型。
     */
    get reflectionProbe(): ReflectionProbeType;
    set reflectionProbe(val: ReflectionProbeType);
    /**
     * @en Whether the model can be render by the reflection probe
     * @zh 模型是否能被反射探针渲染
     */
    get bakeToReflectionProbe(): boolean;
    set bakeToReflectionProbe(val: boolean);
}
/**
 * @en Mesh renderer component for general 3d model rendering, it generates and link to a Model in the render scene.
 * It supports real time lighting and shadow, baked light map, and morph rendering.
 * @zh 用于通用模型渲染的网格渲染器组件，会创建并关联一个渲染场景中的模型对象。
 * 该组件支持实时光照和阴影，预烘焙光照贴图和形变网格渲染。
 */
export declare class MeshRenderer extends ModelRenderer {
    /**
     * @en Shadow projection mode enumeration.
     * @zh 阴影投射方式枚举。
     */
    static ShadowCastingMode: {
        /**
         * @en Disable shadow projection.
         * @zh 不投射阴影。
         */
        OFF: number;
        /**
         * @en Enable shadow projection.
         * @zh 开启阴影投射。
         */
        ON: number;
    };
    /**
     * @en Shadow receive mode enumeration.
     * @zh 阴影接收方式枚举。
     */
    static ShadowReceivingMode: {
        /**
         * @en Disable shadow receiving.
         * @zh 不接收阴影。
         */
        OFF: number;
        /**
         * @en Enable shadow receiving.
         * @zh 开启阴影投射。
         */
        ON: number;
    };
    /**
     * @en The settings for GI baking, it was called lightmapSettings before
     * @zh 全局光照烘焙的配置，以前名称为lightmapSettings
     */
    bakeSettings: ModelBakeSettings;
    protected _mesh: Mesh | null;
    protected _shadowCastingMode: number;
    protected _shadowReceivingMode: number;
    protected _shadowBias: number;
    protected _shadowNormalBias: number;
    protected _reflectionProbeId: number;
    protected _reflectionProbeBlendId: number;
    protected _reflectionProbeBlendWeight: number;
    protected _enabledGlobalStandardSkinObject: boolean;
    protected _reflectionProbeDataMap: Texture2D | null;
    private _subMeshShapesWeights;
    /**
     * @en Local shadow bias for real time lighting.
     * @zh 实时光照下模型局部的阴影偏移。
     */
    get shadowBias(): number;
    set shadowBias(val: number);
    /**
   * @en local shadow normal bias for real time lighting.
   * @zh 实时光照下模型局部的阴影法线偏移。
   */
    get shadowNormalBias(): number;
    set shadowNormalBias(val: number);
    /**
     * @en Shadow projection mode.
     * @zh 实时光照下阴影投射方式。
     */
    get shadowCastingMode(): number;
    set shadowCastingMode(val: number);
    get shadowCastingModeForInspector(): boolean;
    set shadowCastingModeForInspector(val: boolean);
    /**
     * @en Is received direction Light.
     * @zh 是否接收平行光光照。
     * @param visibility @en direction light visibility. @zh 方向光的可见性。
     */
    onUpdateReceiveDirLight(visibility: number, forceClose?: boolean): void;
    /**
     * @en receive shadow.
     * @zh 实时光照下是否接受阴影。
     */
    get receiveShadow(): number;
    set receiveShadow(val: number);
    get receiveShadowForInspector(): boolean;
    set receiveShadowForInspector(val: boolean);
    /**
     * @en Gets or sets the mesh of the model.
     * Note, when set, all morph targets' weights would be reset to zero.
     * @zh 获取或设置模型的网格数据。
     * 注意，设置时，所有形变目标的权重都将归零。
     */
    get mesh(): Mesh | null;
    set mesh(val: Mesh | null);
    /**
     * @en Gets the model in [[RenderScene]].
     * @zh 获取渲染场景 [[RenderScene]] 中对应的模型。
     */
    get model(): Model | null;
    /**
     * @en Whether to enable morph rendering.
     * @zh 是否启用形变网格渲染。
     */
    get enableMorph(): boolean;
    set enableMorph(value: boolean);
    /**
     * @en Set the Separable-SSS skin standard model component.
     * @zh 设置是否是全局的4s标准模型组件
     */
    get isGlobalStandardSkinObject(): boolean;
    set isGlobalStandardSkinObject(val: boolean);
    /**
     * @engineInternal
     * @mangle
     */
    clearGlobalStandardSkinObjectFlag(): void;
    protected _modelType: typeof scene.Model;
    protected _model: scene.Model | null;
    private _morphInstance;
    private _enableMorph;
    constructor();
    onLoad(): void;
    onRestore(): void;
    onEnable(): void;
    onDisable(): void;
    onDestroy(): void;
    onGeometryChanged(): void;
    /**
     * @zh 获取子网格指定形变目标的权重。
     * @en Gets the weight at specified morph target of the specified sub mesh.
     * @param subMeshIndex Index to the sub mesh.
     * @param shapeIndex Index to the morph target of the sub mesh.
     * @returns The weight.
     */
    getWeight(subMeshIndex: number, shapeIndex: number): number;
    /**
     * @zh
     * 设置子网格所有形变目标的权重。
     * `subMeshIndex` 是无效索引或 `weights` 的长度不匹配子网格的形变目标数量时，此方法不会生效。
     * @en
     * Sets weights of each morph target of the specified sub mesh.
     * If takes no effect if `subMeshIndex` is out of bounds or if `weights` has a different length with morph targets count of the sub mesh.
     * @param weights The weights.
     * @param subMeshIndex Index to the sub mesh.
     */
    setWeights(weights: number[], subMeshIndex: number): void;
    /**
     * @zh
     * 设置子网格指定外形的权重。
     * `subMeshIndex` 或 `shapeIndex` 是无效索引时，此方法不会生效。
     * @en
     * Sets the weight at specified shape of specified sub mesh.
     * If takes no effect if
     * `subMeshIndex` or `shapeIndex` out of bounds.
     * @param weight The weight.
     * @param subMeshIndex Index to the sub mesh.
     * @param shapeIndex Index to the shape of the sub mesh.
     */
    setWeight(weight: number, subMeshIndex: number, shapeIndex: number): void;
    setInstancedAttribute(name: string, value: ArrayLike<number>): void;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _updateLightmap(lightmap: Texture2D | null, uOff: number, vOff: number, scale: number, lum: number): void;
    /**
     * @zh
     * 更新反射探针烘焙的cubemap。
     * @en
     * Updat cubemap baked with reflection probes.
     * @param cubeMap baked cubemap.
     * @param useDefaultTexture if the reflection probe has not been baked, is the skybox used instead.
     */
    updateProbeCubemap(cubeMap: TextureCube | null): void;
    /**
     * @zh
     * 更新用于混合的反射探针烘焙的cubemap。
     * @en
     * Updat cubemap baked with reflection probes for blending.
     * @param cubeMap baked cubemap.
     */
    updateProbeBlendCubemap(cubeMap: TextureCube | null): void;
    /**
     * @zh
     * 更新平面反射渲染纹理。
     * @en
     * Update the reflection rendering texture.
     * @param planarMap render texture.
     */
    updateProbePlanarMap(planarMap: Texture | null): void;
    /**
     * @zh
     * 更新反射探针的数据贴图。
     * @en
     * Update the data mapping of the reflection probe.
     * @param dataMap data mapping with data saved all reflection probe data.
     */
    updateReflectionProbeDataMap(dataMap: Texture2D | null): void;
    /**
     * @zh
     * 更新反射探针的id。
     * @en
     * Update the id of the reflection probe.
     * @param probeId probe id.
     */
    updateReflectionProbeId(probeId: number): void;
    /**
     * @zh
     * 更新用于混合的反射探针的id。
     * @en
     * Update the id of the reflection probe used for blending.
     * @param blendProbeId probe id of blend.
     */
    updateReflectionProbeBlendId(blendProbeId: number): void;
    /**
     * @zh
     * 更新混合权重。
     * @en
     * Update blending weight.
     * @param weight blending weight.
     */
    updateReflectionProbeBlendWeight(weight: number): void;
    protected _updateReflectionProbeTexture(): void;
    protected _updateModels(): void;
    protected _updateReceiveDirLight(): void;
    protected _createModel(): void;
    protected _attachToScene(): void;
    /**
     * @engineInternal
     * @mangle
     */
    _detachFromScene(): void;
    protected _updateModelParams(): void;
    protected _onUpdateLightingmap(): void;
    protected _onUpdateLocalShadowBiasAndProbeId(): void;
    protected _onUpdateLocalReflectionProbeData(): void;
    protected _onUpdateReflectionProbeDataMap(): void;
    protected _onMaterialModified(idx: number, material: Material | null): void;
    /**
     * @engineInternal
     */
    _onRebuildPSO(idx: number, material: Material): void;
    protected _onMeshChanged(old: Mesh | null): void;
    protected _clearMaterials(): void;
    protected _getBuiltinMaterial(): Material;
    protected _onVisibilityChange(val: number): void;
    protected _updateShadowBias(): void;
    protected _updateShadowNormalBias(): void;
    protected _updateCastShadow(): void;
    protected _updateReceiveShadow(): void;
    protected onMobilityChanged(): void;
    protected onLightProbeBakingChanged(): void;
    protected onUseLightProbeChanged(): void;
    protected onReflectionProbeChanged(): void;
    protected onBakeToReflectionProbeChanged(): void;
    protected _updateUseLightProbe(): void;
    protected _isBatchingEnabled(): boolean;
    protected _updateUseReflectionProbe(): void;
    protected _updateUseReflectionProbeType(): void;
    protected _updateBakeToReflectionProbe(): void;
    private _watchMorphInMesh;
    private _initSubMeshShapesWeights;
    private _validateShapeWeights;
    private _uploadSubMeshShapesWeights;
    private _updateStandardSkin;
}
export declare namespace MeshRenderer {
    /**
     * @en Shadow projection mode.
     * @zh 阴影投射方式。
     */
    type ShadowCastingMode = EnumAlias<typeof ModelShadowCastingMode>;
    /**
     * @en Shadow receive mode.
     * @zh 阴影接收方式。
     */
    type ShadowReceivingMode = EnumAlias<typeof ModelShadowReceivingMode>;
}
export {};
