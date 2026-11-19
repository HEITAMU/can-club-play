import { GFXObject, ColorAttachment, DepthStencilAttachment, SubpassInfo, RenderPassInfo } from './define';
/**
 * @en GFX render pass.
 * @zh GFX 渲染过程。
 */
export declare abstract class RenderPass extends GFXObject {
    /** @mangle */
    protected _colorInfos: ColorAttachment[];
    /** @mangle */
    protected _depthStencilInfo: DepthStencilAttachment | null;
    /** @mangle */
    protected _subpasses: SubpassInfo[];
    /** @mangle */
    protected _hash: number;
    get colorAttachments(): Readonly<ColorAttachment[]>;
    get depthStencilAttachment(): Readonly<DepthStencilAttachment> | null;
    get subPasses(): Readonly<SubpassInfo[]>;
    get hash(): number;
    constructor();
    protected computeHash(): number;
    abstract initialize(info: Readonly<RenderPassInfo>): void;
    abstract destroy(): void;
}
