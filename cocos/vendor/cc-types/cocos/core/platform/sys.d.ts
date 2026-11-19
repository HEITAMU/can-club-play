/// <reference types="./@types/globals" />
import { Rect } from '../math/rect';
import { NetworkType, Language, OS, Platform, BrowserType, Feature } from '../../../pal/system-info/enum-type';
export declare namespace sys {
    /**
     * @en
     * Platform related feature enum type.
     * @zh
     * 平台相关的特性枚举类型。
     */
    type Feature = EnumAlias<typeof Feature>;
}
/**
 * @en A set of system related variables.
 * @zh 一系列系统相关环境变量。
 */
export declare const sys: {
    Feature: typeof Feature;
    /**
     * @en
     * Returns if the specified platform related feature is supported.
     * @zh
     * 返回指定的平台相关的特性是否支持。
     * @param feature @zh 系统的特性。 @en Feature of the system.
     */
    hasFeature(feature: sys.Feature): boolean;
    /**
     * @en
     * Network type enumeration.
     * @zh
     * 网络类型枚举。
     */
    NetworkType: typeof NetworkType;
    /**
     * @en
     * LanguageCode type enumeration.
     * @zh
     * 语言码类型枚举。
     */
    Language: typeof Language;
    /**
     * @en
     * OS type enumeration.
     * @zh
     * 操作系统类型枚举。
     */
    OS: typeof OS;
    /**
     * @en
     * Platform type enumeration.
     * @zh
     * 平台类型枚举。
     */
    Platform: typeof Platform;
    /**
     * @en
     * Browser type enumeration.
     * @zh
     * 浏览器类型枚举。
     */
    BrowserType: typeof BrowserType;
    /**
     * @en Whether the running platform is native app.
     * @zh 指示运行平台是否是原生平台。
     */
    isNative: boolean;
    /**
     * @en Whether the running platform is browser.
     * @zh 指示运行平台是否是浏览器。
     */
    isBrowser: boolean;
    /**
     * @en Indicate whether the current running context is a mobile system.
     * @zh 指示当前运行平台是否是移动端平台。
     */
    isMobile: boolean;
    /**
     * @en Whether the endianness of current platform is little endian.
     * @zh 当前平台字节顺序是否是小端序。
     */
    isLittleEndian: boolean;
    /**
     * @en The running platform.
     * @zh 当前运行平台或环境。
     */
    platform: Platform;
    /**
     * @en Indicate the current language of the running system.
     * @zh 指示当前运行环境的语言。
     */
    language: Language;
    /**
     * @en
     * Get current language iso 639-1 code.
     * Examples of valid language codes include "zh-tw", "en", "en-us", "fr", "fr-fr", "es-es", etc.
     * The actual value totally depends on results provided by destination platform.
     * @zh
     * 指示当前运行环境的语言
     * 获取当前的语言iso 639-1代码。
     * 有效的语言代码包括 "zh-tw"、"en"、"en-us"、"fr"、"fr-fr"、"es-es "等。
     * 实际值完全取决于目的地平台提供的结果。
     */
    languageCode: string;
    /**
     * @en Indicate the running os name.
     * @zh 指示当前运行系统。
     */
    os: OS;
    /**
     * @en Indicate the running os version string.
     * @zh 指示当前运行系统版本字符串。
     */
    osVersion: string;
    /**
     * @en Indicate the running os main version.
     * @zh 指示当前系统主版本。
     */
    osMainVersion: number;
    /**
     * @en Indicate the running browser type.
     * @zh 指示当前运行的浏览器类型。
     */
    browserType: BrowserType;
    /**
     * @en Indicate the running browser version.
     * @zh 指示当前运行的浏览器版本。
     */
    browserVersion: string;
    /**
     * @en Whether the running platform is xr app.
     * @zh 指示运行平台是否是XR平台。
     */
    isXR: boolean;
    /**
     * @en Indicate the real pixel resolution of the whole game window.
     * @zh 指示游戏窗口的像素分辨率。
     *
     * @deprecated since v3.4.0, please use screen.windowSize instead.
     */
    windowPixelResolution: import("..").Size;
    /**
     * @en The capabilities of the current platform.
     * @zh 当前平台的功能可用性。
     *
     * @deprecated since v3.4.0, please use sys.hasFeature() instead.
     */
    capabilities: {
        canvas: boolean;
        opengl: boolean;
        webp: boolean;
        imageBitmap: boolean;
        touches: boolean;
        mouse: boolean;
        keyboard: boolean;
        accelerometer: boolean;
    };
    /**
     * @en It is a local storage component based on HTML5 localStorage API, on web platform, it's equal to window.localStorage.
     * @zh HTML5 标准中的 localStorage 的本地存储功能，在 Web 端等价于 window.localStorage。
     */
    localStorage: any;
    /**
     * @en Get the network type of current device, return `sys.NetworkType.LAN` if failure.
     * @zh 获取当前设备的网络类型, 如果网络类型无法获取，默认将返回 `sys.NetworkType.LAN`。
     * @return @zh 返回 LAN 或 WWAN。 @en LAN or WWAN.
     */
    getNetworkType(): NetworkType;
    /**
     * @en Get the battery level of current device, return 1.0 if failure.
     * @zh 获取当前设备的电池电量，如果电量无法获取，默认将返回 1。
     * @return - 0.0 ~ 1.0
     */
    getBatteryLevel(): number;
    /**
     * @en Forces the garbage collection, only available in native platforms.
     * @zh 强制进行 JS 内存垃圾回收，尽在原生平台有效。
     */
    garbageCollect(): void;
    /**
     * @en Check whether an object is valid,
     * In web engine, it will return true if the object exist
     * In native engine, it will return true if the JS object and the correspond native object are both valid
     * @zh 检查一个对象是否非空或在原生平台有效，
     * 在 Web 平台，只要对象非空或非 Undefined 就会返回 true，在原生平台，我们会检查当前 JS 对象和其绑定的原生对象是否都有效。
     * @param obj @zh 校验的对象。@en The object to be checked.
     */
    isObjectValid(obj: any): boolean;
    /**
     * @engineInternal
     * @mangle
     */
    __isWebIOS14OrIPadOS14Env: boolean;
    /**
     * @en Dump systemInfo informations.
     * @zh 在控制台打印当前的主要系统信息。
     */
    dump(): void;
    /**
     * @en Try to open a url in browser, may not work in some platforms.
     * @zh 尝试打开一个 web 页面，并非在所有平台都有效。
     * @param url @zh 访问的链接。 @en Visited links.
     */
    openURL(url: string): void;
    /**
     * @engineInternal
     */
    init(): Promise<void>;
    /**
     * @en Get the current time in milliseconds.
     * @zh 获取当前时间（毫秒为单位）。
     */
    now(): number;
    /**
     * @en Restart the JS VM, only available in native platforms.
     * @zh 重启JS虚拟机，仅仅在原生平台有效。
     * @private
     */
    restartVM(): void;
    /**
     * @en
     * Returns the safe area of the screen (in design resolution) based on the game view coordinate system.
     * If the screen is not notched, this method returns a Rect of the same size as visibleSize by default.
     * Currently supports Android, iOS and WeChat, ByteDance Mini Game platform.
     * @zh
     * 返回基于游戏视图坐标系的手机屏幕安全区域（设计分辨率为单位），如果不是异形屏将默认返回一个和 visibleSize 一样大的 Rect。
     * 目前支持安卓、iOS 原生平台和微信、字节小游戏平台。
     * @method getSafeAreaRect
     * @param [symmetric=true] @zh 基于屏幕对称的 Rect。 @en Rect that is symmetric based on the screen.
     * @return {Rect}
     */
    getSafeAreaRect(symmetric?: boolean): Rect;
};
