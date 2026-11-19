/// <reference types="./@types/globals" />
import { Component } from '../scene-graph/component';
import { Size, Vec2, Vec3, Rect } from '../core';
import { Scene } from '../scene-graph';
import { Node } from '../scene-graph/node';
import { TransformBit } from '../scene-graph/node-enum';
export declare function getReadonlyNodeSize(parent: Node | Scene): {
    topLeft: any;
    topRight: any;
    top: any;
    bottomLeft: any;
    bottomRight: any;
    bottom: any;
    center: any;
    left: any;
    right: any;
    width: number;
    height: number;
    init(visibleRect_: Rect): void;
} | Readonly<Size>;
export declare function computeInverseTransForTarget(widgetNode: Node, target: Node, out_inverseTranslate: Vec2, out_inverseScale: Vec2): void;
/**
 * @en Enum for Widget's alignment mode, indicating when the widget should refresh.
 *
 * @zh Widget 的对齐模式，表示 Widget 应该何时刷新。
 */
export declare enum AlignMode {
    /**
     * @en Only align once when the Widget is enabled for the first time.
     * This will allow the script or animation to continue controlling the current node.
     * It will only be aligned once before the end of frame when onEnable is called,then immediately disables the Widget.
     *
     * @zh 仅在 Widget 第一次激活时对齐一次，便于脚本或动画继续控制当前节点。<br/>
     * 开启后会在 onEnable 时所在的那一帧结束前对齐一次，然后立刻禁用该 Widget。
     */
    ONCE = 0,
    /**
     * @en Keep aligning all the way.
     *
     * @zh  始终保持对齐。
     */
    ALWAYS = 1,
    /**
     * @en
     * At the beginning, the widget will be aligned as the method 'ONCE'.
     * After that the widget will be aligned only when the size of screen is modified.
     *
     * @zh
     * 一开始会像 ONCE 一样对齐一次，之后每当窗口大小改变时还会重新对齐。
     */
    ON_WINDOW_RESIZE = 2
}
/**
 * @en Enum for Widget's alignment flag, indicating when the widget select alignment.
 *
 * @zh Widget 的对齐标志，表示 Widget 选择对齐状态。
 */
export declare enum AlignFlags {
    /**
     * @en Align top.
     *
     * @zh 上边对齐。
     */
    TOP = 1,
    /**
     * @en Align middle.
     *
     * @zh 垂直中心对齐。
     */
    MID = 2,
    /**
     * @en Align bottom.
     *
     * @zh 下边对齐。
     */
    BOT = 4,
    /**
     * @en Align left.
     *
     * @zh 左边对齐。
     */
    LEFT = 8,
    /**
     * @en Align center.
     *
     * @zh 横向中心对齐。
     */
    CENTER = 16,
    /**
     * @en Align right.
     *
     * @zh 右边对齐。
     */
    RIGHT = 32,
    /**
     * @en Align horizontal.
     *
     * @zh 横向对齐。
     */
    HORIZONTAL = 56,
    /**
     * @en Align vertical.
     *
     * @zh 纵向对齐。
     */
    VERTICAL = 7
}
/**
 * @en
 * Stores and manipulate the anchoring based on its parent.
 * Widget are used for GUI but can also be used for other things.
 * Widget will adjust current node's position and size automatically,
 * but the results after adjustment can not be obtained until the next frame unless you call [[updateAlignment]] manually.
 *
 * @zh Widget 组件，用于设置和适配其相对于父节点的边距，Widget 通常被用于 UI 界面，也可以用于其他地方。<br/>
 * Widget 会自动调整当前节点的坐标和宽高，不过目前调整后的结果要到下一帧才能在脚本里获取到，除非你先手动调用 [[updateAlignment]]。
 */
export declare class Widget extends Component {
    constructor();
    /**
     * @en
     * Specifies an alignment target that can only be one of the parent nodes of the current node.
     * The default value is null, and when null, indicates the current parent.
     *
     * @zh
     * 指定一个对齐目标，只能是当前节点的其中一个父节点，默认为空，为空时表示当前父节点。
     */
    get target(): Node | null;
    set target(value: Node | null);
    /**
     * @en
     * Whether to align to the top.
     *
     * @zh
     * 是否对齐上边。
     */
    get isAlignTop(): boolean;
    set isAlignTop(value: boolean);
    /**
     * @en
     * Whether to align to the bottom.
     *
     * @zh
     * 是否对齐下边。
     */
    get isAlignBottom(): boolean;
    set isAlignBottom(value: boolean);
    /**
     * @en
     * Whether to align to the left.
     *
     * @zh
     * 是否对齐左边。
     */
    get isAlignLeft(): boolean;
    set isAlignLeft(value: boolean);
    /**
     * @en
     * Whether to align to the right.
     *
     * @zh
     * 是否对齐右边。
     */
    get isAlignRight(): boolean;
    set isAlignRight(value: boolean);
    /**
     * @en
     * Whether to align vertically.
     *
     * @zh
     * 是否垂直方向对齐中点，开启此项会将垂直方向其他对齐选项取消。
     */
    get isAlignVerticalCenter(): boolean;
    set isAlignVerticalCenter(value: boolean);
    /**
     * @en
     * Whether to align horizontally.
     *
     * @zh
     * 是否水平方向对齐中点，开启此选项会将水平方向其他对齐选项取消。
     */
    get isAlignHorizontalCenter(): boolean;
    set isAlignHorizontalCenter(value: boolean);
    /**
     * @en
     * Whether to stretch horizontally, when enable the left and right alignment will be stretched horizontally,
     * the width setting is invalid (read only).
     *
     * @zh
     * 当前是否水平拉伸。当同时启用左右对齐时，节点将会被水平拉伸。此时节点的宽度（只读）。
     */
    get isStretchWidth(): boolean;
    /**
     * @en
     * Whether to stretch vertically, when enable the left and right alignment will be stretched vertically,
     * then height setting is invalid (read only).
     *
     * @zh
     * 当前是否垂直拉伸。当同时启用上下对齐时，节点将会被垂直拉伸，此时节点的高度（只读）。
     */
    get isStretchHeight(): boolean;
    /**
     * @en
     * The margins between the top of this node and the top of parent node,
     * the value can be negative, Only available in 'isAlignTop' open.
     *
     * @zh
     * 本节点顶边和父节点顶边的距离，可填写负值，只有在 isAlignTop 开启时才有作用。
     */
    get top(): number;
    set top(value: number);
    /**
     * @EditorOnly Not for user
     */
    get editorTop(): number;
    set editorTop(value: number);
    /**
     * @en
     * The margins between the bottom of this node and the bottom of parent node,
     * the value can be negative, Only available in 'isAlignBottom' open.
     *
     * @zh
     * 本节点底边和父节点底边的距离，可填写负值，只有在 isAlignBottom 开启时才有作用。
     */
    get bottom(): number;
    set bottom(value: number);
    /**
     * @EditorOnly Not for user
     */
    get editorBottom(): number;
    set editorBottom(value: number);
    /**
     * @en
     * The margins between the left of this node and the left of parent node,
     * the value can be negative, Only available in 'isAlignLeft' open.
     *
     * @zh
     * 本节点左边和父节点左边的距离，可填写负值，只有在 isAlignLeft 开启时才有作用。
     */
    get left(): number;
    set left(value: number);
    /**
     * @EditorOnly Not for user
     */
    get editorLeft(): number;
    set editorLeft(value: number);
    /**
     * @en
     * The margins between the right of this node and the right of parent node,
     * the value can be negative, Only available in 'isAlignRight' open.
     *
     * @zh
     * 本节点右边和父节点右边的距离，可填写负值，只有在 isAlignRight 开启时才有作用。
     */
    get right(): number;
    set right(value: number);
    /**
     * @EditorOnly Not for user
     */
    get editorRight(): number;
    set editorRight(value: number);
    /**
     * @en
     * Horizontally aligns the midpoint offset value,
     * the value can be negative, Only available in 'isAlignHorizontalCenter' open.
     *
     * @zh
     * 水平居中的偏移值，可填写负值，只有在 isAlignHorizontalCenter 开启时才有作用。
     */
    get horizontalCenter(): number;
    set horizontalCenter(value: number);
    /**
     * @EditorOnly Not for user
     */
    get editorHorizontalCenter(): number;
    set editorHorizontalCenter(value: number);
    /**
     * @en
     * Vertically aligns the midpoint offset value,
     * the value can be negative, Only available in 'isAlignVerticalCenter' open.
     *
     * @zh
     * 垂直居中的偏移值，可填写负值，只有在 isAlignVerticalCenter 开启时才有作用。
     */
    get verticalCenter(): number;
    set verticalCenter(value: number);
    /**
     * @EditorOnly Not for user
     */
    get editorVerticalCenter(): number;
    set editorVerticalCenter(value: number);
    /**
     * @en
     * If true, top is pixel margin, otherwise is percentage (0 - 1) margin relative to the parent's height.
     *
     * @zh
     * 如果为 true，"top" 将会以像素作为边距，否则将会以相对父物体高度的比例（0 到 1）作为边距。
     */
    get isAbsoluteTop(): boolean;
    set isAbsoluteTop(value: boolean);
    /**
     * @en
     * If true, bottom is pixel margin, otherwise is percentage (0 - 1) margin relative to the parent's height.
     *
     * @zh
     * 如果为 true，"bottom" 将会以像素作为边距，否则将会以相对父物体高度的比例（0 到 1）作为边距。
     */
    get isAbsoluteBottom(): boolean;
    set isAbsoluteBottom(value: boolean);
    /**
     * @en
     * If true, left is pixel margin, otherwise is percentage (0 - 1) margin relative to the parent's width.
     *
     * @zh
     * 如果为 true，"left" 将会以像素作为边距，否则将会以相对父物体宽度的比例（0 到 1）作为边距。
     */
    get isAbsoluteLeft(): boolean;
    set isAbsoluteLeft(value: boolean);
    /**
     * @en
     * If true, right is pixel margin, otherwise is percentage (0 - 1) margin relative to the parent's width.
     *
     * @zh
     * 如果为 true，"right" 将会以像素作为边距，否则将会以相对父物体宽度的比例（0 到 1）作为边距。
     */
    get isAbsoluteRight(): boolean;
    set isAbsoluteRight(value: boolean);
    /**
     * @en
     * If true, horizontalCenter is pixel margin, otherwise is percentage (0 - 1) margin.
     *
     * @zh
     * 如果为 true，"horizontalCenter" 将会以像素作为偏移值，反之为比例（0 到 1）。
     */
    get isAbsoluteHorizontalCenter(): boolean;
    set isAbsoluteHorizontalCenter(value: boolean);
    /**
     * @en
     * If true, verticalCenter is pixel margin, otherwise is percentage (0 - 1) margin.
     *
     * @zh
     * 如果为 true，"verticalCenter" 将会以像素作为偏移值，反之为比例（0 到 1）。
     */
    get isAbsoluteVerticalCenter(): boolean;
    set isAbsoluteVerticalCenter(value: boolean);
    /**
     * @en
     * Specifies the alignment mode of the Widget, which determines when the widget should refresh.
     *
     * @zh
     * 指定 Widget 的对齐模式，用于决定 Widget 应该何时刷新。
     *
     * @example
     * ```
     * import { Widget } from 'cc';
     * widget.alignMode = Widget.AlignMode.ON_WINDOW_RESIZE;
     * ```
     */
    get alignMode(): AlignMode;
    set alignMode(value: AlignMode);
    /**
     * @zh
     * 对齐标志位。
     * @en
     * Align flags.
     */
    get alignFlags(): number;
    set alignFlags(value: number);
    static AlignMode: typeof AlignMode;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _lastPos: Vec3;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _lastSize: Size;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _dirty: boolean;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _hadAlignOnce: boolean;
    private _alignFlags;
    private _target;
    private _left;
    private _right;
    private _top;
    private _bottom;
    private _horizontalCenter;
    private _verticalCenter;
    private _isAbsLeft;
    private _isAbsRight;
    private _isAbsTop;
    private _isAbsBottom;
    private _isAbsHorizontalCenter;
    private _isAbsVerticalCenter;
    private _originalWidth;
    private _originalHeight;
    private _alignMode;
    private _lockFlags;
    /**
     * @en
     * Immediately perform the widget alignment. You need to manually call this method only if
     * you need to get the latest results after the alignment before the end of current frame.
     *
     * @zh
     * 立刻执行 widget 对齐操作。这个接口一般不需要手工调用。
     * 只有当你需要在当前帧结束前获得 widget 对齐后的最新结果时才需要手动调用这个方法。
     *
     * @example
     * ```ts
     * import { log } from 'cc';
     * widget.top = 10;       // change top margin
     * log(widget.node.y); // not yet changed
     * widget.updateAlignment();
     * log(widget.node.y); // changed
     * ```
     */
    updateAlignment(): void;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _validateTargetInDEV(): void;
    setDirty(): void;
    onEnable(): void;
    onDisable(): void;
    onDestroy(): void;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _adjustWidgetToAllowMovingInEditor(eventType: TransformBit): void;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _adjustWidgetToAllowResizingInEditor(): void;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _adjustWidgetToAnchorChanged(): void;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _adjustTargetToParentChanged(oldParent: Node): void;
    protected _registerEvent(): void;
    protected _unregisterEvent(): void;
    protected _removeParentEvent(): void;
    protected _autoChangedValue(flag: AlignFlags, isAbs: boolean): void;
    protected _registerTargetEvents(): void;
    protected _unregisterTargetEvents(): void;
    protected _unregisterOldParentEvents(oldParent: Node): void;
    protected _setDirtyByMode(): void;
    private _setAlign;
    private _recursiveDirty;
}
/**
 * @deprecated since v3.7.0, this is an engine private interface that will be removed in the future.
 */
export declare namespace Widget {
    type AlignMode = EnumAlias<typeof AlignMode>;
}
