import { Material } from '../../asset/assets/material';
import { Color, Mat4, Vec3, Vec2, geometry } from '../../core';
import type { ShadowsInfo } from '../../scene-graph/scene-globals';
import { IMacroPatch } from '../core/pass';
import { Shader } from '../../gfx';
/**
 * @zh 阴影贴图分辨率。
 * @en The shadow map size.
 * @static
 * @enum Shadows.ShadowSize
 */
export declare const ShadowSize: {
    /**
     * @zh 分辨率 256 * 256。
     * @en shadow resolution 256 * 256.
     * @readonly
     */
    Low_256x256: number;
    /**
     * @zh 分辨率 512 * 512。
     * @en shadow resolution 512 * 512.
     * @readonly
     */
    Medium_512x512: number;
    /**
     * @zh 分辨率 1024 * 1024。
     * @en shadow resolution 1024 * 1024.
     * @readonly
     */
    High_1024x1024: number;
    /**
     * @zh 分辨率 2048 * 2048。
     * @en shadow resolution 2048 * 2048.
     * @readonly
     */
    Ultra_2048x2048: number;
};
/**
 * @zh 阴影类型。
 * @en The shadow type
 * @enum Shadows.ShadowType
 */
export declare const ShadowType: {
    /**
     * @zh 平面阴影。
     * @en Planar shadow
     * @property Planar
     * @readonly
     */
    Planar: number;
    /**
     * @zh 阴影贴图。
     * @en Shadow type
     * @property ShadowMap
     * @readonly
     */
    ShadowMap: number;
};
/**
 * @zh pcf阴影等级。
 * @en The pcf type
 * @static
 * @enum Shadows.PCFType
 */
export declare const PCFType: {
    /**
     * @zh x1 次采样
     * @en x1 times
     * @readonly
     */
    HARD: number;
    /**
     * @zh x4 次采样
     * @en x4 times
     * @readonly
     */
    SOFT: number;
    /**
     * @zh x9 次采样
     * @en x9 times
     * @readonly
     */
    SOFT_2X: number;
    /**
     * @zh x16 次采样
     * @en x16 times
     * @readonly
     */
    SOFT_4X: number;
};
/**
 * @zh 级联阴影贴图层级。
 * @en The CSM shadow level
 * @enum Shadows.CSMLevel
 */
export declare const CSMLevel: {
    /**
     * @zh 1 个层级
     * @en level 1
     * @readonly
     */
    LEVEL_1: number;
    /**
     * @zh 2 个层级
     * @en level 2
     * @readonly
     */
    LEVEL_2: number;
    /**
     * @zh 3 个层级
     * @en level 3
     * @readonly
     */
    LEVEL_3: number;
    /**
     * @zh 4 个层级
     * @en level 4
     * @readonly
     */
    LEVEL_4: number;
};
/**
 * @zh 级联阴影性能优化模式。
 * @en The CSM performance optimization mode
 * @enum Shadows.CSMOptimizationMode
 */
export declare const CSMOptimizationMode: {
    /**
     * @zh 没有性能优化
     * @en has no performance optimization
     * @readonly
     */
    NONE: number;
    /**
     * @zh 剔除层与层之间重复物体
     * @en Eliminate duplicate objects between layers
     * @readonly
     */
    RemoveDuplicates: number;
    /**
      * @zh 取消稳抖
      * @en Disable rotation fix
      * @readonly
      */
    DisableRotationFix: number;
};
/**
 * @en The global shadow's configuration of the render scene
 * @zh 渲染场景的全局阴影配置
 */
export declare class Shadows {
    /**
     * @en MAX_FAR. This is shadow camera max far.
     * @zh 阴影相机的最远视距。
     */
    static readonly MAX_FAR: number;
    /**
     * @en EXPANSION_RATIO. This is shadow boundingBox Coefficient of expansion.
     * @zh 阴影包围盒扩大系数。
     */
    static readonly COEFFICIENT_OF_EXPANSION: number;
    /**
     * @en Whether activate planar shadow.
     * @zh 是否启用平面阴影？
     */
    get enabled(): boolean;
    set enabled(val: boolean);
    /**
     * @en Shadow type.
     * @zh 阴影类型。
     */
    get type(): number;
    set type(val: number);
    /**
     * @en The normal of the plane which receives shadow.
     * @zh 阴影接收平面的法线。
     */
    get normal(): Vec3;
    set normal(val: Vec3);
    /**
     * @en The distance from coordinate origin to the receiving plane.
     * @zh 阴影接收平面与原点的距离。
     */
    get distance(): number;
    set distance(val: number);
    /**
     * @en Positional offset values in planar shading calculations.
     * @zh 平面阴影计算中的位置偏移值。
     */
    get planeBias(): number;
    set planeBias(val: number);
    /**
     * @en Shadow color.
     * @zh 阴影颜色。
     */
    get shadowColor(): Color;
    set shadowColor(color: Color);
    /**
     * @en get or set shadow camera orthoSize.
     * @zh 获取或者设置阴影纹理大小。
     */
    get size(): Vec2;
    set size(val: Vec2);
    /**
     * @en shadow Map size has been modified.
     * @zh 阴影贴图大小是否被修改。
     */
    get shadowMapDirty(): boolean;
    set shadowMapDirty(val: boolean);
    /**
     * @en The transform matrix of the light source
     * @zh 光源的变换矩阵
     */
    get matLight(): Mat4;
    get material(): Material;
    get instancingMaterial(): Material;
    /**
     * @en The bounding sphere of the shadow map.
     * @zh 用于计算固定区域阴影 Shadow map 的场景包围球.
     */
    fixedSphere: geometry.Sphere;
    /**
     * @en get or set shadow max received.
     * @zh 阴影接收的最大灯光数量。
     */
    maxReceived: number;
    protected _matLight: Mat4;
    protected _material: Material | null;
    protected _instancingMaterial: Material | null;
    protected _enabled: boolean;
    protected _type: number;
    protected _distance: number;
    protected _planeBias: number;
    protected _normal: Vec3;
    protected _shadowColor: Color;
    protected _size: Vec2;
    protected _shadowMapDirty: boolean;
    /**
     * @en Get the shader for the planar shadow with macro patches
     * @zh 通过指定宏获取平面阴影的 Shader 对象
     * @param patches The macro patches for the shader
     * @returns The shader for the planar shadow
     */
    getPlanarShader(patches: Readonly<IMacroPatch[] | null>): Shader | null;
    initialize(shadowsInfo: ShadowsInfo): void;
    activate(): void;
    protected _updatePlanarInfo(): void;
    destroy(): void;
}
