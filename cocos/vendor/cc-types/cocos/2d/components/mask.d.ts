import { Color, Vec2 } from '../../core';
import { Graphics } from './graphics';
import { TransformBit } from '../../scene-graph/node-enum';
import { Stage } from '../renderer/stencil-manager';
import { Sprite } from './sprite';
import { Component } from '../../scene-graph';
import type { SpriteFrame } from '../assets';
import type { Material } from '../../asset/assets';
import { MaterialInstance } from '../../render-scene';
/**
 * @en The type for mask.
 *
 * @zh 遮罩组件类型。
 */
export declare enum MaskType {
    /**
     * @en Rect mask.
     *
     * @zh
     * 使用矩形作为遮罩。
     */
    GRAPHICS_RECT = 0,
    /**
     * @en Ellipse Mask.
     *
     * @zh
     * 使用椭圆作为遮罩。
     */
    GRAPHICS_ELLIPSE = 1,
    /**
     * @en Graphics Mask.
     *
     * @zh
     * 使用图像模版作为遮罩。
     */
    GRAPHICS_STENCIL = 2,
    /**
     * @en SpriteFrame Mask.
     *
     * @zh
     * 使用图片模版作为遮罩。
     */
    SPRITE_STENCIL = 3
}
/**
 * @en
 * The Mask Component.
 *
 * @zh
 * 遮罩组件。
 */
export declare class Mask extends Component {
    /**
     * @en The type for mask.
     *
     * @zh 遮罩组件类型。
     */
    static Type: typeof MaskType;
    constructor();
    /**
     * @en
     * The mask type.
     *
     * @zh
     * 遮罩类型。
     */
    get type(): MaskType;
    set type(value: MaskType);
    /**
     * @en
     * Reverse mask.
     * @zh
     * 反向遮罩。
     */
    get inverted(): boolean;
    set inverted(value: boolean);
    /**
     * @en
     * The segments for ellipse mask.
     *
     * TODO: remove segments, not supported by graphics
     * @zh
     * 椭圆遮罩的曲线细分数。
     */
    get segments(): number;
    set segments(value: number);
    /**
     * @en
     * The mask image.
     *
     * @zh
     * 遮罩所需要的贴图。
     * @deprecated since v3.6.1
     */
    get spriteFrame(): SpriteFrame | null;
    set spriteFrame(value: SpriteFrame | null);
    /**
     * @en
     * The alpha threshold.(Not supported Canvas Mode) <br/>
     * The content is drawn only where the stencil have pixel with alpha greater than the alphaThreshold. <br/>
     * Should be a float between 0 and 1. <br/>
     * This default to 0.1.
     * When it's set to 1, the stencil will discard all pixels, nothing will be shown.
     * @zh
     * Alpha 阈值（不支持 Canvas 模式）<br/>
     * 只有当模板的像素的 alpha 大于等于 alphaThreshold 时，才会绘制内容。<br/>
     * 该数值 0 ~ 1 之间的浮点数，默认值为 0.1
     * 当被设置为 1 时，会丢弃所有蒙版像素，所以不会显示任何内容
     */
    get alphaThreshold(): number;
    set alphaThreshold(value: number);
    /**
     * @en Rendering component for providing stencil buffer information.
     * @zh 用于提供 stencil buffer 信息的渲染组件。
     */
    get subComp(): Sprite | Graphics | null;
    protected _type: MaskType;
    protected _inverted: boolean;
    protected _segments: number;
    protected _alphaThreshold: number;
    protected _sprite: Sprite | null;
    protected _graphics: Graphics | null;
    protected _stencilStage: Stage;
    onLoad(): void;
    onEnable(): void;
    onRestore(): void;
    onDisable(): void;
    onDestroy(): void;
    /**
     * @en Hit test with point in World Space.
     * @zh 世界空间中的点击测试。
     * @param worldPt @en point in World Space. @zh 世界空间中的点击点。
     */
    isHit(worldPt: Vec2): boolean;
    protected _nodeStateChange(type: TransformBit): void;
    private _changeRenderType;
    protected _createSprite(): void;
    protected _createGraphics(): void;
    protected _updateGraphics(): void;
    protected _enableRender(): void;
    protected _disableRender(): void;
    protected _removeMaskNode(): void;
    /**
     * @deprecated Since v3.6, Because mask changes the inheritance relationship,
     * you can directly manipulate the rendering components under the same node to complete the operation
     */
    get customMaterial(): Material | null;
    set customMaterial(val: Material | null);
    /**
     * @deprecated Since v3.6, Because mask changes the inheritance relationship,
     * you can directly manipulate the rendering components under the same node to complete the operation
     */
    get color(): Color | null;
    set color(value: Color | null);
    /**
     * @deprecated Since v3.6, Because mask changes the inheritance relationship,
     * you can directly manipulate the rendering components under the same node to complete the operation
     */
    markForUpdateRenderData(enable?: boolean): void;
    /**
     * @deprecated Since v3.6, Because mask changes the inheritance relationship,
     * you can directly manipulate the rendering components under the same node to complete the operation
     */
    requestRenderData(any: any): void;
    /**
     * @deprecated Since v3.6, Because mask changes the inheritance relationship,
     * you can directly manipulate the rendering components under the same node to complete the operation
     */
    destroyRenderData(): void;
    /**
     * @deprecated Since v3.6, Because mask changes the inheritance relationship,
     * you can directly manipulate the rendering components under the same node to complete the operation
     */
    updateRenderer(): void;
    /**
     * @deprecated Since v3.6, Because mask changes the inheritance relationship,
     * you can directly manipulate the rendering components under the same node to complete the operation
     */
    fillBuffers(render: any): void;
    /**
     * @deprecated Since v3.6, Because mask changes the inheritance relationship,
     * you can directly manipulate the rendering components under the same node to complete the operation
     */
    postUpdateAssembler(render: any): void;
    /**
     * @deprecated Since v3.6, Because mask changes the inheritance relationship,
     * you can directly manipulate the rendering components under the same node to complete the operation
     */
    setNodeDirty(): void;
    /**
     * @deprecated Since v3.6, Because mask changes the inheritance relationship,
     * you can directly manipulate the rendering components under the same node to complete the operation
     */
    setTextureDirty(): void;
    /**
     * @deprecated Since v3.6, Because mask changes the inheritance relationship,
     * you can directly manipulate the rendering components under the same node to complete the operation
     */
    get sharedMaterial(): Material | null;
    /**
     * @deprecated Since v3.6, Because mask changes the inheritance relationship,
     * you can directly manipulate the rendering components under the same node to complete the operation
     */
    get sharedMaterials(): (Material | null)[] | null;
    set sharedMaterials(val: (Material | null)[] | null);
    /**
     * @deprecated Since v3.6, Because mask changes the inheritance relationship,
     * you can directly manipulate the rendering components under the same node to complete the operation
     */
    get material(): any;
    set material(val: any);
    /**
     * @deprecated Since v3.6, Because mask changes the inheritance relationship,
     * you can directly manipulate the rendering components under the same node to complete the operation
     */
    get materials(): (any)[];
    set materials(val: (any)[]);
    /**
     * @deprecated Since v3.6, Because mask changes the inheritance relationship,
     * you can directly manipulate the rendering components under the same node to complete the operation
     */
    getMaterial(idx: number): any;
    /**
     * @deprecated Since v3.6, Because mask changes the inheritance relationship,
     * you can directly manipulate the rendering components under the same node to complete the operation
     */
    setMaterial(material: Material | MaterialInstance | null, index: number): void;
    /**
     * @deprecated Since v3.6, Because mask changes the inheritance relationship,
     * you can directly manipulate the rendering components under the same node to complete the operation
     */
    getMaterialInstance(idx: number): any;
    /**
     * @deprecated Since v3.6, Because mask changes the inheritance relationship,
     * you can directly manipulate the rendering components under the same node to complete the operation
     */
    setMaterialInstance(matInst: Material | MaterialInstance | null, index: number): void;
    /**
     * @deprecated Since v3.6, Because mask changes the inheritance relationship,
     * you can directly manipulate the rendering components under the same node to complete the operation
     */
    getRenderMaterial(index: number): any;
}
