import { Material } from '../../asset/assets/material';
import { RenderingSubMesh } from '../../asset/assets/rendering-sub-mesh';
import { Node } from '../../scene-graph';
import { RenderScene } from '../core/render-scene';
import { Texture2D } from '../../asset/assets/texture-2d';
import { SubModel } from './submodel';
import { IMacroPatch } from '../core/pass';
import { Vec3, Vec4, geometry } from '../../core';
import { Attribute, DescriptorSet, Device, Buffer, Texture } from '../../gfx';
import { TextureCube } from '../../asset/assets';
import { ReflectionProbeType } from '../../3d/reflection-probe/reflection-probe-enum';
export declare enum ModelType {
    DEFAULT = 0,
    SKINNING = 1,
    BAKED_SKINNING = 2,
    BATCH_2D = 3,
    PARTICLE_BATCH = 4,
    LINE = 5
}
/**
 * @en A representation of a model instance
 * The base model class, which is the core component of [[MeshRenderer]],
 * adds its own Model to the rendered scene for rendering submissions when [[MeshRenderer]] is enabled.
 * This type of object represents a rendering instance in a scene, and it can contain multiple sub models,
 * each of which corresponds to a material. These sub models share the same location and form a complete object.
 * Each sub model references a sub mesh resource, which provides vertex and index buffers for rendering.
 * @zh 代表一个模型实例
 * 基础模型类，它是 [[MeshRenderer]] 的核心组成部分，在 [[MeshRenderer]] 启用时会将自己的 Model 添加到渲染场景中用于提交渲染。
 * 此类型对象代表一个场景中的渲染实例，它可以包含多个子模型，每个子模型对应一个材质。这些子模型共享同样的位置，组成一个完整的物体。
 * 每个子模型引用一个子网格资源，后者提供渲染所用的顶点与索引缓冲。
 */
export declare class Model {
    /**
     * @en Sub models of the current model
     * @zh 获取所有子模型
     */
    get subModels(): SubModel[];
    /**
     * @en Whether the model is initialized
     * @zh 是否初始化
     */
    get inited(): boolean;
    /**
     * @en The axis-aligned bounding box of the model in the world space
     * @zh 获取世界空间包围盒
     */
    get worldBounds(): geometry.AABB | null;
    /**
     * @en The axis-aligned bounding box of the model in the model space
     * @zh 获取模型空间包围盒
     */
    get modelBounds(): geometry.AABB | null;
    /**
     * @en The ubo buffer of the model
     * @zh 获取模型的 ubo 缓冲
     */
    get localBuffer(): Buffer | null;
    /**
     * @en The SH ubo buffer of the model
     * @zh 获取模型的球谐 ubo 缓冲
     */
    get localSHBuffer(): Buffer | null;
    /**
     * @en The world bound ubo buffer
     * @zh 获取世界包围盒 ubo 缓冲
     */
    get worldBoundBuffer(): Buffer | null;
    /**
     * @en The time stamp of last update
     * @zh 获取上次更新时间戳
     */
    get updateStamp(): number;
    /**
     * @en Use LightProbe or not
     * @zh 光照探针开关
     */
    get useLightProbe(): boolean;
    set useLightProbe(val: boolean);
    /**
     * @en located tetrahedron index
     * @zh 模型所处的四面体索引
     */
    get tetrahedronIndex(): number;
    set tetrahedronIndex(index: number);
    /**
     * @en Model level shadow bias
     * @zh 阴影偏移值
     */
    get shadowBias(): number;
    set shadowBias(val: number);
    /**
     * @en Model level shadow normal bias
     * @zh 阴影法线偏移值
     */
    get shadowNormalBias(): number;
    set shadowNormalBias(val: number);
    /**
     * @en Whether the model should receive shadow
     * @zh 是否接收阴影
     */
    get receiveShadow(): boolean;
    set receiveShadow(val: boolean);
    /**
     * @en Whether the model should cast shadow
     * @zh 是否投射阴影
     */
    get castShadow(): boolean;
    set castShadow(val: boolean);
    /**
     * @en Gets or sets receive direction Light.
     * @zh 获取或者设置接收平行光光照。
     */
    get receiveDirLight(): boolean;
    set receiveDirLight(val: boolean);
    /**
     * @en The node to which the model belongs
     * @zh 模型所在的节点
     */
    get node(): Node;
    set node(n: Node);
    /**
     * @en Model's transform
     * @zh 模型的变换
     */
    get transform(): Node;
    set transform(n: Node);
    /**
     * @en Model's visibility tag
     * Model's visibility flags, it's different from [[Node.layer]],
     * but it will also be compared with [[Camera.visibility]] during culling process.
     * @zh 模型的可见性标志
     * 模型的可见性标志与 [[Node.layer]] 不同，它会在剔除阶段与 [[Camera.visibility]] 进行比较
     */
    get visFlags(): number;
    set visFlags(val: number);
    /**
     * @en Whether the model is enabled in the render scene so that it will be rendered
     * @zh 模型是否在渲染场景中启用并被渲染
     */
    get enabled(): boolean;
    set enabled(val: boolean);
    /**
     * @en Rendering priority in the transparent queue of model.
     * @zh Model 在透明队列中的渲染排序优先级
     */
    get priority(): number;
    set priority(val: number);
    /**
     * @en Whether the model can be render by the reflection probe
     * @zh 模型是否能被反射探针渲染
     */
    get bakeToReflectionProbe(): boolean;
    set bakeToReflectionProbe(val: boolean);
    /**
     * @en Reflection probe type
     * @zh 反射探针类型。
     */
    get reflectionProbeType(): ReflectionProbeType;
    set reflectionProbeType(val: ReflectionProbeType);
    /**
     * @en sets or gets reflection probe id
     * @zh 设置或获取反射探针id。
     */
    get reflectionProbeId(): number;
    set reflectionProbeId(val: number);
    /**
     * @en Sets or gets the reflection probe id for blend.
     * @zh 设置或获取用于混合的反射探针id。
     */
    get reflectionProbeBlendId(): number;
    set reflectionProbeBlendId(val: number);
    /**
     * @en Sets or gets the reflection probe blend weight.
     * @zh 设置或获取反射探针混合权重。
     */
    get reflectionProbeBlendWeight(): number;
    set reflectionProbeBlendWeight(val: number);
    /**
     * @en The type of the model
     * @zh 模型类型
     */
    type: ModelType;
    /**
     * @en The render scene to which the model belongs
     * @zh 模型所在的场景
     */
    scene: RenderScene | null;
    /**
     * @en Whether dynamic batching is enabled for model
     * @zh 是否动态合批
     */
    isDynamicBatching: boolean;
    /**
     * @en The world axis-aligned bounding box
     * @zh 世界空间包围盒
     */
    protected _worldBounds: geometry.AABB | null;
    /**
     * @en The model axis-aligned bounding box
     * @zh 模型空间包围盒
     */
    protected _modelBounds: geometry.AABB | null;
    /**
     * @en Sub models
     * @zh 子模型
     */
    protected _subModels: SubModel[];
    /**
     * @en The node to which the model belongs
     * @zh 模型所在的节点
     */
    protected _node: Node;
    /**
     * @en Model's transform
     * @zh 子模型的变换
     */
    protected _transform: Node;
    /**
     * @en Current gfx device
     * @zh 当前 GFX 设备
     */
    protected _device: Device;
    /**
     * @en Whether the model is initialized
     * @zh 是否初始化过
     */
    protected _inited: boolean;
    /**
     * @en Descriptor set count
     * @zh 描述符集合个数
     */
    protected _descriptorSetCount: number;
    /**
     * @en Time stamp for last update
     * @zh 更新时间戳
     */
    protected _updateStamp: number;
    /**
     * @en Local ubo data dirty flag
     * @zh 本地 ubo 数据是否修改过
     */
    protected _localDataUpdated: boolean;
    /**
     * @en Local ubo data
     * @zh 本地 ubo 数据
     */
    protected _localData: Float32Array;
    /**
     * @en Local ubo buffer
     * @zh 本地 ubo 缓冲
     */
    protected _localBuffer: Buffer | null;
    /**
     * @en Local SH ubo data
     * @zh 本地球谐 ubo 数据
     */
    protected _localSHData: Float32Array | null;
    /**
     * @en Local SH ubo buffer
     * @zh 本地球谐 ubo 缓冲
     */
    protected _localSHBuffer: Buffer | null;
    private _lightmap;
    private _lightmapUVParam;
    /**
     * @en located tetrahedron index
     * @zh 所处的四面体索引
     */
    private _tetrahedronIndex;
    private _lastWorldBoundCenter;
    private _useLightProbe;
    /**
     * @en World AABB buffer
     * @zh 世界空间包围盒缓冲
     */
    protected _worldBoundBuffer: Buffer | null;
    /**
     * @en Whether the model should receive shadow
     * @zh 是否接收阴影
     */
    protected _receiveShadow: boolean;
    /**
     * @en Whether the model should cast shadow
     * @zh 是否投射阴影
     */
    protected _castShadow: boolean;
    /**
     * @en Is received direction Light.
     * @zh 是否接收平行光光照。
     */
    protected _receiveDirLight: boolean;
    /**
     * @en Shadow bias
     * @zh 阴影偏移
     */
    protected _shadowBias: number;
    /**
     * @en Shadow normal bias
     * @zh 阴影法线偏移
     */
    protected _shadowNormalBias: number;
    /**
     * @en Reflect probe Id
     * @zh 使用第几个反射探针
     */
    protected _reflectionProbeId: number;
    /**
     * @en Use which probe to blend
     * @zh 使用第几个反射探针进行混合
     */
    protected _reflectionProbeBlendId: number;
    /**
     * @en Reflection probe blend weight
     * @zh 反射探针混合权重
     */
    protected _reflectionProbeBlendWeight: number;
    /**
     * @en Whether the model is enabled in the render scene so that it will be rendered
     * @zh 模型是否在渲染场景中启用并被渲染
     */
    protected _enabled: boolean;
    /**
     * @en The visibility flags
     * @zh 可见性标志位
     */
    protected _visFlags: number;
    protected _priority: number;
    /**
     * @en Whether the model can be render by the reflection probe
     * @zh 模型是否能被反射探针渲染
     */
    protected _bakeToReflectionProbe: boolean;
    /**
     * @en Reflection probe type.
     * @zh 反射探针类型。
     */
    protected _reflectionProbeType: ReflectionProbeType;
    /**
     * @internal
     * @en native object
     * @zh 原生对象
     */
    /**
     * @internal
     * @en return native object
     * @zh 返回原生对象
     */
    /**
     * @en Constructor to create an empty model
     * @zh 创建一个空模型
     */
    constructor();
    /**
     * @en Initialize the model
     * @zh 初始化模型
     */
    initialize(): void;
    /**
     * @en Destroy the model
     * @zh 销毁模型
     */
    destroy(): void;
    /**
     * @en Attach the model to a [[renderer.RenderScene]]
     * @zh 添加模型到渲染场景 [[renderer.RenderScene]] 中
     * @param scene destination scene
     */
    attachToScene(scene: RenderScene): void;
    /**
     * @en Detach the model from its render scene
     * @zh 移除场景中的模型
     */
    detachFromScene(): void;
    /**
     * @en Update the model's transform
     * @zh 更新模型的变换
     * @param stamp time stamp
     */
    updateTransform(stamp: number): void;
    /**
     * @en Update the model's world AABB
     * @zh 更新模型的世界空间包围盒
     */
    updateWorldBound(): void;
    /**
     * @en Update the model's ubo
     * @zh 更新模型的 ubo
     * @param stamp time stamp
     */
    updateUBOs(stamp: number): void;
    /**
     * @engineInternal
     * @mangle
     * @en Invalidate local data
     * @zh 使本地数据失效
     */
    invalidateLocalData(): void;
    showTetrahedron(): boolean;
    private isLightProbeAvailable;
    private updateSHBuffer;
    /**
     * @en Clear the model's SH ubo
     * @zh 清除模型的球谐 ubo
     */
    clearSHUBOs(): void;
    /**
     * @en Update the model's SH ubo
     * @zh 更新模型的球谐 ubo
     */
    updateSHUBOs(): void;
    /**
     * @en Create the model's AABB
     * @zh 创建模型的包围盒
     * @param minPos min position of the AABB
     * @param maxPos max position of the AABB
     */
    createBoundingShape(minPos?: Vec3, maxPos?: Vec3): void;
    private _createSubModel;
    /**
     * @en Initialize a sub model with the sub mesh data and the material.
     * @zh 用子网格数据和材质初始化一个子模型。
     * @param idx sub model's index
     * @param subMeshData sub mesh
     * @param mat sub material
     */
    initSubModel(idx: number, subMeshData: RenderingSubMesh, mat: Material): void;
    /**
     * @en Set material for a given sub model
     * @zh 为指定的子模型设置材质
     * @param idx sub model's index
     * @param subMesh sub mesh
     */
    setSubModelMesh(idx: number, subMesh: RenderingSubMesh): void;
    /**
     * @en Set a sub material
     * @zh 设置一个子材质
     * @param idx sub model's index
     * @param mat sub material
     */
    setSubModelMaterial(idx: number, mat: Material): void;
    /**
     * @en Pipeline changed callback
     * @zh 管线更新回调
     */
    onGlobalPipelineStateChanged(): void;
    /**
     * @en Shader macro changed callback
     * @zh Shader 宏更新回调
     */
    onMacroPatchesStateChanged(): void;
    onGeometryChanged(): void;
    /**
     * @internal
     * If the model has lighting map
     * initialize lighting map info before model initializing
     * because the lighting map will influence the shader
     */
    initLightingmap(texture: Texture2D | null, uvParam: Vec4): void;
    /**
     * @en Update the light map info
     * @zh 更新光照贴图信息
     * @param texture light map
     * @param uvParam uv coordinate
     */
    updateLightingmap(texture: Texture2D | null, uvParam: Vec4): void;
    /**
     * @en Update the cube map of the reflection probe
     * @zh 更新反射探针的立方体贴图
     * @param texture probe cubemap
     */
    updateReflectionProbeCubemap(texture: TextureCube | null): void;
    /**
     * @en Update the cube map of the reflection probe for blend
     * @zh 更新用于blend的反射探针立方体贴图
     * @param texture probe cubemap
     */
    updateReflectionProbeBlendCubemap(texture: TextureCube | null): void;
    /**
     * @en Update the planar relflection map of the reflection probe
     * @zh 更新反射探针的平面反射贴图
     * @param texture planar relflection map
     */
    updateReflectionProbePlanarMap(texture: Texture | null): void;
    /**
     * @en Update the data map of the reflection probe
     * @zh 更新反射探针的数据贴图
     * @param texture data map
     */
    updateReflectionProbeDataMap(texture: Texture2D | null): void;
    /**
     * @en Update the shadow bias
     * @zh 更新阴影偏移
     */
    updateLocalShadowBias(): void;
    /**
     * @en Update the id of reflection probe
     * @zh 更新物体使用哪个反射探针
     */
    updateReflectionProbeId(): void;
    /**
     * @en Return shader's macro patches
     * @zh 获取 shader 宏
     * @param subModelIndex sub model's index
     */
    getMacroPatches(subModelIndex: number): IMacroPatch[] | null;
    protected _updateAttributesAndBinding(subModelIndex: number): void;
    protected _updateInstancedAttributes(attributes: Attribute[], subModel: SubModel): void;
    protected _initLocalDescriptors(subModelIndex: number): void;
    protected _initLocalSHDescriptors(subModelIndex: number): void;
    protected _initWorldBoundDescriptors(subModelIndex: number): void;
    protected _updateLocalDescriptors(subModelIndex: number, descriptorSet: DescriptorSet): void;
    protected _updateLocalSHDescriptors(subModelIndex: number, descriptorSet: DescriptorSet): void;
    protected _updateWorldBoundDescriptors(subModelIndex: number, descriptorSet: DescriptorSet): void;
}
