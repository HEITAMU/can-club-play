import { Texture, TextureInfo, TextureViewInfo, Device } from '../../gfx';
import { ImageAsset } from './image-asset';
import { TextureBase } from './texture-base';
export type PresumedGFXTextureInfo = Pick<TextureInfo, 'usage' | 'flags' | 'format' | 'levelCount'>;
export type PresumedGFXTextureViewInfo = Pick<TextureViewInfo, 'texture' | 'format' | 'baseLevel' | 'levelCount'>;
/**
 * @en The simple texture base class.
 * It create the GFX Texture and can set mipmap levels.
 * @zh 简单贴图基类。
 * 简单贴图内部创建了 GFX 贴图和该贴图上的 GFX 贴图视图。
 * 简单贴图允许指定不同的 Mipmap 层级。
 */
export declare class SimpleTexture extends TextureBase {
    /**
     * @engineInternal
     * @mangle
     */
    protected _gfxTexture: Texture | null;
    /**
     * @engineInternal
     * @mangle
     */
    protected _gfxTextureView: Texture | null;
    private _mipmapLevel;
    private _textureWidth;
    private _textureHeight;
    /**
     * @engineInternal
     * @mangle
     */
    protected _baseLevel: number;
    /**
     * @engineInternal
     * @mangle
     */
    protected _maxLevel: number;
    constructor(name?: string);
    /**
     * @en The mipmap level of the texture.
     * @zh 贴图中的 Mipmap 层级数量。
     */
    get mipmapLevel(): number;
    /**
     * @en The GFX Texture resource.
     * @zh 获取此贴图底层的 GFX 贴图对象。
     * @return @en The low level gfx texture. @zh 底层的 GFX 贴图。
     */
    getGFXTexture(): Texture | null;
    destroy(): boolean;
    /**
     * @en Update the level 0 mipmap image.
     * @zh 更新 0 级 Mipmap。
     */
    updateImage(): void;
    /**
     * @en Update the given level mipmap image.
     * @zh 更新指定层级范围内的 Mipmap。当 Mipmap 数据发生了改变时应调用此方法提交更改。
     * 若指定的层级范围超出了实际已有的层级范围，只有覆盖的那些层级范围会被更新。
     * @param firstLevel @en First level to be updated. @zh 更新指定层的 mipmap。
     * @param count @en Mipmap level count to be updated。 @zh 指定要更新层的数量。
     */
    updateMipmaps(firstLevel?: number, count?: number | undefined): void;
    /**
     * @en Upload data to the given mipmap level.
     * The size of the image will affect how the mipmap is updated.
     * - When the image is an ArrayBuffer, the size of the image must match the mipmap size.
     * - If the image size matches the mipmap size, the mipmap data will be updated entirely.
     * - If the image size is smaller than the mipmap size, the mipmap will be updated from top left corner.
     * - If the image size is larger, an error will be raised
     * @zh 上传图像数据到指定层级的 Mipmap 中。
     * 图像的尺寸影响 Mipmap 的更新范围：
     * - 当图像是 `ArrayBuffer` 时，图像的尺寸必须和 Mipmap 的尺寸一致；否则，
     * - 若图像的尺寸与 Mipmap 的尺寸相同，上传后整个 Mipmap 的数据将与图像数据一致；
     * - 若图像的尺寸小于指定层级 Mipmap 的尺寸（不管是长或宽），则从贴图左上角开始，图像尺寸范围内的 Mipmap 会被更新；
     * - 若图像的尺寸超出了指定层级 Mipmap 的尺寸（不管是长或宽），都将引起错误。
     * @param source @en The source image or image data. @zh 源图像或图像数据。
     * @param level @en Mipmap level to upload the image to. @zh 要上传的 mipmap 层级。
     * @param arrayIndex @en The array index. @zh 要上传的数组索引。
     */
    uploadData(source: HTMLCanvasElement | HTMLImageElement | ArrayBufferView | ImageBitmap, level?: number, arrayIndex?: number): void;
    /**
     * @engineInternal
     * @mangle
     */
    protected _assignImage(image: ImageAsset, level: number, arrayIndex?: number): void;
    /**
     * @engineInternal
     * @mangle
     */
    protected _checkTextureLoaded(): void;
    /**
     * @engineInternal
     * @mangle
     */
    protected _textureReady(): void;
    /**
     * @en
     * Set mipmap level of this texture.
     * The value is passes as presumed info to `this._getGfxTextureCreateInfo()`.
     * @zh
     * 设置此贴图的 mipmap 层级
     * @param value The mipmap level.
     * @engineInternal
     * @mangle
     *
     */
    protected _setMipmapLevel(value: number): void;
    /**
     * @engineInternal
     * @mangle
     */
    protected _setMipRange(baseLevel: number, maxLevel: number): void;
    /**
     * @en Set mipmap level range for this texture.
     * @zh 设置当前贴图的 mipmap 范围。
     * @param baseLevel @en The base mipmap level. @zh 最低 mipmap 等级。
     * @param maxLevel @en The maximum mipmap level. @zh 最高 mipmap 等级。
     */
    setMipRange(baseLevel: number, maxLevel: number): void;
    /**
     * @en This method is override by derived classes to provide GFX texture info.
     * @zh 这个方法被派生类重写以提供 GFX 纹理信息。
     * @param presumed The presumed GFX texture info.
     * @engineInternal
     * @mangle
     */
    protected _getGfxTextureCreateInfo(presumed: PresumedGFXTextureInfo): TextureInfo | null;
    /**
     * @en This method is overrided by derived classes to provide GFX TextureViewInfo.
     * @zh 这个方法被派生类重写以提供 GFX 纹理视图信息。
     * @param presumed The presumed GFX TextureViewInfo.
     * @engineInternal
     * @mangle
     */
    protected _getGfxTextureViewCreateInfo(presumed: PresumedGFXTextureViewInfo): TextureViewInfo | null;
    /**
     * @engineInternal
     * @mangle
     */
    protected _tryReset(): void;
    /**
     * @en Whether mipmaps are baked convolutional maps.
     * @zh mipmaps 是否为烘焙出来的卷积图。
     */
    isUsingOfflineMipmaps(): boolean;
    /**
     * @engineInternal
     * @mangle
     */
    protected _createTexture(device: Device): void;
    /**
     * @engineInternal
     * @mangle
     */
    protected _createTextureView(device: Device): Texture | null;
    /**
     * @engineInternal
     * @mangle
     */
    protected _tryDestroyTexture(): void;
    /**
     * @engineInternal
     * @mangle
     */
    protected _tryDestroyTextureView(): void;
}
