/**
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 * The following section is auto-generated.
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 */
import type { EffectAsset } from '../../asset/assets';
import type { DescriptorSetLayout, Device, PipelineLayout, Shader, ShaderInfo } from '../../gfx';
import type { MacroRecord } from '../../render-scene/core/pass-utils';
import type { IProgramInfo } from '../../render-scene/core/program-lib';
export interface ProgramProxy {
    readonly name: string;
    readonly shader: Shader;
}
export interface ProgramLibrary {
    addEffect(effectAsset: EffectAsset): void;
    precompileEffect(device: Device, effectAsset: EffectAsset): void;
    getKey(phaseID: number, programName: string, defines: MacroRecord): string;
    getPipelineLayout(device: Device, phaseID: number, programName: string): PipelineLayout;
    getMaterialDescriptorSetLayout(device: Device, phaseID: number, programName: string): DescriptorSetLayout;
    getLocalDescriptorSetLayout(device: Device, phaseID: number, programName: string): DescriptorSetLayout;
    getProgramInfo(phaseID: number, programName: string): IProgramInfo;
    getShaderInfo(phaseID: number, programName: string): ShaderInfo;
    getProgramVariant(device: Device, phaseID: number, name: string, defines: MacroRecord, key?: string): ProgramProxy | null;
    getBlockSizes(phaseID: number, programName: string): number[];
    getHandleMap(phaseID: number, programName: string): Record<string, number>;
    getProgramID(phaseID: number, programName: string): number;
    getDescriptorNameID(name: string): number;
    getDescriptorName(nameID: number): string;
}
