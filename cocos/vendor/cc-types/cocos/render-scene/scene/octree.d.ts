import { Vec3 } from '../../core';
import { OctreeInfo } from '../../scene-graph/scene-globals';
/**
 * @en The octree culling configuration of the render scene
 * @zh 渲染场景的八叉树剔除配置
 */
export declare class Octree {
    /**
     * @en Whether octree culling is enabled in the render scene
     * @zh 是否开启八叉树加速剔除
     */
    set enabled(val: boolean);
    get enabled(): boolean;
    /**
     * @en Minimum position of the scene's bounding box
     * @zh 场景包围盒最小值
     */
    get minPos(): Vec3;
    set minPos(val: Vec3);
    /**
     * @en Maximum position of the scene's bounding box
     * @zh 场景包围盒最大值
     */
    get maxPos(): Vec3;
    set maxPos(val: Vec3);
    /**
     * @en The depth of the octree
     * @zh 八叉树深度
     */
    get depth(): number;
    set depth(val: number);
    protected _enabled: boolean;
    protected _minPos: Vec3;
    protected _maxPos: Vec3;
    protected _depth: number;
    initialize(octreeInfo: OctreeInfo): void;
}
