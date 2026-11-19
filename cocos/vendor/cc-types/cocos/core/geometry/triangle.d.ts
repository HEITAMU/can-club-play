import { Vec3 } from '../math';
/**
 * @en
 * Basic Geometry: Triangle.
 * @zh
 * 基础几何：三角形。
 */
export declare class Triangle {
    /**
     * @en
     * Creates a new triangle instance.
     * @zh
     * 创建一个新的三角形。
     * @param ax @en The x component of point a @zh a 点的 x 部分。
     * @param ay @en The y component of point a @zh a 点的 y 部分。
     * @param az @en The z component of point a @zh a 点的 z 部分。
     * @param bx @en The x component of point b @zh b 点的 x 部分。
     * @param by @en The y component of point b @zh b 点的 y 部分。
     * @param bz @en The z component of point b @zh b 点的 z 部分。
     * @param cx @en The x component of point c @zh c 点的 x 部分。
     * @param cy @en The y component of point c @zh c 点的 y 部分。
     * @param cz @en The z component of point c @zh c 点的 z 部分。
     * @returns @en The created Triangle instance. @zh 创建出的三角形实例。
     */
    static create(ax?: number, ay?: number, az?: number, bx?: number, by?: number, bz?: number, cx?: number, cy?: number, cz?: number): Triangle;
    /**
     * @en
     * Clones a triangle instance.
     * @zh
     * 克隆一个新的三角形。
     * @param t @en The Triangle object to be cloned from. @zh 克隆的目标。
     * @returns @en The cloned triangle instance. @zh 克隆出的新对象。
     */
    static clone(t: Triangle): Triangle;
    /**
     * @en
     * Copies the values from one triangle to another.
     * @zh
     * 复制一个三角形的值到另一个三角形中。
     * @param out @en The target Triangle object to be copied to. @zh 接受操作的三角形。
     * @param t @en A Triangle object to be copied from. @zh 被复制的三角形。
     * @returns @en The target Triangle object to be copied to, same as the `out` parameter. @zh 接受操作的三角形，与 `out` 参数相同。
     */
    static copy(out: Triangle, t: Triangle): Triangle;
    /**
     * @en
     * Creates a triangle instance from three points.
     * @zh
     * 用三个点创建一个三角形。
     * @param out @en The Triangle object to be modified. @zh 接受操作的三角形。
     * @param a @en The point value to set out.a. @zh a 点。
     * @param b @en The point value to set out.b. @zh b 点。
     * @param c @en The point value to set out.c. @zh c 点。
     * @returns @en The Triangle object to be modified， same as the `out` parameter. @zh 接受操作的三角形，与 `out` 参数相同。
     */
    static fromPoints(out: Triangle, a: Vec3, b: Vec3, c: Vec3): Triangle;
    /**
     * @en
     * Sets the components of a triangle to the given values.
     * @zh
     * 将给定三角形的属性设置为给定值。
     * @param out @en The Triangle object to be set. @zh 接受操作的三角形。
     * @param ax @en The value to set out.a.x. @zh a 点的 x 部分。
     * @param ay @en The value to set out.a.y. @zh a 点的 y 部分。
     * @param az @en The value to set out.a.z. @zh a 点的 z 部分。
     * @param bx @en The value to set out.b.x. @zh b 点的 x 部分。
     * @param by @en The value to set out.b.y. @zh b 点的 y 部分。
     * @param bz @en The value to set out.b.z. @zh b 点的 z 部分。
     * @param cx @en The value to set out.c.x. @zh c 点的 x 部分。
     * @param cy @en The value to set out.c.y. @zh c 点的 y 部分。
     * @param cz @en The value to set out.c.z. @zh c 点的 z 部分。
     * @returns @en The Triangle object to be set, same as the `out` parameter. @zh 接受操作的三角形，与 `out` 参数相同。
     */
    static set(out: Triangle, ax: number, ay: number, az: number, bx: number, by: number, bz: number, cx: number, cy: number, cz: number): Triangle;
    /**
     * @en
     * Point a.
     * @zh
     * 点 a。
     */
    a: Vec3;
    /**
     * @en
     * Point b.
     * @zh
     * 点 b。
     */
    b: Vec3;
    /**
     * @en
     * Point c.
     * @zh
     * 点 c。
     */
    c: Vec3;
    /**
     * @en
     * Gets the type of the triangle, always returns `ShapeType.SHAPE_TRIANGLE`.
     * @zh
     * 获取此三角形的类型，固定返回 `ShapeType.SHAPE_TRIANGLE`。
     */
    get type(): number;
    protected readonly _type: number;
    /**
     * @en
     * Constructs a triangle.
     * @zh
     * 构造一个三角形。
     * @param ax @en x component of point a. @zh a 点的 x 部分。
     * @param ay @en y component of point a. @zh a 点的 y 部分。
     * @param az @en z component of point a. @zh a 点的 z 部分。
     * @param bx @en x component of point b. @zh b 点的 x 部分。
     * @param by @en y component of point b. @zh b 点的 y 部分。
     * @param bz @en z component of point b. @zh b 点的 z 部分。
     * @param cx @en x component of point c. @zh c 点的 x 部分。
     * @param cy @en y component of point c. @zh c 点的 y 部分。
     * @param cz @en z component of point c. @zh c 点的 z 部分。
     */
    constructor(ax?: number, ay?: number, az?: number, bx?: number, by?: number, bz?: number, cx?: number, cy?: number, cz?: number);
}
