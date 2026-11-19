import { Component, EventHandler } from '../scene-graph';
import { EventTouch, Touch } from '../input/types';
import { Vec3 } from '../core/math';
import { Sprite } from '../2d/components/sprite';
import { XrUIPressEvent } from '../xr/event/xr-event-handle';
/**
 * @en
 * The Slider Direction.
 *
 * @zh
 * 滑动器方向。
 */
declare enum Direction {
    /**
     * @en
     * The horizontal direction.
     *
     * @zh
     * 水平方向。
     */
    Horizontal = 0,
    /**
     * @en
     * The vertical direction.
     *
     * @zh
     * 垂直方向。
     */
    Vertical = 1
}
/**
 * @en
 * The Slider Control.
 *
 * @zh
 * 滑动器组件。
 */
export declare class Slider extends Component {
    /**
     * @en
     * The "handle" part of the slider.
     *
     * @zh
     * 滑动器滑块按钮部件。
     */
    get handle(): Sprite | null;
    set handle(value: Sprite | null);
    /**
     * @en
     * The slider direction.
     *
     * @zh
     * 滑动器方向。
     */
    get direction(): number;
    set direction(value: number);
    /**
     * @en
     * The current progress of the slider. The valid value is between 0-1.
     *
     * @zh
     * 当前进度值，该数值的区间是 0-1 之间。
     */
    get progress(): number;
    set progress(value: number);
    static Direction: typeof Direction;
    /**
     * @en
     * The slider slide events' callback array.
     *
     * @zh
     * 滑动器组件滑动事件回调函数数组。
     */
    slideEvents: EventHandler[];
    private _handle;
    private _direction;
    private _progress;
    private _offset;
    private _dragging;
    private _touchHandle;
    private _handleLocalPos;
    private _touchPos;
    constructor();
    __preload(): void;
    onEnable(): void;
    onDisable(): void;
    protected _onHandleDragStart(event?: EventTouch): void;
    protected _onTouchBegan(event?: EventTouch): void;
    protected _onTouchMoved(event?: EventTouch): void;
    protected _onTouchEnded(event?: EventTouch): void;
    protected _onTouchCancelled(event?: EventTouch): void;
    protected _handleSliderLogic(touch: Touch | null): void;
    protected _emitSlideEvent(): void;
    protected _updateProgress(touch: Touch | null): void;
    protected _updateHandlePosition(): void;
    private _changeLayout;
    protected _xrHandleProgress(point: Vec3): void;
    protected _xrClick(event: XrUIPressEvent): void;
    protected _xrUnClick(): void;
    protected _xrHoverStay(event: XrUIPressEvent): void;
}
export {};
