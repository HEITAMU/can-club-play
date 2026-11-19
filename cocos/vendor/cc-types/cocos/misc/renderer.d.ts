import { Material } from '../asset/assets/material';
import { Component } from '../scene-graph';
import { MaterialInstance } from '../render-scene/core/material-instance';
/**
 * @en Base class for all components which can submit contents for the rendering process.
 * It manages a series of [[renderer.Model]]s and the visibility, the materials and the material instances of the models.
 * There are several different material properties that must be distinguished clearly and used with caution:
 * - [[sharedMaterials]] are shared for all component instances that are using the same material asset, modification will be applied universally.
 * - [[materials]] are instances created independently for the component instance, modification will only be applied for the component instance.
 * - Render Materials retrieved by [[getRenderMaterial]] are materials used for the actual rendering process, material instances are used if exist.
 * By default, shared materials are used for rendering.
 * Material instances are created only when user try to retrieve a material instance with [[material]], [[materials]] and [[getMaterialInstance]].
 * @zh 所有可以提交内容到渲染流程的可渲染类的基类，它管理着一组 [[renderer.Model]]，以及它们的可见性、材质和材质实例。
 * 下面是这个组件所管理的各种材质属性的解释，需要正确区分并小心使用：
 * - [[sharedMaterials]] 是共享材质，所有使用此材质资源的组件实例都默认使用材质的共享实例对象，所有修改都会影响所有使用它的组件实例。
 * - [[materials]] 是专为组件对象创建的独立材质实例，所有修改仅会影响当前组件对象。
 * - 使用 [[getRenderMaterial]] 获取的渲染材质是用于实际渲染流程的材质对象，当存在材质实例的时候，永远使用材质实例。
 * 默认情况下，渲染组件使用共享材质进行渲染，材质实例也不会被创建出来。仅在用户通过 [[material]]，[[materials]] 和 [[getMaterialInstance]] 接口获取材质时才会创建材质实例。
 */
export declare class Renderer extends Component {
    constructor();
    /**
     * @en Get the default shared material
     * @zh 获取默认的共享材质
     */
    get sharedMaterial(): Material | null;
    /**
     * @en All shared materials of model
     * @zh 模型的所有共享材质
     */
    get sharedMaterials(): (Material | null)[];
    set sharedMaterials(val: (Material | null)[]);
    /**
     * @en The default material instance, it will create a new instance from the default shared material if not created yet.
     * @zh 获取默认的材质实例，如果还没有创建，将会根据默认共享材质创建一个新的材质实例
     */
    get material(): Material | MaterialInstance | null;
    set material(val: Material | MaterialInstance | null);
    /**
     * @en The materials of the model.
     * @zh 所有模型材质。
     */
    get materials(): (Material | MaterialInstance | null)[];
    set materials(val: (Material | MaterialInstance | null)[]);
    protected _materials: (Material | null)[];
    protected _materialInstances: (MaterialInstance | null)[];
    /**
     * @deprecated Since v3.7.3, please use [[getSharedMaterial]] instead.
     */
    getMaterial(idx: number): Material | null;
    /**
     * @deprecated Since v3.8.1, please use [[setSharedMaterial]] instead.
     */
    setMaterial(material: Material | null, index: number): void;
    /**
     * @en Get the shared material asset of the specified sub-model.
     * @zh 获取指定子模型的共享材质资源。
     */
    getSharedMaterial(idx: number): Material | null;
    /**
     * @en Set the shared material asset of the specified sub-model,
     * new material instance will be created automatically if the sub-model is already using one.
     * @zh 设置指定子模型的 sharedMaterial，如果对应位置有材质实例则会创建一个对应的材质实例。
     */
    setSharedMaterial(material: Material | null, index: number, forceUpdate?: boolean): void;
    /**
     * @en Get the material instance of the specified sub-model.
     * It will create a new instance from the corresponding shared material if not created yet.
     * @zh 获取指定子模型的材质实例。如果还没有创建，将会根据对应的共享材质创建一个新的材质实例
     */
    getMaterialInstance(idx: number): MaterialInstance | null;
    /**
     * @en Set the material instance of the specified sub-model.
     * @zh 获取指定子模型的材质实例。
     */
    setMaterialInstance(matInst: Material | MaterialInstance | null, index: number): void;
    /**
     * @en Get the actual rendering material of the specified sub-model.
     * (material instance if there is one, or the shared material asset)
     * @zh 获取指定位置可供渲染的材质，如果有材质实例则使用材质实例，如果没有则使用材质资源
     */
    getRenderMaterial(index: number): Material | null;
    protected _onMaterialModified(index: number, material: Material | null): void;
    /**
     * @engineInternal
     * @mangle
     */
    _onRebuildPSO(index: number, material: Material | null): void;
    protected _clearMaterials(): void;
}
