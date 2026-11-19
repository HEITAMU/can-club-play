import { System } from '../../../core';
import { DynamicAtlasTexture } from './atlas';
import { SpriteFrame } from '../../assets';
import { TextureBase } from '../../../asset/assets/texture-base';
/**
 * @en The dynamic atlas manager which manages all runtime dynamic packed atlas texture for UI rendering.
 * It generates a maximum of [[maxAtlasCount]] atlas texture, all atlas texture have the size of [[textureSize]].
 * Normally the [[Root.batcher2D]] is in charge of submitting sprite frames to the dynamic atlas manager, the process is transparent to user.
 * Note that the first committed sprite frame will define the filter settings of the atlas textures,
 * only sprite frame with the same setting will be accepted afterward.
 * @zh 动态合图的管理器，管理所有运行时动态合成的图集，主要用于 UI 渲染。
 * 该管理器支持生成 [[maxAtlasCount]] 张动态合图，并且所有合图都有同样的 [[textureSize]] 像素尺寸。
 * 一般来说 [[Root.batcher2D]] 负责提交 [[SpriteFrame]] 到动态合图管理器中，这个过程对于开发者是透明的。
 * 需要注意的是，第一个提交的 [[SpriteFrame]] 会决定图集的过滤器参数，在此之后只有同样参数的贴图才会被管理器接受。
 */
export declare class DynamicAtlasManager extends System {
    static instance: DynamicAtlasManager;
    private _atlases;
    private _atlasIndex;
    private _maxAtlasCount;
    private _textureSize;
    private _maxFrameSize;
    private _textureBleeding;
    private _enabled;
    constructor();
    /**
     * @en
     * Enable or disable the dynamic atlas.
     *
     * @zh
     * 开启或关闭动态图集。
     */
    get enabled(): boolean;
    set enabled(value: boolean);
    /**
     * @en
     * The maximum number of atlases that can be created.
     *
     * @zh
     * 可以创建的最大图集数量。
     */
    get maxAtlasCount(): number;
    set maxAtlasCount(value: number);
    /**
     * @en
     * Get the current created atlas count.
     *
     * @zh
     * 获取当前已经创建的图集数量。
     */
    get atlasCount(): number;
    /**
     * @en
     * Whether to enable textureBleeding.
     *
     * @zh
     * 是否开启 textureBleeding。
     */
    get textureBleeding(): boolean;
    set textureBleeding(enable: boolean);
    /**
     * @en
     * The size of the created atlas.
     *
     * @zh
     * 创建的图集的宽高。
     */
    get textureSize(): number;
    set textureSize(value: number);
    /**
     * @en
     * The maximum size of the picture that can be added to the atlas.
     *
     * @zh
     * 可以添加进图集的图片的最大尺寸。
     */
    get maxFrameSize(): number;
    set maxFrameSize(value: number);
    private newAtlas;
    private beforeSceneLoad;
    /**
     * @internal
     */
    init(): void;
    /**
     * @en
     * Append a sprite frame into the dynamic atlas.
     *
     * @zh
     * 添加碎图进入动态图集。
     *
     * @method insertSpriteFrame
     * @param spriteFrame  the sprite frame that will be inserted in the atlas.
     */
    insertSpriteFrame(spriteFrame: SpriteFrame): {
        x: number;
        y: number;
        texture: DynamicAtlasTexture;
    } | null;
    /**
     * @en
     * Reset all dynamic atlases, and all existing ones will be destroyed.
     *
     * @zh
     * 重置所有动态图集，已有的动态图集会被销毁。
     *
     * @method reset
    */
    reset(): void;
    /**
     * @en
     * Delete a sprite from the atlas.
     *
     * @zh
     * 从动态图集中删除某张碎图。
     *
     * @method deleteAtlasSpriteFrame
     * @param spriteFrame  the sprite frame that will be removed from the atlas.
     */
    deleteAtlasSpriteFrame(spriteFrame: SpriteFrame): void;
    /**
     * @en
     * Delete a texture from the atlas.
     *
     * @zh
     * 从动态图集中删除某张纹理。
     *
     * @method deleteAtlasTexture
     * @param texture  the texture that will be removed from the atlas.
     */
    deleteAtlasTexture(texture: TextureBase): void;
    /**
     * @en
     * Pack the sprite in the dynamic atlas and update the atlas information of the sprite frame.
     *
     * @zh
     * 将图片打入动态图集，并更新该图片的图集信息。
     *
     * @method packToDynamicAtlas
     * @param frame  the sprite frame that will be packed in the dynamic atlas.
     */
    packToDynamicAtlas(comp: any, frame: SpriteFrame | null): void;
}
/**
 * @en The singleton instance of [[DynamicAtlasManager]], please use [[DynamicAtlasManager.instance]] instead.
 * @zh [[DynamicAtlasManager]] 的单例对象，请直接使用 [[DynamicAtlasManager.instance]]。
 * @deprecated since v3.7
 */
export declare const dynamicAtlasManager: DynamicAtlasManager;
