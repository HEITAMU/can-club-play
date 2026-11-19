import { Mat4 } from '../../core';
import { Asset } from '../../asset/assets/asset';
/**
 * @en The skeleton asset. It stores the path related to [[SkinnedMeshRenderer.skinningRoot]] of all bones and its bind pose matrix.
 * @zh 骨骼资源。骨骼资源记录了每个关节（相对于 [[SkinnedMeshRenderer.skinningRoot]]）的路径以及它的绑定姿势矩阵。
 */
export declare class Skeleton extends Asset {
    private _joints;
    private _bindposes;
    private _hash;
    private _invBindposes;
    constructor(name?: string);
    /**
     * @en The path of all bones, the length always equals the length of [[bindposes]]
     * @zh 所有关节的路径。该数组的长度始终与 [[bindposes]] 的长度相同。
     */
    get joints(): string[];
    set joints(value: string[]);
    /**
     * @en The bind poses matrix of all bones, the length always equals the length of [[joints]]
     * @zh 所有关节的绑定姿势矩阵。该数组的长度始终与 [[joints]] 的长度相同。
     */
    get bindposes(): Mat4[];
    set bindposes(value: Mat4[]);
    /**
     * @en Gets the inverse bind poses matrix
     * @zh 获取反向绑定姿势矩阵
     */
    get inverseBindposes(): Mat4[];
    /**
     * @en Gets the hash of the skeleton asset
     * @zh 获取骨骼资源的哈希值
     */
    get hash(): number;
    destroy(): boolean;
    /**
     * @en Check whether the skeleton is validate which means it has both joints and bindposes data.
     * @zh 检查当前骨骼对象是否是有效的，取决于它是否包含关节路径和绑定姿势数据。
     * @returns @en Whether the skeleton is valid or not @zh 此骨骼是否有效
     */
    validate(): boolean;
}
