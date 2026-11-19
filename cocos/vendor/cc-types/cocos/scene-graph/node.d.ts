/// <reference types="./@types/globals" />
import { NodeUIProperties } from './node-ui-properties';
import { ISchedulable } from '../core/scheduler';
import { Mat4, Quat, Vec3 } from '../core/math';
import { NodeSpace, TransformBit } from './node-enum';
import { CustomSerializable, SerializationContext, SerializationOutput, serializeTag } from '../core/data';
import { Component } from './component';
import { CCObject, js } from '../core';
import { PrefabInfo } from './prefab/prefab-info';
import { NodeEventType } from './node-event';
import { Event } from '../input/types';
import { NodeEventProcessor } from './node-event-processor';
import type { Scene } from './scene';
import type { UITransform } from '../2d/framework';
export declare const TRANSFORM_ON: number;
/**
 * @zh
 * 场景树中的基本节点，基本特性有：
 * * 具有层级关系
 * * 持有各类组件
 * * 维护空间变换（坐标、旋转、缩放）信息
 */
/**
 * @en
 * Class of all entities in Cocos Creator scenes.
 * Basic functionalities include:
 * * Hierarchy management with parent and children
 * * Components management
 * * Coordinate system with position, scale, rotation in 3d space
 * @zh
 * Cocos Creator 场景中的所有节点类。
 * 基本特性有：
 * * 具有层级关系
 * * 持有各类组件
 * * 维护 3D 空间左边变换（坐标、旋转、缩放）信息
 */
export declare class Node extends CCObject implements ISchedulable, CustomSerializable {
    /**
     * @en Gets all components attached to this node.
     * @zh 获取附加到此节点的所有组件。
     */
    get components(): ReadonlyArray<Component>;
    /**
     * @en If true, the node is an persist node which won't be destroyed during scene transition.
     * If false, the node will be destroyed automatically when loading a new scene. Default is false.
     * @zh 如果为true，则该节点是一个常驻节点，不会在场景转换期间被销毁。
     * 如果为false，节点将在加载新场景时自动销毁。默认为 false。
     * @default false
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    get _persistNode(): boolean;
    set _persistNode(value: boolean);
    /**
     * @en Name of node.
     * @zh 该节点名称。
     */
    get name(): string;
    set name(value: string);
    /**
     * @en The uuid for editor, will be stripped after building project.
     * @zh 主要用于编辑器的 uuid，在编辑器下可用于持久化存储，在项目构建之后将变成自增的 id。
     * @readOnly
     */
    get uuid(): string;
    /**
     * @en All children nodes.
     * @zh 节点的所有子节点。
     * @readOnly
     */
    get children(): Node[];
    /**
     * @en
     * The local active state of this node.
     * Note that a Node may be inactive because a parent is not active, even if this returns true.
     * Use [[activeInHierarchy]]
     * if you want to check if the Node is actually treated as active in the scene.
     * @zh
     * 当前节点的自身激活状态。
     * 值得注意的是，一个节点的父节点如果不被激活，那么即使它自身设为激活，它仍然无法激活。
     * 如果你想检查节点在场景中实际的激活状态可以使用 [[activeInHierarchy]]
     * @default true
     */
    get active(): boolean;
    set active(isActive: boolean);
    /**
     * @engineInternal please don't use this method.
     * @mangle
     */
    _setActiveInHierarchy(v: boolean): void;
    /**
     * @en Indicates whether this node is active in the scene.
     * @zh 表示此节点是否在场景中激活。
     */
    get activeInHierarchy(): boolean;
    /**
      * @en The parent node
      * @zh 父节点
      */
    get parent(): Node | null;
    set parent(value: Node | null);
    /**
     * @en Which scene this node belongs to.
     * @zh 此节点属于哪个场景。
     * @readonly
     */
    get scene(): Scene;
    /**
     * @en The event processor of the current node, it provides EventTarget ability.
     * @zh 当前节点的事件处理器，提供 EventTarget 能力。
     * @readonly
     *
     * @deprecated since v3.4.0
     */
    get eventProcessor(): NodeEventProcessor;
    /**
     * @internal
     */
    protected static idGenerator: js.IDGenerator;
    /**
     * for walk
     * @internal
     */
    protected static _stacks: Array<Array<(Node | null)>>;
    /**
     * @internal
     */
    protected static _stackId: number;
    /**
     * Call `_updateScene` of specified node.
     * @internal
     * @param node The node.
     */
    protected static _setScene(node: Node): void;
    /**
     * @engineInternal
     */
    static _incSkewCompCount(): void;
    /**
     * @engineInternal
     */
    static _decSkewCompCount(): void;
    protected static _findComponent<T extends Component>(node: Node, constructor: Constructor<T> | AbstractedConstructor<T>): T | null;
    protected static _findComponents<T extends Component>(node: Node, constructor: Constructor<T> | AbstractedConstructor<T>, components: Component[]): void;
    protected static _findChildComponent<T extends Component>(children: Node[], constructor: Constructor<T> | AbstractedConstructor<T>): T | null;
    protected static _findChildComponents<T extends Component>(children: Node[], constructor: Constructor<T> | AbstractedConstructor<T>, components: Component[]): void;
    protected _parent: this | null;
    protected _children: this[];
    protected _active: boolean;
    /**
     * NOTE: components getter is typeof ReadonlyArray
     * @engineInternal
     * @mangle
     */
    getWritableComponents(): Component[];
    protected _components: Component[];
    /**
     * TODO(PP_Pro): this property should be exported to editor only, we should support editorOnly tag.
     * Tracking issue: https://github.com/cocos/cocos-engine/issues/14613
     */
    protected _prefab: PrefabInfo | null;
    /**
     * @engineInternal
     */
    get prefab(): PrefabInfo | null;
    protected _scene: Scene;
    protected _activeInHierarchy: boolean;
    /**
     * @engineInternal
     */
    set id(v: string);
    protected _id: string;
    protected _eventProcessor: NodeEventProcessor;
    /**
     * @dontmangle Ensure _eventMask not to be mangled since it is visited by UISkew._updateNodeTransformFlags with 'any' conversion.
     */
    protected _eventMask: number;
    protected _siblingIndex: number;
    /**
     * @engineInternal
     */
    get siblingIndex(): number;
    /**
     * @engineInternal
     */
    set siblingIndex(val: number);
    /**
     * @en
     * record scene's id when set this node as persist node
     * @zh
     * 当设置节点为常驻节点时记录场景的 id
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _originalSceneId: string;
    /**
     * Set `_scene` field of this node.
     * The derived `Scene` overrides this method to behavior differently.
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    protected _updateScene(): void;
    /**
     * @en
     * Properties configuration function.
     * All properties in attrs will be set to the node,
     * when the setter of the node is available,
     * the property will be set via setter function.
     * @zh 属性配置函数。在 attrs 的所有属性将被设置为节点属性。
     * @param attrs - Properties to be set to node
     * @example
     * ```
     * var attrs = { name: 'New Name', active: false };
     * node.attr(attrs);
     * ```
     */
    attr(attrs: unknown): void;
    /**
     * @en Get parent of the node.
     * @zh 获取该节点的父节点。
     */
    getParent(): Node | null;
    /**
     * As there are setter and setParent(), and both of them not just modify _parent, but have
     * other logic. So add a new function that only modify _parent value.
     * @engineInternal
     * @mangle
     */
    modifyParent(parent: this | null): void;
    /**
     * @en Set parent of the node.
     * @zh 设置该节点的父节点。
     * @param value Parent node
     * @param keepWorldTransform Whether keep node's current world transform unchanged after this operation
     */
    setParent(value: Node | null, keepWorldTransform?: boolean): void;
    /**
     * @en Returns a child with the same uuid.
     * @zh 通过 uuid 获取节点的子节点。
     * @param uuid - The uuid to find the child node.
     * @return a Node whose uuid equals to the input parameter
     */
    getChildByUuid(uuid: string): Node | null;
    /**
     * @en Returns a child with the same name.
     * @zh 通过名称获取节点的子节点。
     * @param name - A name to find the child node.
     * @return a CCNode object whose name equals to the input parameter
     * @example
     * ```
     * var child = node.getChildByName("Test Node");
     * ```
     */
    getChildByName(name: string): Node | null;
    /**
     * @en Returns a child with the given path.
     * @zh 通过路径获取节点的子节点。
     * @param path - A path to find the child node.
     * @return a Node object whose path equals to the input parameter
     * @example
     * ```
     * var child = node.getChildByPath("subNode/Test Node");
     * ```
     */
    getChildByPath(path: string): Node | null;
    /**
     * @en Add a child to the current node.
     * @zh 添加一个子节点。
     * @param child - the child node to be added
     */
    addChild(child: Node): void;
    /**
     * @en Inserts a child to the node at a specified index.
     * @zh 插入子节点到指定位置
     * @param child - the child node to be inserted
     * @param siblingIndex - the sibling index to place the child in
     * @example
     * ```
     * node.insertChild(child, 2);
     * ```
     */
    insertChild(child: Node, siblingIndex: number): void;
    /**
     * @en Get the sibling index of the current node in its parent's children array.
     * @zh 获取当前节点在父节点的 children 数组中的位置。
     */
    getSiblingIndex(): number;
    /**
     * @en Set the sibling index of the current node in its parent's children array.
     * @zh 设置当前节点在父节点的 children 数组中的位置。
     */
    setSiblingIndex(index: number): void;
    /**
     * @en Walk though the sub children tree of the current node.
     * Each node, including the current node, in the sub tree will be visited two times,
     * before all children and after all children.
     * This function call is not recursive, it's based on stack.
     * Please don't walk any other node inside the walk process.
     * @zh 遍历该节点的子树里的所有节点并按规则执行回调函数。
     * 对子树中的所有节点，包含当前节点，会执行两次回调，preFunc 会在访问它的子节点之前调用，postFunc 会在访问所有子节点之后调用。
     * 这个函数的实现不是基于递归的，而是基于栈展开递归的方式。
     * 请不要在 walk 过程中对任何其他的节点嵌套执行 walk。
     * @param preFunc The callback to process node when reach the node for the first time
     * @param postFunc The callback to process node when re-visit the node after walked all children in its sub tree
     * @example
     * ```
     * node.walk(function (target) {
     *     console.log('Walked through node ' + target.name + ' for the first time');
     * }, function (target) {
     *     console.log('Walked through node ' + target.name + ' after walked all children in its sub tree');
     * });
     * ```
     */
    walk(preFunc: (target: this) => void, postFunc?: (target: this) => void): void;
    /**
     * @en
     * Remove itself from its parent node.
     * If the node have no parent, then nothing happens.
     * @zh
     * 从父节点中删除该节点。
     * 如果这个节点是一个孤立节点，那么什么都不会发生。
     */
    removeFromParent(): void;
    /**
     * @en Removes a child from the container.
     * @zh 移除节点中指定的子节点。
     * @param child - The child node which will be removed.
     */
    removeChild(child: this | Node): void;
    /**
     * @en Removes all children from the container.
     * @zh 移除节点所有的子节点。
     */
    removeAllChildren(): void;
    /**
     * @en Is this node a child of the given node?
     * @zh 是否是指定节点的子节点？
     * @return True if this node is a child, deep child or identical to the given node.
     */
    isChildOf(parent: this | Scene | null): boolean;
    /**
     * @en
     * Returns the component of supplied type if the node has one attached, null if it doesn't.
     * You can also get component in the node by passing in the name of the script.
     * @zh
     * 获取节点上指定类型的组件，如果节点有附加指定类型的组件，则返回，如果没有则为空。
     * 传入参数也可以是脚本的名称。
     * @param classConstructor The class of the target component
     * @example
     * ```
     * // get sprite component.
     * var sprite = node.getComponent(Sprite);
     * ```
     */
    getComponent<T extends Component>(classConstructor: Constructor<T> | AbstractedConstructor<T>): T | null;
    /**
     * @en
     * Returns the component of supplied type if the node has one attached, null if it doesn't.
     * You can also get component in the node by passing in the name of the script.
     * @zh
     * 获取节点上指定类型的组件，如果节点有附加指定类型的组件，则返回，如果没有则为空。
     * 传入参数也可以是脚本的名称。
     * @param className The class name of the target component
     * @example
     * ```
     * // get custom test class.
     * var test = node.getComponent("Test") as Test | null;
     * ```
     */
    getComponent(className: string): Component | null;
    /**
     * @en
     * Returns the component of supplied type if the node has one attached, null if it doesn't.
     * You can also get component in the node by passing in the name of the script.
     * @zh
     * 获取节点上指定类型的组件，如果节点有附加指定类型的组件，则返回，如果没有则为空。
     * 传入参数也可以是脚本的名称。
     * @param className The class name of the target component
     * @example
     * ```
     * // get custom test class.
     * var test = node.getComponent<Test>("Test");
     * ```
     */
    getComponent<T extends Component>(className: string): T | null;
    /**
     * @en Returns all components of given type in the node.
     * @zh 返回节点上指定类型的所有组件。
     * @param classConstructor The class of the target component
     */
    getComponents<T extends Component>(classConstructor: Constructor<T> | AbstractedConstructor<T>): T[];
    /**
     * @en Returns all components of given type in the node.
     * @zh 返回节点上指定类型的所有组件。
     * @param className The class name of the target component
     * @example
     * ```
     * var test = node.getComponents('Test') as Test[];
     * ```
     */
    getComponents(className: string): Component[];
    /**
     * @en Returns all components of given type in the node.
     * @zh 返回节点上指定类型的所有组件。
     * @param className The class name of the target component
     * @example
     * ```
     * var test = node.getComponents<Test>('Test');
     * ```
     */
    getComponents<T extends Component>(className: string): T[];
    /**
     * @en Returns the component of given type in any of its children using depth first search.
     * @zh 递归查找所有子节点中第一个匹配指定类型的组件。
     * @param classConstructor The class of the target component
     * @example
     * ```
     * var sprite = node.getComponentInChildren(Sprite);
     * ```
     */
    getComponentInChildren<T extends Component>(classConstructor: Constructor<T> | AbstractedConstructor<T>): T | null;
    /**
     * @en Returns the component of given type in any of its children using depth first search.
     * @zh 递归查找所有子节点中第一个匹配指定类型的组件。
     * @param className The class name of the target component
     * @example
     * ```
     * var test = node.getComponentInChildren("Test") as Test | null;
     * ```
     */
    getComponentInChildren(className: string): Component | null;
    /**
     * @en Returns the component of given type in any of its children using depth first search.
     * @zh 递归查找所有子节点中第一个匹配指定类型的组件。
     * @param className The class name of the target component
     * @example
     * ```
     * var test = node.getComponentInChildren<Test>("Test");
     * ```
     */
    getComponentInChildren<T extends Component>(className: string): T | null;
    /**
     * @en Returns all components of given type in self or any of its children.
     * @zh 递归查找自身或所有子节点中指定类型的组件
     * @param classConstructor The class of the target component
     * @example
     * ```
     * var sprites = node.getComponentsInChildren(Sprite);
     * ```
     */
    getComponentsInChildren<T extends Component>(classConstructor: Constructor<T> | AbstractedConstructor<T>): T[];
    /**
     * @en Returns all components of given type in self or any of its children.
     * @zh 递归查找自身或所有子节点中指定类型的组件
     * @param className The class name of the target component
     * @example
     * ```
     * var tests = node.getComponentsInChildren("Test") as Test[];
     * ```
     */
    getComponentsInChildren(className: string): Component[];
    /**
     * @en Returns all components of given type in self or any of its children.
     * @zh 递归查找自身或所有子节点中指定类型的组件
     * @param className The class name of the target component
     * @example
     * ```
     * var tests = node.getComponentsInChildren<Test>("Test");
     * ```
     */
    getComponentsInChildren<T extends Component>(className: string): T[];
    /**
     * @en Adds a component class to the node. You can also add component to node by passing in the name of the script.
     * @zh 向节点添加一个指定类型的组件类，你还可以通过传入脚本的名称来添加组件。
     * @param classConstructor The class of the component to add
     * @throws `TypeError` if the `classConstructor` does not specify a cc-class constructor extending the `Component`.
     * @example
     * ```
     * var sprite = node.addComponent(Sprite);
     * ```
     */
    addComponent<T extends Component>(classConstructor: Constructor<T>): T;
    /**
     * @en Adds a component class to the node. You can also add component to node by passing in the name of the script.
     * @zh 向节点添加一个指定类型的组件类，你还可以通过传入脚本的名称来添加组件。
     * @param className The class name of the component to add
     * @throws `TypeError` if the `className` does not specify a cc-class constructor extending the `Component`.
     * @example
     * ```
     * var test = node.addComponent("Test") as Test;
     * ```
     */
    addComponent(className: string): Component;
    /**
     * @en Adds a component class to the node. You can also add component to node by passing in the name of the script.
     * @zh 向节点添加一个指定类型的组件类，你还可以通过传入脚本的名称来添加组件。
     * @param className The class name of the component to add
     * @throws `TypeError` if the `className` does not specify a cc-class constructor extending the `Component`.
     * @example
     * ```
     * var test = node.addComponent<Test>("Test");
     * ```
     */
    addComponent<T extends Component>(className: string): T;
    /**
     * @en
     * Removes a component identified by the given name or removes the component object given.
     * You can also use component.destroy() if you already have the reference.
     * @zh
     * 删除节点上的指定组件，传入参数可以是一个组件构造函数或组件名，也可以是已经获得的组件引用。
     * 如果你已经获得组件引用，你也可以直接调用 component.destroy()
     * @param classConstructor The class of the component to remove
     * @deprecated please destroy the component to remove it.
     * @example
     * ```
     * node.removeComponent(Sprite);
     * ```
     */
    removeComponent<T extends Component>(classConstructor: Constructor<T> | AbstractedConstructor<T>): void;
    /**
     * @en
     * Removes a component identified by the given name or removes the component object given.
     * You can also use component.destroy() if you already have the reference.
     * @zh
     * 删除节点上的指定组件，传入参数可以是一个组件构造函数或组件名，也可以是已经获得的组件引用。
     * 如果你已经获得组件引用，你也可以直接调用 component.destroy()
     * @param classNameOrInstance The class name of the component to remove or the component instance to be removed
     * @deprecated please destroy the component to remove it.
     * @example
     * ```
     * import { Sprite } from 'cc';
     * const sprite = node.getComponent(Sprite);
     * if (sprite) {
     *     node.removeComponent(sprite);
     * }
     * node.removeComponent('Sprite');
     * ```
     */
    removeComponent(classNameOrInstance: string | Component): void;
    /**
     * @en
     * Register a callback of a specific event type on Node.
     * Use this method to register touch or mouse event permit propagation based on scene graph,
     * These kinds of event are triggered with dispatchEvent, the dispatch process has three steps:
     * 1. Capturing phase: dispatch in capture targets, e.g. parents in node tree, from root to the real target
     * 2. At target phase: dispatch to the listeners of the real target
     * 3. Bubbling phase: dispatch in bubble targets, e.g. parents in node tree, from the real target to root
     * In any moment of the dispatching process, it can be stopped via `event.stopPropagation()` or `event.stopPropagationImmediate()`.
     * You can also register custom event and use `emit` to trigger custom event on Node.
     * For such events, there won't be capturing and bubbling phase,
     * your event will be dispatched directly to its listeners registered on the same node.
     * You can also pass event callback parameters with `emit` by passing parameters after `type`.
     * @zh
     * 在节点上注册指定类型的回调函数，也可以设置 target 用于绑定响应函数的 this 对象。
     * 鼠标或触摸事件会被系统调用 dispatchEvent 方法触发，触发的过程包含三个阶段：
     * 1. 捕获阶段：派发事件给捕获目标，比如，节点树中注册了捕获阶段的父节点，从根节点开始派发直到目标节点。
     * 2. 目标阶段：派发给目标节点的监听器。
     * 3. 冒泡阶段：派发事件给冒泡目标，比如，节点树中注册了冒泡阶段的父节点，从目标节点开始派发直到根节点。
     * 同时您可以将事件派发到父节点或者通过调用 stopPropagation 拦截它。
     * 你也可以注册自定义事件到节点上，并通过 emit 方法触发此类事件，对于这类事件，不会发生捕获冒泡阶段，只会直接派发给注册在该节点上的监听器
     * 你可以通过在 emit 方法调用时在 type 之后传递额外的参数作为事件回调的参数列表
     * @param type - A string representing the event type to listen for.<br>See [[Node.EventType.POSITION_CHANGED]] for all builtin events.
     * @param callback - The callback that will be invoked when the event is dispatched.
     * The callback is ignored if it is a duplicate (the callbacks are unique).
     * @param target - The target (this object) to invoke the callback, can be null
     * @param useCapture - When set to true, the listener will be triggered at capturing phase which is ahead of the final target emit,
     * otherwise it will be triggered during bubbling phase.
     * @return - Just returns the incoming callback so you can save the anonymous function easier.
     * @example
     * ```ts
     * this.node.on(NodeEventType.TOUCH_START, this.memberFunction, this);  // if "this" is component and the "memberFunction" declared in CCClass.
     * node.on(NodeEventType.TOUCH_START, callback, this);
     * node.on(NodeEventType.TOUCH_MOVE, callback, this);
     * node.on(NodeEventType.TOUCH_END, callback, this);
     * ```
     */
    on(type: string | NodeEventType, callback: AnyFunction, target?: unknown, useCapture?: boolean): void;
    /**
     * @en
     * Removes the callback previously registered with the same type, callback, target and or useCapture.
     * This method is merely an alias to removeEventListener.
     * @zh 删除之前与同类型，回调，目标或 useCapture 注册的回调。
     * @param type - A string representing the event type being removed.
     * @param callback - The callback to remove.
     * @param target - The target (this object) to invoke the callback, if it's not given, only callback without target will be removed
     * @param useCapture - When set to true, the listener will be triggered at capturing phase
     * which is ahead of the final target emit, otherwise it will be triggered during bubbling phase.
     * @example
     * ```ts
     * this.node.off(NodeEventType.TOUCH_START, this.memberFunction, this);
     * node.off(NodeEventType.TOUCH_START, callback, this.node);
     * ```
     */
    off(type: string, callback?: AnyFunction, target?: unknown, useCapture?: boolean): void;
    /**
     * @en
     * Register an callback of a specific event type on the Node,
     * the callback will remove itself after the first time it is triggered.
     * @zh
     * 注册节点的特定事件类型回调，回调会在第一时间被触发后删除自身。
     *
     * @param type - A string representing the event type to listen for.
     * @param callback - The callback that will be invoked when the event is dispatched.
     *                              The callback is ignored if it is a duplicate (the callbacks are unique).
     * @param target - The target (this object) to invoke the callback, can be null
     */
    once(type: string, callback: AnyFunction, target?: unknown, useCapture?: boolean): void;
    /**
     * @en
     * Trigger an event directly with the event name and necessary arguments.
     * @zh
     * 通过事件名发送自定义事件
     * @param type - event type
     * @param arg1 - First argument in callback
     * @param arg2 - Second argument in callback
     * @param arg3 - Third argument in callback
     * @param arg4 - Fourth argument in callback
     * @param arg5 - Fifth argument in callback
     * @example
     * ```ts
     * eventTarget.emit('fire', event);
     * eventTarget.emit('fire', message, emitter);
     * ```
     */
    emit(type: string, arg0?: any, arg1?: any, arg2?: any, arg3?: any, arg4?: any): void;
    /**
     * @en
     * Dispatches an event into the event flow.
     * The event target is the EventTarget object upon which the dispatchEvent() method is called.
     * @zh 分发事件到事件流中。
     * @param event - The Event object that is dispatched into the event flow
     */
    dispatchEvent(event: Event): void;
    /**
     * @en Checks whether the EventTarget object has any callback registered for a specific type of event.
     * @zh 检查事件目标对象是否有为特定类型的事件注册的回调。
     * @param type - The type of event.
     * @param callback - The callback function of the event listener, if absent all event listeners for the given type will be removed
     * @param target - The callback callee of the event listener
     * @return True if a callback of the specified type is registered; false otherwise.
     */
    hasEventListener(type: string, callback?: AnyFunction, target?: unknown): any;
    /**
     * @en Removes all callbacks previously registered with the same target.
     * @zh 移除目标上的所有注册事件。
     * @param target - The target to be searched for all related callbacks
     */
    targetOff(target: unknown): void;
    destroy(): boolean;
    /**
     * @en
     * Destroy all children from the node, and release all their own references to other objects.
     * Actual destruct operation will delayed until before rendering.
     * @zh
     * 销毁所有子节点，并释放所有它们对其它对象的引用。
     * 实际销毁操作会延迟到当前帧渲染前执行。
     */
    destroyAllChildren(): void;
    /**
     * Do remove component, only used internally.
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _removeComponent(component: Component): void;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _updateSiblingIndex(): void;
    /**
     * @dontmangle
     * NOTE: the protected method `_instantiate` is invoked by dynamically without type information.
     * See `instantiate` in cocos/serialization/instantiate.ts.
     * ```ts
     * clone = original._instantiate(null, true); // original is any, so _instantiate should not be mangled.
     * ```
     */
    protected _instantiate(cloned?: Node | null, isSyncedNode?: boolean): Node;
    protected _onHierarchyChangedBase(oldParent: this | null): void;
    protected _onPreDestroyBase(): boolean;
    protected _onSiblingIndexChanged?(siblingIndex: number): void;
    /**
     * @en
     * Ensures that this node has already had the specified component(s). If not, this method throws.
     * @zh
     * 检查节点已经包含对应的组件，如果没有，则抛出异常
     * @param constructor Constructor of the component.
     * @throws If one or more component of same type have been existed in this node.
     */
    protected _checkMultipleComp?<T extends Component>(constructor: Constructor<T>): void;
    /**
     * @en Event types emitted by Node
     * @zh 节点可能发出的事件类型
     */
    static EventType: typeof NodeEventType;
    /**
     * @en Coordinates space
     * @zh 空间变换操作的坐标系
     */
    static NodeSpace: typeof NodeSpace;
    /**
     * @en Bit masks for Node transformation parts
     * @zh 节点变换更新的具体部分
     * @deprecated please use [[Node.TransformBit]]
     */
    static TransformDirtyBit: typeof TransformBit;
    /**
     * @en Bit masks for Node transformation parts, can be used to determine which part changed in [[NodeEventType.TRANSFORM_CHANGED]] event
     * @zh 节点变换更新的具体部分，可用于判断 [[NodeEventType.TRANSFORM_CHANGED]] 事件的具体类型
     */
    static TransformBit: typeof TransformBit;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    static reserveContentsForAllSyncablePrefabTag: symbol;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _uiProps: NodeUIProperties;
    /**
     * @en Counter to clear node array
     * @zh 清除节点数组计时器
     */
    private static ClearFrame;
    private static ClearRound;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _static: boolean;
    /**
     * @engineInternal NOTE: this is engineInternal interface that doesn't have a side effect of updating the transforms
     */
    _pos: Vec3;
    /**
     * @engineInternal NOTE: this is engineInternal interface that doesn't have a side effect of updating the transforms
     */
    _rot: Quat;
    /**
     * @engineInternal NOTE: this is engineInternal interface that doesn't have a side effect of updating the transforms
     */
    _scale: Vec3;
    /**
     * @engineInternal NOTE: this is engineInternal interface that doesn't have a side effect of updating the transforms
     */
    _mat: Mat4;
    protected _lpos: Vec3;
    protected _lrot: Quat;
    protected _lscale: Vec3;
    protected _mobility: number;
    protected _layer: number;
    protected _euler: Vec3;
    protected _transformFlags: number;
    protected _eulerDirty: boolean;
    protected _flagChangeVersion: number;
    protected _hasChangedFlags: number;
    constructor(name?: string);
    /**
     * @en Determine whether the given object is a normal Node. Will return false if [[Scene]] given.
     * @zh 指定对象是否是普通的节点？如果传入 [[Scene]] 会返回 false。
     */
    static isNode(obj: unknown): obj is Node;
    protected _onPreDestroy(): boolean;
    /**
     * @en Position in local coordinate system
     * @zh 本地坐标系下的坐标
     */
    get position(): Readonly<Vec3>;
    set position(val: Readonly<Vec3>);
    /**
     * @en Get x axis value in local coordinate system
     * @zh 获取本地 x 轴坐标分量
     */
    get x(): number;
    /**
     * @en Set x axis value in local coordinate system
     * @zh 设置本地 x 轴坐标分量
     */
    set x(val: number);
    /**
     * @en Get y axis value in local coordinate system
     * @zh 获取本地 y 轴坐标分量
     */
    get y(): number;
    /**
     * @en Set y axis value in local coordinate system
     * @zh 设置本地 y 轴坐标分量
     */
    set y(val: number);
    /**
     * @en Get z axis value in local coordinate system
     * @zh 获取本地 z 轴坐标分量
     */
    get z(): number;
    /**
     * @en Set z axis value in local coordinate system
     * @zh 设置本地 z 轴坐标分量
     */
    set z(val: number);
    /**
     * @en Position in world coordinate system
     * @zh 世界坐标系下的坐标
     */
    get worldPosition(): Readonly<Vec3>;
    set worldPosition(val: Readonly<Vec3>);
    /**
     * @en Get x axis value in world coordinate system
     * @zh 获取世界坐标 x 轴分量
     */
    get worldPositionX(): number;
    /**
     * @en Set x axis value in world coordinate system
     * @zh 设置世界坐标 x 轴分量
     */
    set worldPositionX(val: number);
    /**
     * @en Get y axis value in world coordinate system
     * @zh 获取世界坐标 y 轴分量
     */
    get worldPositionY(): number;
    /**
     * @en Set y axis value in world coordinate system
     * @zh 设置世界坐标 y 轴分量
     */
    set worldPositionY(val: number);
    /**
     * @en Get z axis value in world coordinate system
     * @zh 获取世界坐标 z 轴分量
     */
    get worldPositionZ(): number;
    /**
     * @en Set z axis value in world coordinate system
     * @zh 设置世界坐标 z 轴分量
     */
    set worldPositionZ(val: number);
    /**
     * @en Rotation in local coordinate system, represented by a quaternion
     * @zh 本地坐标系下的旋转，用四元数表示
     */
    get rotation(): Readonly<Quat>;
    set rotation(val: Readonly<Quat>);
    /**
     * @en Rotation in local coordinate system, represented by euler angles
     * @zh 本地坐标系下的旋转，用欧拉角表示
     */
    set eulerAngles(val: Readonly<Vec3>);
    get eulerAngles(): Readonly<Vec3>;
    /**
     * @en Rotation in local coordinate system, represented by euler angles, but limited on z axis
     * @zh 本地坐标系下的旋转，用欧拉角表示，但是限定在 z 轴上。
     */
    get angle(): number;
    set angle(val: number);
    /**
     * @en Rotation in world coordinate system, represented by a quaternion
     * @zh 世界坐标系下的旋转，用四元数表示
     */
    get worldRotation(): Readonly<Quat>;
    set worldRotation(val: Readonly<Quat>);
    /**
     * @en Scale in local coordinate system
     * @zh 本地坐标系下的缩放
     */
    get scale(): Readonly<Vec3>;
    set scale(val: Readonly<Vec3>);
    /**
     * @en Scale in world coordinate system
     * @zh 世界坐标系下的缩放
     */
    get worldScale(): Readonly<Vec3>;
    set worldScale(val: Readonly<Vec3>);
    /**
     * @en Local transformation matrix
     * @zh 本地坐标系变换矩阵
     */
    set matrix(val: Readonly<Mat4>);
    /**
     * @en World transformation matrix
     * @zh 世界坐标系变换矩阵
     */
    get worldMatrix(): Readonly<Mat4>;
    /**
     * @en The vector representing forward direction in local coordinate system, it's the minus z direction by default
     * @zh 当前节点面向的前方方向，默认前方为 -z 方向
     */
    get forward(): Vec3;
    set forward(dir: Vec3);
    /**
     * @en Return the up direction vertor of this node in world space.
     * @zh 返回当前节点在世界空间中朝上的方向向量
     */
    get up(): Vec3;
    /**
     * @en Return the right direction vector of this node in world space.
     * @zh 返回当前节点在世界空间中朝右的方向向量
     */
    get right(): Vec3;
    set mobility(m: number);
    get mobility(): number;
    /**
     * @en Layer of the current Node, it affects raycast, physics etc, refer to [[Layers]]
     * @zh 节点所属层，主要影响射线检测、物理碰撞等，参考 [[Layers]]
     */
    set layer(l: number);
    get layer(): number;
    /**
     * @zh 节点的变换改动版本号。
     * @en The transformation change version number of the node.
     * @engineInternal
     * @internal
     */
    get flagChangedVersion(): number;
    /**
     * @en Whether the node's transformation have changed during the current frame.
     * @zh 这个节点的空间变换信息在当前帧内是否有变过？
     */
    get hasChangedFlags(): number;
    set hasChangedFlags(val: number);
    /**
     * @internal
     */
    [serializeTag](serializationOutput: SerializationOutput, context: SerializationContext): void;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _onSetParent(oldParent: this | null, keepWorldTransform?: boolean): void;
    protected _onHierarchyChanged(oldParent: this | null): void;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _onBatchCreated(dontSyncChildPrefab: boolean): void;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _onBeforeSerialize(): void;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _onPostActivated(active: boolean): void;
    /**
     * @en Perform a translation on the node
     * @zh 移动节点
     * @param trans The increment on position
     * @param ns The operation coordinate space
     */
    translate(trans: Vec3, ns?: NodeSpace): void;
    /**
     * @en Perform a rotation on the node
     * @zh 旋转节点
     * @param rot The increment on rotation
     * @param ns The operation coordinate space
     */
    rotate(rot: Quat, ns?: NodeSpace): void;
    /**
     * @en Set the orientation of the node to face the target position, the node is facing minus z direction by default
     * @zh 设置当前节点旋转为面向目标位置，默认前方为 -z 方向
     * @param pos Target position
     * @param up Up direction
     */
    lookAt(pos: Readonly<Vec3>, up?: Readonly<Vec3>): void;
    /**
     * @en Invalidate the world transform information
     * for this node and all its children recursively
     * @zh 递归标记节点世界变换为 dirty
     * @param dirtyBit The dirty bits to setup to children, can be composed with multiple dirty bits
     */
    invalidateChildren(dirtyBit: TransformBit): void;
    /**
     * @en Update the world transform information if outdated
     * @zh 更新节点的世界变换信息
     */
    updateWorldTransform(): void;
    /**
     * @en Set position in local coordinate system
     * @zh 设置本地坐标
     * @param position Target position
     */
    setPosition(position: Readonly<Vec3>): void;
    /**
     * @en Set position in local coordinate system
     * @zh 设置本地坐标
     * @param x X axis position
     * @param y Y axis position
     * @param z Z axis position
     */
    setPosition(x: number, y: number, z?: number): void;
    /**
     * @en Get position in local coordinate system, please try to pass `out` vector and reuse it to avoid garbage.
     * @zh 获取本地坐标，注意，尽可能传递复用的 [[Vec3]] 以避免产生垃圾。
     * @param out Set the result to out vector
     * @return If `out` given, the return value equals to `out`, otherwise a new vector will be generated and return
     */
    getPosition(out?: Vec3): Vec3;
    /**
     * @en Set rotation in local coordinate system with a quaternion representing the rotation.
     * Please make sure the rotation is normalized.
     * @zh 用四元数设置本地旋转, 请确保设置的四元数已归一化。
     * @param rotation Rotation in quaternion
     */
    setRotation(rotation: Readonly<Quat>): void;
    /**
     * @en Set rotation in local coordinate system with a quaternion representing the rotation.
     * Please make sure the rotation is normalized.
     * @zh 用四元数设置本地旋转, 请确保设置的四元数已归一化。
     * @param x X value in quaternion
     * @param y Y value in quaternion
     * @param z Z value in quaternion
     * @param w W value in quaternion
     */
    setRotation(x: number, y: number, z: number, w: number): void;
    /**
     * @en Set rotation in local coordinate system with a vector representing euler angles
     * @zh 用欧拉角设置本地旋转
     * @param rotation Rotation in vector
     */
    setRotationFromEuler(rotation: Vec3): void;
    /**
     * @en Set rotation in local coordinate system with euler angles
     * @zh 用欧拉角设置本地旋转
     * @param x X axis rotation
     * @param y Y axis rotation
     * @param zOpt Z axis rotation
     */
    setRotationFromEuler(x: number, y: number, zOpt?: number): void;
    /**
     * @en Get rotation as quaternion in local coordinate system, please try to pass `out` quaternion and reuse it to avoid garbage.
     * @zh 获取本地旋转，注意，尽可能传递复用的 [[Quat]] 以避免产生垃圾。
     * @param out Set the result to out quaternion
     * @return If `out` given, the return value equals to `out`, otherwise a new quaternion will be generated and return
     */
    getRotation(out?: Quat): Quat;
    /**
     * @en Set scale in local coordinate system
     * @zh 设置本地缩放
     * @param scale Target scale
     */
    setScale(scale: Readonly<Vec3>): void;
    /**
     * @en Set scale in local coordinate system
     * @zh 设置本地缩放
     * @param x X axis scale
     * @param y Y axis scale
     * @param z Z axis scale
     */
    setScale(x: number, y: number, z?: number): void;
    /**
     * @en Get scale in local coordinate system, please try to pass `out` vector and reuse it to avoid garbage.
     * @zh 获取本地缩放，注意，尽可能传递复用的 [[Vec3]] 以避免产生垃圾。
     * @param out Set the result to out vector
     * @return If `out` given, the return value equals to `out`, otherwise a new vector will be generated and return
     */
    getScale(out?: Vec3): Vec3;
    /**
     * @en Inversely transform a point from world coordinate system to local coordinate system.
     * @zh 逆向变换一个空间点，一般用于将世界坐标转换到本地坐标系中。
     * @param out The result point in local coordinate system will be stored in this vector
     * @param p A position in world coordinate system
     */
    inverseTransformPoint(out: Vec3, p: Vec3): Vec3;
    /**
     * @en Set position in world coordinate system
     * @zh 设置世界坐标
     * @param position Target position
     */
    setWorldPosition(position: Vec3): void;
    /**
     * @en Set position in world coordinate system
     * @zh 设置世界坐标
     * @param x X axis position
     * @param y Y axis position
     * @param z Z axis position
     */
    setWorldPosition(x: number, y: number, z: number): void;
    /**
     * @en Get position in world coordinate system, please try to pass `out` vector and reuse it to avoid garbage.
     * @zh 获取世界坐标，注意，尽可能传递复用的 [[Vec3]] 以避免产生垃圾。
     * @param out Set the result to out vector
     * @return If `out` given, the return value equals to `out`, otherwise a new vector will be generated and return
     */
    getWorldPosition(out?: Vec3): Vec3;
    /**
     * @en Set rotation in world coordinate system with a quaternion representing the rotation
     * @zh 用四元数设置世界坐标系下的旋转
     * @param rotation Rotation in quaternion
     */
    setWorldRotation(rotation: Quat): void;
    /**
     * @en Set rotation in world coordinate system with a quaternion representing the rotation
     * @zh 用四元数设置世界坐标系下的旋转
     * @param x X value in quaternion
     * @param y Y value in quaternion
     * @param z Z value in quaternion
     * @param w W value in quaternion
     */
    setWorldRotation(x: number, y: number, z: number, w: number): void;
    /**
     * @en Set rotation in world coordinate system with euler angles
     * @zh 用欧拉角设置世界坐标系下的旋转
     * @param x X axis rotation
     * @param y Y axis rotation
     * @param z Z axis rotation
     */
    setWorldRotationFromEuler(x: number, y: number, z: number): void;
    /**
     * @en Get rotation as quaternion in world coordinate system, please try to pass `out` quaternion and reuse it to avoid garbage.
     * @zh 获取世界坐标系下的旋转，注意，尽可能传递复用的 [[Quat]] 以避免产生垃圾。
     * @param out Set the result to out quaternion
     * @return If `out` given, the return value equals to `out`, otherwise a new quaternion will be generated and return
     */
    getWorldRotation(out?: Quat): Quat;
    /**
     * @en Set scale in world coordinate system
     * @zh 设置世界坐标系下的缩放
     * @param scale Target scale
     */
    setWorldScale(scale: Vec3): void;
    /**
     * @en Set scale in world coordinate system
     * @zh 设置世界坐标系下的缩放
     * @param x X axis scale
     * @param y Y axis scale
     * @param z Z axis scale
     */
    setWorldScale(x: number, y: number, z: number): void;
    /**
     * @en Get scale in world coordinate system, please try to pass `out` vector and reuse it to avoid garbage.
     * @zh 获取世界缩放，注意，尽可能传递复用的 [[Vec3]] 以避免产生垃圾。
     * @param out Set the result to out vector
     * @return If `out` given, the return value equals to `out`, otherwise a new vector will be generated and return
     */
    getWorldScale(out?: Vec3): Vec3;
    /**
     * @en Get a world transform matrix
     * @zh 获取世界变换矩阵
     * @param out Set the result to out matrix
     * @return If `out` given, the return value equals to `out`, otherwise a new matrix will be generated and return
     */
    getWorldMatrix(out?: Mat4): Mat4;
    /**
     * @en Get a world transform matrix with only rotation and scale
     * @zh 获取只包含旋转和缩放的世界变换矩阵
     * @param out Set the result to out matrix
     * @return If `out` given, the return value equals to `out`, otherwise a new matrix will be generated and return
     */
    getWorldRS(out?: Mat4): Mat4;
    /**
     * @en Get a world transform matrix with only rotation and translation
     * @zh 获取只包含旋转和位移的世界变换矩阵
     * @param out Set the result to out matrix
     * @return If `out` given, the return value equals to `out`, otherwise a new matrix will be generated and return
     */
    getWorldRT(out?: Mat4): Mat4;
    /**
     * @en Set local transformation with rotation, position and scale separately.
     * @zh 一次性设置所有局部变换（平移、旋转、缩放）信息
     * @param rot The rotation
     * @param pos The position
     * @param scale The scale
     */
    setRTS(rot?: Quat | Vec3, pos?: Vec3, scale?: Vec3): void;
    /**
     * @en Does the world transform information of this node need to be updated?
     * @zh 这个节点的空间变换信息是否需要更新？
     */
    isTransformDirty(): boolean;
    /**
     * @en
     * Pause all system events which is dispatched by [[SystemEvent]].
     * If recursive is set to true, then this API will pause the node system events for the node and all nodes in its sub node tree.
     * @zh
     * 暂停所有 [[SystemEvent]] 派发的系统事件。
     * 如果传递 recursive 为 true，那么这个 API 将暂停本节点和它的子树上所有节点的节点系统事件。
     *
     * @param recursive Whether pause system events recursively for the child node tree
     */
    pauseSystemEvents(recursive: boolean): void;
    /**
     * @en
     * Resume all paused system events which is dispatched by [[SystemEvent]].
     * If recursive is set to true, then this API will resume the node system events for the node and all nodes in its sub node tree.
     *
     * @zh
     * 恢复所有 [[SystemEvent]] 派发的系统事件。
     * 如果传递 recursive 为 true，那么这个 API 将恢复本节点和它的子树上所有节点的节点系统事件。
     *
     * @param recursive Whether resume system events recursively for the child node tree
     */
    resumeSystemEvents(recursive: boolean): void;
    /**
     * @en
     * clear all node dirty state.
     * @zh
     * 清除所有节点的脏标记。
     */
    static resetHasChangedFlags(): void;
    /**
     * @en
     * clear node array
     * @zh
     * 清除节点数组
     */
    static clearNodeArray(): void;
    /**
     * @en
     * Get the complete path of the current node in the hierarchy.
     *
     * @zh
     * 获得当前节点在 hierarchy 中的完整路径。
     */
    getPathInHierarchy(): string;
    /**
     * @mangle
     * @engineInternal
     */
    _getUITransformComp(): UITransform | null;
    /**
     * @engineInternal
     */
    set isSkipTransformUpdate(skip: boolean);
    /**
     * @engineInternal
     */
    get isSkipTransformUpdate(): boolean;
}
