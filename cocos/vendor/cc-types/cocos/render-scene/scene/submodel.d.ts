/// <reference types="./@types/globals" />
import { RenderingSubMesh } from '../../asset/assets/rendering-sub-mesh';
import { RenderPriority } from '../../rendering/define';
import { IMacroPatch, Pass } from '../core/pass';
import { DescriptorSet, Device, InputAssembler, Shader, Attribute } from '../../gfx';
import { Mat4 } from '../../core';
export interface IInstancedAttributeBlock {
    buffer: Uint8Array;
    views: TypedArray[];
    attributes: Attribute[];
}
/**
 * @en A sub part of the model, it describes how to render a specific sub mesh.
 * It contains geometry information in [[RenderingSubMesh]] and all sort of rendering configuration like shaders, macro patches, passes etc.
 * @zh 组成模型对象的子模型，它用来描述如何渲染模型的一个子网格。
 * 它包含 [[RenderingSubMesh]] 代表的几何网格信息和所有渲染需要的数据，比如着色器程序，着色器宏定义，渲染 pass，等。
 */
export declare class SubModel {
    protected _device: Device | null;
    protected _passes: Pass[] | null;
    protected _shaders: Shader[] | null;
    protected _subMesh: RenderingSubMesh | null;
    protected _patches: IMacroPatch[] | null;
    protected _priority: RenderPriority;
    protected _inputAssembler: InputAssembler | null;
    protected _descriptorSet: DescriptorSet | null;
    protected _worldBoundDescriptorSet: DescriptorSet | null;
    protected _instancedAttributeBlock: IInstancedAttributeBlock;
    protected _instancedWorldMatrixIndex: number;
    protected _instancedSHIndex: number;
    protected _useReflectionProbeType: number;
    constructor();
    /**
     * @en
     * sub model's passes
     * @zh
     * 子模型的 passes
     * @param passes @en The passes @zh 设置的 passes
     */
    /**
     * @en Render passes for the sub-model
     * @zh 子模型的渲染 pass
     */
    set passes(passes: Pass[]);
    get passes(): Pass[];
    /**
     * @en Shaders for the sub-model, each shader corresponds to one of the [[passes]]
     * @zh 子模型的着色器程序列表，每个着色器程序对应其中一个渲染 [[passes]]
     */
    get shaders(): Shader[];
    /**
     * @en The rendering sub mesh for the sub-model, each sub-model can only have one sub mesh.
     * @zh 用于渲染的子网格对象，每个子模型只能包含一个子网格。
     */
    set subMesh(subMesh: RenderingSubMesh);
    get subMesh(): RenderingSubMesh;
    /**
     * @en The rendering priority of the sub-model
     * @zh 子模型的渲染优先级
     */
    set priority(val: RenderPriority);
    get priority(): RenderPriority;
    /**
     * @en The low level input assembler which contains geometry data
     * @zh 底层渲染用的输入汇集器，包含几何信息
     */
    get inputAssembler(): InputAssembler;
    /**
     * @en The descriptor set used for sub-model rendering
     * @zh 底层渲染子模型用的描述符集组
     */
    get descriptorSet(): DescriptorSet;
    /**
     * @en The descriptor set for world bound
     * @zh 用于存储世界包围盒的描述符集组
     */
    get worldBoundDescriptorSet(): DescriptorSet | null;
    /**
     * @en The macro patches for the shaders
     * @zh 着色器程序所用的宏定义组合
     */
    get patches(): Readonly<IMacroPatch[] | null>;
    /**
     * @en The instance attribute block, access by sub model
     * @zh 硬件实例化属性，通过子模型访问
     */
    get instancedAttributeBlock(): IInstancedAttributeBlock;
    /**
     * @en Get or set instance matrix id, access by sub model
     * @zh 获取或者设置硬件实例化中的矩阵索引，通过子模型访问
     */
    set instancedWorldMatrixIndex(val: number);
    get instancedWorldMatrixIndex(): number;
    /**
     * @en Get or set instance SH id, access by sub model
     * @zh 获取或者设置硬件实例化中的球谐索引，通过子模型访问
     */
    set instancedSHIndex(val: number);
    get instancedSHIndex(): number;
    /**
     * @en Gets or sets the type of reflection probe, Used to process instance
     * @zh 获取或设置使用反射探针的类型，用于处理instance
     */
    set useReflectionProbeType(val: number);
    get useReflectionProbeType(): number;
    /**
     * @en
     * init sub model
     * @zh
     * 子模型初始化
     * @param subMesh @en The sub mesh @zh 子网格资源
     * @param passes @en The passes @zh 渲染的 passes
     * @param patches @en The shader's macro @zh 着色器的宏定义
     */
    initialize(subMesh: RenderingSubMesh, passes: Pass[], patches?: IMacroPatch[] | null): void;
    /**
     * @en
     * destroy sub model
     * @zh
     * 销毁子模型
     */
    destroy(): void;
    /**
     * @en
     * update sub model
     * @zh
     * 更新子模型
     */
    update(): void;
    private _updatePasses;
    /**
     * @en Pipeline changed callback
     * @zh 管线更新回调
     */
    onPipelineStateChanged(): void;
    /**
     * @en Shader macro changed callback
     * @zh Shader 宏更新回调
     */
    onMacroPatchesStateChanged(patches: IMacroPatch[] | null): void;
    /**
     * @en
     * geometry changed callback
     * @zh
     * 几何数据改变后的回调
     */
    onGeometryChanged(): void;
    /**
     * @en
     * get instanced attribute index
     * @zh
     * 获取硬件实例化相关索引
     */
    /**
     * @internal
     */
    getInstancedAttributeIndex(name: string): number;
    /**
     * @en
     * update instancing related data, invoked by model
     * @zh
     * 更新硬件实例化相关数据，一般由model调用
     */
    /**
     * @internal
     */
    updateInstancedWorldMatrix(mat: Mat4, idx: number): void;
    /**
     * @en
     * update instancing SH data, invoked by model
     * @zh
     * 更新硬件实例化球谐数据，一般由model调用
     */
    /**
     * @internal
     */
    updateInstancedSH(data: Float32Array, idx: number): void;
    /**
     * @en
     * update instancing related data, invoked by model
     * @zh
     * 更新硬件实例化相关数据，一般由model调用
     */
    /**
     * @internal
     */
    UpdateInstancedAttributes(attributes: Attribute[]): void;
    protected _flushPassInfo(): void;
}
