import { RenderPass, Texture, Framebuffer, RenderPassInfo, Device, Swapchain, TextureFlags } from '../../gfx';
import { Root } from '../../root';
import { Camera } from '../scene';
export interface IRenderWindowInfo {
    title?: string;
    width: number;
    height: number;
    renderPassInfo: RenderPassInfo;
    swapchain?: Swapchain;
    externalResLow?: number;
    externalResHigh?: number;
    externalFlag?: TextureFlags;
}
/**
 * @en The render window represents the render target, it could be an off screen frame buffer or the on screen buffer.
 * @zh 渲染窗口代表了一个渲染目标，可以是离屏的帧缓冲，也可以是屏幕缓冲
 */
export declare class RenderWindow {
    /**
     * @en Get window width. Pre-rotated (i.e. rotationally invariant, always in identity/portrait mode) if possible.
     * If you want to get oriented size instead, you should use [[renderer.scene.Camera.width]] which corresponds to the current screen rotation.
     * @zh 获取窗口宽度。如果支持交换链预变换，返回值将始终处于单位旋转（竖屏）坐标系下。如果需要获取旋转后的尺寸，请使用 [[renderer.scene.Camera.width]]。
     */
    get width(): number;
    /**
     * @en Get window height. Pre-rotated (i.e. rotationally invariant, always in identity/portrait mode) if possible.
     * If you want to get oriented size instead, you should use [[renderer.scene.Camera.width]] which corresponds to the current screen rotation.
     * @zh 获取窗口高度。如果支持交换链预变换，返回值将始终处于单位旋转（竖屏）坐标系下。如果需要获取旋转后的尺寸，请使用 [[renderer.scene.Camera.height]]。
     */
    get height(): number;
    /**
     * @en Get the swapchain for this window, if there is one
     * @zh 如果存在的话，获取此窗口的交换链
     */
    get swapchain(): Swapchain;
    /**
     * @en Get window frame buffer.
     * @zh 帧缓冲对象。
     */
    get framebuffer(): Framebuffer;
    get cameras(): Camera[];
    /**
     * @en Get render window Id.
     * Render windowd Id is used to identify the render window in the render pipeline.
     * @zh 获得渲染窗口Id。渲染窗口Id用于在渲染管线中标识渲染窗口。
     */
    get renderWindowId(): number;
    /**
     * @en Get the name of the color attachment.
     * The name is used to identify the color attachment in the render pipeline.
     * @zh 获取颜色附件的名称。用于自定义渲染管线中的资源注册。
     */
    get colorName(): string;
    /**
     * @en Get the name of the depth stencil attachment.
     * The name is used to identify the depth stencil attachment in the render pipeline.
     * @zh 获取深度模板附件的名称。用于自定义渲染管线中的资源注册。
     */
    get depthStencilName(): string;
    /**
     * @en The render pipeline should handle the resize event properly
     * @zh 渲染管线应该正确处理窗口大小变化事件
     */
    isRenderWindowResized(): boolean;
    /**
     * @en The render pipeline should set this value to false after handling the resize event
     * @zh 渲染管线应该在处理完窗口大小变化事件后将此值设置为 false
     */
    setRenderWindowResizeHandled(): void;
    protected _title: string;
    protected _width: number;
    protected _height: number;
    protected _swapchain: Swapchain;
    protected _renderPass: RenderPass | null;
    protected _colorTextures: Texture[];
    protected _depthStencilTexture: Texture | null;
    protected _cameras: Camera[];
    protected _hasOnScreenAttachments: boolean;
    protected _hasOffScreenAttachments: boolean;
    protected _framebuffer: Framebuffer | null;
    protected _device: Device | null;
    protected _renderWindowId: number;
    protected _isResized: boolean;
    protected _colorName: string;
    protected _depthStencilName: string;
    /**
     * @private
     */
    static registerCreateFunc(root: Root): void;
    private constructor();
    initialize(device: Device, info: IRenderWindowInfo): boolean;
    destroy(): void;
    /**
     * @en Resize window.
     * @zh 重置窗口大小。
     * @param width The new width.
     * @param height The new height.
     */
    resize(width: number, height: number): void;
    /**
     * @en Extract all render cameras attached to the render window to the output cameras list
     * @zh 将所有挂载到当前渲染窗口的摄像机存储到输出列表参数中
     * @param cameras @en The output cameras list, should be empty before invoke this function
     *                @zh 输出相机列表参数，传入时应该为空
     */
    extractRenderCameras(cameras: Camera[]): void;
    /**
     * @en Attach a new camera to the render window
     * @zh 添加渲染相机
     * @param camera @en The camera to attach @zh 要挂载的相机
     */
    attachCamera(camera: Camera): void;
    /**
     * @en Detach a camera from the render window
     * @zh 移除场景中的渲染相机
     * @param camera @en The camera to detach @zh 要移除的相机
     */
    detachCamera(camera: Camera): void;
    /**
     * @en Clear all attached cameras
     * @zh 清空全部渲染相机
     */
    clearCameras(): void;
    /**
     * @en Sort all attached cameras with priority
     * @zh 按照优先级对所有挂载的相机排序
     */
    sortCameras(): void;
}
