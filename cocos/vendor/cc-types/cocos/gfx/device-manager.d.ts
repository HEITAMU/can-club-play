import { BindingMappingInfo } from './base/define';
import { Device } from './base/device';
import { Swapchain } from './base/swapchain';
/**
 * @en
 * Sets the renderer type, only useful on web
 *
 * @zh
 * 渲染模式。
 * 设置渲染器类型，仅适用于 web 端
 * @internal
 */
export declare enum LegacyRenderMode {
    /**
     * @en
     * Automatically chosen by engine.
     * @zh
     * 通过引擎自动选择。
     */
    AUTO = 0,
    /**
     * @en
     * Forced to use canvas renderer.
     * @zh
     * 强制使用 canvas 渲染。
     */
    CANVAS = 1,
    /**
     * @en
     * Forced to use WebGL renderer, but this will be ignored on mobile browsers.
     * @zh
     * 强制使用 WebGL 渲染，但是在部分 Android 浏览器中这个选项会被忽略。
     */
    WEBGL = 2,
    /**
     * @en
     * Use Headless Renderer, which is useful in test or server env, only for internal use by cocos team for now
     * @zh
     * 使用空渲染器，可以用于测试和服务器端环境，目前暂时用于 Cocos 内部测试使用。
     */
    HEADLESS = 3,
    /**
     * @en
     * Force WebGPU rendering, but this option will be ignored in some browsers.
     * @zh
     * 强制使用 WebGPU 渲染，但是在部分浏览器中这个选项会被忽略。
     */
    WEBGPU = 4
}
/**
 * @internal
 */
export declare enum RenderType {
    UNKNOWN = -1,
    CANVAS = 0,
    WEBGL = 1,
    WEBGPU = 2,
    OPENGL = 3,
    HEADLESS = 4
}
/**
 * @internal
 */
export declare class DeviceManager {
    private initialized;
    private _gfxDevice;
    private _canvas;
    private _swapchain;
    private _renderType;
    private _deviceInitialized;
    constructor();
    get gfxDevice(): Device;
    get swapchain(): Swapchain;
    private _tryInitializeWebGPUDevice;
    private _tryInitializeDeviceSync;
    init(canvas: HTMLCanvasElement | null, bindingMappingInfo: BindingMappingInfo): boolean | Promise<boolean>;
    private _initSwapchain;
    private _supportWebGPU;
    private _determineRenderType;
}
/**
 * @internal
 */
export declare const deviceManager: DeviceManager;
