import { Vec3 } from '../../core/math';
import { Event } from '../../input/types';
export declare enum DeviceType {
    Other = 0,
    Left = 1,
    Right = 2
}
/**
 * @en Xr 3DUI event type
 * @zh xr的3DUI事件类型
 */
export declare enum XrUIPressEventType {
    XRUI_HOVER_ENTERED = "xrui-hover-entered",
    XRUI_HOVER_EXITED = "xrui-hover-exited",
    XRUI_HOVER_STAY = "xrui-hover-stay",
    XRUI_CLICK = "xrui-click",
    XRUI_UNCLICK = "xrui-unclick"
}
/**
 * @en Xr Keyboard event type
 * @zh xr的虚拟键盘事件类型
 */
export declare enum XrKeyboardEventType {
    /**
     * @en
     * The event type for XR keyboard case switching event
     *
     * @zh
     * XR键盘大小写切换事件
     */
    XR_CAPS_LOCK = "xr-caps-lock",
    /**
     * @en
     * The event type for XR keyboard initialization event
     *
     * @zh
     * XR键盘初始化事件
     */
    XR_KEYBOARD_INIT = "xr-keyboard-init",
    /**
    * @en
    * The event type for XR keyboard input event
    *
    * @zh
    * XR键盘input事件
    */
    XR_KEYBOARD_INPUT = "xr-keyboard-input",
    /**
    * @en
    * The event type for XR keyboard to latin
    *
    * @zh
    * 转latin
    */
    TO_LATIN = "to-latin",
    /**
    * @en
    * The event type for XR keyboard to symbol
    *
    * @zh
    * 转symbol
    */
    TO_SYMBOL = "to-symbol",
    /**
    * @en
    * The event type for XR keyboard to math_symbol
    *
    * @zh
    * 转math_symbol
    */
    TO_MATH_SYMBOL = "to-math-symbol"
}
/**
 * @en Xr 3DUI event.
 *
 * @zh xr的3DUI事件。
 */
export declare class XrUIPressEvent extends Event {
    /**
     * @en Event trigger
     * @zh 事件触发者（左右手柄等）
     */
    deviceType: DeviceType;
    /**
     * @en Collision detection point
     * @zh 碰撞检测点
     */
    hitPoint: Vec3;
}
