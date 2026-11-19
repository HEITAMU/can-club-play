import { geometry, Vec3 } from '../../core';
import { Light } from './light';
/**
 * @en The point light representation in the render scene, it will light up a spherical area in the scene.
 * It doesn't support shadow generation currently.
 * @zh 渲染场景中的点光抽象，可以照亮场景中的一个球形区域，目前还不支持生成阴影。
 */
export declare class PointLight extends Light {
    /**
     * @en The world position of the light source.
     * @zh 光源中心点的世界坐标。
     */
    get position(): Readonly<Vec3>;
    /**
     * @en The lighting range of the light source.
     * @zh 点光源的光照范围。
     */
    set range(range: number);
    get range(): number;
    /**
     * @en The luminance of the light source.
     * @zh 光源的亮度。
     */
    get luminance(): number;
    set luminance(value: number);
    /**
     * @en The luminance of the light source in HDR mode.
     * @zh HDR 模式下光源的亮度。
     */
    get luminanceHDR(): number;
    set luminanceHDR(value: number);
    /**
     * @en The luminance of the light source in LDR mode.
     * @zh LDR 模式下光源的亮度。
     */
    set luminanceLDR(value: number);
    /**
     * @en The AABB bounding box of the lighting area.
     * @zh 受光源影响范围的 AABB 包围盒。
     */
    get aabb(): geometry.AABB;
    private _needUpdate;
    private _range;
    private _luminanceHDR;
    private _luminanceLDR;
    private _pos;
    private _aabb;
    constructor();
    initialize(): void;
    /**
     * @en Update the lighting area.
     * @zh 更新光源影响范围。
     */
    update(): void;
}
