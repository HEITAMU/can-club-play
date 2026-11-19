import { Texture } from '../../gfx';
import { Camera, Model } from '../../render-scene/scene';
import { ReflectionProbe } from '../../render-scene/scene/reflection-probe';
export declare class ReflectionProbeManager {
    static probeManager: ReflectionProbeManager;
    private _probes;
    /**
     * @en
     * All models in the scene that use cube type reflection probe.
     * @zh
     * 场景中所有使用cube类型反射探针的模型
     */
    private _useCubeModels;
    /**
     * @en
     * All models in the scene that use planar type reflection probe.
     * @zh
     * 场景中所有使用planar类型反射探针的模型
     */
    private _usePlanarModels;
    private _updateForRuntime;
    private _dataTexture;
    private _registeredEvent;
    /**
     * @en Set and get whether to detect objects leaving or entering the reflection probe's bounding box at runtime.
     * @zh 设置和获取是否在运行时检测物体离开或者进入反射探针的包围盒。
     */
    set updateForRuntime(val: boolean);
    get updateForRuntime(): boolean;
    /**
     * @engineInternal
     * @mangle
     */
    registerEvent(): void;
    /**
     * @en Refresh all reflection probe.
     * @zh 刷新所有反射探针。
     */
    onUpdateProbes(): void;
    /**
     * @en filter models that use planar reflection.
     * @zh 筛选使用平面反射的模型
     */
    filterModelsForPlanarReflection(): void;
    /**
     * @engineInternal
     * @mangle
     */
    clearPlanarReflectionMap(probe: ReflectionProbe): void;
    /**
     * @engineInternal
     * @mangle
     */
    register(probe: ReflectionProbe): void;
    /**
     * @engineInternal
     * @mangle
     */
    unregister(probe: ReflectionProbe): void;
    /**
     * @engineInternal
     * @mangle
     */
    exists(probeId: number): boolean;
    /**
     * @engineInternal
     * @mangle
     */
    getNewReflectionProbeId(): number;
    /**
     * @en Get all reflection probes in the scene.
     * @zh 获取场景中所有的反射探针
     */
    getProbes(): ReflectionProbe[];
    /**
     * @en Get reflection probe by id.
     * @zh 根据id获取反射探针
     */
    getProbeById(probeId: number): ReflectionProbe | null;
    /**
     * @engineInternal
     * @mangle
     */
    clearAll(): void;
    /**
     * @engineInternal
     * @mangle
     */
    getProbeByCamera(camera: Camera): ReflectionProbe | null;
    /**
     * @en Update the cubemap captured by the reflection probe.
     * @zh 更新反射探针捕获的cubemap
     * @param probe update the texture for this probe
     */
    updateBakedCubemap(probe: ReflectionProbe): void;
    /**
     * @en Update the plane reflection map for reflection probe render.
     * @zh 更新反射探针渲染的平面反射贴图
     * @param probe update the texture for this probe
     */
    updatePlanarMap(probe: ReflectionProbe, texture: Texture | null): void;
    /**
     * @en Update objects using reflection probe for planar reflection.
     * @zh 更新使用反射探针进行平面反射的物体。
     * @param probe update the model for reflection probe
     * @engineInternal
     * @mangle
     */
    selectPlanarReflectionProbe(model: Model): void;
    /**
     * @en Selecting the appropriate reflection probe for the model, it will use the closest one based on distance.
     * @zh 为模型选择适用的反射探针，会使用距离最近的。
     * @param model select for this model
     */
    selectReflectionProbe(model: Model): void;
    /**
     * @en Update the preview sphere of the Reflection Probe cube mode.
     * @zh 更新反射探针cube模式的预览球
     */
    updatePreviewSphere(probe: ReflectionProbe): void;
    /**
     * @en Update the preview plane of the Reflection Probe planar mode.
     * @zh 更新反射探针预览平面
     */
    updatePreviewPlane(probe: ReflectionProbe): void;
    /**
     * @en Update reflection probe data of model bind.
     * @zh 更新模型绑定的反射探针数据。
     */
    updateProbeData(): void;
    /**
     * @en get max value of probe id.
     * @zh 获取反射探针id的最大值。
     */
    getMaxProbeId(): number;
    /**
     * @en Get the reflection probe used by the model.
     * @zh 获取模型使用的反射探针。
     */
    getUsedReflectionProbe(model: Model, planarReflection: boolean): ReflectionProbe | null | undefined;
    /**
     * @en Set reflection probe used by the model.
     * @zh 手动设置模型使用的反射探针。
     * @param model set the probe for this model
     * @param probe reflection probe to be set
     * @param blendProbe reflection probe for blend
     */
    setReflectionProbe(model: Model, probe: ReflectionProbe, blendProbe?: ReflectionProbe | null): void;
    /**
     * @engineInternal
     * @mangle
     */
    updateProbeOfModels(): void;
    /**
     * @en
     * select the probe with the nearest distance.
     * @zh
     * 选择距离最近的probe。
     * @param model select the probe for this model
     */
    private _getNearestProbe;
    private _getBlendProbe;
    private _getModelsByProbe;
    private _removeDependentModels;
    private _updateCubemapOfModel;
    private _updatePlanarMapOfModel;
    private _isUsedBlending;
    private _updateBlendProbeInfo;
    private _updateBlendCubemap;
    private _calculateBlendWeight;
    private _calculateBlendOfSkybox;
}
