import { EventHandler as ComponentEventHandler, Node } from '../scene-graph';
import { EventTouch } from '../input/types';
import { Vec2, Vec3 } from '../core/math';
import { PageViewIndicator } from './page-view-indicator';
import { ScrollView, ScrollViewEventType as ScrollEventType } from './scroll-view';
import { ScrollBar } from './scroll-bar';
/**
 * @en Enum for Page View Size Mode.
 *
 * @zh 页面视图每个页面统一的大小类型。
 */
declare enum SizeMode {
    /**
     * @en Each page is unified in size.
     * @zh 每个页面统一大小。
     */
    Unified = 0,
    /**
     * @en Each page is in free size.
     * @zh 每个页面大小随意。
     */
    Free = 1
}
/**
 * @en Enum for Page View Direction.
 *
 * @zh 页面视图滚动类型。
 */
declare enum PageViewDirection {
    /**
     * @en Horizontal scroll.
     * @zh 水平滚动。
     */
    HORIZONTAL = 0,
    /**
     * @en Vertical scroll.
     * @zh 垂直滚动。
     */
    VERTICAL = 1
}
/**
 * @en Enum for ScrollView event type.
 *
 * @zh 滚动视图事件类型。
 */
declare enum PageViewEventType {
    PAGE_TURNING = "page-turning"
}
/**
 * @en
 * The PageView control.
 *
 * @zh
 * 页面视图组件。
 */
export declare class PageView extends ScrollView {
    /**
     * @en
     * Specify the size type of each page in PageView.
     *
     * @zh
     * 页面视图中每个页面大小类型。
     */
    get sizeMode(): SizeMode;
    set sizeMode(value: SizeMode);
    /**
     * @en
     * The page view direction.
     *
     * @zh
     * 页面视图滚动类型。
     */
    get direction(): PageViewDirection;
    set direction(value: PageViewDirection);
    /**
     * @en
     * The scroll threshold value, when drag exceeds this value,
     * release the next page will automatically scroll, less than the restore.
     *
     * @zh
     * 滚动临界值，默认单位百分比，当拖拽超出该数值时，松开会自动滚动下一页，小于时则还原。
     */
    get scrollThreshold(): number;
    set scrollThreshold(value: number);
    /**
     * @en
     * Change the PageTurning event timing of PageView.
     *
     * @zh
     * 设置 PageView PageTurning 事件的发送时机。
     */
    get pageTurningEventTiming(): number;
    set pageTurningEventTiming(value: number);
    /**
     * @en
     * The Page View Indicator.
     *
     * @zh
     * 页面视图指示器组件。
     */
    get indicator(): PageViewIndicator | null;
    set indicator(value: PageViewIndicator | null);
    get curPageIdx(): number;
    /**
     * @en Enum for Page View Size Mode.
     * @zh 页面视图每个页面统一的大小类型。
     */
    static SizeMode: typeof SizeMode;
    /**
     * @en Enum for Page View Direction.
     * @zh 页面视图滚动类型。
     */
    static Direction: typeof PageViewDirection;
    /**
     * @en Enum for Page View event.
     * @zh 页面视图事件枚举
     */
    static EventType: typeof PageViewEventType & typeof ScrollEventType;
    /**
     * @en
     * Auto page turning velocity threshold. When users swipe the PageView quickly,
     * it will calculate a velocity based on the scroll distance and time,
     * if the calculated velocity is larger than the threshold, then it will trigger page turning.
     *
     * @zh
     * 快速滑动翻页临界值。
     * 当用户快速滑动时，会根据滑动开始和结束的距离与时间计算出一个速度值，
     * 该值与此临界值相比较，如果大于临界值，则进行自动翻页。
     */
    autoPageTurningThreshold: number;
    /**
     * @en
     * The vertical scrollbar reference.
     * @zh
     * 垂直滚动的 ScrollBar。
     */
    get verticalScrollBar(): ScrollBar | null;
    set verticalScrollBar(value: ScrollBar | null);
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
     * Enable horizontal scroll.
     * @zh
     * 是否开启水平滚动。
     */
    horizontal: boolean;
    /**
     * @en
     * Enable vertical scroll.
     * @zh
     * 是否开启垂直滚动。
     */
    vertical: boolean;
    /**
     * @en
     * If cancelInnerEvents is set to true, the scroll behavior will cancel touch events on inner content nodes
     * It's set to true by default.
     * @zh
     * 如果这个属性被设置为 true，那么滚动行为会取消子节点上注册的触摸事件，默认被设置为 true。<br/>
     * 注意，子节点上的 touchstart 事件仍然会触发，触点移动距离非常短的情况下 touchmove 和 touchend 也不会受影响。
     */
    cancelInnerEvents: boolean;
    /**
     * @en
     * ScrollView events callback.
     * @zh
     * 滚动视图的事件回调函数。
     */
    scrollEvents: ComponentEventHandler[];
    /**
     * @en The time required to turn over a page, unit: second.
     * @zh 每个页面翻页时所需时间，单位：秒。
     */
    pageTurningSpeed: number;
    /**
     * @en PageView events callback.
     * @zh 滚动视图的事件回调函数。
     */
    pageEvents: ComponentEventHandler[];
    protected _sizeMode: SizeMode;
    protected _direction: PageViewDirection;
    protected _scrollThreshold: number;
    protected _pageTurningEventTiming: number;
    protected _indicator: PageViewIndicator | null;
    protected _curPageIdx: number;
    protected _lastPageIdx: number;
    protected _pages: Node[];
    protected _initContentPos: Vec3;
    protected _scrollCenterOffsetX: number[];
    protected _scrollCenterOffsetY: number[];
    protected _touchBeganPosition: Vec2;
    protected _touchEndPosition: Vec2;
    constructor();
    onEnable(): void;
    onDisable(): void;
    onLoad(): void;
    /**
     * @en
     * Returns current page index.
     *
     * @zh
     * 返回当前页面索引。
     *
     * @returns @en Current page index of this page view. @zh 当前页面索引。
     */
    getCurrentPageIndex(): number;
    /**
     * @en
     * Set current page index.
     *
     * @zh
     * 设置当前页面索引。
     * @param index @en The page index to scroll to. @zh 需要滚动到的页面索引。
     */
    setCurrentPageIndex(index: number): void;
    /**
     * @en
     * Returns all pages of pageview.
     *
     * @zh
     * 返回视图中的所有页面。
     *
     * @returns @en return all pages of this page view. @zh 返回当前视图所有页面。
     */
    getPages(): Node[];
    /**
     * @en
     * At the end of the current page view to insert a new view.
     *
     * @zh
     * 在当前页面视图的尾部插入一个新视图。
     *
     * @param page @en New page to add to this page view. @zh 新加入的视图。
     */
    addPage(page: Node): void;
    /**
     * @en
     * Inserts a page in the specified location.
     *
     * @zh
     * 将页面插入指定位置中。
     *
     * @param page @en New page to insert to this page view. @zh 新插入的视图。
     * @param index @en The index of new page to be inserted. @zh 新插入视图的索引。
     */
    insertPage(page: Node, index: number): void;
    /**
     * @en
     * Removes a page from PageView.
     *
     * @zh
     * 移除指定页面。
     *
     * @param page @en The page to be removed. @zh 将被移除的页面。
     */
    removePage(page: Node): void;
    /**
     * @en
     * Removes a page at index of PageView.
     *
     * @zh
     * 移除指定下标的页面。
     *
     * @param index @en The index of the page to be removed. @zh 将被移除界面的页面下标。
     */
    removePageAtIndex(index: number): void;
    /**
     * @en
     * Removes all pages from PageView.
     *
     * @zh
     * 移除所有页面。
     */
    removeAllPages(): void;
    /**
     * @en
     * Scroll PageView to index.
     *
     * @zh
     * 滚动到指定页面
     *
     * @param idx @en The index of page to be scroll to. @zh 希望滚动到的页面下标。
     * @param timeInSecond @en How long time to scroll to the page, in seconds. @zh 滚动到指定页面所需时间，单位：秒。
     */
    scrollToPage(idx: number, timeInSecond?: number): void;
    getScrollEndedEventTiming(): number;
    protected _updatePageView(): void;
    protected _updateAllPagesSize(): void;
    protected _handleReleaseLogic(): void;
    protected _onTouchBegan(event: EventTouch, captureListeners: Node[]): void;
    protected _onTouchMoved(event: EventTouch, captureListeners: Node[]): void;
    protected _onTouchEnded(event: EventTouch, captureListeners: Node[]): void;
    protected _onTouchCancelled(event: EventTouch, captureListeners: Node[]): void;
    protected _onMouseWheel(): void;
    protected _syncScrollDirection(): void;
    protected _syncSizeMode(): void;
    protected _initPages(): void;
    protected _dispatchPageTurningEvent(): void;
    protected _isQuicklyScrollable(touchMoveVelocity: Vec3): boolean;
    protected _moveOffsetValue(idx: number): Vec2;
    protected _getDragDirection(moveOffset: Vec2): number;
    protected _isScrollable(offset: Vec2, index: number, nextIndex: number): boolean;
    protected _autoScrollToPage(): void;
}
export {};
