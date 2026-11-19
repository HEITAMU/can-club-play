import { GFXObject, DescriptorSetLayoutBinding, DescriptorSetLayoutInfo } from './define';
/**
 * @en GFX descriptor sets layout.
 * @zh GFX 描述符集布局。
 */
export declare abstract class DescriptorSetLayout extends GFXObject {
    get bindings(): DescriptorSetLayoutBinding[];
    get bindingIndices(): number[];
    get descriptorIndices(): number[];
    /** @mangle */
    protected _bindings: DescriptorSetLayoutBinding[];
    /** @mangle */
    protected _bindingIndices: number[];
    /** @mangle */
    protected _descriptorIndices: number[];
    constructor();
    abstract initialize(info: Readonly<DescriptorSetLayoutInfo>): void;
    abstract destroy(): void;
}
