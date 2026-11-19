import { Vec3 } from '../math';
/**
 * @en
 * Basic Geometry: Line.
 * @zh
 * 基础几何：直线。
 */
export declare class Line {
    /**
     * @en
     * Creates a new line.
     * @zh
     * 创建一条新的直线。
     * @param sx @en The x coordinate of the start position. @zh 起点的 x 坐标。
     * @param sy @en The y coordinate of the start position. @zh 起点的 y 坐标。
     * @param sz @en The z coordinate of the start position. @zh 起点的 z 坐标。
     * @param ex @en The x coordinate of the end position. @zh 终点的 x 坐标。
     * @param ey @en The y coordinate of the end position. @zh 终点的 y 坐标。
     * @param ez @en the z coordinate of the end position. @zh 终点的 z 坐标。
     * @returns @en The created line. @zh 创建的直线。
     */
    static create(sx: number, sy: number, sz: number, ex: number, ey: number, ez: number): Line;
    /**
     * @en
     * Creates a new Line initialized with values from an existing Line.
     * @zh
     * 克隆一条新的直线。
     * @param a @en The line to clone from. @zh 克隆的来源 Line 对象。
     * @returns @en The cloned line. @zh 克隆出的新 Line 对象。
     */
    static clone(a: Line): Line;
    /**
     * @en
     * Copies the values from one Line to another.
     * @zh
     * 复制一条直线的值到另一条直线中。
     * @param out @en The output line to store the copied data. @zh 用来存储拷贝数据的 Line 对象。
     * @param a @en The line to copy from. @zh 从这个 Line 对象拷贝信息。
     * @returns @en The `out` parameter. @zh 传入的 `out` 对象。
     */
    static copy(out: Line, a: Line): Line;
    /**
     * @en
     * Creates a line from two points.
     * @zh
     * 用两个点创建一条直线。
     * @param out @en The output line. @zh 接受新数据的 Line 对象。
     * @param start @en The start point. @zh 起点。
     * @param end @en The end point. @zh 终点。
     * @returns @en The `out` parameter. @zh 传入的 out 对象。
     */
    static fromPoints(out: Line, start: Vec3, end: Vec3): Line;
    /**
     * @en
     * Sets the start point and the end point of a line with the given values.
     * @zh
     * 将给定线段的起点和终点设置为给定值。
     * @param out @en The output line to set properties. to @zh 接受新数据的 Line 对象。
     * @param sx @en The x coordinate of the start position. @zh 起点的 x 坐标。
     * @param sy @en The y coordinate of the start position. @zh 起点的 y 坐标。
     * @param sz @en The z coordinate of the start position. @zh 起点的 z 坐标。
     * @param ex @en The x coordinate of the end position. @zh 终点的 x 坐标。
     * @param ey @en The y coordinate of the end position. @zh 终点的 y 坐标。
     * @param ez @en the z coordinate of the end position. @zh 终点的 z 坐标。
     * @returns @en The `out` parameter. @zh 传入的 `out` 对象。
     */
    static set(out: Line, sx: number, sy: number, sz: number, ex: number, ey: number, ez: number): Line;
    /**
     * @en Calculates the length of the given line.
     * @zh 计算线的长度。
     * @param a @en The line to calculate length. @zh 用于计算长度的线段。
     * @returns @en The length of the given line. @zh 线段的长度。
     */
    static len(a: Line): number;
    /**
     * @en The start point.
     * @zh 起点。
     */
    s: Vec3;
    /**
     * @en The end point.
     * @zh 终点。
     */
    e: Vec3;
    /**
     * @en Gets the type of the shape. Always returns `ShapeType.SHAPE_LINE`.
     * @zh 获取形状的类型，总是返回 `ShapeType.SHAPE_LINE`。
     */
    get type(): number;
    private readonly _type;
    /**
     * @en Constructs a line.
     * @zh 构造一条线。
     * @param sx @en The x coordinate of the start position. @zh 起点的 x 坐标。
     * @param sy @en The y coordinate of the start position. @zh 起点的 y 坐标。
     * @param sz @en The z coordinate of the start position. @zh 起点的 z 坐标。
     * @param ex @en The x coordinate of the end position. @zh 终点的 x 坐标。
     * @param ey @en The y coordinate of the end position. @zh 终点的 y 坐标。
     * @param ez @en the z coordinate of the end position. @zh 终点的 z 坐标。
     */
    constructor(sx?: number, sy?: number, sz?: number, ex?: number, ey?: number, ez?: number);
    /**
     * @en Calculates the length of the line.
     * @zh 计算线段的长度。
     * @returns @en The length of the line. @zh 线段的长度。
     */
    length(): number;
}
