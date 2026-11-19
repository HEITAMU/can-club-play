import { UIRenderer } from '../framework/ui-renderer';
import { Color } from '../../core';
import { scene } from '../../render-scene';
import type { IBatcher } from '../renderer/i-batcher';
import { LineCap, LineJoin } from '../assembler/graphics/types';
import { Impl } from '../assembler/graphics/webgl/impl';
import { NativeUIModelProxy } from '../renderer/native-2d';
import { RenderEntity } from '../renderer/render-entity';
/**
 * @en
 * Graphics component.
 *
 * @zh
 * 自定义图形类。
 */
export declare class Graphics extends UIRenderer {
    /**
     * @en
     * Current line width.
     *
     * @zh
     * 当前线条宽度。
     */
    get lineWidth(): number;
    set lineWidth(value: number);
    /**
     * @en
     * Determines how two connecting segments (of lines, arcs or curves) with non-zero lengths in a shape are joined together.
     *
     * @zh
     * 用来设置2个长度不为0的相连部分（线段，圆弧，曲线）如何连接在一起的属性。
     */
    get lineJoin(): LineJoin;
    set lineJoin(value: LineJoin);
    /**
     * @en
     * Determines how the end points of every line are drawn.
     *
     * @zh
     * 指定如何绘制每一条线段末端。
     */
    get lineCap(): LineCap;
    set lineCap(value: LineCap);
    /**
     * @en
     * Brush stroke color.
     *
     * @zh
     * 笔触的颜色。
     */
    get strokeColor(): Readonly<Color>;
    set strokeColor(value: Readonly<Color>);
    /**
     * @en
     * Fill paint color.
     *
     * @zh
     * 填充绘画的颜色。
     */
    get fillColor(): Readonly<Color>;
    set fillColor(value: Readonly<Color>);
    /**
     * @en
     * Set the miter limit ratio.
     *
     * @zh
     * 设置斜接面限制比例。
     */
    get miterLimit(): number;
    set miterLimit(value: number);
    get color(): Color;
    set color(value: Color);
    static LineJoin: typeof LineJoin;
    static LineCap: typeof LineCap;
    impl: Impl | null;
    /**
     * @deprecated since v3.6.0, this is an engine private interface that will be removed in the future.
     */
    model: scene.Model | null;
    protected _lineWidth: number;
    protected _strokeColor: Color;
    protected _lineJoin: LineJoin;
    protected _lineCap: LineCap;
    protected _fillColor: Color;
    protected _miterLimit: number;
    protected _isDrawing: boolean;
    protected _isNeedUploadData: boolean;
    private _graphicsUseSubMeshes;
    protected _graphicsNativeProxy: NativeUIModelProxy;
    /**
     * @deprecated since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    get graphicsNativeProxy(): NativeUIModelProxy;
    constructor();
    onRestore(): void;
    onLoad(): void;
    onEnable(): void;
    onDestroy(): void;
    /**
     * @en
     * Move path start point to (x,y).
     *
     * @zh
     * 移动路径起点到坐标(x, y)。
     *
     * @param x @en The x-axis coordinate of the target position.
     *          @zh 目标位置的 X 轴坐标。
     * @param y @en The y-axis coordinate of the target position.
     *          @zh 目标位置的 y 轴坐标。
     */
    moveTo(x: number, y: number): void;
    /**
     * @en
     * Adds a straight line to the path.
     *
     * @zh
     * 绘制直线路径。
     *
     * @param x @en The x-axis coordinate of the target position.
     *          @zh 目标位置的 x 轴坐标。
     * @param y @en The x-axis coordinate of the target position.
     *          @zh 目标位置的 y 轴坐标。
     */
    lineTo(x: number, y: number): void;
    /**
     * @en
     * Adds a cubic Bézier curve to the path.
     *
     * @zh
     * 绘制三次贝赛尔曲线路径。
     *
     * @param c1x @en The x-axis coordinate of the first control point.
     *            @zh 第一个控制点的 x 轴坐标。
     * @param c1y @en The y-axis coordinate of the first control point.
     *            @zh 第一个控制点的 y 轴坐标。
     * @param c2x @en The x-axis coordinate of the second control point.
     *            @zh 第二个控制点的 x 轴坐标。
     * @param c2y @en The y-axis coordinate of the second control point.
     *            @zh 第二个控制点的 y 轴坐标。
     * @param x @en The x-axis coordinate of the last control point.
     *          @zh 最后一个控制点的 x 轴坐标。
     * @param y @en The y-axis coordinate of the last control point.
     *          @zh 最后一个控制点的 y 轴坐标。
     */
    bezierCurveTo(c1x: number, c1y: number, c2x: number, c2y: number, x: number, y: number): void;
    /**
     * @en
     * Adds a quadratic Bézier curve to the path.
     *
     * @zh
     * 绘制二次贝赛尔曲线路径。
     *
     * @param cx @en The x-axis coordinate of the starting control point.
     *           @zh 起始控制点的 x 轴坐标。
     * @param cy @en The y-axis coordinate of the starting control point.
     *           @zh 起始控制点的 y 轴坐标。
     * @param x @en The x-axis coordinates of the endpoint control point.
     *          @zh 终点控制点的 x 轴坐标。
     * @param y @en The y-axis coordinates of the endpoint control point.
     *          @zh 终点控制点的 x 轴坐标。
     */
    quadraticCurveTo(cx: number, cy: number, x: number, y: number): void;
    /**
     * @en
     * Adds an arc to the path which is centered at (cx, cy) position with radius r starting at startAngle
     * and ending at endAngle going in the given direction by counterclockwise (defaulting to false).
     *
     * @zh
     * 绘制圆弧路径。圆弧路径的圆心在 (cx, cy) 位置，半径为 r ，根据 counterclockwise （默认为false）指定的方向从 startAngle 开始绘制，到 endAngle 结束。
     *
     * @param cx @en The coordinate x-axis of the central control point.
     *           @zh 中心控制点的坐标 x 轴。
     * @param cy @en The coordinate y-axis of the central control point.
     *           @zh 中心控制点的坐标 y 轴。
     * @param r @en Angle in Radian.
     *          @zh 圆弧弧度。
     * @param startAngle @en The starting angle in radian, measured clockwise from the positive x-axis.
     *                   @zh 弧度起点，从正 x 轴顺时针方向测量。
     * @param endAngle @en The ending angle in radian, measured clockwise from the positive x-axis.
     *                 @zh 弧度终点，从正 x 轴顺时针方向测量。
     * @param counterclockwise @en If true, draws counterclockwise between the two angles. Default is clockwise.
     *                         @zh 如果为真，在两个角度之间逆时针绘制。默认顺时针。
     */
    arc(cx: number, cy: number, r: number, startAngle: number, endAngle: number, counterclockwise: boolean): void;
    /**
     * @en
     * Adds an ellipse to the path.
     *
     * @zh
     * 绘制椭圆路径。
     *
     * @param cx @en The x-axis coordinates of the center point.
     *           @zh 中心点的 x 轴坐标。
     * @param cy @en The y-axis coordinates of the center point.
     *           @zh 中心点的 y 轴坐标。
     * @param rx @en The radius of the x-axis of the ellipse.
     *           @zh 椭圆 x 轴半径。
     * @param ry @en The radius of the y-axis of the ellipse.
     *           @zh 椭圆 y 轴半径。
     */
    ellipse(cx: number, cy: number, rx: number, ry: number): void;
    /**
     * @en
     * Adds a circle to the path.
     *
     * @zh
     * 绘制圆形路径。
     *
     * @param cx @en The x-axis coordinates of the center point.
     *           @zh 中心点的 x 轴坐标。
     * @param cy @en The y-axis coordinates of the center point.
     *           @zh 中心点的 y 轴坐标。
     * @param r @en Radius.
     *          @zh 圆半径。
     */
    circle(cx: number, cy: number, r: number): void;
    /**
     * @en
     * Adds a rectangle to the path.
     *
     * @zh
     * 绘制矩形路径。
     *
     * @param x @en The x-axis coordinate of the top left point of the rectangle.
     *          @zh 矩形起始 x 轴坐标。
     * @param y @en The y-axis coordinate of the top left point of the rectangle.
     *          @zh 矩形起始 y 轴坐标。
     * @param w @en The width of the rectangle.
     *          @zh 矩形宽度。
     * @param h @en The height of the rectangle.
     *          @zh 矩形高度。
     */
    rect(x: number, y: number, w: number, h: number): void;
    /**
     * @en
     * Adds a round corner rectangle to the path.
     *
     * @zh
     * 绘制圆角矩形路径。
     *
     * @param x @en The x-axis coordinate of the top left point of the rectangle.
     *          @zh 矩形起始 x 轴坐标。
     * @param y @en The y-axis coordinate of the top left point of the rectangle.
     *          @zh 矩形起始 y 轴坐标。
     * @param w @en The width of the rectangle.
     *          @zh 矩形宽度。
     * @param h @en The height of the rectangle.
     *          @zh 矩形高度。
     * @param r @en Radius of rectangular rounded corners.
     *          @zh 矩形圆角半径。
     */
    roundRect(x: number, y: number, w: number, h: number, r: number): void;
    /**
     * @en
     * Draws a filled rectangle.
     *
     * @zh
     * 绘制填充矩形。
     *
     * @param x @en The x-axis coordinate of the top left point of the rectangle.
     *          @zh 矩形起始 x 轴坐标。
     * @param y @en The y-axis coordinate of the top left point of the rectangle.
     *          @zh 矩形起始 y 轴坐标。
     * @param w @en The width of the rectangle.
     *          @zh 矩形宽度。
     * @param h @en The height of the rectangle.
     *          @zh 矩形高度。
     */
    fillRect(x: number, y: number, w: number, h: number): void;
    /**
     * @en
     * Erasing any previously drawn content.
     *
     * @zh
     * 擦除之前绘制的所有内容的方法。
     */
    clear(): void;
    /**
     * @en
     * Causes the point of the pen to move back to the start of the current path.
     * It tries to add a straight line from the current point to the start.
     *
     * @zh
     * 将笔点返回到当前路径起始点的。它尝试从当前点到起始点绘制一条直线。
     */
    close(): void;
    /**
     * @en
     * Strokes the current or given path with the current stroke style.
     *
     * @zh
     * 根据当前的画线样式，绘制当前或已经存在的路径。
     */
    stroke(): void;
    /**
     * @en
     * Fills the current or given path with the current fill style.
     *
     * @zh
     * 根据当前的画线样式，填充当前或已经存在的路径。
     */
    fill(): void;
    private _updateMtlForGraphics;
    /**
     * @deprecated since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    activeSubModel(idx: number): void;
    protected _uploadData(): void;
    protected _render(render: IBatcher): void;
    protected _flushAssembler(): void;
    protected _canRender(): boolean;
    /**
     * @deprecated since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    updateRenderer(): void;
    protected createRenderEntity(): RenderEntity;
}
