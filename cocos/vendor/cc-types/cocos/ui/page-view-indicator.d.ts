import { SpriteFrame } from '../2d/assets';
import { Component } from '../scene-graph/component';
import { Size } from '../core/math';
import { Node } from '../scene-graph';
import { Layout } from './layout';
import { PageView } from './page-view';
/**
 * @en Enum for PageView Indicator direction.
 *
 * @zh 页面视图指示器的摆放方向。
 *
 * @enum PageViewIndicator.Direction
 */
declare enum Direction {
    /**
     * @en The horizontal direction.
     *
     * @zh 水平方向。
     */
    HORIZONTAL = 0,
    /**
     * @en The vertical direction.
     *
     * @zh 垂直方向。
     */
    VERTICAL = 1
}
/**
 * @en
 * The Page View Indicator Component.
 *
 * @zh
 * 页面视图每页标记组件。
 */
export declare class PageViewIndicator extends Component {
    /**
     * @en
     * The spriteFrame for each element.
     *
     * @zh
     * 每个页面标记显示的图片。
     */
    get spriteFrame(): SpriteFrame | null;
    set spriteFrame(value: SpriteFrame | null);
    /**
     * @en
     * The location direction of PageViewIndicator.
     *
     * @zh
     * 页面标记摆放方向。
     *
     * @param direction @en The direction of the PageViewIndicator. @zh 页面标记的摆放方向。
     */
    get direction(): Direction;
    set direction(value: Direction);
    /**
     * @en
     * The cellSize for each element.
     *
     * @zh
     * 每个页面标记的大小。
     */
    get cellSize(): Size;
    set cellSize(value: Size);
    /**
     * @en Enum for PageView Indicator direction.
     * @zh 页面视图指示器的摆放方向。
     * @enum PageViewIndicator.Direction
     */
    static Direction: typeof Direction;
    /**
     * @en
     * The distance between each element.
     *
     * @zh
     * 每个页面标记之间的边距。
     */
    spacing: number;
    protected _spriteFrame: SpriteFrame | null;
    protected _direction: Direction;
    protected _cellSize: Size;
    protected _layout: Layout | null;
    protected _pageView: PageView | null;
    protected _indicators: Node[];
    constructor();
    onLoad(): void;
    /**
     * @en
     * Set Page View.
     *
     * @zh
     * 设置页面视图。
     *
     * @param target @en The page view which is attached with this indicator.  @zh 当前标记对象附着到的页面视图对象。
     */
    setPageView(target: PageView): void;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _updateLayout(): void;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _createIndicator(): Node;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _changedState(): void;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _refresh(): void;
}
export {};
