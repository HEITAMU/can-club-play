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
import { EffectAsset } from '../../asset/assets/effect-asset';
import { Attribute, ShaderInfo, Uniform } from '../../gfx/base/define';
import { MacroRecord } from './pass-utils';
import { IProgramInfo } from './program-lib';
export interface IMacroInfo {
    name: string;
    value: string;
    isDefault: boolean;
}
export declare function prepareDefines(defs: MacroRecord, tDefs: EffectAsset.IDefineInfo[]): IMacroInfo[];
export declare function getShaderInstanceName(name: string, macros: IMacroInfo[]): string;
export declare function getActiveAttributes(tmpl: IProgramInfo, gfxAttributes: Attribute[], defines: MacroRecord): Attribute[];
export declare function getVariantKey(programInfo: IProgramInfo, defines: MacroRecord): string;
export declare function getSize(blockMembers: Uniform[]): number;
export declare function genHandles(tmpl: EffectAsset.IShaderInfo | ShaderInfo): Record<string, number>;
export declare function populateMacros(tmpl: IProgramInfo): void;
export declare function getCombinationDefines(combination: EffectAsset.IPreCompileInfo): Record<string, string | number | boolean>[];
export declare function addEffectDefaultProperties(effect: EffectAsset): void;
