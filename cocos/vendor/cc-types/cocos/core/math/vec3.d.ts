/// <reference types="./@types/globals" />
import type { Vec2 } from './vec2';
import { ValueType } from '../value-types/value-type';
import { Mat4 } from './mat4';
import { IMat3Like, IMat4Like, IQuatLike, IVec3Like } from './type-define';
/**
 * @en Representation of 3D vectors and points.
 * @zh 三维向量。
 */
export declare class Vec3 extends ValueType {
    static UNIT_X: Readonly<Vec3>;
    static UNIT_Y: Readonly<Vec3>;
    static UNIT_Z: Readonly<Vec3>;
    static RIGHT: Readonly<Vec3>;
    static UP: Readonly<Vec3>;
    static FORWARD: Readonly<Vec3>;
    static ZERO: Readonly<Vec3>;
    static ONE: Readonly<Vec3>;
    static NEG_ONE: Readonly<Vec3>;
    /**
     * @en return a Vec3 object with x = 0, y = 0, z = 0.
     * @zh 将目标赋值为零向量
     */
    static zero<Out extends IVec3Like>(out: Out): Out;
    /**
     * @en Obtains a clone of the given vector object
     * @zh 获得指定向量的拷贝
     */
    static clone<Out extends IVec3Like>(a: Out): Vec3;
    /**
     * @en Copy the target vector and save the results to out vector object
     * @zh 复制目标向量
     */
    static copy<Out extends IVec3Like, Vec3Like extends IVec3Like>(out: Out, a: Vec3Like): Out;
    /**
     * @en Sets the out vector with the given x, y and z values
     * @zh 设置向量值
     */
    static set<Out extends IVec3Like>(out: Out, x: number, y: number, z: number): Out;
    /**
     * @en Element-wise vector addition and save the results to out vector object
     * @zh 逐元素向量加法
     */
    static add<Out extends IVec3Like>(out: Out, a: IVec3Like, b: IVec3Like): Out;
    /**
     * @en Element-wise vector subtraction and save the results to out vector object
     * @zh 逐元素向量减法
     */
    static subtract<Out extends IVec3Like>(out: Out, a: IVec3Like, b: IVec3Like): Out;
    /**
     * @en Element-wise vector multiplication and save the results to out vector object
     * @zh 逐元素向量乘法 (分量积)
     */
    static multiply<Out extends IVec3Like>(out: Out, a: IVec3Like, b: IVec3Like): Out;
    /**
     * @en Element-wise vector division and save the results to out vector object
     * @zh 逐元素向量除法
     */
    static divide<Out extends IVec3Like>(out: Out, a: IVec3Like, b: IVec3Like): Out;
    /**
     * @en Rounds up by elements of the vector and save the results to out vector object
     * @zh 逐元素向量向上取整
     */
    static ceil<Out extends IVec3Like>(out: Out, a: IVec3Like): Out;
    /**
     * @en Element-wise rounds down of the current vector and save the results to the out vector
     * @zh 逐元素向量向下取整
     */
    static floor<Out extends IVec3Like>(out: Out, a: IVec3Like): Out;
    /**
     * @en Calculates element-wise minimum values and save to the out vector
     * @zh 逐元素向量最小值
     */
    static min<Out extends IVec3Like>(out: Out, a: IVec3Like, b: IVec3Like): Out;
    /**
     * @en Calculates element-wise maximum values and save to the out vector
     * @zh 逐元素向量最大值
     */
    static max<Out extends IVec3Like>(out: Out, a: IVec3Like, b: IVec3Like): Out;
    /**
     * @en Calculates element-wise round results and save to the out vector
     * @zh 逐元素向量四舍五入取整
     */
    static round<Out extends IVec3Like>(out: Out, a: IVec3Like): Out;
    /**
     * @en Vector scalar multiplication and save the results to out vector object
     * @zh 向量标量乘法
     */
    static multiplyScalar<Out extends IVec3Like, Vec3Like extends IVec3Like>(out: Out, a: Vec3Like, b: number): Out;
    /**
     * @en Element-wise multiplication and addition with the equation: a + b * scale
     * @zh 逐元素向量乘加: A + B * scale
     */
    static scaleAndAdd<Out extends IVec3Like>(out: Out, a: IVec3Like, b: IVec3Like, scale: number): Out;
    /**
     * @en Calculates the euclidean distance of two vectors
     * @zh 求两向量的欧氏距离
     */
    static distance(a: IVec3Like, b: IVec3Like): number;
    /**
     * @en Calculates the squared euclidean distance of two vectors
     * @zh 求两向量的欧氏距离平方
     */
    static squaredDistance(a: IVec3Like, b: IVec3Like): number;
    /**
     * @en Calculates the length of the vector
     * @zh 求向量长度
     */
    static len(a: IVec3Like): number;
    /**
     * @en Calculates the squared length of the vector
     * @zh 求向量长度平方
     */
    static lengthSqr(a: IVec3Like): number;
    /**
     * @en Sets each element to its negative value
     * @zh 逐元素向量取负
     */
    static negate<Out extends IVec3Like>(out: Out, a: IVec3Like): Out;
    /**
     * @en Sets each element to its inverse value, zero value will become Infinity
     * @zh 逐元素向量取倒数，接近 0 时返回 Infinity
     */
    static invert<Out extends IVec3Like>(out: Out, a: IVec3Like): Out;
    /**
     * @en Sets each element to its inverse value, zero value will remain zero
     * @zh 逐元素向量取倒数，接近 0 时返回 0
     */
    static invertSafe<Out extends IVec3Like>(out: Out, a: IVec3Like): Out;
    /**
     * @en Sets the normalized vector to the out vector, returns a zero vector if input is a zero vector.
     * @zh 归一化向量，输入零向量将会返回零向量。
     */
    static normalize<Out extends IVec3Like>(out: Out, a: IVec3Like): Out;
    /**
     * @en Calculates the dot product of the vector
     * @zh 向量点积（数量积）
     */
    static dot<Out extends IVec3Like>(a: Out, b: IVec3Like): number;
    /**
     * @en Calculates the cross product of the vector
     * @zh 向量叉积（向量积）
     */
    static cross<Out extends IVec3Like>(out: Out, a: IVec3Like, b: IVec3Like): Out;
    /**
     * @en Calculates the linear interpolation between two vectors with a given ratio: A + t * (B - A)
     * @zh 逐元素向量线性插值： A + t * (B - A)
     */
    static lerp<Out extends IVec3Like>(out: Out, a: IVec3Like, b: IVec3Like, t: number): Out;
    /**
     * @zh 球面线性插值。多用于插值两个方向向量。
     * @en Spherical linear interpolation. Commonly used in interpolation between directional vectors.
     * @param out @zh 输出向量。 @en Output vector.
     * @param from @zh 起点向量。 @en Start vector.
     * @param to @zh 终点向量。 @en Destination vector.
     * @param t @zh 插值参数。@en Interpolation parameter.
     * @returns `out`
     * @description
     * @zh
     * - 如果 `from`、`to` 中任何一个接近零向量，则结果就是 `from` 到 `to` 线性插值的结果；
     *
     * - 否则，如果 `from`、`to` 方向刚好接近相反，
     * 则结果向量是满足以下条件的一个向量：结果向量和两个输入向量的夹角之比是 `t`，其长度是 `from` 到 `to` 的长度线性插值的结果；
     *
     * - 否则，结果是从标准化后的 `from` 到 标准化后的 `to`
     * 进行球面线性插值的结果乘以 `from` 到 `to` 的长度线性插值后的长度。
     * @en
     * - If either `from` or `to` is close to zero vector,
     * the result would be the (non-spherical) linear interpolation result from `from` to `to`.
     *
     * - Otherwise, if `from` and `to` have almost opposite directions,
     * the result would be such a vector so that:
     * The angle ratio between result vector and input vectors is `t`,
     * the length of result vector is the linear interpolation of lengths from `from` to `to`.
     *
     * - Otherwise, the result would be the spherical linear interpolation result
     * from normalized `from` to normalized `to`,
     * then scaled by linear interpolation of lengths from `from` to `to`.
     */
    static slerp: <Out extends IVec3Like>(out: Out, from: Readonly<IVec3Like>, to: Readonly<IVec3Like>, t: number) => Out;
    /**
     * @en Generates a uniformly distributed random vector points from center to the surface of the unit sphere
     * @zh 生成一个在单位球体上均匀分布的随机向量
     * @param scale vector length
     */
    static random<Out extends IVec3Like>(out: Out, scale?: number): Out;
    /**
     * @en Vector and fourth order matrix multiplication, will complete the vector with a fourth value as one
     * @zh 向量与四维矩阵乘法，默认向量第四位为 1。
     */
    static transformMat4<Out extends IVec3Like>(out: Out, a: IVec3Like, m: IMat4Like): Out;
    /**
     * @en Vector and fourth order matrix multiplication, will complete the vector with a fourth element as one
     * @zh 向量与四维矩阵乘法，默认向量第四位为 0。
     */
    static transformMat4Normal<Out extends IVec3Like>(out: Out, a: IVec3Like, m: IMat4Like): Out;
    /**
     * @en Vector and third order matrix multiplication
     * @zh 向量与三维矩阵乘法
     */
    static transformMat3<Out extends IVec3Like>(out: Out, a: IVec3Like, m: IMat3Like): Out;
    /**
     * @en Affine transformation vector
     * @zh 向量仿射变换
     */
    static transformAffine<Out extends IVec3Like>(out: Out, v: IVec3Like, m: IMat4Like): Out;
    /**
     * @en Vector quaternion multiplication: q*a*q^{-1}.
     * @zh 向量四元数乘法：q*a*q^{-1}。
     */
    static transformQuat<Out extends IVec3Like>(out: Out, a: IVec3Like, q: IQuatLike): Out;
    /**
     * @en Transforms the current vector with given scale, rotation and translation in order
     * @zh 以缩放 -> 旋转 -> 平移顺序变换向量
     */
    static transformRTS<Out extends IVec3Like>(out: Out, a: IVec3Like, r: IQuatLike, t: IVec3Like, s: IVec3Like): Out;
    /**
     * @en Transforms the current vector with given scale, rotation and translation in reverse order
     * @zh 以平移 -> 旋转 -> 缩放顺序逆变换向量
     */
    static transformInverseRTS<Out extends IVec3Like>(out: Out, a: IVec3Like, r: IQuatLike, t: IVec3Like, s: IVec3Like): Out;
    /**
     * @en Rotates the vector with specified angle around X axis
     * @zh 绕 X 轴旋转向量指定弧度
     * @param v rotation vector
     * @param o center of rotation
     * @param a radiance of rotation
     */
    static rotateX<Out extends IVec3Like>(out: Out, v: IVec3Like, o: IVec3Like, a: number): Out;
    /**
     * @en Rotates the vector with specified angle around Y axis
     * @zh 绕 Y 轴旋转向量指定弧度
     * @param v rotation vector
     * @param o center of rotation
     * @param a radiance of rotation
     */
    static rotateY<Out extends IVec3Like>(out: Out, v: IVec3Like, o: IVec3Like, a: number): Out;
    /**
     * @en Rotates the vector with specified angle around Z axis
     * @zh 绕 Z 轴旋转向量指定弧度
     * @param v rotation vector
     * @param o center of rotation
     * @param a radiance of rotation
     */
    static rotateZ<Out extends IVec3Like>(out: Out, v: IVec3Like, o: IVec3Like, a: number): Out;
    /**
     * @en Rotates the vector with specified angle around any n axis
     * @zh 绕任意 n 轴旋转向量指定弧度
     * @param v rotation vector
     * @param o center of rotation
     * @param n axis of rotation
     * @param a radiance of rotation
     */
    static rotateN<Out extends IVec3Like>(out: Out, v: IVec3Like, o: IVec3Like, n: IVec3Like, a: number): Out;
    /**
     * @en Converts the given vector to an array
     * @zh 向量转数组
     * @param ofs Array Start Offset
     */
    static toArray<Out extends IWritableArrayLike<number>>(out: Out, v: IVec3Like, ofs?: number): Out;
    /**
     * @en Converts the given array to a vector
     * @zh 数组转向量
     * @param ofs Array Start Offset
     */
    static fromArray<Out extends IVec3Like>(out: Out, arr: IWritableArrayLike<number>, ofs?: number): Out;
    /**
     * @en Check the equality of the two given vectors
     * @zh 向量等价判断
     */
    static strictEquals(a: IVec3Like, b: IVec3Like): boolean;
    /**
     * @en Check whether the two given vectors are approximately equivalent
     * @zh 排除浮点数误差的向量近似等价判断
     */
    static equals(a: IVec3Like, b: IVec3Like, epsilon?: number): boolean;
    /**
     * @en Calculates the radian angle between two vectors
     * @zh 求两向量夹角弧度
     */
    static angle(a: IVec3Like, b: IVec3Like): number;
    /**
     * @zh 计算 `a`、`b` 两向量之间的有符号夹角。
     *
     * 不妨假设 `a`、`b` 是钟表上的两根指针，其中 `a` 指向 12 点整，`normal` 是任何从钟表正面指出的向量。
     * 当 `b` **逆时针** 从 12 点走到 6 点的过程中，它们的角度变化范围为 (0°, 180°)；
     * 当 `b` **顺时针** 从 12 点走到 6 点的过程中，它们的角度变化范围为 (0°, -180°)。
     *
     * 反之，如果 `normal` 是任何从钟表反面指出的向量，两种范围将对调。
     *
     * @en Calculates the signed angle between the two vectors `a`, `b`.
     *
     * Suppose that `a` and `b` are two hands on a clock, where pointing at 12 o'clock,
     * and `normal` is arbitrary vector pointing out from the dial side of the clock.
     * As `b` goes counterclockwise from 12 o'clock to 6 o'clock, their angle varies in the range (0°, 180°);
     * As `b` goes clockwise from 12 o'clock to 6 o'clock, their angle varies in the range (0°, -180°).
     *
     * Instead, if `normal` is arbitrary vector pointing out from the opposite side of the clock,
     * the two ranges would swap.
     *
     * @param a @zh 向量 `a`。 @en The vector `a`.
     * @param b @zh 向量 `b`。 @en The vector `b`.
     * @param normal @zh 参考向量。 @en The reference vector.
     * @returns @zh 向量 `a` 和 `b` 之间的有符号夹角。 @en The signed angle between `a`, `b`.
     */
    static signedAngle: (a: Readonly<IVec3Like>, b: Readonly<IVec3Like>, normal: Readonly<IVec3Like>) => number;
    /**
     * @en Calculates the projection vector on the specified plane
     * @zh 计算向量在指定平面上的投影
     * @param a projection vector
     * @param n the normal line of specified plane
     */
    static projectOnPlane<Out extends IVec3Like>(out: Out, a: IVec3Like, n: IVec3Like): Out;
    /**
     * @en Calculates the projection on the specified vector
     * @zh 计算向量在指定向量上的投影
     * @param a projection vector
     * @param b target vector
     */
    static project<Out extends IVec3Like>(out: Out, a: IVec3Like, b: IVec3Like): Out;
    /**
     * @en Calculates a new position from current to target no more than `maxStep` distance.
     * @zh 计算一个新位置从当前位置移动不超过 `maxStep` 距离到目标位置。
     * @param current current position
     * @param target target position
     * @param maxStep maximum moving distance
     */
    static moveTowards<Out extends IVec3Like>(out: Out, current: IVec3Like, target: IVec3Like, maxStep: number): Out;
    /**
     * @zh 生成指定向量的一个正交单位向量。如果指定的向量 **精确地** 是零向量，则返回 **精确的** 零向量。
     * @en Generates an unit vector orthogonal to specified vector.
     * If the specified vector is **strictly** zero vector, the result is **strict** zero vector.
     * @param out @zh 生成的向量。@en The generated vector.
     * @param n @zh 输入向量。该向量 **不必** 是标准化的。 @en The input vector. **Need not** to be normalized.
     * @returns `out`
     */
    static generateOrthogonal<Out extends IVec3Like>(out: Out, n: Readonly<IVec3Like>): Out;
    /**
     * @en x component.
     * @zh x 分量。
     */
    x: number;
    /**
     * @en y component.
     * @zh y 分量。
     */
    y: number;
    /**
     * @en z component.
     * @zh z 分量。
     */
    z: number;
    constructor(v: Vec3);
    constructor(x?: number, y?: number, z?: number);
    /**
     * @en clone a Vec3 value
     * @zh 克隆当前向量。
     */
    clone(): Vec3;
    /**
     * @en Set the current vector value with the given vector.
     * @zh 设置当前向量使其与指定向量相等。
     * @param other Specified vector
     * @returns `this`
     */
    set(other: Vec3): Vec3;
    /**
     * @en Set the value of each component of the current vector.
     * @zh 设置当前向量的具体分量值。
     * @param x x value
     * @param y y value
     * @param z z value
     * @returns `this`
     */
    set(x?: number, y?: number, z?: number): Vec3;
    /**
     * @en Check whether the vector approximately equals another one.
     * @zh 判断当前向量是否在误差范围内与指定向量相等。
     * @param other Specified vector
     * @param epsilon The error allowed. It`s should be a non-negative number.
     * @returns Returns `true` when the components of both vectors are equal within the specified range of error; otherwise it returns `false`.
     */
    equals(other: Vec3, epsilon?: number): boolean;
    /**
     * @en Check whether the vector approximately equals another one.
     * @zh 判断当前向量是否在误差范围内与指定分量的向量相等。
     * @param x The x value of specified vector
     * @param y The y value of specified vector
     * @param z The z value of specified vector
     * @param epsilon The error allowed. It`s should be a non-negative number.
     * @returns Returns `true` when the components of both vectors are equal within the specified range of error; otherwise it returns `false`.
     */
    equals3f(x: number, y: number, z: number, epsilon?: number): boolean;
    /**
     * @en Check whether the current vector strictly equals another Vec3.
     * @zh 判断当前向量是否与指定向量相等。
     * @param other specified vector
     * @returns Returns `true` when the components of both vectors are equal within the specified range of error; otherwise it returns `false`.
     */
    strictEquals(other: Vec3): boolean;
    /**
     * @en Check whether the current vector strictly equals another Vec3.
     * @zh 判断当前向量是否与指定分量的向量相等。
     * @param x The x value of specified vector
     * @param y The y value of specified vector
     * @param z The z value of specified vector
     * @returns Returns `true` when the components of both vectors are equal within the specified range of error; otherwise it returns `false`.
     */
    strictEquals3f(x: number, y: number, z: number): boolean;
    /**
     * @en Transform to string with vector information.
     * @zh 返回当前向量的字符串表示。
     * @returns The string with vector information
     */
    toString(): string;
    /**
     * @en Calculate linear interpolation result between this vector and another one with given ratio.
     * @zh 根据指定的插值比率，从当前向量到目标向量之间做插值。
     * @param to Target vector
     * @param ratio The interpolation coefficient.The range is [0,1].
     */
    lerp(to: Vec3, ratio: number): Vec3;
    /**
     * @en Adds the current vector with another one and return this
     * @zh 向量加法。将当前向量与指定向量的相加
     * @param other specified vector
     */
    add(other: Vec3): Vec3;
    /**
     * @en Adds the current vector with another one and return this
     * @zh 向量加法。将当前向量与指定分量的向量相加
     * @param x The x value of specified vector
     * @param y The y value of specified vector
     * @param z The z value of specified vector
     */
    add3f(x: number, y: number, z: number): Vec3;
    /**
     * @en Subtracts one vector from this, and returns this.
     * @zh 向量减法。将当前向量减去指定向量的结果。
     * @param other specified vector
     */
    subtract(other: Vec3): Vec3;
    /**
     * @en Subtracts one vector from this, and returns this.
     * @zh 向量减法。将当前向量减去指定分量的向量
     * @param x The x value of specified vector
     * @param y The y value of specified vector
     * @param z The z value of specified vector
     */
    subtract3f(x: number, y: number, z: number): Vec3;
    /**
     * @en Multiplies the current vector with a number, and returns this.
     * @zh 向量数乘。将当前向量数乘指定标量
     * @param scalar scalar number
     */
    multiplyScalar(scalar: number): Vec3;
    /**
     * @en Multiplies the current vector with another one and return this
     * @zh 向量乘法。将当前向量乘以与指定向量的结果赋值给当前向量。
     * @param other specified vector
     */
    multiply(other: Vec3): Vec3;
    /**
     * @en Multiplies the current vector with another one and return this
     * @zh 向量乘法。将当前向量与指定分量的向量相乘的结果赋值给当前向量。
     * @param x The x value of specified vector
     * @param y The y value of specified vector
     * @param z The z value of specified vector
     */
    multiply3f(x: number, y: number, z: number): Vec3;
    /**
     * @en Element-wisely divides this vector with another one, and return this.
     * @zh 向量逐元素相除。将当前向量与指定分量的向量相除的结果赋值给当前向量。
     * @param other specified vector
     */
    divide(other: Vec3): Vec3;
    /**
     * @en Element-wisely divides this vector with another one, and return this.
     * @zh 向量逐元素相除。将当前向量与指定分量的向量相除的结果赋值给当前向量。
     * @param x The x value of specified vector
     * @param y The y value of specified vector
     * @param z The z value of specified vector
     */
    divide3f(x: number, y: number, z: number): Vec3;
    /**
     * @en Sets each component of this vector with its negative value
     * @zh 将当前向量的各个分量取反
     */
    negative(): Vec3;
    /**
     * @en Clamp the vector between minInclusive and maxInclusive.
     * @zh 设置当前向量的值，使其各个分量都处于指定的范围内。
     * @param minInclusive Minimum value allowed
     * @param maxInclusive Maximum value allowed
     * @returns `this`
     */
    clampf(minInclusive: Vec3, maxInclusive: Vec3): Vec3;
    /**
     * @en Calculates the dot product with another vector
     * @zh 向量点乘。
     * @param other specified vector
     * @returns The result of calculates the dot product with another vector
     */
    dot(other: Vec3): number;
    /**
     * @en Calculates the cross product with another vector.
     * @zh 向量叉乘。将当前向量左叉乘指定向量
     * @param other specified vector
     */
    cross(other: Vec3): Vec3;
    /**
     * @en Returns the length of this vector.
     * @zh 计算向量的长度（模）。
     * @returns Length of vector
     */
    length(): number;
    /**
     * @en Returns the squared length of this vector.
     * @zh 计算向量长度（模）的平方。
     * @returns the squared length of this vector
     */
    lengthSqr(): number;
    /**
     * @en Normalize the current vector.
     * @zh 将当前向量归一化
     */
    normalize(): Vec3;
    /**
     * @en Transforms the vec3 with a mat4. 4th vector component is implicitly '1'
     * @zh 将当前向量视为 w 分量为 1 的四维向量，应用四维矩阵变换到当前矩阵
     * @param matrix matrix to transform with
     */
    transformMat4(matrix: Mat4): Vec3;
    /**
     * @en Converts the current Vec3 object to a Vec2 object by adding a z-component of 0.
     * @zh 将当前的Vec3对象转换为一个z分量为0的Vec3对象。
     * @returns Vec2 @en A new Vec2 object created from the current Vec3 object with z-component ignored.
     * @zh 从当前的Vec3对象创建一个新的Vec2对象，丢弃z分量。
     */
    toVec2(): Vec2;
}
export declare function v3(other: Vec3): Vec3;
export declare function v3(x?: number, y?: number, z?: number): Vec3;
