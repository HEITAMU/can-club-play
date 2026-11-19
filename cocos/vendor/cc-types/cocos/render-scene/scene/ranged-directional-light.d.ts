import { Vec3 } from '../../core/math/vec3';
import { Light } from './light';
/**
 * @en Render the abstraction of light in the scene, which is a ranged directional light source in the scene. Non main light source,
 * each scene is allowed to have multiple ranged directional light sources without shadows.
 * @zh 渲染场景中的光的抽象，这是场景中的范围平行光光源。非主光源，每个场景允许有多个范围平行光光源，不包含阴影。
 */
export declare class RangedDirectionalLight extends Light {
    private _dir;
    private _pos;
    private _scale;
    private _right;
    private _illuminanceHDR;
    private _illuminanceLDR;
    /**
     * @en The direction vector of the light
     * @zh 光源的方向
     */
    get direction(): Readonly<Vec3>;
    /**
     * @en The right vector of the light
     * @zh 光源的右方向
     */
    get right(): Readonly<Vec3>;
    /**
     * @en The world position of the light source
     * @zh 光源的世界坐标
     */
    get position(): Readonly<Vec3>;
    /**
     * @en The world scale of the light source
     * @zh 光源的世界缩放
     */
    get scale(): Readonly<Vec3>;
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
    constructor();
    initialize(): void;
    /**
     * @en Update
     * @zh 更新
     */
    update(): void;
}
