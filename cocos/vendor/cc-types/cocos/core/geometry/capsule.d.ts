import { Vec3, Quat, Mat4 } from '../math';
import { IVec3Like, IQuatLike } from '../math/type-define';
/**
 * @en
 * Basic Geometry: capsule.
 * @zh
 * 基础几何，胶囊体。
 */
export declare class Capsule {
    /**
     * @en
     * Gets the type of this Capsule, always returns `ShapeType.SHAPE_CAPSULE`.
     * @zh
     * 获取此形状的类型，值固定为 `ShapeType.SHAPE_CAPSULE`。
     */
    get type(): number;
    protected readonly _type: number;
    /**
     * @en
     * The radius of the sphere in this capsule.
     * @zh
     * 胶囊体球部的半径。
     */
    radius: number;
    /**
     * @en
     * The distance between the center point of the capsule and the center of the sphere.
     * @zh
     * 胶囊体中心点和球部圆心的距离。
     */
    halfHeight: number;
    /**
     * @en
     * The local orientation of this capsule [0,1,2] => [x,y,z].
     * @zh
     * 胶囊体的本地朝向，映射关系 [0,1,2] => [x,y,z]。
     */
    axis: number;
    /**
     * @en
     * The origin of the capsule.
     * @zh
     * 胶囊体的原点。
     */
    readonly center: Vec3;
    /**
     * @en
     * The rotation of the capsule.
     * @zh
     * 胶囊体的旋转。
     */
    readonly rotation: Quat;
    /**
     * @internal
     * cache, local center of ellipse
     **/
    readonly ellipseCenter0: Vec3;
    /**
     * @internal
     */
    readonly ellipseCenter1: Vec3;
    /**
     * @en
     * Constructs a Capsule instance.
     * @zh
     * 构造一个胶囊体实例。
     * @param radius @en The radius of the sphere in this capsule. @zh 胶囊体球部的半径。
     * @param halfHeight @en The distance between the center point of the capsule and the center of the sphere. @zh 胶囊体中心点和球部圆心的距离。
     * @param axis @en The local orientation of this capsule [0,1,2] => [x,y,z]. @zh 胶囊体的本地朝向，映射关系 [0,1,2] => [x,y,z]。
     */
    constructor(radius?: number, halfHeight?: number, axis?: number);
    /**
     * @en
     * Transforms this capsule by a 4x4 matrix and RTS.
     * @zh
     * 使用 4x4 矩阵和 RTS 变换此胶囊体。
     */
    transform(m: Mat4, pos: IVec3Like, rot: IQuatLike, scale: IVec3Like, out: Capsule): void;
    /**
     * @en
     * Updates the cache.
     * @zh
     * 更新缓存。
     */
    updateCache(): void;
    /**
     * @en
     * Updates the center points.
     * @zh
     * 更新中心点信息。
     */
    updateLocalCenter(): void;
}
