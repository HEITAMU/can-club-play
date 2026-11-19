import { Asset } from '../../asset/assets';
import { SpriteFrame } from './sprite-frame';
import type { TextureBase } from '../../asset/assets/texture-base';
interface ISpriteFrameList {
    [key: string]: SpriteFrame | null;
}
/**
 * @en
 * Class for sprite atlas handling.
 * @zh
 * 精灵图集资源类。
 */
export declare class SpriteAtlas extends Asset {
    /**
     * @en All sprite frames in the sprite atlas.
     * @zh 精灵图集中的所有精灵。
     */
    spriteFrames: ISpriteFrameList;
    constructor(name?: string);
    /**
     * @en Get the [[Texture2D]] asset of the atlas.
     * @zh 获取精灵图集的贴图。
     * @returns @en The texture2d asset. @zh 二维贴图资源。
     */
    getTexture(): TextureBase | null;
    /**
     * @en Gets the [[SpriteFrame]] correspond to the given key in sprite atlas.
     * @zh 根据键值获取精灵。
     *
     * @param key @en The SpriteFrame name. @zh 精灵名字。
     * @returns @en The SpriteFrame asset. @zh 精灵资源。
     */
    getSpriteFrame(key: string): SpriteFrame | null;
    /**
     * @en Returns all sprite frames in the sprite atlas.
     * @zh 获取精灵图集所有精灵。
     * @returns @en All sprite frames. @zh 所有的精灵资源。
     */
    getSpriteFrames(): (SpriteFrame | null)[];
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _serialize(ctxForExporting: any): any;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _deserialize(serializeData: any, handle: any): void;
}
export {};
