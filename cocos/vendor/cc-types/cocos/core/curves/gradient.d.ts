import { Color } from '../math';
declare enum GradientMode {
    Blend = 0,
    Fixed = 1
}
export declare class ColorKey {
    /**
     * @en Color value.
     * @zh 颜色值。
     */
    color: Color;
    /**
     * @en Time value.
     * @zh 时间值。
     */
    time: number;
}
export declare class AlphaKey {
    /**
     * @en Alpha value.
     * @zh 透明度。
     */
    alpha: number;
    /**
     * @en Time.
     * @zh 时间帧。
     */
    time: number;
}
/**
 * @en Gradient is a component that has a lot of color keys and alpha keys to get the interpolated color value.
 * @zh 渐变曲线控件包含了颜色关键帧和透明度关键帧，在关键帧中进行插值渐变返回最终的颜色值。
 */
export declare class Gradient {
    /**
     * @en
     * There are 2 kind of mode:
     * Blend just interpolate the nearest 2 colors from keys.
     * Fixed get the nearest color from keys without interpolate.
     * @zh
     * 这个控件包含了两种取色模式：
     * 混合模式对取到的最近两个颜色帧进行插值计算。
     * 固定模式直接取最近的颜色帧返回，不进行插值。
     */
    static Mode: typeof GradientMode;
    /**
     * @en Array of color key.
     * @zh 颜色关键帧列表。
     */
    colorKeys: ColorKey[];
    /**
     * @en Array of alpha key.
     * @zh 透明度关键帧列表。
     */
    alphaKeys: AlphaKey[];
    /**
     * @en Blend mode.
     * @zh 混合模式。
     */
    mode: GradientMode;
    /**
     * @en Set color keys array and alpha keys array.
     * @zh 设置颜色和透明度的关键帧列表。
     * @param colorKeys @en Array of color keys @zh 颜色关键帧列表
     * @param alphaKeys @en Array of alpha keys @zh 透明度关键帧列表
     */
    setKeys(colorKeys: ColorKey[], alphaKeys: AlphaKey[]): void;
    /**
     * @en Sort color keys and alpha keys.
     * @zh 对颜色和透明度的关键帧进行排序。
     */
    sortKeys(): void;
    /**
     * @en Interpolate color and alpha from color and alpha keys.
     * @zh 根据颜色列表插值计算颜色和透明度。
     * @param time @en Normalized time to interpolate. @zh 用于插值的归一化时间。
     * @returns @en Interpolated color value. @zh 插值过后的颜色值。
     *
     * @deprecated since v3.8 please use [[evaluateFast]] instead.
     */
    evaluate(time: number): Color;
    /**
     * @en Interpolate color and alpha from color and alpha keys.
     * @zh 根据颜色列表插值计算颜色和透明度。
     * @param out @en Interpolated color value. @zh 插值过后的颜色值。
     * @param time @en Normalized time to interpolate. @zh 用于插值的归一化时间。
     * @returns @en Interpolated color value. @zh 插值过后的颜色值。
     */
    evaluateFast(out: Color, time: number): Color;
    /**
     * @en Generates a random color and alpha.
     * @zh 随机生成颜色和透明度。
     * @returns @en Randomized color. @zh 随机生成的颜色。
     * @deprecated since v3.8 please use [[getRandomColor]] instead.
     */
    randomColor(): Color;
    /**
     * @en Generates a random color and alpha.
     * @zh 随机生成颜色和透明度。
     * @param out @en Randomized color. @zh 随机生成的颜色。
     * @returns @en Randomized color. @zh 随机生成的颜色。
     */
    getRandomColor(out: Color): Color;
    private getRGB;
    private getAlpha;
}
export {};
