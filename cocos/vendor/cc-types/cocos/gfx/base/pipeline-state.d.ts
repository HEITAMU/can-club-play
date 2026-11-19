import { PipelineLayout } from './pipeline-layout';
import { RenderPass } from './render-pass';
import { Shader } from './shader';
import { DynamicStateFlags, GFXObject, PrimitiveMode, InputState, PipelineBindPoint } from './define';
import { BlendState, BlendTarget, RasterizerState, DepthStencilState } from './pipeline-sub-state';
export { BlendState, BlendTarget, RasterizerState, DepthStencilState };
export declare class PipelineStateInfo {
    shader: Shader;
    pipelineLayout: PipelineLayout;
    renderPass: RenderPass;
    inputState: InputState;
    rasterizerState: RasterizerState;
    depthStencilState: DepthStencilState;
    blendState: BlendState;
    primitive: PrimitiveMode;
    dynamicStates: DynamicStateFlags;
    bindPoint: PipelineBindPoint;
    private _token;
    constructor(shader?: Shader, pipelineLayout?: PipelineLayout, renderPass?: RenderPass, inputState?: InputState, rasterizerState?: RasterizerState, depthStencilState?: DepthStencilState, blendState?: BlendState, primitive?: PrimitiveMode, dynamicStates?: DynamicStateFlags, bindPoint?: PipelineBindPoint);
}
/**
 * @en GFX pipeline state.
 * @zh GFX 管线状态。
 */
export declare abstract class PipelineState extends GFXObject {
    /**
     * @en Get current shader.
     * @zh GFX 着色器。
     */
    get shader(): Shader;
    /**
     * @en Get current pipeline layout.
     * @zh GFX 管线布局。
     */
    get pipelineLayout(): PipelineLayout;
    /**
     * @en Get current primitve mode.
     * @zh GFX 图元模式。
     */
    get primitive(): PrimitiveMode;
    /**
     * @en Get current rasterizer state.
     * @zh GFX 光栅化状态。
     */
    get rasterizerState(): RasterizerState;
    /**
     * @en Get current depth stencil state.
     * @zh GFX 深度模板状态。
     */
    get depthStencilState(): DepthStencilState;
    /**
     * @en Get current blend state.
     * @zh GFX 混合状态。
     */
    get blendState(): BlendState;
    /**
     * @en Get current input state.
     * @zh GFX 输入状态。
     */
    get inputState(): InputState;
    /**
     * @en Get current dynamic states.
     * @zh GFX 动态状态数组。
     */
    get dynamicStates(): DynamicStateFlags;
    /**
     * @en Get current render pass.
     * @zh GFX 渲染过程。
     */
    get renderPass(): RenderPass;
    /** @mangle */
    protected _shader: Shader | null;
    /** @mangle */
    protected _pipelineLayout: PipelineLayout | null;
    /** @mangle */
    protected _primitive: PrimitiveMode;
    /** @mangle */
    protected _is: InputState | null;
    /** @mangle */
    protected _rs: RasterizerState;
    /** @mangle */
    protected _dss: DepthStencilState;
    /** @mangle */
    protected _bs: BlendState;
    /** @mangle */
    protected _dynamicStates: DynamicStateFlags;
    /** @mangle */
    protected _renderPass: RenderPass | null;
    constructor();
    abstract initialize(info: Readonly<PipelineStateInfo>): void;
    abstract destroy(): void;
}
