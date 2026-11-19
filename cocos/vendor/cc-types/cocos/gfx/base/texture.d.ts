import { Format, GFXObject, SampleCount, TextureFlags, TextureType, TextureUsage, TextureInfo, TextureViewInfo, ISwapchainTextureInfo, TextureHandle } from './define';
/**
 * @en GFX texture.
 * @zh GFX 纹理。
 */
export declare abstract class Texture extends GFXObject {
    /**
     * @en Get texture type.
     * @zh 纹理类型。
     */
    get type(): TextureType;
    /**
     * @en Get texture usage.
     * @zh 纹理使用方式。
     */
    get usage(): TextureUsage;
    /**
     * @en Get texture format.
     * @zh 纹理格式。
     */
    get format(): Format;
    /**
     * @en Get texture width.
     * @zh 纹理宽度。
     */
    get width(): number;
    /**
     * @en Get texture height.
     * @zh 纹理高度。
     */
    get height(): number;
    /**
     * @en Get texture depth.
     * @zh 纹理深度。
     */
    get depth(): number;
    /**
     * @en Get texture array layer.
     * @zh 纹理数组层数。
     */
    get layerCount(): number;
    /**
     * @en Get texture mip level.
     * @zh 纹理 mip 层级数。
     */
    get levelCount(): number;
    /**
     * @en Get texture samples.
     * @zh 纹理采样数。
     */
    get samples(): SampleCount;
    /**
     * @en Get texture flags.
     * @zh 纹理标识位。
     */
    get flags(): TextureFlags;
    /**
     * @en Get texture size.
     * @zh 纹理大小。
     */
    get size(): number;
    /**
     * @en Get texture info.
     * @zh 纹理信息。
     */
    get info(): Readonly<TextureInfo>;
    /**
     * @en Get view info.
     * @zh 纹理视图信息。
     */
    get viewInfo(): Readonly<TextureViewInfo>;
    /**
     * @en Get texture type.
     * @zh 是否为纹理视图。
     */
    get isTextureView(): boolean;
    /** @mangle */
    protected _info: TextureInfo;
    /** @mangle */
    protected _viewInfo: TextureViewInfo;
    /** @mangle */
    protected _isPowerOf2: boolean;
    /** @mangle */
    protected _isTextureView: boolean;
    /** @mangle */
    protected _size: number;
    constructor();
    abstract initialize(info: Readonly<TextureInfo> | Readonly<TextureViewInfo>): void;
    abstract destroy(): void;
    abstract getTextureHandle(): TextureHandle;
    /**
     * @en Resize texture.
     * @zh 重置纹理大小。
     * @param width The new width.
     * @param height The new height.
     */
    abstract resize(width: number, height: number): void;
    /**
     * @engineInternal
     */
    abstract initAsSwapchainTexture(info: Readonly<ISwapchainTextureInfo>): void;
    static getLevelCount(width: number, height: number): number;
}
