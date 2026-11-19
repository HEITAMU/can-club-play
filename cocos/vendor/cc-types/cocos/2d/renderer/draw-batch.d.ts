import { Material } from '../../asset/assets/material';
import { Texture, Sampler, InputAssembler, DescriptorSet, Shader, DepthStencilState } from '../../gfx';
import { Node } from '../../scene-graph';
import { Model } from '../../render-scene/scene/model';
import { IMacroPatch, Pass } from '../../render-scene/core/pass';
import { IBatcher } from './i-batcher';
/** @mangle */
export declare class DrawBatch2D {
    get passes(): Pass[];
    get shaders(): Shader[];
    model: Model | null;
    texture: Texture | null;
    sampler: Sampler | null;
    useLocalData: Node | null;
    isStatic: boolean;
    textureHash: number;
    samplerHash: number;
    private _passes;
    private _shaders;
    visFlags: number;
    inputAssembler: InputAssembler | null;
    descriptorSet: DescriptorSet | null;
    destroy(ui: IBatcher): void;
    clear(): void;
    fillPasses(mat: Material | null, dss: DepthStencilState | null, dssHash: number, patches: Readonly<IMacroPatch[] | null>): void;
}
