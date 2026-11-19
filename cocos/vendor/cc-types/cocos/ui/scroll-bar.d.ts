import { Component } from '../scene-graph/component';
import { Size, Vec2, Vec3 } from '../core/math';
import { ScrollView } from './scroll-view';
import { Sprite } from '../2d/components/sprite';
import { Node } from '../scene-graph';
/**
 * @en
 * Enum for ScrollBar direction.
 *
 * @zh
 * 滚动条方向。
 */
declare enum ScrollBarDirection {
    /**
     * @en
     * Horizontal scroll.
     *
     * @zh
     * 横向滚动。
     */
    HORIZONTAL = 0,
    /**
     * @en
     * Vertical scroll.
     *
     * @zh
     * 纵向滚动。
     */
    VERTICAL = 1
}
/**
 * @en
 * The ScrollBar control allows the user to scroll an image or other view that is too large to see completely.
 *
 * @zh
 * 滚动条组件。
 */
export declare class ScrollBar extends Component {
    constructor();
    /**
     * @en
     * The "handle" part of the ScrollBar.
     *
     * @zh
     * 作为当前滚动区域位置显示的滑块 Sprite。
     */
    get handle(): Sprite | null;
    set handle(value: Sprite | null);
    /**
     * @en
     * The direction of scrolling.
     *
     * @zh
     * ScrollBar 的滚动方向。
     */
    get direction(): ScrollBarDirection;
    set direction(value: ScrollBarDirection);
    /**
     * @en
     * Whether enable auto hide or not.
     *
     * @zh
     * 是否在没有滚动动作时自动隐藏 ScrollBar。
     */
    get enableAutoHide(): boolean;
    set enableAutoHide(value: boolean);
    /**
     * @en
     * The time to hide ScrollBar when scroll finished.
     * Note: This value is only useful when enableAutoHide is true.
     *
     * @zh
     * 没有滚动动作后经过多久会自动隐藏。<br/>
     * 注意：只要当 “enableAutoHide” 为 true 时，才有效。
     */
    get autoHideTime(): number;
    set autoHideTime(value: number);
    static Direction: typeof ScrollBarDirection;
    protected _scrollView: ScrollView | null;
    protected _handle: Sprite | null;
    protected _direction: ScrollBarDirection;
    protected _enableAutoHide: boolean;
    protected _autoHideTime: number;
    protected _touching: boolean;
    protected _opacity: number;
    protected _autoHideRemainingTime: number;
    /**
     * @en
     * Hide ScrollBar.
     *
     * @zh
     * 滚动条隐藏。
     */
    hide(): void;
    /**
     * @en
     * Show ScrollBar.
     *
     * @zh
     * 滚动条显示。
     */
    show(): void;
    /**
     * @en
     * Reset the position of ScrollBar.
     *
     * @zh
     * 重置滚动条位置。
     *
     * @param outOfBoundary @en Rolling displacement. @zh 滚动位移。
     */
    onScroll(outOfBoundary: Vec2 | Readonly<Vec2>): void;
    /**
     * @en
     * Sets the scroll view.
     *
     * @zh
     * 滚动视窗设置。
     *
     * @param scrollView @en The scroll view which is attached with this scroll bar. @zh 当前滚动条附着的滚动视窗。
     */
    setScrollView(scrollView: ScrollView): void;
    onTouchBegan(): void;
    onTouchEnded(): void;
    protected onEnable(): void;
    protected start(): void;
    protected update(dt: number): void;
    protected _convertToScrollViewSpace(out: Vec2, content: Node): void;
    protected _setOpacity(opacity: number): void;
    protected _updateHandlerPosition(position: Vec2): void;
    protected _fixupHandlerPosition(out: Vec3): void;
    protected _conditionalDisableScrollBar(contentSize: Size, scrollViewSize: Size): boolean;
    protected _calculateLength(contentMeasure: number, scrollViewMeasure: number, handleNodeMeasure: number, outOfBoundary: number): number;
    protected _calculatePosition(out: Vec2, contentMeasure: number, scrollViewMeasure: number, handleNodeMeasure: number, contentPosition: number, outOfBoundary: number, actualLenth: number): void;
    protected _updateLength(length: number): void;
    protected _processAutoHide(deltaTime: number): void;
}
export {};
