import { DescriptorSetLayout } from './descriptor-set-layout';
import { GFXObject, PipelineLayoutInfo } from './define';
/**
 * @en GFX pipeline layout.
 * @zh GFX 管线布局。
 */
export declare abstract class PipelineLayout extends GFXObject {
    get setLayouts(): DescriptorSetLayout[];
    /** @mangle */
    protected _setLayouts: DescriptorSetLayout[];
    constructor();
    abstract initialize(info: Readonly<PipelineLayoutInfo>): void;
    abstract destroy(): void;
}
