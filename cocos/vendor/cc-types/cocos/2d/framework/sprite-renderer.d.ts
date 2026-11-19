import { Material } from '../../asset/assets';
import { Color, Vec2 } from '../../core';
import { Model } from '../../render-scene/scene';
import { SpriteFrame } from '../assets/sprite-frame';
import { ModelRenderer } from '../../misc';
declare enum SpriteMode {
    SIMPLE = 0,
    SLICED = 1,
    TILED = 2
}
/**
 * @en 2D rendering component that provides the ability to render sprite in 3D space.
 * @zh 2D 渲染基础组件，提供精灵渲染在 3D 空间中的能力。
 */
export declare class SpriteRenderer extends ModelRenderer {
    constructor();
    /**
    * @en The spriteFrame that the component should render.
    * @zh 该组件应渲染的 spriteFrame。
    */
    get spriteFrame(): SpriteFrame | null;
    set spriteFrame(value: SpriteFrame | null);
    /**
     * @en Rendering model of the component.
     * @zh 该组件的渲染模型。
     */
    get model(): Model | null;
    protected _spriteFrame: SpriteFrame | null;
    protected _mode: SpriteMode;
    protected _color: Color;
    protected _flipX: boolean;
    protected _flipY: boolean;
    protected _size: Vec2;
    private _model;
    onLoad(): void;
    onRestore(): void;
    onEnable(): void;
    onDisable(): void;
    onDestroy(): void;
    protected _updateModels(): void;
    protected _createModel(): void;
    protected _updateModelParams(): void;
    protected _getBuiltinMaterial(): Material;
    protected _onMaterialModified(idx: number, material: Material | null): void;
    /**
     * @engineInternal
     */
    _onRebuildPSO(idx: number, material: Material): void;
    protected _onUpdateLocalDescriptorSet(): void;
    protected _attachToScene(): void;
    /**
     * @engineInternal
     */
    _detachFromScene(): void;
}
export {};
