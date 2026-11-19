import { BlendFactor, BlendOp, ColorMask, ComparisonFunc, CullMode, PolygonMode, ShadeModel, StencilOp, Color } from './define';
/**
 * @en GFX rasterizer state.
 * @zh GFX 光栅化状态。
 */
export declare class RasterizerState {
    isDiscard: boolean;
    polygonMode: PolygonMode;
    shadeModel: ShadeModel;
    cullMode: CullMode;
    isFrontFaceCCW: boolean;
    depthBiasEnabled: boolean;
    depthBias: number;
    depthBiasClamp: number;
    depthBiasSlop: number;
    isDepthClip: boolean;
    isMultisample: boolean;
    lineWidth: number;
    private _token;
    get native(): RasterizerState;
    constructor(isDiscard?: boolean, polygonMode?: PolygonMode, shadeModel?: ShadeModel, cullMode?: CullMode, isFrontFaceCCW?: boolean, depthBiasEnabled?: boolean, depthBias?: number, depthBiasClamp?: number, depthBiasSlop?: number, isDepthClip?: boolean, isMultisample?: boolean, lineWidth?: number);
    reset(): void;
    assign(rs: RasterizerState): void;
    destroy(): void;
}
/**
 * @en GFX depth stencil state.
 * @zh GFX 深度模板状态。
 */
export declare class DepthStencilState {
    depthTest: boolean;
    depthWrite: boolean;
    depthFunc: ComparisonFunc;
    stencilTestFront: boolean;
    stencilFuncFront: ComparisonFunc;
    stencilReadMaskFront: number;
    stencilWriteMaskFront: number;
    stencilFailOpFront: StencilOp;
    stencilZFailOpFront: StencilOp;
    stencilPassOpFront: StencilOp;
    stencilRefFront: number;
    stencilTestBack: boolean;
    stencilFuncBack: ComparisonFunc;
    stencilReadMaskBack: number;
    stencilWriteMaskBack: number;
    stencilFailOpBack: StencilOp;
    stencilZFailOpBack: StencilOp;
    stencilPassOpBack: StencilOp;
    stencilRefBack: number;
    private _token;
    get native(): DepthStencilState;
    constructor(depthTest?: boolean, depthWrite?: boolean, depthFunc?: ComparisonFunc, stencilTestFront?: boolean, stencilFuncFront?: ComparisonFunc, stencilReadMaskFront?: number, stencilWriteMaskFront?: number, stencilFailOpFront?: StencilOp, stencilZFailOpFront?: StencilOp, stencilPassOpFront?: StencilOp, stencilRefFront?: number, stencilTestBack?: boolean, stencilFuncBack?: ComparisonFunc, stencilReadMaskBack?: number, stencilWriteMaskBack?: number, stencilFailOpBack?: StencilOp, stencilZFailOpBack?: StencilOp, stencilPassOpBack?: StencilOp, stencilRefBack?: number);
    reset(): void;
    assign(dss: DepthStencilState): void;
    destroy(): void;
}
/**
 * @en GFX blend target.
 * @zh GFX 混合目标。
 */
export declare class BlendTarget {
    blend: boolean;
    blendSrc: BlendFactor;
    blendDst: BlendFactor;
    blendEq: BlendOp;
    blendSrcAlpha: BlendFactor;
    blendDstAlpha: BlendFactor;
    blendAlphaEq: BlendOp;
    blendColorMask: ColorMask;
    private _token;
    constructor(blend?: boolean, blendSrc?: BlendFactor, blendDst?: BlendFactor, blendEq?: BlendOp, blendSrcAlpha?: BlendFactor, blendDstAlpha?: BlendFactor, blendAlphaEq?: BlendOp, blendColorMask?: ColorMask);
    reset(): void;
    assign(target: BlendTarget): void;
    destroy(): void;
}
/**
 * @en GFX blend state.
 * @zh GFX 混合状态。
 */
export declare class BlendState {
    isA2C: boolean;
    isIndepend: boolean;
    blendColor: Color;
    targets: BlendTarget[];
    private _token;
    get native(): BlendState;
    constructor(isA2C?: boolean, isIndepend?: boolean, blendColor?: Color, targets?: BlendTarget[]);
    /**
     * @en Should use this function to set target, or it will not work
     * on native platforms, as native can not support this feature,
     * such as `blendState[i] = target;`.
     *
     * @param index The index to set target.
     * @param target The target to be set.
     */
    setTarget(index: number, target: BlendTarget): void;
    reset(): void;
    destroy(): void;
}
