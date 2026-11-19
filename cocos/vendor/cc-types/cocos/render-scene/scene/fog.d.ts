import { Color, Vec4 } from '../../core';
import { FogInfo } from '../../scene-graph/scene-globals';
/**
 * @zh
 * 全局雾类型。
 * @en
 * The global fog type
 * @static
 * @enum FogInfo.FogType
 */
export declare const FogType: {
    /**
     * @zh
     * 线性雾。
     * @en
     * Linear fog
     * @readonly
     */
    LINEAR: number;
    /**
     * @zh
     * 指数雾。
     * @en
     * Exponential fog
     * @readonly
     */
    EXP: number;
    /**
     * @zh
     * 指数平方雾。
     * @en
     * Exponential square fog
     * @readonly
     */
    EXP_SQUARED: number;
    /**
     * @zh
     * 层叠雾。
     * @en
     * Layered fog
     * @readonly
     */
    LAYERED: number;
};
export declare const FOG_TYPE_NONE: number;
/**
 * @en The fog representation in the render scene.
 * @zh 渲染场景中的全局雾效配置
 */
export declare class Fog {
    constructor();
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
    get fogColor(): Color;
    /**
     * @zh 当前雾化类型。
     * @en The current global fog type.
     * @returns {FogType}
     * Returns the current global fog type
     * - -1:Disable global Fog
     * - 0:Linear fog
     * - 1:Exponential fog
     * - 2:Exponential square fog
     * - 3:Layered fog
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
     * @zh 雾效起始位置，只适用于线性雾
     * @en Global fog start position, only for linear fog
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
    get colorArray(): Readonly<Vec4>;
    protected _fogColor: Color;
    protected _colorArray: Vec4;
    protected _enabled: boolean;
    protected _accurate: boolean;
    protected _type: number;
    protected _fogDensity: number;
    protected _fogStart: number;
    protected _fogEnd: number;
    protected _fogAtten: number;
    protected _fogTop: number;
    protected _fogRange: number;
    protected _activated: boolean;
    initialize(fogInfo: FogInfo): void;
    activate(): void;
    protected _updatePipeline(): void;
}
