import { Vec3 } from '../../core';
import { RenderScene } from '../core/render-scene';
import { Node } from '../../scene-graph';
export declare function ColorTemperatureToRGB(rgb: Vec3, kelvin: number): void;
/**
 * @en The light type enumeration.
 * @zh 光源类型枚举。
 */
export declare enum LightType {
    DIRECTIONAL = 0,
    SPHERE = 1,
    SPOT = 2,
    POINT = 3,
    RANGED_DIRECTIONAL = 4,
    UNKNOWN = 5
}
export declare const nt2lm: (size: number) => number;
/**
 * @en The abstract light class of the render scene
 * @zh 渲染场景中的光源基类
 */
export declare class Light {
    /**
     * @en Whether it's a baked light source, baked light will be ignored in real time lighting pass
     * @zh 是否是烘焙光源，烘焙光源会在实时光照计算中被忽略
     */
    get baked(): boolean;
    set baked(val: boolean);
    /**
     * @en The color of the light
     * @zh 光源的颜色
     */
    set color(color: Vec3);
    get color(): Vec3;
    /**
     * @en Whether to use color temperature
     * @zh 是否使用光源的色温
     */
    set useColorTemperature(enable: boolean);
    get useColorTemperature(): boolean;
    /**
     * @en The color temperature of the light
     * @zh 光源的色温
     */
    set colorTemperature(val: number);
    get colorTemperature(): number;
    /**
     * @en The float RGB value of the color temperature, each channel is from 0 to 1
     * @zh 色温的浮点数颜色值，每个通道都是从 0 到 1
     */
    get colorTemperatureRGB(): Vec3;
    get finalColor(): Readonly<Vec3>;
    /**
     * @en Visibility mask of the light, declaring a set of node layers that will be visible to this light.
     * @zh 光照的可见性掩码，声明在当前光照中可见的节点层级集合。
     * @engineInternal
     */
    set visibility(vis: number);
    get visibility(): number;
    set node(n: Node | null);
    /**
     * @en The node which owns the light source
     * @zh 光源归属的节点
     */
    get node(): Node | null;
    /**
     * @en The type of the light source, e.g. directional light, spot light, etc
     * @zh 光源的类型，比如方向光、聚光灯等
     */
    get type(): LightType;
    /**
     * @en The name of the light source
     * @zh 光源的名字
     */
    get name(): string | null;
    set name(n: string | null);
    /**
     * @en The render scene which owns the current light
     * @zh 光源所属的渲染场景
     */
    get scene(): RenderScene | null;
    protected _baked: boolean;
    protected _color: Vec3;
    protected _colorTemp: number;
    protected _colorTempRGB: Vec3;
    private _finalColor;
    protected _scene: RenderScene | null;
    protected _node: Node | null;
    protected _name: string | null;
    protected _useColorTemperature: boolean;
    protected _type: LightType;
    protected _visibility: number;
    initialize(): void;
    /**
     * @en Attach the light to a render scene
     * @zh 将光源挂载到渲染场景上
     * @param scene @en The render scene @zh 渲染场景
     */
    attachToScene(scene: RenderScene): void;
    /**
     * @en Detach the light from the render scene
     * @zh 将光源从渲染场景上移除
     */
    detachFromScene(): void;
    destroy(): void;
    update(): void;
}
