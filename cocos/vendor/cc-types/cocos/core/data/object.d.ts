import { EditorExtendableObject, editorExtrasTag } from './editor-extras-tag';
export declare enum CCObjectFlags {
    Destroyed = 1,
    RealDestroyed = 2,
    ToDestroy = 4,
    DontSave = 8,
    EditorOnly = 16,
    Dirty = 32,
    DontDestroy = 64,
    Destroying = 128,
    Deactivating = 256,
    LockedInEditor = 512,
    HideInHierarchy = 1024,
    IsOnEnableCalled = 2048,
    IsEditorOnEnableCalled = 4096,
    IsPreloadStarted = 8192,
    IsOnLoadCalled = 16384,
    IsOnLoadStarted = 32768,
    IsStartCalled = 65536,
    IsRotationLocked = 131072,
    IsScaleLocked = 262144,
    IsAnchorLocked = 524288,
    IsSizeLocked = 1048576,
    IsPositionLocked = 2097152,
    IsSkipTransformUpdate = 16777216,
    PersistentMask = -4192741,
    AllHideMasks = 1560
}
/**
 * @en
 * The base class of most of all the objects in Fireball.
 * @zh
 * 大部分对象的基类。
 * @private
 */
declare class CCObject implements EditorExtendableObject {
    static _deferredDestroy(): void;
    /**
     * @internal
     */
    [editorExtrasTag]: unknown;
    /**
     * @internal
     */
    _objFlags: number;
    /**
     * @dontmangle
     * NOTE: _name is a serializable property set by `CCClass.fastDefine`,
     * so it should not be mangled while `mangleProtected` is true in `<<ProjectRoot>>/engine-mangle-config.json`.
     */
    protected _name: string;
    constructor(name?: string);
    /**
     * @en The name of the object.
     * @zh 该对象的名称。
     * @default ""
     * @example
     * ```
     * obj.name = "New Obj";
     * ```
     */
    get name(): string;
    set name(value: string);
    /**
     * @en After inheriting CCObject objects, control whether you need to hide, lock, serialize, and other functions.
     * @zh 在继承 CCObject 对象后，控制是否需要隐藏，锁定，序列化等功能。
     */
    set hideFlags(hideFlags: CCObject.Flags);
    get hideFlags(): CCObject.Flags;
    /**
     * @en
     * Indicates whether the object is not yet destroyed. (It will not be available after being destroyed)<br>
     * When an object's `destroy` is called, it is actually destroyed after the end of this frame.
     * So `isValid` will return false from the next frame, while `isValid` in the current frame will still be true.
     * If you want to determine whether the current frame has called `destroy`, use `isValid(obj, true)`,
     * but this is often caused by a particular logical requirements, which is not normally required.
     *
     * @zh
     * 表示该对象是否可用（被 destroy 后将不可用）。<br>
     * 当一个对象的 `destroy` 调用以后，会在这一帧结束后才真正销毁。<br>
     * 因此从下一帧开始 `isValid` 就会返回 false，而当前帧内 `isValid` 仍然会是 true。<br>
     * 如果希望判断当前帧是否调用过 `destroy`，请使用 `isValid(obj, true)`，不过这往往是特殊的业务需求引起的，通常情况下不需要这样。
     * @default true
     * @readOnly
     * @example
     * ```ts
     * import { Node, log } from 'cc';
     * const node = new Node();
     * log(node.isValid);    // true
     * node.destroy();
     * log(node.isValid);    // true, still valid in this frame
     * // after a frame...
     * log(node.isValid);    // false, destroyed in the end of last frame
     * ```
     */
    get isValid(): boolean;
    /**
     * @en
     * Destroy this Object, and release all its own references to other objects.<br/>
     * Actual object destruction will delayed until before rendering.
     * From the next frame, this object is not usable any more.
     * You can use `isValid(obj)` to check whether the object is destroyed before accessing it.
     * @zh
     * 销毁该对象，并释放所有它对其它对象的引用。<br/>
     * 实际销毁操作会延迟到当前帧渲染前执行。从下一帧开始，该对象将不再可用。
     * 您可以在访问对象之前使用 `isValid(obj)` 来检查对象是否已被销毁。
     * @return whether it is the first time the destroy being called
     * @example
     * ```
     * obj.destroy();
     * ```
     */
    destroy(): boolean;
    /**
     * @en
     * Clear all references in the instance.
     *
     * NOTE: this method will not clear the getter or setter functions which defined in the instance of CCObject.
     *
     * @zh
     * 清理实例的所有引用
     * 注意：此方法不会清理实例上的 getter 与 setter 方法。
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     * @example
     * ```
     * // You can override the _destruct method if you need, for example:
     *       _destruct: function () {
     *           for (var key in this) {
     *               if (this.hasOwnProperty(key)) {
     *                   switch (typeof this[key]) {
     *                       case 'string':
     *                           this[key] = '';
     *                           break;
     *                       case 'object':
     *                       case 'function':
     *                           this[key] = null;
     *                           break;
     *               }
     *           }
     *       }
     * ```
     */
    _destruct(): void;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _destroyImmediate(): void;
}
declare namespace CCObject {
    enum Flags {
        Destroyed,
        /**
         * @en The object will not be saved.
         * @zh 该对象将不会被保存。
         */
        DontSave,
        /**
         * @en The object will not be saved when building a player.
         * @zh 构建项目时，该对象将不会被保存。
         */
        EditorOnly,
        Dirty,
        /**
         * @en Dont destroy automatically when loading a new scene.
         * @zh 加载一个新场景时，不自动删除该对象。
         * @private
         */
        DontDestroy,
        /**
         * @en
         * @zh
         * @private
         */
        PersistentMask,
        /**
         * @en
         * @zh
         * @private
         */
        Destroying,
        /**
         * @en The node is deactivating.
         * @zh 节点正在反激活的过程中。
         * @private
         */
        Deactivating,
        /**
         * @en
         * Hide in game and hierarchy.
         * This flag is readonly, it can only be used as an argument of scene.addEntity() or Entity.createWithFlags().
         * @zh
         * 在游戏和层级中隐藏该对象。<br/>
         * 该标记只读，它只能被用作 scene.addEntity()的一个参数。
         */
        /**
         * @en The lock node, when the node is locked, cannot be clicked in the scene.
         * @zh 锁定节点，锁定后场景内不能点击。
         * @private
         */
        LockedInEditor,
        /**
          * @en Hide the object in editor.
          * @zh 在编辑器中隐藏该对象。
          */
        HideInHierarchy,
        /**
          * @en The object will not be saved and hide the object in editor,and lock node, when the node is locked,
          * cannot be clicked in the scene,and The object will not be saved when building a player.
          * @zh 该对象将不会被保存,构建项目时，该对象将不会被保存, 锁定节点，锁定后场景内不能点击, 在编辑器中隐藏该对象。
          */
        AllHideMasks,
        /**
         * @en
         * Hide in game view, hierarchy, and scene view... etc.
         * This flag is readonly, it can only be used as an argument of scene.addEntity() or Entity.createWithFlags().
         * @zh
         * 在游戏视图，层级，场景视图等等...中隐藏该对象。
         * 该标记只读，它只能被用作 scene.addEntity()的一个参数。
         */
        IsPreloadStarted,
        IsOnLoadStarted,
        IsOnLoadCalled,
        IsOnEnableCalled,
        IsStartCalled,
        IsEditorOnEnableCalled,
        IsPositionLocked,
        IsRotationLocked,
        IsScaleLocked,
        IsAnchorLocked,
        IsSizeLocked
    }
    let __props__: string[];
    let __values__: string[];
}
export declare function isCCObject(object: any): object is CCObject;
export declare function isValid<T>(value: T | null | undefined, strictMode?: boolean): value is T;
export { CCObject };
