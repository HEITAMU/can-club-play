import { GFXObject, GeneralBarrierInfo } from '../define';
/**
 * @en GFX global barrier.
 * @zh GFX 全局内存屏障。
 */
export declare class GeneralBarrier extends GFXObject {
    get info(): Readonly<GeneralBarrierInfo>;
    get hash(): number;
    /** @mangle */
    protected _info: GeneralBarrierInfo;
    /** @mangle */
    protected _hash: number;
    constructor(info: Readonly<GeneralBarrierInfo>, hash: number);
    static computeHash(info: Readonly<GeneralBarrierInfo>): number;
}
