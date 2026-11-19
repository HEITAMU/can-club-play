/// <reference types="./@types/globals" />
import { Component } from '../../scene-graph/component';
import { Color } from '../../core';
import { scene } from '../../render-scene';
import type { LightType } from '../../render-scene/scene';
/**
 * @en The physical term used for light.
 * @zh 光源所使用的物理计量单位。
 */
export declare const PhotometricTerm: {
    LUMINOUS_FLUX: number;
    LUMINANCE: number;
};
/**
 * @en Static light settings.
 * @zh 静态灯光设置
 */
declare class StaticLightSettings {
    protected _baked: boolean;
    protected _editorOnly: boolean;
    protected _castShadow: boolean;
    /**
     * @en Whether the light is editor only.
     * @zh 是否只在编辑器里生效。
     */
    get editorOnly(): boolean;
    set editorOnly(val: boolean);
    /**
     * @en Whether the light is baked
     * @zh 光源是否被烘焙
     */
    get baked(): boolean;
    set baked(val: boolean);
    /**
     * @en Whether the light will cast shadow during baking process.
     * @zh 光源在烘焙时是否投射阴影。
     */
    get castShadow(): boolean;
    set castShadow(val: boolean);
}
export declare namespace Light {
    type Type = EnumAlias<typeof scene.LightType>;
    type PhotometricTerm = EnumAlias<typeof PhotometricTerm>;
}
/**
 * @en The base class of all light components, contains basic light settings for both real time light and baked light.
 * @zh 光源组件基类，包含实时光源和烘焙光源的基本配置信息。
 */
export declare class Light extends Component {
    /**
     * @en The light type enumeration.
     * @zh 光源类型枚举。
     */
    static Type: typeof scene.LightType;
    /**
     * @en The physical term used for light.
     * @zh 光源所使用的物理计量单位。
     */
    static PhotometricTerm: {
        LUMINOUS_FLUX: number;
        LUMINANCE: number;
    };
    protected _color: Color;
    protected _useColorTemperature: boolean;
    protected _colorTemperature: number;
    protected _staticSettings: StaticLightSettings;
    protected _visibility: number;
    protected _type: scene.LightType;
    protected _lightType: typeof scene.Light;
    protected _light: scene.Light | null;
    /**
     * @en The color of the light.
     * @zh 光源颜色。
     */
    get color(): Readonly<Color>;
    set color(val: Readonly<Color>);
    /**
     * @en
     * Whether to enable light color temperature.
     * @zh
     * 是否启用光源色温。
     */
    get useColorTemperature(): boolean;
    set useColorTemperature(enable: boolean);
    /**
     * @en
     * The light color temperature.
     * @zh
     * 光源色温。
     */
    get colorTemperature(): number;
    set colorTemperature(val: number);
    /**
     * @en
     * static light settings.
     * @zh
     * 静态灯光设置。
     */
    get staticSettings(): StaticLightSettings;
    set staticSettings(val: StaticLightSettings);
    /**
     * @en The light type.
     * @zh 光源类型。
     */
    get type(): LightType;
    /**
     * @en Whether the light is baked
     * @zh 光源是否被烘焙
     */
    get baked(): boolean;
    set baked(val: boolean);
    /**
     * @en Visibility mask of the light, declaring a set of node layers that will be visible to this light.
     * @zh 光照的可见性掩码，声明在当前光照中可见的节点层级集合。
     */
    set visibility(vis: number);
    get visibility(): number;
    constructor();
    onLoad(): void;
    onEnable(): void;
    onDisable(): void;
    onDestroy(): void;
    protected _createLight(): void;
    protected _destroyLight(): void;
    protected _attachToScene(): void;
    protected _detachFromScene(): void;
    protected _onUpdateReceiveDirLight(): void;
}
export {};
