export declare class NativeBufferPool {
    private _arrayBuffers;
    private _chunkSize;
    constructor(dataType: number, entryBits: number, stride: number);
    allocateNewChunk(): ArrayBuffer;
}
export declare class NativeObjectPool<T> {
    constructor(dataType: number, array: T[]);
    bind(index: number, obj: T): void;
}
export declare class NativeBufferAllocator {
    constructor(poolType: number);
    alloc(index: number, bytes: number): ArrayBuffer;
    free(index: number): void;
}
