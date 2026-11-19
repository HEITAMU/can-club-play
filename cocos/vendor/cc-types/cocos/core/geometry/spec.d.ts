/**
 * @en
 * The raycast mode.
 * @zh
 * 射线检测模式。
 */
export declare enum ERaycastMode {
    /**
     * @en
     * Detects and records all data.
     * @zh
     * 检测并记录所有的数据。
     */
    ALL = 0,
    /**
     * @en
     * Detects all data, but records only the most recent data.
     * @zh
     * 检测所有，但只记录最近的数据。
     */
    CLOSEST = 1,
    /**
     * @en
     * Once the test is successful, the test is stopped and the data is recorded only once.
     * @zh
     * 一旦检测成功就停止检测，只会记录一次数据。
     */
    ANY = 2
}
/**
 * @en
 * The storage structure of the raycast results.
 * @zh
 * 射线检测结果的存储结构。
 */
export interface IRaySubMeshResult {
    /**
     * @en
     * The distance between the hit point and the ray.
     * @zh
     * 击中点和射线的距离。
     */
    distance: number;
    /**
     * @en
     * The index of the triangle vertex 0。
     * @zh
     * 三角形顶点0的索引。
     */
    vertexIndex0: number;
    /**
     * @en
     * The index of the triangle vertex 1。
     * @zh
     * 三角形顶点1的索引
     */
    vertexIndex1: number;
    /**
     * @en
     * The index of the triangle vertex 2。
     * @zh
     * 三角形顶点2的索引
     */
    vertexIndex2: number;
}
/**
 * @en
 * The optional param structure of the `raySubMesh`.
 * @zh
 * `raySubMesh`的可选参数结构。
 */
export interface IRaySubMeshOptions {
    /**
     * @en
     * The raycast mode，`ANY` by default.
     * @zh
     * 射线检测模式：[0, 1, 2]=>[`ALL`, `CLOSEST`, `ANY`]
     */
    mode: ERaycastMode;
    /**
     * @en
     * The maximum distance of the raycast, `Infinity` by default.
     * @zh
     * 射线检测的最大距离，默认为`Infinity`。
     */
    distance: number;
    /**
     * @en
     * An array used to store the results of a ray detection.
     * @zh
     * 用于存储射线检测结果的数组。
     */
    result?: IRaySubMeshResult[];
    /**
     * @en
     * Whether to detect the double-sided or not，`false` by default.
     * @zh
     * 是否检测双面，默认为`false`。
     */
    doubleSided?: boolean;
}
/**
 * @en
 * The optional param structure of the `rayMesh`.
 * @zh
 * `rayMesh`的可选参数结构。
 */
export interface IRayMeshOptions extends IRaySubMeshOptions {
    /**
     * @en
     * The index of the sub mesh.
     * @zh
     * 子网格的索引。
     */
    subIndices?: number[];
}
/**
 * @en
 * The optional parameter structure of the `rayModel`.
 * @zh
 * `rayModel`的可选参数结构。
 */
export type IRayModelOptions = IRayMeshOptions;
