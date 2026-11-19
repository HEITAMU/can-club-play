import { Size } from '../math';
import { PalScreenEvent } from '../../../pal/screen-adapter/enum-type';
/**
 * @en The screen API provides an easy way to do some screen managing stuff.
 * @zh screen 单例对象提供简单的方法来做屏幕管理相关的工作。
 */
export declare class Screen {
    /**
     * @internal
     */
    init(): void;
    /**
     * @en the ratio of the resolution in physical pixels to the resolution in CSS pixels for the current display device
     * NOTE: For performance reasons, the engine will limit the maximum value of DPR on some platforms.
     * This property returns the DPR after the engine limit.
     * @zh 当前显示设备的物理像素分辨率与 CSS 像素分辨率之比。
     * 注意：出于性能考虑，引擎在一些平台会限制 DPR 的最高值，这个属性返回的是引擎限制后的 DPR。
     */
    get devicePixelRatio(): number;
    /**
     * @en Get and set the size of current window in physical pixels.
     * NOTE:
     * - Setting window size is only supported on Web platform for now.
     * - On Web platform, if the ContainerStrategy is PROPORTIONAL_TO_FRAME, we set windowSize on game frame,
     *    and get windowSize from the game container after adaptation.
     * @zh 获取和设置当前窗口的物理像素尺寸。
     * 注意
     * - 设置窗口尺寸目前只在 Web 平台上支持。
     * - Web 平台上，如果 ContainerStrategy 为 PROPORTIONAL_TO_FRAME, 则设置 windowSize 作用于 game frame, 而从适配之后 game container 尺寸获取 windowSize.
     */
    get windowSize(): Size;
    set windowSize(size: Size);
    /**
     * @en Get the current resolution of game.
     * This is a readonly property.
     * @zh 获取当前游戏的分辨率。
     * 这是一个只读属性。
     *
     * @readonly
     */
    get resolution(): Size;
    /**
     * @en Whether it supports full screen.
     * @zh 是否支持全屏。
     * @returns {Boolean}
     */
    get supportsFullScreen(): boolean;
    /**
     * @en Return true if it's in full screen state now.
     * @zh 当前是否处在全屏状态下。
     * @returns {boolean}
     */
    fullScreen(): boolean;
    /**
     * @en Request to enter full screen mode with the given element.
     * Many browsers forbid to enter full screen mode without an user intended interaction.
     * If failed to request fullscreen, another attempt will be made to request fullscreen the next time a user interaction occurs.
     * @zh 尝试使当前节点进入全屏模式，很多浏览器不允许程序触发这样的行为，必须在一个用户交互回调中才会生效。
     * 如果进入全屏失败，会在下一次用户发生交互时，再次尝试进入全屏。
     * @param element @zh 请求全屏状态的html元素。 @en The element to request full screen state.
     * @param onFullScreenChange @zh 全屏状态改变的回调函数。 @en callback function when full screen state changed.
     * @param onFullScreenError @zh 全屏错误的回调函数。 @en callback function when full screen error.
     * @return {Promise|undefined}
     * @deprecated since v3.3, please use `screen.requestFullScreen(): Promise<void>` instead.
     */
    requestFullScreen(element: HTMLElement, onFullScreenChange?: (this: Document, ev: any) => any, onFullScreenError?: (this: Document, ev: any) => any): Promise<any> | undefined;
    /**
     * @en Request to enter full screen mode.
     * Many browsers forbid to enter full screen mode without an user intended interaction.
     * If failed to request fullscreen, another attempt will be made to request fullscreen the next time a user interaction occurs.
     * @zh 尝试使当前屏幕进入全屏模式，很多浏览器不允许程序触发这样的行为，必须在一个用户交互回调中才会生效。
     * 如果进入全屏失败，会在下一次用户发生交互时，再次尝试进入全屏。
     * @param element @zh 请求全屏状态的html元素。 @en The element to request full screen state.
     * @param onFullScreenChange @zh 全屏状态改变的回调函数。 @en callback function when full screen state changed.
     * @param onFullScreenError @zh 全屏错误的回调函数。 @en callback function when full screen error.
     * @return {Promise}
     */
    requestFullScreen(): Promise<void>;
    /**
     * @en Exit the full mode.
     * @zh 退出全屏模式。
     * @return {Promise}
     */
    exitFullScreen(): Promise<any>;
    /**
     * @en Automatically request full screen during the next touch/click event.
     * @zh 自动监听触摸、鼠标事件并在下一次事件触发时尝试进入全屏模式。
     * @param element @zh 请求全屏状态的html元素。 @en The element to request full screen state.
     * @param onFullScreenChange @zh 全屏状态改变的回调函数。 @en callback function when full screen state changed.
     *
     * @deprecated since v3.3, please use screen.requestFullScreen() instead.
     */
    autoFullScreen(element: HTMLElement, onFullScreenChange: (this: Document, ev: any) => any): void;
    /**
     * @param element
     * @deprecated since v3.3
     */
    disableAutoFullScreen(element: any): void;
    /**
     * @en
     * Register screen event callback.
     * @zh
     * 注册screen事件回调。
     */
    on(type: PalScreenEvent, callback: (...args: any) => void, target?: any): void;
    /**
     * @en
     * Register a callback of a specific screen event type once.
     * @zh
     * 注册单次的screen事件回调。
     */
    once(type: PalScreenEvent, callback: (...args: any) => void, target?: any): void;
    /**
     * @en
     * Unregister screen event callback.
     * @zh
     * 取消注册screen事件回调。
     */
    off(type: PalScreenEvent, callback?: (...args: any) => void, target?: any): void;
}
declare const screen: Screen;
export { screen };
