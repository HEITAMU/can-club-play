import { Vec3 } from '../../core';
import { Component } from '../../scene-graph/component';
import { MeshRenderer } from '../framework/mesh-renderer';
import { scene } from '../../render-scene';
import type { LODData } from '../../render-scene/scene';
export type ModelAddedCallback = () => void;
export declare class LOD {
    protected _screenUsagePercentage: number;
    protected _renderers: MeshRenderer[];
    /**
     * @engineInternal
     */
    private _LODData;
    /**
     * @engineInternal
     */
    private _modelAddedCallback;
    constructor();
    /**
     * @en Minimum percentage of screen usage for the current lod in effect, range in [0, 1]
     * @zh 本层级生效时，占用屏幕的最小百分比, 取值范围[0, 1]
     */
    get screenUsagePercentage(): number;
    set screenUsagePercentage(val: number);
    /**
     * @en Get the list of [[MeshRenderer]] used by the current lod.
     * @zh 获取当前lod使用的 [[MeshRenderer]] 列表
     */
    get renderers(): readonly MeshRenderer[];
    /**
     * @en reset _renderers to meshList or [], LODData's model will be reset too.
     * @zh 重置 _renderers 为 meshList或空数组, LODData上的model也会被重置
     */
    set renderers(meshList: readonly MeshRenderer[]);
    /**
     * @engineInternal
     * @en Get the total number of all mesh's triangle.
     * @zh 获取所有模型的三角形总数
     */
    get triangleCount(): number[];
    /**
     * @en Get the number of LOD.
     * @zh 获取LOD的数量
     */
    get rendererCount(): number;
    /**
      * @engineInternal
      * @en Get internal LOD object.
      */
    get lodData(): LODData;
    /**
      * @engineInternal
      */
    set modelAddedCallback(callback: ModelAddedCallback);
    /**
     * @en Insert a [[MeshRenderer]] before specific index position.
     * @zh 在指定的数组索引处插入一个[[MeshRenderer]]
     * @param index @en The rendering array is indexed from 0. If - 1 is passed, it will be added to the end of the list.
     * @zh renderers数组从0开始索引，若传递-1将会被添加到列表末尾。
     * @param renderer @en The mesh-renderer object. @zh [[MeshRenderer]] 对象
     * @returns @en The inserted [[MeshRenderer]] @zh 返回被插入的 [[MeshRenderer]] 对象
     */
    insertRenderer(index: number, renderer: MeshRenderer): MeshRenderer;
    /**
     * @en Delete the [[MeshRenderer]] at specific index position.
     * @zh 删除指定索引处的[[MeshRenderer]]
     * @param index @en 0 indexed position in renderer array, when -1 is specified, the last element will be deleted.
     * @zh _renderers从0开始索引，传递-1则最后一个元素会被删除。
     * @returns @en The deleted [[MeshRenderer]], or null if the specified index does not exist. @zh 如果指定索引处的对象存在，返回被删除对象否则返回null。
     */
    deleteRenderer(index: number): MeshRenderer | null;
    /**
     * @en Get the [[MeshRenderer]] at specific index position.
     * @zh 获取指定索引处的[[MeshRenderer]]
     * @param index @en Value range from 0 to _renderers's length. @zh 取值范围是[0, _renderers长度]
     * @return @en Returns the [[MeshRenderer]] at the specified index, or null if the specified index does not exist. @zh 返回指定索引处的对象，若不存在则返回null。
     */
    getRenderer(index: number): MeshRenderer | null;
    /**
     * @en Update the [[MeshRenderer]] at specific index position.
     * @zh 更新指定索引处的 [[MeshRenderer]]
     * @param index @en Value range from 0 to _renderers's length @zh 取值范围是 [0, _renderers数组长度]
     */
    setRenderer(index: number, renderer: MeshRenderer): void;
}
export declare class LODGroup extends Component {
    /**
     * @en Object reference point in local space, e.g. center of the bound volume for all LODs
     */
    protected _localBoundaryCenter: Vec3;
    /**
     * @en Object Size in local space, may be auto-calculated value from object bounding box or value from user input.
     */
    protected _objectSize: number;
    /**
     *@en The array of LODs
     */
    protected _LODs: LOD[];
    /**
     * @engineInternal
     */
    protected _lodGroup: scene.LODGroup;
    private _eventRegistered;
    private _forceUsedLevels;
    constructor();
    /**
     * @engineInternal
     */
    set localBoundaryCenter(val: Readonly<Vec3>);
    /**
     * @en Obtain the center point of AABB composed of all models
     * @zh 获取所有模型组成的AABB的中心点
     */
    get localBoundaryCenter(): Readonly<Vec3>;
    /**
     * @en Obtain LOD level numbers.
     * @zh 获取LOD层级数
     */
    get lodCount(): number;
    /**
     * @en Set current AABB's size.
     * @zh 设置当前包围盒的大小
     */
    set objectSize(val: number);
    /**
     * @en Get current AABB's size.
     * @zh 获取当前包围盒的大小
     */
    get objectSize(): number;
    /**
     * @en Get LOD array config.
     * @zh 获取 LOD 数组
     */
    get LODs(): readonly LOD[];
    /**
     * @en Reset current LODs to new value.
     * @ 重置 LODs 为当前新设置的值。
     */
    set LODs(valArray: readonly LOD[]);
    /**
     * @engineInternal
     */
    get lodGroup(): scene.LODGroup;
    private onLodModelAddedCallback;
    /**
     * @en Insert the [[LOD]] at specific index position, [[LOD]] will be inserted to the last position if index less than 0 or greater than lodCount.
     * @zh 在指定索引处插入 [[LOD]], 若索引为负或超过lodCount，则在末尾添加
     * @param index @en location where lod is added. @zh lod被插入的位置
     * @param screenUsagePercentage @en The minimum screen usage percentage that the currently set lod starts to use, range in[0, 1].
     * @zh lod生效时的最低屏幕显示百分比要求，取值范围[0, 1]
     * @param lod @en If this parameter is not set, it will be created by default. @zh 如果参数没传，则内部创建
     * @returns @en The new lod added. @zh 返回被添加的lod
     */
    insertLOD(index: number, screenUsagePercentage?: number, lod?: LOD): LOD;
    /**
     * @en Erase the [[LOD]] at specific index position.
     * @zh 删除指定索引处的 [[LOD]]
     * @param index @en Index of the erased lod, range in [0, lodCount]. @zh 被删除对象索引, 取值范围[0, lodCount]
     * @returns @en Erased lod. @zh 被删除的对象
     */
    eraseLOD(index: number): LOD | null;
    /**
     * @en Get [[LOD]] at specific index position.
     * @zh 获取指定索引处的 [[LOD]]
     * @param index @en Range in [0, lodCount]. @zh 取值范围[0, lodCount]
     * @returns @en Lod at specified index, or null. @zh 返回指定索引的lod或null
     */
    getLOD(index: number): LOD | null;
    /**
     * @en Update the [[LOD]] at specific index position.
     * @zh 更新指定索引处的 [[LOD]]
     * @param index, update lod at specified index.
     * @param lod, the updated lod.
     */
    setLOD(index: number, lod: LOD): void;
    /**
     * @en Recalculate the bounding box, and the interface will recalculate the localBoundaryCenter and objectSize
     * @zh 重新计算包围盒，该接口会更新 localBoundaryCenter 和 objectSize
     */
    recalculateBounds(): void;
    /**
     * @en reset current objectSize to 1, and recalculate screenUsagePercentage.
     * @zh 重置 objectSize 的大小为1，该接口会重新计算 screenUsagePercentage
     */
    resetObjectSize(): void;
    /**
     * @zh 强制使用某一级的LOD
     * @en Force LOD level to use.
     * lodLevel @en The LOD level to use. Passing lodLevel < 0 will return to standard LOD processing. @zh 要使用的LOD层级，为负数时使用标准的处理流程
     */
    forceLOD(lodLevel: number): void;
    /**
     * @en Force multi LOD level to use, This function is only called in editor.<br/>
     * @zh 强制使用某几级的LOD,该接口只会在编辑器下调用。
     * lodIndexArray @en The LOD level array. Passing [] will return to standard LOD processing. @zh 要使用的LOD层级数组，传[]时将使用标准的处理流程。
     */
    forceLODs(lodIndexArray: number[]): void;
    onLoad(): void;
    _onRemove(comp: Component): void;
    private _constructLOD;
    onRestore(): void;
    onEnable(): void;
    onDisable(): void;
    private _attachToScene;
    private _detachFromScene;
    private _emitChangeNode;
    private _updateDataToScene;
}
