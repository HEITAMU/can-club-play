/// <reference types="./@types/globals" />
import { ValueType } from '../value-types/value-type';
import { Quat } from './quat';
import { IMat3Like, IMat4Like, IQuatLike, IVec2Like, IVec3Like } from './type-define';
import { Vec3 } from './vec3';
/**
 * @en Mathematical 3x3 matrix.
 * @zh 表示三维（3x3）矩阵。
 */
export declare class Mat3 extends ValueType {
    static IDENTITY: Readonly<Mat3>;
    /**
     * @en Clone a matrix and save the results to out matrix
     * @zh 获得指定矩阵的拷贝
     */
    static clone<Out extends IMat3Like>(a: Out): Mat3;
    /**
     * @en Copy content of a matrix into another and save the results to out matrix
     * @zh 复制目标矩阵
     */
    static copy<Out extends IMat3Like>(out: Out, a: Out): Out;
    /**
     * @en Sets the elements of a matrix with the given values and save the results to out matrix
     * @zh 设置矩阵值
     */
    static set<Out extends IMat3Like>(out: Out, m00: number, m01: number, m02: number, m03: number, m04: number, m05: number, m06: number, m07: number, m08: number): Out;
    /**
     * @en Reset the out matrix to an identity matrix
     * @zh 将目标赋值为单位矩阵
     */
    static identity<Out extends IMat3Like>(out: Out): Out;
    /**
     * @en Transposes a matrix and save the results to out matrix
     * @zh 转置矩阵
     */
    static transpose<Out extends IMat3Like>(out: Out, a: Out): Out;
    /**
     * @en Inverts a matrix. When matrix is not invertible the matrix will be set to zeros.
     * @zh 矩阵求逆，注意，在矩阵不可逆时，会返回一个全为 0 的矩阵。
     */
    static invert<Out extends IMat3Like>(out: Out, a: Out): Out;
    /**
     * @en Calculates the determinant of a matrix
     * @zh 矩阵行列式
     */
    static determinant<Out extends IMat3Like>(a: Out): number;
    /**
     * @en Multiply two matrices explicitly and save the results to out matrix: a * b
     * @zh 矩阵乘法：a * b
     */
    static multiply<Out extends IMat3Like>(out: Out, a: Out, b: Out): Out;
    /**
     * @en Take the first third order of the fourth order matrix and multiply by the third order matrix: a * b
     * @zh 取四阶矩阵的前三阶，与三阶矩阵相乘：a * b
     */
    static multiplyMat4<Out extends IMat3Like>(out: Out, a: Out, b: IMat4Like): Out;
    /**
     * @en Multiply a matrix with a translation vector given by a translation offset, first translate, then transform：a * T(v).
     * @zh 在给定矩阵变换基础上加入位移变换，先位移，再变换，即a * T(v)。
     */
    /**
     * @deprecated since v3.8.0, the function name is misleading, please use translate instead.
     */
    static transform<Out extends IMat3Like, VecLike extends IVec3Like>(out: Out, a: Out, v: VecLike): void;
    /**
     * @en Multiply a matrix with a translation vector given by a translation offset, first translate, then transform：a * T(v).
     * @zh 在给定矩阵变换基础上加入位移变换，先位移，再变换，即a * T(v)。
     */
    static translate<Out extends IMat3Like, VecLike extends IVec3Like>(out: Out, a: Out, v: VecLike): Out;
    /**
     * @en Multiply a matrix with a scale matrix given by a scale vector and save the results to out matrix, first scale, then transform：a * S(v).
     * @zh 在给定矩阵变换基础上加入新缩放变换，先缩放，再变换，即a * S(v)。
     */
    static scale<Out extends IMat3Like, VecLike extends IVec3Like>(out: Out, a: Out, v: VecLike): Out;
    /**
     * @en Rotates the transform by the given angle and save the results into the out matrix, first rotate, then transform：a * R(rad).
     * @zh 在给定矩阵变换基础上加入新旋转变换，先旋转，再变换，即a * R(rad)。
     * @param rad radian of rotation
     */
    static rotate<Out extends IMat3Like>(out: Out, a: Out, rad: number): Out;
    /**
     * @en Copies the first third order matrix of a fourth order matrix to the out third order matrix
     * @zh 取四阶矩阵的前三阶
     */
    static fromMat4<Out extends IMat3Like>(out: Out, a: IMat4Like): Out;
    /**
     * @en Sets a third order matrix with view direction and up direction. Then save the results to out matrix
     * @zh 根据视口前方向和上方向计算矩阵
     * @param view The view direction, it`s must be normalized.
     * @param up The view up direction, it`s must be normalized, default value is (0, 1, 0).
     */
    static fromViewUp<Out extends IMat3Like, VecLike extends IVec3Like>(out: Out, view: VecLike, up?: Vec3): Out;
    /**
     * @en Sets the given matrix with a translation vector and save the results to out matrix
     * @zh 计算位移矩阵
     */
    static fromTranslation<Out extends IMat3Like, VecLike extends IVec2Like>(out: Out, v: VecLike): Out;
    /**
     * @en Sets the given matrix with a scale vector and save the results to out matrix
     * @zh 计算缩放矩阵
     */
    static fromScaling<Out extends IMat3Like, VecLike extends IVec2Like>(out: Out, v: VecLike): Out;
    /**
     * @en Sets the given matrix with a given angle and save the results to out matrix
     * @zh 计算旋转矩阵
     */
    static fromRotation<Out extends IMat3Like>(out: Out, rad: number): Out;
    /**
     * @en Sets the given matrix with the given quaternion and save the results to out matrix
     * @zh 根据四元数旋转信息计算矩阵
     */
    static fromQuat<Out extends IMat3Like>(out: Out, q: IQuatLike): Out;
    /**
     * @deprecated since v3.8.0, this function is too complicated, and should be split into several functions.
     */
    /**
     * @en Calculates the upper-left 3x3 matrix of a 4x4 matrix's inverse transpose
     * @zh 计算指定四维矩阵的逆转置三维矩阵
     */
    static inverseTransposeMat4<Out extends IMat3Like>(out: Out, a: IMat4Like): Out | null;
    /**
     * @en Transform a matrix object to a flat array
     * @zh 矩阵转数组
     * @param ofs Array Start Offset
     */
    static toArray<Out extends IWritableArrayLike<number>>(out: Out, m: IMat3Like, ofs?: number): Out;
    /**
     * @en Generates or sets a matrix with a flat array
     * @zh 数组转矩阵
     * @param ofs Array Start Offset
     */
    static fromArray<Out extends IMat3Like>(out: Out, arr: IWritableArrayLike<number>, ofs?: number): Out;
    /**
     * @en Adds two matrices and save the results to out matrix
     * @zh 逐元素矩阵加法
     */
    static add<Out extends IMat3Like>(out: Out, a: Out, b: Out): Out;
    /**
     * @en Subtracts matrix b from matrix a and save the results to out matrix
     * @zh 逐元素矩阵减法
     */
    static subtract<Out extends IMat3Like>(out: Out, a: Out, b: Out): Out;
    /**
     * @en Multiply each element of a matrix by a scalar number and save the results to out matrix
     * @zh 矩阵标量乘法
     */
    static multiplyScalar<Out extends IMat3Like>(out: Out, a: Out, b: number): Out;
    /**
     * @en Adds two matrices after multiplying each element of the second operand by a scalar number. And save the results to out matrix.
     * @zh 逐元素矩阵标量乘加: A + B * scale
     */
    static multiplyScalarAndAdd<Out extends IMat3Like>(out: Out, a: Out, b: Out, scale: number): Out;
    /**
     * @en Returns whether the specified matrices are equal.
     * @zh 矩阵等价判断
     */
    static strictEquals<Out extends IMat3Like>(a: Out, b: Out): boolean;
    /**
     * @en Returns whether the specified matrices are approximately equal.
     * @zh 排除浮点数误差的矩阵近似等价判断
     */
    static equals<Out extends IMat3Like>(a: Out, b: Out, epsilon?: number): boolean;
    /**
     * @en Convert Matrix to euler angle, resulting angle y, z in the range of [-PI, PI],
     *  x in the range of [-PI/2, PI/2], the rotation order is YXZ, first rotate around Y, then around X, and finally around Z.
     * @zh 将矩阵转换成欧拉角, 返回角度 y,z 在 [-PI, PI] 区间内, x 在 [-PI/2, PI/2] 区间内，旋转顺序为 YXZ，即先绕Y旋转，再绕X，最后绕Z旋转。
     */
    static toEuler<InType extends IMat3Like, VecLike extends IVec3Like>(matrix: InType, v: VecLike): boolean;
    /**
     * matrix layout
     * |m00  m03  m06|
     * |m01  m04  m07|
     * |m02  m05  m08|
     */
    /**
     * @en Value at column 0 row 0 of the matrix.
     * @zh 矩阵第 0 列第 0 行的元素。
     */
    m00: number;
    /**
     * @en Value at column 0 row 1 of the matrix.
     * @zh 矩阵第 0 列第 1 行的元素。
     */
    m01: number;
    /**
     * @en Value at column 0 row 2 of the matrix.
     * @zh 矩阵第 0 列第 2 行的元素。
     */
    m02: number;
    /**
     * @en Value at column 1 row 0 of the matrix.
     * @zh 矩阵第 1 列第 0 行的元素。
     */
    m03: number;
    /**
     * @en Value at column 1 row 1 of the matrix.
     * @zh 矩阵第 1 列第 1 行的元素。
     */
    m04: number;
    /**
     * @en Value at column 1 row 2 of the matrix.
     * @zh 矩阵第 1 列第 2 行的元素。
     */
    m05: number;
    /**
     * @en Value at column 2 row 0 of the matrix.
     * @zh 矩阵第 2 列第 0 行的元素。
     */
    m06: number;
    /**
     * @en Value at column 2 row 1 of the matrix.
     * @zh 矩阵第 2 列第 1 行的元素。
     */
    m07: number;
    /**
     * @en Value at column 2 row 2 of the matrix.
     * @zh 矩阵第 2 列第 2 行的元素。
     */
    m08: number;
    constructor(other: Mat3);
    constructor(m00?: number, m01?: number, m02?: number, m03?: number, m04?: number, m05?: number, m06?: number, m07?: number, m08?: number);
    /**
     * @en Clone a new matrix from the current matrix.
     * @zh 克隆当前矩阵。
     */
    clone(): Mat3;
    /**
     * @en Sets the matrix with another one's value.
     * @zh 设置当前矩阵使其与指定矩阵相等。
     * @param other Specified matrix
     * @return this
     */
    set(other: Mat3): Mat3;
    /**
     * @en Set the matrix with values of all elements
     * @zh 设置当前矩阵指定元素值。
     * @return this
     */
    set(m00?: number, m01?: number, m02?: number, m03?: number, m04?: number, m05?: number, m06?: number, m07?: number, m08?: number): Mat3;
    /**
     * @en Returns whether the specified matrices are approximately equal.
     * @zh 判断当前矩阵是否在误差范围内与指定矩阵相等。
     * @param other Comparative matrix
     * @param epsilon The error allowed. It`s should be a non-negative number.
     * @return Returns `true' when the elements of both matrices are equal; otherwise returns `false'.
     */
    equals(other: Mat3, epsilon?: number): boolean;
    /**
     * @en Returns whether the specified matrices are equal.
     * @zh 判断当前矩阵是否与指定矩阵相等。
     * @param other Comparative matrix
     * @return Returns `true' when the elements of both matrices are equal; otherwise returns `false'.
     */
    strictEquals(other: Mat3): boolean;
    /**
     * @en Returns a string representation of a matrix.
     * @zh 返回当前矩阵的字符串表示。
     * @return The string representation of this matrix
     */
    toString(): string;
    /**
     * @en set the current matrix to an identity matrix.
     * @zh 将当前矩阵设为单位矩阵。
     * @return `this`
     */
    identity(): Mat3;
    /**
     * @en Transposes the current matrix.
     * @zh 计算当前矩阵的转置矩阵。
     */
    transpose(): Mat3;
    /**
     * @en Inverts the current matrix. When matrix is not invertible the matrix will be set to zeros.
     * @zh 计算当前矩阵的逆矩阵。注意，在矩阵不可逆时，会返回一个全为 0 的矩阵。
     */
    invert(): Mat3;
    /**
     * @en Calculates the determinant of the current matrix.
     * @zh 计算当前矩阵的行列式。
     * @return 当前矩阵的行列式。
     */
    determinant(): number;
    /**
     * @en Adds the current matrix and another matrix to the current matrix.
     * @zh 矩阵加法。将当前矩阵与指定矩阵的相加，结果返回给当前矩阵。
     * @param mat the second operand
     */
    add(mat: Mat3): Mat3;
    /**
     * @en Subtracts another matrix from the current matrix.
     * @zh 计算矩阵减法。将当前矩阵减去指定矩阵的结果赋值给当前矩阵。
     * @param mat the second operand
     */
    subtract(mat: Mat3): Mat3;
    /**
     * @en Multiply the current matrix with another matrix.
     * @zh 矩阵乘法。将当前矩阵左乘指定矩阵的结果赋值给当前矩阵。
     * @param mat the second operand
     */
    multiply(mat: Mat3): Mat3;
    /**
     * @en Multiply each element of the current matrix by a scalar number.
     * @zh 矩阵数乘。将当前矩阵与指定标量的数乘结果赋值给当前矩阵。
     * @param scalar amount to scale the matrix's elements by
     */
    multiplyScalar(scalar: number): Mat3;
    /**
     * @en Multiply the current matrix with a scale matrix given by a scale vector, that is M * S(vec).
     * @zh 将当前矩阵左乘缩放矩阵的结果赋值给当前矩阵，缩放矩阵由各个轴的缩放给出，即M * S(vec)。
     * @param vec vector to scale by
     */
    scale(vec: Vec3): Mat3;
    /**
     * @en Rotates the current matrix by the given angle, that is M * R(rad).
     * @zh 将当前矩阵左乘旋转矩阵的结果赋值给当前矩阵，旋转矩阵由旋转轴和旋转角度给出，即M * R(rad)。
     * @param rad radian of rotation
     */
    rotate(rad: number): Mat3;
    /**
     * @en Resets the current matrix from the given quaternion.
     * @zh 重置当前矩阵的值，使其表示指定四元数表示的旋转变换。
     * @param q The quaternion.
     * @returns this
     */
    fromQuat(q: Quat): Mat3;
}
