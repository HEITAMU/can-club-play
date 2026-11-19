/// <reference types="./@types/globals" />
import { System } from './system';
export interface ISchedulable {
    id?: string;
    uuid?: string;
    update?(dt: number): void;
}
type CallbackType = (dt?: number) => void;
/**
 * Light weight timer
 * @mangle
 */
declare class CallbackTimer {
    static _timers: CallbackTimer[];
    static get(): CallbackTimer;
    static put(timer: CallbackTimer): void;
    private _lock;
    private _scheduler;
    private _elapsed;
    private _runForever;
    private _useDelay;
    private _timesExecuted;
    private _repeat;
    private _delay;
    private _interval;
    private _target;
    private _callback?;
    constructor();
    initWithCallback(scheduler: Scheduler, callback: CallbackType, target: ISchedulable, seconds: number, repeat: number, delay: number): boolean;
    /**
     * @en get interval for timer in seconds.
     * @zh 获取计时器的时间间隔, 以秒为单位。
     * @returns
     * @en returns interval of timer in seconds.
     * @zh 返回计时器的时间间隔, 以秒为单位。
     */
    getInterval(): number;
    /**
     * @en Set interval in seconds.
     * @zh 以秒为单位设置时间间隔。
     */
    setInterval(interval: number): void;
    /**
     * @en Update function which triggers the timer.
     * @zh 计时更新函数，用来触发计时器。
     * @param dt
     * @en delta time. The unit is seconds.
     * @zh 更新间隔时间, 单位是秒。
     */
    update(dt: number): void;
    getCallback(): CallbackType | null | undefined;
    trigger(): void;
    cancel(): void;
}
/**
 * @en
 * Scheduler is responsible of triggering the scheduled callbacks.<br>
 * You should not use NSTimer. Instead use this class.<br>
 * <br>
 * There are 2 different types of callbacks (selectors):<br>
 *     - update callback: the 'update' callback will be called every frame. You can customize the priority.<br>
 *     - custom callback: A custom callback will be called every frame, or with a custom interval of time.<br>
 * <br>
 * The 'custom selectors' should be avoided when possible. It is faster,<br>
 * and consumes less memory to use the 'update callback'. *
 * @zh
 * Scheduler 是负责触发回调函数的类。<br>
 * 通常情况下，建议使用 `director.getScheduler()` 来获取系统定时器。<br>
 * 有两种不同类型的定时器：<br>
 *     - update 定时器：每一帧都会触发。您可以自定义优先级。<br>
 *     - 自定义定时器：自定义定时器可以每一帧或者自定义的时间间隔触发。<br>
 * 如果希望每帧都触发，应该使用 update 定时器，使用 update 定时器更快，而且消耗更少的内存。
 */
export declare class Scheduler extends System {
    static ID: string;
    private _timeScale;
    private _updatesNegList;
    private _updates0List;
    private _updatesPosList;
    private _hashForUpdates;
    private _hashForTimers;
    private _currentTarget;
    private _currentTargetSalvaged;
    private _updateHashLocked;
    private _arrayForTimers;
    /**
     * @en This method should be called for any target which needs to schedule tasks, and this method should be called before any scheduler API usage.
     * This method will add a `id` property if it doesn't exist.
     * @zh 任何需要用 Scheduler 管理任务的对象主体都应该调用这个方法，并且应该在调用任何 Scheduler API 之前调用这个方法。
     * 这个方法会给对象添加一个 `id` 属性，如果这个属性不存在的话。
     * @param target
     * @en The target to enable, which type is ISchedulable.
     * @zh 所作用的对象。类型为ISchedulable。
     */
    static enableForTarget(target: ISchedulable): void;
    constructor();
    /**
     * @en
     * Modifies the time of all scheduled callbacks.<br>
     * You can use this property to create a 'slow motion' or 'fast forward' effect.<br>
     * Default is 1.0. To create a 'slow motion' effect, use values below 1.0.<br>
     * To create a 'fast forward' effect, use values higher than 1.0.<br>
     * Note：It will affect EVERY scheduled selector / action.
     * @zh
     * 设置时间间隔的缩放比例。<br>
     * 您可以使用这个方法来创建一个 “slow motion（慢动作）” 或 “fast forward（快进）” 的效果。<br>
     * 默认是 1.0。要创建一个 “slow motion（慢动作）” 效果,使用值低于 1.0。<br>
     * 要使用 “fast forward（快进）” 效果，使用值大于 1.0。<br>
     * 注意：它影响该 Scheduler 下管理的所有定时器。
     * @param timeScale
     */
    setTimeScale(timeScale: number): void;
    /**
     * @en Returns time scale of scheduler.
     * @zh 获取时间间隔的缩放比例。
     */
    getTimeScale(): number;
    /**
     * @en 'update' the scheduler. (You should NEVER call this method, unless you know what you are doing.)
     * @zh update 调度函数。(不应该直接调用这个方法，除非完全了解这么做的结果)
     * @param dt
     * @en delta time. The unit is seconds.
     * @zh 更新间隔时间, 单位是秒。
     */
    update(dt: number): void;
    /**
     * @en Specify the callback to schedule a new timer.
     * If the callback function is already scheduled, then only the interval parameter will be updated without re-scheduling it again.
     * @zh 指定回调函数来规划一个新的定时器。
     * 如果回调函数已经被定时器使用，那么只会更新之前定时器的时间间隔参数，不会设置新的定时器。
     * @param callback
     * @en The specified target.
     * @zh 所指定的调用对象。
     * @param target
     * @en The scheduled method will be called every 'interval' seconds.
     * If 'interval' is 0, it will be called every frame, but if so, it recommended to use 'scheduleUpdateForTarget:' instead.
     * @zh 当时间间隔达到指定值时，设置的回调函数将会被调用。
     * 如果 interval 值为 0，那么回调函数每一帧都会被调用，但如果是这样，建议使用 scheduleUpdateForTarget 代替。
     * @param interval
     * @en repeat let the action be repeated repeat + 1 times, use `macro.REPEAT_FOREVER` to let the action run continuously.
     * @zh repeat 值可以让定时器触发 repeat + 1 次，使用 `macro.REPEAT_FOREVER` 可以让定时器一直循环触发。
     * @param repeat
     * @en delay is the amount of time the action will wait before it'll start. Unit: s.
     * @zh delay 值指定延迟时间，定时器会在延迟指定的时间之后开始计时，单位: 秒。
     * @param delay
     * @en If paused is YES, then it won't be called until it is resumed.
     * @zh 如果 paused 值为 true，那么直到 resume 被调用才开始计时。
     * @param paused
     */
    schedule(callback: CallbackType, target: ISchedulable, interval: number, repeat?: number, delay?: number, paused?: boolean): void;
    /**
     * @en The specified target.
     * @zh 所指定的调用对象。
     * @param target
     * @en Specify the callback to schedule a new timer.
     * If the callback function is already scheduled, then only the interval parameter will be updated without re-scheduling it again.
     * @zh 指定回调函数来规划一个新的定时器。
     * 如果回调函数已经被定时器使用，那么只会更新之前定时器的时间间隔参数，不会设置新的定时器。
     * @param callback
     * @en The scheduled method will be called every 'interval' seconds.
     * If 'interval' is 0, it will be called every frame, but if so, it recommended to use 'scheduleUpdateForTarget:' instead.
     * @zh 当时间间隔达到指定值时，设置的回调函数将会被调用。
     * 如果 interval 值为 0，那么回调函数每一帧都会被调用，但如果是这样，建议使用 scheduleUpdateForTarget 代替。
     * @param interval
     * @en repeat let the action be repeated repeat + 1 times, use `macro.REPEAT_FOREVER` to let the action run continuously.
     * @zh repeat 值可以让定时器触发 repeat + 1 次，使用 `macro.REPEAT_FOREVER` 可以让定时器一直循环触发。
     * @param repeat
     * @en delay is the amount of time the action will wait before it'll start. Unit: s.
     * @zh delay 值指定延迟时间，定时器会在延迟指定的时间之后开始计时，单位: 秒。
     * @param delay
     * @en If paused is YES, then it won't be called until it is resumed.
     * @zh 如果 paused 值为 true，那么直到 resume 被调用才开始计时。
     * @param paused
     *
     * @deprecated since v3.8.0, please use `Scheduler.schedule(callback, target, interval)` instead.
     */
    schedule(target: ISchedulable, callback: CallbackType, interval: number, repeat?: number, delay?: number, paused?: boolean): void;
    /**
     * @en
     * Schedules the update callback for a given target,
     * During every frame after schedule started, the "update" function of target will be invoked.
     * @zh
     * 使用指定的优先级为指定的对象设置 update 定时器。<br>
     * update 定时器每一帧都会被触发，触发时自动调用指定对象的 "update" 函数。<br>
     * 优先级的值越低，定时器被触发的越早。
     * @param target
     * @en The target bound to the callback. @zh 回调所绑定的目标对象。
     * @param priority
     * @en The priority. @zh 优先级。
     * @param paused
     * @en Whether is paused. @zh 是否被暂停。
     */
    scheduleUpdate(target: ISchedulable, priority: number, paused: boolean): void;
    /**
     * @en
     * Unschedule a callback for a callback and a given target.
     * If you want to unschedule the "update", use `unscheduleUpdate()`
     * @zh
     * 取消指定对象定时器。
     * 如果需要取消 update 定时器，请使用 unscheduleUpdate()。
     * @param callback @en The callback to be unscheduled @zh 被取消调度的回调。
     * @param target @en The target bound to the callback. @zh 回调所绑定的目标对象。
     */
    unschedule(callback: AnyFunction, target: ISchedulable): void;
    /**
     * @en Unschedule a timer. It is invoked by CallbackTimer when a timer is finished.
     * @param timerToUnschedule The timer to be unscheduled.
     * @param target The target of the timer.
     * @engineInternal
     * @mangle
     */
    unscheduleForTimer(timerToUnschedule: CallbackTimer, target: ISchedulable): void;
    /**
     * @en Unschedule the update callback for a given target.
     * @zh 取消指定对象的 update 定时器。
     * @param target The target to be unscheduled.
     */
    unscheduleUpdate(target: ISchedulable): void;
    /**
     * @en
     * Unschedule all scheduled callbacks for a given target.
     * This also includes the "update" callback.
     * @zh 取消指定对象的所有定时器，包括 update 定时器。
     * @param target The target to be unscheduled.
     */
    unscheduleAllForTarget(target: ISchedulable): void;
    /**
     * @en
     * Unschedule all scheduled callbacks from all targets including the system callbacks.
     * You should NEVER call this method, unless you know what you are doing.
     * @zh
     * 取消所有对象的所有定时器，包括系统定时器。
     * 不要调用此函数，除非你确定你在做什么。
     */
    unscheduleAll(): void;
    /**
     * @en
     * Unschedule all callbacks from all targets with a minimum priority.
     * You should only call this with `PRIORITY_NON_SYSTEM_MIN` or higher.
     * @zh
     * 取消所有优先级的值大于指定优先级的定时器。
     * 你应该只取消优先级的值大于 PRIORITY_NON_SYSTEM_MIN 的定时器。
     * @param minPriority
     * @en The minimum priority of selector to be unscheduled.
     * Which means, all selectors which priority is higher than minPriority will be unscheduled.
     * @zh 要取消调度的选择器的最低优先级。
     * 这意味着，所有优先级高于 minPriority 的选择器将被取消调度。
     */
    unscheduleAllWithMinPriority(minPriority: number): void;
    /**
     * @en Checks whether a callback for a given target is scheduled.
     * @zh 检查指定的回调函数和回调对象组合是否存在定时器。
     * @param callback @en The callback to check. @zh 指定检测的回调。
     * @param target @en The target of the callback. @zh 回调的目标对象。
     * @returns @en True if the specified callback is invoked, false if not. @zh 返回true如果指定回调被调用, 否则返回false。
     */
    isScheduled(callback: AnyFunction, target: ISchedulable): boolean;
    /**
     * @en
     * Pause all selectors from all targets.
     * You should NEVER call this method, unless you know what you are doing.
     * @zh
     * 暂停所有对象的所有定时器。
     * 不要调用这个方法，除非你知道你正在做什么。
     */
    pauseAllTargets(): ISchedulable[];
    /**
     * @en
     * Pause all selectors from all targets with a minimum priority.
     * You should only call this with kCCPriorityNonSystemMin or higher.
     * @zh
     * 暂停所有优先级的值大于指定优先级的定时器。
     * 你应该只暂停优先级的值大于 PRIORITY_NON_SYSTEM_MIN 的定时器。
     * @param minPriority @en the minimum priority. @zn 最小优先级。
     */
    pauseAllTargetsWithMinPriority(minPriority: number): ISchedulable[];
    /**
     * @en
     * Resume selectors on a set of targets.<br/>
     * This can be useful for undoing a call to pauseAllCallbacks.
     * @zh
     * 恢复指定数组中所有对象的定时器。<br/>
     * 这个函数是 pauseAllCallbacks 的逆操作。
     * @param targetsToResume
     */
    resumeTargets(targetsToResume: ISchedulable[]): void;
    /**
     * @en
     * Pauses the target.<br/>
     * All scheduled selectors/update for a given target won't be 'ticked' until the target is resumed.<br/>
     * If the target is not present, nothing happens.
     * @zh
     * 暂停指定对象的定时器。<br/>
     * 指定对象的所有定时器都会被暂停。<br/>
     * 如果指定的对象没有定时器，什么也不会发生。
     * @param target
     */
    pauseTarget(target: ISchedulable): void;
    /**
     * @en
     * Resumes the target.<br/>
     * The 'target' will be unpaused, so all schedule selectors/update will be 'ticked' again.<br/>
     * If the target is not present, nothing happens.
     * @zh
     * 恢复指定对象的所有定时器。<br/>
     * 指定对象的所有定时器将继续工作。<br/>
     * 如果指定的对象没有定时器，什么也不会发生。
     * @param target
     */
    resumeTarget(target: ISchedulable): void;
    /**
     * @en Returns whether or not the target is paused.
     * @zh 返回指定对象的定时器是否处于暂停状态。
     * @param target
     */
    isTargetPaused(target: ISchedulable): boolean;
    private _removeHashElement;
    private _removeUpdateFromHash;
    private _priorityIn;
    private _appendIn;
}
export {};
