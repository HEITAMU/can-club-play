import { Buffer } from './buffer';
import { DescriptorSet } from './descriptor-set';
import { Framebuffer } from './framebuffer';
import { InputAssembler } from './input-assembler';
import { PipelineState } from './pipeline-state';
import { Queue } from './queue';
import { RenderPass } from './render-pass';
import { Texture } from './texture';
import { GFXObject, StencilFace, CommandBufferType, CommandBufferInfo, BufferTextureCopy, Color, Rect, Viewport, DrawInfo, Filter, TextureBlit } from './define';
import { GeneralBarrier } from './states/general-barrier';
import { TextureBarrier } from './states/texture-barrier';
import { BufferBarrier } from './states/buffer-barrier';
/**
 * @en GFX command buffer.
 * @zh GFX 命令缓冲。
 */
export declare abstract class CommandBuffer extends GFXObject {
    /**
     * @en Type of the command buffer.
     * @zh 命令缓冲类型。
     */
    get type(): CommandBufferType;
    /**
     * @en Type of the command buffer.
     * @zh 命令缓冲类型。
     */
    get queue(): Queue;
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
     * @zh 绘制三角形数量。
     */
    get numTris(): number;
    /** @mangle */
    protected _queue: Queue | null;
    /** @mangle */
    protected _type: CommandBufferType;
    /** @mangle */
    protected _numDrawCalls: number;
    /** @mangle */
    protected _numInstances: number;
    /** @mangle */
    protected _numTris: number;
    constructor();
    abstract initialize(info: Readonly<CommandBufferInfo>): void;
    abstract destroy(): void;
    /**
     * @en Begin recording commands.
     * @zh 开始记录命令。
     * @param renderPass [Secondary Command Buffer Only] The render pass the subsequent commands will be executed in
     * @param subpass [Secondary Command Buffer Only] The subpass the subsequent commands will be executed in
     * @param frameBuffer [Secondary Command Buffer Only, Optional] The framebuffer to be used in the subpass
     */
    abstract begin(renderPass?: RenderPass, subpass?: number, frameBuffer?: Framebuffer): void;
    /**
     * @en End recording commands.
     * @zh 结束记录命令。
     */
    abstract end(): void;
    /**
     * @en Begin render pass.
     * @zh 开始 RenderPass。
     * @param framebuffer The frame buffer used.
     * @param renderArea The target render area.
     * @param clearFlag The clear flags.
     * @param clearColors The clearing colors.
     * @param clearDepth The clearing depth.
     * @param clearStencil The clearing stencil.
     */
    abstract beginRenderPass(renderPass: RenderPass, framebuffer: Framebuffer, renderArea: Readonly<Rect>, clearColors: Readonly<Color[]>, clearDepth: number, clearStencil: number): void;
    /**
     * @en End render pass.
     * @zh 结束 RenderPass。
     */
    abstract endRenderPass(): void;
    /**
     * @en Bind pipeline state.
     * @zh 绑定 GFX 管线状态。
     * @param pipelineState The pipeline state to be bound.
     */
    abstract bindPipelineState(pipelineState: PipelineState): void;
    /**
     * @en Bind a descriptor set. Note that the corresponding PiplieneState has to be bound first
     * before calling this function, or the dynamic offset specified may be invalidated.
     * @zh 绑定 GFX 描述符集。注意在调用此函数前，必须先绑定对应的 PipelineState，否则 dynamic offset 可能无效。
     * @param set The target descriptor set index.
     * @param descriptorSet The descriptor set to be bound.
     * @param dynamicOffsets The offset numbers for dynamic bindings.
     */
    abstract bindDescriptorSet(set: number, descriptorSet: DescriptorSet, dynamicOffsets?: Readonly<number[]>): void;
    /**
     * @en Bind input assembler.
     * @zh 绑定 GFX 输入汇集器。
     * @param inputAssembler The input assembler to be bound.
     */
    abstract bindInputAssembler(inputAssembler: InputAssembler): void;
    /**
     * @en Set viewport.
     * @zh 设置视口。
     * @param viewport The new viewport.
     */
    abstract setViewport(viewport: Readonly<Viewport>): void;
    /**
     * @en Set scissor range.
     * @zh 设置剪裁区域。
     * @param scissor The new scissor range.
     */
    abstract setScissor(scissor: Readonly<Rect>): void;
    /**
     * @en Set line width.
     * @zh 设置线宽。
     * @param lineWidth The new line width.
     */
    abstract setLineWidth(lineWidth: number): void;
    /**
     * @en Set depth bias.
     * @zh 设置深度偏移。
     * @param depthBiasConstantFactor The new depth bias factor.
     * @param depthBiasClamp The new depth bias clamp threshold.
     * @param depthBiasSlopeFactor  The new depth bias slope factor.
     */
    abstract setDepthBias(depthBiasConstantFactor: number, depthBiasClamp: number, depthBiasSlopeFactor: number): void;
    /**
     * @en Set blend constants.
     * @zh 设置混合因子。
     * @param blendConstants The new blend constants.
     */
    abstract setBlendConstants(blendConstants: Readonly<Color>): void;
    /**
     * @en Set depth bound.
     * @zh 设置深度边界。
     * @param minDepthBounds The new minimum depth bound.
     * @param maxDepthBounds The new maximum depth bound.
     */
    abstract setDepthBound(minDepthBounds: number, maxDepthBounds: number): void;
    /**
     * @en Set stencil write mask.
     * @zh 设置模板写掩码。
     * @param face The effective triangle face.
     * @param writeMask The new stencil write mask.
     */
    abstract setStencilWriteMask(face: StencilFace, writeMask: number): void;
    /**
     * @en Set stencil compare mask.
     * @zh 设置模板比较掩码。
     * @param face The effective triangle face.
     * @param reference The new stencil reference constant.
     * @param compareMask The new stencil read mask.
     */
    abstract setStencilCompareMask(face: StencilFace, reference: number, compareMask: number): void;
    /**
     * @en Draw the specified primitives.
     * @zh 绘制。
     * @param infoOrAssembler The draw call information.
     */
    abstract draw(infoOrAssembler: Readonly<DrawInfo> | Readonly<InputAssembler>): void;
    /**
     * @en Update buffer.
     * @zh 更新缓冲。
     * @param buffer The buffer to be updated.
     * @param data The source data.
     * @param size Size in bytes to be updated.
     */
    abstract updateBuffer(buffer: Buffer, data: Readonly<ArrayBuffer>, size?: number): void;
    /**
     * @en Copy buffer to texture.
     * @zh 拷贝缓冲到纹理。
     * @param srcBuff The buffer to be copied.
     * @param dstTex The texture to copy to.
     * @param dstLayout The target texture layout.
     * @param regions The region descriptions.
     */
    abstract copyBuffersToTexture(buffers: Readonly<ArrayBufferView[]>, texture: Texture, regions: Readonly<BufferTextureCopy[]>): void;
    /**
     * @en Execute specified command buffers.
     * @zh 执行一组命令缓冲。
     * @param cmdBuffs The command buffers to be executed.
     * @param count The number of command buffers to be executed.
     */
    abstract execute(cmdBuffs: Readonly<CommandBuffer[]>, count: number): void;
    /**
     * @en Insert pipeline memory barriers.
     * @zh 插入管线内存屏障。
     * @param barrier The global memory barrier to apply.
     * @param textureBarriers The texture memory barriers to apply.
     */
    abstract pipelineBarrier(barrier: Readonly<GeneralBarrier> | null, bufferBarriers?: Readonly<BufferBarrier[]>, buffers?: Readonly<Buffer[]>, textureBarriers?: Readonly<TextureBarrier[]>, textures?: Readonly<Texture[]>): void;
    /**
     * @en blit data from regions of source texture to regions of destination texture.
     * @zh 将数据从源纹理的区域拷贝到目标纹理的区域。
     *
     * @param srcTexture The source texture.
     * @param dstTexture The destination texture.
     * @param regions The region descriptions.
     * @param filter The filter to use.
     */
    abstract blitTexture(srcTexture: Readonly<Texture>, dstTexture: Texture, regions: Readonly<TextureBlit[]>, filter: Filter): void;
}
