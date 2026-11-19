import { PoseGraphNode } from '../pose-graph-node';
import { PoseGraphType } from '../type-system';
import { NodeInputPath } from '../node-shell';
import type { PoseGraph } from '../../pose-graph';
export type PoseGraphInputKey = NodeInputPath;
export interface PropertyNodeInputMetadata {
    displayName?: string;
}
export interface PoseGraphNodeInputMetadata {
    type: PoseGraphType;
    displayName?: PoseGraphNodeInputDisplayName;
    deletable?: boolean;
    insertPoint?: boolean;
}
export type PoseGraphNodeInputDisplayName = string | [string, Record<string, string | number>];
type Constructor = Function;
export type PoseGraphNodeInputInsertId = string;
/**
 * @zh 描述一个姿势图结点类属性在映射为结点输入时的选项。
 * @en Describes the options used
 * when a pose node class property is going to be mapped as node input(s).
 */
export interface PoseGraphNodeInputMappingOptions {
    /**
     * @zh 此属性或属性的元素映射的输入类型。
     * 输入的类型必须和属性（的元素）的实际值类型匹配。
     *
     * @en Type of the input(s) that the property associates.
     * The input type should be matched with the actual value type of the property.
     */
    type: PoseGraphType;
    /**
     * @zh 此属性关联的输入的显示名称。
     * @en Display of the input(s) that the property associates.
     */
    displayName?: PoseGraphNodeInputDisplayName;
    /**
     * @zh 若有定义，当该属性是数组时，此方法被用来获取数组各个元素所映射的输入的显示名称。
     * @en If specified and if the property is an array,
     * this method will be used to retrieve the display name of input mapped by each element.
     * @param index 数组元素的索引。
     */
    getArrayElementDisplayName?(index: number): PoseGraphNodeInputDisplayName;
    /**
     * @zh 若有定义，当该属性是数组时，声明该数组属性属于指定的同步组。
     * 同步组中的任何成员在进行输入增加、移除或挪动等操作时，其它成员也将进行该操作。
     *
     * @en If specified and if the property is an array,
     * declares that the array property belongs to specified sync group.
     * When any member of the sync group is performing input add/remove/move etc. operation,
     * the other members will also perform that operation.
     *
     * @example
     * @zh
     * 对于如下结点类来说：
     *
     * ```ts
     * class Blending extends PoseNode {
     *     \@input({ type: PoseGraphType.POSE, syncGroup: 'blend-item' })
     *     poses: PoseNode[] = [];
     *
     *     \@input({ type: PoseGraphType.FLOAT, syncGroup: 'blend-item' })
     *     weights: number[] = [];
     * }
     * ```
     *
     * 当 `poses` 插入了一个新的输入后，`weights` 也会被插入一个新输入。
     *
     * @en
     * For the following node class:
     *
     * ```ts
     * class Blending extends PoseNode {
     *     \@input({ type: PoseGraphType.POSE, syncGroup: 'blend-item' })
     *     poses: PoseNode[] = [];
     *
     *     \@input({ type: PoseGraphType.FLOAT, syncGroup: 'blend-item' })
     *     weights: number[] = [];
     * }
     * ```
     *
     * If a new input is inserted into `poses`, there will be also a new input inserted into weights.
     */
    arraySyncGroup?: string;
    /**
     * @zh
     * 若为 `true` 且 `arraySyncGroup` 生效时，
     * 不再允许主动向此数组中添加元素或删除元素，相反，该数组只能被动配合同步组中的其它成员增删改。
     * @en
     * If `true` and if `arraySyncGroup` is taking effect,
     * it's no longer allowed to actively add or remove elements from this array,
     * instead this array can only passively cope with other members in sync group to add, remove or edit.
     */
    arraySyncGroupFollower?: boolean;
}
declare class PoseGraphNodeInputManager {
    setPropertyNodeInputRecord(constructor: Constructor, propertyKey: string, options: PoseGraphNodeInputMappingOptions): void;
    getInputKeys(object: PoseGraphNode): readonly PoseGraphInputKey[];
    isPoseInput(object: PoseGraphNode, key: PoseGraphInputKey): boolean;
    getInputMetadata(object: PoseGraphNode, key: PoseGraphInputKey): Readonly<PoseGraphNodeInputMetadata> | undefined;
    hasInput(object: PoseGraphNode, key: PoseGraphInputKey): boolean;
    getInputInsertInfos(object: PoseGraphNode): Readonly<Record<PoseGraphNodeInputInsertId, {
        displayName: string;
    }>>;
    deleteInput(graph: PoseGraph, node: PoseGraphNode, key: PoseGraphInputKey): void;
    insertInput(graph: PoseGraph, node: PoseGraphNode, insertId: PoseGraphNodeInputInsertId): void;
    private _classInputMap;
    private _getPropertyNodeInputRecord;
    private _insertInputInArraySyncGroup;
    private _deleteInputInArraySyncGroup;
}
export declare const globalPoseGraphNodeInputManager: PoseGraphNodeInputManager;
export {};
