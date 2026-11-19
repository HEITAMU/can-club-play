import { Light } from './light-component';
/**
 * @en The directional light component, only one real time directional light is permitted in one scene, it act as the main light of the scene.
 * @zh 平行光源组件，一个场景只允许存在一个实时的平行光源，作为场景的主光源存在。
 */
export declare class DirectionalLight extends Light {
    private _illuminanceHDR;
    private _illuminanceLDR;
    private _shadowEnabled;
    private _shadowPcf;
    private _shadowBias;
    private _shadowNormalBias;
    private _shadowSaturation;
    private _shadowDistance;
    private _shadowInvisibleOcclusionRange;
    private _csmLevel;
    private _csmLayerLambda;
    private _csmOptimizationMode;
    private _csmAdvancedOptions;
    private _csmLayersTransition;
    private _csmTransitionRange;
    private _shadowFixedArea;
    private _shadowNear;
    private _shadowFar;
    private _shadowOrthoSize;
    /**
     * @en The light source intensity.
     * @zh 光源强度。
     */
    get illuminance(): number;
    set illuminance(val: number);
    /**
     * @en Whether activate real time shadow.
     * @zh 是否启用实时阴影？
     */
    get shadowEnabled(): boolean;
    set shadowEnabled(val: boolean);
    /**
     * @en The shadow pcf for real time shadow.
     * @zh 实时阴影计算中的阴影 pcf 等级。
     */
    get shadowPcf(): number;
    set shadowPcf(val: number);
    /**
     * @en The shadow map sampler offset for real time shadow.
     * @zh 实时阴影计算中的阴影纹理偏移值。
     */
    get shadowBias(): number;
    set shadowBias(val: number);
    /**
     * @en The global normal bias for real time shadow.
     * @zh 实时阴影计算中的法线偏移。
     */
    get shadowNormalBias(): number;
    set shadowNormalBias(val: number);
    /**
     * @en The shadow color saturation for real time shadow.
     * @zh 实时阴影计算中的阴影颜色饱和度。
     */
    get shadowSaturation(): number;
    set shadowSaturation(val: number);
    /**
     * @en The potential shadow distance from the camera for real time shadow.
     * @zh 实时阴影计算中潜在阴影产生的范围
     */
    get shadowDistance(): number;
    set shadowDistance(val: number);
    /**
     * @en The occlusion range for real time shadow.
     * @zh 实时阴影计算中剔除阴影的范围
    */
    get shadowInvisibleOcclusionRange(): number;
    set shadowInvisibleOcclusionRange(val: number);
    /**
     * @en get or set shadow CSM level
     * @zh 获取或者设置阴影层级
     */
    get csmLevel(): number;
    set csmLevel(val: number);
    /**
     * @en enable csm
     * @zh 开启或关闭 csm 模式
     */
    get enableCSM(): boolean;
    set enableCSM(val: boolean);
    /**
     * @en get or set shadow CSM level ratio
     * @zh 获取或者设置阴影层级系数
     */
    get csmLayerLambda(): number;
    set csmLayerLambda(val: number);
    /**
     * @en get or set shadow CSM performance optimization mode
     * @zh 获取或者设置级联阴影性能优化模式
     * @internal
     */
    get csmOptimizationMode(): number;
    set csmOptimizationMode(val: number);
    /**
     * @en Whether to use fixed area shadow in real time shadow.
     * @zh 实时阴影计算中是否使用固定区域阴影。
     */
    get shadowFixedArea(): boolean;
    set shadowFixedArea(val: boolean);
    /**
     * @en The near clip plane of the shadow camera for fixed area shadow
     * @zh 固定区域阴影设置中阴影相机近裁剪面
     */
    get shadowNear(): number;
    set shadowNear(val: number);
    /**
     * @en The far clip plane of the shadow camera for fixed area shadow.
     * @zh 固定区域阴影设置中阴影相机远裁剪面。
     */
    get shadowFar(): number;
    set shadowFar(val: number);
    /**
     * @en The orthogonal size of the shadow camera for fixed area shadow.
     * @zh 固定区域阴影设置中阴影相机的正交尺寸
     */
    get shadowOrthoSize(): number;
    set shadowOrthoSize(val: number);
    /**
     * @en Enabled shadow advanced options
     * @zh 是否启用高级选项？
     */
    get csmAdvancedOptions(): boolean;
    set csmAdvancedOptions(val: boolean);
    /**
     * @en Enabled csm layers transition
     * @zh 是否启用级联阴影层级过渡？
     */
    get csmLayersTransition(): boolean;
    set csmLayersTransition(val: boolean);
    /**
     * @en get or set csm layers transition range
     * @zh 获取或者设置级联阴影层级过渡范围？
     */
    get csmTransitionRange(): number;
    set csmTransitionRange(val: number);
    constructor();
    protected _createLight(): void;
    protected _onUpdateReceiveDirLight(): void;
}
