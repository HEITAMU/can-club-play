/// <reference types="./@types/globals" />
import { EventTarget } from '../core';
import { EventAcceleration, EventKeyboard, EventMouse, EventTouch, SystemEventType, Touch } from './types';
export declare namespace SystemEvent {
    /**
     * @en The event type supported by SystemEvent and Node events
     * @zh SystemEvent 支持的事件类型以及节点事件类型
     */
    type EventType = EnumAlias<typeof SystemEventType>;
}
interface SystemEventMap {
    [SystemEvent.EventType.MOUSE_DOWN]: (event: EventMouse) => void;
    [SystemEvent.EventType.MOUSE_MOVE]: (event: EventMouse) => void;
    [SystemEvent.EventType.MOUSE_UP]: (event: EventMouse) => void;
    [SystemEvent.EventType.MOUSE_WHEEL]: (event: EventMouse) => void;
    [SystemEvent.EventType.TOUCH_START]: (touch: Touch, event: EventTouch) => void;
    [SystemEvent.EventType.TOUCH_MOVE]: (touch: Touch, event: EventTouch) => void;
    [SystemEvent.EventType.TOUCH_END]: (touch: Touch, event: EventTouch) => void;
    [SystemEvent.EventType.TOUCH_CANCEL]: (touch: Touch, event: EventTouch) => void;
    [SystemEvent.EventType.KEY_DOWN]: (event: EventKeyboard) => void;
    [SystemEvent.EventType.KEY_UP]: (event: EventKeyboard) => void;
    [SystemEvent.EventType.DEVICEMOTION]: (event: EventAcceleration) => void;
}
/**
 * @en
 * The System event, it currently supports keyboard events and accelerometer events.<br/>
 * You can get the `SystemEvent` instance with `systemEvent`.<br/>
 * @zh
 * 系统事件，它目前支持按键事件和重力感应事件。<br/>
 * 你可以通过 `systemEvent` 获取到 `SystemEvent` 的实例。<br/>
 *
 * @deprecated since v3.4.0, please use Input class instead.
 *
 * @example
 * ```
 * import { systemEvent, SystemEvent } from 'cc';
 * systemEvent.on(SystemEvent.EventType.DEVICEMOTION, this.onDeviceMotionEvent, this);
 * systemEvent.off(SystemEvent.EventType.DEVICEMOTION, this.onDeviceMotionEvent, this);
 * ```
 */
export declare class SystemEvent extends EventTarget {
    static EventType: typeof SystemEventType;
    constructor();
    /**
     * @en
     * Sets whether to enable the accelerometer event listener or not.
     *
     * @zh
     * 是否启用加速度计事件。
     */
    setAccelerometerEnabled(isEnabled: boolean): void;
    /**
     * @en
     * Sets the accelerometer interval value.
     *
     * @zh
     * 设置加速度计间隔值。
     */
    setAccelerometerInterval(interval: number): void;
    /**
     * @en
     * Register an callback of a specific system event type.
     * @zh
     * 注册特定事件类型回调。
     *
     * @param type - The event type
     * @param callback - The event listener's callback
     * @param target - The event listener's target and callee
     * @param once - Register the event listener once
     */
    on<TFunction extends (...any: any[]) => void>(type: string, callback: TFunction, target?: unknown, once?: boolean): TFunction;
    /**
     * @en
     * Removes the listeners previously registered with the same type, callback, target and or useCapture,
     * if only type is passed as parameter, all listeners registered with that type will be removed.
     * @zh
     * 删除之前用同类型，回调，目标或 useCapture 注册的事件监听器，如果只传递 type，将会删除 type 类型的所有事件监听器。
     *
     * @param type - A string representing the event type being removed.
     * @param callback - The callback to remove.
     * @param target - The target (this object) to invoke the callback, if it's not given, only callback without target will be removed
     */
    off<K extends keyof SystemEventMap>(type: K, callback?: SystemEventMap[K], target?: any): void;
}
/**
 * @module cc
 */
/**
 * @en The singleton of the SystemEvent, there should only be one instance to be used globally
 * @zh 系统事件单例，方便全局使用。
 *
 * @deprecated since v3.4.0, please use input instead.
 */
export declare const systemEvent: SystemEvent;
export {};
