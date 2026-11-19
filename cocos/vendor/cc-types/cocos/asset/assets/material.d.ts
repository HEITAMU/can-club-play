import { Asset } from './asset';
import { EffectAsset } from './effect-asset';
import { Texture } from '../../gfx';
import { TextureBase } from './texture-base';
import { Pass, PassOverrides } from '../../render-scene/core/pass';
import { MacroRecord, MaterialProperty } from '../../render-scene/core/pass-utils';
import { Renderer } from '../../misc/renderer';
/**
 * @en The basic infos for material initialization.
 * @zh 用来初始化材质的基本信息。
 */
export interface IMaterialInfo {
    /**
     * @en The EffectAsset to use. Must provide if `effectName` is not specified.
     * @zh
     * 这个材质将使用的 EffectAsset，直接提供资源引用，和 `effectName` 至少要指定一个。
     */
    effectAsset?: EffectAsset | null;
    /**
     * @en
     * The name of the EffectAsset to use. Must provide if `effectAsset` is not specified.
     * @zh
     * 这个材质将使用的 EffectAsset，通过 effect 名指定，和 `effectAsset` 至少要指定一个。
     */
    effectName?: string;
    /**
     * @en
     * The index of the technique to use.
     * @zh
     * 这个材质将使用第几个 technique，默认为 0。
     */
    technique?: number;
    /**
     * @en
     * The shader macro definitions. Default to 0 or the specified value in [[EffectAsset]].
     * @zh
     * 这个材质定义的预处理宏，默认全为 0，或 [[EffectAsset]] 中的指定值。
     */
    defines?: MacroRecord | MacroRecord[];
    /**
     * @en
     * The override values on top of the pipeline states specified in [[EffectAsset]].
     * @zh
     * 这个材质的自定义管线状态，将覆盖 effect 中的属性。<br>
     * 注意在可能的情况下请尽量少的自定义管线状态，以减小对渲染效率的影响。
     */
    states?: PassOverrides | PassOverrides[];
}
export type MaterialPropertyFull = MaterialProperty | TextureBase | Texture | null;
/**
 * @en The material asset, specifies in details how a model is drawn on screen.
 * @zh 材质资源类，包含模型绘制方式的全部细节描述。
 */
export declare class Material extends Asset {
    /**
     * @en Get hash for a material
     * @zh 获取一个材质的哈希值
     * @param material
     */
    static getHash(material: Material): number;
    /**
     * @engineInternal
     */
    protected _effectAsset: EffectAsset | null;
    /**
     * @internal
     */
    protected _techIdx: number;
    /**
     * @internal
     */
    protected _defines: MacroRecord[];
    /**
     * @internal
     */
    protected _states: PassOverrides[];
    /**
     * @internal
     */
    protected _props: Record<string, MaterialPropertyFull | MaterialPropertyFull[]>[];
    /**
     * @internal
     */
    protected _passes: Pass[];
    /**
     * @internal
     */
    protected _hash: number;
    constructor(name?: string);
    /**
     * @en The current [[EffectAsset]].
     * @zh 当前使用的 [[EffectAsset]] 资源。
     */
    get effectAsset(): EffectAsset | null;
    /**
     * @en Name of the current [[EffectAsset]].
     * @zh 当前使用的 [[EffectAsset]] 资源名。
     */
    get effectName(): string;
    /**
     * @en The current technique index.
     * @zh 当前的 technique 索引。
     */
    get technique(): number;
    /**
     * @en The passes defined in this material.
     * @zh 当前正在使用的 pass 数组。
     */
    get passes(): Pass[];
    /**
     * @en The hash value of this material.
     * @zh 材质的 hash。
     */
    get hash(): number;
    /**
     * @en The parent material.
     * @zh 父材质。
     */
    get parent(): Material | null;
    /**
     * @en The owner render component.
     * @zh 该材质所归属的渲染组件。
     */
    get owner(): Renderer | null;
    /**
     * @en Initialize this material with the given information.
     * @zh 根据所给信息初始化这个材质，初始化正常结束后材质即可立即用于渲染。
     * @param info @en Material description info. @zh 材质描述信息
     */
    initialize(info: IMaterialInfo): void;
    /**
     * @en Reset the material with the given information.
     * @zh 使用指定的信息重置该材质。
     *
     * @param info @en Material description info. @zh 材质描述信息。
     */
    reset(info: IMaterialInfo): void;
    /**
     * @en
     * Destroy the material definitively.<br>
     * Cannot re-initialize after destroy.<br>
     * Modifications on active materials can be acheived by<br>
     * creating a new Material, invoke the `copy` function<br>
     * with the desired overrides, and assigning it to the target components.
     * @zh
     * 彻底销毁材质，注意销毁后无法重新初始化。<br>
     * 如需修改现有材质，请创建一个新材质，<br>
     * 调用 copy 函数传入需要的 overrides 并赋给目标组件。
     */
    destroy(): boolean;
    /**
     * @en Recompile the shader with the specified macro overrides. Allowed only on material instances.
     * @zh 使用指定预处理宏重新编译当前 pass（数组）中的 shader。只允许对材质实例执行。
     * @param overrides @en The shader macro override values. @zh 宏的覆盖值，用于编译不同 Shader 变体。
     * @param passIdx @en The pass to apply to. Will apply to all passes if not specified. @zh 要重编的 pass 索引，如果没有指定，则重编所有 pass。
     */
    recompileShaders(overrides: MacroRecord, passIdx?: number): void;
    /**
     * @en Override the passes with the specified pipeline states. Allowed only on material instances.
     * @zh 使用指定管线状态重载当前的 pass（数组）。只允许对材质实例执行。
     * @param overrides The pipeline state override values.
     * @param passIdx The pass to apply to. Will apply to all passes if not specified.
     */
    overridePipelineStates(overrides: PassOverrides, passIdx?: number): void;
    /**
     * @en Callback function after material is loaded in [[AssetManager]]. Initialize the resources automatically.
     * @zh 通过 [[AssetManager]] 加载完成时的回调，将自动初始化材质资源。
     */
    onLoaded(): void;
    /**
     * @en Reset all the uniforms to the default value specified in [[EffectAsset]].
     * @zh 重置材质的所有 uniform 参数数据为 [[EffectAsset]] 中的默认初始值。
     * @param clearPasses @en Whether to clear the rendering data too. @zh 是否同时清空渲染数据。
     */
    resetUniforms(clearPasses?: boolean): void;
    /**
     * @en
     * Convenient property setter provided for quick material setup.<br>
     * [[renderer.Pass.setUniform]] should be used instead if you need to do per-frame uniform update.
     * @zh
     * 设置材质 uniform 参数的统一入口。<br>
     * 注意如果需要每帧更新 uniform，建议使用 [[renderer.Pass.setUniform]] 以获得更好的性能。
     * @param name @en The target uniform name. @zh 目标 Uniform 名称。
     * @param val @en The target value. @zh 需要设置的目标值。
     * @param passIdx
     * @en The pass to apply to. Will apply to all passes if not specified.
     * @zh 设置此属性的 pass 索引，如果没有指定，则会设置此属性到所有 pass 上。
     */
    setProperty(name: string, val: MaterialPropertyFull | MaterialPropertyFull[], passIdx?: number): void;
    /**
     * @en
     * Gets the specified uniform value for this material.<br>
     * Note that only uniforms set through [[Material.setProperty]] can be acquired here.<br>
     * For the complete rendering data, use [[renderer.Pass.getUniform]] instead.
     * @zh
     * 获取当前材质的指定 uniform 参数的值。<br>
     * 注意只有通过 [[Material.setProperty]] 函数设置的参数才能从此函数取出，<br>
     * 如需取出完整的渲染数据，请使用 [[renderer.Pass.getUniform]]。
     * @param name @en The property or uniform name. @zh 属性或 Uniform 的名称。
     * @param passIdx
     * @en The target pass index. If not specified, return the first found value in all passes.
     * @zh 目标 pass 索引，如果没指定，则返回所有 pass 中第一个找到的值。
     * @return @en The acquired material properties. @zh 获取的材质属性。
     */
    getProperty(name: string, passIdx?: number): Readonly<MaterialPropertyFull | MaterialPropertyFull[]>;
    /**
     * @en Copy the target material, with optional overrides.
     * @zh 复制目标材质到当前实例，允许提供重载信息。
     * @param mat @en The material to be copied. @zh 需要拷贝的原始材质。
     * @param overrides @en The overriding states on top of the original material. @zh 需要在原始材质上覆盖的状态。
     */
    copy(mat: Material, overrides?: IMaterialInfo): void;
    /**
     * @engineInternal
     * @mangle
     */
    protected _fillInfo(info: IMaterialInfo): void;
    /**
     * @engineInternal
     * @mangle
     */
    protected _prepareInfo(patch: Record<string, unknown> | Record<string, unknown>[], cur: Record<string, unknown>[]): void;
    /**
     * @engineInternal
     * @mangle
     */
    protected _createPasses(): Pass[];
    /**
     * @engineInternal
     * @mangle
     */
    protected _update(keepProps?: boolean): void;
    /**
     * @engineInternal
     * @mangle
     */
    protected _uploadProperty(pass: Pass, name: string, val: MaterialPropertyFull | MaterialPropertyFull[]): boolean;
    /**
     * @engineInternal
     * @mangle
     */
    protected _bindTexture(pass: Pass, handle: number, val: MaterialPropertyFull, index?: number): void;
    /**
     * @engineInternal
     * @mangle
     */
    protected _doDestroy(): void;
    initDefault(uuid?: string): void;
    validate(): boolean;
}
