import { ImageAsset } from '../../../asset/assets/image-asset';
import { Texture2D } from '../../../asset/assets/texture-2d';
import { SpriteFrame } from '../../assets/sprite-frame';
export declare class Atlas {
    private _texture;
    private _width;
    private _height;
    private _x;
    private _y;
    private _nextY;
    private _innerTextureInfos;
    private _innerSpriteFrames;
    private _count;
    constructor(width: number, height: number);
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
    removeSpriteFrame(spriteFrame: SpriteFrame): void;
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
    deleteInnerTexture(texture: Texture2D): void;
    /**
     * @en
     * Whether the atlas is empty.
     *
     * @zh
     * 图集是否为空图集。
     *
     * @method isEmpty
     */
    isEmpty(): boolean;
    /**
     * @en
     * Reset the dynamic atlas.
     *
     * @zh
     * 重置该动态图集。
     *
     * @method reset
    */
    reset(): void;
    /**
     * @en
     * Reset the dynamic atlas, and destroy the texture of the atlas.
     *
     * @zh
     * 重置该动态图集，并销毁该图集的纹理。
     *
     * @method destroy
    */
    destroy(): void;
}
export declare class DynamicAtlasTexture extends Texture2D {
    /**
     * @en
     * Initialize the render texture.
     *
     * @zh
     * 初始化 render texture。
     *
     * @method initWithSize
     */
    initWithSize(width: number, height: number, format?: number): void;
    /**
     * @en
     * Draw a texture to the specified position.
     *
     * @zh
     * 将指定的图片渲染到指定的位置上。
     *
     * @method drawTextureAt
     * @param {Texture2D} image
     * @param {Number} x
     * @param {Number} y
     */
    drawTextureAt(image: ImageAsset, x: number, y: number): void;
}
