import { Vec3, geometry } from '../../core';
import type { Frustum } from '../../core/geometry';
import { Light } from './light';
/**
 * @en The spot light representation in the render scene, it will light up a cone area in the direction of the light, it supports shadow generation.
 * @zh 渲染场景中的聚光灯抽象，可以照亮光源方向上的一个锥形区域，支持生成阴影。
 */
export declare class SpotLight extends Light {
    protected _dir: Vec3;
    protected _range: number;
    protected _spotAngle: number;
    protected _angleAttenuationStrength: number;
    protected _pos: Vec3;
    protected _aabb: geometry.AABB;
    protected _frustum: geometry.Frustum;
    /**
     * @en User-specified full-angle radians.
     * @zh 用户指定的全角弧度。
     */
    protected _angle: number;
    protected _needUpdate: boolean;
    protected _size: number;
    protected _luminanceHDR: number;
    protected _luminanceLDR: number;
    protected _shadowEnabled: boolean;
    protected _shadowPcf: number;
    protected _shadowBias: number;
    protected _shadowNormalBias: number;
    /**
     * @en The world position of the light source
     * @zh 光源的世界坐标
     */
    get position(): Vec3;
    /**
     * @en The size of the spot light source
     * @zh 聚光灯的光源尺寸
     */
    set size(size: number);
    get size(): number;
    /**
     * @en The lighting range of the spot light
     * @zh 聚光灯的光照范围
     */
    set range(range: number);
    get range(): number;
    /**
     * @en The luminance of the light source
     * @zh 光源的亮度
     */
    get luminance(): number;
    set luminance(value: number);
    /**
     * @en The luminance of the light source in HDR mode
     * @zh HDR 模式下光源的亮度
     */
    get luminanceHDR(): number;
    set luminanceHDR(value: number);
    /**
     * @en The luminance of the light source in LDR mode
     * @zh LDR 模式下光源的亮度
     */
    get luminanceLDR(): number;
    set luminanceLDR(value: number);
    /**
     * @en The direction of the spot light
     * @zh 聚光灯的照明方向
     */
    get direction(): Vec3;
    /**
     * @en The setter will take the value as the cone angle,
     * but the getter will give you the cosine value of the half cone angle: `cos(angle / 2)`.
     * As the in-consistence is not acceptable for a property, please do not use it.
     * @zh 赋值时这个属性会把输入值当做聚光灯光照区域的锥角，但是获取时返回的是 cos(angle / 2)。
     * 由于这种不一致性，请不要使用这个属性。
     * @internal
     */
    get spotAngle(): number;
    set spotAngle(val: number);
    /**
     * @en The angle attenuation strength of the spot light.
     * The larger the value, the softer the edge, and the smaller the value, the harder the edge.
     * @zh 聚光灯角度衰减强度。值越大，边缘越柔和，值越小，边缘越硬。
     */
    get angleAttenuationStrength(): number;
    set angleAttenuationStrength(val: number);
    /**
     * @en The cone angle of the lighting area
     * @zh 聚光灯锥角
     */
    get angle(): number;
    get aabb(): geometry.AABB;
    /**
     * @en The frustum of the lighting area
     * @zh 受光源影响范围的截椎体
     */
    get frustum(): Frustum;
    /**
     * @en Whether shadow casting is enabled
     * @zh 是否启用阴影？
     */
    get shadowEnabled(): boolean;
    set shadowEnabled(val: boolean);
    /**
     * @en The pcf level of the shadow generation.
     * @zh 获取或者设置阴影 pcf 等级。
     */
    get shadowPcf(): number;
    set shadowPcf(val: number);
    /**
     * @en The depth offset of shadow to avoid moire pattern artifacts
     * @zh 阴影的深度偏移, 可以减弱跨像素导致的条纹状失真
     */
    get shadowBias(): number;
    set shadowBias(val: number);
    /**
      * @en The normal bias of the shadow map.
      * @zh 设置或者获取法线偏移。
      */
    get shadowNormalBias(): number;
    set shadowNormalBias(val: number);
    constructor();
    initialize(): void;
    update(): void;
}
