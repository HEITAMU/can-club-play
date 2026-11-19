import { FiniteTimeAction } from './action';
import type { Node } from '../../scene-graph';
/**
 * @en Instant actions are immediate actions. They don't have a duration like the ActionInterval actions.
 * @zh 即时动作，这种动作立即就会执行，继承自 FiniteTimeAction。
 * @class ActionInstant
 * @extends FiniteTimeAction
 */
export declare abstract class ActionInstant extends FiniteTimeAction {
    isDone(): boolean;
    step(_dt: number): void;
    update(_dt: number): void;
    /**
     * returns a reversed action. <br />
     * For example: <br />
     * - The action is x coordinates of 0 move to 100. <br />
     * - The reversed action will be x of 100 move to 0.
     * @returns {Action}
     */
    reverse(): ActionInstant;
    abstract clone(): ActionInstant;
    isUnknownDuration(): boolean;
}
export declare class Show<T extends Node> extends ActionInstant {
    update(_dt: number): void;
    reverse(): Hide<T>;
    clone(): Show<T>;
    toString(): string;
}
/**
 * @en Show the Node.
 * @zh 立即显示。
 * @method show
 * @return {Show}
 * @example
 * // example
 * var showAction = show();
 */
export declare function show<T extends Node>(): Show<T>;
export declare class Hide<T extends Node> extends ActionInstant {
    update(_dt: number): void;
    reverse(): Show<T>;
    clone(): Hide<T>;
    toString(): string;
}
/**
 * @en Hide the node.
 * @zh 立即隐藏。
 * @method hide
 * @return {Hide}
 * @example
 * // example
 * var hideAction = hide();
 */
export declare function hide<T extends Node>(): Hide<T>;
export declare class ToggleVisibility<T extends Node> extends ActionInstant {
    update(_dt: number): void;
    reverse(): ToggleVisibility<T>;
    clone(): ToggleVisibility<T>;
    toString(): string;
}
/**
 * @en Toggles the visibility of a node.
 * @zh 显隐状态切换。
 * @method toggleVisibility
 * @return {ToggleVisibility}
 * @example
 * // example
 * var toggleVisibilityAction = toggleVisibility();
 */
export declare function toggleVisibility<T extends Node>(): ToggleVisibility<T>;
export declare class RemoveSelf<T extends Node> extends ActionInstant {
    protected _isNeedCleanUp: boolean;
    constructor(isNeedCleanUp?: boolean);
    update(_dt: number): void;
    init(isNeedCleanUp: boolean): boolean;
    reverse(): RemoveSelf<T>;
    clone(): RemoveSelf<T>;
    toString(): string;
}
/**
 * @en Create a RemoveSelf object with a flag indicate whether the target should be cleaned up while removing.
 * @zh 从父节点移除自身。
 * @method removeSelf
 * @param {Boolean} [isNeedCleanUp = true]
 * @return {RemoveSelf}
 *
 * @example
 * // example
 * var removeSelfAction = removeSelf();
 */
export declare function removeSelf<T extends Node>(isNeedCleanUp: boolean): RemoveSelf<T>;
export type CallFuncCallback<Target, Data> = (target?: Target, data?: Data) => void;
export declare class CallFunc<CallbackThis, Target, Data> extends ActionInstant {
    private _callbackThis;
    private _callback;
    private _data;
    constructor(selector?: CallFuncCallback<Target, Data>, callbackThis?: CallbackThis, data?: Data);
    initWithFunction(callback?: CallFuncCallback<Target, Data>, callbackThis?: CallbackThis, data?: Data): boolean;
    execute(): void;
    update(_dt: number): void;
    getTargetCallback(): CallbackThis | undefined;
    setTargetCallback(sel: CallbackThis): void;
    clone(): CallFunc<CallbackThis, Target, Data>;
    toString(): string;
}
/**
 * @en Creates the action with the callback.
 * @zh 执行回调函数。
 * @method callFunc
 * @param {function} selector
 * @param {object} [selectorTarget=null]
 * @param {*} [data=null] - data for function, it accepts all data types.
 * @return {ActionInstant}
 * @example
 * // example
 * // CallFunc without data
 * var finish = callFunc(this.removeSprite, this);
 *
 * // CallFunc with data
 * var finish = callFunc(this.removeFromParentAndCleanup, this._grossini,  true);
 */
export declare function callFunc<SelectorTarget, Target, Data>(selector: CallFuncCallback<Target, Data>, selectorTarget?: SelectorTarget, data?: Data): ActionInstant;
