import { Device, Attribute, InputAssembler } from '../../gfx';
import { NativeUIMeshBuffer } from './native-2d';
/**
 * @en Mesh buffer used for 2d rendering, used internally and not of concern to the user.
 * @zh 2d 渲染使用的网格缓冲数据，内部使用，用户不须关心。
 * @deprecated since v3.7.0, this is an engine private interface that will be removed in the future.
 */
export declare class MeshBuffer {
    /**
     * @en The vertex attributes of the buffer.
     * @zh buffer 的顶点属性。
     * @deprecated since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    get attributes(): Attribute[];
    /**
     * @en Number of bytes in vertex format.
     * @zh 顶点格式的字节数。
     * @deprecated since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    get vertexFormatBytes(): number;
    protected _byteOffset: number;
    /**
     * @en byte offset.
     * @zh 字节偏移量。
     * @deprecated since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    get byteOffset(): number;
    set byteOffset(val: number);
    protected _vertexOffset: number;
    /**
     * @en Vertexes offset.
     * @zh 顶点数偏移。
     * @deprecated since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    get vertexOffset(): number;
    set vertexOffset(val: number);
    protected _indexOffset: number;
    /**
     * @en Indices offset.
     * @zh 索引偏移。
     * @deprecated since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    get indexOffset(): number;
    set indexOffset(val: number);
    protected _dirty: boolean;
    /**
     * @en Dirty flag.
     * @zh 脏标记。
     * @deprecated since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    get dirty(): boolean;
    set dirty(val: boolean);
    protected _floatsPerVertex: number;
    /**
     * @en Float numbers per vertex.
     * @zh 每顶点的浮点数长度。
     * @deprecated since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    get floatsPerVertex(): number;
    set floatsPerVertex(val: number);
    protected _vData: Float32Array;
    /**
     * @en Vertexes data.
     * @zh 顶点数据。
     * @deprecated since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    get vData(): Float32Array;
    set vData(val: Float32Array);
    protected _iData: Uint16Array;
    /**
     * @en Indices data.
     * @zh 索引数据。
     * @deprecated since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    get iData(): Uint16Array;
    set iData(val: Uint16Array);
    private _vertexFormatBytes;
    private _initVDataCount;
    private _initIDataCount;
    private _attributes;
    private _iaPool;
    private _iaInfo;
    private _nextFreeIAHandle;
    protected _nativeObj: NativeUIMeshBuffer;
    /**
     * @en Native object.
     * @zh 原生对象。
     * @deprecated since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    get nativeObj(): NativeUIMeshBuffer;
    protected _sharedBuffer: Uint32Array;
    /**
     * @en Native shared buffer.
     * @zh 原生共享缓冲。
     * @deprecated since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    get sharedBuffer(): Uint32Array;
    /**
     * @en Initial native shared buffer.
     * @zh 初始化原生共享缓冲。
     * @deprecated since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    initSharedBuffer(): void;
    /**
     * @en Synchronized native shared buffer.
     * @zh 同步原生共享缓冲。
     * @deprecated since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    syncSharedBufferToNative(): void;
    constructor();
    /**
     * @en Initialize mesh buffer.
     * @zh 初始化对象。
     * @param device @en The GFX device. @zh GFX设备。
     * @param attrs @en The vertex attributes of the buffer. @zh 缓冲区的顶点属性。
     * @param vFloatCount @en The vertexes float count. @zh 每顶点所需的 float 数量。
     * @param iCount @en The indices count. @zh 索引数量。
     * @deprecated since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    initialize(device: Device, attrs: Attribute[], vFloatCount: number, iCount: number): void;
    /**
     * @en Reset state.
     * @zh 重置状态。
     * @deprecated since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    reset(): void;
    destroy(): void;
    /**
     * @en Set dirty flag.
     * @zh 设置脏标签。
     * @deprecated since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    setDirty(): void;
    /**
     * @deprecated since v3.4.0, please use BufferAccessor's request
     * @see [[BufferAccessor.request]]
     */
    request(vertexCount: number, indexCount: number): boolean;
    /**
     * @en require Free input assembler.
     * @zh 请求可用的输入汇集器。
     * @deprecated since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    requireFreeIA(device: Device): InputAssembler;
    /**
     * @en recycle input assembler.
     * @zh 回收输入汇集器。
     * @deprecated since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    recycleIA(ia: InputAssembler): void;
    /**
     * @en check capacity.
     * @zh 检查可分配余量。
     * @deprecated since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    checkCapacity(vertexCount: number, indexCount: number): boolean;
    /**
     * @en Upload and update buffers data.
     * @zh 上传更新缓冲内容。
     * @deprecated since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    uploadBuffers(): void;
    private createNewIA;
}
