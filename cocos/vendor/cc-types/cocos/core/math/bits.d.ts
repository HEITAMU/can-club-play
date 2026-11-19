/**
 * Bit twiddling hacks for JavaScript.
 *
 * Author: Mikola Lysenko
 *
 * Ported from Stanford bit twiddling hack library:
 *    http://graphics.stanford.edu/~seander/bithacks.html
 */
/**
 * @en
 * Number of bits in an integer
 * @zh
 * 整型类型的 bit 数
 */
export declare const INT_BITS = 32;
/**
 * @en
 * The maximal signed integer number
 * @zh
 * 最大有符号整型数
 */
export declare const INT_MAX = 2147483647;
/**
 * @en
 * The minimal signed integer number
 * @zh
 * 最小有符号整型数
 */
export declare const INT_MIN: number;
/**
 * @en Returns -1, 0, +1 depending on sign of x.
 * @zh 根据x的符号返回 -1，0，+1。
 */
export declare function sign(v: number): number;
/**
 * @en Computes absolute value of integer.
 * @zh 计算整数的绝对值。
 */
export declare function abs(v: number): number;
/**
 * @en Computes minimum of integers x and y.
 * @zh 计算整数x和y中的最小值。
 */
export declare function min(x: number, y: number): number;
/**
 * @en Computes maximum of integers x and y.
 * @zh 计算整数x和y中的最大值。
 */
export declare function max(x: number, y: number): number;
/**
 * @en Checks if a number is a power of two.
 * @zh 检查一个数字是否是2的幂。
 */
export declare function isPow2(v: number): boolean;
/**
 * @en Computes log base 2 of v.
 * @zh 计算以 2 为底的 v 的对数。
 */
export declare function log2(v: number): number;
/**
 * @en Computes log base 10 of v.
 * @zh 计算以 10 为底的 v 的对数。
 */
export declare function log10(v: number): number;
/**
 * @en Counts number of bits.
 * @zh 计算传入数字二进制表示中 1 的数量。
 */
export declare function popCount(v: number): number;
/**
 * @en Counts number of trailing zeros.
 * @zh 计算传入数字二进制表示尾随零的数量。
 */
export declare function countTrailingZeros(v: number): number;
/**
 * @en Rounds to next power of 2.
 * @zh 计算大于等于v的最小的二的整数次幂的数字。
 */
export declare function nextPow2(v: number): number;
/**
 * @en Rounds down to previous power of 2.
 * @zh 计算小于等于v的最小的二的整数次幂的数字。
 */
export declare function prevPow2(v: number): number;
/**
 * @en Computes parity of word.
 * @zh 奇偶校验。
 */
export declare function parity(v: number): number;
/**
 * @en Reverse bits in a 32 bit word.
 * @zh 翻转 32 位二进制数字。
 */
export declare function reverse(v: number): number;
/**
 * @en Interleave bits of 2 coordinates with 16 bits. Useful for fast quadtree codes.
 * @zh 将两个 16 位数字按位交错编码。有利于在快速四叉树中使用。
 */
export declare function interleave2(x: number, y: number): number;
/**
 * @en Extracts the nth interleaved component.
 * @zh 提取第 n 个交错分量。
 */
export declare function deinterleave2(v: number, n: number): number;
/**
 * @en Interleave bits of 3 coordinates, each with 10 bits.  Useful for fast octree codes.
 * @zh 将三个数字按位交错编码，每个数字占十位。有利于在八叉树中使用。
 */
export declare function interleave3(x: number, y: number, z: number): number;
/**
 * @en Extracts nth interleaved component of a 3-tuple.
 * @zh 提取三个数字中的第n个交错分量。
 */
export declare function deinterleave3(v: number, n: number): number;
/**
 * @en Compute the lexicographically next bit permutation
 * @zh 计算下一组字典序的比特排列
 */
export declare function nextCombination(v: number): number;
