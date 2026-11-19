import { Asset, Texture2D } from '../asset/assets';
export declare const TERRAIN_MAX_LEVELS = 4;
export declare const TERRAIN_MAX_BLEND_LAYERS = 4;
export declare const TERRAIN_MAX_LAYER_COUNT = 256;
export declare const TERRAIN_BLOCK_TILE_COMPLEXITY = 32;
export declare const TERRAIN_BLOCK_VERTEX_COMPLEXITY = 33;
export declare const TERRAIN_BLOCK_VERTEX_SIZE = 8;
export declare const TERRAIN_HEIGHT_BASE = 32768;
export declare const TERRAIN_HEIGHT_FACTORY: number;
export declare const TERRAIN_HEIGHT_FACTORY_V7: number;
export declare const TERRAIN_HEIGHT_FMIN: number;
export declare const TERRAIN_HEIGHT_FMAX: number;
export declare const TERRAIN_NORTH_INDEX = 0;
export declare const TERRAIN_SOUTH_INDEX = 1;
export declare const TERRAIN_WEST_INDEX = 2;
export declare const TERRAIN_EAST_INDEX = 3;
export declare const TERRAIN_DATA_VERSION = 16842753;
export declare const TERRAIN_DATA_VERSION2 = 16842754;
export declare const TERRAIN_DATA_VERSION3 = 16842755;
export declare const TERRAIN_DATA_VERSION4 = 16842756;
export declare const TERRAIN_DATA_VERSION5 = 16842757;
export declare const TERRAIN_DATA_VERSION6 = 16842758;
export declare const TERRAIN_DATA_VERSION7 = 16842759;
export declare const TERRAIN_DATA_VERSION8 = 16842760;
export declare const TERRAIN_DATA_VERSION_DEFAULT = 16843025;
/**
 * @en terrain layer info
 * @zh 地形纹理信息
 */
export declare class TerrainLayerInfo {
    slot: number;
    tileSize: number;
    detailMap: Texture2D | null;
    normalMap: Texture2D | null;
    roughness: number;
    metallic: number;
}
/**
 * @en terrain layer binary info
 * @zh 地形纹理二进制信息
 */
export declare class TerrainLayerBinaryInfo {
    slot: number;
    tileSize: number;
    roughness: number;
    metallic: number;
    detailMapId: string;
    normalMapId: string;
}
/**
 * @en terrain asset
 * @zh 地形资源
 */
export declare class TerrainAsset extends Asset {
    protected _version: number;
    protected _data: Uint8Array | null;
    protected _tileSize: number;
    protected _blockCount: number[];
    protected _weightMapSize: number;
    protected _lightMapSize: number;
    protected _heights: Uint16Array;
    protected _normals: Float32Array;
    protected _weights: Uint8Array;
    protected _layerBuffer: number[];
    protected _layerBinaryInfos: TerrainLayerBinaryInfo[];
    protected _layerInfos: TerrainLayerInfo[];
    constructor();
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    get _nativeAsset(): ArrayBuffer;
    set _nativeAsset(value: ArrayBuffer);
    /**
     * @en version
     * @zh 版本
     */
    get version(): number;
    /**
     * @en tile size
     * @zh 栅格大小
     */
    set tileSize(value: number);
    get tileSize(): number;
    /**
     * @en block count
     * @zh 块数量
     */
    set blockCount(value: number[]);
    get blockCount(): number[];
    /**
     * @en light map size
     * @zh 光照图大小
     */
    set lightMapSize(value: number);
    get lightMapSize(): number;
    /**
     * @en weight map size
     * @zh 权重图大小
     */
    set weightMapSize(value: number);
    get weightMapSize(): number;
    /**
     * @en height buffer
     * @zh 高度缓存
     */
    set heights(value: Uint16Array);
    get heights(): Uint16Array;
    /**
     * @en normal buffer
     * @zh 法线缓存
     */
    set normals(value: Float32Array);
    get normals(): Float32Array;
    /**
     * @en weight buffer
     * @zh 权重缓存
     */
    set weights(value: Uint8Array);
    get weights(): Uint8Array;
    /**
     * @en layer buffer
     * @zh 纹理索引缓存
     */
    set layerBuffer(value: number[]);
    get layerBuffer(): number[];
    /**
     * @en layer info
     * @zh 纹理信息
     */
    set layerInfos(value: TerrainLayerInfo[]);
    get layerInfos(): TerrainLayerInfo[];
    get layerBinaryInfos(): TerrainLayerBinaryInfo[];
    /**
     * @en get layer
     * @zh 获得纹理索引
     * @param xBlock block index x
     * @param yBlock block index y
     * @param layerId layer id
     */
    getLayer(xBlock: number, yBlock: number, layerId: number): number;
    getHeight(i: number, j: number): number;
    getVertexCountI(): number;
    getVertexCountJ(): number;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _setNativeData(_nativeData: Uint8Array): void;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _loadNativeData(_nativeData: Uint8Array): boolean;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _exportNativeData(): Uint8Array;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _exportDefaultNativeData(): Uint8Array;
}
