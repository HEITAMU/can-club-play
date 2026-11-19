import { UITransform } from '../2d/framework';
import { Size, Vec2, Vec3 } from '../core/math';
import { Event, EventMouse, EventTouch, Touch } from '../input/types';
import { EventHandler as ComponentEventHandler } from '../scene-graph/component-event-handler';
import { Node } from '../scene-graph/node';
import { TransformBit } from '../scene-graph/node-enum';
import { XrUIPressEvent } from '../xr/event/xr-event-handle';
import { ScrollBar } from './scroll-bar';
import { ViewGroup } from './view-group';
/**
 * @en
 * Enum for ScrollView event type.
 *
 * @zh
 * 滚动视图事件类型。
 */
export declare enum ScrollViewEventType {
    /**
     * @en
     * It means an invalid event type or "default empty value" of EventType.
     *
     * @zh
     * 代表无效事件, 或者EventType的默认空值。
     */
    NONE = "",
    /**
     * @en
     * The event emitted when ScrollView scroll to the top boundary of inner container.
     *
     * @zh
     * 滚动视图滚动到顶部边界事件。
     */
    SCROLL_TO_TOP = "scroll-to-top",
    /**
     * @en
     * The event emitted when ScrollView scroll to the bottom boundary of inner container.
     *
     * @zh
     * 滚动视图滚动到底部边界事件。
     */
    SCROLL_TO_BOTTOM = "scroll-to-bottom",
    /**
     * @en
     * The event emitted when ScrollView scroll to the left boundary of inner container.
     *
     * @zh
     * 滚动视图滚动到左边界事件。
     */
    SCROLL_TO_LEFT = "scroll-to-left",
    /**
     * @en
     * The event emitted when ScrollView scroll to the right boundary of inner container.
     *
     * @zh
     * 滚动视图滚动到右边界事件。
     */
    SCROLL_TO_RIGHT = "scroll-to-right",
    /**
     * @en
     * The event emitted when ScrollView scroll began.
     *
     * @zh
     * 滚动视图滚动开始时发出的事件。
     */
    SCROLL_BEGAN = "scroll-began",
    /**
     * @en
     * The event emitted when ScrollView auto scroll ended.
     *
     * @zh
     * 滚动视图滚动结束的时候发出的事件。
     */
    SCROLL_ENDED = "scroll-ended",
    /**
     * @en
     * The event emitted when ScrollView scroll to the top boundary of inner container and start bounce.
     *
     * @zh
     * 滚动视图滚动到顶部边界并且开始回弹时发出的事件。
     */
    BOUNCE_TOP = "bounce-top",
    /**
     * @en
     * The event emitted when ScrollView scroll to the bottom boundary of inner container and start bounce.
     *
     * @zh
     * 滚动视图滚动到底部边界并且开始回弹时发出的事件。
     */
    BOUNCE_BOTTOM = "bounce-bottom",
    /**
     * @en
     * The event emitted when ScrollView scroll to the left boundary of inner container and start bounce.
     *
     * @zh
     * 滚动视图滚动到左边界并且开始回弹时发出的事件。
     */
    BOUNCE_LEFT = "bounce-left",
    /**
     * @en
     * The event emitted when ScrollView scroll to the right boundary of inner container and start bounce.
     *
     * @zh
     * 滚动视图滚动到右边界并且开始回弹时发出的事件。
     */
    BOUNCE_RIGHT = "bounce-right",
    /**
     * @en
     * The event emitted when ScrollView is scrolling.
     *
     * @zh
     * 滚动视图正在滚动时发出的事件。
     */
    SCROLLING = "scrolling",
    /**
     * @en
     * The event emitted when ScrollView auto scroll ended with a threshold.
     *
     * @zh
     * 滚动视图自动滚动快要结束的时候发出的事件。
     */
    SCROLL_ENG_WITH_THRESHOLD = "scroll-ended-with-threshold",
    /**
     * @en
     * The event emitted when user release the touch.
     *
     * @zh
     * 当用户松手的时候会发出一个事件。
     */
    TOUCH_UP = "touch-up"
}
declare enum XrhoverType {
    NONE = 0,
    LEFT = 1,
    RIGHT = 2
}
/**
 * @en
 * Layout container for a view hierarchy that can be scrolled by the user,
 * allowing it to be larger than the physical display.
 *
 * @zh
 * 滚动视图组件。
 */
export declare class ScrollView extends ViewGroup {
    static EventType: typeof ScrollViewEventType;
    /**
     * @en
     * The elapse time of bouncing back. A value of 0 will bounce back immediately.
     *
     * @zh
     * 回弹持续的时间，0 表示将立即反弹。
     */
    bounceDuration: number;
    /**
     * @en
     * It determines how quickly the content stop moving. A value of 1 will stop the movement immediately.
     * A value of 0 will never stop the movement until it reaches to the boundary of scrollview.
     *
     * @zh
     * 开启惯性后，在用户停止触摸后滚动多快停止，0表示永不停止，1表示立刻停止。
     */
    brake: number;
    /**
     * @en
     * When elastic is set, the content will be bounce back when move out of boundary.
     *
     * @zh
     * 是否允许滚动内容超过边界，并在停止触摸后回弹。
     */
    elastic: boolean;
    /**
     * @en
     * When inertia is set, the content will continue to move when touch ended.
     *
     * @zh
     * 是否开启滚动惯性。
     */
    inertia: boolean;
    /**
     * @en
     * This is a reference to the UI element to be scrolled.
     *
     * @zh
     * 可滚动展示内容的节点。
     */
    get content(): Node | null;
    set content(value: Node | null);
    /**
     * @en
     * Enable horizontal scroll.
     *
     * @zh
     * 是否开启水平滚动。
     */
    horizontal: boolean;
    /**
     * @en
     * The horizontal scrollbar reference.
     * @zh
     * 水平滚动的 ScrollBar。
     */
    get horizontalScrollBar(): ScrollBar | null;
    set horizontalScrollBar(value: ScrollBar | null);
    /**
     * @en
     * Enable vertical scroll.
     *
     * @zh
     * 是否开启垂直滚动。
     */
    vertical: boolean;
    /**
     * @en
     * The vertical scrollbar reference.
     *
     * @zh
     * 垂直滚动的 ScrollBar。
     */
    get verticalScrollBar(): ScrollBar | null;
    set verticalScrollBar(value: ScrollBar | null);
    /**
     * @en
     * If cancelInnerEvents is set to true, the scroll behavior will cancel touch events on inner content nodes
     * It's set to true by default.
     *
     * @zh
     * 如果这个属性被设置为 true，那么滚动行为会取消子节点上注册的触摸事件，默认被设置为 true。<br/>
     * 注意，子节点上的 touchstart 事件仍然会触发，触点移动距离非常短的情况下 touchmove 和 touchend 也不会受影响。
     */
    cancelInnerEvents: boolean;
    /**
     * @en
     * ScrollView events callback.
     *
     * @zh
     * 滚动视图的事件回调函数。
     */
    scrollEvents: ComponentEventHandler[];
    /**
     * @en The display view in the scroll view component.
     * @zh scroll view 组件中的显示区域。
     */
    get view(): UITransform | null;
    protected _autoScrolling: boolean;
    protected _scrolling: boolean;
    protected _content: Node | null;
    protected _horizontalScrollBar: ScrollBar | null;
    protected _verticalScrollBar: ScrollBar | null;
    protected _topBoundary: number;
    protected _bottomBoundary: number;
    protected _leftBoundary: number;
    protected _rightBoundary: number;
    protected _touchMoveDisplacements: Vec3[];
    protected _touchMoveTimeDeltas: number[];
    protected _touchMovePreviousTimestamp: number;
    protected _touchMoved: boolean;
    protected _autoScrollAttenuate: boolean;
    protected _autoScrollStartPosition: Vec3;
    protected _autoScrollTargetDelta: Vec3;
    protected _autoScrollTotalTime: number;
    protected _autoScrollAccumulatedTime: number;
    protected _autoScrollCurrentlyOutOfBoundary: boolean;
    protected _autoScrollBraking: boolean;
    protected _autoScrollBrakingStartPosition: Vec3;
    protected _outOfBoundaryAmount: Vec3;
    protected _outOfBoundaryAmountDirty: boolean;
    protected _stopMouseWheel: boolean;
    protected _mouseWheelEventElapsedTime: number;
    protected _isScrollEndedWithThresholdEventFired: boolean;
    protected _scrollEventEmitMask: number;
    protected _isBouncing: boolean;
    protected _contentPos: Vec3;
    protected _deltaPos: Vec3;
    protected _deltaAmount: Vec3;
    protected _hoverIn: XrhoverType;
    constructor();
    /**
     * @en
     * Scroll the content to the bottom boundary of ScrollView.
     *
     * @zh
     * 视图内容将在规定时间内滚动到视图底部。
     *
     * @param timeInSecond
     * @en The rolling time(in seconds). If time is up, the content will slide to the bottom border. @zh 滚动时间（s）。 如果超时，内容将立即跳到底部边界。
     * @param attenuated @en Whether the rolling acceleration is attenuated(The default is true) @zh 滚动加速是否衰减，默认为 true
     * @example
     * ```ts
     * // Scroll to the bottom of the view.
     * scrollView.scrollToBottom(0.1);
     * ```
     */
    scrollToBottom(timeInSecond?: number, attenuated?: boolean): void;
    /**
     * @en
     * Scroll the content to the top boundary of ScrollView.
     *
     * @zh
     * 视图内容将在规定时间内滚动到视图顶部。
     *
     * @param timeInSecond
     * @en The rolling time(in seconds). If time is up, the content will slide to the bottom border. @zh 滚动时间（s）。 如果超时，内容将立即跳到底部边界。
     * @param attenuated @en Whether the rolling acceleration is attenuated(The default is true). @zh 滚动加速是否衰减，默认为 true
     * @example
     * ```ts
     * // Scroll to the top of the view.
     * scrollView.scrollToTop(0.1);
     * ```
     */
    scrollToTop(timeInSecond?: number, attenuated?: boolean): void;
    /**
     * @en
     * Scroll the content to the left boundary of ScrollView.
     *
     * @zh
     * 视图内容将在规定时间内滚动到视图左边。
     *
     * @param timeInSecond
     * @en The rolling time(in seconds). If time is up, the content will slide to the bottom border. @zh 滚动时间（s）。 如果超时，内容将立即跳到底部边界。
     * @param attenuated @en Whether the rolling acceleration is attenuated(The default is true). @zh 滚动加速是否衰减，默认为 true。
     * @example
     * ```ts
     * // Scroll to the left of the view.
     * scrollView.scrollToLeft(0.1);
     * ```
     */
    scrollToLeft(timeInSecond?: number, attenuated?: boolean): void;
    /**
     * @en
     * Scroll the content to the right boundary of ScrollView.
     *
     * @zh
     * 视图内容将在规定时间内滚动到视图右边。
     *
     * @param timeInSecond
     * @en The rolling time(in seconds). If time is up, the content will slide to the bottom border. @zh 滚动时间（s）。 如果超时，内容将立即跳到底部边界。
     * @param attenuated @en Whether the rolling acceleration is attenuated(The default is true). @zh 滚动加速是否衰减，默认为 true。
     * @example
     * ```ts
     * // Scroll to the right of the view.
     * scrollView.scrollToRight(0.1);
     * ```
     */
    scrollToRight(timeInSecond?: number, attenuated?: boolean): void;
    /**
     * @en
     * Scroll the content to the top left boundary of ScrollView.
     *
     * @zh
     * 视图内容将在规定时间内滚动到视图左上角。
     *
     * @param timeInSecond
     * @en The rolling time(in seconds). If time is up, the content will slide to the bottom border. @zh 滚动时间（s）。 如果超时，内容将立即跳到底部边界。
     * @param attenuated @en Whether the rolling acceleration is attenuated(The default is true). @zh 滚动加速是否衰减，默认为 true。
     * @example
     * ```ts
     * // Scroll to the upper left corner of the view.
     * scrollView.scrollToTopLeft(0.1);
     * ```
     */
    scrollToTopLeft(timeInSecond?: number, attenuated?: boolean): void;
    /**
     * @en
     * Scroll the content to the top right boundary of ScrollView.
     *
     * @zh
     * 视图内容将在规定时间内滚动到视图右上角。
     *
     * @param timeInSecond
     * @en The rolling time(in seconds). If time is up, the content will slide to the bottom border. @zh 滚动时间（s）。 如果超时，内容将立即跳到底部边界。
     * @param attenuated @en Whether the rolling acceleration is attenuated(The default is true). @zh 滚动加速是否衰减，默认为 true。
     * @example
     * ```ts
     * // Scroll to the top right corner of the view.
     * scrollView.scrollToTopRight(0.1);
     * ```
     */
    scrollToTopRight(timeInSecond?: number, attenuated?: boolean): void;
    /**
     * @en
     * Scroll the content to the bottom left boundary of ScrollView.
     *
     * @zh
     * 视图内容将在规定时间内滚动到视图左下角。
     *
     * @param timeInSecond
     * @en The rolling time(in seconds). If time is up, the content will slide to the bottom border. @zh 滚动时间（s）。 如果超时，内容将立即跳到底部边界。
     * @param attenuated @en Whether the rolling acceleration is attenuated(The default is true). @zh 滚动加速是否衰减，默认为 true。
     * @example
     * ```ts
     * // Scroll to the lower left corner of the view.
     * scrollView.scrollToBottomLeft(0.1);
     * ```
     */
    scrollToBottomLeft(timeInSecond?: number, attenuated?: boolean): void;
    /**
     * @en
     * Scroll the content to the bottom right boundary of ScrollView.
     *
     * @zh
     * 视图内容将在规定时间内滚动到视图右下角。
     *
     * @param timeInSecond
     * @en The rolling time(in seconds). If time is up, the content will slide to the bottom border. @zh 滚动时间（s）。 如果超时，内容将立即跳到底部边界。
     * @param attenuated @en Whether the rolling acceleration is attenuated(The default is true). @zh 滚动加速是否衰减，默认为 true。
     * @example
     * ```ts
     * // Scroll to the lower right corner of the view.
     * scrollView.scrollToBottomRight(0.1);
     * ```
     */
    scrollToBottomRight(timeInSecond?: number, attenuated?: boolean): void;
    /**
     * @en
     * Scroll with an offset related to the ScrollView's top left origin, if timeInSecond is omitted,
     * then it will jump to the specific offset immediately.
     *
     * @zh
     * 视图内容在规定时间内将滚动到 ScrollView 相对左上角原点的偏移位置, 如果 timeInSecond 参数不传，则立即滚动到指定偏移位置。
     *
     * @param offset
     * @en After scrolling the view, the position of the view content relative to the view window. @zh 滚动视图后，视图内容（content）相对于视图窗口（viewport）的位置。
     * @param timeInSecond
     * @en Scroll time (s). If it times out, the content immediately jumps to the specified offset. @zh 滚动时间（s）。 如果超时，内容将立即跳到指定偏移量处。
     * @param attenuated @en Whether the rolling acceleration is attenuated(The default is true). @zh 滚动加速是否衰减，默认为 true。
     * @example
     * ```ts
     * // Scroll to middle position in 0.1 second in x-axis
     * let maxScrollOffset = this.getMaxScrollOffset();
     * scrollView.scrollToOffset(new Vec2(maxScrollOffset.x / 2, 0), 0.1);
     * ```
     */
    scrollToOffset(offset: Vec2, timeInSecond?: number, attenuated?: boolean): void;
    /**
     * @en
     * Get the position of the scrolling view relative to the origin in the upper-left corner of the viewport.
     *
     * @zh
     * 获取滚动视图相对于视图窗口左上角原点的位置。
     *
     * @return @en Current rolling offset. @zh 当前滚动偏移量。
     */
    getScrollOffset(): Vec2;
    /**
     * @en
     * Get the maximize available  scroll offset.
     *
     * @zh
     * 获取滚动视图最大可以滚动的偏移量。
     *
     * @return @en Maximum scrollable offset. @zh 最大可滚动偏移量。
     */
    getMaxScrollOffset(): Vec2;
    /**
     * @en
     * Scroll the content to the horizontal percent position of ScrollView.
     *
     * @zh
     * 视图内容在规定时间内将滚动到 ScrollView 水平方向的百分比位置上。
     *
     * @param percent
     * @en Scroll to the destination which is located at the percent interpolation from left border to the right border @zh 滚动到从左到右指定百分比插值的位置
     * @param timeInSecond
     * @en Scroll time (s). If it times out, the content immediately jumps to the specified offset. @zh 滚动时间（s）。 如果超时，内容将立即跳到指定偏移量处。
     * @param attenuated @en Whether the rolling acceleration is attenuated(The default is true). @zh 滚动加速是否衰减，默认为 true。
     * @example
     * ```ts
     * // Scroll to middle position.
     * scrollView.scrollToBottomRight(0.5, 0.1);
     * ```
     */
    scrollToPercentHorizontal(percent: number, timeInSecond: number, attenuated: boolean): void;
    /**
     * @en
     * Scroll the content to the percent position of ScrollView in any direction.
     *
     * @zh
     * 视图内容在规定时间内进行垂直方向和水平方向的滚动，并且滚动到指定百分比位置上。
     *
     * @param anchor
     * @en Scroll to the destination which is located at the anchor interpolation from left/top border to the right/bottom border.
     * @zh 滚动到从左/上到右/下指定锚点对应分量插值的位置。
     * @param timeInSecond
     * @en Scroll time (s). If it times out, the content immediately jumps to the specified offset. @zh 滚动时间（s）。 如果超时，内容将立即跳到指定偏移量处。
     * @param attenuated @en Whether the rolling acceleration is attenuated(The default is true). @zh 滚动加速是否衰减，默认为 true。
     * @example
     * ```ts
     * // Vertical scroll to the bottom of the view.
     * scrollView.scrollTo(new Vec2(0, 1), 0.1);
     *
     * // Horizontal scroll to view right.
     * scrollView.scrollTo(new Vec2(1, 0), 0.1);
     * ```
     */
    scrollTo(anchor: Vec2, timeInSecond?: number, attenuated?: boolean): void;
    /**
     * @en
     * Scroll the content to the vertical percent position of ScrollView.
     *
     * @zh
     * 视图内容在规定时间内滚动到 ScrollView 垂直方向的百分比位置上。
     *
     * @param percent
     * @en Scroll to the destination which is located at the percent interpolation from top border to the bottom border. @zh 滚动到从上到下指定百分比插值的位置。
     * @param timeInSecond
     * @en Scroll time (s). If it times out, the content immediately jumps to the specified offset. @zh 滚动时间（s）。 如果超时，内容将立即跳到指定偏移量处。
     * @param attenuated @en Whether the rolling acceleration is attenuated(The default is true). @zh 滚动加速是否衰减，默认为 true。
     * @example
     * ```ts
     * scrollView.scrollToPercentVertical(0.5, 0.1);
     * ```
     */
    scrollToPercentVertical(percent: number, timeInSecond?: number, attenuated?: boolean): void;
    private _doScroll;
    /**
     * @en
     * Stop auto scroll immediately.
     *
     * @zh
     * 停止自动滚动, 调用此 API 可以让 ScrollView 立即停止滚动。
     */
    stopAutoScroll(): void;
    /**
     * @en
     * Modify the content position.
     *
     * @zh
     * 设置当前视图内容的坐标点。
     *
     * @param position @en Current content position. @zh 希望设置内容框体的位置。
     * @deprecated Since 3.1.0, setContentPosition is deprecated, please use scrollToOffset instead.
     */
    setContentPosition(position: Vec3): void;
    private _setContentPosition;
    /**
     * @en
     * Query the content's position in its parent space.
     *
     * @zh
     * 获取当前视图内容的坐标点。
     *
     * @returns @en current content position. @zh 当前视图内容的坐标点。
     * @deprecated Since 3.1.0, getContentPosition is deprecated.
     */
    getContentPosition(): Vec3;
    private _getContentPosition;
    /**
     * @en
     * Query whether the user is currently dragging the ScrollView to scroll it.
     *
     * @zh
     * 用户是否在拖拽当前滚动视图。
     *
     * @returns @en If or not the current scrolling view is being dragged.  @zh 是否在拖拽当前滚动视图。
     */
    isScrolling(): boolean;
    /**
     * @en
     * Query whether the ScrollView is currently scrolling because of a bounceback or inertia slowdown.
     *
     * @zh
     * 当前滚动视图是否在惯性滚动。
     *
     * @returns @en Whether the scrolling view is scrolling inertially.  @zh 滚动视图是否在惯性滚动。
     */
    isAutoScrolling(): boolean;
    /**
     * @en Get the minimum precision time of the end-of-scroll event.
     * @zh 获得滚动结束的事件的最小精度时间。
     * @returns @en Minimum time. @zh 最小时间。
     */
    getScrollEndedEventTiming(): number;
    start(): void;
    onEnable(): void;
    update(dt: number): void;
    onDisable(): void;
    protected _registerEvent(): void;
    protected _unregisterEvent(): void;
    protected _onMouseWheel(event: EventMouse, captureListeners?: Node[]): void;
    protected _onTouchBegan(event: EventTouch, captureListeners?: Node[]): void;
    protected _onTouchMoved(event: EventTouch, captureListeners?: Node[]): void;
    protected _onTouchEnded(event: EventTouch, captureListeners?: Node[]): void;
    protected _onTouchCancelled(event: EventTouch, captureListeners?: Node[]): void;
    protected _calculateBoundary(): void;
    protected _hasNestedViewGroup(event: Event, captureListeners?: Node[]): boolean;
    protected _startInertiaScroll(touchMoveVelocity: Vec3): void;
    protected _calculateAttenuatedFactor(distance: number): number;
    protected _startAttenuatingAutoScroll(deltaMove: Vec3, initialVelocity: Vec3): void;
    protected _calculateAutoScrollTimeByInitialSpeed(initialSpeed: number): number;
    protected _startAutoScroll(deltaMove: Vec3, timeInSecond: number, attenuated?: boolean): void;
    protected _calculateTouchMoveVelocity(): Vec3;
    protected _flattenVectorByDirection(vector: Vec3): Vec3;
    protected _moveContent(deltaMove: Vec3, canStartBounceBack?: boolean): void;
    protected _getContentLeftBoundary(): number;
    protected _getContentRightBoundary(): number;
    protected _getContentTopBoundary(): number;
    protected _getContentBottomBoundary(): number;
    protected _getHowMuchOutOfBoundary(addition?: Vec3): Vec3;
    protected _updateScrollBar(outOfBoundary: Vec2 | Readonly<Vec2>): void;
    protected _onScrollBarTouchBegan(): void;
    protected _onScrollBarTouchEnded(): void;
    protected _dispatchEvent(event: string): void;
    protected _adjustContentOutOfBoundary(): void;
    protected _hideScrollBar(): void;
    protected _updateScrollBarState(): void;
    protected _stopPropagationIfTargetIsMe(event: Event): void;
    protected _processDeltaMove(deltaMove: Vec3): void;
    protected _handleMoveLogic(touch: Touch): void;
    protected _handleReleaseLogic(touch: Touch): void;
    protected _getLocalAxisAlignDelta(out: Vec3, touch: Touch): void;
    protected _scrollChildren(deltaMove: Vec3): void;
    protected _handlePressLogic(): void;
    protected _clampDelta(out: Vec3): void;
    protected _gatherTouchMove(delta: Vec3): void;
    protected _startBounceBackIfNeeded(): boolean;
    protected _processInertiaScroll(): void;
    protected _isOutOfBoundary(): boolean;
    protected _isNecessaryAutoScrollBrake(): boolean;
    protected _processAutoScrolling(dt: any): void;
    protected _checkMouseWheel(dt: number): void;
    protected _calculateMovePercentDelta(options: any): Vec3;
    protected _moveContentToTopLeft(scrollViewSize: Size): void;
    protected _scaleChanged(value: TransformBit): void;
    protected _xrHoverEnter(event: XrUIPressEvent): void;
    protected _xrHoverExit(event: XrUIPressEvent): void;
    private _dispatchEventHandleInput;
    protected _xrThumbStickMove(event: Vec2): void;
}
export {};
