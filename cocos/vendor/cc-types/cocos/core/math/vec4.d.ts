/// <reference types="./@types/globals" />
import { ValueType } from '../value-types/value-type';
import { Mat4 } from './mat4';
import { IMat4Like, IQuatLike, IVec4Like, IColorLike } from './type-define';
/**
 * @en Representation of four-dimensional vectors.
 * @zh 四维向量。
 */
export declare class Vec4 extends ValueType {
    static ZERO: Readonly<Vec4>;
    static ONE: Readonly<Vec4>;
    static NEG_ONE: Readonly<Vec4>;
    static UNIT_X: Readonly<Vec4>;
    static UNIT_Y: Readonly<Vec4>;
    static UNIT_Z: Readonly<Vec4>;
    static UNIT_W: Readonly<Vec4>;
    /**
     * @en Obtains a clone of the given vector object
     * @zh 获得指定向量的拷贝
     */
    static clone<Out extends IVec4Like>(a: Out): Vec4;
    /**
     * @en Copy the target vector and save the results to out vector object
     * @zh 复制目标向量
     */
    static copy<Out extends IVec4Like>(out: Out, a: Out): Out;
    /**
     * @en Sets the out vector with the given x, y, z and w values
     * @zh 设置向量值
     */
    static set<Out extends IVec4Like>(out: Out, x: number, y: number, z: number, w: number): Out;
    /**
     * @en set value from color
     * @zh 从颜色值设置向量
     * @param out
     * @param color
     */
    static fromColor<Out extends IVec4Like>(out: Out, color: IColorLike): Out;
    /**
     * @en The angle between two vectors
     * @zh 两个向量之间的夹角
     */
    static angle<Out extends IVec4Like>(a: Out, b: Out): number;
    /**
     * @en Element-wise vector addition and save the results to out vector object
     * @zh 逐元素向量加法
     */
    static add<Out extends IVec4Like>(out: Out, a: Out, b: Out): Out;
    /**
     * @en Element-wise vector subtraction and save the results to out vector object
     * @zh 逐元素向量减法
     */
    static subtract<Out extends IVec4Like>(out: Out, a: Out, b: Out): Out;
    /**
     * @en Element-wise vector multiplication and save the results to out vector object
     * @zh 逐元素向量乘法
     */
    static multiply<Out extends IVec4Like>(out: Out, a: Out, b: Out): Out;
    /**
     * @en Element-wise vector division and save the results to out vector object
     * @zh 逐元素向量除法
     */
    static divide<Out extends IVec4Like>(out: Out, a: Out, b: Out): Out;
    /**
     * @en Rounds up by elements of the vector and save the results to out vector object
     * @zh 逐元素向量向上取整
     */
    static ceil<Out extends IVec4Like>(out: Out, a: Out): Out;
    /**
     * @en Element-wise rounds down of the current vector and save the results to the out vector
     * @zh 逐元素向量向下取整
     */
    static floor<Out extends IVec4Like>(out: Out, a: Out): Out;
    /**
     * @en Calculates the minimum values by elements of the vector and save the results to the out vector
     * @zh 逐元素向量最小值
     */
    static min<Out extends IVec4Like>(out: Out, a: Out, b: Out): Out;
    /**
     * @en Calculates the maximum values by elements of the vector and save the results to the out vector
     * @zh 逐元素向量最大值
     */
    static max<Out extends IVec4Like>(out: Out, a: Out, b: Out): Out;
    /**
     * @en Calculates element-wise round results and save to the out vector
     * @zh 逐元素向量四舍五入取整
     */
    static round<Out extends IVec4Like>(out: Out, a: Out): Out;
    /**
     * @en Vector scalar multiplication and save the results to out vector object
     * @zh 向量标量乘法
     */
    static multiplyScalar<Out extends IVec4Like>(out: Out, a: Out, b: number): Out;
    /**
     * @en Element-wise multiplication and addition with the equation: a + b * scale
     * @zh 逐元素向量乘加: A + B * scale
     */
    static scaleAndAdd<Out extends IVec4Like>(out: Out, a: Out, b: Out, scale: number): Out;
    /**
     * @en Calculates the euclidean distance of two vectors
     * @zh 求两向量的欧氏距离
     */
    static distance<Out extends IVec4Like>(a: Out, b: Out): number;
    /**
     * @en Calculates the squared euclidean distance of two vectors
     * @zh 求两向量的欧氏距离平方
     */
    static squaredDistance<Out extends IVec4Like>(a: Out, b: Out): number;
    /**
     * @en Calculates the length of the vector
     * @zh 求向量长度
     */
    static len<Out extends IVec4Like>(a: Out): number;
    /**
     * @en Calculates the squared length of the vector
     * @zh 求向量长度平方
     */
    static lengthSqr<Out extends IVec4Like>(a: Out): number;
    /**
     * @en Sets each element to its negative value
     * @zh 逐元素向量取负
     */
    static negate<Out extends IVec4Like>(out: Out, a: Out): Out;
    /**
     * @en Sets each element to its inverse value, zero value will become Infinity
     * @zh 逐元素向量取倒数，接近 0 时返回 Infinity
     */
    static inverse<Out extends IVec4Like>(out: Out, a: Out): Out;
    /**
     * @en Sets each element to its inverse value, zero value will remain zero
     * @zh 逐元素向量取倒数，接近 0 时返回 0
     */
    static inverseSafe<Out extends IVec4Like>(out: Out, a: Out): Out;
    /**
     * @en Sets the normalized vector to the out vector, returns a zero vector if input is a zero vector.
     * @zh 归一化向量，输入零向量将会返回零向量。
     */
    static normalize<Out extends IVec4Like>(out: Out, a: Out): Out;
    /**
     * @en Calculates the dot product of the vector
     * @zh 向量点积（数量积）
     */
    static dot<Out extends IVec4Like>(a: Out, b: Out): number;
    /**
     * @en Calculates the linear interpolation between two vectors with a given ratio
     * @zh 逐元素向量线性插值： A + t * (B - A)
     */
    static lerp<Out extends IVec4Like>(out: Out, a: Out, b: Out, t: number): Out;
    /**
     * @en Scales all ell elements of this vector by the specified scalar value
     * @zh 逐元素向量缩放
     */
    static scale<Out extends IVec4Like>(out: Out, a: Out, b: number): Out;
    /**
     * @en Generates a uniformly distributed random vector points from center to the surface of the unit sphere
     * @zh 生成一个在单位球体上均匀分布的随机向量
     * @param scale vector length
     */
    static random<Out extends IVec4Like>(out: Out, scale?: number): Out;
    /**
     * @en Vector and fourth order matrix multiplication
     * @zh 向量与四维矩阵乘法
     */
    static transformMat4<Out extends IVec4Like, MatLike extends IMat4Like>(out: Out, a: Out, m: MatLike): Out;
    /**
     * @en Transform the vector with the given affine transformation
     * @zh 向量仿射变换
     */
    static transformAffine<Out extends IVec4Like, VecLike extends IVec4Like, MatLike extends IMat4Like>(out: Out, v: VecLike, m: MatLike): Out;
    /**
     * @en Vector quaternion multiplication
     * @zh 向量四元数乘法
     */
    static transformQuat<Out extends IVec4Like, QuatLike extends IQuatLike>(out: Out, a: Out, q: QuatLike): Out;
    /**
     * @en Converts the given vector to an array
     * @zh 向量转数组
     * @param ofs Array Start Offset
     */
    static toArray<Out extends IWritableArrayLike<number>>(out: Out, v: IVec4Like, ofs?: number): Out;
    /**
     * @en Converts the given array to a vector
     * @zh 数组转向量
     * @param ofs Array Start Offset
     */
    static fromArray<Out extends IVec4Like>(out: Out, arr: IWritableArrayLike<number>, ofs?: number): Out;
    /**
     * @en Check the equality of the two given vectors
     * @zh 向量等价判断
     */
    static strictEquals<Out extends IVec4Like>(a: Out, b: Out): boolean;
    /**
     * @en Check whether the two given vectors are approximately equivalent
     * @zh 排除浮点数误差的向量近似等价判断
     */
    static equals<Out extends IVec4Like>(a: Out, b: Out, epsilon?: number): boolean;
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
    /**
     * @en w component.
     * @zh w 分量。
     */
    w: number;
    constructor(other: Vec4);
    constructor(x?: number, y?: number, z?: number, w?: number);
    /**
     * @en clone the current Vec4 value.
     * @zh 克隆当前向量。
     */
    clone(): Vec4;
    /**
     * @en Set the current vector value with the given vector.
     * @zh 设置当前向量使其与指定向量相等。
     * @param other Specified vector
     * @returns `this`
     */
    set(other: Vec4): Vec4;
    /**
     * @en Set the value of each component of the current vector.
     * @zh 设置当前向量的具体分量值。
     * @param x x value
     * @param y y value
     * @param z z value
     * @param w w value
     * @returns `this`
     */
    set(x?: number, y?: number, z?: number, w?: number): Vec4;
    /**
     * @en Check whether the vector approximately equals another one.
     * @zh 判断当前向量是否在误差范围内与指定向量相等。
     * @param other Specified vector
     * @param epsilon The error allowed. It`s should be a non-negative number.
     * @returns Returns `true` when the components of both vectors are equal within the specified range of error; otherwise it returns `false`.
     */
    equals(other: Vec4, epsilon?: number): boolean;
    /**
     * @en Check whether the vector approximately equals another one.
     * @zh 判断当前向量是否在误差范围内与指定分量的向量相等。
     * @param x The x value of specified vector
     * @param y The y value of specified vector
     * @param z The z value of specified vector
     * @param w The w value of specified vector
     * @param epsilon The error allowed. It`s should be a non-negative number.
     * @returns Returns `true` when the components of both vectors are equal within the specified range of error; otherwise it returns `false`.
     */
    equals4f(x: number, y: number, z: number, w: number, epsilon?: number): boolean;
    /**
     * @en Check whether the current vector strictly equals another Vec4.
     * @zh 判断当前向量是否与指定向量相等。
     * @param other specified vector
     * @returns Returns `true` when the components of both vectors are equal within the specified range of error; otherwise it returns `false`.
     */
    strictEquals(other: Vec4): boolean;
    /**
     * @en Check whether the current vector strictly equals another Vec4.
     * @zh 判断当前向量是否与指定分量的向量相等。
     * @param x The x value of specified vector
     * @param y The y value of specified vector
     * @param z The z value of specified vector
     * @param w The w value of specified vector
     * @returns Returns `true` when the components of both vectors are equal within the specified range of error; otherwise it returns `false`.
     */
    strictEquals4f(x: number, y: number, z: number, w: number): boolean;
    /**
     * @en Calculate linear interpolation result between this vector and another one with given ratio.
     * @zh 根据指定的插值比率，从当前向量到目标向量之间做插值。
     * @param to Target vector
     * @param ratio The interpolation coefficient.The range is [0,1].
     */
    lerp(to: Vec4, ratio: number): Vec4;
    /**
     * @en Return the information of the vector in string
     * @zh 返回当前向量的字符串表示。
     * @returns The string with vector information
     */
    toString(): string;
    /**
     * @en Clamp the vector between minInclusive and maxInclusive.
     * @zh 设置当前向量的值，使其各个分量都处于指定的范围内。
     * @param minInclusive Minimum value allowed
     * @param maxInclusive Maximum value allowed
     * @returns `this`
     */
    clampf(minInclusive: Vec4, maxInclusive: Vec4): Vec4;
    /**
     * @en Adds the current vector with another one and return this
     * @zh 向量加法。将当前向量与指定向量的相加
     * @param other specified vector
     */
    add(other: Vec4): Vec4;
    /**
     * @en Adds the current vector with another one and return this
     * @zh 向量加法。将当前向量与指定分量的向量相加
     * @param x The x value of specified vector
     * @param y The y value of specified vector
     * @param z The z value of specified vector
     * @param w The w value of specified vector
     */
    add4f(x: number, y: number, z: number, w: number): Vec4;
    /**
     * @en Subtracts one vector from this, and returns this.
     * @zh 向量减法。将当前向量减去指定向量
     * @param other specified vector
     */
    subtract(other: Vec4): Vec4;
    /**
     * @en Subtracts one vector from this, and returns this.
     * @zh 向量减法。将当前向量减去指定分量的向量
     * @param x The x value of specified vector
     * @param y The y value of specified vector
     * @param z The z value of specified vector
     * @param w The w value of specified vector
     */
    subtract4f(x: number, y: number, z: number, w: number): Vec4;
    /**
     * @en Multiplies the current vector with a number, and returns this.
     * @zh 向量数乘。将当前向量数乘指定标量
     * @param scalar scalar number
     */
    multiplyScalar(scalar: number): Vec4;
    /**
     * @en Multiplies the current vector with another one and return this
     * @zh 向量乘法。将当前向量乘以指定向量
     * @param other specified vector
     */
    multiply(other: Vec4): Vec4;
    /**
     * @en Multiplies the current vector with another one and return this
     * @zh 向量乘法。将当前向量与指定分量的向量相乘的结果赋值给当前向量。
     * @param x The x value of specified vector
     * @param y The y value of specified vector
     * @param z The z value of specified vector
     * @param w The w value of specified vector
     */
    multiply4f(x: number, y: number, z: number, w: number): Vec4;
    /**
     * @en Element-wisely divides this vector with another one, and return this.
     * @zh 向量逐元素相除。将当前向量与指定分量的向量相除的结果赋值给当前向量。
     * @param other specified vector
     */
    divide(other: Vec4): Vec4;
    /**
     * @en Element-wisely divides this vector with another one, and return this.
     * @zh 向量逐元素相除。将当前向量与指定分量的向量相除的结果赋值给当前向量。
     * @param x The x value of specified vector
     * @param y The y value of specified vector
     * @param z The z value of specified vector
     * @param w The w value of specified vector
     */
    divide4f(x: number, y: number, z: number, w: number): Vec4;
    /**
     * @en Sets each component of this vector with its negative value
     * @zh 将当前向量的各个分量取反
     */
    negative(): Vec4;
    /**
     * @en Calculates the dot product with another vector
     * @zh 向量点乘。
     * @param other specified vector
     * @returns 当前向量与指定向量点乘的结果。
     */
    dot(vector: Vec4): number;
    /**
     * @en Calculates the cross product with another vector.
     * @zh 向量叉乘。视当前向量和指定向量为三维向量（舍弃 w 分量），将当前向量左叉乘指定向量
     * @param other specified vector
     *
     * @deprecated since v3.8 cross product only defined in 3D space, use [[Vec3.cross]] instead.
     */
    cross(vector: Vec4): Vec4;
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
    normalize(): Vec4;
    /**
     * @en Scales the current vector by a scalar number.
     * @zh 向量数乘。
     */
    scale(scalar: number): Vec4;
    /**
     * @en Transforms the vec4 with a mat4
     * @zh 应用四维矩阵变换到当前矩阵
     * @param matrix matrix to transform with
     */
    transformMat4(matrix: Mat4): Vec4;
}
export declare function v4(other: Vec4): Vec4;
export declare function v4(x?: number, y?: number, z?: number, w?: number): Vec4;
