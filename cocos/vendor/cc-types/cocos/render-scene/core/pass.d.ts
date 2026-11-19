/// <reference types="./@types/globals" />
import { Root } from '../../root';
import { DynamicStateFlagBit, DynamicStateFlags, PrimitiveMode, Type, BlendState, Buffer, DepthStencilState, DescriptorSet, DescriptorSetLayout, Device, RasterizerState, Sampler, Texture, Shader, PipelineLayout } from '../../gfx';
import { EffectAsset } from '../../asset/assets/effect-asset';
import { IProgramInfo } from './program-lib';
import { MacroRecord, MaterialProperty } from './pass-utils';
import { RenderPassStage, RenderPriority } from '../../rendering/define';
import { InstancedBuffer } from '../../rendering/instanced-buffer';
export interface IPassInfoFull extends EffectAsset.IPassInfo {
    passIndex: number;
    defines: MacroRecord;
    stateOverrides?: PassOverrides;
}
export type PassOverrides = RecursivePartial<EffectAsset.IPassStates>;
export interface IMacroPatch {
    name: string;
    value: boolean | number | string;
}
interface IPassDynamics {
    [type: number]: {
        dirty: boolean;
        value: number;
    };
}
export declare enum BatchingSchemes {
    NONE = 0,
    INSTANCING = 1
}
export declare namespace Pass {
    type getTypeFromHandle = typeof Pass.getTypeFromHandle;
    type getBindingFromHandle = typeof Pass.getBindingFromHandle;
    type fillPipelineInfo = typeof Pass.fillPipelineInfo;
    type getPassHash = typeof Pass.getPassHash;
    type getCountFromHandle = typeof Pass.getCountFromHandle;
}
/**
 * @en Render pass, store actual resources for the rendering process
 * @zh 渲染 pass，储存实际描述绘制过程的各项资源。
 */
export declare class Pass {
    /**
     * @en Get the type of member in uniform buffer object with the handle
     * @zh 根据 handle 获取 uniform 的具体类型。
     */
    static getTypeFromHandle: (handle: number) => number;
    /**
     * @en Get the binding with handle
     * @zh 根据 handle 获取 binding。
     */
    static getBindingFromHandle: (handle: number) => number;
    /**
     * @en Get the array length with handle
     * @zh 根据 handle 获取数组长度。
     */
    static getCountFromHandle: (handle: number) => number;
    protected static getOffsetFromHandle: (handle: number) => number;
    /**
     * @en Fill a pass represented by the given pass handle with the given override info
     * @param hPass The pass handle point to the pass
     * @param info The pass override info
     */
    static fillPipelineInfo(pass: Pass, info: PassOverrides): void;
    /**
     * @en Get pass hash value by [[renderer.Pass]] hash information.
     * @zh 根据 [[renderer.Pass]] 的哈希信息获取哈希值。
     *
     * @param hPass Handle of the pass info used to compute hash value.
     */
    static getPassHash(pass: Pass): number;
    protected _rootBuffer: Buffer | null;
    protected _buffers: Buffer[];
    protected _descriptorSet: DescriptorSet;
    protected _pipelineLayout: PipelineLayout;
    protected _passIndex: number;
    protected _propertyIndex: number;
    protected _programName: string;
    protected _dynamics: IPassDynamics;
    protected _propertyHandleMap: Record<string, number>;
    protected _rootBlock: ArrayBuffer | null;
    protected _blocksInt: Int32Array[];
    protected _blocks: Float32Array[];
    protected _shaderInfo: IProgramInfo;
    protected _defines: MacroRecord;
    protected _properties: Record<string, EffectAsset.IPropertyInfo>;
    protected _shader: Shader | null;
    protected _bs: BlendState;
    protected _dss: DepthStencilState;
    protected _rs: RasterizerState;
    protected _priority: RenderPriority;
    protected _stage: RenderPassStage;
    protected _phase: number;
    protected _passID: number;
    protected _subpassID: number;
    protected _phaseID: number;
    protected _primitive: PrimitiveMode;
    protected _batchingScheme: BatchingSchemes;
    protected _dynamicStates: DynamicStateFlagBit;
    protected _instancedBuffers: Record<number, InstancedBuffer>;
    protected _hash: number;
    protected _root: Root;
    protected _device: Device;
    protected _rootBufferDirty: boolean;
    constructor(root: Root);
    /**
     * @en Initialize the pass with given pass info, shader will be compiled in the init process
     * @zh 根据指定参数初始化当前 pass，shader 会在这一阶段就尝试编译。
     */
    initialize(info: IPassInfoFull): void;
    /**
     * @en Get the handle of a UBO member, or specific channels of it.
     * @zh 获取指定 UBO 成员，或其更具体分量的读写句柄。默认以成员自身的类型为目标读写类型（即读写时必须传入与成员类型相同的变量）。
     * @param name Name of the target UBO member.
     * @param offset Channel offset into the member.
     * @param targetType Target type of the handle, i.e. the type of data when read/write to it.
     * @example
     * ```
     * import { Vec3, gfx } from 'cc';
     * // say 'pbrParams' is a uniform vec4
     * const hParams = pass.getHandle('pbrParams'); // get the default handle
     * pass.setUniform(hAlbedo, new Vec3(1, 0, 0)); // wrong! pbrParams.w is NaN now
     *
     * // say 'albedoScale' is a uniform vec4, and we only want to modify the w component in the form of a single float
     * const hThreshold = pass.getHandle('albedoScale', 3, gfx.Type.FLOAT);
     * pass.setUniform(hThreshold, 0.5); // now, albedoScale.w = 0.5
     * ```
     */
    getHandle(name: string, offset?: number, targetType?: Type): number;
    /**
     * @en Gets the uniform binding with its name
     * @zh 获取指定 uniform 的 binding。
     * @param name The name of target uniform
     */
    getBinding(name: string): number;
    /**
     * @en Sets a vector type uniform value, if a uniform requires frequent update, please use this method.
     * @zh 设置指定普通向量类 uniform 的值，如果需要频繁更新请尽量使用此接口。
     * @param handle The handle for the target uniform
     * @param value New value
     */
    setUniform(handle: number, value: MaterialProperty): void;
    /**
     * @en Gets a uniform's value.
     * @zh 获取指定普通向量类 uniform 的值。
     * @param handle The handle for the target uniform
     * @param out The output property to store the result
     */
    getUniform<T extends MaterialProperty>(handle: number, out: T): T;
    /**
     * @en Sets an array type uniform value, if a uniform requires frequent update, please use this method.
     * @zh 设置指定数组类 uniform 的值，如果需要频繁更新请尽量使用此接口。
     * @param handle The handle for the target uniform
     * @param value New value
     */
    setUniformArray(handle: number, value: MaterialProperty[]): void;
    /**
     * @en Bind a GFX [[gfx.Texture]] the given uniform binding
     * @zh 绑定实际 GFX [[gfx.Texture]] 到指定 binding。
     * @param binding The binding for target uniform of texture type
     * @param value Target texture
     */
    bindTexture(binding: number, value: Texture, index?: number): void;
    /**
     * @en Bind a GFX [[gfx.Sampler]] the given uniform binding
     * @zh 绑定实际 GFX [[gfx.Sampler]] 到指定 binding。
     * @param binding The binding for target uniform of sampler type
     * @param value Target sampler
     */
    bindSampler(binding: number, value: Sampler, index?: number): void;
    /**
     * @en Sets the dynamic pipeline state property at runtime
     * @zh 设置运行时 pass 内可动态更新的管线状态属性。
     * @param state Target dynamic state
     * @param value Target value
     */
    setDynamicState(state: DynamicStateFlagBit, value: number): void;
    /**
     * @en Override all pipeline states with the given pass override info.
     * @zh 重载当前所有管线状态。
     * @param original The original pass info
     * @param value The override pipeline state info
     */
    overridePipelineStates(original: EffectAsset.IPassInfo, overrides: PassOverrides): void;
    /**
     * @en Update the current uniforms data.
     * @zh 更新当前 Uniform 数据。
     */
    update(): void;
    getInstancedBuffer(extraKey?: number): InstancedBuffer;
    /**
     * @en Destroy the current pass.
     * @zh 销毁当前 pass。
     */
    destroy(): void;
    /**
     * @en Resets the value of the given uniform by name to the default value in [[EffectAsset]].
     * This method does not support array type uniform.
     * @zh 重置指定（非数组） Uniform 为 [[EffectAsset]] 默认值。
     */
    resetUniform(name: string): void;
    /**
     * @en Resets the value of the given texture by name to the default value in [[EffectAsset]].
     * @zh 重置指定贴图为 [[EffectAsset]] 默认值。
     */
    resetTexture(name: string, index?: number): void;
    /**
     * @en Resets all uniform buffer objects to the default values in [[EffectAsset]]
     * @zh 重置所有 UBO 为默认值。
     */
    resetUBOs(): void;
    /**
     * @en Resets all textures and samplers to the default values in [[EffectAsset]]
     * @zh 重置所有 texture 和 sampler 为初始默认值。
     */
    resetTextures(): void;
    /**
     * @en Try to compile the shader and retrieve related resources references.
     * @zh 尝试编译 shader 并获取相关资源引用。
     */
    tryCompile(): boolean;
    /**
     * @en Gets the shader variant of the current pass and given macro patches
     * @zh 结合指定的编译宏组合获取当前 Pass 的 Shader Variant
     * @param patches The macro patches
     */
    getShaderVariant(patches?: Readonly<IMacroPatch[] | null>): Shader | null;
    protected get _isBlend(): boolean;
    /**
     * @private
     */
    beginChangeStatesSilently(): void;
    /**
     * @private
     */
    endChangeStatesSilently(): void;
    protected _doInit(info: IPassInfoFull, copyDefines?: boolean): void;
    private _buildUniformBlocks;
    private _buildMaterialUniformBlocks;
    protected _syncBatchingScheme(): void;
    private _getBlockView;
    /**
     * @engineInternal
     * @mangle
     * Only for UI
     */
    _initPassFromTarget(target: Pass, dss: DepthStencilState, hashFactor: number): void;
    /**
     * @engineInternal
     * @mangle
     */
    _updatePassHash(): void;
    get root(): Root;
    get device(): Device;
    get shaderInfo(): IProgramInfo;
    get localSetLayout(): DescriptorSetLayout;
    get program(): string;
    get properties(): Record<string, EffectAsset.IPropertyInfo>;
    get defines(): Record<string, string | number | boolean>;
    get passIndex(): number;
    get propertyIndex(): number;
    get dynamics(): IPassDynamics;
    get blocks(): Float32Array[];
    get blocksInt(): Int32Array[];
    get rootBufferDirty(): boolean;
    /**
     * @engineInternal
     * @mangle
     * Currently, can not just mark setter as engine internal, so change to a function.
     */
    setRootBufferDirty(val: boolean): void;
    get priority(): RenderPriority;
    /**
     * @engineInternal
     * @mangle
     * Currently, can not just mark setter as engine internal, so change to a function.
     */
    setPriority(val: RenderPriority): void;
    get primitive(): PrimitiveMode;
    get stage(): RenderPassStage;
    get phase(): number;
    get passID(): number;
    get phaseID(): number;
    get rasterizerState(): RasterizerState;
    get depthStencilState(): DepthStencilState;
    get blendState(): BlendState;
    get dynamicStates(): DynamicStateFlags;
    get batchingScheme(): BatchingSchemes;
    get descriptorSet(): DescriptorSet;
    get hash(): number;
    get pipelineLayout(): PipelineLayout;
}
export {};
