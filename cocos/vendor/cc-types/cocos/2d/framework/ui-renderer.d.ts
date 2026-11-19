import { Color } from '../../core';
import { Material } from '../../asset/assets';
import { BlendFactor } from '../../gfx';
import { IAssembler, IAssemblerManager } from '../renderer/base';
import { RenderData } from '../renderer/render-data';
import { IBatcher } from '../renderer/i-batcher';
import { Node } from '../../scene-graph';
import { TransformBit } from '../../scene-graph/node-enum';
import { Stage } from '../renderer/stencil-manager';
import { Renderer } from '../../misc/renderer';
import { RenderEntity, RenderEntityFillColorType } from '../renderer/render-entity';
import { RenderDrawInfoType } from '../renderer/render-draw-info';
import type { Batcher2D } from '../renderer/batcher-2d';
/**
 * @en
 * The shader property type of the material after instantiation.
 *
 * @zh
 * 实例后的材质的着色器属性类型。
 */
export declare enum InstanceMaterialType {
    /**
     * @en
     * The shader only has color properties.
     *
     * @zh
     * 着色器只带颜色属性。
     */
    ADD_COLOR = 0,
    /**
     * @en
     * The shader has color and texture properties.
     *
     * @zh
     * 着色器带颜色和贴图属性。
     */
    ADD_COLOR_AND_TEXTURE = 1,
    /**
     * @en
     * The shader has color and texture properties and uses grayscale mode.
     *
     * @zh
     * 着色器带颜色和贴图属性,并使用灰度模式。
     */
    GRAYSCALE = 2,
    /**
     * @en
     * The shader has color and texture properties and uses embedded alpha mode.
     *
     * @zh
     * 着色器带颜色和贴图属性,并使用透明通道分离贴图。
     */
    USE_ALPHA_SEPARATED = 3,
    /**
     * @en
     * The shader has color and texture properties and uses embedded alpha and grayscale mode.
     *
     * @zh
     * 着色器带颜色和贴图属性,并使用灰度模式。
     */
    USE_ALPHA_SEPARATED_AND_GRAY = 4
}
/**
 * @en Base class for UI components which supports rendering features.
 * This component will setup NodeUIProperties.uiComp in its owner [[Node]]
 *
 * @zh 所有支持渲染的 UI 组件的基类。
 * 这个组件会设置 [[Node]] 上的 NodeUIProperties.uiComp。
 */
export declare class UIRenderer extends Renderer {
    /**
     * @en The blend factor enums
     * @zh 混合模式枚举类型
     * @see [[gfx.BlendFactor]]
     * @internal
     */
    static BlendState: typeof BlendFactor;
    /**
     * @en The render data assembler
     * @zh 渲染数据组装器
     * @internal
     */
    static Assembler: IAssemblerManager;
    /**
     * @en The post render data assembler
     * @zh 后置渲染数据组装器
     * @internal
     */
    static PostAssembler: IAssemblerManager | null;
    constructor();
    get sharedMaterials(): (Material | null)[];
    set sharedMaterials(val: (Material | null)[]);
    /**
     * @en The customMaterial
     * @zh 用户自定材质
     */
    get customMaterial(): Material | null;
    set customMaterial(val: Material | null);
    /**
     * @en Main color for rendering, it normally multiplies with texture color.
     * @zh 渲染颜色，一般情况下会和贴图颜色相乘。
     */
    get color(): Readonly<Color>;
    set color(value: Readonly<Color>);
    protected _renderData: RenderData | null;
    /**
     * @deprecated Since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    get renderData(): RenderData | null;
    /**
     * As can not set setter internal individually, so add setRenderData();
     * @engineInternal
     * @mangle
     */
    setRenderData(renderData: RenderData | null): void;
    /**
     * @deprecated Since v3.7.0, this is an engine private interface that will be removed in the future.
     * @en The component stencil stage (please do not any modification directly on this object)
     * @zh 组件模板缓冲状态 (注意：请不要直接修改它的值)
     */
    get stencilStage(): Stage;
    set stencilStage(val: Stage);
    protected _materials: (Material | null)[];
    protected _customMaterial: Material | null;
    protected _srcBlendFactor: BlendFactor;
    /**
     * @engineInternal
     * @internal
     */
    get srcBlendFactor(): BlendFactor;
    set srcBlendFactor(srcBlendFactor: BlendFactor);
    protected _dstBlendFactor: BlendFactor;
    protected _color: Color;
    protected _stencilStage: Stage;
    protected _assembler: IAssembler | null;
    protected _postAssembler: IAssembler | null;
    protected _renderFlag: boolean;
    protected _renderEntity: RenderEntity;
    protected _instanceMaterialType: number;
    protected _srcBlendFactorCache: BlendFactor;
    protected _dstBlendFactorCache: BlendFactor;
    /**
     * @deprecated Since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    _dirtyVersion: number;
    /**
     * @deprecated Since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    _internalId: number;
    /**
     * @engineInternal
     * @mangle
     */
    _flagChangedVersion: number;
    private _priority;
    get priority(): number;
    set priority(val: number);
    /**
     * @deprecated Since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    get batcher(): Batcher2D;
    /**
     * @deprecated Since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    get renderEntity(): RenderEntity;
    /**
     * @en UI rendering component fill color type, COLOR means using color property value to fill, VERTEX means using vertex color value to fill.
     * @zh UI 渲染组件填充颜色类型，COLOR 表示使用 color 属性值填充，VERTEX 表示使用顶点颜色值填充。
     */
    private _fillColorType;
    /**
     * @engineInternal
     */
    getFillColorType(): RenderEntityFillColorType;
    /**
     * @engineInternal
     */
    protected setFillColorType(val: RenderEntityFillColorType): void;
    /**
     * @deprecated Since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    protected set _useVertexOpacity(val: boolean);
    /**
     * @deprecated Since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    protected get _useVertexOpacity(): boolean;
    /**
     * @deprecated Since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    get useVertexOpacity(): boolean;
    protected _lastParent: Node | null;
    onLoad(): void;
    __preload(): void;
    onEnable(): void;
    onRestore(): void;
    private _destroyData;
    onDisable(): void;
    onDestroy(): void;
    /**
     * @en Marks the render data of the current component as modified so that the render data is recalculated.
     * @zh 标记当前组件的渲染数据为已修改状态，这样渲染数据才会重新计算。
     * @param enable Marked necessary to update or not
     */
    markForUpdateRenderData(enable?: boolean): void;
    /**
     * An internal method that marks the render data of the current component as modified so that the render data is recalculated.
     * Adding this method is to minify the function name by `@mangle` since this method is frequently used in the engine.
     * To keep the compatibility, the original method is still kept.
     * @engineInternal
     * @mangle
     */
    _markForUpdateRenderData(enable?: boolean): void;
    /**
     * @en Request new render data object.
     * @zh 请求新的渲染数据对象。
     * @return @en The new render data. @zh 新的渲染数据。
     */
    requestRenderData(drawInfoType?: RenderDrawInfoType): RenderData;
    /**
     * @en Destroy current render data.
     * @zh 销毁当前渲染数据。
     */
    destroyRenderData(): void;
    /**
     * @deprecated Since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    updateRenderer(): void;
    /**
     * @deprecated Since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    fillBuffers(render: IBatcher): void;
    /**
     * @en Post render data submission procedure, it's executed after assembler updated for all children.
     * It may assemble some extra render data to the geometry buffers, or it may only change some render states.
     * Don't call it unless you know what you are doing.
     * @zh 后置渲染数据组装程序，它会在所有子节点的渲染数据组装完成后被调用。
     * 它可能会组装额外的渲染数据到顶点数据缓冲区，也可能只是重置一些渲染状态。
     * 注意：不要手动调用该函数，除非你理解整个流程。
     */
    postUpdateAssembler(render: IBatcher): void;
    protected _render(render: IBatcher): void;
    protected _postRender(render: IBatcher): void;
    protected _canRender(): boolean;
    protected _postCanRender(): void;
    /**
     * cocos-test-projects/assets/cases/rendertexture depends on this method, so it should not be marked as `@mangle` now.
     * FIXME(cjh): `protected` is not equal to `@engineInternal + public`, because `protected` methods are also APIs exposed to developers,
     * For example, developers could implement a class which extends `UIRenderer` and call this method.
     * The mistake was merged in https://github.com/cocos/cocos-engine/pull/14572 , and it needs to be fixed in the future.
     * @engineInternal
     */
    updateMaterial(): void;
    protected _updateColor(): void;
    private setEntityColorDirty;
    /**
     * @deprecated Since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    setEntityColor(color: Color): void;
    /**
     * @deprecated Since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    setEntityOpacity(opacity: number): void;
    /**
     * @deprecated Since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    setEntityEnabled(enabled: boolean): void;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _updateBlendFunc(): void;
    protected _nodeStateChange(transformType: TransformBit): void;
    protected _colorDirty(): void;
    protected _onMaterialModified(idx: number, material: Material | null): void;
    protected _updateBuiltinMaterial(): Material;
    protected _flushAssembler?(): void;
    /**
     * @deprecated Since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    setNodeDirty(): void;
    /**
     * @deprecated Since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    setTextureDirty(): void;
    protected createRenderEntity(): RenderEntity;
}
