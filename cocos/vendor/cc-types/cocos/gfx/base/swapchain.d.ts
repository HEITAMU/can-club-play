import { GFXObject, SurfaceTransform, SwapchainInfo } from './define';
import { Texture } from './texture';
/**
 * @en GFX Swapchain.
 * @zh GFX 交换链。
 */
export declare abstract class Swapchain extends GFXObject {
    /**
     * @en The color texture of this swapchain.
     * @zh 当前交换链的颜色缓冲。
     */
    get colorTexture(): Texture;
    /**
     * @en The depth stencil texture of this swapchain.
     * @zh 当前交换链的深度模板缓冲。
     */
    get depthStencilTexture(): Texture;
    /**
     * @en The surface transform to be applied in projection matrices.
     * @zh 需要在投影矩阵中应用的表面变换。
     */
    get surfaceTransform(): SurfaceTransform;
    get width(): number;
    get height(): number;
    /** @mangle */
    protected _transform: SurfaceTransform;
    /** @mangle */
    protected _colorTexture: Texture;
    /** @mangle */
    protected _depthStencilTexture: Texture;
    constructor();
    abstract initialize(info: Readonly<SwapchainInfo>): void;
    abstract resize(width: number, height: number, surfaceTransform: SurfaceTransform): void;
    abstract destroy(): void;
}
