import { TextureInfo, TextureViewInfo } from '../../gfx';
import { PixelFormat } from './asset-enum';
import { ImageAsset } from './image-asset';
import { PresumedGFXTextureInfo, PresumedGFXTextureViewInfo, SimpleTexture } from './simple-texture';
/**
 * @en The create information for [[Texture2D]].
 * @zh 用来创建贴图的信息。
 */
export interface ITexture2DCreateInfo {
    /**
     * @en The pixel width.
     * @zh 像素宽度。
     */
    width: number;
    /**
     * @en The pixel height.
     * @zh 像素高度。
     */
    height: number;
    /**
     * @en The pixel format.
     * @zh 像素格式。
     * @default PixelFormat.RGBA8888
     */
    format?: PixelFormat;
    /**
     * @en The mipmap level count.
     * @zh mipmap 层级。
     * @default 1
     */
    mipmapLevel?: number;
    /**
     * @en The selected base mipmap level.
     * @zh 选择使用的最小 mipmap 层级。
     * @default 1
     */
    baseLevel?: number;
    /**
     * @en The selected maximum mipmap level.
     * @zh 选择使用的最大 mipmap 层级。
     * @default 1000
     */
    maxLevel?: number;
}
/**
 * @en The 2D texture asset. It supports mipmap, each level of mipmap use an [[ImageAsset]].
 * @zh 二维贴图资源。二维贴图资源的每个 Mipmap 层级都为一张 [[ImageAsset]]。
 */
export declare class Texture2D extends SimpleTexture {
    constructor(name?: string);
    /**
     * @en All levels of mipmap images, be noted, automatically generated mipmaps are not included.
     * When setup mipmap, the size of the texture and pixel format could be modified.
     * @zh 所有层级 Mipmap，注意，这里不包含自动生成的 Mipmap。
     * 当设置 Mipmap 时，贴图的尺寸以及像素格式可能会改变。
     */
    get mipmaps(): ImageAsset[];
    set mipmaps(value: ImageAsset[]);
    /**
     * TODO: See: cocos/cocos-engine#15305
     */
    private _setMipmapParams;
    /**
     * @en Level 0 mipmap image.
     * Be noted, `this.image = img` equals `this.mipmaps = [img]`,
     * sets image will clear all previous mipmaps.
     * @zh 0 级 Mipmap。
     * 注意，`this.image = img` 等价于 `this.mipmaps = [img]`，
     * 也就是说，通过 `this.image` 设置 0 级 Mipmap 时将隐式地清除之前的所有 Mipmap。
     */
    get image(): ImageAsset | null;
    set image(value: ImageAsset | null);
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _mipmaps: ImageAsset[];
    private _generatedMipmaps;
    /**
     * @engineInternal
     * @mangle
     */
    initialize(): void;
    onLoaded(): void;
    /**
     * @en Reset the current texture with given size, pixel format and mipmap images.
     * After reset, the gfx resource will become invalid, you must use [[uploadData]] explicitly to upload the new mipmaps to GPU resources.
     * @zh 将当前贴图重置为指定尺寸、像素格式以及指定 mipmap 层级。重置后，贴图的像素数据将变为未定义。
     * mipmap 图像的数据不会自动更新到贴图中，你必须显式调用 [[uploadData]] 来上传贴图数据。
     * @param info @en The create information. @zh 创建贴图的相关信息。
     */
    reset(info: ITexture2DCreateInfo): void;
    /**
     * @en Reset the current texture with given size, pixel format and mipmap images.
     * After reset, the gfx resource will become invalid, you must use [[uploadData]] explicitly to upload the new mipmaps to GPU resources.
     * @zh 将当前贴图重置为指定尺寸、像素格式以及指定 mipmap 层级。重置后，贴图的像素数据将变为未定义。
     * mipmap 图像的数据不会自动更新到贴图中，你必须显式调用 [[uploadData]] 来上传贴图数据。
     * @param width Pixel width
     * @param height Pixel height
     * @param format Pixel format
     * @param mipmapLevel Mipmap level count
     * @param baseLevel Mipmap base level
     * @param maxLevel Mipmap maximum level
     * @deprecated since v1.0 please use [[reset]] instead
     */
    create(width: number, height: number, format?: PixelFormat, mipmapLevel?: number, baseLevel?: number, maxLevel?: number): void;
    toString(): string;
    updateMipmaps(firstLevel?: number, count?: number | undefined): void;
    /**
     * @en If the level 0 mipmap image is a HTML element, then return it, otherwise return null.
     * @zh 若此贴图 0 级 Mipmap 的图像资源的实际源存在并为 HTML 元素则返回它，否则返回 `null`。
     * @returns @en HTMLElement or `null`. @zh HTML 元素或者 null。
     * @deprecated Please use [[ImageAsset.data]] instead
     */
    getHtmlElementObj(): HTMLCanvasElement | HTMLImageElement | null;
    /**
     * @en Destroy the current 2d texture, clear up all mipmap levels and the related GPU resources.
     * @zh 销毁此贴图，清空所有 Mipmap 并释放占用的 GPU 资源。
     */
    destroy(): boolean;
    /**
     * @en Gets the description of the 2d texture.
     * @zh 返回此贴图的描述。
     * @returns @en The description. @zh 贴图的描述信息。
     */
    description(): string;
    /**
     * @en Release used GPU resources.
     * @zh 释放占用的 GPU 资源。
     * @deprecated please use [[destroy]] instead.
     */
    releaseTexture(): void;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _serialize(ctxForExporting: any): {
        base: any;
        mipmaps: (string | null)[];
    } | null;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _deserialize(serializedData: any, handle: any): void;
    /**
     * @engineInternal
     */
    protected _getGfxTextureCreateInfo(presumed: PresumedGFXTextureInfo): TextureInfo;
    /**
     * @engineInternal
     */
    protected _getGfxTextureViewCreateInfo(presumed: PresumedGFXTextureViewInfo): TextureViewInfo;
    initDefault(uuid?: string): void;
    validate(): boolean;
}
export interface ITexture2DSerializeData {
    base: string;
    mipmaps: string[];
}
