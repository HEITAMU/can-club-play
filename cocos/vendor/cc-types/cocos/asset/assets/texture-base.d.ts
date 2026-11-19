import { Asset } from './asset';
import { TextureFilter, PixelFormat, WrapMode } from './asset-enum';
import { Sampler, Texture, Device, Format, SamplerInfo } from '../../gfx';
/**
 * @en The base texture class, it defines features shared by all textures.
 * @zh 贴图资源基类。它定义了所有贴图共用的概念。
 */
export declare class TextureBase extends Asset {
    /**
     * @en Whether the pixel data is compressed.
     * @zh 此贴图是否为压缩的像素格式。
     */
    get isCompressed(): boolean;
    /**
     * @en Whether it is a compressed alpha channel texture
     * @zh 是否为压缩的透明通道贴图
     */
    get isAlphaAtlas(): boolean;
    /**
     * @en Pixel width of the texture.
     * @zh 此贴图的像素宽度。
     */
    get width(): number;
    /**
     * @en Pixel height of the texture.
     * @zh 此贴图的像素高度。
     */
    get height(): number;
    /**
     * @en The pixel format enum.
     * @zh 像素格式枚举类型。
     */
    static PixelFormat: typeof PixelFormat;
    /**
     * @en The wrap mode enum.
     * @zh 环绕模式枚举类型。
     */
    static WrapMode: typeof WrapMode;
    /**
     * @en The texture filter mode enum.
     * @zh 纹理过滤模式枚举类型。
     */
    static Filter: typeof TextureFilter;
    /**
     * @engineInternal
     */
    protected _format: PixelFormat;
    /**
     * @engineInternal
     */
    protected _minFilter: TextureFilter;
    /**
     * @engineInternal
     */
    protected _magFilter: TextureFilter;
    /**
     * @engineInternal
     */
    protected _mipFilter: TextureFilter;
    /**
     * @engineInternal
     */
    protected _wrapS: WrapMode;
    /**
     * @engineInternal
     */
    protected _wrapT: WrapMode;
    /**
     * @engineInternal
     */
    protected _wrapR: WrapMode;
    /**
     * @engineInternal
     */
    protected _anisotropy: number;
    /**
     * @engineInternal
     * @mangle
     */
    protected _width: number;
    /**
     * @engineInternal
     * @mangle
     */
    protected _height: number;
    private _id;
    private _samplerInfo;
    private _gfxSampler;
    private _gfxDevice;
    private _textureHash;
    constructor(name?: string);
    /**
     * @en Gets the id of the texture.
     * @zh 获取标识符。
     * @returns @en The id of this texture. @zh 此贴图的 id。
     */
    getId(): string;
    /**
     * @en Gets the pixel format.
     * @zh 获取像素格式。
     * @returns @en The pixel format. @zh 像素格式。
     */
    getPixelFormat(): PixelFormat;
    /**
     * @en Gets the anisotropy.
     * @zh 获取各向异性。
     * @returns @en The anisotropy. @zh 各项异性值。
     */
    getAnisotropy(): number;
    /**
     * @en Sets the wrap mode of the texture.
     * Be noted, if the size of the texture is not power of two, only [[WrapMode.CLAMP_TO_EDGE]] is allowed.
     * @zh 设置此贴图的缠绕模式。
     * 注意，若贴图尺寸不是 2 的整数幂，缠绕模式仅允许 [[WrapMode.CLAMP_TO_EDGE]]。
     * @param wrapS @en S(U) coordinate wrap mode. @zh S(U) 坐标系缠绕模式.
     * @param wrapT @en T(V) coordinate wrap mode. @zh T(V) 坐标系缠绕模式.
     * @param wrapR @en R(W) coordinate wrap mode. @zh R(W) 坐标系缠绕模式.
     */
    setWrapMode(wrapS: WrapMode, wrapT: WrapMode, wrapR?: WrapMode): void;
    /**
     * @en Sets the texture's filter mode.
     * @zh 设置此贴图的过滤算法。
     * @param minFilter @en Filter mode for scale down. @zh 贴图缩小时使用的过滤模式。
     * @param magFilter @en Filter mode for scale up. @zh 贴图放大时使用的过滤模式。
     */
    setFilters(minFilter: TextureFilter, magFilter: TextureFilter): void;
    /**
     * @en Sets the texture's mip filter mode.
     * @zh 设置此贴图的多层 mip 过滤算法。
     * @param mipFilter @en Filter mode for multiple mip level. @zh 多层 mip 过滤模式。
     */
    setMipFilter(mipFilter: TextureFilter): void;
    /**
     * @en Sets the texture's anisotropy.
     * @zh 设置此贴图的各向异性。
     * @param anisotropy @en The anisotropy to be set. Max value is 16. @zh 待设置的各向异性数值。最大值为16
     */
    setAnisotropy(anisotropy: number): void;
    /**
     * @en Destroy the current texture, clear up the related GPU resources.
     * @zh 销毁此贴图，并释放占用的 GPU 资源。
     */
    destroy(): boolean;
    /**
     * @en Gets the texture hash.
     * @zh 获取此贴图的哈希值。
     */
    getHash(): number;
    /**
     * @en Gets the GFX Texture resource
     * @zh 获取此贴图底层的 GFX 贴图对象。
     */
    getGFXTexture(): Texture | null;
    /**
     * @en Gets the internal GFX sampler hash.
     * @zh 获取此贴图内部使用的 GFX 采样器信息。
     * @private
     */
    getSamplerInfo(): Readonly<SamplerInfo>;
    /**
     * @en Gets the sampler resource for the texture
     * @zh 获取此贴图底层的 GFX 采样信息。
     */
    getGFXSampler(): Sampler;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _serialize(ctxForExporting: any): any;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _deserialize(serializedData: any, handle: any): void;
    protected _getGFXDevice(): Device | null;
    protected _getGFXFormat(): Format;
    protected _setGFXFormat(format?: PixelFormat): void;
    protected _getGFXPixelFormat(format: PixelFormat): Format;
}
