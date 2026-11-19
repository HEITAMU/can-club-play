import { Device, Sampler, DescriptorSet, Buffer, Texture, DescriptorSetLayout } from '../gfx';
import { Light } from '../render-scene/scene/light';
export declare class GlobalDSManager {
    private _device;
    private _descriptorSetMap;
    private _globalDescriptorSet;
    private _descriptorSetLayout;
    private _linearSampler;
    private _pointSampler;
    get descriptorSetMap(): Map<Light, DescriptorSet>;
    get linearSampler(): Sampler;
    get pointSampler(): Sampler;
    get descriptorSetLayout(): DescriptorSetLayout;
    set globalDescriptorSet(val: DescriptorSet);
    get globalDescriptorSet(): DescriptorSet;
    constructor(device: Device);
    regenLayout(): void;
    /**
     * @en Bind buffer for all descriptorSets, so that all created descriptorSet buffer are consistent
     * @zh 为所有的 descriptorSet 绑定 buffer，使得所有已创建的 descriptorSet buffer 保持一致
     * @param binding The target binding.
     * @param buffer The buffer to be bound.
     */
    bindBuffer(binding: number, buffer: Buffer): void;
    /**
     * @en Bind sampler for all descriptorSets, so that all created descriptorSet sampler are consistent
     * @zh 为所有的 descriptorSet 绑定 sampler，使得所有已创建的 descriptorSet sampler 保持一致
     * @param binding The target binding.
     * @param sampler The sampler to be bound.
     */
    bindSampler(binding: number, sampler: Sampler): void;
    /**
     * @en Bind texture for all descriptorSets, so that all created descriptorSet texture are consistent
     * @zh 为所有的 descriptorSet 绑定 texture，使得所有已创建的 descriptorSet texture 保持一致
     * @param binding The target binding.
     * @param texture The texture to be bound.
     */
    bindTexture(binding: number, texture: Texture): void;
    /**
     * @en Update all descriptorSet
     * @zh 更新所有的 descriptorSet
     */
    update(): void;
    /**
     * @en The layout of all created descriptorSets in buffer, sampler, and texture (except shadow) is consistent with the globalDescriptorSet
     * @zh 所有创建出来的 descriptorSet 在 buffer、 sampler、 texture（shadow 除外）的布局与 globalDescriptorSet 保持一致
     * @param idx Specify index creation
     * @return descriptorSet
     */
    getOrCreateDescriptorSet(light: Light): DescriptorSet | undefined;
    destroy(): void;
}
