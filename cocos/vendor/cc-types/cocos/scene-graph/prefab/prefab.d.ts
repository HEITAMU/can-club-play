import { Asset } from '../../asset/assets/asset';
import { Node } from '../node';
import * as utils from './utils';
/**
 * @en Class for prefab handling.
 * @zh 预制资源类。
 */
export declare class Prefab extends Asset {
    /**
     * @en Enumeration for optimization policy
     * @zh Prefab 创建实例所用的优化策略枚举类型
     */
    static OptimizationPolicy: {
        /**
         * @en The optimization policy is automatically chosen based on the number of instantiations.
         * When you first create an instance, the behavior is the same as SINGLE_INSTANCE.
         * MULTI_INSTANCE will be automatically used after multiple creation.
         * @zh 根据创建次数自动调整优化策略。初次创建实例时，行为等同 SINGLE_INSTANCE，多次创建后将自动采用 MULTI_INSTANCE。
         */
        AUTO: number;
        /**
         * @en Optimize for single instance creation.<br>
         * This option skips code generation for this prefab.
         * When this prefab will usually create only one instances, please select this option.
         * @zh 优化单次创建性能。<br>
         * 该选项会跳过针对这个 prefab 的代码生成优化操作。当该 prefab 加载后，一般只会创建一个实例时，请选择此项。
         */
        SINGLE_INSTANCE: number;
        /**
         * @en Optimize for creating instances multiple times.<br>
         * This option enables code generation for this prefab.
         * When this prefab will usually create multiple instances, please select this option.
         * It is also recommended to select this option if the prefab instance in the scene
         * has Auto Sync enabled and there are multiple instances in the scene.
         * @zh 优化多次创建性能。<br>
         * 该选项会启用针对这个 prefab 的代码生成优化操作。当该 prefab 加载后，一般会创建多个实例时，请选择此项。如果该 prefab 在场景中的节点启用了自动关联，并且在场景中有多份实例，也建议选择此项。
         */
        MULTI_INSTANCE: number;
    };
    static OptimizationPolicyThreshold: number;
    /**
     * @en The main [[Node]] in the prefab
     * @zh Prefab 中的根节点，[[Node]] 类型
     */
    data: any;
    /**
     * @zh
     * 设置实例化这个 prefab 时所用的优化策略。根据使用情况设置为合适的值，能优化该 prefab 实例化所用的时间。推荐在编辑器的资源中设置。
     * @en
     * Indicates the optimization policy for instantiating this prefab.
     * Set to a suitable value based on usage, can optimize the time it takes to instantiate this prefab.
     * Suggest to set this policy in the editor's asset inspector.
     * @default Prefab.OptimizationPolicy.AUTO
     * @example
     * ```ts
     * import { Prefab } from 'cc';
     * prefab.optimizationPolicy = Prefab.OptimizationPolicy.MULTI_INSTANCE;
     * ```
     */
    optimizationPolicy: number;
    persistent: boolean;
    private _createFunction;
    private _instantiatedTimes;
    constructor();
    createNode(cb: (err: Error | null, node: Node) => void): void;
    /**
     * @en
     * Dynamically translation prefab data into minimized code.<br/>
     * This method will be called automatically before the first time the prefab being instantiated,<br/>
     * but you can re-call to refresh the create function once you modified the original prefab data in script.
     * @zh
     * 将预制数据动态转换为最小化代码。<br/>
     * 此方法将在第一次实例化预制件之前自动调用，<br/>
     * 但是您可以在脚本中修改原始预制数据后重新调用以刷新创建功能。
     */
    compileCreateFunction(): void;
    /**
     * @engineInternal
     */
    _doInstantiate(rootToRedirect?: any): Node;
    /**
     * @dontmangle
     * NOTE: the protected method `_instantiate` is invoked by dynamically without type information.
     * See `instantiate` in cocos/serialization/instantiate.ts.
     * ```ts
     * clone = original._instantiate(null, true); // original is any, so _instantiate should not be mangled.
     * ```
     */
    protected _instantiate(): Node;
    initDefault(uuid?: string): void;
    validate(): boolean;
    onLoaded(): void;
}
export declare namespace Prefab {
    export { utils as _utils };
}
