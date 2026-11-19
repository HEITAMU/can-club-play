import { GFXObject, BufferBarrierInfo } from '../define';
/**
 * @en GFX buffer barrier.
 * @zh GFX buffer内存屏障。
 */
export declare class BufferBarrier extends GFXObject {
    get info(): Readonly<BufferBarrierInfo>;
    get hash(): number;
    /** @mangle */
    protected _info: BufferBarrierInfo;
    /** @mangle */
    protected _hash: number;
    constructor(info: Readonly<BufferBarrierInfo>, hash: number);
    static computeHash(info: Readonly<BufferBarrierInfo>): number;
}
