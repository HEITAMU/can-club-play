import { API, Feature, MemoryStatus, CommandBufferInfo, BufferInfo, BufferViewInfo, TextureInfo, TextureViewInfo, SamplerInfo, DescriptorSetInfo, ShaderInfo, InputAssemblerInfo, RenderPassInfo, FramebufferInfo, DescriptorSetLayoutInfo, PipelineLayoutInfo, QueueInfo, BufferTextureCopy, DeviceInfo, DeviceCaps, GeneralBarrierInfo, TextureBarrierInfo, BufferBarrierInfo, SwapchainInfo, BindingMappingInfo, Format, FormatFeature, TextureType, SampleCount, TextureUsage, TextureFlags } from './define';
import { Buffer } from './buffer';
import { CommandBuffer } from './command-buffer';
import { DescriptorSet } from './descriptor-set';
import { DescriptorSetLayout } from './descriptor-set-layout';
import { PipelineLayout } from './pipeline-layout';
import { Framebuffer } from './framebuffer';
import { InputAssembler } from './input-assembler';
import { PipelineState, PipelineStateInfo } from './pipeline-state';
import { Queue } from './queue';
import { RenderPass } from './render-pass';
import { Sampler } from './states/sampler';
import { Shader } from './shader';
import { Texture } from './texture';
import { GeneralBarrier } from './states/general-barrier';
import { TextureBarrier } from './states/texture-barrier';
import { BufferBarrier } from './states/buffer-barrier';
import { Swapchain } from './swapchain';
/**
 * @en GFX Device.
 * @zh GFX 设备。
 */
export declare abstract class Device {
    constructor();
    /**
     * @en Current rendering API.
     * @zh 当前 GFX 使用的渲染 API。
     */
    get gfxAPI(): API;
    /**
     * @en GFX default queue.
     * @zh GFX 默认队列。
     */
    get queue(): Queue;
    /**
     * @en GFX default command buffer.
     * @zh GFX 默认命令缓冲。
     */
    get commandBuffer(): CommandBuffer;
    /**
     * @en The current format of the swapchain being used.
     * @zh 当前使用的swapchain的格式。
     */
    get swapchainFormat(): Format;
    /**
     * @en Renderer description.
     * @zh 渲染器描述。
     */
    get renderer(): string;
    /**
     * @en Vendor description.
     * @zh 厂商描述。
     */
    get vendor(): string;
    /**
     * @en Number of draw calls currently recorded.
     * @zh 绘制调用次数。
     */
    get numDrawCalls(): number;
    /**
     * @en Number of instances currently recorded.
     * @zh 绘制 Instance 数量。
     */
    get numInstances(): number;
    /**
     * @en Number of triangles currently recorded.
     * @zh 渲染三角形数量。
     */
    get numTris(): number;
    /**
     * @en Total memory size currently allocated.
     * @zh 内存状态。
     */
    get memoryStatus(): MemoryStatus;
    /**
     * @en Current device capabilities.
     * @zh 当前设备能力数据。
     */
    get capabilities(): DeviceCaps;
    /**
     * @en Current device binding mappings.
     * @zh 当前设备的绑定槽位映射关系。
     */
    get bindingMappingInfo(): BindingMappingInfo;
    /** @mangle */
    protected _gfxAPI: API;
    /** @mangle */
    protected _renderer: string;
    /** @mangle */
    protected _vendor: string;
    /** @mangle */
    protected _features: boolean[];
    /** @mangle */
    protected _formatFeatures: import("./define").FormatFeatureBit[];
    /** @mangle */
    protected _queue: Queue | null;
    /** @mangle */
    protected _cmdBuff: CommandBuffer | null;
    /** @mangle */
    protected _numDrawCalls: number;
    /** @mangle */
    protected _numInstances: number;
    /** @mangle */
    protected _numTris: number;
    /** @mangle */
    protected _memoryStatus: MemoryStatus;
    /** @mangle */
    protected _caps: DeviceCaps;
    /** @mangle */
    protected _bindingMappingInfo: BindingMappingInfo;
    /** @mangle */
    protected _samplers: Map<number, Sampler>;
    /** @mangle */
    protected _generalBarrierss: Map<number, GeneralBarrier>;
    /** @mangle */
    protected _textureBarriers: Map<number, TextureBarrier>;
    /** @mangle */
    protected _bufferBarriers: Map<number, BufferBarrier>;
    /** @mangle */
    protected _swapchainFormat: Format;
    /** @mangle */
    static canvas: HTMLCanvasElement;
    abstract initialize(info: Readonly<DeviceInfo>): boolean | Promise<boolean>;
    abstract destroy(): void;
    /**
     * @en Acquire next swapchain image.
     * @zh 获取下一个交换链缓冲。
     */
    abstract acquire(swapchains: Readonly<Swapchain[]>): void;
    /**
     * @en Present current swapchain image.
     * @zh 上屏当前交换链缓冲。
     */
    abstract present(): void;
    /**
     * @en Flush the specified command buffers.
     * @zh 实际录制指定的命令缓冲。
     */
    abstract flushCommands(cmdBuffs: Readonly<CommandBuffer[]>): void;
    /**
     * @en Create command buffer.
     * @zh 创建命令缓冲。
     * @param info GFX command buffer description info.
     */
    abstract createCommandBuffer(info: Readonly<CommandBufferInfo>): CommandBuffer;
    /**
     * @en Create swapchain.
     * @zh 创建交换链。
     * @param info GFX swapchain description info.
     */
    abstract createSwapchain(info: Readonly<SwapchainInfo>): Swapchain;
    /**
     * @en Create buffer.
     * @zh 创建缓冲。
     * @param info GFX buffer description info.
     */
    abstract createBuffer(info: Readonly<BufferInfo> | BufferViewInfo): Buffer;
    /**
     * @en Create texture.
     * @zh 创建纹理。
     * @param info GFX texture description info.
     */
    abstract createTexture(info: Readonly<TextureInfo> | TextureViewInfo): Texture;
    /**
     * @en Create descriptor sets.
     * @zh 创建描述符集组。
     * @param info GFX descriptor sets description info.
     */
    abstract createDescriptorSet(info: Readonly<DescriptorSetInfo>): DescriptorSet;
    /**
     * @en Create shader.
     * @zh 创建着色器。
     * @param info GFX shader description info.
     */
    abstract createShader(info: Readonly<ShaderInfo>): Shader;
    /**
     * @en Create input assembler.
     * @zh 创建纹理。
     * @param info GFX input assembler description info.
     */
    abstract createInputAssembler(info: Readonly<InputAssemblerInfo>): InputAssembler;
    /**
     * @en Create render pass.
     * @zh 创建渲染过程。
     * @param info GFX render pass description info.
     */
    abstract createRenderPass(info: Readonly<RenderPassInfo>): RenderPass;
    /**
     * @en Create frame buffer.
     * @zh 创建帧缓冲。
     * @param info GFX frame buffer description info.
     */
    abstract createFramebuffer(info: Readonly<FramebufferInfo>): Framebuffer;
    /**
     * @en Create descriptor set layout.
     * @zh 创建描述符集布局。
     * @param info GFX descriptor set layout description info.
     */
    abstract createDescriptorSetLayout(info: Readonly<DescriptorSetLayoutInfo>): DescriptorSetLayout;
    /**
     * @en Create pipeline layout.
     * @zh 创建管线布局。
     * @param info GFX pipeline layout description info.
     */
    abstract createPipelineLayout(info: Readonly<PipelineLayoutInfo>): PipelineLayout;
    /**
     * @en Create pipeline state.
     * @zh 创建管线状态。
     * @param info GFX pipeline state description info.
     */
    abstract createPipelineState(info: Readonly<PipelineStateInfo>): PipelineState;
    /**
     * @en Create queue.
     * @zh 创建队列。
     * @param info GFX queue description info.
     */
    abstract createQueue(info: Readonly<QueueInfo>): Queue;
    /**
     * @en Create sampler.
     * @zh 创建采样器。
     * @param info GFX sampler description info.
     */
    abstract getSampler(info: Readonly<SamplerInfo>): Sampler;
    /**
     * @en Get swapchains.
     * @zh 获取交换链列表。
     */
    abstract getSwapchains(): Readonly<Swapchain[]>;
    /**
     * @en Create global barrier.
     * @zh 创建全局内存屏障。
     * @param info GFX global barrier description info.
     */
    abstract getGeneralBarrier(info: Readonly<GeneralBarrierInfo>): GeneralBarrier;
    /**
     * @en Create texture barrier.
     * @zh 创建贴图内存屏障。
     * @param info GFX texture barrier description info.
     */
    abstract getTextureBarrier(info: Readonly<TextureBarrierInfo>): TextureBarrier;
    /**
     * @en Create buffer barrier.
     * @zh 创建buffer内存屏障。
     * @param info GFX buffer barrier description info.
     */
    abstract getBufferBarrier(info: Readonly<BufferBarrierInfo>): BufferBarrier;
    /**
     * @en Copy buffers to texture.
     * @zh 拷贝缓冲到纹理。
     * @param buffers The buffers to be copied.
     * @param texture The texture to copy to.
     * @param regions The region descriptions.
     */
    abstract copyBuffersToTexture(buffers: Readonly<ArrayBufferView[]>, texture: Texture, regions: Readonly<BufferTextureCopy[]>): void;
    /**
     * @en Copy texture to buffers
     * @zh 拷贝纹理到缓冲
     * @param texture The texture to be copied.
     * @param buffers The buffer to copy to.
     * @param regions The region descriptions
     */
    abstract copyTextureToBuffers(texture: Readonly<Texture>, buffers: ArrayBufferView[], regions: Readonly<BufferTextureCopy[]>): void;
    /**
     * @en Copy texture images to texture.
     * @zh 拷贝图像到纹理。
     * @param texImages The texture to be copied.
     * @param texture The texture to copy to.
     * @param regions The region descriptions.
     */
    abstract copyTexImagesToTexture(texImages: Readonly<TexImageSource[]>, texture: Texture, regions: Readonly<BufferTextureCopy[]>): void;
    /**
     * @en Whether the device has specific feature.
     * @zh 是否具备特性。
     * @param feature The GFX feature to be queried.
     */
    hasFeature(feature: Feature): boolean;
    /**
     * @en The extent a specific format is supported by the backend.
     * @zh 后端对特定格式的支持程度。
     * @param format The GFX format to be queried.
     */
    getFormatFeatures(format: Format): FormatFeature;
    /**
     * @en Enable automatically barrier deduction GFX inside, no effect on web.
     * @zh 是否开启自动GFX内部barrier推导，web无影响。
     * @param format The GFX format to be queried.
     */
    enableAutoBarrier(en: boolean): void;
    /**
     * @en Get maximum supported sample count.
     * @zh 获取最大可支持的 Samples 参数
     * @param format The GFX texture format.
     * @param usage The GFX texture usage.
     * @param flags The GFX texture create flags.
     */
    getMaxSampleCount(format: Format, usage: TextureUsage, flags: TextureFlags): SampleCount;
}
/** @mangle */
export declare class DefaultResource {
    private _texture2D;
    private _texture3D;
    private _textureCube;
    private _texture2DArray;
    constructor(device: Device);
    getTexture(type: TextureType): Texture | null;
}
