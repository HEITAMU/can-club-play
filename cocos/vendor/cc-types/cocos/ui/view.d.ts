import '../core/data/class';
import { Rect, Size, Vec2 } from '../core/math';
import { System } from '../core';
declare const View_base: new (...args: any[]) => System & import("../core/event/eventify").IEventified;
export declare class View extends View_base {
    static instance: View;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _designResolutionSize: Size;
    private _scaleX;
    private _scaleY;
    private _viewportRect;
    private _visibleRect;
    private _autoFullScreen;
    private _retinaEnabled;
    private _resizeCallback;
    private _resolutionPolicy;
    private _rpExactFit;
    private _rpShowAll;
    private _rpNoBorder;
    private _rpFixedHeight;
    private _rpFixedWidth;
    constructor();
    init(): void;
    /**
     * @en
     * Sets whether resize canvas automatically when browser's size changed.<br/>
     * Useful only on web.
     * @zh 设置当发现浏览器的尺寸改变时，是否自动调整 canvas 尺寸大小。
     * 仅在 Web 模式下有效。
     * @param enabled - Whether enable automatic resize with browser's resize event
     */
    resizeWithBrowserSize(enabled: boolean): void;
    /**
     * @en
     * Sets the callback function for `view`'s resize action,<br/>
     * this callback will be invoked before applying resolution policy, <br/>
     * so you can do any additional modifications within the callback.<br/>
     * Useful only on web.
     * @zh 设置 `view` 调整视窗尺寸行为的回调函数，
     * 这个回调函数会在应用适配模式之前被调用，
     * 因此你可以在这个回调函数内添加任意附加改变，
     * 仅在 Web 平台下有效。
     * @param callback - The callback function
     *
     * @deprecated since v3.8.0, please use [[screen.on]] to listen for events.
     */
    setResizeCallback(callback: (() => void) | null): void;
    /**
     * @en
     * Sets the orientation of the game, it can be landscape, portrait or auto.
     * When set it to landscape or portrait, and screen w/h ratio doesn't fit,
     * `view` will automatically rotate the game canvas using CSS.
     * Note that this function doesn't have any effect in native,
     * in native, you need to set the application orientation in native project settings
     * @zh 设置游戏屏幕朝向，它能够是横版，竖版或自动。
     * 当设置为横版或竖版，并且屏幕的宽高比例不匹配时，
     * `view` 会自动用 CSS 旋转游戏场景的 canvas，
     * 这个方法不会对 native 部分产生任何影响，对于 native 而言，你需要在应用设置中的设置排版。
     * @param orientation - Possible values: macro.ORIENTATION_LANDSCAPE | macro.ORIENTATION_PORTRAIT | macro.ORIENTATION_AUTO
     */
    setOrientation(orientation: number): void;
    /**
     * @en
     * Sets whether the engine modify the "viewport" meta in your web page.<br/>
     * It's enabled by default, we strongly suggest you not to disable it.<br/>
     * And even when it's enabled, you can still set your own "viewport" meta, it won't be overridden<br/>
     * Only useful on web
     * @zh 设置引擎是否调整 viewport meta 来配合屏幕适配。
     * 默认设置为启动，我们强烈建议你不要将它设置为关闭。
     * 即使当它启动时，你仍然能够设置你的 viewport meta，它不会被覆盖。
     * 仅在 Web 模式下有效
     * @param enabled - Enable automatic modification to "viewport" meta
     * @deprecated since v3.3
     */
    adjustViewportMeta(enabled: boolean): void;
    /**
     * @en
     * Retina support is enabled by default for Apple device but disabled for other devices,<br/>
     * it takes effect only when you called setDesignResolutionPolicy<br/>
     * Only useful on web
     * @zh 对于 Apple 这种支持 Retina 显示的设备上默认进行优化而其他类型设备默认不进行优化，
     * 它仅会在你调用 setDesignResolutionPolicy 方法时有影响。
     * 仅在 Web 模式下有效。
     * @param enabled - Enable or disable retina display
     *
     * @deprecated since v3.4.0
     */
    enableRetina(enabled: boolean): void;
    /**
     * @en
     * Check whether retina display is enabled.<br/>
     * Only useful on web
     * @zh 检查是否对 Retina 显示设备进行优化。
     * 仅在 Web 模式下有效。
     *
     * @deprecated since v3.4.0
     */
    isRetinaEnabled(): boolean;
    /**
     * @en
     * If enabled, the application will try automatically to enter full screen mode on mobile devices<br/>
     * You can pass true as parameter to enable it and disable it by passing false.<br/>
     * Only useful on web
     * @zh 启动时，移动端游戏会在移动端自动尝试进入全屏模式。
     * 你能够传入 true 为参数去启动它，用 false 参数来关闭它。
     * @param enabled - Enable or disable auto full screen on mobile devices
     *
     * @deprecated since v3.3, please use screen.requestFullScreen() instead.
     */
    enableAutoFullScreen(enabled: boolean): void;
    /**
     * @en
     * Check whether auto full screen is enabled.<br/>
     * Only useful on web
     * @zh 检查自动进入全屏模式是否启动。
     * 仅在 Web 模式下有效。
     * @return Auto full screen enabled or not
     *
     * @deprecated since v3.3
     */
    isAutoFullScreenEnabled(): boolean;
    /**
     * @en Set the canvas size in CSS pixels on Web platform.
     * This method is not supported on other platforms.
     * @zh  Web 平台下，可以以 CSS 像素尺寸来设置 canvas 尺寸。
     * 这个方法并不支持其他平台。
     * @private
     * @param {Number} width
     * @param {Number} height
     *
     * @deprecated since v3.4.0, setting size in CSS pixels is not recommended, please use screen.windowSize instead.
     */
    setCanvasSize(width: number, height: number): void;
    /**
     * @en
     * Returns the canvas size of the view.<br/>
     * On native platforms, it returns the screen size since the view is a fullscreen view.<br/>
     * On web, it returns the size of the canvas element.
     * @zh 返回视图中 canvas 的尺寸。
     * 在 native 平台下，它返回全屏视图下屏幕的尺寸。
     * 在 Web 平台下，它返回 canvas 元素尺寸。
     *
     * @deprecated since v3.4.0, please use screen.windowSize instead.
     */
    getCanvasSize(): Size;
    /**
     * @en
     * Returns the frame size of the view in CSS pixels.<br/>
     * On native platforms, it returns the screen size since the view is a fullscreen view.<br/>
     * On web, it returns the size of the canvas's outer DOM element.
     * @zh 以 CSS 像素尺寸返回视图中边框尺寸。
     * 在 native 平台下，它返回全屏视图下屏幕的尺寸。
     * 在 web 平台下，它返回 canvas 元素的外层 DOM 元素尺寸。
     *
     * @deprecated since v3.4.0, getting size in CSS pixels is not recommended, please use screen.windowSize instead.
     */
    getFrameSize(): Size;
    /**
     * @en Setting the frame size of the view in CSS pixels.
     * On native, it sets the frame size of view.<br/>
     * On web, it sets the size of the canvas's outer DOM element.
     * @zh 以 CSS 像素尺寸设置视图中边框尺寸。
     * 在 native 平台下，设置视图框架尺寸。
     * 在 web 平台下，设置 canvas 外层 DOM 元素尺寸。
     * @param {Number} width
     * @param {Number} height
     *
     * @deprecated since v3.4.0, setting size in CSS pixels is not recommended, please use screen.windowSize instead.
     */
    setFrameSize(width: number, height: number): void;
    /**
     * @en Returns the visible area size of the view port.
     * @zh 返回视图窗口可见区域尺寸。
     */
    getVisibleSize(): Size;
    /**
     * @en Returns the visible area size of the view port.
     * @zh 返回视图窗口可见区域像素尺寸。
     */
    getVisibleSizeInPixel(): Size;
    /**
     * @en Returns the visible origin of the view port.
     * @zh 返回视图窗口可见区域原点。
     */
    getVisibleOrigin(): Vec2;
    /**
     * @en Returns the visible origin of the view port.
     * @zh 返回视图窗口可见区域像素原点。
     */
    getVisibleOriginInPixel(): Vec2;
    /**
     * @en Returns the current resolution policy
     * @zh 返回当前分辨率方案
     * @see [[ResolutionPolicy]]
     */
    getResolutionPolicy(): ResolutionPolicy;
    private _updateResolutionPolicy;
    /**
     * @en Sets the current resolution policy
     * @zh 设置当前分辨率模式
     * @see [[ResolutionPolicy]]
     */
    setResolutionPolicy(resolutionPolicy: ResolutionPolicy | number): void;
    /**
     * @en Sets the resolution policy with designed view size in points.<br/>
     * The resolution policy include: <br/>
     * [1] ResolutionExactFit       Fill screen by stretch-to-fit: if the design resolution ratio of width to height is different from the screen resolution ratio, your game view will be stretched.<br/>
     * [2] ResolutionNoBorder       Full screen without black border: if the design resolution ratio of width to height is different from the screen resolution ratio, two areas of your game view will be cut.<br/>
     * [3] ResolutionShowAll        Full screen with black border: if the design resolution ratio of width to height is different from the screen resolution ratio, two black borders will be shown.<br/>
     * [4] ResolutionFixedHeight    Scale the content's height to screen's height and proportionally scale its width<br/>
     * [5] ResolutionFixedWidth     Scale the content's width to screen's width and proportionally scale its height<br/>
     * [ResolutionPolicy]        [Web only feature] Custom resolution policy, constructed by ResolutionPolicy<br/>
     * @zh 通过设置设计分辨率和匹配模式来进行游戏画面的屏幕适配。
     * @param width Design resolution width.
     * @param height Design resolution height.
     * @param resolutionPolicy The resolution policy desired
     */
    setDesignResolutionSize(width: number, height: number, resolutionPolicy: ResolutionPolicy | number): void;
    /**
     * @en Returns the designed size for the view.
     * @zh 返回视图的设计分辨率。
     */
    getDesignResolutionSize(): Size;
    /**
     * @en Sets the container to desired pixel resolution and fit the game content to it.
     * This function is very useful for adaptation in mobile browsers.
     * In some HD android devices, the resolution is very high, but its browser performance may not be very good.
     * In this case, enabling retina display is very costy and not suggested, and if retina is disabled, the image may be blurry.
     * But this API can be helpful to set a desired pixel resolution which is in between.
     * This API will do the following:
     *     1. Set viewport's width to the desired width in pixel
     *     2. Set body width to the exact pixel resolution
     *     3. The resolution policy will be reset with designed view size in points.
     * @zh 设置容器（container）需要的像素分辨率并且适配相应分辨率的游戏内容。
     * @param width Design resolution width.
     * @param height Design resolution height.
     * @param resolutionPolicy The resolution policy desired
     *
     * @deprecated since v3.6.0
     */
    setRealPixelResolution(width: number, height: number, resolutionPolicy: ResolutionPolicy | number): void;
    /**
     * @en Returns the view port rectangle.
     * @zh 返回视窗剪裁区域。
     */
    getViewportRect(): Rect;
    /**
     * @en Returns scale factor of the horizontal direction (X axis).
     * @zh 返回横轴的缩放比，这个缩放比是将画布像素分辨率放到设计分辨率的比例。
     */
    getScaleX(): number;
    /**
     * @en Returns scale factor of the vertical direction (Y axis).
     * @zh 返回纵轴的缩放比，这个缩放比是将画布像素分辨率缩放到设计分辨率的比例。
     */
    getScaleY(): number;
    /**
     * @en Returns device pixel ratio for retina display.
     * @zh 返回设备或浏览器像素比例。
     *
     * @deprecated since v3.4.0, please use screen.devicePixelRatio instead.
     */
    getDevicePixelRatio(): number;
    /**
     * @en Returns the real location in view for a translation based on a related position
     * @zh 将屏幕坐标转换为游戏视图下的坐标。
     * @param tx - The X axis translation
     * @param ty - The Y axis translation
     * @param relatedPos - The related position object including "left", "top", "width", "height" informations
     * @param out - The out object to save the conversion result
     *
     * @deprecated since v3.4.0
     */
    convertToLocationInView(tx: number, ty: number, relatedPos: any, out?: Vec2): Vec2;
    /**
     * Convert location in Cocos screen coordinate to location in UI space
     * @engineInternal
     * @mangle
     */
    _convertToUISpace(point: Vec2): void;
    private _updateAdaptResult;
}
/**
 * !en
 * Emit when design resolution changed.
 * !zh
 * 当设计分辨率改变时发送。
 * @event design-resolution-changed
 */
interface AdaptResult {
    scale: number[];
    viewport?: null | Rect;
}
/**
 * ContainerStrategy class is the root strategy class of container's scale strategy,
 * it controls the behavior of how to scale the cc.game.container and cc.game.canvas object
 */
declare class ContainerStrategy {
    static EQUAL_TO_FRAME: EqualToFrame;
    static PROPORTION_TO_FRAME: ProportionalToFrame;
    name: string;
    /**
     * @en Manipulation before applying the strategy
     * @zh 在应用策略之前的操作
     * @param view - The target view
     */
    preApply(_view: View): void;
    /**
     * @en Function to apply this strategy
     * @zh 策略应用方法
     * @param view
     * @param designedResolution
     */
    apply(_view: View, designedResolution: Size): void;
    /**
     * @en
     * Manipulation after applying the strategy
     * @zh 策略调用之后的操作
     * @param view  The target view
     */
    postApply(_view: View): void;
    protected _setupCanvas(): void;
}
/**
 * @en
 * Emit when canvas resize.
 * @zh
 * 当画布大小改变时发送。
 * @event canvas-resize
 */
/**
 * ContentStrategy class is the root strategy class of content's scale strategy,
 * it controls the behavior of how to scale the scene and setup the viewport for the game
 *
 * @class ContentStrategy
 */
declare class ContentStrategy {
    static EXACT_FIT: ExactFit;
    static SHOW_ALL: ShowAll;
    static NO_BORDER: NoBorder;
    static FIXED_HEIGHT: FixedHeight;
    static FIXED_WIDTH: FixedWidth;
    name: string;
    private _result;
    protected _strategy: number;
    get strategy(): number;
    constructor();
    /**
     * @en Manipulation before applying the strategy
     * @zh 策略应用前的操作
     * @param view - The target view
     */
    preApply(_view: View): void;
    /**
     * @en Function to apply this strategy
     * The return value is {scale: [scaleX, scaleY], viewport: {new Rect}},
     * The target view can then apply these value to itself, it's preferred not to modify directly its private variables
     * @zh 调用策略方法
     * @return The result scale and viewport rect
     */
    apply(_view: View, designedResolution: Size): AdaptResult;
    /**
     * @en Manipulation after applying the strategy
     * @zh 策略调用之后的操作
     * @param view - The target view
     */
    postApply(_view: View): void;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _buildResult(containerW: number, containerH: number, contentW: number, contentH: number, scaleX: number, scaleY: number): AdaptResult;
}
/**
 * @class EqualToFrame
 * @extends ContainerStrategy
 */
declare class EqualToFrame extends ContainerStrategy {
    name: string;
    constructor();
    apply(_view: any, designedResolution: any): void;
}
/**
     * @class ProportionalToFrame
     * @extends ContainerStrategy
     */
declare class ProportionalToFrame extends ContainerStrategy {
    name: string;
    constructor();
    apply(_view: View, designedResolution: Size): void;
}
declare class ExactFit extends ContentStrategy {
    name: string;
    constructor();
    apply(_view: View, designedResolution: Size): AdaptResult;
}
declare class ShowAll extends ContentStrategy {
    name: string;
    constructor();
    apply(_view: View, designedResolution: Size): AdaptResult;
}
declare class NoBorder extends ContentStrategy {
    name: string;
    constructor();
    apply(_view: any, designedResolution: any): AdaptResult;
}
declare class FixedHeight extends ContentStrategy {
    name: string;
    constructor();
    apply(_view: View, designedResolution: Size): AdaptResult;
}
declare class FixedWidth extends ContentStrategy {
    name: string;
    constructor();
    apply(_view: View, designedResolution: Size): AdaptResult;
}
/**
 * @en ResolutionPolicy class is the root strategy class of scale strategy,
 * its main task is to maintain the compatibility with Cocos2d-x.
 *
 * @zh ResolutionPolicy 类是适配策略的根策略类，它的主要任务是保持与 Cocos2d-x 的兼容性。
 */
export declare class ResolutionPolicy {
    /**
     * @en The entire application is visible in the specified area without trying to preserve the original aspect ratio.
     * Distortion can occur, and the application may appear stretched or compressed.
     *
     * @zh 整个应用程序在指定区域可见，无需尝试保留原始纵横比，
     * 可能会发生变形，出现画面拉伸或压缩。
     */
    static EXACT_FIT: number;
    /**
     * @en The entire application fills the specified area, without distortion but possibly with some cropping,
     * while maintaining the original aspect ratio of the application.
     *
     * @zh 整个应用程序填充指定区域，没有变形，但可能有一些裁剪，
     * 同时保持画面的原始纵横比。
     */
    static NO_BORDER: number;
    /**
     * @en The entire application is visible in the specified area without distortion while maintaining the original
     * aspect ratio of the application. Borders can appear on two sides of the application.
     *
     * @zh 整个应用程序在指定区域可见，没有变形，同时保持原始纵横比，
     * 边框可能出现在画面的旁侧。
     */
    static SHOW_ALL: number;
    /**
     * @en The application takes the height of the design resolution size and modifies the width of the internal
     * canvas so that it fits the aspect ratio of the device
     * no distortion will occur however you must make sure your application works on different
     * aspect ratios
     *
     * @zh 该应用程序采用设计分辨率大小的高度并修改内部画布的宽度，使其适合设备的纵横比，不会发生变形，
     * 但是您必须确保您的应用程序在不同的纵横比的设备下工作。
     */
    static FIXED_HEIGHT: number;
    /**
     * @en The application takes the width of the design resolution size and modifies the height of the internal
     * canvas so that it fits the aspect ratio of the device
     * no distortion will occur however you must make sure your application works on different
     * aspect ratios
     *
     * @zh 该应用程序采用设计分辨率大小的宽度并修改内部画布的高度，使其适合设备的纵横比，不会发生变形
     * 但是您必须确保您的应用程序在不同的纵横比的设备下工作。
     */
    static FIXED_WIDTH: number;
    /**
     * @en Unknown policy
     *
     * @zh 未知的策略
     */
    static UNKNOWN: number;
    static ContainerStrategy: typeof ContainerStrategy;
    static ContentStrategy: typeof ContentStrategy;
    name: string;
    private _containerStrategy;
    private _contentStrategy;
    /**
     * Constructor of ResolutionPolicy
     * @param containerStg
     * @param contentStg
     */
    constructor(containerStg: ContainerStrategy, contentStg: ContentStrategy);
    get canvasSize(): Size;
    /**
     * @en Manipulation before applying the resolution policy
     * @zh 策略应用前的操作
     * @param _view The target view
     */
    preApply(_view: View): void;
    /**
     * @en Function to apply this resolution policy
     * The return value is {scale: [scaleX, scaleY], viewport: {new Rect}},
     * The target view can then apply these value to itself, it's preferred not to modify directly its private variables
     * @zh 调用策略方法
     * @param _view - The target view
     * @param designedResolution - The user defined design resolution
     * @return An object contains the scale X/Y values and the viewport rect
     */
    apply(_view: View, designedResolution: Size): AdaptResult;
    /**
     * @en Manipulation after applying the strategy
     * @zh 策略应用之后的操作
     * @param _view - The target view
     */
    postApply(_view: View): void;
    /**
     * @en Setup the container's scale strategy
     * @zh 设置容器的适配策略
     * @param containerStg The container strategy
     */
    setContainerStrategy(containerStg: ContainerStrategy): void;
    /**
     * @en Setup the content's scale strategy
     * @zh 设置内容的适配策略
     * @param contentStg The content strategy
     */
    setContentStrategy(contentStg: ContentStrategy): void;
    /**
     * @en Get the content's scale strategy.
     * @zh 获取内容的适配策略
     * @returns ContentStrategy instance.
     */
    getContentStrategy(): ContentStrategy;
}
/**
 * @en view is the singleton view object.
 * @zh view 是全局的视图单例对象。
 */
export declare const view: View;
export {};
