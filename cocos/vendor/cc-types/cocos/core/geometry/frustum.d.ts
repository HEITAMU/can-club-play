import { Mat4, Vec3 } from '../math';
import { Plane } from './plane';
import { AABB } from './aabb';
/**
 * @en
 * Basic Geometry: frustum.
 * @zh
 * 基础几何：视锥体。
 */
export declare class Frustum {
    /**
     * @en Creates an orthographic frustum.
     * @zh 创建一个正交视锥体。
     * @param out @en The result orthographic frustum. @zh 输出的正交视锥体。
     * @param width @en The width of the frustum. @zh 正交视锥体的宽度。
     * @param height @en The height of the frustum. @zh 正交视锥体的高度。
     * @param near @en The near plane of the frustum. @zh 正交视锥体的近平面值。
     * @param far @en The far plane of the frustum. @zh 正交视锥体的远平面值。
     * @param transform @en The transform matrix of the frustum. @zh 正交视锥体的变换矩阵。
     * @returns @en The result frustum, same as the `out` parameter. @zh 存储结果的视锥体，与 `out` 参数为同一个对象。
     */
    static createOrthographic(out: Frustum, width: number, height: number, near: number, far: number, transform: Mat4): void;
    /**
     * @en Creates an orthographic frustum.
     * @zh 创建一个正交视锥体。
     * @param out @en The result orthographic frustum. @zh 输出的正交视锥体。
     * @param width @en The width of the frustum. @zh 正交视锥体的宽度。
     * @param height @en The height of the frustum. @zh 正交视锥体的高度。
     * @param near @en The near plane of the frustum. @zh 正交视锥体的近平面值。
     * @param far @en The far plane of the frustum. @zh 正交视锥体的远平面值。
     * @param transform @en The transform matrix of the frustum. @zh 正交视锥体的变换矩阵。
     * @returns @en The result frustum, same as the `out` parameter. @zh 存储结果的视锥体，与 `out` 参数为同一个对象。
     *
     * @deprecated since v3.8.0, please use [[createOrthographic]] instead.
     */
    static createOrtho(out: Frustum, width: number, height: number, near: number, far: number, transform: Mat4): void;
    /**
     * @en Creates a perspective frustum.
     * @zh 创建一个透视视锥体。
     * @param aspect @en The aspect ratio of the camera. @zh 相机视图的长宽比。
     * @param fov @en The field of view of the camera. @zh 相机的视角大小。
     * @param near @en The near plane of the frustum. @zh 视锥体的近平面值。
     * @param far @en The far plane of the frustum. @zh 视锥体的远平面值。
     * @param transform @en The transform matrix. @zh 变换矩阵。
     * @returns @en The result frustum, same as the `out` parameter. @zh 存储结果的视锥体，与 `out` 参数为同一个对象。
     */
    static createPerspective(out: Frustum, aspect: number, fov: number, near: number, far: number, transform: Mat4): void;
    /**
     * @en Creates a frustum from an AABB instance.
     * @zh 根据一个 AABB 实例创建一个视锥体。
     * @param out @en The result frustum. @zh 输出的视锥体对象。
     * @param aabb @en The AABB to create the result frustum. @zh 用于创建视锥体 AABB。
     * @returns @en The result frustum, same as the `out` parameter. @zh 存储结果的视锥体，与 `out` 参数为同一个对象。
     *
     * @deprecated since v3.8.0, please use [[createOrthographic]] instead.
     */
    static createFromAABB(out: Frustum, aabb: AABB | Readonly<AABB>): Frustum;
    /**
     * @en Calculates a split frustum.
     * @zh 计算出一个分割的视锥体。
     * @param start @en The split start position. @zh 分割开始位置。
     * @param end @en The split end position. @zh 分割末尾位置。
     * @param aspect @en The aspect ratio of the camera. @zh 相机视图的长宽比。
     * @param fov @en The field of view of the camera. @zh 相机的视角大小。
     * @param m @en The transform matrix. @zh 变换矩阵。
     *
     * @deprecated since v3.8.0, please use [[createPerspective]] instead.
     */
    split(start: number, end: number, aspect: number, fov: number, m: Mat4): void;
    /**
     * @en
     * Creates a new frustum.
     * @zh
     * 创建一个新的视椎体。
     * @returns @en An empty frustum. @zh 一个空视椎体。
     */
    static create(): Frustum;
    /**
     * @en
     * Clones a frustum.
     * @zh
     * 克隆一个视椎体。
     * @param f @en The frustum to clone from. @zh 用于克隆的视椎体。
     * @return @en The cloned frustum. @zh 克隆出的新视椎体。
     */
    static clone(f: Frustum): Frustum;
    /**
     * @en
     * Copies the values from one frustum to another.
     * @zh
     * 从一个视锥体拷贝到另一个视锥体。
     * @param out @en The result frustum @zh 用于存储拷贝数据的截锥体
     * @param f @en The frustum to copy from @zh 用于克隆的截锥体
     * @returns @en The result frustum, same as the `out` parameter. @zh 存储结果的视锥体，与 `out` 参数为同一个对象。
     */
    static copy(out: Frustum, f: Readonly<Frustum>): Frustum;
    /**
     * @en
     * Sets whether to use accurate intersection testing function on this frustum.
     * @zh
     * 设置是否在此截锥体上使用精确的相交测试函数。
     *
     * @deprecated since v3.8.0 no need to set accurate flag since it doesn't affect the calculation at all.
     */
    set accurate(b: boolean);
    /**
     * @en
     * Gets the type of the shape. The value may be `ShapeType.SHAPE_FRUSTUM_ACCURATE` or `ShapeType.SHAPE_FRUSTUM`.
     * @zh
     * 获取形状的类型。值可能为 `ShapeType.SHAPE_FRUSTUM_ACCURATE` 或 `ShapeType.SHAPE_FRUSTUM`。
     * @readonly
     */
    get type(): number;
    /**
     * @en
     * The 6 planes of the frustum.
     * @zh
     * 视椎体的 6 个面。
     */
    planes: Plane[];
    /**
     * @en
     * The 8 vertices of the frustum.
     * @zh
     * 视椎体的 8 个顶点。
     */
    vertices: Vec3[];
    protected _type: number;
    constructor();
    /**
     * @en
     * Updates the frustum information according to the given transform matrix.
     * Note that the resulting planes are not normalized under normal mode.
     * @zh
     * 根据给定的变换矩阵更新截锥体信息，注意得到的平面不是在标准模式下归一化的。
     * @param m @en The view-projection matrix. @zh 视图投影矩阵。
     * @param inv @en The inverse view-projection matrix. @zh 视图投影逆矩阵。
     */
    update(m: Mat4, inv: Mat4): void;
    /**
     * @en
     * Transforms this frustum.
     * @zh
     * 变换此视锥体。
     * @param mat @en The transform matrix. @zh 变换矩阵。
     */
    transform(mat: Mat4): void;
    /**
     * @en Makes the frustum empty, all vertices will be zero values.
     * @zh 置空此视锥体，所有顶点将被赋值为 0。
     */
    zero(): void;
    /**
     * @en Updates all six planes of the frustum.
     * @zh 更新视锥体的所有面数据。
     */
    updatePlanes(): void;
}
