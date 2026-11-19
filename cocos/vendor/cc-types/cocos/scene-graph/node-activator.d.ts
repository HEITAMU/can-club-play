import { OneOffInvoker, LifeCycleInvoker, InvokeFunc } from './component-scheduler';
import type { Component } from './component';
import type { Node } from './node';
declare class UnsortedInvoker extends LifeCycleInvoker {
    constructor(invokeFunc: InvokeFunc);
    add(comp: Component): void;
    remove(comp: Component): void;
    cancelInactive(flagToClear: number): void;
    invoke(): void;
}
interface ActivateTask {
    preload: UnsortedInvoker;
    onLoad: OneOffInvoker;
    onEnable: OneOffInvoker;
}
/**
 * @en The class used to perform activating and deactivating operations of node and component.
 * @zh 用于执行节点和组件的激活和停用操作的管理器。
 */
export default class NodeActivator {
    resetComp?: ((comp: Component, didResetToDefault: boolean) => void);
    protected _activatingStack: ActivateTask[];
    constructor();
    /**
     * @en Reset all activation or des-activation tasks
     * @zh 重置所有激活或非激活任务
     */
    reset(): void;
    /**
     * @en Activate or des-activate a node
     * @zh 激活或者停用某个节点
     * @param node Target node
     * @param active Which state to set the node to
     */
    activateNode(node: Node, active: boolean): void;
    /**
     * @en Activate or des-activate a component
     * @zh 激活或者停用某个组件
     * @param comp Target component
     * @param preloadInvoker The invoker for `_preload` method, normally from [[ComponentScheduler]]
     * @param onLoadInvoker The invoker for `onLoad` method, normally from [[ComponentScheduler]]
     * @param onEnableInvoker The invoker for `onEnable` method, normally from [[ComponentScheduler]]
     */
    activateComp(comp: Component, preloadInvoker?: UnsortedInvoker, onLoadInvoker?: OneOffInvoker, onEnableInvoker?: OneOffInvoker): void;
    /**
     * @en Destroy a component
     * @zh 销毁一个组件
     * @param comp Target component
     */
    destroyComp(comp: Component): void;
    protected _activateNodeRecursively(node: Node, preloadInvoker: UnsortedInvoker, onLoadInvoker: OneOffInvoker, onEnableInvoker: OneOffInvoker): void;
    protected _deactivateNodeRecursively(node: Node): void;
}
export {};
