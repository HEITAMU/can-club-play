import { Format, Texture, Device } from '../../gfx';
export declare function nearestPOT(num: number): number;
export interface ITextureBuffer {
    texture: Texture;
    size: number;
    start: number;
    end: number;
}
export interface ITextureBufferHandle {
    chunkIdx: number;
    start: number;
    end: number;
    texture: Texture;
}
export interface ITextureBufferPoolInfo {
    format: Format;
    inOrderFree?: boolean;
    alignment?: number;
    roundUpFn?: (size: number, formatSize: number) => number;
}
export declare class TextureBufferPool {
    private _device;
    private _format;
    private _formatSize;
    private _chunks;
    private _chunkCount;
    private _handles;
    private _region0;
    private _region1;
    private _region2;
    private _roundUpFn;
    private _bufferViewCtor;
    private _channels;
    private _alignment;
    constructor(device: Device);
    initialize(info: ITextureBufferPoolInfo): void;
    destroy(): void;
    alloc(size: number, chunkIdx?: number): ITextureBufferHandle;
    free(handle: ITextureBufferHandle): void;
    createChunk(length: number): number;
    update(handle: ITextureBufferHandle, buffer: ArrayBuffer): void;
    private _findAvailableSpace;
    private _McDonaldAlloc;
}
