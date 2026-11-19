import { Asset } from './asset';
/**
 * @en
 * `BufferAsset` is a kind of assets whose internal data is a section of memory buffer
 * that you can access through the [[BufferAsset.buffer]] function.
 * @zh
 * `BufferAsset` 是一类资产，其内部数据是一段内存缓冲，你可以通过 [[BufferAsset.buffer]] 函数获取其内部数据。
 */
export declare class BufferAsset extends Asset {
    private _buffer;
    constructor(name?: string);
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    get _nativeAsset(): ArrayBuffer | ArrayBufferView;
    set _nativeAsset(bin: ArrayBufferView | ArrayBuffer);
    /**
     * @zh 获取此资源中的缓冲数据。
     * @en Get the ArrayBuffer data of this asset.
     * @returns @en The ArrayBuffer. @zh 缓冲数据。
     */
    buffer(): ArrayBuffer;
    validate(): boolean;
}
