import { Vec4 } from '../../core';
import { AmbientInfo } from '../../scene-graph/scene-globals';
/**
 * @en Ambient lighting representation in the render scene.
 * The initial data is setup in [[SceneGlobals.ambient]].
 * @zh 渲染场景中的环境光照设置。
 * 初始值是由 [[SceneGlobals.ambient]] 设置的。
 */
export declare class Ambient {
    /**
     * @en Default sun illuminance
     * @zh 默认太阳亮度
     */
    static SUN_ILLUM: number;
    /**
     * @en Default sky illuminance
     * @zh 默认天空亮度
     */
    static SKY_ILLUM: number;
    /**
     * @en Enable ambient
     * @zh 是否开启环境光
     */
    set enabled(val: boolean);
    get enabled(): boolean;
    /**
     * @en Sky color
     * @zh 天空颜色
     */
    get skyColor(): Vec4;
    set skyColor(color: Vec4);
    /**
     * @en Sky illuminance
     * @zh 天空亮度
     */
    get skyIllum(): number;
    set skyIllum(illum: number);
    /**
     * @en Ground color
     * @zh 地面颜色
     */
    get groundAlbedo(): Vec4;
    set groundAlbedo(color: Vec4);
    protected _groundAlbedoHDR: Vec4;
    protected _skyColorHDR: Vec4;
    protected _skyIllumHDR: number;
    protected _groundAlbedoLDR: Vec4;
    protected _skyColorLDR: Vec4;
    protected _skyIllumLDR: number;
    protected _mipmapCount: number;
    protected _enabled: boolean;
    initialize(ambientInfo: AmbientInfo): void;
}
