declare const enum RenderingDebugViewType {
    NONE = 0,
    SINGLE = 1,
    COMPOSITE_AND_MISC = 2
}
/**
 * @zh
 * 渲染单项调试模式
 * @en
 * Rendering single debug mode
 * @readonly
 */
export declare const enum DebugViewSingleType {
    NONE = 0,
    VERTEX_COLOR = 1,
    VERTEX_NORMAL = 2,
    VERTEX_TANGENT = 3,
    WORLD_POS = 4,
    VERTEX_MIRROR = 5,
    FACE_SIDE = 6,
    UV0 = 7,
    UV1 = 8,
    UV_LIGHTMAP = 9,
    PROJ_DEPTH = 10,
    LINEAR_DEPTH = 11,
    FRAGMENT_NORMAL = 12,
    FRAGMENT_TANGENT = 13,
    FRAGMENT_BINORMAL = 14,
    BASE_COLOR = 15,
    DIFFUSE_COLOR = 16,
    SPECULAR_COLOR = 17,
    TRANSPARENCY = 18,
    METALLIC = 19,
    ROUGHNESS = 20,
    SPECULAR_INTENSITY = 21,
    IOR = 22,
    DIRECT_DIFFUSE = 23,
    DIRECT_SPECULAR = 24,
    DIRECT_ALL = 25,
    ENV_DIFFUSE = 26,
    ENV_SPECULAR = 27,
    ENV_ALL = 28,
    EMISSIVE = 29,
    LIGHT_MAP = 30,
    SHADOW = 31,
    AO = 32,
    FRESNEL = 33,
    DIRECT_TRANSMIT_DIFFUSE = 34,
    DIRECT_TRANSMIT_SPECULAR = 35,
    ENV_TRANSMIT_DIFFUSE = 36,
    ENV_TRANSMIT_SPECULAR = 37,
    TRANSMIT_ALL = 38,
    DIRECT_TRT = 39,
    ENV_TRT = 40,
    TRT_ALL = 41,
    FOG = 42
}
/**
 * @zh
 * 渲染组合调试模式
 * @en
 * Rendering composite debug mode
 * @readonly
 */
export declare const enum DebugViewCompositeType {
    DIRECT_DIFFUSE = 0,
    DIRECT_SPECULAR = 1,
    ENV_DIFFUSE = 2,
    ENV_SPECULAR = 3,
    EMISSIVE = 4,
    LIGHT_MAP = 5,
    SHADOW = 6,
    AO = 7,
    NORMAL_MAP = 8,
    FOG = 9,
    TONE_MAPPING = 10,
    GAMMA_CORRECTION = 11,
    FRESNEL = 12,
    TRANSMIT_DIFFUSE = 13,
    TRANSMIT_SPECULAR = 14,
    TRT = 15,
    TT = 16,
    MAX_BIT_COUNT = 17
}
/**
 * @en Rendering debug view control class
 * @zh 渲染调试控制类
 */
export declare class DebugView {
    /**
     * @en Toggle rendering single debug mode.
     * @zh 设置渲染单项调试模式。
     */
    get singleMode(): DebugViewSingleType;
    set singleMode(val: DebugViewSingleType);
    /**
     * @en Toggle normal / pure lighting mode.
     * @zh 切换正常光照和仅光照模式。
     */
    get lightingWithAlbedo(): boolean;
    set lightingWithAlbedo(val: boolean);
    /**
     * @en Toggle CSM layer coloration mode.
     * @zh 切换级联阴影染色调试模式。
     */
    get csmLayerColoration(): boolean;
    set csmLayerColoration(val: boolean);
    get debugViewType(): RenderingDebugViewType;
    protected _singleMode: DebugViewSingleType;
    protected _compositeModeValue: number;
    protected _lightingWithAlbedo: boolean;
    protected _csmLayerColoration: boolean;
    constructor();
    /**
     * @en Whether enabled with specified rendering composite debug mode.
     * @zh 获取指定的渲染组合调试模式是否开启。
     * @param Specified composite type.
     */
    isCompositeModeEnabled(val: number): boolean;
    /**
     * @en Toggle specified rendering composite debug mode.
     * @zh 开关指定的渲染组合调试模式。
     * @param Specified composite type, enable or disable.
     */
    enableCompositeMode(val: DebugViewCompositeType, enable: boolean): void;
    /**
     * @en Toggle all rendering composite debug mode.
     * @zh 开关所有的渲染组合调试模式。
     */
    enableAllCompositeMode(enable: boolean): void;
    /**
     * @en Get rendering debug view on / off state.
     * @zh 查询当前是否开启了渲染调试模式。
     */
    isEnabled(): boolean;
    /**
     * @en Disable all debug view modes, reset to standard rendering mode.
     * @zh 关闭所有的渲染调试模式，恢复到正常渲染。
     */
    reset(): void;
    /**
     * @internal
     */
    protected _activate(): void;
    protected _updatePipeline(): void;
    private _enableCompositeMode;
    private _enableAllCompositeMode;
    private _getType;
}
export {};
