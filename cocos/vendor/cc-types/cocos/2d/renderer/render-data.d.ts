import { Material } from '../../asset/assets/material';
import { TextureBase } from '../../asset/assets/texture-base';
import { Color } from '../../core';
import { SpriteFrame } from '../assets/sprite-frame';
import { UIRenderer } from '../framework/ui-renderer';
import { StaticVBAccessor, StaticVBChunk } from './static-vb-accessor';
import { Device, Attribute, InputAssembler } from '../../gfx';
import { RenderDrawInfo, RenderDrawInfoType } from './render-draw-info';
import { Batcher2D } from './batcher-2d';
import { RenderEntity } from './render-entity';
import type { MeshBuffer } from './mesh-buffer';
/**
 * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
 */
export interface IRenderData {
    x: number;
    y: number;
    z: number;
    u: number;
    v: number;
    color: Color;
}
/**
 * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
 */
export declare class BaseRenderData {
    get vertexCount(): number;
    get indexCount(): number;
    get stride(): number;
    get floatStride(): number;
    get vertexFormat(): Attribute[];
    get drawInfoType(): RenderDrawInfoType;
    set drawInfoType(type: RenderDrawInfoType);
    chunk: StaticVBChunk;
    protected _renderDrawInfo: RenderDrawInfo;
    get renderDrawInfo(): RenderDrawInfo;
    protected _material: Material | null;
    get material(): Material | null;
    set material(val: Material | null);
    protected _dataHash: number;
    get dataHash(): number;
    set dataHash(val: number);
    _isMeshBuffer: boolean;
    protected _vc: number;
    protected _ic: number;
    protected _floatStride: number;
    protected _vertexFormat: Attribute[];
    protected _drawInfoType: RenderDrawInfoType;
    protected _multiOwner: boolean;
    get multiOwner(): boolean;
    set multiOwner(val: boolean);
    protected _batcher: Batcher2D | null;
    get batcher(): Batcher2D;
    constructor(vertexFormat?: Attribute[]);
    isValid(): false | StaticVBAccessor;
    initRenderDrawInfo(comp: UIRenderer, drawInfoType?: RenderDrawInfoType): void;
    /**
     * @deprecated Please use RenderEntity.clearRenderDrawInfos instead.
     */
    removeRenderDrawInfo(comp: UIRenderer): void;
    /**
     * @engineInternal
     * @mangle
     */
    protected setRenderDrawInfoAttributes(): void;
}
/**
 * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
 */
export declare class RenderData extends BaseRenderData {
    static add(vertexFormat?: Attribute[], accessor?: StaticVBAccessor | null): RenderData;
    static remove(data: RenderData): void;
    get dataLength(): number;
    set dataLength(length: number);
    get data(): IRenderData[];
    _vertDirty: boolean;
    get vertDirty(): boolean;
    set vertDirty(val: boolean);
    protected _textureHash: number;
    get textureHash(): number;
    set textureHash(val: number);
    indices: Uint16Array | null;
    set frame(val: SpriteFrame | TextureBase | null);
    get frame(): SpriteFrame | TextureBase | null;
    layer: number;
    nodeDirty: boolean;
    passDirty: boolean;
    textureDirty: boolean;
    hashDirty: boolean;
    private _data;
    private _frame;
    protected _accessor: StaticVBAccessor;
    get accessor(): StaticVBAccessor;
    vertexRow: number;
    vertexCol: number;
    constructor(vertexFormat?: Attribute[], accessor?: StaticVBAccessor | null);
    resize(vertexCount: number, indexCount: number): void;
    updateSize(vertexCount: number, indexCount: number): void;
    /** @mangle */
    protected setRenderDrawInfoAttributes(): void;
    /**
     * @internal
     * @mangle
     */
    fillDrawInfoAttributes(drawInfo: RenderDrawInfo): void;
    /** @mangle */
    protected syncRender2dBuffer(): void;
    resizeAndCopy(vertexCount: number, indexCount: number): void;
    getMeshBuffer(): MeshBuffer | null;
    updateNode(comp: UIRenderer): void;
    updatePass(comp: UIRenderer): void;
    updateTexture(frame: SpriteFrame | TextureBase): void;
    updateHash(): void;
    updateRenderData(comp: UIRenderer, frame: SpriteFrame | TextureBase): void;
    clear(): void;
    static createStaticVBAccessor(attributes: Attribute[], vCount?: number, iCount?: number): StaticVBAccessor;
}
/**
 * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
 */
export declare class MeshRenderData extends BaseRenderData {
    static add(vertexFormat?: Attribute[]): MeshRenderData;
    static remove(data: MeshRenderData): void;
    /**
     * @deprecated
     */
    set formatByte(value: number);
    get formatByte(): number;
    get floatStride(): number;
    /**
     * Index of Float32Array: vData
     */
    get vDataOffset(): number;
    _isMeshBuffer: boolean;
    vData: Float32Array;
    iData: Uint16Array;
    /**
     * First vertex used in the current IA
     */
    vertexStart: number;
    /**
     * Vertex count used in the current IA
     */
    vertexRange: number;
    /**
     * First index used in the current IA
     */
    indexStart: number;
    /**
     * Index count used in the current IA
     */
    indexRange: number;
    lastFilledIndex: number;
    lastFilledVertex: number;
    frame: SpriteFrame | null;
    private _byteLength;
    private _vertexBuffers;
    private _indexBuffer;
    private _iaPool;
    private _iaInfo;
    constructor(vertexFormat?: Attribute[]);
    request(vertexCount: number, indexCount: number): boolean;
    reserve(vertexCount: number, indexCount: number): boolean;
    resize(vertexCount: number, indexCount: number): void;
    updateRange(vertOffset: number, vertexCount: number, indexOffset: number, indexCount: number): void;
    requestIA(device: Device): InputAssembler;
    uploadBuffers(): void;
    freeIAPool(): void;
    reset(): void;
    clear(): void;
    protected _initIAInfo(device: Device): void;
    protected _reallocBuffer(vCount: number, iCount: number): void;
    setRenderDrawInfoAttributes(): void;
    /**
     * only for particle2d
     * @engineInternal
     * @mangle
     */
    particleInitRenderDrawInfo(entity: RenderEntity): void;
}
