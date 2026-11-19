/// <reference types="./@types/globals" />
import { ValueType } from '../value-types/value-type';
import { Mat3 } from './mat3';
import { IQuatLike, IVec3Like } from './type-define';
import { Vec3 } from './vec3';
/**
 * @en quaternion
 * @zh 四元数
 */
export declare class Quat extends ValueType {
    static IDENTITY: Readonly<Quat>;
    /**
     * @en Obtain a copy of the given quaternion
     * @zh 获得指定四元数的拷贝
     */
    static clone<Out extends IQuatLike>(a: Out): Quat;
    /**
     * @en Copy the given quaternion to the out quaternion
     * @zh 复制目标四元数
     */
    static copy<Out extends IQuatLike, QuatLike extends IQuatLike>(out: Out, a: QuatLike): Out;
    /**
     * @en Sets the out quaternion with values of each component
     * @zh 设置四元数值
     */
    static set<Out extends IQuatLike>(out: Out, x: number, y: number, z: number, w: number): Out;
    /**
     * @en Sets the out quaternion to an identity quaternion
     * @zh 将目标赋值为单位四元数
     */
    static identity<Out extends IQuatLike>(out: Out): Out;
    /**
     * @en Sets the out quaternion with the shortest path orientation between two vectors, considering both vectors normalized
     * @zh 设置四元数为两向量间的最短路径旋转，默认两向量都已归一化
     */
    static rotationTo<Out extends IQuatLike, VecLike extends IVec3Like>(out: Out, a: VecLike, b: VecLike): Out;
    /**
     * @en Gets the rotation axis and the arc of rotation from the quaternion
     * @zh 获取四元数的旋转轴和旋转弧度
     * @param outAxis output axis
     * @param q input quaternion
     * @return radian of rotation
     */
    static getAxisAngle<Out extends IQuatLike, VecLike extends IVec3Like>(outAxis: VecLike, q: Out): number;
    /**
     * @en Quaternion multiplication and save the results to out quaternion, that is a * b.
     * @zh 四元数乘法，即a * b。
     */
    static multiply<Out extends IQuatLike, QuatLike_1 extends IQuatLike, QuatLike_2 extends IQuatLike>(out: Out, a: QuatLike_1, b: QuatLike_2): Out;
    /**
     * @en Quaternion scalar multiplication and save the results to out quaternion
     * @zh 四元数标量乘法
     */
    static multiplyScalar<Out extends IQuatLike>(out: Out, a: Out, b: number): Out;
    /**
     * @en Quaternion multiplication and addition: A + B * scale
     * @zh 四元数乘加：A + B * scale
     */
    static scaleAndAdd<Out extends IQuatLike>(out: Out, a: Out, b: Out, scale: number): Out;
    /**
     * @en Sets the out quaternion to represent a radian rotation around x axis
     * @zh 绕 X 轴旋转指定四元数
     * @param rad radian of rotation
     */
    static rotateX<Out extends IQuatLike>(out: Out, a: Out, rad: number): Out;
    /**
     * @en Sets the out quaternion to represent a radian rotation around y axis
     * @zh 绕 Y 轴旋转指定四元数
     * @param rad radian of rotation
     */
    static rotateY<Out extends IQuatLike>(out: Out, a: Out, rad: number): Out;
    /**
     * @en Sets the out quaternion to represent a radian rotation around z axis
     * @zh 绕 Z 轴旋转指定四元数
     * @param rad radian of rotation
     */
    static rotateZ<Out extends IQuatLike>(out: Out, a: Out, rad: number): Out;
    /**
     * @en Sets the out quaternion to represent a radian rotation around a given rotation axis in world space
     * @zh 绕世界空间下指定轴旋转四元数
     * @param axis axis of rotation, normalized by default
     * @param rad radian of rotation
     */
    static rotateAround<Out extends IQuatLike, VecLike extends IVec3Like>(out: Out, rot: Out, axis: VecLike, rad: number): Out;
    /**
     * @en Sets the out quaternion to represent a radian rotation around a given rotation axis in local space
     * @zh 绕本地空间下指定轴旋转四元数
     * @param axis axis of rotation
     * @param rad radian of rotation
     */
    static rotateAroundLocal<Out extends IQuatLike, VecLike extends IVec3Like>(out: Out, rot: Out, axis: VecLike, rad: number): Out;
    /**
     * @en Calculates the w component with xyz components, considering the given quaternion normalized
     * @zh 根据 xyz 分量计算 w 分量，默认已归一化
     */
    static calculateW<Out extends IQuatLike>(out: Out, a: Out): Out;
    /**
     * @en Quaternion dot product (scalar product)
     * @zh 四元数点积（数量积）
     */
    static dot<Out extends IQuatLike>(a: Out, b: Out): number;
    /**
     * @en Element by element linear interpolation: A + t * (B - A)
     * @zh 逐元素线性插值： A + t * (B - A)
     */
    static lerp<Out extends IQuatLike>(out: Out, a: Out, b: Out, t: number): Out;
    /**
     * @en Spherical quaternion interpolation
     * @zh 四元数球面插值
     */
    static slerp<Out extends IQuatLike, QuatLike_1 extends IQuatLike, QuatLike_2 extends IQuatLike>(out: Out, a: QuatLike_1, b: QuatLike_2, t: number): Out;
    /**
     * @en Spherical quaternion interpolation with two control points
     * @zh 带两个控制点的四元数球面插值
     * @param out the receiving quaternion
     * @param a the first operand
     * @param b the second operand
     * @param c the third operand
     * @param d the fourth operand
     * @param t interpolation amount, in the range [0-1], between the two inputs
     * @returns out
     */
    static sqlerp<Out extends IQuatLike>(out: Out, a: Out, b: Out, c: Out, d: Out, t: number): Out;
    /**
     * @en Sets the inverse of the given quaternion to out quaternion
     * @zh 四元数求逆
     */
    static invert<Out extends IQuatLike, QuatLike extends IQuatLike>(out: Out, a: QuatLike): Out;
    /**
     * @en Conjugating a quaternion, it's equivalent to the inverse of the unit quaternion, but more efficient
     * @zh 求共轭四元数，对单位四元数与求逆等价，但更高效
     */
    static conjugate<Out extends IQuatLike>(out: Out, a: Out): Out;
    /**
     * @en Calculates the length of the quaternion
     * @zh 求四元数长度
     */
    static len<Out extends IQuatLike>(a: Out): number;
    /**
     * @en Calculates the squared length of the quaternion
     * @zh 求四元数长度平方
     */
    static lengthSqr<Out extends IQuatLike>(a: Out): number;
    /**
     * @en Normalize the given quaternion, returns a zero quaternion if input is a zero quaternion.
     * @zh 归一化四元数，输入零四元数将会返回零四元数。
     */
    static normalize<Out extends IQuatLike>(out: Out, a: Out): Out;
    /**
     * @en Calculated the quaternion represents the given coordinates, considering all given vectors are normalized and mutually perpendicular
     * @zh 根据本地坐标轴朝向计算四元数，默认三向量都已归一化且相互垂直
     */
    static fromAxes<Out extends IQuatLike, VecLike extends IVec3Like>(out: Out, xAxis: VecLike, yAxis: VecLike, zAxis: VecLike): Out;
    /**
     * @en Calculates the quaternion with the up direction and the direction of the viewport
     * @zh 根据视口的前方向和上方向计算四元数
     * @param view The view direction, it`s must be normalized.
     * @param up The view up direction, it`s must be normalized, default value is (0, 1, 0).
     */
    static fromViewUp<Out extends IQuatLike, VecLike extends IVec3Like>(out: Out, view: VecLike, up?: Vec3): Out;
    /**
     * @en Calculates the quaternion from a given rotary shaft and a radian rotation around it.
     * @zh 根据旋转轴和旋转弧度计算四元数
     */
    static fromAxisAngle<Out extends IQuatLike, VecLike extends IVec3Like>(out: Out, axis: VecLike, rad: number): Out;
    /**
     * @en Calculates the quaternion with the three-dimensional transform matrix, considering no scale included in the matrix
     * @zh 根据三维矩阵信息计算四元数，默认输入矩阵不含有缩放信息
     */
    static fromMat3<Out extends IQuatLike>(out: Out, m: Mat3): Out;
    /**
     * @en Calculates the quaternion with Euler angles, the rotation order is YZX, first rotate around Y, then around Z, and finally around X.
     * @zh 根据欧拉角信息计算四元数，旋转顺序为 YZX，即先绕Y旋转，再绕Z，最后绕X旋转。
     */
    static fromEuler<Out extends IQuatLike>(out: Out, x: number, y: number, z: number): Out;
    /**
     * @en Calculates the quaternion with given 2D angle (0, 0, z).
     * @zh 根据 2D 角度（0, 0, z）计算四元数
     *
     * @param out Output quaternion
     * @param z Angle to rotate around Z axis in degrees.
     */
    static fromAngleZ<Out extends IQuatLike>(out: Out, z: number): Out;
    /**
     * @en This returns the X-axis vector of the quaternion
     * @zh 返回定义此四元数的坐标系 X 轴向量
     */
    static toAxisX(out: IVec3Like, q: IQuatLike): IVec3Like;
    /**
     * @en This returns the Y-axis vector of the quaternion
     * @zh 返回定义此四元数的坐标系 Y 轴向量
     */
    static toAxisY(out: IVec3Like, q: IQuatLike): IVec3Like;
    /**
     * @en This returns the Z-axis vector of the quaternion
     * @zh 返回定义此四元数的坐标系 Z 轴向量
     */
    static toAxisZ(out: IVec3Like, q: IQuatLike): IVec3Like;
    /**
     * @en Converts the quaternion to angles, result angle x, y in the range of [-180, 180], z in the range of [-90, 90] interval,
     * the rotation order is YZX, first rotate around Y, then around Z, and finally around X
     * @zh 根据四元数计算欧拉角，返回角度 x, y 在 [-180, 180] 区间内, z 默认在 [-90, 90] 区间内，旋转顺序为 YZX，即先绕Y旋转，再绕Z，最后绕X旋转。
     * @param outerZ change z value range to [-180, -90] U [90, 180]
     */
    static toEuler(out: IVec3Like, q: IQuatLike, outerZ?: boolean): IVec3Like;
    /**
     * @en Converts the quaternion to euler angles, result angle y, z in the range of [-180, 180], x in the range of [-90, 90],
     * the rotation order is YXZ, first rotate around Y, then around X, and finally around Z.
     * @zh 根据四元数计算欧拉角，返回角度 yz 在 [-180, 180], x 在 [-90, 90]，旋转顺序为 YXZ，即先绕Y旋转，再绕X，最后绕Z旋转。
     */
    static toEulerInYXZOrder(out: Vec3, q: IQuatLike): void;
    /**
     * @en Converts quaternion to an array
     * @zh 四元数转数组
     * @param ofs Array Start Offset
     */
    static toArray<Out extends IWritableArrayLike<number>>(out: Out, q: IQuatLike, ofs?: number): Out;
    /**
     * @en Array to a quaternion
     * @zh 数组转四元数
     * @param ofs Array Start Offset
     */
    static fromArray(out: IQuatLike, arr: IWritableArrayLike<number>, ofs?: number): IQuatLike;
    /**
     * @en Check whether two quaternions are equal
     * @zh 四元数等价判断
     */
    static strictEquals(a: IQuatLike, b: IQuatLike): boolean;
    /**
     * @en Check whether two quaternions are approximately equal
     * @zh 排除浮点数误差的四元数近似等价判断
     */
    static equals(a: IQuatLike, b: IQuatLike, epsilon?: number): boolean;
    /**
     * @en Gets the angular distance between two unit quaternions
     * @zh 获取两个单位四元数的夹角
     * @param a The first unit quaternion
     * @param b The second unit quaternion
     * @returns Angle between the two quaternions in radians
     */
    static angle(a: IQuatLike, b: IQuatLike): number;
    /**
     * @en Rotate a `from` unit quaternion towards `to` unit quaternion
     * @zh 将一个起始单位四元数旋转到一个目标单位四元数
     * @param from The first unit quaternion
     * @param to The second unit quaternion
     * @param maxStep The maximum angle of rotation in degrees
     * @returns new unit quaternion generated during rotation
     */
    static rotateTowards(out: IQuatLike, from: IQuatLike, to: IQuatLike, maxStep: number): IQuatLike;
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
    constructor(other: Quat);
    constructor(x?: number, y?: number, z?: number, w?: number);
    /**
     * @en clone the current Quat
     * @zh 克隆当前四元数。
     */
    clone(): Quat;
    /**
     * @en Set values with another quaternion
     * @zh 设置当前四元数使其与指定四元数相等。
     * @param other Specified quaternion
     * @returns `this`
     */
    set(other: Quat): Quat;
    /**
     * @en Set the value of each component of the current quaternion
     * @zh 设置当前四元数指定元素值。
     * @returns `this`
     */
    set(x?: number, y?: number, z?: number, w?: number): Quat;
    /**
     * @en Check whether the quaternion approximately equals another one
     * @zh 判断当前四元数是否在误差范围内与指定向量相等。
     * @param other Comparative quaternion
     * @param epsilon The error allowed. It`s should be a non-negative number.
     * @returns Returns `true' when the components of the two quaternions are equal within the specified error range; otherwise, returns `false'.
     */
    equals(other: Quat, epsilon?: number): boolean;
    /**
     * @en Check whether the current quaternion strictly equals other quaternion
     * @zh 判断当前四元数是否与指定四元数相等。
     * @param other Comparative quaternion
     * @returns Returns `true' when the components of the two quaternions are equal within the specified error range; otherwise, returns `false'.
     */
    strictEquals(other: Quat): boolean;
    /**
     * @en Convert quaternion to Euler angles
     * @zh 将当前四元数转化为欧拉角（x-y-z）并赋值给输出向量。
     * @param out the output vector
     */
    getEulerAngles(out: Vec3): IVec3Like;
    /**
     * @en Calculate the linear interpolation result between this quaternion and another one with given ratio
     * @zh 根据指定的插值比率，从当前四元数到目标四元数之间做线性插值。
     * @param to The target quaternion
     * @param ratio The interpolation coefficient. The range is [0,1].
     */
    lerp(to: Quat, ratio: number): Quat;
    /**
     * @en Calculates the spherical interpolation result between this quaternion and another one with the given ratio
     * @zh 根据指定的插值比率，从当前四元数到目标四元数之间做球面插值。
     * @param to The target quaternion
     * @param ratio The interpolation coefficient. The range is [0,1].
     */
    slerp(to: Quat, ratio: number): Quat;
    /**
     * @en Calculates the length of the quaternion
     * @zh 求四元数长度
     */
    length(): number;
    /**
     * @en Calculates the squared length of the quaternion
     * @zh 求四元数长度平方
     */
    lengthSqr(): number;
    /**
     * @en Return the information of the quaternion in string.
     * @zh 返回当前四元数的字符串表示。
     */
    toString(): string;
}
export declare function quat(other: Quat): Quat;
export declare function quat(x?: number, y?: number, z?: number, w?: number): Quat;
