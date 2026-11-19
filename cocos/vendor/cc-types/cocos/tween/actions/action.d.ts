import type { Tween } from '../tween';
export declare enum ActionEnum {
    /**
     * @en Default Action tag.
     * @zh 默认动作标签。
     * @constant
     * @static
     * @default -1
     */
    TAG_INVALID = -1
}
/**
 * @en Base classAction for action classes.
 * @zh Action 类是所有动作类型的基类。
 * @class Action
 */
export declare abstract class Action {
    /**
     * The `originalTarget` and `target` are both assigned in `startWithTarget` method,
     * and they get the same value normally. The difference between `originalTarget` and
     * `target` is that `target` will be set to null after `stop` method is invoked
     * but `originalTarget` will not. Therefore, ActionManager could remove a stopped action
     * from hash map by searching action's `originalTarget`. You could refer to
     * ActionManager.removeAction for the details.
     */
    protected originalTarget: unknown;
    protected target: unknown;
    /**
     * The tween who owns this action.
     * @engineInternal
     * @mangle
     */
    _owner: Tween | null;
    protected tag: ActionEnum;
    /**
     * @en The identifier that to mark an internal action.
     */
    protected _id: number | undefined;
    protected _paused: boolean;
    /**
     * @en
     * to copy object with deep copy.
     * returns a clone of action.
     * @zh 返回一个克隆的动作。
     * @method clone
     * @return {Action}
     */
    abstract clone(): Action;
    /**
     * @en
     * return true if the action has finished.
     * @zh 如果动作已完成就返回 true。
     * @method isDone
     * @return {Boolean}
     */
    isDone(): boolean;
    startWithTarget<T>(target: T | null): void;
    stop(): void;
    abstract step(dt: number): void;
    abstract update(dt: number): void;
    /**
     * @en get the target.
     * @zh 获取当前目标节点。
     * @method getTarget
     * @return {object}
     */
    getTarget<T>(): T | null;
    /**
     * @en The action will modify the target properties.
     * @zh 设置目标节点。
     * @method setTarget
     * @param {object} target
     */
    setTarget<T>(target: T): void;
    /**
     * @en get the original target.
     * @zh 获取原始目标节点。
     * @method getOriginalTarget
     * @return {object}
     */
    getOriginalTarget<T>(): T | null;
    setOriginalTarget<T>(originalTarget: T): void;
    /**
     * Return the worker target of the current action applys on.
     * @engineInternal
     * @mangle
     *
     * Example 1:
     * ```ts
     *   tween(node).to(1, { scale: new Vec3(2, 2, 2) }).start();
     *   // target and original target are both `node`, _getWorkerTarget returns `null`.
     * ```
     *
     * Example 2:
     * ```ts
     *   tween(node).parallel(                                        // ----- Root tween
     *       tween(node).to(1, { scale: new Vec3(2, 2, 2) }),         // ----- Sub tween 1
     *       tween(node).to(1, { position: new Vec3(10, 10, 10) })    // ----- Sub Tween 2
     *   ).start();
     *   // Note that only root tween is started here. We call tweens in `parallel`/`sequence` sub tweens.
     *   // The `target` and `originalTarget` of all internal actions are `node`.
     *   // Actions in root tween: _getWorkerTarget returns `node`,
     *   // Actions in sub tween 1: _getWorkerTarget returns `node`,
     *   // Actions in sub tween 2: _getWorkerTarget returns `node`.
     * ```
     *
     * Example 3:
     * ```ts
     *   tween(node).parallel(                                        // ----- Root tween
     *       tween(node).to(1, { scale: new Vec3(2, 2, 2) }),         // ----- Sub tween 1
     *       tween(node.getComponent(UITransform)).to(1, {            // ----- Sub Tween 2
     *           contentSize: new Size(10, 10)
     *       })
     *   ).start();
     *   // Note that only root tween is started here. We call tweens in `parallel`/`sequence` sub tweens.
     *   // The `target` and `originalTarget` of all internal actions are `node`.
     *   // Actions in root tween: workerTarget = `node`,
     *   // Actions in sub tween 1: workerTarget = `node`,
     *   // Actions in sub tween 2: workerTarget = `node`'s UITransform component.
     * ```
     */
    protected _getWorkerTarget<T>(): T | null;
    /**
     * @en get tag number.
     * @zh 获取用于识别动作的标签。
     * @method getTag
     * @return {Number}
     */
    getTag(): number;
    /**
     * @en set tag number.
     * @zh 设置标签，用于识别动作。
     * @method setTag
     * @param {Number} tag
     */
    setTag(tag: number): void;
    /**
     * @en Set the identifier of the current action.
     * @param id @en The identifier to set
     */
    setId(id: number): void;
    /**
     * @en Get the identifier of the current action.
     * @return @en The identifier of the current action, it may be undefined if setId is never called.
     */
    getId(): number | undefined;
    setPaused(paused: boolean): void;
    /**
     * @en
     * Returns a reversed action. <br />
     * For example: <br />
     * - The action will be x coordinates of 0 move to 100. <br />
     * - The reversed action will be x of 100 move to 0.
     * - Will be rewritten
     * @zh 返回一个新的动作，执行与原动作完全相反的动作。
     * @method reverse
     * @return {Action | null}
     */
    abstract reverse(): Action | null;
}
/**
 * @en
 * Base class actions that do have a finite time duration. <br/>
 * Possible actions: <br/>
 * - An action with a duration of 0 seconds. <br/>
 * - An action with a duration of 35.5 seconds.
 *
 * Infinite time actions are valid
 * @zh 有限时间动作，这种动作拥有时长 duration 属性。
 * @class FiniteTimeAction
 * @extends Action
 */
export declare abstract class FiniteTimeAction extends Action {
    protected _duration: number;
    constructor();
    getDurationScaled(): number;
    /**
     * @en get duration of the action. (seconds).
     * @zh 获取动作以秒为单位的持续时间。
     * @method getDuration
     * @return {Number}
     */
    getDuration(): number;
    /**
     * @en set duration of the action. (seconds).
     * @zh 设置动作以秒为单位的持续时间。
     * @method setDuration
     * @param {Number} duration
     */
    setDuration(duration: number): void;
    /**
     * @en
     * To copy object with deep copy.
     * returns a clone of FiniteTimeAction.
     * @zh 返回一个克隆的有限时间动作。
     * @method clone
     * @return {FiniteTimeAction}
     */
    abstract clone(): FiniteTimeAction;
    abstract reverse(): FiniteTimeAction;
    abstract isUnknownDuration(): boolean;
}
