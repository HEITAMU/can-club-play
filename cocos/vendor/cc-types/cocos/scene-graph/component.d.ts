/// <reference types="./@types/globals" />
import { CCObject } from '../core/data/object';
import { RenderScene } from '../render-scene/core/render-scene';
import { Rect } from '../core/math';
import { Node } from './node';
import { CompPrefabInfo } from './prefab/prefab-info';
import { EventHandler } from './component-event-handler';
/**
 * @en
 * Base class for everything attached to Node(Entity).<br/>
 * <br/>
 * NOTE: Not allowed to use construction parameters for Component's subclasses,
 *       because Component is created by the engine.
 * @zh
 * 所有附加到节点的基类。<br/>
 * <br/>
 * 注意：不允许使用组件的子类构造参数，因为组件是由引擎创建的。
 */
declare class Component extends CCObject {
    static EventHandler: typeof EventHandler;
    /**
     * @engineInternal
     */
    static _executionOrder: number;
    /**
     * @engineInternal
     */
    static _requireComponent: Constructor<Component> | null;
    constructor();
    get name(): string;
    set name(value: string);
    /**
     * @en The uuid for editor.
     * @zh 组件的 uuid，用于编辑器。
     * @readOnly
     * @example
     * ```ts
     * import { log } from 'cc';
     * log(comp.uuid);
     * ```
     */
    get uuid(): string;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    get __scriptAsset(): null;
    /**
     * @en Indicates whether this component is enabled or not.
     * @zh 表示该组件自身是否启用。
     * @default true
     * @example
     * ```ts
     * import { log } from 'cc';
     * comp.enabled = true;
     * log(comp.enabled);
     * ```
     */
    get enabled(): boolean;
    set enabled(value: boolean);
    /**
     * @en Indicates whether this component is enabled and its node is also active in the hierarchy.
     * @zh 表示该组件是否被启用并且所在的节点也处于激活状态。
     * @readOnly
     * @example
     * ```ts
     * import { log } from 'cc';
     * log(comp.enabledInHierarchy);
     * ```
     */
    get enabledInHierarchy(): boolean;
    /**
     * @en Returns a value which used to indicate the onLoad get called or not.
     * @zh 返回一个值用来判断 onLoad 是否被调用过，不等于 0 时调用过，等于 0 时未调用。
     * @readOnly
     * @example
     * ```ts
     * import { log } from 'cc';
     * log(this._isOnLoadCalled > 0);
     * ```
     *
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    get _isOnLoadCalled(): number;
    static system: null;
    /**
     * @en The node this component is attached to. A component is always attached to a node.
     * @zh 该组件被附加到的节点。组件总会附加到一个节点。
     * @example
     * ```ts
     * import { log } from 'cc';
     * log(comp.node);
     * ```
     */
    node: Node;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _enabled: boolean;
    /**
     * @internal
     */
    __prefab: CompPrefabInfo | null;
    /**
     * @internal
     */
    _sceneGetter: null | (() => RenderScene);
    /**
     * For internal usage.
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _id: string;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _getRenderScene(): RenderScene;
    /**
     * @en Adds a component class to the node. You can also add component to node by passing in the name of the script.
     * @zh 向节点添加一个指定类型的组件类，你还可以通过传入脚本的名称来添加组件。
     * @param classConstructor The class of component to be retrieved or to be created
     * @example
     * ```ts
     * import { Sprite } from 'cc';
     * const sprite = node.addComponent(Sprite);
     * ```
     */
    addComponent<T extends Component>(classConstructor: Constructor<T>): T | null;
    /**
     * @en Adds a component class to the node. You can also add component to node by passing in the name of the script.
     * @zh 向节点添加一个指定类型的组件类，你还可以通过传入脚本的名称来添加组件。
     * @param className A string for the class name of the component
     * @example
     * ```ts
     * const test = node.addComponent("Test");
     * ```
     */
    addComponent(className: string): Component | null;
    /**
     * @en
     * Returns the component of supplied type if the node has one attached, null if it doesn't.<br/>
     * You can also get component in the node by passing in the name of the script.
     * @zh
     * 获取节点上指定类型的组件，如果节点有附加指定类型的组件，则返回，如果没有则为空。<br/>
     * 传入参数也可以是脚本的名称。
     * @param classConstructor The class of component to be retrieved or to be created
     * @example
     * ```ts
     * import { Sprite } from 'cc';
     * // get sprite component.
     * var sprite = node.getComponent(Sprite);
     * ```
     */
    getComponent<T extends Component>(classConstructor: Constructor<T> | AbstractedConstructor<T>): T | null;
    /**
     * @en
     * Returns the component of supplied type if the node has one attached, null if it doesn't.<br/>
     * You can also get component in the node by passing in the name of the script.
     * @zh
     * 获取节点上指定类型的组件，如果节点有附加指定类型的组件，则返回，如果没有则为空。<br/>
     * 传入参数也可以是脚本的名称。
     * @param className A string for the class name of the component
     * @example
     * ```ts
     * // get custom test calss.
     * var test = node.getComponent("Test");
     * ```
     */
    getComponent(className: string): Component | null;
    /**
     * @en Returns all components of supplied type in the node.
     * @zh 返回节点上指定类型的所有组件。
     * @param classConstructor The class of components to be retrieved
     * @example
     * ```ts
     * import { Sprite } from 'cc';
     * const sprites = node.getComponents(Sprite);
     * ```
     */
    getComponents<T extends Component>(classConstructor: Constructor<T> | AbstractedConstructor<T>): T[];
    /**
     * @en Returns all components of supplied type in the node.
     * @zh 返回节点上指定类型的所有组件。
     * @param className A string for the class name of the components
     * @example
     * ```ts
     * const tests = node.getComponents("Test");
     * ```
     */
    getComponents(className: string): Component[];
    /**
     * @en Returns the component of supplied type in any of its children using depth first search.
     * @zh 递归查找所有子节点中第一个匹配指定类型的组件。
     * @param classConstructor The class of component to be retrieved
     * @example
     * ```ts
     * import { Sprite } from 'cc';
     * const sprite = node.getComponentInChildren(Sprite);
     * ```
     */
    getComponentInChildren<T extends Component>(classConstructor: Constructor<T> | AbstractedConstructor<T>): T | null;
    /**
     * @en Returns the component of supplied type in any of its children using depth first search.
     * @zh 递归查找所有子节点中第一个匹配指定类型的组件。
     * @param className A string for the class name of the component
     * @example
     * ```ts
     * var Test = node.getComponentInChildren("Test");
     * ```
     */
    getComponentInChildren(className: string): Component | null;
    /**
     * @en Returns all components of supplied type in self or any of its children.
     * @zh 递归查找自身或所有子节点中指定类型的组件。
     * @param classConstructor The class of components to be retrieved
     * @example
     * ```ts
     * import { Sprite } from 'cc';
     * const sprites = node.getComponentsInChildren(Sprite);
     * ```
     */
    getComponentsInChildren<T extends Component>(classConstructor: Constructor<T> | AbstractedConstructor<T>): T[];
    /**
     * @en Returns all components of supplied type in self or any of its children.
     * @zh 递归查找自身或所有子节点中指定类型的组件。
     * @param className A string for the class name of the components
     * @example
     * ```ts
     * const tests = node.getComponentsInChildren("Test");
     * ```
     */
    getComponentsInChildren(className: string): Component[];
    destroy(): boolean;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _onPreDestroy(): void;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _instantiate(cloned?: Component): Component | undefined;
    /**
     * @en
     * Use Scheduler system to schedule a custom task.<br/>
     * If the task is already scheduled, then the interval parameter will be updated without scheduling it again.
     * @zh
     * 使用定时器系统调度一个自定义的回调任务。<br/>
     * 如果回调任务已调度，那么将不会重复调度它，只会更新时间间隔参数。
     * @param callback  The callback function of the task
     * @param interval  The time interval between each invocation
     * @param repeat    The repeat count of this task, the task will be invoked (repeat + 1) times, use [[macro.REPEAT_FOREVER]] to repeat a task forever
     * @param delay     The delay time for the first invocation, Unit: s
     * @example
     * ```ts
     * import { log } from 'cc';
     * this.schedule((dt) => void log(`time: ${dt}`), 1);
     * ```
     */
    schedule(callback: any, interval?: number, repeat?: number, delay?: number): void;
    /**
     * @en Use Scheduler system to schedule a task that runs only once, with a delay of 0 or larger.
     * @zh 使用定时器系统调度一个只运行一次的回调任务，可以指定 0 让回调函数在下一帧立即执行或者在一定的延时之后执行。
     * @method scheduleOnce
     * @see [[schedule]]
     * @param callback  The callback function of the task
     * @param delay  The delay time for the first invocation, Unit: s
     * @example
     * ```ts
     * import { log } from 'cc';
     * this.scheduleOnce((dt) => void log(`time: ${dt}`), 2);
     * ```
     */
    scheduleOnce(callback: any, delay?: number): void;
    /**
     * @en Un-schedules a custom task.
     * @zh 取消调度一个自定义的回调任务。
     * @param callback_fn  The callback function of the task
     * @example
     * ```ts
     * this.unschedule(_callback);
     * ```
     */
    unschedule(callback_fn: any): void;
    /**
     * @en unschedule all scheduled tasks.
     * @zh 取消调度所有已调度的回调函数。
     * @example
     * ```ts
     * this.unscheduleAllCallbacks();
     * ```
     */
    unscheduleAllCallbacks(): void;
    /**
     * @en Update is called every frame, if the Component is enabled.<br/>
     * This is a lifecycle method. It may not be implemented in the super class.<br/>
     * You can only call its super class method inside it. It should not be called manually elsewhere.
     * @zh 如果该组件启用，则每帧调用 update。<br/>
     * 该方法为生命周期方法，父类未必会有实现。并且你只能在该方法内部调用父类的实现，不可在其它地方直接调用该方法。
     * @param dt - the delta time in seconds it took to complete the last frame
     */
    protected update?(dt: number): void;
    /**
     * @engineInternal `update` is a protected property, we provide this public property for engine internal usage.
     */
    get internalUpdate(): ((dt: number) => void) | undefined;
    /**
     * @en LateUpdate is called every frame, if the Component is enabled.<br/>
     * This is a lifecycle method. It may not be implemented in the super class.<br/>
     * You can only call its super class method inside it. It should not be called manually elsewhere.
     * @zh 如果该组件启用，则每帧调用 LateUpdate。<br/>
     * 该方法为生命周期方法，父类未必会有实现。并且你只能在该方法内部调用父类的实现，不可在其它地方直接调用该方法。
     * @param dt - the delta time in seconds it took to complete the last frame
     */
    protected lateUpdate?(dt: number): void;
    /**
     * @engineInternal `lateUpdate` is a protected property, we provide this public property for engine internal usage.
     */
    get internalLateUpdate(): ((dt: number) => void) | undefined;
    /**
     * @en `__preload` is called before every onLoad.<br/>
     * It is used to initialize the builtin components internally,<br/>
     * to avoid checking whether onLoad is called before every public method calls.<br/>
     * This method should be removed if script priority is supported.
     * @zh `__preload` 在每次onLoad之前调用。<br/>
     * 它用于在内部初始化内置组件，<br/>
     * 以避免在每次公有方法调用之前检查是否调用了onLoad。<br/>
     * 如果支持脚本优先级，则应删除此方法。
     * @private
     */
    protected __preload?(): void;
    /**
     * @engineInternal `__preload` is a protected property, we provide this public property for engine internal usage.
     */
    get internalPreload(): (() => void) | undefined;
    /**
     * @en
     * When attaching to an active node or its node first activated.<br/>
     * onLoad is always called before any start functions, this allows you to order initialization of scripts.<br/>
     * This is a lifecycle method. It may not be implemented in the super class.<br/>
     * You can only call its super class method inside it. It should not be called manually elsewhere.
     * @zh
     * 当附加到一个激活的节点上或者其节点第一次激活时候调用。onLoad 总是会在任何 start 方法调用前执行，这能用于安排脚本的初始化顺序。<br/>
     * 该方法为生命周期方法，父类未必会有实现。并且你只能在该方法内部调用父类的实现，不可在其它地方直接调用该方法。
     */
    protected onLoad?(): void;
    /**
     * @engineInternal `onLoad` is a protected property, we provide this public property for engine internal usage.
     */
    get internalOnLoad(): (() => void) | undefined;
    /**
     * @en
     * Called before all scripts' update if the Component is enabled the first time.<br/>
     * Usually used to initialize some logic which need to be called after all components' `onload` methods called.<br/>
     * This is a lifecycle method. It may not be implemented in the super class.<br/>
     * You can only call its super class method inside it. It should not be called manually elsewhere.
     * @zh
     * 如果该组件第一次启用，则在所有组件的 update 之前调用。通常用于需要在所有组件的 onLoad 初始化完毕后执行的逻辑。<br/>
     * 该方法为生命周期方法，父类未必会有实现。并且你只能在该方法内部调用父类的实现，不可在其它地方直接调用该方法。
     */
    protected start?(): void;
    /**
     * @engineInternal `start` is a protected property, we provide this public property for engine internal usage.
     */
    get internalStart(): (() => void) | undefined;
    /**
     * @en Called when this component becomes enabled and its node is active.<br/>
     * This is a lifecycle method. It may not be implemented in the super class.
     * You can only call its super class method inside it. It should not be called manually elsewhere.
     * @zh 当该组件被启用，并且它的节点也激活时。<br/>
     * 该方法为生命周期方法，父类未必会有实现。并且你只能在该方法内部调用父类的实现，不可在其它地方直接调用该方法。
     */
    protected onEnable?(): void;
    /**
     * @engineInternal `onEnable` is a protected property, we provide this public property for engine internal usage.
     */
    get internalOnEnable(): (() => void) | undefined;
    /**
     * @en Called when this component becomes disabled or its node becomes inactive.<br/>
     * This is a lifecycle method. It may not be implemented in the super class.
     * You can only call its super class method inside it. It should not be called manually elsewhere.
     * @zh 当该组件被禁用或节点变为无效时调用。<br/>
     * 该方法为生命周期方法，父类未必会有实现。并且你只能在该方法内部调用父类的实现，不可在其它地方直接调用该方法。
     */
    protected onDisable?(): void;
    /**
     * @engineInternal `onDisable` is a protected property, we provide this public property for engine internal usage.
     */
    get internalOnDisable(): (() => void) | undefined;
    /**
     * @en Called when this component will be destroyed.<br/>
     * This is a lifecycle method. It may not be implemented in the super class.<br/>
     * You can only call its super class method inside it. It should not be called manually elsewhere.
     * @zh 当该组件被销毁时调用<br/>
     * 该方法为生命周期方法，父类未必会有实现。并且你只能在该方法内部调用父类的实现，不可在其它地方直接调用该方法。
     */
    protected onDestroy?(): void;
    /**
     * @engineInternal `onDestroy` is a protected property, we provide this public property for engine internal usage.
     */
    get internalOnDestroy(): (() => void) | undefined;
    onFocusInEditor?(): void;
    onLostFocusInEditor?(): void;
    /**
     * @en Called to initialize the component or node’s properties when adding the component the first time or when the Reset command is used.
     * This function is only called in editor.<br/>
     * @zh 用来初始化组件或节点的一些属性，当该组件被第一次添加到节点上或用户点击了它的 Reset 菜单时调用。这个回调只会在编辑器下调用。
     */
    resetInEditor?(didResetToDefault?: boolean): void;
    /**
     * @en
     * If the component's bounding box is different from the node's, you can implement this method to supply
     * a custom axis aligned bounding box (AABB), so the editor's scene view can perform hit test properly.
     * @zh
     * 如果组件的包围盒与节点不同，您可以实现该方法以提供自定义的轴向对齐的包围盒（AABB），
     * 以便编辑器的场景视图可以正确地执行点选测试。
     * @param out_rect - The rect to store the result bounding rect
     * @private
     */
    protected _getLocalBounds?(out_rect: Rect): void;
    /**
     * @en
     * onRestore is called after the user clicks the Reset item in the Inspector's context menu or performs
     * an undo operation on this component.<br/>
     * <br/>
     * If the component contains the "internal state", short for "temporary member variables which not included<br/>
     * in its CCClass properties", then you may need to implement this function.<br/>
     * <br/>
     * The editor will call the getset accessors of your component to record/restore the component's state<br/>
     * for undo/redo operation. However, in extreme cases, it may not works well. Then you should implement<br/>
     * this function to manually synchronize your component's "internal states" with its public properties.<br/>
     * Once you implement this function, all the getset accessors of your component will not be called when<br/>
     * the user performs an undo/redo operation. Which means that only the properties with default value<br/>
     * will be recorded or restored by editor.<br/>
     * <br/>
     * Similarly, the editor may failed to reset your component correctly in extreme cases. Then if you need<br/>
     * to support the reset menu, you should manually synchronize your component's "internal states" with its<br/>
     * properties in this function. Once you implement this function, all the getset accessors of your component<br/>
     * will not be called during reset operation. Which means that only the properties with default value<br/>
     * will be reset by editor.
     *
     * This function is only called in editor mode.
     * @zh
     * onRestore 是用户在检查器菜单点击 Reset 时，对此组件执行撤消操作后调用的。<br/>
     * <br/>
     * 如果组件包含了“内部状态”（不在 CCClass 属性中定义的临时成员变量），那么你可能需要实现该方法。<br/>
     * <br/>
     * 编辑器执行撤销/重做操作时，将调用组件的 get set 来录制和还原组件的状态。
     * 然而，在极端的情况下，它可能无法良好运作。<br/>
     * 那么你就应该实现这个方法，手动根据组件的属性同步“内部状态”。
     * 一旦你实现这个方法，当用户撤销或重做时，组件的所有 get set 都不会再被调用。
     * 这意味着仅仅指定了默认值的属性将被编辑器记录和还原。<br/>
     * <br/>
     * 同样的，编辑可能无法在极端情况下正确地重置您的组件。<br/>
     * 于是如果你需要支持组件重置菜单，你需要在该方法中手工同步组件属性到“内部状态”。<br/>
     * 一旦你实现这个方法，组件的所有 get set 都不会在重置操作时被调用。
     * 这意味着仅仅指定了默认值的属性将被编辑器重置。
     * <br/>
     * 此方法仅在编辑器下会被调用。
     */
    protected onRestore?(): void;
}
export { Component };
