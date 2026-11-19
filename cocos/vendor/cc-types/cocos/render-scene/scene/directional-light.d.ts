import { Vec3 } from '../../core';
import { Light } from './light';
/**
 * @en The directional light representation in the render scene, it acts as the main light source in a scene.
 * As main light, only one directional light can be created in a scene, it can generate realtime shadows with configuration.
 * @zh 渲染场景中的方向光抽象，这是场景中的主光源。作为主光源，每个场景只能有一个方向光，它也包含阴影配置，用来生成实时阴影。
 */
export declare class DirectionalLight extends Light {
    protected _dir: Vec3;
    protected _illuminanceHDR: number;
    protected _illuminanceLDR: number;
    protected _shadowEnabled: boolean;
    protected _shadowPcf: number;
    protected _shadowBias: number;
    protected _shadowNormalBias: number;
    protected _shadowSaturation: number;
    protected _shadowDistance: number;
    protected _shadowInvisibleOcclusionRange: number;
    protected _csmLevel: number;
    protected _csmNeedUpdate: boolean;
    protected _csmLayerLambda: number;
    protected _csmOptimizationMode: number;
    protected _csmLayersTransition: boolean;
    protected _csmTransitionRange: number;
    protected _shadowFixedArea: boolean;
    protected _shadowNear: number;
    protected _shadowFar: number;
    protected _shadowOrthoSize: number;
    /**
     * @en The direction vector of the light
     * @zh 光源的方向
     */
    set direction(dir: Vec3);
    get direction(): Vec3;
    /**
     * @en The illuminance of the light in Lux(lx)
     * @zh 光源的辐照度，单位是 Lux(lx)
     */
    get illuminance(): number;
    set illuminance(value: number);
    /**
     * @en The illuminance of the light in HDR mode
     * @zh HDR 模式下光源的辐照度
     */
    get illuminanceHDR(): number;
    set illuminanceHDR(value: number);
    /**
     * @en The illuminance of the light in LDR mode
     * @zh LDR 模式下光源的辐照度
     */
    get illuminanceLDR(): number;
    set illuminanceLDR(value: number);
    /**
     * @en Whether activate shadow
     * @zh 是否启用阴影？
     */
    get shadowEnabled(): boolean;
    set shadowEnabled(val: boolean);
    /**
     * @en get or set shadow pcf.
     * @zh 获取或者设置阴影pcf等级。
     */
    get shadowPcf(): number;
    set shadowPcf(val: number);
    /**
     * @en get or set shadow map sampler offset
     * @zh 获取或者设置阴影纹理偏移值
     */
    get shadowBias(): number;
    set shadowBias(val: number);
    /**
     * @en get or set normal bias.
     * @zh 设置或者获取法线偏移。
     */
    get shadowNormalBias(): number;
    set shadowNormalBias(val: number);
    /**
     * @en Shadow color saturation
     * @zh 阴影颜色饱和度
     */
    get shadowSaturation(): number;
    set shadowSaturation(val: number);
    /**
     * @en get or set shadow camera far
     * @zh 获取或者设置潜在阴影产生的范围
     */
    get shadowDistance(): number;
    set shadowDistance(val: number);
    /**
     * @en get or set shadow camera far
     * @zh 获取或者设置潜在阴影产生的范围
     */
    get shadowInvisibleOcclusionRange(): number;
    set shadowInvisibleOcclusionRange(val: number);
    /**
     * @en get or set shadow CSM level
     * @zh 获取或者设置级联阴影层数
     */
    get csmLevel(): number;
    set csmLevel(val: number);
    /**
     * @en is CSM need update
     * @zh 获取或者设置级联阴影是否需要更新
     */
    get csmNeedUpdate(): boolean;
    set csmNeedUpdate(val: boolean);
    /**
     * @en get or set shadow CSM level ratio
     * @zh 获取或者设置级联阴影层数系数
     */
    get csmLayerLambda(): number;
    set csmLayerLambda(val: number);
    /**
     * @en get or set shadow CSM performance optimization mode
     * @zh 获取或者设置级联阴影性能优化模式
     */
    get csmOptimizationMode(): number;
    set csmOptimizationMode(val: number);
    /**
     * @en get or set fixed area shadow
     * @zh 是否是固定区域阴影
     */
    get shadowFixedArea(): boolean;
    set shadowFixedArea(val: boolean);
    /**
     * @en The near clip plane of the shadow camera
     * @zh 获取或者设置阴影相机近裁剪面
     */
    get shadowNear(): number;
    set shadowNear(val: number);
    /**
     * @en The far clip plane of the shadow camera
     * @zh 获取或者设置阴影相机远裁剪面
     */
    get shadowFar(): number;
    set shadowFar(val: number);
    /**
     * @en get or set shadow camera orthoSize
     * @zh 获取或者设置阴影相机正交大小
     */
    get shadowOrthoSize(): number;
    set shadowOrthoSize(val: number);
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
    initialize(): void;
    /**
     * @en Update the direction
     * @zh 更新方向
     */
    update(): void;
    /**
     * @engineInternal
     * @mangle
     */
    activate(): void;
}
