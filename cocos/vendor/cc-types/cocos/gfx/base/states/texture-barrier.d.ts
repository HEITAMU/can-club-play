import { GFXObject, TextureBarrierInfo } from '../define';
/**
 * @en GFX texture barrier.
 * @zh GFX 贴图内存屏障。
 */
export declare class TextureBarrier extends GFXObject {
    get info(): Readonly<TextureBarrierInfo>;
    get hash(): number;
    /** @mangle */
    protected _info: TextureBarrierInfo;
    /** @mangle */
    protected _hash: number;
    constructor(info: Readonly<TextureBarrierInfo>, hash: number);
    static computeHash(info: Readonly<TextureBarrierInfo>): number;
}
