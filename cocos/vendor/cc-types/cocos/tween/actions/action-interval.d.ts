import { FiniteTimeAction } from './action';
import type { Tween, TweenUpdateCallback } from '../tween';
/**
 * @en
 * <p> An interval action is an action that takes place within a certain period of time. <br/>
 * It has an start time, and a finish time. The finish time is the parameter<br/>
 * duration plus the start time.</p>
 *
 * <p>These CCActionInterval actions have some interesting properties, like:<br/>
 * - They can run normally (default)  <br/>
 * - They can run reversed with the reverse method   <br/>
 * - They can run with the time altered with the Accelerate, AccelDeccel and Speed actions. </p>
 *
 * <p>For example, you can simulate a Ping Pong effect running the action normally and<br/>
 * then running it again in Reverse mode. </p>
 * @zh 时间间隔动作，这种动作在已定时间内完成，继承 FiniteTimeAction。
 * @class ActionInterval
 * @extends FiniteTimeAction
 * @param {Number} d duration in seconds
 */
export declare abstract class ActionInterval extends FiniteTimeAction {
    protected MAX_VALUE: number;
    protected _elapsed: number;
    protected _startTime: number;
    protected _firstTick: boolean;
    protected _speed: number;
    constructor(d?: number);
    setStartTime(time: number): void;
    getElapsed(): number;
    initWithDuration(d: number): boolean;
    isDone(): boolean;
    /**
     * @mangle
     * @engineInternal
     */
    _cloneDecoration(action: ActionInterval): void;
    abstract clone(): ActionInterval;
    step(dt: number): void;
    startWithTarget<T>(target: T | null): void;
    abstract reverse(): ActionInterval;
    /**
     * @en
     * Get this action speed.
     * @zh
     * 返回此动作速度
     * @return {Number}
     */
    getSpeed(): number;
    /**
     * @en
     * Set this action speed.
     * @zh
     * 设置此动作速度
     * @param {Number} speed
     * @returns {ActionInterval}
     */
    setSpeed(speed: number): void;
    getDurationScaled(): number;
}
export declare class Sequence extends ActionInterval {
    private _actions;
    private _split;
    private _last;
    private _reversed;
    /**
     * @example
     * import { Sequence } from 'cc';
     *
     * // create sequence with actions
     * const seq = new Sequence(act1, act2);
     *
     * // create sequence with array
     * const seq = new Sequence(actArray);
     */
    constructor(actions?: FiniteTimeAction[]);
    /**
     * Initializes the action
     * @param actionOne the first action to run
     * @param actionTwo the second action to run
     * @return true if the action initializes properly, false otherwise.
     */
    initWithTwoActions(actionOne?: FiniteTimeAction, actionTwo?: FiniteTimeAction): boolean;
    clone(): Sequence;
    startWithTarget<T>(target: T | null): void;
    stop(): void;
    update(t: number): void;
    reverse(): Sequence;
    /** @mangle */
    updateOwner<T extends object>(owner: Tween<T>): void;
    /** @mangle */
    findAction(id: number): FiniteTimeAction | null;
    isUnknownDuration(): boolean;
    toString(): string;
}
/**
 * @en
 * Helper constructor to create an array of sequenceable actions
 * The created action will run actions sequentially, one after another.
 * @zh 顺序执行动作，创建的动作将按顺序依次运行。
 * @method sequence
 * @param {FiniteTimeAction|FiniteTimeAction[]} actionOrActionArray
 * @param {FiniteTimeAction} ...tempArray
 * @return {Sequence}
 * @example
 * import { sequence } from 'cc';
 *
 * // Create sequence with actions
 * const seq = sequence(act1, act2);
 *
 * // Create sequence with array
 * const seq = sequence(actArray);
 */
export declare function sequence(actions: FiniteTimeAction[]): Sequence;
export declare class Repeat extends ActionInterval {
    private _times;
    private _total;
    private _nextDt;
    private _actionInstant;
    private _innerAction;
    constructor(action?: FiniteTimeAction, times?: number);
    initWithAction(action?: FiniteTimeAction, times?: number): boolean;
    clone(): Repeat;
    startWithTarget<T>(target: T | null): void;
    stop(): void;
    update(dt: number): void;
    isDone(): boolean;
    reverse(): Repeat;
    setInnerAction(action: FiniteTimeAction): void;
    getInnerAction(): FiniteTimeAction | null;
    isUnknownDuration(): boolean;
    toString(): string;
}
/**
 * @en Creates a Repeat action. Times is an unsigned integer between 1 and pow(2,30)
 * @zh 重复动作，可以按一定次数重复一个动，如果想永远重复一个动作请使用 repeatForever 动作来完成。
 * @method repeat
 * @param {FiniteTimeAction} action
 * @param {Number} times
 * @return {Action}
 * @example
 * import { repeat, sequence } from 'cc';
 * const rep = repeat(sequence(jump2, jump1), 5);
 */
export declare function repeat(action: FiniteTimeAction, times: number): Repeat;
export declare class RepeatForever extends ActionInterval {
    private _innerAction;
    constructor(action?: ActionInterval);
    initWithAction(action: ActionInterval): boolean;
    clone(): RepeatForever;
    startWithTarget<T>(target: T | null): void;
    stop(): void;
    step(dt: number): void;
    update(_t: number): void;
    isDone(): boolean;
    reverse(): RepeatForever;
    setInnerAction(action: ActionInterval | null): void;
    getInnerAction(): ActionInterval | null;
    isUnknownDuration(): boolean;
    toString(): string;
}
/**
 * @en Create a acton which repeat forever, as it runs forever, it can't be added into `sequence` and `spawn`.
 * @zh 永远地重复一个动作，有限次数内重复一个动作请使用 repeat 动作，由于这个动作不会停止，所以不能被添加到 `sequence` 或 `spawn` 中。
 * @method repeatForever
 * @param {FiniteTimeAction} action
 * @return {ActionInterval}
 * @example
 * import { repeatForever, rotateBy } from 'cc';
 * var repeat = repeatForever(rotateBy(1.0, 360));
 */
export declare function repeatForever(action?: ActionInterval): RepeatForever;
export declare class Spawn extends ActionInterval {
    private _one;
    private _two;
    private _finished;
    constructor(actions?: FiniteTimeAction[]);
    initWithTwoActions(action1?: FiniteTimeAction, action2?: FiniteTimeAction): boolean;
    clone(): Spawn;
    startWithTarget<T>(target: T | null): void;
    stop(): void;
    update(t: number): void;
    reverse(): Spawn;
    /**
     * @mangle
     * @engineInternal
     */
    updateOwner<T extends object>(owner: Tween<T>): void;
    /**
     * @mangle
     * @engineInternal
     */
    findAction(id: number): FiniteTimeAction | null;
    isUnknownDuration(): boolean;
    toString(): string;
}
/**
 * @en Create a spawn action which runs several actions in parallel.
 * @zh 同步执行动作，同步执行一组动作。
 * @method spawn
 * @param {FiniteTimeAction|FiniteTimeAction[]} actionOrActionArray
 * @param {FiniteTimeAction} ...tempArray
 * @return {Spawn}
 * @example
 * import { spawn, jumpBy, rotateBy, Vec2 } from 'cc';
 * const action = spawn(jumpBy(2, new Vec2(300, 0), 50, 4), rotateBy(2, 720));
 * todo: It should be the direct use new
 */
export declare function spawn(actions: FiniteTimeAction[]): Spawn;
/**
 * @en Delays the action a certain amount of seconds.
 * @zh 延迟指定的时间量。
 * @method delayTime
 * @param {Number} d duration in seconds
 * @return {ActionInterval}
 * @example
 * import { delayTime } from 'cc';
 * const delay = delayTime(1);
 */
export declare function delayTime(d: number): ActionInterval;
/**
 * <p>
 * Executes an action in reverse order, from time=duration to time=0                                     <br/>
 * @warning Use this action carefully. This action is not sequenceable.                                 <br/>
 * Use it as the default "reversed" method of your own actions, but using it outside the "reversed"      <br/>
 * scope is not recommended.
 * </p>
 * @class ReverseTime
 * @extends ActionInterval
 * @param {FiniteTimeAction} action
 * @example
 * import ReverseTime from 'cc';
 * var reverse = new ReverseTime(this);
 */
export declare class ReverseTime extends ActionInterval {
    private _other;
    constructor(action?: ActionInterval);
    initWithAction(action: ActionInterval): boolean;
    clone(): ReverseTime;
    startWithTarget<T>(target: T | null): void;
    update(dt: number): void;
    reverse(): ActionInterval;
    stop(): void;
    isUnknownDuration(): boolean;
    toString(): string;
}
/**
 * @en Executes an action in reverse order, from time=duration to time=0.
 * @zh 反转目标动作的时间轴。
 * @method reverseTime
 * @param {FiniteTimeAction} action
 * @return {ActionInterval}
 * @example
 * import { reverseTime } from 'cc';
 * const reverse = reverseTime(this);
 */
export declare function reverseTime(action: ActionInterval): ReverseTime;
export declare class ActionCustomUpdate<T extends object, Args extends any[]> extends ActionInterval {
    private _cb;
    private _args;
    constructor(duration: number, cb: TweenUpdateCallback<T, Args>, args: Args);
    clone(): ActionCustomUpdate<T, Args>;
    update(ratio: number): void;
    reverse(): ActionCustomUpdate<T, Args>;
    isUnknownDuration(): boolean;
    toString(): string;
}
