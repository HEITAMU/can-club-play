import { Pass } from '../render-scene';
import { SubModel } from '../render-scene/scene';
import { IRenderPass } from './define';
import { Texture, InputAssembler, Buffer, CommandBuffer, Shader, DescriptorSet } from '../gfx';
export declare function instancingCompareFn(l: InstancedBuffer, r: InstancedBuffer): number;
export interface IInstancedItem {
    count: number;
    capacity: number;
    vb: Buffer;
    data: Uint8Array;
    ia: InputAssembler;
    stride: number;
    shader: Shader | null;
    descriptorSet: DescriptorSet;
    lightingMap: Texture;
    reflectionProbeCubemap: Texture;
    reflectionProbePlanarMap: Texture;
    useReflectionProbeType: number;
    reflectionProbeBlendCubemap: Texture | null;
}
export declare class InstancedBuffer {
    instances: IInstancedItem[];
    pass: Pass;
    hasPendingModels: boolean;
    dynamicOffsets: number[];
    sortRender: IRenderPass;
    private _passPool;
    private _device;
    constructor(pass: Pass);
    destroy(): void;
    merge(subModel: SubModel, passIdx: number, shaderImplant?: Shader | null): void;
    uploadBuffers(cmdBuff: CommandBuffer): void;
    clear(): void;
}
