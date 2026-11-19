/// <reference types="./@types/globals" />
import { ValueType } from '../value-types/value-type';
import { IColorLike } from './type-define';
import { Vec4 } from './vec4';
import { Vec3 } from './vec3';
import { Modifiable } from '../utils/misc';
/**
 * @en Representation of RGBA colors.<br/>
 * Each color component is an integer value with a range from 0 to 255.<br/>
 * @zh 通过 Red、Green、Blue 颜色通道表示颜色，并通过 Alpha 通道表示不透明度。<br/>
 * 每个通道都为取值范围 [0, 255] 的整数。<br/>
 */
export declare class Color extends ValueType implements Modifiable {
    static WHITE: Readonly<Color>;
    static GRAY: Readonly<Color>;
    static BLACK: Readonly<Color>;
    static TRANSPARENT: Readonly<Color>;
    static RED: Readonly<Color>;
    static GREEN: Readonly<Color>;
    static BLUE: Readonly<Color>;
    static CYAN: Readonly<Color>;
    static MAGENTA: Readonly<Color>;
    static YELLOW: Readonly<Color>;
    /**
     * @en Copy content of a color into another and save the results to out color.
     * @zh 获得指定颜色的拷贝
     */
    static clone<Out extends IColorLike>(a: Out): Color;
    /**
     * @en Clone a color and save the results to out color.
     * @zh 复制目标颜色
     */
    static copy<Out extends IColorLike>(out: Out, a: Out): Out;
    /**
     * @en Set the components of a color to the given values and save the results to out color.
     * @zh 设置颜色值
     */
    static set<Out extends IColorLike>(out: Out, r: number, g: number, b: number, a: number): Out;
    /**
     * @en Convert linear color from rgb8 0~255 to Vec4 0~1
     * @zh 将当前颜色转换为到 Vec4
     * @returns Vec4 as float color value
     * @example
     * ```
     * const color = Color.YELLOW;
     * color.toVec4();
     * ```
     */
    static toVec4(color: Color, out?: Vec4): Vec4;
    /**
     * @en Convert 8bit linear color from Vec4
     * @zh 使用 Vec4 设置 8 bit 颜色
     * @returns 8 Bit srgb value
     * @example
     * ```
     * color.fromVec4(new Vec4(1,1,1,1));
     * ```
     */
    static fromVec4(value: Vec4, out?: Color): Color;
    /**
     * @en Converts the hexadecimal formal color into rgb formal and save the results to out color.
     *   the argument `hex` could be hex-string or hex-number (8-digit or 6-digit).
     *   the hex-string should be like : '#12345678' '#123456', '123456', '12345678'.
     *   the hex-number should be like : 0x12345678, 0x123456 .
     * @zh 从十六进制颜色字符串中读入颜色到 out 中
     *   参数 hex 支持 16进制字符串 或者 16进制数值 (8位数字 或者 6位数字).
     *   16进制字符串的格式应该类似: '#12345678' '#123456', '123456', '12345678'.
     *   16进制数值的格式应该类似:  0x12345678, 0x123456 .
     */
    static fromHEX<Out extends IColorLike>(out: Out, hex: string | number): Out;
    /**
     * @en Add two colors by components. And save the results to out color.
     * @zh 逐通道颜色加法
     */
    static add<Out extends IColorLike>(out: Out, a: Out, b: Out): Out;
    /**
     * @en Subtract each components of color b from each components of color a. And save the results to out color.
     * @zh 逐通道颜色减法
     */
    static subtract<Out extends IColorLike>(out: Out, a: Out, b: Out): Out;
    /**
     * @en Multiply each components of two colors. And save the results to out color.
     * @zh 逐通道颜色乘法
     */
    static multiply<Out extends IColorLike>(out: Out, a: Out, b: Out): Out;
    /**
     * @en Divide each components of color a by each components of color b. And save the results to out color.
     * @zh 逐通道颜色除法
     */
    static divide<Out extends IColorLike>(out: Out, a: Out, b: Out): Out;
    /**
     * @en Multiply all channels in a color with the given scale factor, and save the results to out color.
     * @zh 全通道统一缩放颜色
     */
    static scale<Out extends IColorLike>(out: Out, a: Out, b: number): Out;
    /**
     * @en Performs a linear interpolation between two colors.
     * @zh 逐通道颜色线性插值：A + t * (B - A)
     */
    static lerp<Out extends IColorLike>(out: Out, from: Out, to: Out, ratio: number): Out;
    /**
     * @en Convert a color object to a RGBA array, and save the results to out color.
     * @zh 颜色转数组
     * @param ofs Array Start Offset
     */
    static toArray<Out extends IWritableArrayLike<number>>(out: Out, a: IColorLike, ofs?: number): Out;
    /**
     * @en Sets the given color with RGBA values in an array, and save the results to out color.
     * @zh 数组转颜色
     * @param ofs Array Start Offset
     */
    static fromArray<Out extends IColorLike>(arr: IWritableArrayLike<number>, out: Out, ofs?: number): Out;
    /**
     * @zh 从无符号 32 位整数构造颜色，高 8 位为 alpha 通道，次高 8 位为蓝色通道，次低 8 位为绿色通道，低 8 位为红色通道。
     * @en Construct color from a unsigned 32 bit integer, the highest 8 bits is for alpha channel, the second highest 8 bits is for blue channel,
     * the second lowest 8 bits is for green channel, and the lowest 8 bits if for red channel.
     *
     * @param out @en Output color object. @zh 输出的颜色对象。
     * @param uint32 @en The unsigned 32 bit integer @zh 32 位无符号整数
     * @returns @en The `out` object @zh `out` 对象
     */
    static fromUint32<Out extends IColorLike>(out: Out, uint32: number): Out;
    /**
     * @zh 转换当前颜色为无符号 32 位整数, 高 8 位为 alpha 通道，次高 8 位为蓝色通道，次低 8 位为绿色通道，低 8 位为红色通道。
     * @en Convert the current color to a unsigned 32 bit integer, the highest 8 bits is for alpha channel,
     * the second highest 8 bits is for blue channel, the second lowest 8 bits is for green channel, and the lowest 8 bits if for red channel.
     *
     * @param color @en The color. @zh 颜色。
     * @returns @en The converted unsigned 32 bit integer. @zh 32 位无符号整数。
     */
    static toUint32(color: IColorLike): number;
    /**
     * @en Check whether the two given colors are identical
     * @zh 颜色等价判断
     */
    static strictEquals<Out extends IColorLike>(a: Out, b: Out): boolean;
    /**
     * @en Check whether the two given colors are approximately equivalent. Difference of each channel is smaller that the epsilon.
     * @zh 排除浮点数误差的颜色近似等价判断
     */
    static equals<Out extends IColorLike>(a: Out, b: Out, epsilon?: number): boolean;
    /**
     * @en Convert the given color to a hex color value. And save the results to out color.
     * @zh 获取指定颜色的整型数据表示
     */
    static hex<Out extends IColorLike>(a: Out): number;
    private _data;
    /**
     * @en Get or set red channel value.
     * @zh 获取或设置当前颜色的 Red 通道。
     */
    get r(): number;
    set r(red: number);
    /**
     * @en Get or set green channel value.
     * @zh 获取或设置当前颜色的 Green 通道。
     */
    get g(): number;
    set g(green: number);
    /**
     * @en Get or set blue channel value.
     * @zh 获取或设置当前颜色的 Blue 通道。
     */
    get b(): number;
    set b(blue: number);
    /** @en Get or set alpha channel value.
     * @zh 获取或设置当前颜色的透明度通道。
     */
    get a(): number;
    set a(alpha: number);
    get x(): number;
    set x(value: number);
    get y(): number;
    set y(value: number);
    get z(): number;
    set z(value: number);
    get w(): number;
    set w(value: number);
    /**
     * @en Construct a same color from the given color
     * @zh 构造与指定颜色相等的颜色。
     * @param other Specified color
     */
    constructor(other: Readonly<Color>);
    /**
     * @en Construct a color form the hex color string
     * @zh 用十六进制颜色字符串中构造颜色。
     * @param hexString Hexadecimal color string.
     */
    constructor(hexString: string);
    /**
     * @en Construct a color
     * @zh 构造具有指定通道的颜色。
     * @param r red component of the color, default value is 0.
     * @param g green component of the color, default value is 0.
     * @param b blue component of the color, default value is 0.
     * @param a alpha component of the color, default value is 255.
     */
    constructor(r?: number, g?: number, b?: number, a?: number);
    /**
     * @en Clone a new color from the current color.
     * @zh 克隆当前颜色。
     */
    clone(): Color;
    /**
     * @en Check whether the current color is identical with the given color
     * @zh 判断当前颜色是否与指定颜色相等。
     * @param other Specified color
     * @returns Returns `true` when all channels of both colors are equal; otherwise returns `false`.
     */
    equals(other: Readonly<Color>): boolean;
    /**
     * @en Calculate linear interpolation result between this color and another one with given ratio。
     * @zh 根据指定的插值比率，从当前颜色到目标颜色之间做插值。
     * @param to Target color
     * @param ratio The interpolation coefficient.The range is [0,1].
     */
    lerp(to: Readonly<Color>, ratio: number): Color;
    /**
     * @en Convert to string with color information.
     * @zh 返回当前颜色的字符串表示。
     * @returns A string representation of the current color.
     */
    toString(): string;
    /**
     * @en Convert color to css format.
     * @zh 将当前颜色转换为 CSS 格式。
     * @param opt "rgba", "rgb", "#rgb" or "#rrggbb".
     * @returns CSS format for the current color.
     * @example
     * ```ts
     * let color = cc.Color.BLACK;
     * color.toCSS();          // "rgba(0,0,0,1.00)";
     * color.toCSS("rgba");    // "rgba(0,0,0,1.00)";
     * color.toCSS("rgb");     // "rgba(0,0,0)";
     * color.toCSS("#rgb");    // "#000";
     * color.toCSS("#rrggbb"); // "#000000";
     * ```
     */
    toCSS(opt?: ('rgba' | 'rgb' | '#rrggbb' | '#rrggbbaa')): string;
    /**
     * @en Converts the hexadecimal formal color into rgb formal and save the results to current color object.
     *   the argument `hex` could be hex-string or hex-number (8-digit or 6-digit).
     *   the hex-string should be like : '#12345678' '#123456', '123456', '12345678'.
     *   the hex-number should be like : 0x12345678, 0x123456 .
     * @zh 从十六进制颜色字符串中读入颜色到 当前color对象中
     *   参数 hex 支持 16进制字符串 或者 16进制数值 (8位数字 或者 6位数字).
     *   16进制字符串的格式应该类似: '#12345678' '#123456', '123456', '12345678'.
     *   16进制数值的格式应该类似:  0x12345678, 0x123456 .
     * @param hex the hex-string or hex-number
     * @returns `this`
     */
    fromHEX(hex: string | number): Color;
    /**
     * @en convert Color to HEX color string.
     * @zh 转换当前颜色为十六进制颜色字符串。
     * @param fmt "#rrggbb" or "#rrggbbaa".
     * - `'#rrggbbaa'` obtains the hexadecimal value of the Red, Green, Blue,
     *   Alpha channels (**two**, high complement 0) and connects them sequentially.
     * - `'#rrggbb'` is similar to `'#rrggbbaa'` but does not include the Alpha channel.
     * @returns the Hex color string
     * @example
     * ```
     * const color = new Color(255, 14, 0, 255);
     * color.toHEX("#rgb");      // "f00";
     * color.toHEX("#rrggbbaa"); // "ff0e00ff"
     * color.toHEX("#rrggbb");   // "ff0e00"
     * ```
     */
    toHEX(fmt?: '#rgb' | '#rrggbb' | '#rrggbbaa'): string;
    /**
     * @en Convert to rgb value.
     * @zh 将当前颜色转换为 RGB 整数值。
     * @returns RGB integer value. Starting from the lowest valid bit, each 8 bits is the value of the Red, Green, and Blue channels respectively.
     * @example
     * ```
     * const color = Color.YELLOW;
     * color.toRGBValue();
     * ```
     */
    toRGBValue(): number;
    /**
     * @en Read HSV model color and convert to RGB color.
     * @zh 从 HSV 颜色中读入当前颜色。
     * @param h H value。
     * @param s S value。
     * @param v V value。
     * @returns `this`
     * @example
     * ```
     * const color = Color.YELLOW;
     * color.fromHSV(0, 0, 1); // Color {r: 255, g: 255, b: 255, a: 255};
     * ```
     */
    fromHSV(h: number, s: number, v: number): Color;
    /**
     * @en Transform to HSV model color.
     * @zh 转换当前颜色为 HSV 颜色。
     * @returns HSV format color
     * @example
     * ```
     * import { Color } from 'cc';
     * const color = Color.YELLOW;
     * color.toHSV(); // {h: 0.1533864541832669, s: 0.9843137254901961, v: 1}
     * ```
     */
    toHSV(): {
        h: number;
        s: number;
        v: number;
    };
    /**
     * @en Set the color.
     * @zh 设置当前颜色使其与指定颜色相等。
     * @param other The specified color.
     * @overload
     * @param [r=0] red component of the color, the range is [0-255]
     * @param [g=0] green component of the color
     * @param [b=0] blue component of the color
     * @param [a=255] alpha component of the color
     * @returns Current color.
     */
    set(other: Readonly<Color>): Color;
    set(r?: number, g?: number, b?: number, a?: number): Color;
    /**
     * @en Multiplies the current color by the specified color.
     * @zh 将当前颜色乘以与指定颜色
     * @param other The specified color.
     */
    multiply(other: Color): Color;
    /**
     * @en It is used in tween action. As can not modify this._data directly.
     * @zn 被 tween action 使用。因为不能直接修改 this._data，所以返回用于修改的属性。
     * @returns @en ['r', 'g', 'b', 'a'] @zh ['r', 'g', 'b', 'a']
     */
    getModifiableProperties(): string[];
}
export declare function color(other: Color | string): Color;
export declare function color(r?: number, g?: number, b?: number, a?: number): Color;
export declare function srgbToLinear(x: number): number;
export declare function srgb8BitToLinear(x: number): number;
export declare function linearToSrgb(x: number): number;
export declare function linearToSrgb8Bit(x: number): number;
export declare function clampVec3(val: Vec3, min: Vec3, max: Vec3): Vec3;
export declare function floorVec3(val: Vec3): Vec3;
export declare function stepVec3(a: Vec3, b: Vec3): Vec3;
/**
 * @en Three channel rgb color pack into four channel rbge format.
 * @zh 三通道rgb颜色pack成四通道rbge格式
 * @param rgb Vec3
 */
export declare function packRGBE(rgb: Vec3): Vec4;
