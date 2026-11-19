import { Rect, Size, Vec2, Vec3, Vec4 } from '../../core';
import { Asset } from '../../asset/assets/asset';
import { TextureBase } from '../../asset/assets/texture-base';
import { ImageAsset, ImageSource } from '../../asset/assets/image-asset';
import { Mesh } from '../../3d/assets/mesh';
import { Sampler, SamplerInfo, Texture } from '../../gfx';
declare enum MeshType {
    RECT = 0,
    POLYGON = 1
}
/**
 * @deprecated since v3.7.0, this is an engine private interface that will be removed in the future.
 */
export interface IUV {
    u: number;
    v: number;
}
interface IVertices {
    rawPosition: Vec3[];
    positions: number[];
    indexes: number[];
    uv: number[];
    nuv: number[];
    minPos: Vec3;
    maxPos: Vec3;
}
/**
 * @en Information object interface for initialize a [[SpriteFrame]] asset.
 * @zh 用于初始化 [[SpriteFrame]] 资源的对象接口描述。
 */
export interface ISpriteFrameInitInfo {
    /**
     * @en The texture of the sprite frame, could be `TextureBase`.
     * @zh 贴图对象资源，可以是 `TextureBase` 类型。
     */
    texture?: TextureBase;
    /**
     * @en The original size of the sprite frame.
     * @zh 精灵帧原始尺寸。
     */
    originalSize?: Size;
    /**
     * @en The rect of the sprite frame in atlas texture.
     * @zh 精灵帧裁切矩形。
     */
    rect?: Rect;
    /**
     * @en The offset of the sprite frame center from the original center of the original rect.
     * Sprite frame in an atlas texture could be trimmed for clipping the transparent pixels, so the trimmed rect is smaller than the original one,
     * the offset defines the distance from the original center to the trimmed center.
     * @zh 精灵帧偏移量。
     * 在图集中的精灵帧可能会被剔除透明像素以获得更高的空间利用李，剔除后的矩形尺寸比剪裁前更小，偏移量指的是从原始矩形的中心到剪裁后的矩形中心的距离。
     */
    offset?: Vec2;
    /**
     * @en Top side border for sliced 9 frame.
     * @zh 九宫格精灵帧的上边界。
     * @default 0
     */
    borderTop?: number;
    /**
     * @en Bottom side border for sliced 9 frame.
     * @zh 九宫格精灵帧的下边界。
     * @default 0
     */
    borderBottom?: number;
    /**
     * @en Left side border for sliced 9 frame.
     * @zh 九宫格精灵帧的左边界。
     * @default 0
     */
    borderLeft?: number;
    /**
     * @en Right side border for sliced 9 frame.
     * @zh 九宫格精灵帧的右边界。
     * @default 0
     */
    borderRight?: number;
    /**
     * @en Whether the content of sprite frame is rotated.
     * @zh 是否旋转。
     */
    isRotate?: boolean;
    /**
     * @en Whether the uv is flipped.
     * @zh 是否转置 UV。
     */
    isFlipUv?: boolean;
}
export declare enum SpriteFrameEvent {
    UV_UPDATED = "uv_updated"
}
/**
 * @en
 * A `SpriteFrame` support several types.
 *  1. Rectangle sprite frame
 *  2. Sliced 9 sprite frame
 *  3. Mesh sprite frame
 * It mainly contains:<br/>
 *  - texture: A `TextureBase` that will be used by render process.<br/>
 *  - rectangle: A rectangle of the texture.
 *  - Sliced 9 border insets: The distance of each side from the internal rect to the sprite frame rect.
 *  - vertices: Vertex list for the mesh type sprite frame.
 *  - uv: The quad uv.
 *  - uvSliced: The sliced 9 uv.
 *
 * @zh
 * 精灵帧资源。
 * 一个 SpriteFrame 支持多种类型
 *  1. 矩形精灵帧
 *  2. 九宫格精灵帧
 *  3. 网格精灵帧
 * 它主要包含下列数据：<br/>
 *  - 纹理：会被渲染流程使用的 `TextureBase` 资源。<br/>
 *  - 矩形：在纹理中的矩形区域。
 *  - 九宫格信息：九宫格的内部矩形四个边距离 SpriteFrame 外部矩形的距离。
 *  - 网格信息：网格类型精灵帧的所有顶点列表。
 *  - uv: 四边形 UV。
 *  - uvSliced: 九宫格 UV。
 * 可通过 `SpriteFrame` 获取该组件。
 *
 * @example
 * ```ts
 * import { resources } from 'cc';
 * // First way to use a SpriteFrame
 * const url = "assets/PurpleMonster/icon/spriteFrame";
 * resources.load(url, (err, spriteFrame) => {
 *   const node = new Node("New Sprite");
 *   const sprite = node.addComponent(Sprite);
 *   sprite.spriteFrame = spriteFrame;
 *   node.parent = self.node;
 * });
 *
 * // Second way to use a SpriteFrame
 * const self = this;
 * const url = "test_assets/PurpleMonster";
 * resources.load(url, (err, imageAsset) => {
 *  if(err){
 *    return;
 *  }
 *
 *  const node = new Node("New Sprite");
 *  const sprite = node.addComponent(Sprite);
 *  const spriteFrame = new SpriteFrame();
 *  const tex = imageAsset._texture;
 *  spriteFrame.texture = tex;
 *  sprite.spriteFrame = spriteFrame;
 *  node.parent = self.node;
 * });
 *
 * // Third way to use a SpriteFrame
 * const self = this;
 * const cameraComp = this.getComponent(Camera);
 * const renderTexture = new RenderTexture();
 * renderTexture.reset({
 *   width: 512,
 *   height: 512,
 *   depthStencilFormat: RenderTexture.DepthStencilFormat.DEPTH_24_STENCIL_8
 * });
 *
 * cameraComp.targetTexture = renderTexture;
 * const spriteFrame = new SpriteFrame();
 * spriteFrame.texture = renderTexture;
 * ```
 */
export declare class SpriteFrame extends Asset {
    /**
     * @en Create a SpriteFrame object by an image asset or an native image asset.
     * @zh 通过 Image 资源或者平台相关 Image 对象创建一个 SpriteFrame 资源。
     * @param imageSourceOrImageAsset @en ImageAsset or ImageSource, ImageSource could be HTMLCanvasElement, HTMLImageElement, IMemoryImageSource.
     *                                @zh 图像资源或图像原始图像源，图像原始图像源支持 HTMLCanvasElement HTMLImageElement IMemoryImageSource 三种资源。
     * @returns @en SpriteFrame asset. @zh 精灵资源。
     */
    static createWithImage(imageSourceOrImageAsset: ImageSource | ImageAsset): SpriteFrame;
    /**
     * @en uv update event.
     * @zh uv 更新事件。
     */
    static EVENT_UV_UPDATED: SpriteFrameEvent;
    static MeshType: typeof MeshType;
    /**
     * @en Top border distance of sliced 9 rect.
     * @zh 九宫格内部矩形顶部边框距离 SpriteFrame 矩形的距离。
     */
    get insetTop(): number;
    set insetTop(value: number);
    /**
     * @en Bottom border distance of sliced 9 rect.
     * @zh 九宫格内部矩形底部边框距离 SpriteFrame 矩形的距离。
     */
    get insetBottom(): number;
    set insetBottom(value: number);
    /**
     * @en Left border distance of sliced 9 rect.
     * @zh 九宫格内部矩形左边框距离 SpriteFrame 矩形的距离。
     */
    get insetLeft(): number;
    set insetLeft(value: number);
    /**
     * @en Right border distance of sliced 9 rect.
     * @zh 九宫格内部矩形右边框距离 SpriteFrame 矩形的距离。
     */
    get insetRight(): number;
    set insetRight(value: number);
    /**
     * @en Returns the rect of the sprite frame in the texture.
     * If it's an atlas texture, a transparent pixel area is proposed for the actual mapping of the current texture.
     * @zh 获取 SpriteFrame 的纹理矩形区域。
     * 如果是一个 atlas 的贴图，则为当前贴图的实际剔除透明像素区域。
     */
    get rect(): Rect;
    set rect(value: Rect);
    /**
     * @en The original size before trimmed.
     * @zh 修剪前的原始大小。
     */
    get originalSize(): Size;
    set originalSize(value: Size);
    /**
     * @en The offset of the sprite frame center.
     * Sprite frame in an atlas texture could be trimmed for clipping the transparent pixels, so the trimmed rect is smaller than the original one,
     * the offset defines the distance from the original center to the trimmed center.
     * @zh 精灵帧偏移量。
     * 在图集中的精灵帧可能会被剔除透明像素以获得更高的空间利用李，剔除后的矩形尺寸比剪裁前更小，偏移量指的是从原始矩形的中心到剪裁后的矩形中心的距离。
     */
    get offset(): Vec2;
    set offset(value: Vec2);
    /**
     * @en Whether the content of sprite frame is rotated.
     * @zh 是否旋转。
     */
    get rotated(): boolean;
    set rotated(rotated: boolean);
    /**
     * @en The texture of the sprite frame, could be `TextureBase`.
     * @zh 贴图对象资源，可以是 `TextureBase` 类型。
     */
    get texture(): TextureBase;
    set texture(value: TextureBase);
    /**
     * @en The uuid of the atlas asset, if exists.
     * @zh 图集资源的 uuid。
     */
    get atlasUuid(): string;
    set atlasUuid(value: string);
    /**
     * @en The pixel width of the sprite frame.
     * @zh 精灵帧的像素宽度。
     */
    get width(): number;
    /**
     * @en The pixel height of the sprite frame.
     * @zh 精灵帧的像素高度。
     */
    get height(): number;
    /**
     * @deprecated since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    set _textureSource(value: TextureBase);
    /**
     * @en Whether flip the uv in X direction.
     * @zh 沿 X 轴方向, 翻转 UV。
     */
    get flipUVX(): boolean;
    set flipUVX(value: boolean);
    /**
     * @en Whether flip the uv in Y direction.
     * @zh 沿 Y 轴方向, 翻转 UV。
     */
    get flipUVY(): boolean;
    set flipUVY(value: boolean);
    /**
     * @en Sets whether sprite can be packed into dynamic atlas.
     * @zh 设置精灵是否允许参与自动合图。
     */
    get packable(): boolean;
    set packable(value: boolean);
    /**
     * @en Original information before packed to dynamic atlas, includes texture, width, height. It's null before being packed to dynamic atlas.
     * @zh 精灵自动合图之前的原始 texture 和宽高信息。在参与自动合图之前此值为 null。
     */
    get original(): {
        _texture: TextureBase;
        _x: number;
        _y: number;
    } | null;
    /**
     * @en Number of pixels corresponding to unit size in world space (pixels per unit).
     * @zh 世界空间中的单位大小对应的像素数量（像素每单位）。
     */
    get pixelsToUnit(): number;
    /**
     * @en Local origin position when generating the mesh.
     * @zh 生成 mesh 时本地坐标原点位置。
     */
    get pivot(): Vec2;
    /**
     * @en mesh information, you should call the [[ensureMeshData]] function before using it.
     * @zh mesh 信息，你应该在使用它之前调用 [[ensureMeshData]] 函数来确保其可用。
     */
    get mesh(): Mesh | null;
    /**
     * @deprecated since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    get trimmedBorder(): Vec4;
    /**
     * @en Vertex list for the mesh type sprite frame.
     * @zh 网格类型精灵帧的所有顶点列表。
     */
    vertices: IVertices | null;
    /**
     * @en UV for quad vertices.
     * @zh 矩形的顶点 UV。
     */
    uv: number[];
    /**
     * @deprecated since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    unbiasUV: number[];
    /**
     * @en UV for sliced 9 vertices.
     * @zh 九宫格的顶点 UV。
     */
    uvSliced: IUV[];
    protected _rect: Rect;
    protected _trimmedBorder: Vec4;
    protected _offset: Vec2;
    protected _originalSize: Size;
    protected _rotated: boolean;
    protected _capInsets: number[];
    protected _atlasUuid: string;
    protected _texture: TextureBase;
    protected _isFlipUVY: boolean;
    protected _isFlipUVX: boolean;
    protected _original: {
        _texture: TextureBase;
        _x: number;
        _y: number;
    } | null;
    protected _packable: boolean;
    protected _pixelsToUnit: number;
    protected _pivot: Vec2;
    protected _meshType: MeshType;
    protected _extrude: number;
    protected _customOutLine: never[];
    protected _mesh: Mesh | null;
    protected _minPos: Vec3;
    protected _maxPos: Vec3;
    constructor(name?: string);
    /**
     * @en
     * Returns whether the texture have been loaded.
     * @zh
     * 返回是否已加载精灵帧。
     *
     * @deprecated since v3.3, Useless Code.
     */
    textureLoaded(): boolean;
    /**
     * @en
     * Returns whether the sprite frame is rotated in the texture.
     * @zh
     * 获取 SpriteFrame 是否旋转。
     * @deprecated since v1.2, please use [[rotated]] instead.
     */
    isRotated(): boolean;
    /**
     * @en
     * Set whether the sprite frame is rotated in the texture.
     * @zh
     * 设置 SpriteFrame 是否旋转。
     * @param rotated @en rotated.  @zh 是否旋转。
     * @deprecated since v1.2, please use [[rotated]] instead.
     */
    setRotated(rotated: boolean): void;
    /**
     * @en Returns the rect of the sprite frame in the texture.
     * If it's an atlas texture, a transparent pixel area is proposed for the actual mapping of the current texture.
     * @zh 获取 SpriteFrame 的纹理矩形区域。
     * 如果是一个 atlas 的贴图，则为当前贴图的实际剔除透明像素区域。
     * @param out @en The output rect. @zh 输出的矩形区域。
     * @returns @en The rect. @zh 矩形区域。
     * @deprecated since v1.2, please use [[rect]].
     */
    getRect(out?: Rect): Rect;
    /**
     * @en Sets the rect of the sprite frame in the texture.
     * @zh 设置 SpriteFrame 的纹理矩形区域。
     * @param rect @en The new rect. @zh 想要设置的 rect。
     * @deprecated since v1.2, please use [[rect]].
     */
    setRect(rect: Rect): void;
    /**
     * @en Returns the original size before trimmed.
     * @zh 获取修剪前的原始大小。
     * @param out @en The output original size. @zh 输出的原始大小。
     * @returns @en The original size. @zh 原始大小。
     * @deprecated since v1.2, please use [[originalSize]].
     */
    getOriginalSize(out?: Size): Size;
    /**
     * @en Sets the original size before trimmed.
     * @zh 设置修剪前的原始大小。
     * @param size @en The new original size. @zh 新设置的原始大小。
     * @deprecated since v1.2, please use [[originalSize]].
     */
    setOriginalSize(size: Size): void;
    /**
     * @en Gets the offset of the frame.
     * @zh 获取偏移量。
     * @param out @en The output offset object. @zh 输出的偏移量。
     * @returns @en The offset object. @zh 偏移量。
     * @deprecated since v1.2, please use [[offset]]
     */
    getOffset(out?: Vec2): Vec2;
    /**
     * @en Sets the offset of the frame.
     * @zh 设置偏移量。
     * @param offset @en The new offset. @zh 新设置的偏移量。
     * @deprecated since v1.2, please use [[offset]]
     */
    setOffset(offset: Vec2): void;
    /**
     * @en Gets the related GFX [[gfx.Texture]] resource.
     * @zh 获取渲染贴图的 GFX 资源。
     * @returns @en Gfx Texture resource. @zh GFX 贴图资源。
     */
    getGFXTexture(): Texture | null;
    /**
     * @en Gets the GFX sampler of its texture.
     * @zh 贴图资源的采样器。
     * @returns @en The GFX sampler resource. @zh GFX贴图采样器。
     */
    getGFXSampler(): Sampler;
    /**
     * @en Gets the hash of its texture.
     * @zh 贴图资源的哈希值。
     * @returns @en Texture`s hash. @zh 贴图哈希值。
     */
    getHash(): number;
    /**
     * @en Gets the sampler hash of its texture.
     * @zh 贴图资源的采样器哈希值。
     * @returns @en Sampler`s hash. @zh 采样器哈希值。
     */
    getSamplerInfo(): Readonly<SamplerInfo>;
    /**
     * @en Resets the sprite frame data.
     * @zh 重置 SpriteFrame 数据。
     * @param info @en SpriteFrame initialization information. @zh SpriteFrame 初始化信息。
     * @param clearData @en Clear Data before initialization. @zh 是否在初始化前清空原有数据。
     */
    reset(info?: ISpriteFrameInitInfo, clearData?: boolean): void;
    /**
     * @en Check whether the rect of the sprite frame is out of the texture boundary.
     * @zh 判断精灵计算的矩形区域是否越界。
     * @param texture @en Texture resources for sprite frame. @zh SpriteFrame 的贴图资源。
     * @returns @en Out of the texture boundary or not. @zh 矩形区域是否越界。
     */
    checkRect(texture: TextureBase): boolean;
    private _calcTrimmedBorder;
    /**
     * @en Make sure the mesh is available, you should call it before using the mesh.
     * @zh 确保 mesh 可用，你应该在使用 mesh 之前调用它。
     */
    ensureMeshData(): void;
    destroy(): boolean;
    /**
     * Calculate UV for sliced
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     * @engineInternal
     * @mangle
     */
    _calculateSlicedUV(): void;
    /**
     * Calculate UV
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     * @engineInternal
     * @mangle
     */
    _calculateUV(): void;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     * @engineInternal
     * @mangle
     */
    _setDynamicAtlasFrame(frame: any): void;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     * @engineInternal
     * @mangle
     */
    _resetDynamicAtlasFrame(): void;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     * @engineInternal
     * @mangle
     */
    _checkPackable(): void;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _serialize(ctxForExporting: any): any;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _deserialize(serializeData: any, handle: any): void;
    /**
     * @en clone a sprite frame.
     * @zh 克隆当前 sprite frame。
     */
    clone(): SpriteFrame;
    protected _refreshTexture(texture: TextureBase): void;
    /**
     * @en complete loading callback.
     * @zh 加载完成回调。
     * @deprecated since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    onLoaded(): void;
    /**
     * @en default init.
     * @zh 默认初始化。
     * @param uuid @en Asset uuid. @zh 资源 uuid。
     * @deprecated since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    initDefault(uuid?: string): void;
    /**
     * @en Check whether the sprite frame is validate.
     * @zh 检查当前 sprite frame 对象是否是有效的。
     * @returns @en validate or not. @zh 是否有效。
     * @deprecated since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    validate(): boolean;
    protected _initVertices(): void;
    protected _updateMeshVertices(): void;
    protected _createMesh(): void;
    protected _updateMesh(): void;
}
export {};
