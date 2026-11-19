import { GFXObject, SamplerInfo } from '../define';
/**
 * @en GFX sampler.
 * @zh GFX 采样器。
 */
export declare class Sampler extends GFXObject {
    get info(): Readonly<SamplerInfo>;
    get hash(): number;
    /** @mangle */
    protected _info: SamplerInfo;
    /** @mangle */
    protected _hash: number;
    constructor(info: Readonly<SamplerInfo>, hash: number);
    static computeHash(info: Readonly<SamplerInfo>): number;
    static unpackFromHash(hash: number): SamplerInfo;
}
