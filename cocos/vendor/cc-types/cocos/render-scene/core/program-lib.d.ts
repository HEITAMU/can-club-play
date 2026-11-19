import { EffectAsset } from '../../asset/assets/effect-asset';
import { PipelineRuntime } from '../../rendering/custom/pipeline';
import { MacroRecord } from './pass-utils';
import { Device, Attribute, ShaderInfo, DescriptorSetLayout, DescriptorSetLayoutBinding, PipelineLayout, Shader } from '../../gfx';
import { IMacroInfo } from './program-utils';
export interface IDefineRecord extends EffectAsset.IDefineInfo {
    _map: (value: any) => number;
    _offset: number;
}
export interface ITemplateInfo {
    gfxAttributes: Attribute[];
    shaderInfo: ShaderInfo;
    blockSizes: number[];
    setLayouts: DescriptorSetLayout[];
    pipelineLayout: PipelineLayout;
    handleMap: Record<string, number>;
    bindings: DescriptorSetLayoutBinding[];
    samplerStartBinding: number;
}
export interface IProgramInfo extends EffectAsset.IShaderInfo {
    effectName: string;
    defines: IDefineRecord[];
    constantMacros: string;
    uber: boolean;
}
export declare function flattenShaderLocation(source: string, tmpl: IProgramInfo, macroInfo: IMacroInfo[], shaderStage: any, attrMap: Map<string, number>): string;
/**
 * @en The global maintainer of all shader resources.
 * @zh 维护 shader 资源实例的全局管理器。
 */
export declare class ProgramLib {
    protected _templates: Record<string, IProgramInfo>;
    protected _cache: Record<string, Shader>;
    protected _templateInfos: Record<number, ITemplateInfo>;
    register(effect: EffectAsset): void;
    /**
     * @en Register the shader template with the given info
     * @zh 注册 shader 模板。
     */
    define(shader: EffectAsset.IShaderInfo): IProgramInfo;
    /**
     * @en Gets the shader template with its name
     * @zh 通过名字获取 Shader 模板
     * @param name Target shader name
     */
    getTemplate(name: string): IProgramInfo;
    /**
     * @en Gets the shader template info with its name
     * @zh 通过名字获取 Shader 模版信息
     * @param name Target shader name
     */
    getTemplateInfo(name: string): ITemplateInfo;
    /**
     * @en Gets the pipeline layout of the shader template given its name
     * @zh 通过名字获取 Shader 模板相关联的管线布局
     * @param name Target shader name
     */
    getDescriptorSetLayout(device: Device, name: string, isLocal?: boolean): DescriptorSetLayout;
    /**
     * @en
     * Does this library has the specified program
     * @zh
     * 当前是否有已注册的指定名字的 shader
     * @param name Target shader name
     */
    hasProgram(name: string): boolean;
    /**
     * @en Gets the shader key with the name and a macro combination
     * @zh 根据 shader 名和预处理宏列表获取 shader key。
     * @param name Target shader name
     * @param defines The combination of preprocess macros
     */
    getKey(name: string, defines: MacroRecord): string;
    /**
     * @en Destroy all shader instance match the preprocess macros
     * @zh 销毁所有完全满足指定预处理宏特征的 shader 实例。
     * @param defines The preprocess macros as filter
     */
    destroyShaderByDefines(defines: MacroRecord): void;
    /**
     * @en Gets the shader resource instance with given information
     * @zh 获取指定 shader 的渲染资源实例
     * @param name Shader name
     * @param defines Preprocess macros
     * @param pipeline The [[RenderPipeline]] which owns the render command
     * @param key The shader cache key, if already known
     */
    getGFXShader(device: Device, name: string, defines: MacroRecord, pipeline: PipelineRuntime, key?: string): Shader;
}
export declare function getDeviceShaderVersion(device: Device): string;
export declare const programLib: ProgramLib;
