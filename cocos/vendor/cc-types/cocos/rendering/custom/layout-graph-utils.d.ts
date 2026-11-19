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
import { DescriptorSetLayout, DescriptorSetLayoutInfo, DescriptorType, Device, PipelineLayout, PipelineLayoutInfo, Uniform } from '../../gfx';
import type { LayoutGraphData, PipelineLayoutData } from './layout-graph';
import { DescriptorSetLayoutData, DescriptorTypeOrder } from './layout-graph';
import { UpdateFrequency } from './types';
export declare const INVALID_ID = 4294967295;
export declare const ENABLE_SUBPASS = true;
export declare function getGfxDescriptorType(type: DescriptorTypeOrder): DescriptorType;
export declare function getDescriptorTypeOrder(type: DescriptorType): DescriptorTypeOrder;
export declare function getCustomPassID(lg: LayoutGraphData, name: string | undefined): number;
export declare function getCustomSubpassID(lg: LayoutGraphData, passID: number, name: string): number;
export declare function getCustomPhaseID(lg: LayoutGraphData, subpassOrPassID: number, name: string | number | undefined): number;
export declare const DEFAULT_UNIFORM_COUNTS: Map<string, number>;
export declare const DYNAMIC_UNIFORM_BLOCK: Set<string>;
export declare function getUniformBlockSize(blockMembers: Array<Uniform>): number;
export declare function sortDescriptorBlocks<T>(lhs: [string, T], rhs: [string, T]): number;
export declare function sortDescriptorGroupBlocks<T>(lhs: [string, T], rhs: [string, T]): number;
export declare function getOrCreateDescriptorID(lg: LayoutGraphData, name: string): number;
export declare function createGfxDescriptorSetsAndPipelines(device: Device | null, g: LayoutGraphData): void;
export declare function makeDescriptorSetLayoutData(lg: LayoutGraphData, rate: UpdateFrequency, set: number, descriptors: EffectAsset.IDescriptorInfo): DescriptorSetLayoutData;
export declare function initializeDescriptorSetLayoutInfo(layoutData: DescriptorSetLayoutData, info: DescriptorSetLayoutInfo): void;
export declare function populatePipelineLayoutInfo(layout: PipelineLayoutData, rate: UpdateFrequency, info: PipelineLayoutInfo): void;
export declare function generateConstantMacros(device: Device, constantMacros: string): void;
export declare function initializeLayoutGraphData(device: Device, lg: LayoutGraphData): void;
export declare function terminateLayoutGraphData(lg: LayoutGraphData): void;
export declare function getEmptyDescriptorSetLayout(): DescriptorSetLayout;
export declare function getEmptyPipelineLayout(): PipelineLayout;
export declare function getOrCreateDescriptorSetLayout(lg: LayoutGraphData, subpassOrPassID: number, phaseID: number, rate: UpdateFrequency): DescriptorSetLayout;
export declare function getDescriptorSetLayout(lg: LayoutGraphData, subpassOrPassID: number, phaseID: number, rate: UpdateFrequency): DescriptorSetLayout | null;
export declare function getProgramID(lg: LayoutGraphData, phaseID: number, programName: string): number;
export declare function getDescriptorNameID(lg: LayoutGraphData, name: string): number;
export declare function getDescriptorName(lg: LayoutGraphData, nameID: number): string;
export declare function getPerPassDescriptorSetLayoutData(lg: LayoutGraphData, subpassOrPassID: number): DescriptorSetLayoutData | null;
export declare function getPerPhaseDescriptorSetLayoutData(lg: LayoutGraphData, phaseID: number): DescriptorSetLayoutData | null;
export declare function getPerBatchDescriptorSetLayoutData(lg: LayoutGraphData, phaseID: number, programID: number): DescriptorSetLayoutData | null;
export declare function getPerInstanceDescriptorSetLayoutData(lg: LayoutGraphData, phaseID: number, programID: number): DescriptorSetLayoutData | null;
export declare function getBinding(layout: DescriptorSetLayoutData, nameID: number): number;
