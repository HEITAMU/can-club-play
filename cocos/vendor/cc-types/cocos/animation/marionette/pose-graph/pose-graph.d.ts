import { EditorExtendable } from '../../../core';
import { PoseGraphNodeShell } from './foundation/node-shell';
import { PoseGraphNode } from './foundation/pose-graph-node';
import { PoseGraphOutputNode } from './graph-output-node';
/**
 * @zh
 * 姿势图。
 * @en
 * Pose graph.
 */
export declare class PoseGraph extends EditorExtendable {
    constructor();
    /**
     * @zh 姿势图的输出结点。
     * @en The pose graph's output node.
     */
    get outputNode(): PoseGraphOutputNode;
    /**
     * // TODO: HACK
     * @internal
     */
    __callOnAfterDeserializeRecursive(): void;
    /**
     * @zh 获取所有结点。
     * @en Gets all nodes.
     * @returns @zh 用于遍历所有结点的迭代器。 @en The iterator to iterate all nodes.
     */
    nodes(): IterableIterator<PoseGraphNode>;
    /**
     * @zh 添加一个结点到图中。
     * @en Adds a node into graph.
     * @param node @zh 要添加的结点。 @en Node to add.
     * @returns `node`
     *
     * @note
     * @zh 注意，要添加的结点必须是“独立”的，也就是说它不能已经在任何图中。否则会抛出异常。
     * @en Note, the node to add should be "freestanding",
     * means it should not been already in any graph. Otherwise, an exception would be thrown.
     */
    addNode<TNode extends PoseGraphNode>(node: TNode): TNode;
    /**
     * @zh 将指定的结点从图中移除。
     * @en Removes specified node from the graph.
     * @param removal @zh 要移除的结点。 @en The node to remove.
     *
     * @note
     * @zh 如果要移除的结点不在图中或该结点是图的输出结点，则此方法不会生效。
     * @en If the removal node is not within graph or is the output node of graph,
     * this method takes no effect.
     */
    removeNode(removal: PoseGraphNode): void;
    /**
     * @zh
     * 获取指定结点在姿势图中的外壳。
     * @en
     * Gets the specified node's shell in pose graph.
     * @internal
     */
    getShell(node: PoseGraphNode): PoseGraphNodeShell | undefined;
    private _outputNode;
    private _nodes;
    private _shells;
    private _shellMap;
}
