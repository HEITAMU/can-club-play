interface IMemoryPool<P extends PoolType> {
    free(handle: IHandle<P>): void;
}
interface IHandle<P extends PoolType> extends Number {
    _: P;
}
declare enum BufferDataType {
    UINT32 = 0,
    FLOAT32 = 1,
    NEVER = 2
}
interface BufferManifest {
    [key: string]: number | string;
    COUNT: number;
}
type BufferDataTypeManifest<E extends BufferManifest> = {
    [key in E[keyof E]]: BufferDataType;
};
type BufferDataMembersManifest<E extends BufferManifest> = {
    [key in E[keyof E]]: number;
};
type BufferArrayType = Float32Array | Uint32Array;
declare class BufferPool<P extends PoolType, E extends BufferManifest> implements IMemoryPool<P> {
    private _dataType;
    private _dataMembers;
    private _elementCount;
    private _entryBits;
    private _stride;
    private _entriesPerChunk;
    private _entryMask;
    private _chunkMask;
    private _poolFlag;
    private _arrayBuffers;
    private _freeLists;
    private _uint32BufferViews;
    private _float32BufferViews;
    private _hasUint32;
    private _hasFloat32;
    private _nativePool;
    constructor(poolType: P, dataType: BufferDataTypeManifest<E>, dataMembers: BufferDataMembersManifest<E>, enumType: E, entryBits?: number);
    alloc(): IHandle<P>;
    getBuffer(handle: IHandle<P>): BufferArrayType;
    getTypedArray<K extends E[keyof E]>(handle: IHandle<P>, element: K): BufferArrayType;
    free(handle: IHandle<P>): void;
}
export declare enum PoolType {
    NODE = 0,
    PASS = 1,
    AABB = 2,
    RENDER2D = 3
}
export declare const NULL_HANDLE: IHandle<any>;
export type Render2dHandle = IHandle<PoolType.RENDER2D>;
export declare enum Render2dView {
    POSITION = 0,
    UV = 3,
    COLOR = 5,
    COUNT = 9
}
export declare const Render2dPool: BufferPool<PoolType.RENDER2D, typeof Render2dView>;
export type NodeHandle = IHandle<PoolType.NODE>;
export declare enum NodeView {
    DIRTY_FLAG = 0,
    LAYER = 1,
    WORLD_SCALE = 2,
    WORLD_POSITION = 5,
    WORLD_ROTATION = 8,
    WORLD_MATRIX = 12,
    LOCAL_SCALE = 28,
    LOCAL_POSITION = 31,
    LOCAL_ROTATION = 34,
    COUNT = 38
}
export declare const NodePool: BufferPool<PoolType.NODE, typeof NodeView>;
export type PassHandle = IHandle<PoolType.PASS>;
export declare enum PassView {
    PRIORITY = 0,
    STAGE = 1,
    PHASE = 2,
    PRIMITIVE = 3,
    BATCHING_SCHEME = 4,
    DYNAMIC_STATE = 5,
    HASH = 6,
    COUNT = 7
}
export declare const PassPool: BufferPool<PoolType.PASS, typeof PassView>;
export type AABBHandle = IHandle<PoolType.AABB>;
export declare enum AABBView {
    CENTER = 0,
    HALFEXTENTS = 3,
    COUNT = 6
}
export declare const AABBPool: BufferPool<PoolType.AABB, typeof AABBView>;
export {};
