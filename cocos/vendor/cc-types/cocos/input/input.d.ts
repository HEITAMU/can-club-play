/// <reference types="./@types/globals" />
import { Event, EventAcceleration, EventGamepad, EventHandle, EventHandheld, EventHMD, EventKeyboard, EventMouse, EventTouch, Touch } from './types';
import { InputEventType } from './types/event-enum';
export declare enum EventDispatcherPriority {
    GLOBAL = 0,
    UI = 1
}
export interface IEventDispatcher {
    /**
     * Priority to emit event to dispatcher
     */
    readonly priority: EventDispatcherPriority;
    /**
     * @param event
     * @returns Whether dispatch to next event dispatcher
     */
    dispatchEvent(event: Event): boolean;
    onThrowException(): void;
}
export declare namespace Input {
    type EventType = EnumAlias<typeof InputEventType>;
}
interface InputEventMap {
    [InputEventType.MOUSE_DOWN]: (event: EventMouse) => void;
    [InputEventType.MOUSE_MOVE]: (event: EventMouse) => void;
    [InputEventType.MOUSE_UP]: (event: EventMouse) => void;
    [InputEventType.MOUSE_WHEEL]: (event: EventMouse) => void;
    [InputEventType.TOUCH_START]: (event: EventTouch) => void;
    [InputEventType.TOUCH_MOVE]: (event: EventTouch) => void;
    [InputEventType.TOUCH_END]: (event: EventTouch) => void;
    [InputEventType.TOUCH_CANCEL]: (event: EventTouch) => void;
    [InputEventType.KEY_DOWN]: (event: EventKeyboard) => void;
    [InputEventType.KEY_PRESSING]: (event: EventKeyboard) => void;
    [InputEventType.KEY_UP]: (event: EventKeyboard) => void;
    [InputEventType.DEVICEMOTION]: (event: EventAcceleration) => void;
    [InputEventType.GAMEPAD_CHANGE]: (event: EventGamepad) => void;
    [InputEventType.GAMEPAD_INPUT]: (event: EventGamepad) => void;
    [InputEventType.HANDLE_INPUT]: (event: EventHandle) => void;
    [InputEventType.HANDLE_POSE_INPUT]: (event: EventHandle) => void;
    [InputEventType.HMD_POSE_INPUT]: (event: EventHMD) => void;
    [InputEventType.HANDHELD_POSE_INPUT]: (event: EventHandheld) => void;
}
/**
 * @en
 * This Input class manages all events of input. include: touch, mouse, accelerometer, gamepad, handle, hmd and keyboard.
 * You can get the `Input` instance with `input`.
 *
 * @zh
 * 该输入类管理所有的输入事件，包括：触摸、鼠标、加速计、游戏手柄、6DOF手柄、头戴显示器 和 键盘。
 * 你可以通过 `input` 获取到 `Input` 的实例。
 *
 * @example
 * ```
 * input.on(InputEventType.DEVICEMOTION, this.onDeviceMotionEvent, this);
 * input.off(InputEventType.DEVICEMOTION, this.onDeviceMotionEvent, this);
 * ```
 */
export declare class Input {
    /**
     * @en The input event type
     * @zh 输入事件类型
     */
    static EventType: typeof InputEventType;
    private _eventTarget;
    private _touchInput;
    private _mouseInput;
    private _keyboardInput;
    private _accelerometerInput;
    private _handleInput;
    private _hmdInput;
    private _handheldInput;
    private _eventKeyboardList;
    private _eventAccelerationList;
    private _eventGamepadList;
    private _eventHandleList;
    private _eventHMDList;
    private _eventHandheldList;
    private _needSimulateTouchMoveEvent;
    private _inputEventDispatcher;
    private _eventDispatcherList;
    constructor();
    /**
     * This should be a private method, but it's exposed for Editor Only.
     */
    private _dispatchMouseDownEvent;
    /**
     * This should be a private method, but it's exposed for Editor Only.
     */
    private _dispatchMouseMoveEvent;
    /**
     * This should be a private method, but it's exposed for Editor Only.
     */
    private _dispatchMouseUpEvent;
    /**
     * This should be a private method, but it's exposed for Editor Only.
     */
    private _dispatchMouseScrollEvent;
    /**
     * This should be a private method, but it's exposed for Editor Only.
     */
    private _dispatchKeyboardDownEvent;
    /**
     * This should be a private method, but it's exposed for Editor Only.
     */
    private _dispatchKeyboardUpEvent;
    /**
     * @en
     * Register a callback of a specific input event type.
     * @zh
     * 注册特定的输入事件回调。
     *
     * @param eventType - The event type
     * @param callback - The event listener's callback
     * @param target - The event listener's target and callee
     */
    on<K extends keyof InputEventMap>(eventType: K, callback: InputEventMap[K], target?: any): InputEventMap[K];
    /**
     * @en
     * Register a callback of a specific input event type once.
     * @zh
     * 注册单次的输入事件回调。
     *
     * @param eventType - The event type
     * @param callback - The event listener's callback
     * @param target - The event listener's target and callee
     */
    once<K extends keyof InputEventMap>(eventType: K, callback: InputEventMap[K], target?: any): InputEventMap[K];
    /**
     * @en
     * Unregister a callback of a specific input event type.
     * @zh
     * 取消注册特定的输入事件回调。
     *
     * @param eventType - The event type
     * @param callback - The event listener's callback
     * @param target - The event listener's target and callee
     */
    off<K extends keyof InputEventMap>(eventType: K, callback?: InputEventMap[K], target?: any): void;
    /**
     * @en
     * Get touch object by touch ID.
     * @zh
     * 通过 touch ID 获取 touch对象。
     */
    getTouch(touchID: number): Readonly<Touch> | undefined;
    /**
     * @en
     * Get all the current touches objects as array.
     * @zh
     * 获取当前 所有touch对象 的数组。
     */
    getAllTouches(): Touch[];
    /**
     * @en
     * Get the number of touches.
     * @zh
     * 获取当前 touch 对象的数量。
     */
    getTouchCount(): number;
    /**
     * @en
     * Sets whether to enable the accelerometer event listener or not.
     *
     * @zh
     * 是否启用加速度计事件。
     */
    setAccelerometerEnabled(isEnable: boolean): void;
    /**
     * @en
     * Sets the accelerometer interval value.
     *
     * @zh
     * 设置加速度计间隔值。
     */
    setAccelerometerInterval(intervalInMileSeconds: number): void;
    private _simulateEventTouch;
    /**
     * @engineInternal
     */
    _registerEventDispatcher(eventDispatcher: IEventDispatcher): void;
    private _emitEvent;
    private _registerEvent;
    /**
     * @engineInternal
     */
    _clearEvents(): void;
    private _dispatchOrPushEvent;
    private _dispatchEventMouse;
    private _dispatchEventTouch;
    /**
     * @engineInternal
     */
    _frameDispatchEvents(): void;
}
/**
 * @en
 * The singleton of the Input class, this singleton manages all events of input. include: touch, mouse, accelerometer, gamepad, handle, hmd and keyboard.
 *
 * @zh
 * 输入类单例，该单例管理所有的输入事件，包括：触摸、鼠标、加速计、游戏手柄、6DOF手柄、头戴显示器 和 键盘。
 *
 * @example
 * ```
 * input.on(InputEventType.DEVICEMOTION, this.onDeviceMotionEvent, this);
 * input.off(InputEventType.DEVICEMOTION, this.onDeviceMotionEvent, this);
 * ```
 */
export declare const input: Input;
export {};
