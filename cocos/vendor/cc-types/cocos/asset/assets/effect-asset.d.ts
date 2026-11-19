import { BlendState, DepthStencilState, RasterizerState, DynamicStateFlags, PrimitiveMode, ShaderStageFlags, Type, Uniform, MemoryAccess, Format, SampleType } from '../../gfx';
import { RenderPassStage } from '../../rendering/define';
import { MacroRecord } from '../../render-scene/core/pass-utils';
import { Asset } from './asset';
import { TextureBase } from './texture-base';
export declare namespace EffectAsset {
    interface IPropertyInfo {
        type: number;
        handleInfo?: [string, number, number];
        samplerHash?: number;
        value?: number[] | string | TextureBase;
        linear?: boolean;
    }
    interface IPassStates {
        priority?: number;
        primitive?: PrimitiveMode;
        stage?: RenderPassStage;
        rasterizerState?: RasterizerState;
        depthStencilState?: DepthStencilState;
        blendState?: BlendState;
        dynamicStates?: DynamicStateFlags;
        phase?: string | number;
        pass?: string;
        subpass?: string;
    }
    interface IPassInfo extends IPassStates {
        program: string;
        embeddedMacros?: MacroRecord;
        propertyIndex?: number;
        switch?: string;
        properties?: Record<string, IPropertyInfo>;
        shader?: IShaderInfo;
    }
    interface ITechniqueInfo {
        passes: IPassInfo[];
        name?: string;
    }
    interface IBlockInfo {
        binding: number;
        name: string;
        members: Uniform[];
        stageFlags: ShaderStageFlags;
    }
    interface ISamplerTextureInfo {
        binding: number;
        name: string;
        type: Type;
        count: number;
        stageFlags: ShaderStageFlags;
        sampleType: SampleType;
    }
    interface ISamplerInfo {
        set: number;
        binding: number;
        name: string;
        count: number;
        stageFlags: ShaderStageFlags;
    }
    interface ITextureInfo {
        set: number;
        binding: number;
        name: string;
        type: Type;
        count: number;
        stageFlags: ShaderStageFlags;
        sampleType: SampleType;
    }
    interface IBufferInfo {
        binding: number;
        name: string;
        memoryAccess: MemoryAccess;
        stageFlags: ShaderStageFlags;
    }
    interface IImageInfo {
        binding: number;
        name: string;
        type: Type;
        count: number;
        memoryAccess: MemoryAccess;
        stageFlags: ShaderStageFlags;
    }
    interface IInputAttachmentInfo {
        set: number;
        binding: number;
        name: string;
        count: number;
        stageFlags: ShaderStageFlags;
    }
    interface IAttributeInfo {
        name: string;
        format: Format;
        isNormalized: boolean;
        stream: number;
        isInstanced: boolean;
        location: number;
        defines: string[];
    }
    interface IDefineInfo {
        name: string;
        type: string;
        range?: number[];
        options?: string[];
        default?: string;
    }
    interface IBuiltin {
        name: string;
        defines: string[];
        binding?: number;
    }
    interface IBuiltinInfo {
        buffers: IBuiltin[];
        blocks: IBuiltin[];
        samplerTextures: IBuiltin[];
        images: IBuiltin[];
    }
    interface IDescriptorInfo {
        rate: number;
        blocks: IBlockInfo[];
        samplerTextures: ISamplerTextureInfo[];
        samplers: ISamplerInfo[];
        textures: ITextureInfo[];
        buffers: IBufferInfo[];
        images: IImageInfo[];
        subpassInputs: IInputAttachmentInfo[];
    }
    interface IShaderInfo {
        name: string;
        hash: number;
        glsl4: {
            vert: string;
            frag: string;
            compute?: string;
        };
        glsl3: {
            vert: string;
            frag: string;
            compute?: string;
        };
        glsl1: {
            vert: string;
            frag: string;
        };
        builtins: {
            globals: IBuiltinInfo;
            locals: IBuiltinInfo;
            statistics: Record<string, number>;
        };
        defines: IDefineInfo[];
        attributes: IAttributeInfo[];
        blocks: IBlockInfo[];
        samplerTextures: ISamplerTextureInfo[];
        samplers: ISamplerInfo[];
        textures: ITextureInfo[];
        buffers: IBufferInfo[];
        images: IImageInfo[];
        subpassInputs: IInputAttachmentInfo[];
        descriptors: IDescriptorInfo[];
    }
    interface IPreCompileInfo {
        [name: string]: boolean[] | number[] | string[];
    }
}
/**
 * @en Effect asset is the base template for instantiating material, all effects should be unique globally.
 * All effects are managed in a static map of EffectAsset.
 * @zh Effect 资源，作为材质实例初始化的模板，每个 effect 资源都应是全局唯一的。
 * 所有 Effect 资源都由此类的一个静态对象管理。
 */
export declare class EffectAsset extends Asset {
    /**
     * @en Register the effect asset to the static map.
     * @zh 将指定 effect 注册到全局管理器。
     *
     * @param asset @en The effect asset to be registered. @zh 待注册的 effect asset。
     */
    static register(asset: EffectAsset): void;
    /**
     * @en Unregister the effect asset from the static map
     * @zh 将指定 effect 从全局管理器移除。
     *
     * @param asset - @en The effect asset to be removed. @zh 待移除的 effect asset。
     */
    static remove(asset: EffectAsset | string): void;
    /**
     * @en Gets the effect asset by the given name.
     * @zh 获取指定名字的 effect 资源。
     *
     * @param name - @en The name of effect you want to get. @zh 想要获取的 effect 的名字。
     * @returns @en The effect. @zh 你查询的 effect.
     */
    static get(name: string): EffectAsset | null;
    /**
     * @en Gets all registered effect assets.
     * @zh 获取所有已注册的 effect 资源。
     * @returns @en All registered effects. @zh 所有已注册的 effect 资源。
     */
    static getAll(): Record<string, EffectAsset>;
    /**
     * @engineInternal
     */
    protected static _effects: Record<string, EffectAsset>;
    /**
     * @engineInternal
     */
    static isLayoutValid(): boolean;
    /**
     * @engineInternal
     */
    static setLayoutValid(): void;
    /**
     * @engineInternal
     */
    protected static _layoutValid: boolean;
    /**
     * @en The techniques used by the current effect.
     * @zh 当前 effect 的所有可用 technique。
     */
    techniques: EffectAsset.ITechniqueInfo[];
    /**
     * @en The shaders used by the current effect.
     * @zh 当前 effect 使用的所有 shader。
     */
    shaders: EffectAsset.IShaderInfo[];
    /**
     * @en The preprocess macro combinations for the shader
     * @zh 每个 shader 需要预编译的宏定义组合。
     */
    combinations: EffectAsset.IPreCompileInfo[];
    /**
     * @en Whether to hide in editor mode.
     * @zh 是否在编辑器内隐藏。
     */
    hideInEditor: boolean;
    constructor(name?: string);
    /**
     * @en The loaded callback which should be invoked by the [[AssetManager]], will automatically register the effect.
     * @zh 通过 [[AssetManager]] 加载完成时的回调，将自动注册 effect 资源。
     */
    onLoaded(): void;
    /**
     * @engineInternal
     * @mangle
     */
    protected _precompile(): void;
    destroy(): boolean;
    initDefault(uuid?: string): void;
    validate(): boolean;
}
