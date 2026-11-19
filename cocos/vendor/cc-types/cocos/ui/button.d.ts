import { SpriteFrame } from '../2d/assets';
import { Component, EventHandler as ComponentEventHandler } from '../scene-graph';
import { EventMouse, EventTouch } from '../input/types';
import { Color } from '../core/math';
import { Node } from '../scene-graph/node';
import { Sprite } from '../2d/components/sprite';
/**
 * @en Enum for transition type.
 *
 * @zh 过渡类型。
 */
declare enum Transition {
    /**
     * @en The none type.
     *
     * @zh 不做任何过渡。
     */
    NONE = 0,
    /**
     * @en The color type.
     *
     * @zh 颜色过渡。
     */
    COLOR = 1,
    /**
     * @en The sprite type.
     *
     * @zh 精灵过渡。
     */
    SPRITE = 2,
    /**
     * @en The scale type.
     *
     * @zh 缩放过渡。
     */
    SCALE = 3
}
declare enum State {
    NORMAL = 0,
    HOVER = 1,
    PRESSED = 2,
    DISABLED = 3
}
/**
 * @en The event types of [[Button]]. All button events are distributed by the owner Node, not the component
 * @zh [[Button]] 的事件类型，注意：事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 */
export declare enum ButtonEventType {
    /**
     * @event click
     * @param {Event.EventCustom} event
     * @param {Button} button - The Button component.
     */
    CLICK = "click"
}
/**
 * @en
 * Button component. Can be pressed or clicked. Button has 4 Transition types:
 *
 *   - Button.Transition.NONE   // Button will do nothing
 *   - Button.Transition.COLOR  // Button will change target's color
 *   - Button.Transition.SPRITE // Button will change target Sprite's sprite
 *   - Button.Transition.SCALE  // Button will change target node's scale
 *
 * The button can bind events (but you must be on the button's node to bind events).<br/>
 * The following events can be triggered on all platforms.
 *
 *  - cc.Node.EventType.TOUCH_START  // Press
 *  - cc.Node.EventType.TOUCH_MOVE   // After pressing and moving
 *  - cc.Node.EventType.TOUCH_END    // After pressing and releasing
 *  - cc.Node.EventType.TOUCH_CANCEL // Press to cancel
 *
 * The following events are only triggered on the PC platform:
 *
 *   - cc.Node.EventType.MOUSE_DOWN
 *   - cc.Node.EventType.MOUSE_MOVE
 *   - cc.Node.EventType.MOUSE_ENTER
 *   - cc.Node.EventType.MOUSE_LEAVE
 *   - cc.Node.EventType.MOUSE_UP
 *
 * The developer can get the current clicked node with `event.target` from event object which is passed as parameter
 * in the callback function of click event.
 *
 * @zh
 * 按钮组件。可以被按下，或者点击。<br>
 * 按钮可以通过修改 Transition 来设置按钮状态过渡的方式：
 *
 *   - Button.Transition.NONE   // 不做任何过渡
 *   - Button.Transition.COLOR  // 进行颜色之间过渡
 *   - Button.Transition.SPRITE // 进行精灵之间过渡
 *   - Button.Transition.SCALE // 进行缩放过渡
 *
 * 按钮可以绑定事件（但是必须要在按钮的 Node 上才能绑定事件）。<br/>
 * 以下事件可以在全平台上都触发：
 *
 *   - cc.Node.EventType.TOUCH_START  // 按下时事件
 *   - cc.Node.EventType.TOUCH_Move   // 按住移动后事件
 *   - cc.Node.EventType.TOUCH_END    // 按下后松开后事件
 *   - cc.Node.EventType.TOUCH_CANCEL // 按下取消事件
 *
 * 以下事件只在 PC 平台上触发：
 *
 *   - cc.Node.EventType.MOUSE_DOWN  // 鼠标按下时事件
 *   - cc.Node.EventType.MOUSE_MOVE  // 鼠标按住移动后事件
 *   - cc.Node.EventType.MOUSE_ENTER // 鼠标进入目标事件
 *   - cc.Node.EventType.MOUSE_LEAVE // 鼠标离开目标事件
 *   - cc.Node.EventType.MOUSE_UP    // 鼠标松开事件
 *
 * 开发者可以通过获取 **点击事件** 回调函数的参数 event 的 target 属性获取当前点击对象。
 *
 * @example
 * ```ts
 * import { log, Node } from 'cc';
 * // Add an event to the button.
 * button.node.on(Node.EventType.TOUCH_START, (event) => {
 *     log("This is a callback after the trigger event");
 * });
 * // You could also add a click event
 * // Note: In this way, you can't get the touch event info, so use it wisely.
 * button.node.on(Node.EventType.CLICK, (button) => {
 *    //The event is a custom event, you could get the Button component via first argument
 * })
 * ```
 */
export declare class Button extends Component {
    /**
     * @en
     * Transition target.<br/>
     * When Button state changed:
     * - Button.Transition.NONE   // Button will do nothing
     * - Button.Transition.COLOR  // Button will change target's color
     * - Button.Transition.SPRITE // Button will change target Sprite's sprite
     * - Button.Transition.SCALE  // Button will change target node's scale
     *
     * @zh
     * 需要过渡的目标。<br/>
     * 按钮可以通过修改 Transition 来设置按钮状态过渡的方式：
     * - Button.Transition.NONE   // 不做任何过渡
     * - Button.Transition.COLOR  // 进行颜色之间过渡
     * - Button.Transition.SPRITE // 进行 Sprite 之间的过渡
     * - Button.Transition.SCALE // 进行缩放过渡
     */
    get target(): Node;
    set target(value: Node);
    /**
     * @en
     * Whether the Button is disabled.
     * If true, the Button will trigger event and do transition.
     *
     * @zh
     * 按钮事件是否被响应，如果为 false，则按钮将被禁用。
     */
    get interactable(): boolean;
    set interactable(value: boolean);
    /**
     * @deprecated since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    set _resizeToTarget(value: boolean);
    /**
     * @en
     * Transition type.
     *
     * @zh
     * 按钮状态改变时过渡方式。
     */
    get transition(): Transition;
    set transition(value: Transition);
    /**
     * @en
     * Normal state color.
     *
     * @zh
     * 普通状态下按钮所显示的颜色。
     */
    get normalColor(): Readonly<Color>;
    set normalColor(value: Readonly<Color>);
    /**
     * @en
     * Pressed state color.
     *
     * @zh
     * 按下状态时按钮所显示的颜色。
     */
    get pressedColor(): Readonly<Color>;
    set pressedColor(value: Readonly<Color>);
    /**
     * @en
     * Hover state color.
     *
     * @zh
     * 悬停状态下按钮所显示的颜色。
     */
    get hoverColor(): Readonly<Color>;
    set hoverColor(value: Readonly<Color>);
    /**
     * @en
     * Disabled state color.
     *
     * @zh
     * 禁用状态下按钮所显示的颜色。
     */
    get disabledColor(): Readonly<Color>;
    set disabledColor(value: Readonly<Color>);
    /**
     * @en
     * Color and Scale transition duration.
     *
     * @zh
     * 颜色过渡和缩放过渡时所需时间。
     */
    get duration(): number;
    set duration(value: number);
    /**
     * @en
     * When user press the button, the button will zoom to a scale.
     * The final scale of the button equals (button original scale * zoomScale)
     * NOTE: Setting zoomScale less than 1 is not adviced, which could fire the touchCancel event
     * if the touch point is out of touch area after scaling.
     * if you need to do so, you should set target as another background node instead of the button node.
     *
     * @zh
     * 当用户点击按钮后，按钮会缩放到一个值，这个值等于 Button 原始 scale * zoomScale。
     * 注意：不建议 zoomScale 的值小于 1, 否则缩放后如果触摸点在触摸区域外, 则会触发 touchCancel 事件。
     * 如果你需要这么做，你应该把 target 设置为另一个背景节点，而不是按钮节点。
     */
    get zoomScale(): number;
    set zoomScale(value: number);
    /**
     * @en
     * Normal state sprite.
     *
     * @zh
     * 普通状态下按钮所显示的 Sprite。
     */
    get normalSprite(): SpriteFrame | null;
    set normalSprite(value: SpriteFrame | null);
    /**
     * @en
     * Pressed state sprite.
     *
     * @zh
     * 按下状态时按钮所显示的 Sprite。
     */
    get pressedSprite(): SpriteFrame | null;
    set pressedSprite(value: SpriteFrame | null);
    /**
     * @en
     * Hover state sprite.
     *
     * @zh
     * 悬停状态下按钮所显示的 Sprite。
     */
    get hoverSprite(): SpriteFrame | null;
    set hoverSprite(value: SpriteFrame | null);
    /**
     * @en
     * Disabled state sprite.
     *
     * @zh
     * 禁用状态下按钮所显示的 Sprite。
     */
    get disabledSprite(): SpriteFrame | null;
    set disabledSprite(value: SpriteFrame | null);
    /**
     * @en Enum for transition type.
     * @zh 过渡类型。
     */
    static Transition: typeof Transition;
    /**
     * @en The event types of [[Button]]. All button events are distributed by the owner Node, not the component
     * @zh [[Button]] 的事件类型，注意：事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
     */
    static EventType: typeof ButtonEventType;
    /**
     * @en
     * If Button is clicked, it will trigger event's handler.
     *
     * @zh
     * 按钮的点击事件列表。
     */
    clickEvents: ComponentEventHandler[];
    protected _interactable: boolean;
    protected _transition: Transition;
    protected _normalColor: Color;
    protected _hoverColor: Color;
    protected _pressedColor: Color;
    protected _disabledColor: Color;
    protected _normalSprite: SpriteFrame | null;
    protected _hoverSprite: SpriteFrame | null;
    protected _pressedSprite: SpriteFrame | null;
    protected _disabledSprite: SpriteFrame | null;
    protected _duration: number;
    protected _zoomScale: number;
    protected _target: Node | null;
    private _pressed;
    private _hovered;
    private _fromColor;
    private _toColor;
    private _time;
    private _transitionFinished;
    private _fromScale;
    private _toScale;
    private _originalScale;
    private _sprite;
    private _targetScale;
    constructor();
    __preload(): void;
    onEnable(): void;
    onDisable(): void;
    onDestroy(): void;
    update(dt: number): void;
    protected _resizeNodeToTargetNode(): void;
    protected _resetState(): void;
    protected _registerNodeEvent(): void;
    protected _registerTargetEvent(target: any): void;
    protected _unregisterNodeEvent(): void;
    protected _unregisterTargetEvent(target: any): void;
    protected _getTargetSprite(target: Node | null): Sprite | null;
    protected _applyTarget(): void;
    private _onTargetSpriteFrameChanged;
    private _setCurrentStateSpriteFrame;
    private _onTargetColorChanged;
    private _setCurrentStateColor;
    private _onTargetTransformChanged;
    protected _onTouchBegan(event?: EventTouch): void;
    protected _onTouchMove(event?: EventTouch): void;
    protected _onTouchEnded(event?: EventTouch): void;
    protected _onTouchCancel(event?: EventTouch): void;
    protected _onMouseMoveIn(event?: EventMouse): void;
    protected _onMouseMoveOut(event?: EventMouse): void;
    protected _updateState(): void;
    protected _getButtonState(): State;
    protected _updateColorTransition(state: State): void;
    protected _updateSpriteTransition(state: State): void;
    protected _updateScaleTransition(state: State): void;
    protected _zoomUp(): void;
    protected _zoomBack(): void;
    protected _applyTransition(state: State): void;
    private _getSpriteFrameByState;
    private _getColorByState;
    private _xrHoverEnter;
    private _xrHoverExit;
    private _xrClick;
    private _xrUnClick;
}
export {};
