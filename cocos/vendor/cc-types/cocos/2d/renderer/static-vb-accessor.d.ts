import { Device, Attribute } from '../../gfx';
import { MeshBuffer } from './mesh-buffer';
import { BufferAccessor } from './buffer-accessor';
/**
 * @internal
 */
export declare class StaticVBChunk {
    vertexAccessor: StaticVBAccessor;
    bufferId: number;
    meshBuffer: MeshBuffer;
    vertexOffset: number;
    vb: Float32Array;
    indexCount: number;
    get ib(): Readonly<Uint16Array>;
    private _ib;
    constructor(vertexAccessor: StaticVBAccessor, bufferId: number, meshBuffer: MeshBuffer, vertexOffset: number, vb: Float32Array, indexCount: number);
    setIndexBuffer(indices: ArrayLike<number>): void;
}
export declare class StaticVBAccessor extends BufferAccessor {
    static IB_SCALE: number;
    static ID_COUNT: number;
    private _freeLists;
    private _vCount;
    private _iCount;
    private _id;
    get id(): number;
    constructor(device: Device, attributes: Attribute[], vCount?: number, iCount?: number);
    destroy(): void;
    reset(): void;
    getVertexBuffer(bid: number): Float32Array;
    getIndexBuffer(bid: number): Uint16Array;
    getMeshBuffer(bid: number): MeshBuffer;
    uploadBuffers(): void;
    appendIndices(bufferId: number, indices: Uint16Array): void;
    allocateChunk(vertexCount: number, indexCount: number): StaticVBChunk | null;
    recycleChunk(chunk: StaticVBChunk): void;
    private _allocateChunkFromEntry;
    private _allocateBuffer;
    static generateID(): number;
}
