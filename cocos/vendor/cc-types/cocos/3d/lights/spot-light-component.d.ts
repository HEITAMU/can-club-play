import { Light } from './light-component';
/**
 * @en The spot light component, multiple spot lights can be added to one scene.
 * @zh 聚光灯光源组件，场景中可以添加多个聚光灯光源。
 */
export declare class SpotLight extends Light {
    private _size;
    private _luminanceHDR;
    private _luminanceLDR;
    private _term;
    private _range;
    private _spotAngle;
    private _angleAttenuationStrength;
    private _shadowEnabled;
    private _shadowPcf;
    private _shadowBias;
    private _shadowNormalBias;
    /**
     * @en Luminous flux of the light.
     * @zh 光通量。
     */
    get luminousFlux(): number;
    set luminousFlux(val: number);
    /**
      * @en Luminance of the light.
      * @zh 光亮度。
      */
    get luminance(): number;
    set luminance(val: number);
    /**
     * @en The photometric term currently being used.
     * @zh 当前使用的光度学计量单位。
     */
    get term(): number;
    set term(val: number);
    /**
     * @en
     * Size of the light.
     * @zh
     * 光源大小。
     */
    get size(): number;
    set size(val: number);
    /**
     * @en
     * Range of the light.
     * @zh
     * 光源范围。
     */
    get range(): number;
    set range(val: number);
    /**
     * @en
     * The spot light cone angle.
     * @zh
     * 聚光灯锥角。
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
     * @en Whether activate shadow
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
    protected _createLight(): void;
}
