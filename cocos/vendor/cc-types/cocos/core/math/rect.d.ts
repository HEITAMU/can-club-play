import { ValueType } from '../value-types/value-type';
import { Mat4 } from './mat4';
import { Size } from './size';
import { IRectLike, IVec2Like } from './type-define';
import { Vec2 } from './vec2';
/**
 * @en
 * A 2D rectangle defined by x, y position at the bottom-left corner and width, height.
 * All points inside the rectangle are greater than or equal to the minimum point and less than or equal to the maximum point.
 * The width is defined as xMax - xMin and the height is defined as yMax - yMin.
 * @zh
 * 该类表示一个二维矩形，由其左下角的 x、y 坐标以及宽度和高度组成。
 * 矩形内的所有点都大于等于矩形的最小点 (xMin, yMin) 并且小于等于矩形的最大点 (xMax, yMax)。
 * 矩形的宽度定义为 xMax - xMin；高度定义为 yMax - yMin。
 */
export declare class Rect extends ValueType {
    /**
     * @en Creates a rectangle from two coordinate values.
     * @zh 由任意两个点创建一个矩形，目标矩形即是这两个点各向 x、y 轴作线所得到的矩形。
     * @param v1 Specified point 1.
     * @param v2 Specified point 2.
     * @returns Target rectangle.
     */
    static fromMinMax<Out extends IRectLike, VecLike extends IVec2Like>(out: Out, v1: VecLike, v2: VecLike): Out;
    /**
     * @en Calculate the interpolation result between this rect and another one with given ratio
     * @zh 根据指定的插值比率，从当前矩形到目标矩形之间做插值。
     * @param out Output rect.
     * @param from Original rect.
     * @param to Target rect.
     * @param ratio The interpolation coefficient.The range is [0,1].
     */
    static lerp<Out extends IRectLike>(out: Out, from: Out, to: Out, ratio: number): Out;
    /**
     * @en Returns the overlapping portion of 2 rectangles.
     * @zh 计算当前矩形与指定矩形重叠部分的矩形，将其赋值给输出矩形。
     * @param out Output Rect.
     * @param one One of the specify Rect.
     * @param other Another of the specify Rect.
     */
    static intersection<Out extends IRectLike>(out: Out, one: Out, other: Out): Out;
    /**
     * @en Returns the smallest rectangle that contains the current rect and the given rect.
     * @zh 创建同时包含当前矩形和指定矩形的最小矩形，将其赋值给输出矩形。
     * @param out Output Rect.
     * @param one One of the specify Rect.
     * @param other Another of the specify Rect.
     */
    static union<Out extends IRectLike>(out: Out, one: Out, other: Out): Out;
    /**
     * @en Returns whether rect a is equal to rect b.
     * @zh 判断两个矩形是否相等。
     * @param a The first rect to be compared.
     * @param b The second rect to be compared.
     * @returns Returns `true' when the minimum and maximum values of both rectangles are equal, respectively; otherwise, returns `false'.
     */
    static equals<InType extends IRectLike>(a: InType, b: InType): boolean;
    /**
     * @en The minimum x value.
     * @zh 获取或设置矩形在 x 轴上的最小值。
     */
    get xMin(): number;
    set xMin(value: number);
    /**
     * @en The minimum y value.
     * @zh 获取或设置矩形在 y 轴上的最小值。
     */
    get yMin(): number;
    set yMin(value: number);
    /**
     * @en The maximum x value.
     * @zh 获取或设置矩形在 x 轴上的最大值。
     */
    get xMax(): number;
    set xMax(value: number);
    /**
     * @en The maximum y value.
     * @zh 获取或设置矩形在 y 轴上的最大值。
     */
    get yMax(): number;
    set yMax(value: number);
    /**
     * @en The position of the center of the rectangle.
     * @zh 获取或设置矩形中心点的坐标。
     */
    get center(): Vec2;
    set center(value: Vec2);
    /**
     * @en Returns a new [[Vec2]] object representing the position of the rectangle
     * @zh 获取或设置矩形的 x 和 y 坐标。
     */
    get origin(): Vec2;
    set origin(value: Vec2);
    /**
     * @en Returns a new [[Size]] object represents the width and height of the rectangle
     * @zh 获取或设置矩形的尺寸。
     */
    get size(): Size;
    set size(value: Size);
    set z(val: number);
    get z(): number;
    set w(val: number);
    get w(): number;
    /**
     * @en The minimum x value.
     * @zh 矩形最小点的 x 坐标。
     */
    x: number;
    /**
     * @en The minimum y value.
     * @zh 矩形最小点的 y 坐标。
     */
    y: number;
    /**
     * @en The width of the Rect.
     * @zh 矩形的宽度。
     */
    width: number;
    /**
     * @en The height of the Rect.
     * @zh 矩形的高度。
     */
    height: number;
    /**
     * @en Constructs a Rect from another one.
     * @zh 构造与指定矩形相等的矩形。
     * @param other Specified Rect.
     */
    constructor(other: Rect);
    /**
     * @en Constructs a Rect with specified values.
     * @zh 构造具有指定的最小值和尺寸的矩形。
     * @param x The minimum X coordinate of the rectangle.
     * @param y The minimum Y coordinate of the rectangle.
     * @param width The width of the rectangle, measured from the X position.
     * @param height The height of the rectangle, measured from the Y position.
     */
    constructor(x?: number, y?: number, width?: number, height?: number);
    /**
     * @en clone the current Rect.
     * @zh 克隆当前矩形。
     */
    clone(): Rect;
    /**
     * @en Set values with another Rect.
     * @zh 设置当前矩形使其与指定矩形相等。
     * @param other Specified Rect.
     * @returns `this`
     */
    set(other: Rect): any;
    /**
     * @en Set the value of each component of the current Rect.
     * @zh 设置当前矩形使其与指定参数的矩形相等。
     * @param x The x parameter of the specified rectangle
     * @param y The y parameter of the specified rectangle
     * @param width The width parameter of the specified rectangle
     * @param height The height parameter of the specified rectangle
     * @returns `this`
     */
    set(x?: number, y?: number, width?: number, height?: number): any;
    /**
     * @en Check whether the current Rect equals another one.
     * @zh 判断当前矩形是否与指定矩形相等。
     * @param other Specified rectangles.
     * @returns Returns `true' when the minimum and maximum values of both rectangles are equal, respectively; otherwise, returns `false'.
     */
    equals(other: Rect): boolean;
    /**
     * @en Calculate the interpolation result between this Rect and another one with given ratio.
     * @zh 根据指定的插值比率，从当前矩形到目标矩形之间做插值。
     * @param to Target Rect.
     * @param ratio The interpolation coefficient.The range is [0,1].
     */
    lerp(to: Rect, ratio: number): Rect;
    /**
     * @en Return the information of the current rect in string
     * @zh 返回当前矩形的字符串表示。
     * @returns The information of the current rect in string
     */
    toString(): string;
    /**
     * @en Check whether the current rectangle intersects with the given one.
     * @zh 判断当前矩形是否与指定矩形相交。
     * @param other Specified rectangles.
     * @returns If intersected, return `true', otherwise return `false'.
     */
    intersects(other: Rect): boolean;
    /**
     * @en Check whether the current rect contains the given point.
     * @zh 判断当前矩形是否包含指定的点。
     * @param point Specified point.
     * @returns The specified point is included in the rectangle and returns `true', otherwise it returns `false'.
     */
    contains(point: Vec2): boolean;
    /**
     * @en Returns true if the other rect entirely inside this rectangle.
     * @zh 判断当前矩形是否包含指定矩形。
     * @param other Specified rectangles.
     * @returns Returns `true' if all the points of the specified rectangle are included in the current rectangle, `false' otherwise.
     */
    containsRect(other: Rect): boolean;
    /**
     * @en Apply matrix4 to the rect.
     * @zh
     * 应用矩阵变换到当前矩形：
     * 应用矩阵变换到当前矩形的最小点得到新的最小点，
     * 将当前矩形的尺寸视为二维向量应用矩阵变换得到新的尺寸；
     * 并将如此构成的新矩形。
     * @param matrix The matrix4
     */
    transformMat4(mat: Mat4): Rect;
    /**
     * @en
     * Applies a matrix transformation to the current rectangle and outputs the result to the four vertices.
     * @zh
     * 应用矩阵变换到当前矩形，并将结果输出到四个顶点上。
     *
     * @param mat The mat4 to apply
     * @param out_lb The left bottom point
     * @param out_lt The left top point
     * @param out_rb The right bottom point
     * @param out_rt The right top point
     */
    transformMat4ToPoints(mat: Mat4, out_lb: Vec2, out_lt: Vec2, out_rt: Vec2, out_rb: Vec2): void;
}
/**
 * @en The convenient method to create a new Rect.
 * @zh 构造与指定矩形相等的矩形。等价于 `new Rect(rect)`。
 * @param rect Specified Rect.
 * @returns `new Rect(rect)`
 */
export declare function rect(rect: Rect): Rect;
/**
 * @en The convenient method to create a new Rect.
 * @zh 构造具有指定的最小值和尺寸的矩形，等价于`new Rect(x, y, width, height)`。
 * @param x The minimum X coordinate of the rectangle.
 * @param y The minimum Y coordinate of the rectangle.
 * @param width The width of the rectangle, measured from the X position.
 * @param height The height of the rectangle, measured from the Y position.
 * @returns `new Rect(x, y, width, height)`
 */
export declare function rect(x?: number, y?: number, width?: number, height?: number): Rect;
