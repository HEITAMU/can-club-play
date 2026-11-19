import { EditorExtendable } from '../../../../core';
import { PoseGraphNode } from './pose-graph-node';
/**
 * @zh
 * 描述姿势图结点上的某项输入的路径。
 * @en
 * Describes the path to a input of a pose graph node.
 *
 * @internal Internally, the path is stored as an tuple.
 * The first element of tuple is always the input's property key.
 * There can be an optional second tuple element,
 * which represents the input's property's element, if it's an array property.
 */
export type NodeInputPath = readonly [string] | readonly [string, number];
/**
 * @zh 表示姿势图结点的外壳。
 *
 * 结点外壳是附着在结点上的、对结点之间的连接（称之为绑定）的描述。
 * 外壳由姿势图以及绑定系统操纵，结点对于其外壳是无感知的。
 *
 * @en Represents the shell of a pose graph node.
 *
 * The node shell is attached to a node,
 * and describes the connections(so called binding) between nodes.
 * Shells are manipulated by pose graph and binding system.
 * Nodes are imperceptible to their shells.
 */
export declare class PoseGraphNodeShell extends EditorExtendable {
    /**
     * @zh
     * 获取此结点上的所有的绑定。
     * @en
     * Gets all bindings on this node.
     * @returns @zh 绑定对象数组。 @en The binding objects array.
     */
    getBindings(): PoseGraphNodeInputBinding[];
    /**
     * @zh
     * 添加一项绑定。
     * @en
     * Adds a binding.
     * @param inputPath @zh 要绑定的输入的路径。 @en Path of the input to bind.
     * @param producer @zh 生产方结点。 @en The producer node.
     * @param outputIndex @zh 要绑定的生产方的输出索引。 @en Index of the output to bind.
     * @note
     * @zh 绑定是由三元组输入路径、生产方结点和生产方索引唯一键定的。重复的添加相同绑定没有效果。
     * @en A binding is keyed by the 3-element tuple: input path, producer node and producer output index.
     * Redundantly adding a binding takes no effect.
     */
    addBinding(inputPath: NodeInputPath, producer: PoseGraphNode, outputIndex: number): void;
    /**
     * @zh
     * 删除指定输入上的绑定。
     * @en
     * Deletes the binding on specified input.
     * @param inputPath @zh 要解绑的输入的路径。 @en Path of the input to unbind.
     */
    deleteBinding(inputPath: NodeInputPath): void;
    /**
     * @zh
     * 更新绑定，
     * 对于具有相同属性键的、索引小于（或大于） `firstIndex` 的输入的绑定，
     * 将它们替换为上一个（或下一个）索引上的绑定。
     * @en
     * Update bindings so that
     * for the input bindings having specified property key but having element index less than the specified index,
     * substitute them as previous(or next) index's binding.
     * @param propertyKey @zh 输入的属性键。 @en The input's property key.
     * @param firstIndex @zh 见描述。 @en See description.
     * @param forward @en 替换的方向。`true` 表示向前替换，反之向后。
     *              @en Substitution direction. `true` means substitute in forward, backward otherwise.
     */
    moveArrayElementBindingForward(propertyKey: string, firstIndex: number, forward: boolean): void;
    /**
     * @zh
     * 删除绑定到指定生产方结点的所有绑定。
     * @en
     * Deletes all the bindings bound to specified producer.
     * @param producer @zh 生产方结点。 @en The producer node.
     */
    deleteBindingTo(producer: PoseGraphNode): void;
    /**
     * @zh
     * 查找指定输入上的绑定。
     * @en
     * Finds the binding on specified input.
     * @param inputPath @zh 要查找的输入的路径。 @en Path of the input to find.
     */
    findBinding(inputPath: NodeInputPath): PoseGraphNodeInputBinding | undefined;
    private _bindings;
    private _findBindingIndex;
    private _emplaceBinding;
}
/**
 * @zh 描述既定结点（作为消费方）和另一结点（作为生产方）之间的绑定信息。
 * @en Describes the binding information between a given node(as consumer) and another node(as producer).
 */
declare class PoseGraphNodeInputBinding {
    constructor(inputPath: NodeInputPath, producer: PoseGraphNode, outputIndex?: number);
    /**
     * @zh 消费方结点的输入路径。
     * @en Input path of consumer node.
     */
    get inputPath(): NodeInputPath;
    /**
     * @zh 生产方结点。
     * @en The producer node.
     */
    get producer(): PoseGraphNode;
    /**
     * @zh 生产方结点的输出索引。
     * @en The producer node's output index.
     */
    get outputIndex(): number;
    private _inputPath;
    private _producer;
    private _outputIndex;
}
export type { PoseGraphNodeInputBinding };
