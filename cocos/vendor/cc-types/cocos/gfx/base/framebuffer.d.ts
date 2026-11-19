import { RenderPass } from './render-pass';
import { Texture } from './texture';
import { GFXObject, FramebufferInfo } from './define';
/**
 * @en GFX frame buffer.
 * @zh GFX 帧缓冲。
 */
export declare abstract class Framebuffer extends GFXObject {
    /**
     * @en Get current render pass.
     * @zh GFX 渲染过程。
     */
    get renderPass(): RenderPass;
    /**
     * @en Get current color views.
     * @zh 颜色纹理视图数组。
     */
    get colorTextures(): (Texture | null)[];
    /**
     * @en Get current depth stencil views.
     * @zh 深度模板纹理视图。
     */
    get depthStencilTexture(): Texture | null;
    get width(): number;
    get height(): number;
    get needRebuild(): boolean;
    /** @mangle */
    protected _renderPass: RenderPass | null;
    /** @mangle */
    protected _colorTextures: (Texture | null)[];
    /** @mangle */
    protected _depthStencilTexture: Texture | null;
    /** @mangle */
    protected _width: number;
    /** @mangle */
    protected _height: number;
    constructor();
    abstract initialize(info: Readonly<FramebufferInfo>): void;
    abstract destroy(): void;
}
