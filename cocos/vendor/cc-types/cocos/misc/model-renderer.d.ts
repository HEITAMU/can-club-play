import { scene } from '../render-scene';
import { Renderer } from './renderer';
/**
 * @en Base class for all rendering components containing model.
 * @zh 所有包含 model 的渲染组件基类。
 */
export declare class ModelRenderer extends Renderer {
    constructor();
    /**
     * @en The visibility which will be applied to the committed models.
     * @zh 应用于所有提交渲染的 Model 的可见性
     */
    get visibility(): number;
    set visibility(val: number);
    /**
     * @en The priority which will be applied to the committed models.(Valid only in transparent queues)
     * @zh 应用于所有提交渲染的 Model 的排序优先级（只在半透明渲染队列中起效）
     */
    get priority(): number;
    set priority(val: number);
    protected _visFlags: number;
    protected _models: scene.Model[];
    protected _priority: number;
    /**
     * @zh 收集组件中的 models
     * @en Collect the models in this component.
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _collectModels(): scene.Model[];
    protected onEnable(): void;
    protected _attachToScene(): void;
    /**
     * @engineInternal
     */
    _detachFromScene(): void;
    protected _onVisibilityChange(val: any): void;
    protected _updatePriority(): void;
}
