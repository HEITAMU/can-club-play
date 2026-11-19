/// <reference types="./@types/globals" />
import { Material } from '../../asset/assets';
import { Attribute, Sampler, Texture } from '../../gfx';
import { Node } from '../../scene-graph';
import { Model } from '../../render-scene/scene';
export declare class NativeRenderDrawInfo {
    constructor();
    get vbBuffer(): ArrayBufferLike;
    set vbBuffer(vbBuffer: ArrayBufferLike);
    get ibBuffer(): ArrayBufferLike;
    set ibBuffer(ibBuffer: ArrayBufferLike);
    get vDataBuffer(): ArrayBufferLike;
    set vDataBuffer(vDataBuffer: ArrayBufferLike);
    get iDataBuffer(): ArrayBufferLike;
    set iDataBuffer(iDataBuffer: ArrayBufferLike);
    get material(): Material | null;
    set material(material: Material | null);
    get texture(): Texture | null;
    set texture(texture: Texture | null);
    get sampler(): Sampler | null;
    set sampler(sampler: Sampler | null);
    get model(): Model | null;
    set model(model: Model | null);
    get subNode(): Node;
    set subNode(node: Node);
    changeMeshBuffer(): any;
    setRender2dBufferToNative(data: TypedArray): any;
    syncSharedBufferToNative(data: TypedArray): any;
    getAttrSharedBufferForJS(): ArrayBufferLike;
}
export declare class NativeRenderEntity {
    constructor(type: number);
    addDynamicRenderDrawInfo(drawInfo: NativeRenderDrawInfo): any;
    setDynamicRenderDrawInfo(drawInfo: NativeRenderDrawInfo, index: number): any;
    removeDynamicRenderDrawInfo(): any;
    clearDynamicRenderDrawInfos(): any;
    clearStaticRenderDrawInfos(): any;
    get node(): Node | null;
    set node(node: Node | null);
    get renderTransform(): Node | null;
    set renderTransform(node: Node | null);
    get stencilStage(): number;
    set stencilStage(stage: number);
    get staticDrawInfoSize(): number;
    set staticDrawInfoSize(size: number);
    getStaticRenderDrawInfo(index: number): NativeRenderDrawInfo;
    getEntitySharedBufferForJS(): ArrayBufferLike;
}
export declare class NativeUIMeshBuffer {
    get vData(): Float32Array;
    set vData(val: Float32Array);
    get iData(): Uint16Array;
    set iData(val: Uint16Array);
    syncSharedBufferToNative(data: TypedArray): any;
    initialize(attrs: Attribute[]): any;
    reset(): any;
    destroy(): any;
    setDirty(): any;
    recycleIA(): any;
    uploadBuffers(): any;
}
export declare class NativeBatcher2d {
    syncMeshBuffersToNative(accId: number, buffers: NativeUIMeshBuffer[]): any;
    update(): any;
    uploadBuffers(): any;
    setSorting2DCount(count: number): any;
    reset(): any;
    syncRootNodesToNative(nodes: Node[]): any;
    releaseDescriptorSetCache(texture: Texture, sampler: Sampler): any;
}
export declare class NativeUIModelProxy {
    initModel(node: any): any;
    activeSubModels(): any;
    uploadData(): any;
    destroy(): any;
    clear(): any;
    getModel(): Model;
    updateModels(model: any): any;
    attachDrawInfo(): any;
    attachNode(node: any): any;
    clearModels(): any;
}
export declare class NativeStencilManager {
    setStencilStage(stageIndex: number): any;
    getStencilSharedBufferForJS(): ArrayBufferLike;
}
