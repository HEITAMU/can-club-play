import { Texture, RenderPassInfo, TextureFlags } from '../../gfx';
import { RenderWindow } from '../../render-scene/core/render-window';
import { TextureBase } from './texture-base';
export interface IRenderTextureCreateInfo {
    name?: string;
    width: number;
    height: number;
    passInfo?: RenderPassInfo;
    externalResLow?: number;
    externalResHigh?: number;
    externalFlag?: TextureFlags;
}
/**
 * @en Render texture is a render target for [[Camera]] or [[Canvas]] component,
 * the render pipeline will use its `RenderWindow` as the target of the rendering process.
 * @zh 渲染贴图是 [[Camera]] 或 [[Canvas]] 组件的渲染目标对象，渲染管线会使用它的 `RenderWindow` 作为渲染的目标窗口。
 */
export declare class RenderTexture extends TextureBase {
    private _window;
    constructor(name?: string);
    /**
     * @en The render window for the render pipeline, it's created internally and cannot be modified.
     * @zh 渲染管线所使用的渲染窗口，内部逻辑创建，无法被修改。
     */
    get window(): RenderWindow | null;
    /**
     * @en Initialize the render texture. Using IRenderTextureCreateInfo.
     * @zh 初始化渲染贴图。设置渲染贴图的名称、尺寸、渲染通道信息。
     * @param info @en The create info of render texture. @zh 渲染贴图的创建信息。
     */
    initialize(info: IRenderTextureCreateInfo): void;
    /**
     * @en Reset the render texture. User may change the name, size or render pass info of the render texture.
     * @zh 重新初始化渲染贴图。用户可以更改渲染贴图的名称、尺寸、渲染通道信息。
     * @param info @en The create info of render texture. @zh 渲染贴图的创建信息。
     */
    reset(info: IRenderTextureCreateInfo): void;
    /**
     * @en Destroy the render texture.
     * @zh 销毁渲染贴图。
     */
    destroy(): boolean;
    /**
     * @en Resize the render texture.
     * @zh 修改渲染贴图的尺寸。
     * @param width @en The pixel width to resize to, the range is from 1 to 2048. @zh 需要调整到的像素宽度，范围为 1-2048。
     * @param height @en The pixel height to resize to, the range is from 1 to 2048. @zh 需要调整到的像素高度，范围为 1-2048。
     */
    resize(width: number, height: number): void;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _serialize(ctxForExporting: any): any;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _deserialize(serializedData: any, handle: any): void;
    /**
     * @en Gets the related [[gfx.Texture]] resource, it's also the color attachment for the render window.
     * @zh 获取渲染贴图的 GFX 资源，同时也是渲染窗口所指向的颜色缓冲贴图资源。
     * @return @en The low level gfx texture. @zh 底层的 gfx 贴图。
     */
    getGFXTexture(): Texture | null;
    /**
     * @en Callback function after render texture is loaded in [[AssetManager]]. Initialize the render texture.
     * @zh 通过 [[AssetManager]] 加载完成时的回调，初始化渲染贴图。
     */
    onLoaded(): void;
    /**
     * @en Implementation of the render texture initialization.
     * @zh 初始化渲染贴图的具体实现。
     * @param info @en The create info of render texture. @zh 渲染贴图的创建信息。
     * @engineInternal
     * @mangle
     */
    protected _initWindow(info?: IRenderTextureCreateInfo): void;
    /**
     * @en Initialize the render texture with uuid. The default size is 1x1.
     * @zh 初始化渲染贴图。使用 uuid 进行初始化，贴图的尺寸为 1x1。
     * @param uuid @en asset uuid. @zh 资源 uuid。
     * @deprecated Since v3.7, this is an internal engine interface and you should not call this interface under any circumstances.
     */
    initDefault(uuid?: string): void;
    /**
     * @en Validate the correctness of the render texture.
     * @zh 验证渲染贴图的正确性。
     * @deprecated Since v3.7, this is an internal engine interface and you should not call this interface under any circumstances.
     */
    validate(): boolean;
    /**
     * @en Read pixel buffer from render texture. @zh 从 render texture 读取像素数据。
     * @param x @en The location on x axis. @zh 起始位置X轴坐标。
     * @param y @en The location on y axis. @zh 起始位置Y轴坐标。
     * @param width @en The pixel width. @zh 像素宽度。
     * @param height @en The pixel height. @zh 像素高度。
     * @param buffer @en The buffer to hold pixel data. @zh 像素缓存。
     */
    readPixels(x?: number, y?: number, width?: number, height?: number, buffer?: Uint8Array): Uint8Array | null;
}
