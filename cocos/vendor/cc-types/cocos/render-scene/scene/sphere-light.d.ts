import { Vec3, geometry } from '../../core';
import { Light } from './light';
/**
 * @en The sphere light representation in the render scene, it will light up a spherical area in the scene.
 * It doesn't support shadow generation currently.
 * @zh 渲染场景中的球面光抽象，可以照亮场景中的一个球形区域，目前还不支持生成阴影。
 */
export declare class SphereLight extends Light {
    /**
     * @en The world position of the light source
     * @zh 光源中心点的世界坐标
     */
    get position(): Vec3;
    /**
     * @en The size of the light source
     * @zh 球面光源的尺寸
     */
    set size(size: number);
    get size(): number;
    /**
     * @en The lighting range of the light source
     * @zh 球面光源的光照范围
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
    set luminanceLDR(value: number);
    /**
     * @en The AABB bounding box of the lighting area
     * @zh 受光源影响范围的 AABB 包围盒
     */
    get aabb(): geometry.AABB;
    protected _needUpdate: boolean;
    protected _size: number;
    protected _range: number;
    protected _luminanceHDR: number;
    protected _luminanceLDR: number;
    protected _pos: Vec3;
    protected _aabb: geometry.AABB;
    constructor();
    initialize(): void;
    /**
     * @en Update the lighting area
     * @zh 更新光源影响范围
     */
    update(): void;
}
