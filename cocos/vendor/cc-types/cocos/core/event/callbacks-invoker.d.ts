/// <reference types="./@types/globals" />
declare class CallbackInfo {
    callback: AnyFunction;
    target: unknown;
    once: boolean;
    constructor();
    set(callback: AnyFunction, target?: unknown, once?: boolean): void;
    reset(): void;
    check(): boolean;
}
/**
 * @zh 事件监听器列表的简单封装。
 * @en A simple list of event callbacks
 */
export declare class CallbackList {
    callbackInfos: Array<CallbackInfo | null>;
    isInvoking: boolean;
    containCanceled: boolean;
    constructor();
    /**
     * @zh 从列表中移除与指定目标相同回调函数的事件。
     * @en Remove the event listeners with the given callback from the list
     *
     * @param cb - The callback to be removed
     */
    removeByCallback(cb: AnyFunction): void;
    /**
     * @zh 从列表中移除与指定目标相同调用者的事件。
     * @en Remove the event listeners with the given target from the list
     * @param target
     */
    removeByTarget(target: unknown): void;
    /**
     * @zh 移除指定编号事件。
     * @en Remove the event listener at the given index
     * @param index
     */
    cancel(index: number): void;
    /**
     * @zh 注销所有事件。
     * @en Cancel all event listeners
     */
    cancelAll(): void;
    /**
     * @zh 立即删除所有取消的回调。（在移除过程中会更加紧凑的排列数组）
     * @en Delete all canceled callbacks and compact array
     */
    purgeCanceled(): void;
    /**
     * @zh 清除并重置所有数据。
     * @en Clear all data
     */
    clear(): void;
}
export interface ICallbackTable {
    [x: string]: CallbackList | undefined;
}
type EventType = string | number;
/**
 * @zh CallbacksInvoker 用来根据事件名（Key）管理事件监听器列表并调用回调方法。
 * @en CallbacksInvoker is used to manager and invoke event listeners with different event keys,
 * each key is mapped to a CallbackList.
 * @engineInternal
 */
export declare class CallbacksInvoker<EventTypeClass extends EventType = EventType> {
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _callbackTable: ICallbackTable;
    private _offCallback?;
    constructor();
    /**
     * @zh 向一个事件名注册一个新的事件监听器，包含回调函数和调用者
     * @en Register an event listener to a given event key with callback and target.
     *
     * @param key - Event type
     * @param callback - Callback function when event triggered
     * @param target - Callback callee
     * @param once - Whether invoke the callback only once (and remove it)
     */
    on(key: EventTypeClass, callback: AnyFunction, target?: unknown, once?: boolean): AnyFunction;
    /**
     * @zh 检查指定事件是否已注册回调。
     * @en Checks whether there is correspond event listener registered on the given event
     * @param key - Event type
     * @param callback - Callback function when event triggered
     * @param target - Callback callee
     */
    hasEventListener(key: EventTypeClass, callback?: AnyFunction, target?: unknown): boolean;
    /**
     * @zh 移除在特定事件类型中注册的所有回调或在某个目标中注册的所有回调。
     * @en Removes all callbacks registered in a certain event type or all callbacks registered with a certain target
     * @param keyOrTarget - The event type or target with which the listeners will be removed
     */
    removeAll(keyOrTarget: unknown): void;
    /**
     * @zh 删除以指定事件，回调函数，目标注册的回调。
     * @en Remove event listeners registered with the given event key, callback and target
     * @param key - Event type
     * @param callback - The callback function of the event listener, if absent all event listeners for the given type will be removed
     * @param target - The callback callee of the event listener
     */
    off(key: EventTypeClass, callback?: AnyFunction, target?: unknown): void;
    /**
     * @zh 派发一个指定事件，并传递需要的参数
     * @en Trigger an event directly with the event name and necessary arguments.
     * @param key - event type
     * @param arg0 - The first argument to be passed to the callback
     * @param arg1 - The second argument to be passed to the callback
     * @param arg2 - The third argument to be passed to the callback
     * @param arg3 - The fourth argument to be passed to the callback
     * @param arg4 - The fifth argument to be passed to the callback
     */
    emit(key: EventTypeClass, arg0?: any, arg1?: any, arg2?: any, arg3?: any, arg4?: any): void;
    /**
     * 移除所有回调。
     */
    clear(): void;
    /**
     * @engineInternal
     * @mangle
     */
    _registerOffCallback(cb: () => void): void;
}
export {};
