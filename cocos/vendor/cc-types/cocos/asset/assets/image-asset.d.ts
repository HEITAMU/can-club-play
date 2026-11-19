import { Asset } from './asset';
import { PixelFormat } from './asset-enum';
export declare const compressType: {
    PVR: number;
    PKM: number;
    ASTC: number;
};
/**
 * @en Image source in memory
 * @zh 内存图像源。
 */
export interface IMemoryImageSource {
    _data: ArrayBufferView | null;
    _compressed: boolean;
    width: number;
    height: number;
    format: number;
    mipmapLevelDataSize?: number[];
}
/**
 * @en The image source, can be HTML canvas, image type or image in memory data
 * @zh 图像资源的原始图像源。可以来源于 HTML 元素也可以来源于内存。
 */
export type ImageSource = HTMLCanvasElement | HTMLImageElement | IMemoryImageSource | ImageBitmap;
/**
 * @en Image Asset. The image resource stores the raw data of the image and you can use this resource to create any Texture resource.
 * @zh 图像资源。图像资源存储了图像的原始数据，你可以使用此资源来创建任意 [[TextureBase]] 资源。
 */
export declare class ImageAsset extends Asset {
    /**
     * mergeCompressedTextureMips
     * ************* hearder ***************
     * COMPRESSED_MAGIC: 0x50494d43        *
     * ************* document **************
     * chunkCount: n                       *
     * chunkDataSize[0]: xxx               *
     * ...                                 *
     * chunkDataSize[n - 1]: xxx           *
     * ************* chunks ****************
     *    ******************************   *
     *    *                            *   *
     *    *          chunk[0]          *   *
     *    *                            *   *
     *    ******************************   *
     * ...
     *    ******************************   *
     *    *                            *   *
     *    *          chunk[n - 1]      *   *
     *    *                            *   *
     *    ******************************   *
     * *************************************
     * @param files @zh 压缩纹理数组。 @en Compressed Texture Arrays.
     * @returns out @zh 合并后的压缩纹理数据。 @en Merged compressed texture data.
     */
    static mergeCompressedTextureMips(files: ArrayBuffer[] | ArrayBufferView[]): Uint8Array;
    /**
     * @param file 解析压缩纹理。
     * @param type 压缩纹理类型。
     * @engineInternal
     * @mangle
     */
    static parseCompressedTextures(file: ArrayBuffer | ArrayBufferView, type: number): IMemoryImageSource;
    /**
     * @zh 解析压缩纹理。
     * @param file @zh 压缩纹理原始数据。
     * @param levelIndex @zh 当前 mipmap 层级。
     * @param beginOffset @zh 压缩纹理开始时的偏移。
     * @param endOffset @zh 压缩纹理结束时的偏移。
     * @param type @zh 压缩纹理类型。
     * @param out @zh 压缩纹理输出。
     * @engineInternal
     * @mangle
     */
    static parseCompressedTexture(file: ArrayBuffer | ArrayBufferView, levelIndex: number, beginOffset: number, endOffset: number, type: number, out: IMemoryImageSource): void;
    /**
     * @zh 解析 PVR 格式的压缩纹理。
     * @param file @zh 压缩纹理原始数据。
     * @param levelIndex @zh 当前 mipmap 层级。
     * @param beginOffset @zh 压缩纹理开始时的偏移。
     * @param endOffset @zh 压缩纹理结束时的偏移。
     * @param out @zh 压缩纹理输出。
     * @engineInternal
     * @mangle
     */
    static parsePVRTexture(file: ArrayBuffer | ArrayBufferView, levelIndex: number, beginOffset: number, endOffset: number, out: IMemoryImageSource): void;
    /**
     * @zh 解析 PKM 格式的压缩纹理。
     * @param file @zh 压缩纹理原始数据。
     * @param levelIndex @zh 当前 mipmap 层级。
     * @param beginOffset @zh 压缩纹理开始时的偏移。
     * @param endOffset @zh 压缩纹理结束时的偏移。
     * @param out @zh 压缩纹理输出。
     * @engineInternal
     * @mangle
     */
    static parsePKMTexture(file: ArrayBuffer | ArrayBufferView, levelIndex: number, beginOffset: number, endOffset: number, out: IMemoryImageSource): void;
    /**
     * @zh 解析 ASTC 格式的压缩纹理。
     * @param file @zh 压缩纹理原始数据。
     * @param levelIndex @zh 当前 mipmap 层级。
     * @param beginOffset @zh 压缩纹理开始时的偏移。
     * @param endOffset @zh 压缩纹理结束时的偏移。
     * @param out @zh 压缩纹理输出。
     * @engineInternal
     * @mangle
     */
    static parseASTCTexture(file: ArrayBuffer | ArrayBufferView, levelIndex: number, beginOffset: number, endOffset: number, out: IMemoryImageSource): void;
    /**
     * @en extract the first mipmap from a compressed image asset
     * @engineInternal
     * @mangle
     */
    extractMipmap0(): ImageAsset;
    /**
     * @en extract mipmaps from a compressed image asset
     * @engineInternal
     * @mangle
     */
    extractMipmaps(): ImageAsset[];
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    get _nativeAsset(): any;
    set _nativeAsset(value: any);
    /**
     * @en Image data.
     * @zh 此图像资源的图像数据。
     */
    get data(): ArrayBufferView | HTMLCanvasElement | HTMLImageElement | ImageBitmap | null;
    /**
     * @en The pixel width of the image.
     * @zh 此图像资源的像素宽度。
     */
    get width(): number;
    /**
     * @en The pixel height of the image.
     * @zh 此图像资源的像素高度。
     */
    get height(): number;
    /**
     * @en The pixel format of the image.
     * @zh 此图像资源的像素格式。
     */
    get format(): PixelFormat;
    /**
     * @en Whether the image is in compressed texture format.
     * @zh 此图像资源是否为压缩像素格式。
     */
    get isCompressed(): boolean;
    /**
     * @en If this image resource is a mipmap, get the data size of each layer
     * @zh 此图像资源是 mipmap 时，获取每层数据大小。
     * @engineInternal
     */
    get mipmapLevelDataSize(): number[] | undefined;
    /**
     * @en The original source image URL, it could be empty.
     * @zh 此图像资源的原始图像源的 URL。当原始图像元不是 HTML 文件时可能为空。
     * @deprecated Please use [[nativeUrl]]
     */
    get url(): string;
    private static extnames;
    private _nativeData;
    private _exportedExts;
    private _format;
    private _width;
    private _height;
    constructor(nativeAsset?: ImageSource);
    /**
     * @en Reset the source of the image asset.
     * @zh 重置此图像资源使用的原始图像源。
     * @param data @en The new source. @zh 新的图片数据源。
     */
    reset(data: ImageSource): void;
    destroy(): boolean;
    /**
     * @engineInternal
     */
    _serialize(): string | {
        fmt: string;
        w: number;
        h: number;
    } | undefined;
    /**
     * @engineInternal
     */
    _deserialize(data: any): void;
    private static _sharedPlaceHolderCanvas;
    initDefault(uuid?: string): void;
    validate(): boolean;
}
