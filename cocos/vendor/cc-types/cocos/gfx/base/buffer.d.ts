import { BufferFlags, BufferUsage, MemoryUsage, GFXObject, BufferInfo, BufferViewInfo, BufferSource } from './define';
/**
 * @en GFX buffer.
 * @zh GFX 缓冲。
 */
export declare abstract class Buffer extends GFXObject {
    /**
     * @en Usage type of the buffer.
     * @zh 缓冲使用方式。
     */
    get usage(): BufferUsage;
    /**
     * @en Memory usage of the buffer.
     * @zh 缓冲的内存使用方式。
     */
    get memUsage(): MemoryUsage;
    /**
     * @en Size of the buffer.
     * @zh 缓冲大小。
     */
    get size(): number;
    /**
     * @en Stride of the buffer.
     * @zh 缓冲步长。
     */
    get stride(): number;
    /**
     * @en Count of the buffer wrt. stride.
     * @zh 缓冲条目数量。
     */
    get count(): number;
    get flags(): BufferFlags;
    /** @mangle */
    protected _usage: BufferUsage;
    /** @mangle */
    protected _memUsage: MemoryUsage;
    /** @mangle */
    protected _size: number;
    /** @mangle */
    protected _stride: number;
    /** @mangle */
    protected _count: number;
    /** @mangle */
    protected _flags: BufferFlags;
    /** @mangle */
    protected _isBufferView: boolean;
    constructor();
    abstract initialize(info: Readonly<BufferInfo> | Readonly<BufferViewInfo>): void;
    abstract destroy(): void;
    /**
     * @en Resize the buffer.
     * @zh 重置缓冲大小。
     * @param size The new buffer size.
     */
    abstract resize(size: number): void;
    /**
     * @en Update the buffer data.
     * @zh 更新缓冲内容。
     * @param buffer The new buffer data.
     * @param size Size in bytes to be updated.
     */
    abstract update(buffer: Readonly<BufferSource>, size?: number): void;
}
