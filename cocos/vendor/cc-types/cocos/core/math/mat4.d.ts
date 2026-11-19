/// <reference types="./@types/globals" />
import { ValueType } from '../value-types/value-type';
import { Quat } from './quat';
import { IMat4Like, IVec3Like } from './type-define';
import { Vec3 } from './vec3';
/**
 * @engineInternal
 */
export declare const preTransforms: readonly (readonly number[])[];
export declare class Mat4 extends ValueType {
    static IDENTITY: Readonly<Mat4>;
    /**
     * @en Clone a matrix and save the results to out matrix
     * @zh 获得指定矩阵的拷贝
     */
    static clone(a: IMat4Like): Mat4;
    /**
     * @en Copy a matrix into the out matrix
     * @zh 复制目标矩阵
     */
    static copy<Out extends IMat4Like>(out: Out, a: Out): Out;
    /**
     * @en Sets a matrix with the given values and save the results to out matrix
     * @zh 设置矩阵值
     *
     * @param out The receive matrix
     * @param m00 Component in column 0, row 0 position (index 0)
     * @param m01 Component in column 0, row 1 position (index 1)
     * @param m02 Component in column 0, row 2 position (index 2)
     * @param m03 Component in column 0, row 3 position (index 3)
     * @param m10 Component in column 1, row 0 position (index 4)
     * @param m11 Component in column 1, row 1 position (index 5)
     * @param m12 Component in column 1, row 2 position (index 6)
     * @param m13 Component in column 1, row 3 position (index 7)
     * @param m20 Component in column 2, row 0 position (index 8)
     * @param m21 Component in column 2, row 1 position (index 9)
     * @param m22 Component in column 2, row 2 position (index 10)
     * @param m23 Component in column 2, row 3 position (index 11)
     * @param m30 Component in column 3, row 0 position (index 12)
     * @param m31 Component in column 3, row 1 position (index 13)
     * @param m32 Component in column 3, row 2 position (index 14)
     * @param m33 Component in column 3, row 3 position (index 15)
     * @returns The receive matrix
     */
    static set<Out extends IMat4Like>(out: Out, m00: number, m01: number, m02: number, m03: number, m10: number, m11: number, m12: number, m13: number, m20: number, m21: number, m22: number, m23: number, m30: number, m31: number, m32: number, m33: number): Out;
    /**
     * @en return an identity matrix.
     * @zh 将目标赋值为单位矩阵
     */
    static identity<Out extends IMat4Like>(out: Out): Out;
    /**
     * @en return an zero matrix.
     * @zh 将目标赋值为0矩阵
     */
    static zero<Out extends IMat4Like>(out: Out): Out;
    /**
     * @en Transposes a matrix and save the results to out matrix
     * @zh 转置矩阵
     */
    static transpose<Out extends IMat4Like>(out: Out, a: Out): Out;
    /**
     * @en Inverts a matrix. When matrix is not invertible the matrix will be set to zeros.
     * @zh 矩阵求逆，注意，在矩阵不可逆时，会返回一个全为 0 的矩阵。
     */
    static invert<Out extends IMat4Like>(out: Out, a: Out): Out;
    /**
     * @en Calculates the determinant of a matrix
     * @zh 矩阵行列式
     */
    static determinant<InType extends IMat4Like>(a: InType): number;
    /**
     * @en Multiply two matrices and save the results to out matrix, (out = a * b)
     * @zh 矩阵乘法 (out = a * b)
     *
     * @param out The out matrix
     * @param a The first operand
     * @param b The second operand
     * @returns out matrix
     */
    static multiply<Out extends IMat4Like>(out: Out, a: Out, b: Out): Out;
    /**
     * @en Translate a matrix with the given vector and save results to the out matrix, the translate is applied before the matrix, i.e. (out = a * T)
     * @zh 在给定矩阵变换基础上加入平移变换，并将结果保存到 out 矩阵中，平移变换将应用在矩阵变换之前，即 (out = a * T)
     *
     * @param out The out matrix
     * @param a The matrix to translate
     * @param v The vector to translate with
     */
    static transform<Out extends IMat4Like, VecLike extends IVec3Like>(out: Out, a: Out, v: VecLike): Out;
    /**
     * @en Transform a matrix with the given translation vector and save results to the out matrix,
     * the translate is applied after the transformation, i.e. (out = T * a)
     * @zh 在给定矩阵变换基础上加入新位移变换，平移变换在变换之后应用，即 (out = T * a)
     *
     * @param out The out matrix
     * @param a The matrix to translate
     * @param v The vector to translate with
     * @deprecated Since 3.8.0, please use [[transform]] instead
     */
    static translate<Out extends IMat4Like, VecLike extends IVec3Like>(out: Out, a: Out, v: VecLike): Out;
    /**
     * @en Multiply a matrix with a scale matrix given by a scale vector and save the results into the out matrix,
     * the scale is applied before the matrix, i.e. (out = a * S)
     * @zh 在给定矩阵变换基础上加入新缩放变换，并将结果保存到 out 矩阵中，缩放变换将应用在矩阵变换之前，即 (out = a * S)
     */
    static scale<Out extends IMat4Like, VecLike extends IVec3Like>(out: Out, a: Out, v: VecLike): Out;
    /**
     * @en Rotates the transform by the given angle and save the results into the out matrix, the rotate is applied before
     * the matrix, i.e. (out = a * R)
     * @zh 在给定矩阵变换基础上加入新旋转变换, 并将结果保存到 out 矩阵中，旋转变换将应用在矩阵变换之前，即 (out = a * R)
     * @param rad Angle of rotation (in radians)
     * @param axis axis of rotation
     */
    static rotate<Out extends IMat4Like, VecLike extends IVec3Like>(out: Out, a: Out, rad: number, axis: VecLike): Out | null;
    /**
     * @en Transform a matrix with a given angle around X axis and save the results to the out matrix, the rotate is applied
     * before the matrix, i.e. (out = a * R)
     * @zh 在给定矩阵变换基础上加入绕 X 轴的旋转变换, 并将结果保存到 out 矩阵中，旋转变换将应用在矩阵变换之前，即 (out = a * R)
     * @param rad Angle of rotation (in radians)
     */
    static rotateX<Out extends IMat4Like>(out: Out, a: Out, rad: number): Out;
    /**
     * @en Transform a matrix with a given angle around Y axis and save the results to the out matrix
     * @zh 在给定矩阵变换基础上加入绕 Y 轴的旋转变换
     * @param rad Angle of rotation (in radians)
     */
    static rotateY<Out extends IMat4Like>(out: Out, a: Out, rad: number): Out;
    /**
     * @en Transform a matrix with a given angle around Z axis and save the results to the out matrix
     * @zh 在给定矩阵变换基础上加入绕 Z 轴的旋转变换
     * @param rad Angle of rotation (in radians)
     */
    static rotateZ<Out extends IMat4Like>(out: Out, a: Out, rad: number): Out;
    /**
     * @en Sets the out matrix with a translation vector
     * @zh 计算位移矩阵
     */
    static fromTranslation<Out extends IMat4Like, VecLike extends IVec3Like>(out: Out, v: VecLike): Out;
    /**
     * @en Sets the out matrix with a scale vector
     * @zh 计算缩放矩阵
     */
    static fromScaling<Out extends IMat4Like, VecLike extends IVec3Like>(out: Out, v: VecLike): Out;
    /**
     * @en Sets the out matrix with rotation angle
     * @zh 计算旋转矩阵
     */
    static fromRotation<Out extends IMat4Like, VecLike extends IVec3Like>(out: Out, rad: number, axis: VecLike): Out | null;
    /**
     * @en Calculates the matrix representing a rotation around the X axis
     * @zh 计算绕 X 轴的旋转矩阵
     */
    static fromXRotation<Out extends IMat4Like>(out: Out, rad: number): Out;
    /**
     * @en Calculates the matrix representing a rotation around the Y axis
     * @zh 计算绕 Y 轴的旋转矩阵
     */
    static fromYRotation<Out extends IMat4Like>(out: Out, rad: number): Out;
    /**
     * @en Calculates the matrix representing a rotation around the Z axis
     * @zh 计算绕 Z 轴的旋转矩阵
     */
    static fromZRotation<Out extends IMat4Like>(out: Out, rad: number): Out;
    /**
     * @en Calculates the transform representing the combination of a rotation and a translation, and stores the result in out.
     * The order is rotation then translation.
     * @zh 根据旋转和位移信息计算矩阵
     */
    static fromRT<Out extends IMat4Like, VecLike extends IVec3Like>(out: Out, q: Quat, v: VecLike): Out;
    /**
     * @en Extracts the translation from the matrix, assuming it's composed in order of scale, rotation, translation
     * @zh 提取矩阵的位移信息, 默认矩阵中的变换以 S->R->T 的顺序应用
     */
    static getTranslation<InType extends IMat4Like, VecLike extends IVec3Like>(out: VecLike, mat: InType): VecLike;
    /**
     * @en Extracts the scale vector from the matrix, assuming it's composed in order of scale, rotation, translation
     * @zh 提取矩阵的缩放信息, 默认矩阵中的变换以 S->R->T 的顺序应用
     */
    static getScaling<InType extends IMat4Like, VecLike extends IVec3Like>(out: VecLike, mat: InType): VecLike;
    /**
     * @en Extracts the rotation from the matrix, assuming it's composed in order of scale, rotation, translation
     * @zh 提取矩阵的旋转信息, 默认输入矩阵不含有缩放信息，如考虑缩放应使用 `toRTS` 函数。
     */
    static getRotation<InType extends IMat4Like>(out: Quat, mat: InType): Quat;
    /**
     * @en Extracts the scale, rotation and translation from the matrix, assuming it's composed in order of scale, rotation, translation
     * @zh 提取旋转、位移、缩放信息， 默认矩阵中的变换以 S->R->T 的顺序应用
     *
     * @param m The input transform matrix
     * @param q The corresponding rotation quat
     * @param v The corresponding translate vector
     * @param s The corresponding scaling vector
     *
     * @deprecated Since 3.8.0, please use toSRT instead
     */
    static toRTS<InType extends IMat4Like, VecLike extends IVec3Like>(m: InType, q: Quat | null, v: VecLike | null, s: VecLike | null): void;
    /**
     * @en Extracts the scale, rotation and translation from the matrix, assuming it's composed in order of scale, rotation, translation
     * @zh 提取旋转、位移、缩放信息， 默认矩阵中的变换以 S->R->T 的顺序应用
     *
     * @param m The input transform matrix
     * @param q The corresponding rotation quat
     * @param v The corresponding translate vector
     * @param s The corresponding scaling vector
     */
    static toSRT<InType extends IMat4Like, VecLike extends IVec3Like>(m: InType, q: Quat | null, v: VecLike | null, s: VecLike | null): void;
    /**
     * @en Convert Matrix to euler angle, resulting angle y, z in the range of [-PI, PI],
     *  x in the range of [-PI/2, PI/2], the rotation order is YXZ.
     * @zh 将矩阵转换为欧拉角，结果角度 y, z 在 [-PI, PI] 范围内，x 在 [-PI/2, PI/2] 区间内，旋转顺序为 YXZ.
     */
    static toEuler<InType extends IMat4Like, VecLike extends IVec3Like>(m: InType, v: VecLike): boolean;
    /**
     * @en Compose a matrix from scale, rotation and translation, applied in order.
     * @zh 根据旋转、位移、缩放信息计算矩阵，以 S->R->T 的顺序应用
     * @deprecated Since 3.8.0, please use [[fromSRT]] instead.
     */
    static fromRTS<Out extends IMat4Like, VecLike extends IVec3Like>(out: Out, q: Quat, v: VecLike, s: VecLike): Out;
    /**
     * @en Compose a matrix from scale, rotation and translation, applied in order.
     * @zh 根据旋转、位移、缩放信息计算矩阵，以 S->R->T 的顺序应用
     * @param out The receiving matrix
     * @param q Rotation quaternion
     * @param v Translation vector
     * @param s Scaling vector
     * @returns The receiving matrix
     */
    static fromSRT<Out extends IMat4Like, VecLike extends IVec3Like>(out: Out, q: Quat, v: VecLike, s: VecLike): Out;
    /**
     * @en Compose a matrix from scale, rotation and translation, applied in order, from a given origin
     * @zh 根据指定的旋转、位移、缩放及变换中心信息计算矩阵，以 S->R->T 的顺序应用
     * @param q Rotation quaternion
     * @param v Translation vector
     * @param s Scaling vector
     * @param o transformation Center
     * @deprecated Please use [[fromSRTOrigin]] instead.
     */
    static fromRTSOrigin<Out extends IMat4Like, VecLike extends IVec3Like>(out: Out, q: Quat, v: VecLike, s: VecLike, o: VecLike): Out;
    /**
     * @en Compose a matrix from scale, rotation and translation, applied in order, from a given origin
     * @zh 根据指定的旋转、位移、缩放及变换中心信息计算矩阵，以 O^{-1}->S->R->O->T 的顺序应用
     * @param out The receiving matrix
     * @param q Rotation quaternion
     * @param v Translation vector
     * @param s Scaling vector
     * @param o transformation Center
     * @returns The receiving matrix
     */
    static fromSRTOrigin<Out extends IMat4Like, VecLike extends IVec3Like>(out: Out, q: Quat, v: VecLike, s: VecLike, o: VecLike): Out;
    /**
     * @en Sets the out matrix with the given quaternion
     * @zh 根据指定的旋转信息计算矩阵
     */
    static fromQuat<Out extends IMat4Like>(out: Out, q: Quat): Out;
    /**
     * @en Calculates the matrix representing the given frustum
     * @zh 根据指定的视锥体信息计算矩阵
     * @param out The receiving matrix.
     * @param left The X coordinate of the left side of the near projection plane in view space.
     * @param right The X coordinate of the right side of the near projection plane in view space.
     * @param bottom The Y coordinate of the bottom side of the near projection plane in view space.
     * @param top The Y coordinate of the top side of the near projection plane in view space.
     * @param near Z distance to the near plane from the origin in view space.
     * @param far Z distance to the far plane from the origin in view space.
     *
     * @return The receiving matrix.
     */
    static frustum<Out extends IMat4Like>(out: Out, left: number, right: number, bottom: number, top: number, near: number, far: number): Out;
    /**
     * @en Calculates perspective projection matrix
     * @zh 计算透视投影矩阵
     * @param out The receiving matrix.
     * @param fovy Vertical field-of-view in degrees.
     * @param aspect Aspect ratio
     * @param near Near depth clipping plane value.
     * @param far Far depth clipping plane value.
     * @param isFOVY Whether the fovy is based on the vertical field-of-view.
     * @param minClipZ The minimum value of the near clipping plane, e.g. -1 for OpenGL, 0 for Vulkan and Metal.
     * @param projectionSignY The sign of the Y axis of the projection matrix, which is used to flip the Y axis.
     * @param orientation The orientation of the projection matrix, which is used to rotate the projection matrix.
     *
     * @return The receiving matrix.
     */
    static perspective<Out extends IMat4Like>(out: Out, fov: number, aspect: number, near: number, far: number, isFOVY?: boolean, minClipZ?: number, projectionSignY?: number, orientation?: number): Out;
    /**
     * @en Calculates orthogonal projection matrix
     * @zh 计算正交投影矩阵
     * @param out The receiving matrix.
     * @param left Left-side x-coordinate.
     * @param right Right-side x-coordinate.
     * @param bottom Bottom y-coordinate.
     * @param top Top y-coordinate.
     * @param near Near depth clipping plane value.
     * @param far Far depth clipping plane value.
     * @param minClipZ The minimum value of the near clipping plane, e.g. -1 for OpenGL, 0 for Vulkan and Metal.
     * @param projectionSignY The sign of the Y axis of the projection matrix, which is used to flip the Y axis.
     * @param orientation The orientation of the projection matrix, which is used to rotate the projection matrix.
     *
     * @return The receiving matrix.
     */
    static ortho<Out extends IMat4Like>(out: Out, left: number, right: number, bottom: number, top: number, near: number, far: number, minClipZ?: number, projectionSignY?: number, orientation?: number): Out;
    /**
     * @en
     * Calculates the matrix with the view point information, given by eye position, target center and the up vector.
     * Note that center to eye vector can't be zero or parallel to the up vector
     * @zh
     * 计算视图矩阵，给定眼睛位置、目标中心和上向量。注意，中心到眼睛向量不能为零或与上向量平行。
     * @out The receiving matrix.
     * @param eye The source point.
     * @param center The target point.
     * @param up The vector describing the up direction.
     * @return The receiving matrix.
     */
    static lookAt<Out extends IMat4Like, VecLike extends IVec3Like>(out: Out, eye: VecLike, center: VecLike, up: VecLike): Out;
    /**
     * @en Calculates the inverse transpose of a matrix and save the results to out matrix
     * @zh 计算逆转置矩阵
     *
     * @deprecated This function is too complicated, and should be split into several functions.
     */
    static inverseTranspose<Out extends IMat4Like>(out: Out, a: Out): Out | null;
    /**
     * @en Transform a matrix object to a flat array
     * @zh 矩阵转数组
     * @param ofs Array Start Offset
     */
    static toArray<Out extends IWritableArrayLike<number>>(out: Out, m: IMat4Like, ofs?: number): Out;
    /**
     * @en Generates or sets a matrix with a flat array
     * @zh 数组转矩阵
     * @param ofs Array Start Offset
     */
    static fromArray<Out extends IMat4Like>(out: Out, arr: IWritableArrayLike<number>, ofs?: number): Out;
    /**
     * @en Adds two matrices and save the results to out matrix
     * @zh 逐元素矩阵加法
     */
    static add<Out extends IMat4Like>(out: Out, a: Out, b: Out): Out;
    /**
     * @en Subtracts matrix b from matrix a and save the results to out matrix
     * @zh 逐元素矩阵减法
     */
    static subtract<Out extends IMat4Like>(out: Out, a: Out, b: Out): Out;
    /**
     * @en Multiply each element of a matrix by a scalar number and save the results to out matrix
     * @zh 矩阵标量乘法
     */
    static multiplyScalar<Out extends IMat4Like>(out: Out, a: Out, b: number): Out;
    /**
     * @en Adds two matrices after multiplying each element of the second operand by a scalar number. And save the results to out matrix.
     * @zh 逐元素矩阵标量乘加: A + B * scale
     */
    static multiplyScalarAndAdd<Out extends IMat4Like>(out: Out, a: Out, b: Out, scale: number): Out;
    /**
     * @en Returns whether the specified matrices are equal.
     * @zh 矩阵等价判断
     */
    static strictEquals<InType extends IMat4Like>(a: InType, b: InType): boolean;
    /**
     * @en Returns whether the specified matrices are approximately equal.
     * @zh 排除浮点数误差的矩阵近似等价判断
     *
     * @param a The first matrix to be compared.
     * @param b The second matrix to be compared.
     * @param epsilon The tolerance value.
     * @return
     */
    static equals<InType extends IMat4Like>(a: InType, b: InType, epsilon?: number): boolean;
    /**
     * matrix layout
     * |m00  m04  m08 m12|
     * |m01  m05  m09 m13|
     * |m02  m06  m10 m14|
     * |m03  m07  m11 m15|
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
     * @en Value at column 0 row 3 of the matrix.
     * @zh 矩阵第 0 列第 3 行的元素。
     */
    m03: number;
    /**
     * @en Value at column 1 row 0 of the matrix.
     * @zh 矩阵第 1 列第 0 行的元素。
     */
    m04: number;
    /**
     * @en Value at column 1 row 1 of the matrix.
     * @zh 矩阵第 1 列第 1 行的元素。
     */
    m05: number;
    /**
     * @en Value at column 1 row 2 of the matrix.
     * @zh 矩阵第 1 列第 2 行的元素。
     */
    m06: number;
    /**
     * @en Value at column 1 row 3 of the matrix.
     * @zh 矩阵第 1 列第 3 行的元素。
     */
    m07: number;
    /**
     * @en Value at column 2 row 0 of the matrix.
     * @zh 矩阵第 2 列第 0 行的元素。
     */
    m08: number;
    /**
     * @en Value at column 2 row 1 of the matrix.
     * @zh 矩阵第 2 列第 1 行的元素。
     */
    m09: number;
    /**
     * @en Value at column 2 row 2 of the matrix.
     * @zh 矩阵第 2 列第 2 行的元素。
     */
    m10: number;
    /**
     * @en Value at column 2 row 3 of the matrix.
     * @zh 矩阵第 2 列第 3 行的元素。
     */
    m11: number;
    /**
     * @en Value at column 3 row 0 of the matrix.
     * @zh 矩阵第 3 列第 0 行的元素。
     */
    m12: number;
    /**
     * @en Value at column 3 row 1 of the matrix.
     * @zh 矩阵第 3 列第 1 行的元素。
     */
    m13: number;
    /**
     * @en Value at column 3 row 2 of the matrix.
     * @zh 矩阵第 3 列第 2 行的元素。
     */
    m14: number;
    /**
     * @en Value at column 3 row 3 of the matrix.
     * @zh 矩阵第 3 列第 3 行的元素。
     */
    m15: number;
    constructor(other: Mat4);
    constructor(m00?: number, m01?: number, m02?: number, m03?: number, m04?: number, m05?: number, m06?: number, m07?: number, m08?: number, m09?: number, m10?: number, m11?: number, m12?: number, m13?: number, m14?: number, m15?: number);
    /**
     * @en Clone a new matrix from the current matrix.
     * @zh 克隆当前矩阵。
     */
    clone(): Mat4;
    /**
     * @en Sets the matrix with another one's value.
     * @zh 设置当前矩阵使其与指定矩阵相等。
     * @param other Specified matrix.
     * @return this
     */
    set(other: Mat4): Mat4;
    /**
     * @en Set the matrix with values of all elements
     * @zh 设置当前矩阵指定元素值。
     *
     * @return this
     */
    set(m00?: number, m01?: number, m02?: number, m03?: number, m04?: number, m05?: number, m06?: number, m07?: number, m08?: number, m09?: number, m10?: number, m11?: number, m12?: number, m13?: number, m14?: number, m15?: number): Mat4;
    /**
     * @en Returns whether the specified matrices are approximately equal.
     * @zh 判断当前矩阵是否在误差范围内与指定矩阵相等。
     * @param other Comparative matrix
     * @param epsilon The error allowed. It`s should be a non-negative number.
     * @return Returns `true' when the elements of both matrices are equal; otherwise returns `false'.
     */
    equals(other: Mat4, epsilon?: number): boolean;
    /**
     * @en Returns whether the specified matrices are equal.
     * @zh 判断当前矩阵是否与指定矩阵相等。
     * @param other Comparative matrix
     * @return Returns `true' when the elements of both matrices are equal; otherwise returns `false'.
     */
    strictEquals(other: Mat4): boolean;
    /**
     * @en Returns a string representation of a matrix.
     * @zh 返回当前矩阵的字符串表示。
     * @return 当前矩阵的字符串表示。
     */
    toString(): string;
    /**
     * @en set the current matrix to an identity matrix.
     * @zh 将当前矩阵设为单位矩阵。
     * @return `this`
     */
    identity(): Mat4;
    /**
     * @en set the current matrix to an zero matrix.
     * @zh 将当前矩阵设为 0矩阵。
     * @return `this`
     */
    zero(): Mat4;
    /**
     * @en Transposes the current matrix.
     * @zh 计算当前矩阵的转置矩阵。
     */
    transpose(): Mat4;
    /**
     * @en Inverts the current matrix. When matrix is not invertible the matrix will be set to zeros.
     * @zh 计算当前矩阵的逆矩阵。注意，在矩阵不可逆时，会返回一个全为 0 的矩阵。
     */
    invert(): Mat4;
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
    add(mat: Mat4): Mat4;
    /**
     * @en Subtracts another matrix from the current matrix.
     * @zh 计算矩阵减法。将当前矩阵减去指定矩阵的结果赋值给当前矩阵。
     * @param mat the second operand
     */
    subtract(mat: Mat4): Mat4;
    /**
     * @en Multiply the current matrix with another matrix.
     * @zh 矩阵乘法。将当前矩阵左乘指定矩阵的结果赋值给当前矩阵。
     * @param mat the second operand
     */
    multiply(mat: Mat4): Mat4;
    /**
     * @en Multiply each element of the current matrix by a scalar number.
     * @zh 矩阵数乘。将当前矩阵与指定标量的数乘结果赋值给当前矩阵。
     * @param scalar amount to scale the matrix's elements by
     */
    multiplyScalar(scalar: number): Mat4;
    /**
     * @en Translate the current matrix by the given vector
     * @zh 将当前矩阵左乘位移矩阵的结果赋值给当前矩阵，位移矩阵由各个轴的位移给出。
     * @param vec vector to translate by
     *
     * @deprecated since v3.0, please use [[transform]] instead
     */
    translate(vec: Vec3): Mat4;
    /**
     * @en Translate the current matrix by the given vector
     * @zh 将当前矩阵左乘位移矩阵的结果赋值给当前矩阵，位移矩阵由各个轴的位移给出。
     * @param vec vector to translate by
     */
    transform(vec: Vec3): Mat4;
    /**
     * @en Multiply the current matrix with a scale vector.
     * @zh 将当前矩阵左乘缩放矩阵的结果赋值给当前矩阵，缩放矩阵由各个轴的缩放给出。
     * @param vec vector to scale by
     */
    scale(vec: Vec3): Mat4;
    /**
     * @en Rotates the current matrix by the given angle around the given axis
     * @zh 将当前矩阵左乘旋转矩阵的结果赋值给当前矩阵，旋转矩阵由旋转轴和旋转角度给出。
     * @param rad Angle of rotation (in radians)
     * @param axis Axis of rotation
     */
    rotate(rad: number, axis: Vec3): Mat4 | null;
    /**
     * @en Returns the translation vector component of a transformation matrix.
     * @zh 从当前矩阵中计算出位移变换的部分，并以各个轴上位移的形式赋值给输出向量。
     * @param out Vector to receive translation component.
     */
    getTranslation(out: Vec3): Vec3;
    /**
     * @en Returns the scale factor component of a transformation matrix
     * @zh 从当前矩阵中计算出缩放变换的部分，并以各个轴上缩放的形式赋值给输出向量。
     * @param out Vector to receive scale component
     */
    getScale(out: Vec3): Vec3;
    /**
     * @en Returns the rotation factor component of a transformation matrix
     * @zh 从当前矩阵中计算出旋转变换的部分，并以四元数的形式赋值给输出四元数。
     * @param out Vector to receive rotation component
     */
    getRotation(out: Quat): Quat;
    /**
     * @en Resets the matrix values by the given rotation quaternion, translation vector and scale vector
     * @zh 重置当前矩阵的值，使其表示指定的旋转、缩放、位移依次组合的变换。
     * @param q Rotation quaternion
     * @param v Translation vector
     * @param s Scaling vector
     * @return `this`
     *
     * @deprecated Since 3.8.0, please use [[fromSRT]] instead
     */
    fromRTS(q: Quat, v: Vec3, s: Vec3): Mat4;
    /**
     * @en Resets the matrix values by the given rotation quaternion, translation vector and scale vector
     * @zh 重置当前矩阵的值，使其表示指定的旋转、缩放、位移依次组合的变换。
     * @param q Rotation quaternion
     * @param v Translation vector
     * @param s Scaling vector
     * @return `this`
     */
    fromSRT(q: Quat, v: Vec3, s: Vec3): Mat4;
    /**
     * @en Resets the current matrix from the given quaternion.
     * @zh 重置当前矩阵的值，使其表示指定四元数表示的旋转变换。
     * @param q Rotation quaternion
     * @return `this`
     */
    fromQuat(q: Quat): Mat4;
}
export declare function mat4(other: Mat4): Mat4;
export declare function mat4(m00?: number, m01?: number, m02?: number, m03?: number, m10?: number, m11?: number, m12?: number, m13?: number, m20?: number, m21?: number, m22?: number, m23?: number, m30?: number, m31?: number, m32?: number, m33?: number): Mat4;
