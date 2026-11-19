import { Attribute, Device, InputAssemblerInfo, Buffer, PrimitiveMode, DrawInfo } from '../../gfx';
import { Vec3 } from '../../core';
import { Mesh } from '../../3d/assets/mesh';
/**
 * @en Array views for index buffer
 * @zh 允许存储索引的数组视图。
 */
export type IBArray = Uint8Array | Uint16Array | Uint32Array;
/**
 * @en The interface of geometric information.
 * @zh 几何信息。
 */
export interface IGeometricInfo {
    /**
     * @en Vertex positions.
     * @zh 顶点位置。
     */
    positions: Float32Array;
    /**
     * @en Indices data.
     * @zh 索引数据。
     */
    indices?: IBArray;
    /**
     * @en Whether the geometry is treated as double sided.
     * @zh 是否将图元按双面对待。
     */
    doubleSided?: boolean;
    /**
     * @en The bounding box.
     * @zh 此几何体的轴对齐包围盒。
     */
    boundingBox: {
        max: Vec3 | Readonly<Vec3>;
        min: Vec3 | Readonly<Vec3>;
    };
}
/**
 * @en Flat vertex buffer.
 * @zh 扁平化顶点缓冲区。
 */
export interface IFlatBuffer {
    stride: number;
    count: number;
    buffer: Uint8Array;
}
/**
 * @en Sub mesh for rendering which contains all geometry data, it can be used to create [[gfx.InputAssembler]].
 * @zh 包含所有顶点数据的渲染子网格，可以用来创建 [[gfx.InputAssembler]]。
 */
export declare class RenderingSubMesh {
    /**
     * @en
     * mesh object where this sub mesh locates.
     * @zh
     * 子网格所处的网格模型对象。
     */
    mesh?: Mesh;
    /**
     * @en
     * sub mesh's index in mesh.
     * @zh
     * 子网格在网格模型中的索引。
     */
    subMeshIdx?: number;
    private _flatBuffers;
    private _jointMappedBuffers?;
    private _jointMappedBufferIndices?;
    private _vertexIdChannel?;
    private _geometricInfo?;
    private _vertexBuffers;
    private _attributes;
    private _indexBuffer;
    private _indirectBuffer;
    private _primitiveMode;
    private _iaInfo;
    private _isOwnerOfIndexBuffer;
    private _drawInfo?;
    /**
     * @en
     * sub mesh's constructor.
     * @zh
     * 子网格构造函数。
     * @param vertexBuffers @en vertex buffers. @zh 顶点缓冲区数组。
     * @param attributes @en vertex attributes. @zh 顶点属性数组。
     * @param primitiveMode @en primitive mode. @zh 图元类型。
     * @param indexBuffer @en index buffer. @zh 索引缓冲区。
     * @param indirectBuffer @en indirect buffer. @zh 间接缓冲区。
     */
    constructor(vertexBuffers: Buffer[], attributes: Attribute[], primitiveMode: PrimitiveMode, indexBuffer?: Buffer | null, indirectBuffer?: Buffer | null, isOwnerOfIndexBuffer?: boolean);
    /**
     * @en All vertex attributes used by the sub mesh.
     * @zh 所有顶点属性。
     */
    get attributes(): Attribute[];
    /**
     * @en All vertex buffers used by the sub mesh.
     * @zh 使用的所有顶点缓冲区。
     */
    get vertexBuffers(): Buffer[];
    /**
     * @en Index buffer used by the sub mesh.
     * @zh 使用的索引缓冲区，若未使用则无需指定。
     */
    get indexBuffer(): Buffer | null;
    /**
     * @en Indirect buffer used by the sub mesh.
     * @zh 间接绘制缓冲区。
     */
    get indirectBuffer(): Buffer | null;
    /**
     * @en Primitive mode used by the sub mesh.
     * @zh 图元类型。
     */
    get primitiveMode(): PrimitiveMode;
    /**
     * @en The geometric info of the sub mesh, used for raycast.
     * @zh （用于射线检测的）几何信息。
     */
    get geometricInfo(): IGeometricInfo;
    /**
     * @en Invalidate the geometric info of the sub mesh after geometry changed.
     * @zh 网格更新后，设置（用于射线检测的）几何信息为无效，需要重新计算。
     */
    invalidateGeometricInfo(): void;
    /**
     * @en the draw range.
     * @zh 渲染范围。
     */
    set drawInfo(info: DrawInfo | null | undefined);
    get drawInfo(): DrawInfo | null | undefined;
    /**
     * @en Flatted vertex buffers.
     * @zh 扁平化的顶点缓冲区。
     */
    get flatBuffers(): IFlatBuffer[];
    /**
     * @en generate flatted vertex buffers.
     * @zh 生成扁平化的顶点缓冲区。
     */
    genFlatBuffers(): void;
    /**
     * @en The vertex buffer for joint after mapping.
     * @zh 骨骼索引按映射表处理后的顶点缓冲。
     */
    get jointMappedBuffers(): Buffer[];
    /**
     * @en The input assembler info.
     * @zh 输入汇集器信息。
     */
    get iaInfo(): InputAssemblerInfo;
    /**
     * @en Destroys sub mesh.
     * @zh 销毁子网格。
     */
    destroy(): void;
    /**
     * @en Adds a vertex attribute input called 'a_vertexId' into this sub-mesh.
     * This is useful if you want to simulate `gl_VertexId` in WebGL context prior to 2.0.
     * Once you call this function, the vertex attribute is permanently added.
     * Subsequent calls to this function take no effect.
     * @zh 添加一个 'a_vertexId' 顶点属性， 用于在 WebGL 2.0 之前的平台模拟 `gl_VertexId`，
     * 一旦你调用此函数， 顶点属性永久被添加， 后续调用无效果。
     * @param device @en Device used to create related rendering resources @zh 用于创建相关渲染资源的设备对象
     */
    enableVertexIdChannel(device: Device): void;
    private _allocVertexIdBuffer;
}
