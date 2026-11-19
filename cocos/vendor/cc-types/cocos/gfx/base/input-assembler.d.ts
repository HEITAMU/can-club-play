import { Buffer } from './buffer';
import { Attribute, GFXObject, InputAssemblerInfo, DrawInfo } from './define';
/**
 * @en GFX input assembler.
 * @zh GFX 输入汇集器。
 */
export declare abstract class InputAssembler extends GFXObject {
    /**
     * @en Get current attributes.
     * @zh 顶点属性数组。
     */
    get attributes(): Attribute[];
    /**
     * @en Get current vertex buffers.
     * @zh 顶点缓冲数组。
     */
    get vertexBuffers(): Buffer[];
    /**
     * @en Get current index buffer.
     * @zh 索引缓冲。
     */
    get indexBuffer(): Buffer | null;
    /**
     * @en Get the indirect buffer, if present.
     * @zh 间接绘制缓冲。
     */
    get indirectBuffer(): Buffer | null;
    /**
     * @en Get hash of current attributes.
     * @zh 获取顶点属性数组的哈希值。
     */
    get attributesHash(): number;
    /**
     * @en Get current vertex count.
     * @zh 顶点数量。
     */
    set vertexCount(count: number);
    get vertexCount(): number;
    /**
     * @en Get starting vertex.
     * @zh 起始顶点。
     */
    set firstVertex(first: number);
    get firstVertex(): number;
    /**
     * @en Get current index count.
     * @zh 索引数量。
     */
    set indexCount(count: number);
    get indexCount(): number;
    /**
     * @en Get starting index.
     * @zh 起始索引。
     */
    set firstIndex(first: number);
    get firstIndex(): number;
    /**
     * @en Get current vertex offset.
     * @zh 顶点偏移量。
     */
    set vertexOffset(offset: number);
    get vertexOffset(): number;
    /**
     * @en Get current instance count.
     * @zh 实例数量。
     */
    set instanceCount(count: number);
    get instanceCount(): number;
    /**
     * @en Get starting instance.
     * @zh 起始实例。
     */
    set firstInstance(first: number);
    get firstInstance(): number;
    /**
     * @en set the draw range
     * @zh 设置渲染范围
     */
    set drawInfo(info: DrawInfo);
    /**
     * @en get the draw range
     * @zh 获取渲染范围
     */
    get drawInfo(): DrawInfo;
    /** @mangle */
    protected _attributes: Attribute[];
    /** @mangle */
    protected _attributesHash: number;
    /** @mangle */
    protected _vertexBuffers: Buffer[];
    /** @mangle */
    protected _indexBuffer: Buffer | null;
    /** @mangle */
    protected _indirectBuffer: Buffer | null;
    /** @mangle */
    protected _drawInfo: DrawInfo;
    constructor();
    /**
     * @en Get the specified vertex buffer.
     * @zh 获取顶点缓冲。
     * @param stream The stream index of the vertex buffer.
     */
    getVertexBuffer(stream?: number): Buffer | null;
    protected computeAttributesHash(): number;
    abstract initialize(info: Readonly<InputAssemblerInfo>): void;
    abstract destroy(): void;
}
