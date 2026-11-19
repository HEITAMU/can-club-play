import { Component } from '../scene-graph/component';
import { Size, Vec2 } from '../core/math';
import { UITransform } from '../2d/framework/ui-transform';
import { TransformBit } from '../scene-graph/node-enum';
import { Node } from '../scene-graph/node';
/**
 * @en Layout type.
 *
 * @zh 布局类型。
 */
export declare enum LayoutType {
    /**
     * @en No layout.
     *
     * @zh 禁用布局。
     */
    NONE = 0,
    /**
     * @en Horizontal layout.
     *
     * @zh 水平布局。
     */
    HORIZONTAL = 1,
    /**
     * @en Vertical layout.
     *
     * @zh 垂直布局。
     */
    VERTICAL = 2,
    /**
     * @en Grid layout.
     *
     * @zh 网格布局。
     */
    GRID = 3
}
/**
 * @en Layout Resize Mode.
 *
 * @zh 缩放模式。
 */
export declare enum LayoutResizeMode {
    /**
     * @en Don't scale.
     *
     * @zh 不做任何缩放。
     */
    NONE = 0,
    /**
     * @en The container size will be expanded with its children's size.
     *
     * @zh 容器的大小会根据子节点的大小自动缩放。
     */
    CONTAINER = 1,
    /**
     * @en Child item size will be adjusted with the container's size.
     *
     * @zh 子节点的大小会随着容器的大小自动缩放。
     */
    CHILDREN = 2
}
/**
 * @en Grid Layout start axis direction.
 *
 * @zh 布局轴向，只用于 GRID 布局。
 */
export declare enum LayoutAxisDirection {
    /**
     * @en The horizontal axis.
     *
     * @zh 进行水平方向布局。
     */
    HORIZONTAL = 0,
    /**
     * @en The vertical axis.
     *
     * @zh 进行垂直方向布局。
     */
    VERTICAL = 1
}
/**
 * @en Vertical layout direction.
 *
 * @zh 垂直方向布局方式。
 */
export declare enum LayoutVerticalDirection {
    /**
     * @en Items arranged from bottom to top.
     *
     * @zh 从下到上排列。
     */
    BOTTOM_TO_TOP = 0,
    /**
     * @en Items arranged from top to bottom.
     * @zh 从上到下排列。
     */
    TOP_TO_BOTTOM = 1
}
/**
 * @en Horizontal layout direction.
 *
 * @zh 水平方向布局方式。
 */
export declare enum LayoutHorizontalDirection {
    /**
     * @en Items arranged from left to right.
     *
     * @zh 从左往右排列。
     */
    LEFT_TO_RIGHT = 0,
    /**
     * @en Items arranged from right to left.
     * @zh 从右往左排列。
     */
    RIGHT_TO_LEFT = 1
}
/**
 * @en Layout constraint.
 *
 * @zh 布局约束。
 */
export declare enum LayoutConstraint {
    /**
     * @en Constraint free.
     *
     * @zh 自由排布。
     */
    NONE = 0,
    /**
     * @en Keep the number of rows fixed.
     *
     * @zh 固定行。
     */
    FIXED_ROW = 1,
    /**
     * @en Keep the number of rows fixed columns.
     *
     * @zh 固定列。
     */
    FIXED_COL = 2
}
/**
 * @en
 * The Layout is a container component, use it to arrange child elements easily.<br>
 * Note：<br>
 * 1.Scaling and rotation of child nodes are not considered.<br>
 * 2.After setting the Layout, the results need to be updated until the next frame,unless you manually call.[[updateLayout]]
 *
 * @zh
 * Layout 组件相当于一个容器，能自动对它的所有子节点进行统一排版。<br>
 * 注意：<br>
 * 1.不会考虑子节点的缩放和旋转。<br>
 * 2.对 Layout 设置后结果需要到下一帧才会更新，除非你设置完以后手动调用。[[updateLayout]]
 */
export declare class Layout extends Component {
    constructor();
    /**
     * @en
     * Alignment horizontal. Fixed starting position in the same direction when Type is Horizontal.
     *
     * @zh
     * 横向对齐。在 Type 为 Horizontal 时按同个方向固定起始位置排列。
     */
    get alignHorizontal(): boolean;
    set alignHorizontal(value: boolean);
    /**
     * @en
     * Alignment vertical. Fixed starting position in the same direction when Type is Vertical.
     *
     * @zh
     * 纵向对齐。在 Type 为 Horizontal 或 Vertical 时按同个方向固定起始位置排列。
     */
    get alignVertical(): boolean;
    set alignVertical(value: boolean);
    /**
     * @en
     * The layout type.
     *
     * @zh
     * 布局类型。
     */
    get type(): LayoutType;
    set type(value: LayoutType);
    /**
     * @en
     * The are three resize modes for Layout. None, resize Container and resize children.
     *
     * @zh
     * 缩放模式。
     */
    get resizeMode(): LayoutResizeMode;
    set resizeMode(value: LayoutResizeMode);
    /**
     * @en
     * The cell size for grid layout.
     *
     * @zh
     * 每个格子的大小，只有布局类型为 GRID 的时候才有效。
     */
    get cellSize(): Readonly<Size>;
    set cellSize(value: Readonly<Size>);
    /**
     * @en
     * The start axis for grid layout. If you choose horizontal, then children will layout horizontally at first,
     * and then break line on demand. Choose vertical if you want to layout vertically at first.
     *
     * @zh
     * 起始轴方向类型，可进行水平和垂直布局排列，只有布局类型为 GRID 的时候才有效。
     */
    get startAxis(): LayoutAxisDirection;
    set startAxis(value: LayoutAxisDirection);
    /**
     * @en
     * The left padding of layout, it only effect the layout in one direction.
     *
     * @zh
     * 容器内左边距，只会在一个布局方向上生效。
     */
    get paddingLeft(): number;
    set paddingLeft(value: number);
    /**
     * @en
     * The right padding of layout, it only effect the layout in one direction.
     *
     * @zh
     * 容器内右边距，只会在一个布局方向上生效。
     */
    get paddingRight(): number;
    set paddingRight(value: number);
    /**
     * @en
     * The top padding of layout, it only effect the layout in one direction.
     *
     * @zh
     * 容器内上边距，只会在一个布局方向上生效。
     */
    get paddingTop(): number;
    set paddingTop(value: number);
    /**
     * @en
     * The bottom padding of layout, it only effect the layout in one direction.
     *
     * @zh
     * 容器内下边距，只会在一个布局方向上生效。
     */
    get paddingBottom(): number;
    set paddingBottom(value: number);
    /**
     * @en
     * The distance in x-axis between each element in layout.
     *
     * @zh
     * 子节点之间的水平间距。
     */
    get spacingX(): number;
    set spacingX(value: number);
    /**
     * @en
     * The distance in y-axis between each element in layout.
     *
     * @zh
     * 子节点之间的垂直间距。
     */
    get spacingY(): number;
    set spacingY(value: number);
    /**
     * @en
     * Only take effect in Vertical layout mode.
     * This option changes the start element's positioning.
     *
     * @zh
     * 垂直排列子节点的方向。
     */
    get verticalDirection(): LayoutVerticalDirection;
    set verticalDirection(value: LayoutVerticalDirection);
    /**
     * @en
     * Only take effect in horizontal layout mode.
     * This option changes the start element's positioning.
     *
     * @zh
     * 水平排列子节点的方向。
     */
    get horizontalDirection(): LayoutHorizontalDirection;
    set horizontalDirection(value: LayoutHorizontalDirection);
    /**
     * @en
     * The padding of layout, it will effect the layout in horizontal and vertical direction.
     *
     * @zh
     * 容器内边距，该属性会在四个布局方向上生效。
     */
    get padding(): number;
    set padding(value: number);
    /**
     * @en
     * The layout constraint inside the container.
     *
     * @zh
     * 容器内布局约束。
     */
    get constraint(): LayoutConstraint;
    set constraint(value: LayoutConstraint);
    /**
     * @en
     * The limit value used by the layout constraint inside the container.
     *
     * @zh
     * 容器内布局约束使用的限定值。
     */
    get constraintNum(): number;
    set constraintNum(value: number);
    /**
     * @en
     * Adjust the layout if the children scaled.
     *
     * @zh
     * 子节点缩放比例是否影响布局。
     */
    get affectedByScale(): boolean;
    set affectedByScale(value: boolean);
    /**
     * @en Layout type.
     * @zh 布局类型。
     */
    static Type: typeof LayoutType;
    /**
     * @en Vertical layout direction.
     * @zh 垂直方向布局方式。
     */
    static VerticalDirection: typeof LayoutVerticalDirection;
    /**
     * @en Horizontal layout direction.
     * @zh 水平方向布局方式。
     */
    static HorizontalDirection: typeof LayoutHorizontalDirection;
    /**
     * @en Layout Resize Mode.
     * @zh 缩放模式。
     */
    static ResizeMode: typeof LayoutResizeMode;
    /**
     * @en Grid Layout start axis direction.
     * @zh 布局轴向，只用于 GRID 布局。
     */
    static AxisDirection: typeof LayoutAxisDirection;
    /**
     * @en Layout constraint.
     * @zh 布局约束。
     */
    static Constraint: typeof LayoutConstraint;
    protected _resizeMode: LayoutResizeMode;
    protected _layoutType: LayoutType;
    protected _cellSize: Size;
    protected _startAxis: LayoutAxisDirection;
    protected _paddingLeft: number;
    protected _paddingRight: number;
    protected _paddingTop: number;
    protected _paddingBottom: number;
    protected _spacingX: number;
    protected _spacingY: number;
    protected _verticalDirection: LayoutVerticalDirection;
    protected _horizontalDirection: LayoutHorizontalDirection;
    protected _constraint: LayoutConstraint;
    protected _constraintNum: number;
    protected _affectedByScale: boolean;
    protected _isAlign: boolean;
    protected _layoutSize: Size;
    protected _layoutDirty: boolean;
    protected _childrenDirty: boolean;
    protected _usefulLayoutObj: UITransform[];
    protected _init: boolean;
    /**
     * @en
     * Perform the layout update.
     *
     * @zh
     * 立即执行更新布局。
     * @param force @en force update or not. @zh 是否强制更新。
     * @example
     * ```ts
     * import { Layout, log } from 'cc';
     * layout.type = Layout.Type.HORIZONTAL;
     * layout.node.addChild(childNode);
     * log(childNode.x); // not yet changed
     * layout.updateLayout();
     * log(childNode.x); // changed
     * ```
     */
    updateLayout(force?: boolean): void;
    protected onEnable(): void;
    protected onDisable(): void;
    protected _checkUsefulObj(): void;
    protected _addEventListeners(): void;
    protected _removeEventListeners(): void;
    protected _addChildrenEventListeners(): void;
    protected _removeChildrenEventListeners(): void;
    protected _childAdded(child: Node): void;
    protected _childRemoved(child: Node): void;
    protected _resized(): void;
    protected _doLayoutHorizontally(baseWidth: number, rowBreak: boolean, fnPositionY: (...args: any[]) => number, applyChildren: boolean): number;
    protected _doLayoutVertically(baseHeight: number, columnBreak: boolean, fnPositionX: (...args: any[]) => number, applyChildren: boolean): number;
    protected _doLayoutGridAxisHorizontal(layoutAnchor: Vec2 | Readonly<Vec2>, layoutSize: Size): void;
    protected _doLayoutGridAxisVertical(layoutAnchor: Vec2 | Readonly<Vec2>, layoutSize: Size): void;
    protected _doLayoutGrid(): void;
    protected _getHorizontalBaseWidth(horizontal?: boolean): number;
    protected _getVerticalBaseHeight(): number;
    protected _doLayout(): void;
    protected _getUsedScaleValue(value: number): number;
    protected _transformDirty(type: TransformBit): void;
    protected _doLayoutDirty(): void;
    protected _childrenChanged(): void;
    protected _getPaddingH(): number;
    protected _getPaddingV(): number;
    protected _getFixedBreakingNum(): number;
}
