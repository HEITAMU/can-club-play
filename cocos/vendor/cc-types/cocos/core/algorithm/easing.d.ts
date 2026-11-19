/**
 * @en Not any easing effect.
 * @zh 没有任何缓动效果。
 */
export declare function constant(): number;
/**
 * @en A linear function, `f(k) = k`. Result correlates to input value one to one.
 * Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 线性函数，`f(k) = k`。返回值和输入值一一对应。具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export declare function linear(k: number): number;
/**
 * @en A quadratic function, f(k) = k * k. The interpolation starts slowly, then progressively speeds up until the end,
 * at which point it stops abruptly. Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 一个二次方的函数，f(k) = k * k。插值开始时很慢，然后逐渐加快，直到结束，并突然停止。具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export declare function quadIn(k: number): number;
/**
 * @en A quadratic function, f(k) = k * (2-k). The interpolation starts abruptly and then progressively slows down towards the end. Refer to
 * [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 一个二次方的函数，f(k) = k * (2-k)。插值开始时很突然，然后在接近尾声时逐渐减慢。具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export declare function quadOut(k: number): number;
/**
 * @en The interpolation starts slowly, speeds up, and then slows down towards the end. Refer to
 * [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) graphic feature.
 * @zh 插值开始时很慢，接着加快，然后在接近尾声时减慢。具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export declare function quadInOut(k: number): number;
/**
 * @en Starts slowly and accelerates. Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 启动慢，加速快。具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export declare function cubicIn(k: number): number;
/**
 * @en Starts quickly and decelerates.
 * Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 起动迅速，减速慢。具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export declare function cubicOut(k: number): number;
/**
 * @en Accelerates the animation at the beginning, and decelerates the animation at the end.
 * Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 在开始时加速动画，在结束时减慢动画的速度。具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export declare function cubicInOut(k: number): number;
/**
 * @en Starts slowly and accelerates. Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 启动慢，加速快。具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export declare function quartIn(k: number): number;
/**
 * @en Starts quickly and decelerates.
 * Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 起动迅速，减速慢。具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export declare function quartOut(k: number): number;
/**
 * @en Accelerates the animation at the beginning, and decelerates the animation at the end.
 * Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 在开始时加速动画，在结束时减慢动画的速度。具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export declare function quartInOut(k: number): number;
/**
 * @en Starts slowly and accelerates. Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 启动慢，加速快。具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export declare function quintIn(k: number): number;
/**
 * @en Starts quickly and decelerates.
 * Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 起动迅速，减速慢。具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export declare function quintOut(k: number): number;
/**
 * @en Accelerates the animation at the beginning, and decelerates the animation at the end.
 * Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 在开始时加速动画，在结束时减慢动画的速度。具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export declare function quintInOut(k: number): number;
/**
 * @en Smoothly accelerates the animation.
 * Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 平滑地加速动画。具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export declare function sineIn(k: number): number;
/**
 * @en Smoothly decelerates the animation.
 * Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 平滑地使动画降速。具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export declare function sineOut(k: number): number;
/**
 * @en Smoothly accelerates the animation at the beginning, and smoothly decelerates the animation at the end.
 * Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 在开始时平滑地加速动画，在结束时平滑地减速动画。具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export declare function sineInOut(k: number): number;
/**
 * @en Starts slowly and accelerates. Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 启动慢，加速快。具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export declare function expoIn(k: number): number;
/**
 * @en Starts quickly and decelerates.
 * Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 起动迅速，减速慢。具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export declare function expoOut(k: number): number;
/**
 * @en Accelerates the animation at the beginning, and decelerates the animation at the end.
 * Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 在开始时加速动画，在结束时减慢动画的速度。具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export declare function expoInOut(k: number): number;
/**
 * @en Starts slowly and accelerates. Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 启动慢，加速快。具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export declare function circIn(k: number): number;
/**
 * @en Starts quickly and decelerates.
 * Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 起动迅速，减速慢。具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export declare function circOut(k: number): number;
/**
 * @en Accelerates the animation at the beginning, and decelerates the animation at the end.
 * Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 在开始时加速动画，在结束时减慢动画的速度。具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export declare function circInOut(k: number): number;
/**
 * @en Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export declare function elasticIn(k: number): number;
/**
 * @en Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export declare function elasticOut(k: number): number;
/**
 * @en Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export declare function elasticInOut(k: number): number;
/**
 * @en Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export declare function backIn(k: number): number;
/**
 * @en Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export declare function backOut(k: number): number;
/**
 * @en Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export declare function backInOut(k: number): number;
export declare function bounceIn(k: number): number;
/**
 * @en Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export declare function bounceOut(k: number): number;
/**
 * @en Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export declare function bounceInOut(k: number): number;
/**
 * @en Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export declare function smooth(k: number): number;
/**
 * @en Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export declare function fade(k: number): number;
/**
 * @en Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export declare const quadOutIn: (k: number) => number;
/**
 * @en Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export declare const cubicOutIn: (k: number) => number;
/**
 * @en Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export declare const quartOutIn: (k: number) => number;
/**
 * @en Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export declare const quintOutIn: (k: number) => number;
/**
 * @en Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export declare const sineOutIn: (k: number) => number;
/**
 * @en Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export declare const expoOutIn: (k: number) => number;
/**
 * @en Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export declare const circOutIn: (k: number) => number;
/**
 * @en Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export declare const elasticOutIn: (k: number) => number;
/**
 * @en Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export declare const backOutIn: (k: number) => number;
/**
 * @en Refer to [this doc](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html) for graphic feature.
 * @zh 具体效果可以参考[该文档](https://docs.cocos.com/creator/manual/zh/tween/tween-function.html)。
 */
export declare const bounceOutIn: (k: number) => number;
