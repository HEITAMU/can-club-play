import { Node } from '../../scene-graph/node';
/**
 * @en Utility for 3d model static batching
 * @zh 服务于 3D 模型静态合批的工具类
 */
export declare class BatchingUtility {
    /**
     * @en
     * Collect the Models under `staticModelRoot`,
     * merge all the meshes statically into one (while disabling each component),
     * and attach it to a new Model on `batchedRoot`.
     * The world transform of each model is guaranteed to be preserved.
     *
     * For a more fine-grained control over the process, use `Mesh.merge` directly.
     * @zh
     * 在`staticModelRoot`下收集模型。
     * 将所有的网格静态地合并成一个（同时禁用每个组件）。
     * 并将其附加到 `batchedRoot` 上的一个新模型。
     * 每个模型的世界变换都被保证保留下来。
     * 如果要对这个过程进行更精细的控制，可以直接使用 `Mesh.merge`。
     * @param staticModelRoot root of all the static models to be batched
     * @param batchedRoot the target output node
     */
    static batchStaticModel(staticModelRoot: Node, batchedRoot: Node): boolean;
    /**
     * @en
     * Undoes everything `batchStaticModel` did.
     * @zh
     * 回退 `batchStaticModel` 做的工作
     *
     * @param staticModelRoot root of all the static models to be batched
     * @param batchedRoot the target output node
     */
    static unbatchStaticModel(staticModelRoot: Node, batchedRoot: Node): boolean;
}
