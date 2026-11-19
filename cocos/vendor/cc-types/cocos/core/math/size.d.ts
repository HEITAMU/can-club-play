import { ValueType } from '../value-types/value-type';
import { ISizeLike } from './type-define';
/**
 * @en Two dimensional size type representing the width and height.
 * @zh 二维尺寸。
 */
export declare class Size extends ValueType {
    static ZERO: Readonly<Size>;
    static ONE: Readonly<Size>;
    /**
     * @en Calculate the interpolation result between this size and another one with given ratio
     * @zh 根据指定的插值比率，从当前尺寸到目标尺寸之间做插值。
     * @param out Output Size.
     * @param from Original Size.
     * @param to Target Size.
     * @param ratio The interpolation coefficient.The range is [0,1].
     * @return A vector consisting of linear interpolation of the width and height of the current size
     *         to the width and height of the target size at a specified interpolation ratio, respectively.
     */
    static lerp<Out extends ISizeLike>(out: Out, from: Out, to: Out, ratio: number): Out;
    /**
     * @en Check whether `Size` a is equal to `Size` b.
     * @zh 判断两个尺寸是否相等。
     * @param a Size a.
     * @param b Size b.
     * @returns Returns `true' when both dimensions are equal in width and height; otherwise returns `false'.
     */
    static equals<InType extends ISizeLike>(a: InType, b: InType): boolean;
    set x(val: number);
    get x(): number;
    set y(val: number);
    get y(): number;
    width: number;
    height: number;
    /**
     * @en Constructor a size from another one.
     * @zh 构造与指定尺寸相等的尺寸。
     * @param other Specified Size.
     */
    constructor(other: Size);
    /**
     * @en Constructor a size with specified values.
     * @zh 构造具有指定宽度和高度的尺寸。
     * @param width width of the Size, default value is 0.
     * @param height height of the Size, default value is 0.
     */
    constructor(width?: number, height?: number);
    /**
     * @en clone the current `Size`.
     * @zh 克隆当前尺寸。
     */
    clone(): Size;
    /**
     * @en Set values with another `Size`.
     * @zh 设置当前尺寸使其与指定的尺寸相等。
     * @param other Specified Size.
     * @returns `this`
     */
    set(other: Size): any;
    /**
     * @en Set the value of each component of the current `Size`.
     * @zh 设置当前尺寸的具体参数。
     * @param width Specified width
     * @param height Specified height
     * @returns `this`
     */
    set(width?: number, height?: number): any;
    /**
     * @en Check whether the current `Size` equals another one.
     * @zh 判断当前尺寸是否与指定尺寸的相等。
     * @param other Specified Size
     * @returns Returns `true' when both dimensions are equal in width and height; otherwise returns `false'.
     */
    equals(other: Size): boolean;
    /**
     * @en Calculate the interpolation result between this size and another one with given ratio
     * @zh 根据指定的插值比率，从当前尺寸到目标尺寸之间做插值。
     * @param to Target Size.
     * @param ratio The interpolation coefficient.The range is [0,1].
     */
    lerp(to: Size, ratio: number): Size;
    /**
     * @en Return the information of the current size in string
     * @zh 返回当前尺寸的字符串表示。
     * @returns The information of the current size in string
     */
    toString(): string;
}
/**
 * @en Constructs a `Size` object.
 * @zh 等价于 `new Size(other)`。
 * @param other Specified Size.
 * @returns `new Size(other)`
 */
export declare function size(other: Size): Size;
/**
 * @en Constructs a `Size` object.
 * @zh 等价于 `new Size(x, y)`。
 * @param width Specified width
 * @param height Specified height
 * @returns `new Size(w, h)`
 */
export declare function size(width?: number, height?: number): Size;
