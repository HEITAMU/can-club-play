/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/
import { EffectAsset } from '../../asset/assets';
import { DescriptorSetLayout, Device, PipelineLayout, PipelineState, Shader, ShaderInfo } from '../../gfx';
import { MacroRecord } from '../../render-scene';
import { IProgramInfo } from '../../render-scene/core/program-lib';
import { IDescriptorSetLayoutInfo } from '../define';
import { DescriptorSetLayoutData, LayoutGraphData, PipelineLayoutData, RenderPhaseData, ShaderProgramData } from './layout-graph';
import { PipelineRuntime } from './pipeline';
import { ProgramLibrary, ProgramProxy } from './private';
import { UpdateFrequency } from './types';
import { ProgramGroup } from './web-types';
export declare function makeProgramInfo(effectName: string, shader: EffectAsset.IShaderInfo): IProgramInfo;
export declare function overwriteProgramBlockInfo(shaderInfo: ShaderInfo, programInfo: IProgramInfo): void;
export declare function makeShaderInfo(lg: LayoutGraphData, passLayouts: PipelineLayoutData, phaseLayouts: PipelineLayoutData, srcShaderInfo: EffectAsset.IShaderInfo, programData: ShaderProgramData | null, fixedLocal: boolean): [ShaderInfo, Array<number>];
export declare function getGLSLSource(info: IProgramInfo, version: string): {
    vert: string;
    frag: string;
    compute?: string;
};
export declare class WebProgramProxy implements ProgramProxy {
    constructor(shader: Shader, pipelineStateIn?: PipelineState | null);
    get name(): string;
    readonly shader: Shader;
    pipelineState: PipelineState | null;
}
export declare function makeLocalDescriptorSetLayoutData(lg: LayoutGraphData, source: IDescriptorSetLayoutInfo): DescriptorSetLayoutData;
export declare function buildProgramData(programName: string, srcShaderInfo: EffectAsset.IShaderInfo, lg: LayoutGraphData, phase: RenderPhaseData, programData: ShaderProgramData, fixedLocal: boolean): void;
export declare function getOrCreateProgramDescriptorSetLayout(device: Device, lg: LayoutGraphData, phaseID: number, programName: string, rate: UpdateFrequency): DescriptorSetLayout;
export declare function getProgramDescriptorSetLayout(device: Device, lg: LayoutGraphData, phaseID: number, programName: string, rate: UpdateFrequency): DescriptorSetLayout | null;
export declare function getEffectShader(lg: LayoutGraphData, effect: EffectAsset, pass: EffectAsset.IPassInfo): [number, number, number, EffectAsset.IShaderInfo | null, number];
export declare function validateShaderInfo(srcShaderInfo: EffectAsset.IShaderInfo): number;
export declare class WebProgramLibrary implements ProgramLibrary {
    constructor(lg: LayoutGraphData);
    init(deviceIn: Device): void;
    addEffect(effect: EffectAsset): void;
    precompileEffect(device: Device, effect: EffectAsset): void;
    getProgramInfo(phaseID: number, programName: string): IProgramInfo;
    getShaderInfo(phaseID: number, programName: string): ShaderInfo;
    getKey(phaseID: number, programName: string, defines: MacroRecord): string;
    getProgramVariant(device: Device, phaseID: number, name: string, defines: MacroRecord, key?: string | null): ProgramProxy | null;
    getMaterialDescriptorSetLayout(device: Device, phaseID: number, programName: string): DescriptorSetLayout;
    getLocalDescriptorSetLayout(device: Device, phaseID: number, programName: string): DescriptorSetLayout;
    getBlockSizes(phaseID: number, programName: string): number[];
    getHandleMap(phaseID: number, programName: string): Record<string, number>;
    getPipelineLayout(device: Device, phaseID: number, programName: string): PipelineLayout;
    getProgramID(phaseID: number, programName: string): number;
    getDescriptorNameID(name: string): number;
    getDescriptorName(nameID: number): string;
    readonly layoutGraph: LayoutGraphData;
    readonly phases: Map<number, ProgramGroup>;
    mergeHighFrequency: boolean;
    fixedLocal: boolean;
    localLayoutData: DescriptorSetLayoutData;
    localDescriptorSetLayout: DescriptorSetLayout | null;
    pipeline: PipelineRuntime | null;
    device: Device | null;
}
