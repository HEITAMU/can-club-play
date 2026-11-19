import { TextureInfo, TextureViewInfo } from '../../gfx';
import { ImageAsset } from './image-asset';
import { PresumedGFXTextureInfo, PresumedGFXTextureViewInfo, SimpleTexture } from './simple-texture';
import { ITexture2DCreateInfo, Texture2D } from './texture-2d';
export type ITextureCubeCreateInfo = ITexture2DCreateInfo;
/**
 * @en The MipmapAtlas region interface
 * @zh MipmapAtlas的region接口。
 */
interface IMipmapAtlasLayout {
    left: number;
    top: number;
    width: number;
    height: number;
    level: number;
}
/**
 * @en The texture cube MipmapAtlas interface
 * @zh 立方体贴图的 MipmapAtlas 接口。
 */
interface ITextureCubeMipmapAtlas {
    atlas: ITextureCubeMipmap;
    layout: IMipmapAtlasLayout[];
}
/**
 * @en The texture cube mipmap interface
 * @zh 立方体贴图的 Mipmap 接口。
 */
interface ITextureCubeMipmap {
    front: ImageAsset;
    back: ImageAsset;
    left: ImageAsset;
    right: ImageAsset;
    top: ImageAsset;
    bottom: ImageAsset;
}
/**
 * @en The index for all faces of the cube
 * @zh 立方体每个面的约定索引。
 */
declare enum FaceIndex {
    right = 0,
    left = 1,
    top = 2,
    bottom = 3,
    front = 4,
    back = 5
}
/**
 * @en The way to fill mipmaps.
 * @zh 填充mipmaps的方式。
 */
export declare enum MipmapMode {
    /**
     * @zh
     * 不使用mipmaps
     * @en
     * Not using mipmaps
     * @readonly
     */
    NONE = 0,
    /**
     * @zh
     * 使用自动生成的mipmaps
     * @en
     * Using the automatically generated mipmaps
     * @readonly
     */
    AUTO = 1,
    /**
     * @zh
     * 使用卷积图填充mipmaps
     * @en
     * Filling mipmaps with convolutional maps
     * @readonly
     */
    BAKED_CONVOLUTION_MAP = 2
}
/**
 * @en The texture cube asset.
 * Each mipmap level of a texture cube have 6 [[ImageAsset]], represents 6 faces of the cube.
 * @zh 立方体贴图资源。
 * 立方体贴图资源的每个 Mipmap 层级都为 6 张 [[ImageAsset]]，分别代表了立方体贴图的 6 个面。
 */
export declare class TextureCube extends SimpleTexture {
    static FaceIndex: typeof FaceIndex;
    isRGBE: boolean;
    _mipmapAtlas: ITextureCubeMipmapAtlas | null;
    _mipmapMode: MipmapMode;
    constructor(name?: string);
    /**
     * @en All levels of mipmap images, be noted, automatically generated mipmaps are not included.
     * When setup mipmap, the size of the texture and pixel format could be modified.
     * @zh 所有层级 Mipmap，注意，这里不包含自动生成的 Mipmap。
     * 当设置 Mipmap 时，贴图的尺寸以及像素格式可能会改变。
     */
    get mipmaps(): ITextureCubeMipmap[];
    set mipmaps(value: ITextureCubeMipmap[]);
    private _setMipmapParams;
    /**
     * @en Fill mipmaps for cube map with atlas.
     * @zh 使用 atlas 方式排布的图填充到立方体贴图的 mipmaps。
     * @param value @en All mipmaps of each face of the cube map are stored in the form of atlas
     * and the value contains the atlas of the 6 faces and the layout information of each mipmap layer.
     * @zh 立方体贴图六个面的图，其中每张图中的全部 mip 数据都使用 atlas 方式排布
     */
    set mipmapAtlas(value: ITextureCubeMipmapAtlas | null);
    get mipmapAtlas(): ITextureCubeMipmapAtlas | null;
    /**
     * @en Whether mipmaps are baked convolutional maps.
     * @zh mipmaps是否为烘焙出来的卷积图。
     */
    isUsingOfflineMipmaps(): boolean;
    /**
     * @en Level 0 mipmap image.
     * Be noted, `this.image = img` equals `this.mipmaps = [img]`,
     * sets image will clear all previous mipmaps.
     * @zh 0 级 Mipmap。
     * 注意，`this.image = img` 等价于 `this.mipmaps = [img]`，
     * 也就是说，通过 `this.image` 设置 0 级 Mipmap 时将隐式地清除之前的所有 Mipmap。
     */
    get image(): ITextureCubeMipmap | null;
    set image(value: ITextureCubeMipmap | null);
    /**
     * @en Create a texture cube with an array of [[Texture2D]] which represents 6 faces of the texture cube.
     * @zh 通过二维贴图数组指定每个 Mipmap 的每个面创建立方体贴图。
     * @param textures Texture array, the texture count must be multiple of 6. Every 6 textures are 6 faces of a mipmap level.
     * The order should obey [[FaceIndex]] order.
     * @param out Output texture cube, if not given, will create a new texture cube.
     * @returns The created texture cube.
     * @example
     * ```ts
     * const textures = new Array<Texture2D>(6);
     * textures[TextureCube.FaceIndex.front] = frontImage;
     * textures[TextureCube.FaceIndex.back] = backImage;
     * textures[TextureCube.FaceIndex.left] = leftImage;
     * textures[TextureCube.FaceIndex.right] = rightImage;
     * textures[TextureCube.FaceIndex.top] = topImage;
     * textures[TextureCube.FaceIndex.bottom] = bottomImage;
     * const textureCube = TextureCube.fromTexture2DArray(textures);
     * ```
     */
    static fromTexture2DArray(textures: Texture2D[], out?: TextureCube): TextureCube;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _mipmaps: ITextureCubeMipmap[];
    private _generatedMipmaps;
    onLoaded(): void;
    /**
     * @en Reset the current texture with given size, pixel format and mipmap images.
     * After reset, the gfx resource will become invalid, you must use [[uploadData]] explicitly to upload the new mipmaps to GPU resources.
     * @zh 将当前贴图重置为指定尺寸、像素格式以及指定 mipmap 层级。重置后，贴图的像素数据将变为未定义。
     * mipmap 图像的数据不会自动更新到贴图中，你必须显式调用 [[uploadData]] 来上传贴图数据。
     * @param info @en The create information. @zh 创建贴图的相关信息。
     */
    reset(info: ITextureCubeCreateInfo): void;
    /**
     * @en Updates the given level mipmap image.
     * @zh 更新指定层级范围内的 Mipmap。当 Mipmap 数据发生了改变时应调用此方法提交更改。
     * 若指定的层级范围超出了实际已有的层级范围，只有覆盖的那些层级范围会被更新。
     * @param firstLevel @en First level to be updated. @zh 更新指定层的 mipmap。
     * @param count @en Mipmap level count to be updated。 @zh 指定要更新层的数量。
     */
    updateMipmaps(firstLevel?: number, count?: number | undefined): void;
    /**
     * @en Destroys this texture, clear all mipmaps and release GPU resources
     * @zh 销毁此贴图，清空所有 Mipmap 并释放占用的 GPU 资源。
     */
    destroy(): boolean;
    /**
     * @en Release used GPU resources.
     * @zh 释放占用的 GPU 资源。
     * @deprecated please use [[destroy]] instead
     */
    releaseTexture(): void;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _serialize(ctxForExporting: any): Record<string, unknown> | null;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _deserialize(serializedData: ITextureCubeSerializeData, handle: any): void;
    protected _getGfxTextureCreateInfo(presumed: PresumedGFXTextureInfo): TextureInfo;
    protected _getGfxTextureViewCreateInfo(presumed: PresumedGFXTextureViewInfo): TextureViewInfo;
    protected _uploadAtlas(): void;
    initDefault(uuid?: string): void;
    validate(): boolean;
}
interface ITextureCubeSerializeData {
    base: string;
    rgbe: boolean;
    mipmapMode: number;
    mipmapAtlas: {
        front: string;
        back: string;
        left: string;
        right: string;
        top: string;
        bottom: string;
    };
    mipmapLayout: [];
    mipmaps: {
        front: string;
        back: string;
        left: string;
        right: string;
        top: string;
        bottom: string;
    }[];
}
export {};
