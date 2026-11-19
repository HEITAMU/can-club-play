import { IRenderData } from './render-data';
import { NativeRenderDrawInfo } from './native-2d';
import { Node } from '../../scene-graph';
import { Sampler, Texture } from '../../gfx';
import { Model } from '../../render-scene/scene';
import { Material } from '../../asset/assets';
export declare enum AttrUInt8ArrayView {
    DrawInfoType = 0,
    VertDirty = 1,
    BooleanValues = 2,
    Stride = 3,
    Count = 4
}
export declare enum AttrUInt16ArrayView {
    BufferID = 0,
    AccessorID = 1,
    Count = 2
}
export declare enum AttrUInt32ArrayView {
    VertexOffset = 0,
    IndexOffset = 1,
    VBCount = 2,
    IBCount = 3,
    DataHash = 4,
    Count = 5
}
export declare enum RenderDrawInfoType {
    COMP = 0,
    MODEL = 1,
    MIDDLEWARE = 2,
    SUB_NODE = 3
}
/** @mangle */
export declare class RenderDrawInfo {
    protected _accId: number;
    protected _bufferId: number;
    protected _vertexOffset: number;
    protected _indexOffset: number;
    protected _vb: Float32Array | null;
    protected _ib: Uint16Array | null;
    protected _vData: Float32Array | null;
    protected _iData: Uint16Array | null;
    protected _vertDirty: boolean;
    protected _vbCount: number;
    protected _ibCount: number;
    protected _dataHash: number;
    protected _isMeshBuffer: boolean;
    protected _material: Material | null;
    protected _texture: Texture | null;
    protected _sampler: Sampler | null;
    protected _stride: number;
    protected _useLocal: boolean;
    protected _model: Model | null;
    protected _drawInfoType: RenderDrawInfoType;
    protected _subNode: Node | null;
    protected _nativeObj: NativeRenderDrawInfo;
    protected _uint8SharedBuffer: Uint8Array;
    protected _uint16SharedBuffer: Uint16Array;
    protected _uint32SharedBuffer: Uint32Array;
    protected _render2dBuffer: Float32Array | null;
    constructor(nativeDrawInfo?: NativeRenderDrawInfo);
    get nativeObj(): NativeRenderDrawInfo;
    get render2dBuffer(): Float32Array | null;
    private init;
    clear(): void;
    setAccId(accId: number): void;
    setBufferId(bufferId: number): void;
    setAccAndBuffer(accId: number, bufferId: number): void;
    setVertexOffset(vertexOffset: number): void;
    setIndexOffset(indexOffset: number): void;
    setVB(vbBuffer: Float32Array): void;
    setIB(ibBuffer: Uint16Array): void;
    setVData(vDataBuffer: ArrayBufferLike): void;
    setIData(iDataBuffer: ArrayBufferLike): void;
    setVBCount(vbCount: number): void;
    setIBCount(ibCount: number): void;
    setVertDirty(val: boolean): void;
    setDataHash(dataHash: number): void;
    setIsMeshBuffer(isMeshBuffer: boolean): void;
    setVertexPositionInWorld(isVertexPositionInWorld: boolean): void;
    setMaterial(material: Material): void;
    setTexture(texture: Texture | null): void;
    setSampler(sampler: Sampler | null): void;
    setModel(model: Model): void;
    setDrawInfoType(drawInfoType: RenderDrawInfoType): void;
    setSubNode(node: Node): void;
    setStride(stride: number): void;
    initRender2dBuffer(): void;
    fillRender2dBuffer(vertexDataArr: IRenderData[]): void;
}
