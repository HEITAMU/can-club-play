import { Component } from '../scene-graph/component';
import { Size } from '../core/math';
/**
 * @en SubContextView is a view component which controls open data context viewport in WeChat game platform.<br/>
 * The component's node size decide the viewport of the sub context content in main context,
 * the entire sub context texture will be scaled to the node's bounding box area.<br/>
 * This component provides multiple important features:<br/>
 * 1. Sub context could use its own resolution size and policy.<br/>
 * 2. Sub context could be minized to smallest size it needed.<br/>
 * 3. Resolution of sub context content could be increased.<br/>
 * 4. User touch input is transformed to the correct viewport.<br/>
 * 5. Texture update is handled by this component. User don't need to worry.<br/>
 * One important thing to be noted, whenever the node's bounding box change,
 * you need to manually reset the viewport of sub context using updateSubContextViewport.
 * @zh SubContextView 可以用来控制微信小游戏平台开放数据域在主域中的视窗的位置。<br/>
 * 这个组件的节点尺寸决定了开放数据域内容在主域中的尺寸，整个开放数据域会被缩放到节点的包围盒范围内。<br/>
 * 在这个组件的控制下，用户可以更自由得控制开放数据域：<br/>
 * 1. 子域中可以使用独立的设计分辨率和适配模式<br/>
 * 2. 子域区域尺寸可以缩小到只容纳内容即可<br/>
 * 3. 子域的分辨率也可以被放大，以便获得更清晰的显示效果<br/>
 * 4. 用户输入坐标会被自动转换到正确的子域视窗中<br/>
 * 5. 子域内容贴图的更新由组件负责，用户不需要处理<br/>
 * 唯一需要注意的是，当子域节点的包围盒发生改变时，开发者需要使用 `updateSubContextViewport` 来手动更新子域视窗。
 */
export declare class SubContextView extends Component {
    /**
     * @en Specify a reference value of canvas size for style editing in Open Data Context.
     * The width and height setting of CSS style should not exceed this size, otherwise the rendered content will exceed the canvas.
     * NOTE: This property is read-only at runtime. Please configure the design resolution in the Editor.
     *
     * @zh 为开放数据域的样式编辑指定一个画布尺寸的参考值，CSS 样式的宽高设置不应该超过这个尺寸，否则渲染的内容会超出画布。
     * 注意：该属性在运行时是只读的，请在编辑器环境下配置好设计分辨率。
     */
    get designResolutionSize(): Size;
    set designResolutionSize(value: Size);
    /**
     * @en Setting frame rate in Open Data Context.
     *
     * @zh 设置开放数据域的渲染帧率。
     */
    get fps(): number;
    set fps(value: number);
    private _fps;
    private _sprite;
    private _imageAsset;
    private _texture;
    private _updatedTime;
    private _updateInterval;
    private _openDataContext;
    private _content;
    private _designResolutionSize;
    constructor();
    onLoad(): void;
    onEnable(): void;
    onDisable(): void;
    private _initSharedCanvas;
    private _initContentNode;
    private _updateSubContextView;
    private _updateSubContextTexture;
    private _registerNodeEvent;
    private _unregisterNodeEvent;
    private _updateContentLayer;
    update(dt?: number): void;
    onDestroy(): void;
}
