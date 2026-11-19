import { Mat3, Mat4, Quat, Vec3 } from '../math';
/**
 * @en
 * Basic Geometry: Oriented bounding box.
 * @zh
 * 基础几何：方向包围盒。
 */
export declare class OBB {
    /**
     * @en
     * Creates a new OBB instance
     * @zh
     * 创建一个新的 OBB 实例。
     * @param cx @zh 形状的相对于原点的 X 坐标。 @en The x coordinate of origin.
     * @param cy @zh 形状的相对于原点的 Y 坐标。 @en The y coordinate of origin.
     * @param cz @zh 形状的相对于原点的 Z 坐标。 @en The z coordinate of origin.
     * @param hw @zh - OBB 宽度的一半。 @en Half the width of the OBB.
     * @param hh @zh - OBB 高度的一半。 @en Half the height of the OBB.
     * @param hl @zh - OBB 长度的一半。 @en Half the length of the OBB.
     * @param ox_1 @zh 方向矩阵参数，第 1 条轴的 x 分量。 @en The x component of the first axis of the OBB.
     * @param ox_2 @zh 方向矩阵参数，第 2 条轴的 x 分量。 @en The x component of the second axis of the OBB.
     * @param ox_3 @zh 方向矩阵参数，第 3 条轴的 x 分量。 @en The x component of the third axis of the OBB.
     * @param oy_1 @zh 方向矩阵参数，第 1 条轴的 y 分量。 @en The y component of the first axis of the OBB.
     * @param oy_2 @zh 方向矩阵参数，第 2 条轴的 y 分量。 @en The y component of the second axis of the OBB.
     * @param oy_3 @zh 方向矩阵参数，第 3 条轴的 y 分量。 @en The y component of the third axis of the OBB.
     * @param oz_1 @zh 方向矩阵参数，第 1 条轴的 z 分量。 @en The z component of the first axis of the OBB.
     * @param oz_2 @zh 方向矩阵参数，第 2 条轴的 z 分量。 @en The z component of the second axis of the OBB.
     * @param oz_3 @zh 方向矩阵参数，第 3 条轴的 z 分量。 @en The z component of the third axis of the OBB.
     * @returns @zh 返回新创建的 OBB 实例。 @en A new OBB instance.
     */
    static create(cx: number, cy: number, cz: number, hw: number, hh: number, hl: number, ox_1: number, ox_2: number, ox_3: number, oy_1: number, oy_2: number, oy_3: number, oz_1: number, oz_2: number, oz_3: number): OBB;
    /**
     * @en
     * Clones a new OBB instance.
     * @zh
     * 克隆一个 OBB 实例。
     * @param a @zh 克隆的目标。 @en The input OBB.
     * @returns @zh The cloned OBB instance.  @en 克隆出的新对象。
     */
    static clone(a: OBB): OBB;
    /**
     * @en
     * Copies the values from one OBB to another.
     * @zh
     * 复制一个 OBB 的值到另一个 OBB 中。
     * @param  out @zh 接受操作的 OBB。 @en The output OBB.
     * @param  a @zh 被复制的 OBB。 @en The input OBB.
     * @returns  @zh 接受操作的 OBB，与 `out` 参数相同。 @en The output OBB, same as the `out` parameter.
     */
    static copy(out: OBB, a: OBB): OBB;
    /**
     * @en
     * Creates a new OBB from two corner points.
     * @zh
     * 用两个点创建一个新的 OBB。
     * @param out @zh - 接受操作的 OBB。 @en The output OBB.
     * @param minPos @zh - OBB 的最小点。 @en The minimum position of the AABB.
     * @param maxPos @zh - OBB 的最大点。 @en The maximum position of the AABB.
     * @returns  @zh 接受操作的 OBB，与 `out` 参数相同。 @en The output OBB, same as the `out` parameter.
     */
    static fromPoints(out: OBB, minPos: Vec3, maxPos: Vec3): OBB;
    /**
     * @en
     * Sets the components of an OBB to the given values.
     * @zh
     * 将给定 OBB 的属性设置为给定的值。
     * @param out @zh 目标 OBB @en The output OBB instance.
     * @param cx @zh 形状的相对于原点的 X 坐标。 @en The x coordinate of origin.
     * @param cy @zh 形状的相对于原点的 Y 坐标。 @en The y coordinate of origin.
     * @param cz @zh 形状的相对于原点的 Z 坐标。 @en The z coordinate of origin.
     * @param hw @zh - obb 宽度的一半。 @en Half the width of the OBB.
     * @param hh @zh - obb 高度的一半。 @en Half the height of the OBB.
     * @param hl @zh - obb 长度的一半。 @en Half the length of the OBB.
     * @param ox_1 @zh 方向矩阵参数，第 1 条轴的 x 分量。 @en The x component of the first axis of the OBB.
     * @param ox_2 @zh 方向矩阵参数，第 2 条轴的 x 分量。 @en The x component of the second axis of the OBB.
     * @param ox_3 @zh 方向矩阵参数，第 3 条轴的 x 分量。 @en The x component of the third axis of the OBB.
     * @param oy_1 @zh 方向矩阵参数，第 1 条轴的 y 分量。 @en The y component of the first axis of the OBB.
     * @param oy_2 @zh 方向矩阵参数，第 2 条轴的 y 分量。 @en The y component of the second axis of the OBB.
     * @param oy_3 @zh 方向矩阵参数，第 3 条轴的 y 分量。 @en The y component of the third axis of the OBB.
     * @param oz_1 @zh 方向矩阵参数，第 1 条轴的 z 分量。 @en The z component of the first axis of the OBB.
     * @param oz_2 @zh 方向矩阵参数，第 2 条轴的 z 分量。 @en The z component of the second axis of the OBB.
     * @param oz_3 @zh 方向矩阵参数，第 3 条轴的 z 分量。 @en The z component of the third axis of the OBB.
     * @returns  @zh 接受操作的 OBB，与 `out` 参数相同。 @en The output OBB, same as the `out` parameter.
     */
    static set(out: OBB, cx: number, cy: number, cz: number, hw: number, hh: number, hl: number, ox_1: number, ox_2: number, ox_3: number, oy_1: number, oy_2: number, oy_3: number, oz_1: number, oz_2: number, oz_3: number): OBB;
    /**
     * @en
     * The center point of an OBB in local coordinate.
     * @zh
     * 本地坐标的中心点。
     */
    center: Vec3;
    /**
     * @en
     * Half the distance across the OBB in each local axis.
     * @zh
     * 长宽高的一半。
     */
    halfExtents: Vec3;
    /**
     * @en
     * Orientation matrix.
     * @zh
     * 方向矩阵。
     */
    orientation: Mat3;
    /**
     * @en
     * Gets the type of the OBB. Always returns `ShapeType.SHAPE_OBB`.
     * @zh
     * 获取形状的类型，固定返回 `ShapeType.SHAPE_OBB`。
     */
    get type(): number;
    protected readonly _type: number;
    /**
     * @param cx @zh 形状的相对于原点的 X 坐标。 @en The x coordinate of origin.
     * @param cy @zh 形状的相对于原点的 Y 坐标。 @en The y coordinate of origin.
     * @param cz @zh 形状的相对于原点的 Z 坐标。 @en The z coordinate of origin.
     * @param hw @zh - OBB 宽度的一半。 @en Half the width of the OBB.
     * @param hh @zh - OBB 高度的一半。 @en Half the height of the OBB.
     * @param hl @zh - OBB 长度的一半。 @en Half the length of the OBB.
     * @param ox_1 @zh 方向矩阵参数，第 1 条轴的 x 分量。 @en The x component of the first axis of the OBB.
     * @param ox_2 @zh 方向矩阵参数，第 2 条轴的 x 分量。 @en The x component of the second axis of the OBB.
     * @param ox_3 @zh 方向矩阵参数，第 3 条轴的 x 分量。 @en The x component of the third axis of the OBB.
     * @param oy_1 @zh 方向矩阵参数，第 1 条轴的 y 分量。 @en The y component of the first axis of the OBB.
     * @param oy_2 @zh 方向矩阵参数，第 2 条轴的 y 分量。 @en The y component of the second axis of the OBB.
     * @param oy_3 @zh 方向矩阵参数，第 3 条轴的 y 分量。 @en The y component of the third axis of the OBB.
     * @param oz_1 @zh 方向矩阵参数，第 1 条轴的 z 分量。 @en The z component of the first axis of the OBB.
     * @param oz_2 @zh 方向矩阵参数，第 2 条轴的 z 分量。 @en The z component of the second axis of the OBB.
     * @param oz_3 @zh 方向矩阵参数，第 3 条轴的 z 分量。 @en The z component of the third axis of the OBB.
     */
    constructor(cx?: number, cy?: number, cz?: number, hw?: number, hh?: number, hl?: number, ox_1?: number, ox_2?: number, ox_3?: number, oy_1?: number, oy_2?: number, oy_3?: number, oz_1?: number, oz_2?: number, oz_3?: number);
    /**
     * @en
     * Gets the bounding points of this OBB instance.
     * @zh
     * 获取此 OBB 的最小点和最大点。
     * @param minPos @zh 此 OBB 的最小点。 @en The out minimum position of the OBB.
     * @param maxPos @zh 此 OBB 的最大点。 @en The out maximum position of the OBB.
     */
    getBoundary(minPos: Vec3, maxPos: Vec3): void;
    /**
     * @en
     * Transforms this OBB and store the result to the `out` parameter.
     * @zh
     * 对当前 OBB 的数据进行变换，并存储结果到 `out` 参数中。
     * @param m @zh 变换的矩阵。 @en The transform matrix
     * @param pos @zh 变换的位置部分。 @en 3d-vector translation.
     * @param rot @zh 变换的旋转部分。 @en Quaternion rotation.
     * @param scale @zh 变换的缩放部分。 @en 3d-vector scale.
     * @param out @zh 变换结果的目标 OBB。 @en The output OBB.
     * @note @zh 此方法不会修改当前 OBB 的数据。 @en This method will not modify the data of current OBB.
     */
    transform(m: Mat4, pos: Vec3, rot: Quat, scale: Vec3, out: OBB): void;
    /**
     * @en
     * Transforms this OBB by a 4x4 matrix and a quaternion.
     * @zh
     * 根据一个 4x4 矩阵和一个四元数变换此 OBB。
     * @param m @zh 变换的矩阵。 @en The transform matrix.
     * @param rot @zh 变换的旋转部分。 @en The quaternion for rotation.
     * @param out @zh 变换的目标。 @en The output OBB.
     * @note @zh 此方法不会修改当前 OBB 的数据。 @en This method will not modify the data of current OBB.
     */
    translateAndRotate(m: Mat4, rot: Quat, out: OBB): void;
    /**
     * @en
     * Scales this OBB by a 3d-vector and store the result to the `out` parameter.
     * @zh
     * 根据 3D 向量对此 OBB 的数据进行缩放并将结果存储在 out 参数中。
     * @param scale @zh 缩放值。 @en 3d-vector scale.
     * @param out @zh 缩放的目标。 @en The output OBB.
     * @note @zh 此方法不会修改当前 OBB 的数据。 @en This method will not modify the data of current OBB.
     */
    setScale(scale: Vec3, out: OBB): void;
}
