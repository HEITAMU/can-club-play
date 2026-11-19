import { Mat4, Quat, Vec3 } from '../math';
import { AABB } from './aabb';
/**
 * @en
 * Basic Geometry: Sphere.
 * @zh
 * 基础几何：球。
 */
export declare class Sphere {
    /**
     * @en
     * Creates a new sphere instance.
     * @zh
     * 创建一个新的球实例。
     * @param cx @en The X-Coordinate of the center point relative to the origin.  @zh 相对于原点的中心点的 X 坐标。
     * @param cy @en The Y-Coordinate of the center point relative to the origin.  @zh 相对于原点的中心点的 Y 坐标。
     * @param cz @en The Z-Coordinate of the center point relative to the origin.  @zh 相对于原点的中心点的 Z 坐标。
     * @param r @en The radius of the sphere. @zh 球体的半径
     * @returns @en A new sphere instance. @zh 一个新的球实例。
     */
    static create(cx: number, cy: number, cz: number, r: number): Sphere;
    /**
     * @en
     * Clones a sphere instance.
     * @zh
     * 克隆一个新的球实例。
     * @param p @en The sphere object to clone from. @zh 克隆的目标。
     * @returns @en The sphere object to clone to. @zh 克隆出的实例。
     */
    static clone(p: Sphere): Sphere;
    /**
     * @en
     * Copies the values from one sphere to another.
     * @zh
     * 复制一个球的值到另一个球中。
     * @param out @en The sphere object to copy to. @zh 接受操作的球实例。
     * @param a @en The sphere object to copy from. @zh 被复制的球实例。
     * @returns @en The sphere object to copy to. @zh 接受操作的球实例。
     */
    static copy(out: Sphere, p: Sphere): Sphere;
    /**
     * @en
     * Creates a new sphere instance from two points.
     * @zh
     * 从两个点创建一个新的球实例。
     * @param out - @en The sphere created from the two points. @zh 接受操作的球实例。
     * @param minPos - @en The lower point of the sphere. @zh 球的较小点。
     * @param maxPos - @en The upper point of the sphere. @zh 球的较大点。
     * @returns @en The created sphere, same as the `out` parameter. @zh 接受操作的球实例，与 `out` 参数相同。
     */
    static fromPoints(out: Sphere, minPos: Vec3, maxPos: Vec3): Sphere;
    /**
     * @en
     * Sets the components of a sphere to the given values
     * @zh
     * 将球体的属性设置为给定的值。
     * @param out @en The sphere to set values to. @zh 接受操作的球实例。
     * @param cx @en The X-Coordinate of the center point which relative to the origin.  @zh 相对于原点的中心点的 X 坐标。
     * @param cy @en The Y-Coordinate of the center point which relative to the origin.  @zh 相对于原点的中心点的 Y 坐标。
     * @param cz @en The Z-Coordinate of the center point which relative to the origin.  @zh 相对于原点的中心点的 Z 坐标。
     * @param r @en The radius of the sphere. @zh 要设置的球的半径。
     * @returns @en The sphere to set values to, same as the `out` parameter. @zh 接受操作的实例，与 `out` 相同。
     * @function
     */
    static set(out: Sphere, cx: number, cy: number, cz: number, r: number): Sphere;
    /**
     * @en
     * The center of this sphere.
     * @zh
     * 当前球在本地坐标中的中心点。
     */
    protected _center: Vec3;
    get center(): Vec3;
    set center(val: Vec3);
    private _radius;
    /**
      * @en
      * The radius of this sphere.
      * @zh
      * 当前球的半径。
      */
    get radius(): number;
    set radius(val: number);
    /**
     * @en
     * Gets the type of the shape, always returns `ShapeType.SHAPE_SPHERE`.
     * @zh
     * 获取球的类型，固定返回 `ShapeType.SHAPE_SPHERE`。
     */
    get type(): number;
    protected readonly _type: number;
    /**
     * @en
     * Constructs a sphere instance.
     * @zh
     * 构造一个球。
     * @param cx @en The X-Coordinate of the sphere. @zh 该球的世界坐标的 X 坐标。
     * @param cy @en The Y-Coordinate of the sphere. @zh 该球的世界坐标的 Y 坐标。
     * @param cz @en The Z-Coordinate of the sphere. @zh 该球的世界坐标的 Z 坐标。
     * @param r @en The radius of the sphere. @zh 球的半径。
     */
    constructor(cx?: number, cy?: number, cz?: number, r?: number);
    destroy(): void;
    /**
     * @en
     * Clones a sphere instance.
     * @zh
     * 克隆一个球实例。
     * @returns @en The cloned sphere instance. @zh 克隆的球实例。
     */
    clone(): Sphere;
    /**
     * @en
     * Copies the values from a sphere to the current sphere.
     * @zh
     * 复制一个球的值到当前球实例中。
     * @param a @en The sphere to copy from. @zh 拷贝的目标。
     */
    copy(a: Sphere): Sphere;
    /**
     * @en
     * Gets the bounding points of this sphere.
     * @zh
     * 获取此球体的边界点。
     * @param minPos @en The point with maximum coordinates of the sphere. @zh 当前球实例的最小点。
     * @param maxPos @en The point with minimum coordinates of the sphere. @zh 当前球实例的最大点。
     */
    getBoundary(minPos: Vec3, maxPos: Vec3): void;
    /**
     * @en
     * Transforms this sphere by a 4x4 matrix and RTS and stores to the `out` parameter.
     * @zh
     * 用一个 4x4 矩阵和一组 RTS 变换此球体，并将结果存储在 `out` 参数中。
     * @param m @en The 4x4 transform matrix. @zh 4x4 变换矩阵。
     * @param pos @en The position part of the transform. @zh 变换的位置部分。
     * @param rot @en The rotation part of the transform. @zh 变换的旋转部分。
     * @param scale @en The scale part of the transform. @zh 变换的缩放部分。
     * @param out @en The sphere which the transform will be applied to. @zh 变换的目标。
     */
    transform(m: Mat4, pos: Vec3, rot: Quat, scale: Vec3, out: Sphere): void;
    /**
     * @en
     * Transforms this sphere by a 4x4 matrix and a quaternion, stores the result to the `out` parameter.
     * @zh
     * 使用一个 4x4 矩阵和一个四元数变换此球体，并将结果存储在 `out` 参数中。
     * @param m @en The 4x4 transform matrix. @zh 4x4 变换矩阵。
     * @param rot @en The rotation part of the transform. @zh 变换的旋转部分。
     * @param out @en The sphere which the transform will be applied to. @zh 变换的目标。
     */
    translateAndRotate(m: Mat4, rot: Quat, out: Sphere): void;
    /**
     * @en
     * Scales this sphere and stores the result to the `out` parameter.
     * @zh
     * 对当前球实例进行缩放处理，并将结果存储在 `out` 参数中。
     * @param scale @en The scale value. @zh 缩放值。
     * @param out @en The sphere which the scale will be applied to. @zh 缩放的目标。
     */
    setScale(scale: Vec3, out: Sphere): void;
    /**
     * @en Merges a point to this sphere.
     * @zh 合并一个点到当前球实例中。
     * @param point @en The point to be merged to this sphere. @zh 要合并到当前球实例的点。
     */
    mergePoint(point: Vec3): void;
    /**
     * @en Merges some points to this sphere.
     * @zh 合并一些点到当前球实例中。
     * @param points @en The points to be merged to this sphere. @zh 要合并到当前球实例的点列表。
     */
    mergePoints(points: Vec3[]): void;
    /**
     * @en Merges a AABB to this sphere.
     * @zh 合并一个 AABB 到当前球实例中。
     * @param a @en The AABB instance to be merged to this sphere. @zh 要合并到当前球实例的 AABB 实例。
     */
    mergeAABB(a: AABB): void;
}
