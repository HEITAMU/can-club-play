import { EventHandler as ComponentEventHandler } from '../scene-graph/component-event-handler';
import { Sprite } from '../2d/components/sprite';
import { ToggleContainer } from './toggle-container';
import { ButtonEventType, Button } from './button';
declare enum ToggleEventType {
    TOGGLE = "toggle"
}
/**
 * @en
 * The toggle component is a CheckBox, when it used together with a ToggleGroup,
 * it could be treated as a RadioButton.
 *
 * @zh
 * Toggle 是一个 CheckBox，当它和 ToggleGroup 一起使用的时候，可以变成 RadioButton。
 */
export declare class Toggle extends Button {
    /**
     * @en
     * When this value is true, the check mark component will be enabled,
     * otherwise the check mark component will be disabled.
     *
     * @zh
     * 如果这个设置为 true，则 check mark 组件会处于 enabled 状态，否则处于 disabled 状态。
     */
    get isChecked(): boolean;
    set isChecked(value: boolean);
    /**
     * @en
     * The image used for the checkmark.
     *
     * @zh
     * Toggle 处于选中状态时显示的图片。
     */
    get checkMark(): Sprite | null;
    set checkMark(value: Sprite | null);
    /**
     * @deprecated since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    set _resizeToTarget(value: boolean);
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    get _toggleContainer(): ToggleContainer | null;
    /**
     * @en Enum for toggle event.
     * @zh toggle 事件枚举。
     */
    static EventType: typeof ToggleEventType & typeof ButtonEventType;
    /**
     * @en
     * If Toggle is clicked, it will trigger event's handler.
     *
     * @zh
     * Toggle 按钮的点击事件列表。
     */
    checkEvents: ComponentEventHandler[];
    protected _isChecked: boolean;
    protected _checkMark: Sprite | null;
    constructor();
    protected _internalToggle(): void;
    protected _set(value: boolean, emitEvent?: boolean): void;
    /**
     * @deprecated since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    playEffect(): void;
    /**
     * @en
     * Set isChecked without invoking checkEvents.
     *
     * @zh
     * 设置 isChecked 而不调用 checkEvents 回调。
     *
     * @param value @en Whether this toggle is pressed. @zh 是否被按下。
     */
    setIsCheckedWithoutNotify(value: boolean): void;
    onEnable(): void;
    onDisable(): void;
    protected _emitToggleEvents(): void;
}
export {};
