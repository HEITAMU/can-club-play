/// <reference types="./@types/globals" />
import { ValueType } from '../value-types/value-type';
import { Mat4 } from './mat4';
import { IMat3Like, IMat4Like, IVec2Like } from './type-define';
import { Vec3 } from './vec3';
/**
 * @en Representation of 2D vectors and points.
 * @zh 二维向量。
 */
export declare class Vec2 extends ValueType {
    static ZERO: Readonly<Vec2>;
    static ONE: Readonly<Vec2>;
    static NEG_ONE: Readonly<Vec2>;
    static UNIT_X: Readonly<Vec2>;
    static UNIT_Y: Readonly<Vec2>;
    /**
     * @en Obtains a clone of the given vector object
     * @zh 获得指定向量的拷贝
     */
    static clone<Out extends IVec2Like>(a: Out): Vec2;
    /**
     * @en Copy the target vector and save the results to out vector object
     * @zh 复制目标向量
     */
    static copy<Out extends IVec2Like>(out: Out, a: Out): Out;
    /**
     * @en Sets the out vector with the given x and y values
     * @zh 设置向量值
     */
    static set<Out extends IVec2Like>(out: Out, x: number, y: number): Out;
    /**
     * @en Element-wise vector addition and save the results to out vector object
     * @zh 逐元素向量加法
     */
    static add<Out extends IVec2Like>(out: Out, a: Out, b: Out): Out;
    /**
     * @en Element-wise vector subtraction and save the results to out vector object
     * @zh 逐元素向量减法
     */
    static subtract<Out extends IVec2Like>(out: Out, a: Out, b: Out): Out;
    /**
     * @en Element-wise vector multiplication and save the results to out vector object
     * @zh 逐元素向量乘法
     */
    static multiply<Out extends IVec2Like>(out: Out, a: Out, b: Out): Out;
    /**
     * @en Element-wise vector division and save the results to out vector object
     * @zh 逐元素向量除法
     */
    static divide<Out extends IVec2Like>(out: Out, a: Out, b: Out): Out;
    /**
     * @en Rounds up by elements of the vector and save the results to out vector object
     * @zh 逐元素向量向上取整
     */
    static ceil<Out extends IVec2Like>(out: Out, a: Out): Out;
    /**
     * @en Element-wise rounds down of the current vector and save the results to the out vector
     * @zh 逐元素向量向下取整
     */
    static floor<Out extends IVec2Like>(out: Out, a: Out): Out;
    /**
     * @en Calculates element-wise minimum values and save to the out vector
     * @zh 逐元素向量最小值
     */
    static min<Out extends IVec2Like>(out: Out, a: Out, b: Out): Out;
    /**
     * @en Calculates element-wise maximum values and save to the out vector
     * @zh 逐元素向量最大值
     */
    static max<Out extends IVec2Like>(out: Out, a: Out, b: Out): Out;
    /**
     * @en Calculates element-wise round results and save to the out vector
     * @zh 逐元素向量四舍五入取整
     */
    static round<Out extends IVec2Like>(out: Out, a: Out): Out;
    /**
     * @en Vector scalar multiplication and save the results to out vector object
     * @zh 向量标量乘法
     */
    static multiplyScalar<Out extends IVec2Like>(out: Out, a: Out, b: number): Out;
    /**
     * @en Element-wise multiplication and addition with the equation: a + b * scale
     * @zh 逐元素向量乘加: A + B * scale
     */
    static scaleAndAdd<Out extends IVec2Like>(out: Out, a: Out, b: Out, scale: number): Out;
    /**
     * @en Calculates the euclidean distance of two vectors
     * @zh 求两向量的欧氏距离
     */
    static distance<Out extends IVec2Like>(a: Out, b: Out): number;
    /**
     * @en Calculates the squared euclidean distance of two vectors
     * @zh 求两向量的欧氏距离平方
     */
    static squaredDistance<Out extends IVec2Like>(a: Out, b: Out): number;
    /**
     * @en Calculates the length of the vector
     * @zh 求向量长度
     */
    static len<Out extends IVec2Like>(a: Out): number;
    /**
     * @en Calculates the squared length of the vector
     * @zh 求向量长度平方
     */
    static lengthSqr<Out extends IVec2Like>(a: Out): number;
    /**
     * @en Sets each element to its negative value
     * @zh 逐元素向量取负
     */
    static negate<Out extends IVec2Like>(out: Out, a: Out): Out;
    /**
     * @en Sets each element to its inverse value, zero value will become Infinity
     * @zh 逐元素向量取倒数，接近 0 时返回 Infinity
     */
    static inverse<Out extends IVec2Like>(out: Out, a: Out): Out;
    /**
     * @en Sets each element to its inverse value, zero value will remain zero
     * @zh 逐元素向量取倒数，接近 0 时返回 0
     */
    static inverseSafe<Out extends IVec2Like>(out: Out, a: Out): Out;
    /**
     * @en Sets the normalized vector to the out vector, returns a zero vector if input is a zero vector.
     * @zh 归一化向量，输入零向量将会返回零向量。
     */
    static normalize<Out extends IVec2Like, Vec2Like extends IVec2Like>(out: Out, a: Vec2Like): Out;
    /**
     * @en Calculates the dot product of the vector
     * @zh 向量点积（数量积）
     */
    static dot<Out extends IVec2Like>(a: Out, b: Out): number;
    /**
     * @en Calculates the cross product of the vector
     * @zh 向量叉积（向量积），注意二维向量的叉积为与 Z 轴平行的三维向量
     * @override (a:Vec2, b:Vec2) => number
     * @override [deprecated] (out:Vec3, a:Vec2, b:Vec2) => Vec3
     */
    static cross(a: IVec2Like, b: IVec2Like): number;
    /**
     * @deprecated Consider use another overrides please.
     */
    static cross<Out extends IVec2Like>(out: Vec3, a: Out, b: Out): Vec3;
    /**
     * @en Calculates the linear interpolation between two vectors with a given ratio: A + t * (B - A)
     * @zh 逐元素向量线性插值： A + t * (B - A)
     */
    static lerp<Out extends IVec2Like>(out: Out, a: Out, b: Out, t: number): Out;
    /**
     * @en Generates a uniformly distributed random vector points from center to the surface of the unit sphere
     * @zh 生成一个在单位圆上均匀分布的随机向量
     * @param scale vector length
     */
    static random<Out extends IVec2Like>(out: Out, scale?: number): Out;
    /**
     * @en Vector and third order matrix multiplication, will complete the vector with a third value as one
     * @zh 向量与三维矩阵乘法，默认向量第三位为 1。
     */
    static transformMat3<Out extends IVec2Like, MatLike extends IMat3Like>(out: Out, a: Out, m: IMat3Like): Out;
    /**
     * @en Vector and third order matrix multiplication, will complete the vector with a third and a fourth element as one
     * @zh 向量与四维矩阵乘法，默认向量第三位为 0，第四位为 1。
     */
    static transformMat4<Out extends IVec2Like, MatLike extends IMat4Like>(out: Out, a: Out, m: IMat4Like): Out;
    /**
     * @en Gets the string representation of the given vector
     * @zh 返回向量的字符串表示
     */
    static str<Out extends IVec2Like>(a: Out): string;
    /**
     * @en Converts the given vector to an array
     * @zh 向量转数组
     * @param ofs Array Start Offset
     */
    static toArray<Out extends IWritableArrayLike<number>>(out: Out, v: IVec2Like, ofs?: number): Out;
    /**
     * @en Converts the given array to a vector
     * @zh 数组转向量
     * @param ofs Array Start Offset
     */
    static fromArray<Out extends IVec2Like>(out: Out, arr: IWritableArrayLike<number>, ofs?: number): Out;
    /**
     * @en Check the equality of the two given vectors
     * @zh 向量等价判断
     */
    static strictEquals<Out extends IVec2Like>(a: Out, b: Out): boolean;
    /**
     * @en Check whether the two given vectors are approximately equivalent
     * @zh 排除浮点数误差的向量近似等价判断
     */
    static equals<Out extends IVec2Like>(a: Out, b: Out, epsilon?: number): boolean;
    /**
     * @en Calculates the radian angle between two vectors, returns zero if either vector is a zero vector.
     * @zh 求两向量夹角弧度，任意一个向量是零向量则返回零。
     */
    static angle<Out extends IVec2Like>(a: Out, b: Out): number;
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
    constructor(other: Vec2);
    constructor(x?: number, y?: number);
    /**
     * @en clone a Vec2 value
     * @zh 克隆当前向量。
     */
    clone(): Vec2;
    /**
     * @en Set the current vector value with the given vector.
     * @zh 设置当前向量使其与指定向量相等。
     * @param other Specified vector
     * @return `this`
     */
    set(other: Vec2): Vec2;
    /**
     * @en Set the value of each component of the current vector.
     * @zh 设置当前向量的具体分量值。
     * @param x x value
     * @param y y value
     * @return `this`
     */
    set(x?: number, y?: number): Vec2;
    /**
     * @en Check whether the vector approximately equals another one.
     * @zh 判断当前向量是否在误差范围内与指定向量相等。
     * @param other Specified vector
     * @param epsilon The error allowed. It`s should be a non-negative number.
     * @return Returns `true` when the components of both vectors are equal within the specified range of error; otherwise it returns `false`.
     */
    equals(other: Vec2, epsilon?: number): boolean;
    /**
     * @en Check whether the vector approximately equals another one.
     * @zh 判断当前向量是否在误差范围内与指定分量的向量相等。
     * @param x The x value of specified vector
     * @param y The y value of specified vector
     * @param epsilon The error allowed. It`s should be a non-negative number.
     * @return Returns `true` when the components of both vectors are equal within the specified range of error; otherwise it returns `false`.
     */
    equals2f(x: number, y: number, epsilon?: number): boolean;
    /**
     * @en Check whether the current vector strictly equals another Vec2.
     * @zh 判断当前向量是否与指定向量相等。
     * @param other specified vector
     * @return Returns `true` when the components of both vectors are equal within the specified range of error; otherwise it returns `false`.
     */
    strictEquals(other: Vec2): boolean;
    /**
     * @en Check whether the current vector strictly equals another Vec2.
     * @zh 判断当前向量是否与指定分量的向量相等。
     * @param x The x value of specified vector
     * @param y The y value of specified vector
     * @return Returns `true` when the components of both vectors are equal within the specified range of error; otherwise it returns `false`.
     */
    strictEquals2f(x: number, y: number): boolean;
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
    lerp(to: Vec2, ratio: number): Vec2;
    /**
     * @en Clamp the vector between minInclusive and maxInclusive.
     * @zh 设置当前向量的值，使其各个分量都处于指定的范围内。
     * @param minInclusive Minimum value allowed
     * @param maxInclusive Maximum value allowed
     * @return `this`
     */
    clampf(minInclusive: Vec2, maxInclusive: Vec2): Vec2;
    /**
     * @en Adds the current vector with another one and return this
     * @zh 向量加法。将当前向量与指定向量的相加
     * @param other specified vector
     */
    add(other: Vec2): Vec2;
    /**
     * @en Adds the current vector with another one and return this
     * @zh 向量加法。将当前向量与指定分量的向量相加
     * @param x The x value of specified vector
     * @param y The y value of specified vector
     */
    add2f(x: number, y: number): Vec2;
    /**
     * @en Subtracts one vector from this, and returns this.
     * @zh 向量减法。将当前向量减去指定向量
     * @param other specified vector
     */
    subtract(other: Vec2): Vec2;
    /**
     * @en Subtracts one vector from this, and returns this.
     * @zh 向量减法。将当前向量减去指定分量的向量
     * @param x The x value of specified vector
     * @param y The y value of specified vector
     */
    subtract2f(x: number, y: number): Vec2;
    /**
     * @en Multiplies the current vector with a number, and returns this.
     * @zh 向量数乘。将当前向量数乘指定标量
     * @param scalar scalar number
     */
    multiplyScalar(scalar: number): Vec2;
    /**
     * @en Multiplies the current vector with another one and return this
     * @zh 向量乘法。将当前向量乘以与指定向量的结果赋值给当前向量。
     * @param other specified vector
     */
    multiply(other: Vec2): Vec2;
    /**
     * @en Multiplies the current vector with another one and return this
     * @zh 向量乘法。将当前向量与指定分量的向量相乘的结果赋值给当前向量。
     * @param x The x value of specified vector
     * @param y The y value of specified vector
     */
    multiply2f(x: number, y: number): Vec2;
    /**
     * @en Element-wisely divides this vector with another one, and return this.
     * @zh 向量逐元素相除。将当前向量与指定分量的向量相除的结果赋值给当前向量。
     * @param other specified vector
     */
    divide(other: Vec2): Vec2;
    /**
     * @en Element-wisely divides this vector with another one, and return this.
     * @zh 向量逐元素相除。将当前向量与指定分量的向量相除的结果赋值给当前向量。
     * @param x The x value of specified vector
     * @param y The y value of specified vector
     */
    divide2f(x: number, y: number): Vec2;
    /**
     * @en Sets each component of this vector with its negative value
     * @zh 将当前向量的各个分量取反
     */
    negative(): Vec2;
    /**
     * @en Calculates the dot product with another vector
     * @zh 向量点乘。
     * @param other specified vector
     * @return The result of calculates the dot product with another vector
     */
    dot(other: Vec2): number;
    /**
     * @en Calculates the cross product with another vector.
     * @zh 向量叉乘。
     * @param other specified vector
     * @return `out`
     */
    cross(other: Vec2): number;
    /**
     * @en Returns the length of this vector.
     * @zh 计算向量的长度（模）。
     * @return Length of vector
     */
    length(): number;
    /**
     * @en Returns the squared length of this vector.
     * @zh 计算向量长度（模）的平方。
     * @return the squared length of this vector
     */
    lengthSqr(): number;
    /**
     * @en Normalize the current vector.
     * @zh 将当前向量归一化。
     */
    normalize(): Vec2;
    /**
     * @en Calculates radian angle between two vectors, returns zero if either vector is a zero vector.
     * @zh 获取当前向量和指定向量之间的弧度，任意一个向量是零向量则返回零。
     * @param other specified vector.
     * @return The angle between the current vector and the specified vector.
     */
    angle(other: Vec2): number;
    /**
     * @en Get angle in radian between this and vector with direction.
     * @zh 获取当前向量和指定向量之间的有符号弧度。<br/>
     * 有符号弧度的取值范围为 (-PI, PI]，当前向量可以通过逆时针旋转有符号角度与指定向量同向。<br/>
     * @param other specified vector
     * @return The signed angle between the current vector and the specified vector (in radians);
     * if there is a zero vector in the current vector and the specified vector, 0 is returned.
     */
    signAngle(other: Vec2): number;
    /**
     * @en Rotates the current vector by an angle in radian value. Counterclockwise is the positive direction.
     * @zh 将当前向量进行旋转，逆时针为正方向。
     * @param radians radians of rotation.
     */
    rotate(radians: number): Vec2;
    /**
     * @en Projects the current vector on another one
     * @zh 计算当前向量在指定向量上的投影向量。
     * @param other specified vector
     */
    project(other: Vec2): Vec2;
    /**
     * @en Transforms the vec2 with a mat4. 3rd vector component is implicitly '0', 4th vector component is implicitly '1'
     * @zh 将当前向量视为 z 分量为 0、w 分量为 1 的四维向量，<br/>
     * 应用四维矩阵变换到当前矩阵<br/>
     * @param matrix matrix to transform with
     */
    transformMat4(matrix: Mat4): Vec2;
    /**
     * @en Converts the current Vec2 object to a Vec3 object by adding a z-component of 0.
     * @zh 将当前的Vec2对象转换为一个z分量为0的Vec3对象。
     * @returns Vec3 @en A new Vec3 object created from the current Vec2 object with z-component set to 0.
     * @zh 从当前的Vec2对象创建一个新的Vec3对象，其中z分量设置为0。
     */
    toVec3(): Vec3;
}
export declare function v2(other: Vec2): Vec2;
export declare function v2(x?: number, y?: number): Vec2;
