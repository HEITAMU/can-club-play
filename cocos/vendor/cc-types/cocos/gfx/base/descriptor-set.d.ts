import { Buffer } from './buffer';
import { DescriptorSetLayout } from './descriptor-set-layout';
import { Sampler } from './states/sampler';
import { Texture } from './texture';
import { GFXObject, DescriptorSetInfo, AccessFlagBit } from './define';
/**
 * @en GFX descriptor sets.
 * @zh GFX 描述符集组。
 */
export declare abstract class DescriptorSet extends GFXObject {
    get layout(): DescriptorSetLayout;
    /** @mangle */
    protected _layout: DescriptorSetLayout | null;
    /** @mangle */
    protected _buffers: Buffer[];
    /** @mangle */
    protected _textures: Texture[];
    /** @mangle */
    protected _samplers: Sampler[];
    /** @mangle */
    protected _isDirty: boolean;
    constructor();
    abstract initialize(info: Readonly<DescriptorSetInfo>): void;
    abstract destroy(): void;
    abstract update(): void;
    /**
     * @en Bind buffer to the specified descriptor.
     * @zh 在指定的描述符位置上绑定缓冲。
     * @param binding The target binding.
     * @param buffer The buffer to be bound.
     */
    bindBuffer(binding: number, buffer: Buffer, index?: number): void;
    /**
     * @en Bind sampler to the specified descriptor.
     * @zh 在指定的描述符位置上绑定采样器。
     * @param binding The target binding.
     * @param sampler The sampler to be bound.
     */
    bindSampler(binding: number, sampler: Sampler, index?: number): void;
    /**
     * @en Bind texture to the specified descriptor.
     * @zh 在指定的描述符位置上绑定纹理。
     * @param binding The target binding.
     * @param texture The texture to be bound.
     */
    bindTexture(binding: number, texture: Texture, index?: number, flags?: AccessFlagBit): void;
    /**
     * @en Get buffer from the specified binding location.
     * @zh 获取当前指定绑定位置上的缓冲。
     * @param binding The target binding.
     */
    getBuffer(binding: number, index?: number): Buffer;
    /**
     * @en Get sampler from the specified binding location.
     * @zh 获取当前指定绑定位置上的采样器。
     * @param binding The target binding.
     */
    getSampler(binding: number, index?: number): Sampler;
    /**
     * @en Get texture from the specified binding location.
     * @zh 获取当前指定绑定位置上的贴图。
     * @param binding The target binding.
     */
    getTexture(binding: number, index?: number): Texture;
}
