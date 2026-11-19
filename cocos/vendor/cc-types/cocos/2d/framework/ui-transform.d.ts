import { Component, Node } from '../../scene-graph';
import { Mat4, Rect, Size, Vec2, Vec3, geometry } from '../../core';
import { NodeEventType } from '../../scene-graph/node-event';
/**
 * @en
 * The component of transform in UI.
 *
 * @zh
 * UI 变换组件。
 */
export declare class UITransform extends Component {
    constructor();
    /**
     * @en
     * Size of the UI node.
     *
     * @zh
     * 内容尺寸。
     */
    get contentSize(): Readonly<Size>;
    set contentSize(value: Readonly<Size>);
    /**
     * @en
     * component width.
     * @zh
     * 组件宽度。
     */
    get width(): number;
    set width(value: number);
    /**
     * @en
     * component height.
     * @zh
     * 组件高度。
     */
    get height(): number;
    set height(value: number);
    /**
     * @en
     * Anchor point of the UI node.
     *
     * @zh
     * 锚点位置。
     */
    get anchorPoint(): Readonly<Vec2>;
    set anchorPoint(value: Readonly<Vec2>);
    /**
     * @en
     * The x-axis anchor of the node.
     *
     * @zh
     * 锚点位置的 X 坐标。
     */
    get anchorX(): number;
    set anchorX(value: number);
    /**
     * @en
     * The y-axis anchor of the node.
     *
     * @zh
     * 锚点位置的 Y 坐标。
     */
    get anchorY(): number;
    set anchorY(value: number);
    /**
     * @en
     * Render sequence.
     * Note: UI rendering is only about priority.
     *
     * @zh
     * 渲染先后顺序，按照广度渲染排列，按同级节点下进行一次排列。
     * @deprecated Since v3.1
     */
    get priority(): number;
    set priority(value: number);
    protected _priority: number;
    /**
     * @en Get the visibility bit-mask of the rendering camera
     * @zh 查找被渲染相机的可见性掩码。
     * @deprecated since v3.0
     */
    get visibility(): number;
    /**
     * @en Get the priority of the rendering camera
     * @zh 查找被渲染相机的渲染优先级。
     */
    get cameraPriority(): number;
    static EventType: typeof NodeEventType;
    protected _contentSize: Size;
    protected _anchorPoint: Vec2;
    __preload(): void;
    onLoad(): void;
    onEnable(): void;
    onDisable(): void;
    onDestroy(): void;
    /**
     * @en
     * Sets the untransformed size of the ui transform.<br/>
     * The contentSize remains the same no matter if the node is scaled or rotated.<br/>
     * @zh
     * 设置节点 UI Transform 的原始大小，不受该节点是否被缩放或者旋转的影响。
     *
     * @param size @en The size of the UI transform. @zh UI Transform 的 Size 大小。
     * @example
     * ```ts
     * import { Size } from 'cc';
     * node.setContentSize(new Size(100, 100));
     * ```
     */
    setContentSize(size: Size): void;
    /**
     * @en
     * Sets the untransformed size of the ui transform.<br/>
     * The contentSize remains the same no matter if the node is scaled or rotated.<br/>
     * @zh
     * 设置节点 UI Transform 的原始大小，不受该节点是否被缩放或者旋转的影响。
     *
     * @param width  @en The width of the UI transform. @zh UI Transform 的宽。
     * @param height @en The height of the UI transform. @zh UI Transform 的高。
     * @example
     * ```ts
     * import { Size } from 'cc';
     * node.setContentSize(100, 100);
     * ```
     */
    setContentSize(width: number, height: number): void;
    /**
     * @en
     * Sets the anchor point in percent. <br/>
     * anchor point is the point around which all transformations and positioning manipulations take place. <br/>
     * It's like a pin in the node where it is "attached" to its parent. <br/>
     * The anchorPoint is normalized, like a percentage. (0,0) means the bottom-left corner and (1,1) means the top-right corner.<br/>
     * But you can use values higher than (1,1) and lower than (0,0) too.<br/>
     * The default anchor point is (0.5,0.5), so it starts at the center of the node.
     *
     * @zh
     * 设置锚点的百分比。<br>
     * 锚点应用于所有变换和坐标点的操作，它就像在节点上连接其父节点的大头针。<br>
     * 锚点是标准化的，就像百分比一样。(0，0) 表示左下角，(1，1) 表示右上角。<br>
     * 但是你可以使用比（1，1）更高的值或者比（0，0）更低的值。<br>
     * 默认的锚点是（0.5，0.5），因此它开始于节点的中心位置。<br>
     * 注意：Creator 中的锚点仅用于定位所在的节点，子节点的定位不受影响。
     *
     * @param point @en Node anchor point or node x-axis anchor.
     *              @zh 节点锚点或节点 x 轴锚。
     * @param y @en The y-axis anchor of the node.
     *          @zh 节点 y 轴锚。
     * @example
     * ```ts
     * import { Vec2 } from 'cc';
     * node.setAnchorPoint(new Vec2(1, 1));
     * node.setAnchorPoint(1, 1);
     * ```
     */
    setAnchorPoint(point: Vec2 | Readonly<Vec2> | number, y?: number): void;
    /**
     * @zh UI 空间中的点击测试。
     * @en Hit test with point in UI Space.
     *
     * @param uiPoint point in UI Space.
     * @deprecated since v3.5.0, please use `uiTransform.hitTest(screenPoint: Vec2)` instead.
     */
    isHit(uiPoint: Vec2): boolean;
    /**
     * @zh 屏幕空间中的点击测试。
     * @en Hit test with point in Screen Space.
     *
     * @param screenPoint @en point in Screen Space. @zh 屏幕坐标中的点。
     */
    hitTest(screenPoint: Vec2, windowId?: number): boolean;
    private _maskTest;
    /**
     * @en
     * Converts a Point to node (local) space coordinates.
     *
     * @zh
     * 将一个 UI 节点世界坐标系下点转换到另一个 UI 节点 (局部) 空间坐标系，这个坐标系以锚点为原点。
     * 非 UI 节点转换到 UI 节点(局部) 空间坐标系，请走 Camera 的 `convertToUINode`。
     *
     * @param worldPoint @en Point in world space.
     *                   @zh 世界坐标点。
     * @param out @en Point in local space.
     *            @zh 转换后坐标。
     * @returns @en Return the relative position to the target node.
     *          @zh 返回与目标节点的相对位置。
     * @example
     * ```ts
     * const newVec3 = uiTransform.convertToNodeSpaceAR(cc.v3(100, 100, 0));
     * ```
     */
    convertToNodeSpaceAR(worldPoint: Vec3, out?: Vec3): Vec3;
    /**
     * @en
     * Converts a Point in node coordinates to world space coordinates.
     *
     * @zh
     * 将距当前节点坐标系下的一个点转换到世界坐标系。
     *
     * @param nodePoint @en Point in local space.
     *                  @zh 节点坐标。
     * @param out @en Point in world space.
     *            @zh 转换后坐标。
     * @returns @en Returns the coordinates in the UI world coordinate system.
     *          @zh 返回 UI 世界坐标系。
     * @example
     * ```ts
     * const newVec3 = uiTransform.convertToWorldSpaceAR(3(100, 100, 0));
     * ```
     */
    convertToWorldSpaceAR(nodePoint: Vec3, out?: Vec3): Vec3;
    /**
     * @en
     * Returns an axis aligned bounding box of this node in local space coordinate.
     * The returned box is relative only to its parent, and it doesn't contain any child nodes.
     * The behavior is slightly different with [[getBoundingBoxToWorld]] and [[getBoundingBoxTo]].
     *
     * @zh
     * 返回父节坐标系下的轴向对齐的包围盒。
     * 返回的包围盒仅仅只包含当前节点的轴向对齐包围盒，不包含子节点。
     * 这个 API 的行为和 [[getBoundingBoxToWorld]] 和 [[getBoundingBoxTo]] 略有不同。
     *
     * @returns @en An axis aligned bounding box of this node in local space coordinate.  @zh 本地坐标系下的包围盒。
     * @example
     * ```ts
     * const boundingBox = uiTransform.getBoundingBox();
     * ```
     */
    getBoundingBox(): Rect;
    /**
     * @en
     * Returns an axis aligned bounding box of this node in world space coordinate.
     * The bounding box contains self and active children's world bounding box, and it will eliminate all zero sized nodes.
     * @zh
     * 返回节点在世界坐标系下的对齐轴向的包围盒（AABB）。
     * 该边框包含自身和已激活的子节点的世界边框，但会剔除所有零大小的节点。
     * @returns @en An axis aligned bounding box of this node in world space coordinate. @zh 世界坐标系下包围盒。
     * @example
     * ```ts
     * const newRect = uiTransform.getBoundingBoxToWorld();
     * ```
     */
    getBoundingBoxToWorld(): Rect;
    /**
     * @en
     * Returns the minimum bounding box in the coordinate system of the target node.
     * The result contains the current node and its child node tree, and it will eliminates all zero size nodes.
     * E.g. passing an identical matrix will return the world bounding box of the current node tree.
     * @zh
     * 返回在目标节点坐标系下包含当前包围盒及其子节点包围盒的最小总包围盒，但会剔除所有零大小的节点。
     * 如果传入单位矩阵，将得到世界坐标系下的包围盒。
     *
     * @param targetMat @en The target node's world matrix representing its coordinate system.
     *                  @zh 表示目标节点坐标系的世界矩阵。
     * @returns @en The minimum bounding box containing the current bounding box and its child nodes.
     *          @zh 包含当前节点包围盒及其子节点包围盒的最小包围盒。
     */
    getBoundingBoxTo(targetMat: Mat4): Rect;
    /**
     * @en
     * Compute the corresponding aabb in world space for raycast.
     * @zh
     * 计算出此 UI_2D 节点在世界空间下的 aabb 包围盒。
     * @param out @en The out object of aabb bounding box of the node in world space.  @zh 输出节点在世界空间下的 aabb 包围盒。
     * @returns @en The aabb bounding box of the node in world space. @zh 节点在世界空间下的 aabb 包围盒。
     */
    getComputeAABB(out?: geometry.AABB): geometry.AABB;
    protected _selfBoundingBox(out: Rect): Rect;
    protected _parentChanged(node: Node): void;
    private _markRenderDataDirty;
    private static priorityChangeNodeMap;
    private static insertChangeMap;
    private static _sortChildrenSibling;
    /**
     * @deprecated Since v3.7.0, this is an engine private interface that will be removed in the future.
     * @engineInternal
     * @mangle
     */
    static _sortSiblings(): void;
    /**
     * @deprecated Since v3.7.0, this is an engine private interface that will be removed in the future.
     * @engineInternal
     * @mangle
     */
    static _cleanChangeMap(): void;
}
