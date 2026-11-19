import { Event } from './event';
import { SystemEventTypeUnion } from '../event-enum';
import { KeyCode } from '../key-code';
/**
 * @en
 * The keyboard event.
 * @zh
 * 键盘事件。
 */
export declare class EventKeyboard extends Event {
    /**
     * @en The unique ID of window which triggered the event.
     * @zh 触发键盘事件的窗口 ID
     */
    windowId: number;
    /**
     * @en The KeyCode enum value of current keyboard event.
     * @zh 当前键盘事件的 KeyCode 枚举值
     */
    keyCode: KeyCode;
    /**
     * @en Raw DOM KeyboardEvent.
     * @zh 原始 DOM KeyboardEvent 事件对象
     *
     * @deprecated since v3.3, can't access rawEvent anymore
     */
    rawEvent?: KeyboardEvent;
    private _isPressed;
    /**
     * @en Indicates whether the current key is being pressed
     * @zh 表示当前按键是否正在被按下
     */
    get isPressed(): boolean;
    /**
     * @param keyCode - The key code of the current key or the DOM KeyboardEvent
     * @param isPressed - Indicates whether the current key is being pressed, this is the DEPRECATED parameter.
     * @param bubbles - Indicates whether the event bubbles up through the hierarchy or not.
     */
    constructor(keyCode: number | KeyboardEvent, isPressed: boolean, bubbles?: boolean);
    /**
     * @param keyCode - The key code of the current key or the DOM KeyboardEvent
     * @param eventType - The type of the event
     * @param bubbles - Indicates whether the event bubbles up through the hierarchy or not.
     */
    constructor(keyCode: KeyCode | KeyboardEvent, eventType: SystemEventTypeUnion, bubbles?: boolean);
}
