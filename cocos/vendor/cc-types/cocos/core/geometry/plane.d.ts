import { Mat4, Vec3 } from '../math';
/**
 * @en
 * Basic Geometry: Plane.
 * Plane Equation: a*x + b*y + c*z - d = 0.
 * @zh
 * 基础几何：平面。
 * 平面方程: a*x + b*y + c*z - d = 0。
 */
export declare class Plane {
    /**
     * @en
     * Creates a new plane.
     * @zh
     * 创建一个新的平面。
     * @param nx @en The x component of normal vector. @zh 法向量的 x 部分。
     * @param ny @en The y component of normal vector. @zh 法向量的 y 部分。
     * @param nz @en The z component of normal vector. @zh 法向量的 z 部分。
     * @param d  @en The distance between normal vector and the origin. @zh 与原点的距离。
     * @returns @en The created plane object. @zh 新创建的平面。
     */
    static create(nx: number, ny: number, nz: number, d: number): Plane;
    /**
     * @en
     * Clones a new plane.
     * @zh
     * 克隆一个新的平面。
     * @param p @en The Plane object to be cloned from. @zh 克隆的来源平面对象。
     * @returns @en The cloned Plane object @zh 克隆出的平面对象。
     */
    static clone(p: Plane): Plane;
    /**
     * @en
     * Copies the values from one plane to another.
     * @zh
     * 复制一个平面的值到另一个。
     * @param out @en The object to be operated on. @zh 接受操作的对象。
     * @param p @en The source of replication. @zh 复制的来源。
     * @returns @en The object to be operated on. @zh 接受操作的对象。
     */
    static copy(out: Plane, p: Plane): Plane;
    /**
     * @en
     * Creates a plane from three points
     * @zh
     * 用三个点创建一个平面。
     * @param out @en The Plane object to be operated on. @zh 接受操作的对象。
     * @param a @en The point a. @zh 点 a。
     * @param b @en The point b. @zh 点 b。
     * @param c @en The point c. @zh 点 c。
     * @returns @en The Plane object to be operated on, same as `out` parameter. @zh 接受操作的对象，与 `out` 相同。
     */
    static fromPoints(out: Plane, a: Vec3, b: Vec3, c: Vec3): Plane;
    /**
     * @en
     * Sets the components of a plane to the given values.
     * @zh
     * 将给定平面的属性设置为给定值。
     * @param out @en The Plane object to be operated on. @zh 接受操作的对象。
     * @param nx @en The x component of normal vector. @zh 法向量量的 x 部分。
     * @param ny @en The y component of normal vector. @zh 法向量的 y 部分。
     * @param nz @en The z component of normal vector. @zh 法向量的 z 部分。
     * @param d  @en The distance between normal vector and the origin. @zh 与原点的距离。
     * @returns @en The object to be operated on, same as the `out` parameter. @zh 接受操作的对象，与 `out` 参数相同。
     */
    static set(out: Plane, nx: number, ny: number, nz: number, d: number): Plane;
    /**
     * @en
     * Creates plane from normal and point.
     * @zh
     * 用一条法线和一个点创建平面。
     * @param out @en The object to be operated on. @zh 接受操作的对象。
     * @param normal @en The normal of the plane. @zh 平面的法线。
     * @param point @en A point in the plane. @zh 平面上的一点。
     * @returns @en The object to be operated on, same as the `out` parameter. @zh 接受操作的对象，与 `out` 参数相同。
     */
    static fromNormalAndPoint(out: Plane, normal: Vec3, point: Vec3): Plane;
    /**
     * @en
     * Normalizes a plane.
     * @zh
     * 归一化一个平面。
     * @param out @en The object to be operated on. @zh 接受操作的对象。
     * @param a @en Source data for the operation. @zh 操作的源数据。
     * @returns @en The object to be operated on, sames as the `out` parameter. @zh 接受操作的对象，与 `out` 相同。
     */
    static normalize(out: Plane, a: Plane): Plane;
    /**
     * @en
     * The normal of the plane.
     * @zh
     * 法线向量。
     */
    n: Vec3;
    /**
     * @en
     * The distance from the origin to the plane.
     * @zh
     * 原点到平面的距离。
     */
    d: number;
    /**
     * @en
     * Gets the type of the Plane, its value is `ShapeType.SHAPE_PLANE`.
     * @zh
     * 获取形状的类型，值为 `ShapeType.SHAPE_PLANE`。
     */
    get type(): number;
    set x(val: number);
    get x(): number;
    set y(val: number);
    get y(): number;
    set z(val: number);
    get z(): number;
    set w(val: number);
    get w(): number;
    protected readonly _type: number;
    /**
     * @en
     * Constructs a plane.
     * @zh
     * 构造一个平面。
     * @param nx @en The x component of normal vector. @zh 法向量的 x 部分。
     * @param ny @en The y component of normal vector. @zh 法向量的 y 部分。
     * @param nz @en The z component of normal vector. @zh 法向量的 z 部分。
     * @param d @en The distance between normal vector and the origin. @zh 与原点的距离。
     */
    constructor(nx?: number, ny?: number, nz?: number, d?: number);
    /**
     * @en
     * Transforms this plane by a 4x4 matrix.
     * @zh
     * 使用一个 4x4 矩阵变换此平面。
     * @param mat @en The 4x4 matrix for transformation @zh 用于变换的 4x4 矩阵。
     */
    transform(mat: Mat4): void;
}
