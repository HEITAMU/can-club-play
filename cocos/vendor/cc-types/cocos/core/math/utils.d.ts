import { ValueType } from '../value-types';
import { IVec3Like } from './type-define';
export declare const HALF_PI: number;
export declare const TWO_PI: number;
export declare const EPSILON = 0.000001;
/**
 * @en Tests whether or not the arguments have approximately the same value, within an absolute<br/>
 * or relative tolerance of glMatrix.EPSILON (an absolute tolerance is used for values less<br/>
 * than or equal to 1.0, and a relative tolerance is used for larger values)
 * @zh 在glMatrix的绝对或相对容差范围内，测试参数是否具有近似相同的值。<br/>
 * EPSILON(小于等于1.0的值采用绝对公差，大于1.0的值采用相对公差)
 * @param a The first number to test.
 * @param b The second number to test.
 * @return True if the numbers are approximately equal, false otherwise.
 */
export declare function equals(a: number, b: number): boolean;
/**
 * @en Tests whether or not the arguments have approximately the same value by given maxDiff<br/>
 * @zh 通过给定的最大差异，测试参数是否具有近似相同的值。
 * @param a The first number to test.
 * @param b The second number to test.
 * @param maxDiff Maximum difference.
 * @return True if the numbers are approximately equal, false otherwise.
 */
export declare function approx(a: number, b: number, maxDiff?: number): boolean;
/**
 * @en Clamps a value between a minimum float and maximum float value.<br/>
 * @zh 返回最小浮点数和最大浮点数之间的一个数值。可以使用 clamp 函数将不断变化的数值限制在范围内。
 * @param val
 * @param min
 * @param max
 */
export declare function clamp(val: number, min: number, max: number): number;
/**
 * @en Clamps a value between 0 and 1.<br/>
 * @zh 将值限制在0和1之间。
 * @param val
 */
export declare function clamp01(val: number): number;
/**
 * @en Linear interpolation between two numbers
 * @zh 两个数之间的线性插值。
 * @param from - The starting number.
 * @param to - The ending number.
 * @param ratio - The interpolation coefficient, t should be in the range [0, 1].
 */
export declare function lerp(from: number, to: number, ratio: number): number;
/**
 * @en Convert Degree To Radian<br/>
 * @zh 把角度换算成弧度。
 * @param {Number} a Angle in Degrees
 */
export declare function toRadian(a: number): number;
/**
 * @en Convert Radian To Degree<br/>
 * @zh 把弧度换算成角度。
 * @param {Number} a Angle in Radian
 */
export declare function toDegree(a: number): number;
/**
 * @method random
 */
export declare function random(): number;
/**
 * @en Set a custom random number generator, default to Math.random
 * @zh 设置自定义随机数生成器，默认为 Math.random
 * @param func custom random number generator
 */
export declare function setRandGenerator<TFunction extends (...any: any[]) => number>(func: TFunction): void;
/**
 * @en Returns a floating-point random number between min (inclusive) and max (exclusive).<br/>
 * @zh 返回最小(包含)和最大(不包含)之间的浮点随机数。
 * @method randomRange
 * @param min
 * @param max
 * @return {Number} The random number.
 */
export declare function randomRange(min: number, max: number): number;
/**
 * @en Returns a random integer between min (inclusive) and max (exclusive).<br/>
 * @zh 返回最小(包含)和最大(不包含)之间的随机整数。
 * @param min
 * @param max
 * @return The random integer.
 */
export declare function randomRangeInt(min: number, max: number): number;
/**
 * @en
 * Linear congruence generator using Hull-Dobell Theorem.
 * @zh
 * 使用 Hull-Dobell 算法的线性同余生成器构造伪随机数
 *
 * @param seed The random seed.
 * @return The pseudo random.
 */
export declare function pseudoRandom(seed: number): number;
/**
 * @en
 * Returns a floating-point pseudo-random number between min (inclusive) and max (exclusive).
 * @zh
 * 返回一个在范围内的浮点伪随机数，注意，不包含边界值
 *
 * @param seed
 * @param min
 * @param max
 * @return The random number.
 */
export declare function pseudoRandomRange(seed: number, min: number, max: number): number;
/**
 * @en Returns a pseudo-random integer between min (inclusive) and max (exclusive).<br/>
 * @zh 返回最小(包含)和最大(不包含)之间的浮点伪随机数。
 * @param seed
 * @param min
 * @param max
 * @return The random integer.
 */
export declare function pseudoRandomRangeInt(seed: number, min: number, max: number): number;
/**
 * @en
 * Returns the next power of two for the value.<br/>
 * @zh
 * 返回下一个最接近的 2 的幂
 *
 * @param val
 * @return The the next power of two.
 */
export declare function nextPow2(val: number): number;
/**
 * @en Returns float remainder for t / length.<br/>
 * @zh 返回t / length的浮点余数。
 * @param t Time start at 0.
 * @param length Time of one cycle.
 * @return The Time wrapped in the first cycle.
 */
export declare function repeat(t: number, length: number): number;
/**
 * @en
 * Returns time wrapped in ping-pong mode.
 * @zh
 * 返回乒乓模式下的相对时间
 *
 * @param t Time start at 0.
 * @param length Time of one cycle.
 * @return The time wrapped in the first cycle.
 */
export declare function pingPong(t: number, length: number): number;
/**
 * @en Returns ratio of a value within a given range.<br/>
 * @zh 返回给定范围内的值的比率。
 * @param from Start value.
 * @param to End value.
 * @param value Given value.
 * @return The ratio between [from, to].
 */
export declare function inverseLerp(from: number, to: number, value: number): number;
/**
 * @en Compare the absolute values of all components and the component with the largest absolute value will be returned.
 * @zh 对所有分量的绝对值进行比较大小，返回绝对值最大的分量。
 * @param v vec3 like value
 * @returns max absolute component
 */
export declare function absMaxComponent(v: IVec3Like): number;
/**
 * @en Compare the absolute value of two values and return the value with the largest absolute value
 * @zh 对 a b 的绝对值进行比较大小，返回绝对值最大的值。
 * @param a number
 * @param b number
 */
export declare function absMax(a: number, b: number): number;
/**
 * @en
 * Make the attributes of the specified class available to be enumerated
 * @zh
 * 使指定类的特定属性可被枚举
 * @param prototype Inherit the prototype chain of the ValueType class
 * @param attrs List of attributes that need to be enumerated
 */
export declare function enumerableProps(prototype: ValueType, attrs: string[]): void;
export declare function floatToHalf(val: number): number;
export declare function halfToFloat(val: number): number;
