import { Vec3 } from '../math';
import { IVec3Like } from '../math/type-define';
/**
 * @en
 * Basic Geometry: Ray.
 * @zh
 * 基础几何：射线。
 */
export declare class Ray {
    /**
     * @en
     * Creates a new ray.
     * @zh
     * 创建一条射线。
     * @param {number} ox @en The x component of start point. @zh 起点的 x 部分。
     * @param {number} oy @en The y component of start point. @zh 起点的 y 部分。
     * @param {number} oz @en The z component of start point. @zh 起点的 z 部分。
     * @param {number} dx @en The x component of direction point. @zh 方向的 x 部分。
     * @param {number} dy @en The y component of direction point. @zh 方向的 y 部分。
     * @param {number} dz @en The z component of direction point. @zh 方向的 z 部分。
     * @returns {Ray} @en The created ray object. @zh 新创建的射线。
     */
    static create(ox?: number, oy?: number, oz?: number, dx?: number, dy?: number, dz?: number): Ray;
    /**
     * @en
     * Creates a new ray initialized with the values from an existing ray.
     * @zh
     * 从一条射线克隆出一条新的射线。
     * @param a @en The Ray object to be cloned from. @zh 克隆的目标。
     * @returns @en The cloned Ray object. @zh 克隆出的新对象。
     */
    static clone(a: Ray): Ray;
    /**
     * @en
     * Copies the values from one ray to another.
     * @zh
     * 复制一个 Ray 的值到另一个 Ray 中。
     * @param out @en The Ray object to copy to. @zh 接受操作的射线。
     * @param a @en The Ray object to copy from. @zh 被复制的射线。
     * @returns @en The Ray object to copy to, same as the `out` parameter. @zh 接受操作的射线，与 `out` 参数相同。
     */
    static copy(out: Ray, a: Ray): Ray;
    /**
     * @en
     * Creates a ray from two points.
     * @zh
     * 用两个点创建一条射线。
     * @param out @en The Ray object. @zh 接受操作的射线。
     * @param origin @en The start point of the ray. @zh 射线的起点。
     * @param target @en The target point on the ray. @zh 射线上的一点。
     * @returns @en The Ray object, same as the `out` parameter. @zh 接受操作的射线，与 `out` 参数相同。
     */
    static fromPoints(out: Ray, origin: Vec3, target: Vec3): Ray;
    /**
     * @en
     * Sets the components of a ray to the given values.
     * @zh
     * 将给定射线的属性设置为给定的值。
     * @param out @en The Ray object to be modified @zh 接受操作的射线。
     * @param ox @en The x component of start point. @zh 起点的 x 部分。
     * @param oy @en The y component of start point. @zh 起点的 y 部分。
     * @param oz @en The z component of start point. @zh 起点的 z 部分。
     * @param dx @en The x component of direction point. @zh 方向的 x 部分。
     * @param dy @en The y component of direction point. @zh 方向的 y 部分。
     * @param dz @en The z component of direction point. @zh 方向的 z 部分。
     * @returns @en The Ray object, same as the `out` parameter. @zh 接受操作的射线，与 `out` 相同。
     */
    static set(out: Ray, ox: number, oy: number, oz: number, dx: number, dy: number, dz: number): Ray;
    /**
     * @en
     * The origin of the ray.
     * @zh
     * 起点。
     */
    o: Vec3;
    /**
     * @en
     * The direction of the ray.
     * @zh
     * 方向。
     */
    d: Vec3;
    /**
     * @en
     * Gets the type of the ray, its value is `ShapeType.SHAPE_RAY`.
     * @zh
     * 获取形状的类型，其值为`ShapeType.SHAPE_RAY`。
     */
    get type(): number;
    protected readonly _type: number;
    /**
     * @en
     * Constructs a ray.
     * @zh
     * 构造一条射线。
     * @param ox @en The x component of start point. @zh 起点的 x 部分。
     * @param oy @en The y component of start point. @zh 起点的 y 部分。
     * @param oz @en The z component of start point. @zh 起点的 z 部分。
     * @param dx @en The x component of direction point. @zh 方向的 x 部分。
     * @param dy @en The y component of direction point. @zh 方向的 y 部分。
     * @param dz @en The z component of direction point. @zh 方向的 z 部分。
     */
    constructor(ox?: number, oy?: number, oz?: number, dx?: number, dy?: number, dz?: number);
    /**
     * @en
     * Calculates a point on the ray with the specific distance from the origin point.
     * @zh
     * 根据给定的距离计算出射线上的一点。
     * @param out @en Another point on the ray. @zh 射线上的另一点。
     * @param distance @en The given distance. @zh 给定的距离。
     */
    computeHit(out: IVec3Like, distance: number): void;
}
