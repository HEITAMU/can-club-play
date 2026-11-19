import { Font, SpriteFrame } from '../assets';
import { Color, Vec2 } from '../../core';
import { IBatcher } from '../renderer/i-batcher';
import { FontAtlas } from '../assets/bitmap-font';
import { CanvasPool, ISharedLabelData, LetterRenderTexture } from '../assembler/label/font-utils';
import { UIRenderer } from '../framework/ui-renderer';
import { TextStyle } from '../assembler/label/text-style';
import { TextLayout } from '../assembler/label/text-layout';
import { TextOutputLayoutData, TextOutputRenderData } from '../assembler/label/text-output-data';
/**
 * @en Enum for horizontal text alignment.
 *
 * @zh 文本横向对齐类型。
 */
export declare enum HorizontalTextAlignment {
    /**
     * @en Alignment left for text.
     *
     * @zh 左对齐。
     */
    LEFT = 0,
    /**
     * @en Alignment center for text.
     *
     * @zh 中心对齐。
     */
    CENTER = 1,
    /**
     * @en Alignment right for text.
     *
     * @zh 右对齐。
     */
    RIGHT = 2
}
/**
 * @en Enum for vertical text alignment.
 *
 * @zh 文本垂直对齐类型。
 */
export declare enum VerticalTextAlignment {
    /**
     * @en Alignment top for text.
     *
     * @zh 上对齐。
     */
    TOP = 0,
    /**
     * @en Alignment center for text.
     *
     * @zh 中心对齐。
     */
    CENTER = 1,
    /**
     * @en Alignment bottom for text.
     *
     * @zh 下对齐。
     */
    BOTTOM = 2
}
/**
 * @en Enum for Overflow.
 *
 * @zh 文本溢出行为类型。
 */
export declare enum Overflow {
    /**
     * @en None.
     *
     * @zh 不做任何限制。
     */
    NONE = 0,
    /**
     * @en In CLAMP mode, when label content goes out of the bounding box, it will be clipped.
     *
     * @zh CLAMP 模式中，当文本内容超出边界框时，多余的会被截断。
     */
    CLAMP = 1,
    /**
     * @en In SHRINK mode, the font size will change dynamically to adapt the content size.
     * This mode may takes up more CPU resources when the label is refreshed.
     *
     * @zh SHRINK 模式，字体大小会动态变化，以适应内容大小。这个模式在文本刷新的时候可能会占用较多 CPU 资源。
     */
    SHRINK = 2,
    /**
     * @en In RESIZE_HEIGHT mode, you can only change the width of label and the height is changed automatically.
     *
     * @zh 在 RESIZE_HEIGHT 模式下，只能更改文本的宽度，高度是自动改变的。
     */
    RESIZE_HEIGHT = 3
}
/**
 * @en Enum for cache mode.
 *
 * @zh 文本图集缓存类型。
 */
export declare enum CacheMode {
    /**
     * @en Do not do any caching.
     *
     * @zh 不做任何缓存。
     */
    NONE = 0,
    /**
     * @en In BITMAP mode, cache the label as a static image and add it to the dynamic atlas for batch rendering,
     * and can batching with Sprites using broken images.
     *
     * @zh BITMAP 模式，将 label 缓存成静态图像并加入到动态图集，以便进行批次合并，可与使用碎图的 Sprite 进行合批。
     * （注：动态图集在 Chrome 以及微信小游戏暂时关闭，该功能无效）。
     */
    BITMAP = 1,
    /**
     * @en In CHAR mode, split text into characters and cache characters into a dynamic atlas which the size of 1024 * 1024.
     *
     * @zh CHAR 模式，将文本拆分为字符，并将字符缓存到一张单独的大小为 1024 * 1024 的图集中进行重复使用，不再使用动态图集。
     * （注：当图集满时将不再进行缓存，暂时不支持 SHRINK 自适应文本尺寸（后续完善））。
     */
    CHAR = 2
}
/**
 * @en
 * The Label Component.
 *
 * @zh
 * 文字标签组件。
 */
export declare class Label extends UIRenderer {
    /**
     * @en Enum for horizontal text alignment.
     *
     * @zh 文本横向对齐类型。
     */
    static HorizontalAlign: typeof HorizontalTextAlignment;
    /**
     * @en Enum for vertical text alignment.
     *
     * @zh 文本垂直对齐类型。
     */
    static VerticalAlign: typeof VerticalTextAlignment;
    /**
     * @en Enum for label overflow mode.
     *
     * @zh 文本溢出行为类型。
     */
    static Overflow: typeof Overflow;
    /**
     * @en Enum for cache mode.
     *
     * @zh 文本图集缓存类型。
     */
    static CacheMode: typeof CacheMode;
    /**
     * @deprecated since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    static _canvasPool: CanvasPool;
    /**
     * @en
     * Content string of label.
     *
     * @zh
     * 标签显示的文本内容。
     */
    get string(): string;
    set string(value: string);
    /**
     * @en
     * Horizontal Alignment of label.
     *
     * @zh
     * 文本内容的水平对齐方式。
     */
    get horizontalAlign(): HorizontalTextAlignment;
    set horizontalAlign(value: HorizontalTextAlignment);
    /**
     * @en
     * Vertical Alignment of label.
     *
     * @zh
     * 文本内容的垂直对齐方式。
     */
    get verticalAlign(): VerticalTextAlignment;
    set verticalAlign(value: VerticalTextAlignment);
    /**
     * @en
     * The actual rendering font size in shrink mode.
     *
     * @zh
     * SHRINK 模式下面文本实际渲染的字体大小。
     */
    get actualFontSize(): number;
    set actualFontSize(value: number);
    /**
     * @en
     * Font size of label.
     *
     * @zh
     * 文本字体大小。
     */
    get fontSize(): number;
    set fontSize(value: number);
    /**
     * @en
     * Line Height of label.
     *
     * @zh
     * 文本行高。
     */
    get lineHeight(): number;
    set lineHeight(value: number);
    /**
     * @en
     * The spacing between text characters, only available in BMFont.
     *
     * @zh
     * 文本字符之间的间距。仅在使用 BMFont 位图字体时生效。
     */
    get spacingX(): number;
    set spacingX(value: number);
    /**
     * @en
     * Overflow of label.
     *
     * @zh
     * 文字显示超出范围时的处理方式。
     */
    get overflow(): Overflow;
    set overflow(value: Overflow);
    /**
     * @en
     * Whether auto wrap label when string width is large than label width.
     *
     * @zh
     * 是否自动换行。
     */
    get enableWrapText(): boolean;
    set enableWrapText(value: boolean);
    /**
     * @en
     * Whether use system font name or not.
     *
     * @zh
     * 是否使用系统字体。
     */
    get useSystemFont(): boolean;
    set useSystemFont(value: boolean);
    /**
     * @en
     * Font family of label, only take effect when useSystemFont property is true.
     *
     * @zh
     * 文本字体名称, 只在 useSystemFont 属性为 true 的时候生效。
     */
    get fontFamily(): string;
    set fontFamily(value: string);
    /**
     * @en
     * The font of label.
     *
     * @zh
     * 文本字体。
     */
    get font(): Font | null;
    set font(value: Font | null);
    /**
     * @en
     * The cache mode of label. This mode only supports system fonts.
     *
     * @zh
     * 文本缓存模式, 该模式只支持系统字体。
     */
    get cacheMode(): CacheMode;
    set cacheMode(value: CacheMode);
    /**
     * @en
     * Whether the font is bold.
     *
     * @zh
     * 字体是否加粗。
     */
    get isBold(): boolean;
    set isBold(value: boolean);
    /**
     * @en
     * Whether the font is italic.
     *
     * @zh
     * 字体是否倾斜。
     */
    get isItalic(): boolean;
    set isItalic(value: boolean);
    /**
     * @en
     * Whether the font is underline.
     *
     * @zh
     * 字体是否加下划线。
     */
    get isUnderline(): boolean;
    set isUnderline(value: boolean);
    /**
     * @en The height of underline.
     * @zh 下划线高度。
     */
    get underlineHeight(): number;
    set underlineHeight(value: number);
    /**
     ** @en
     ** Outline effect used to change the display, only for system fonts or TTF fonts.
     **
     ** @zh
     ** 描边效果组件,用于字体描边,只能用于系统字体或 ttf 字体。
     **/
    get enableOutline(): boolean;
    set enableOutline(value: boolean);
    /**
     * @en
     * Outline color.
     *
     * @zh
     * 改变描边的颜色。
     */
    get outlineColor(): Color;
    set outlineColor(value: Readonly<Color>);
    /**
     * @en
     * Change the outline width.
     *
     * @zh
     * 改变描边的宽度。
     */
    get outlineWidth(): number;
    set outlineWidth(value: number);
    /**
     * @en Shadow effect for Label component, only for system fonts or TTF fonts. Disabled when cache mode is char.
     * @zh 用于给 Label 组件添加阴影效果，只能用于系统字体或 ttf 字体。在缓存模式为 char 时不可用。
     */
    get enableShadow(): boolean;
    set enableShadow(value: boolean);
    /**
     * @en
     * Shadow color.
     *
     * @zh
     * 阴影的颜色。
     */
    get shadowColor(): Color;
    set shadowColor(value: Readonly<Color>);
    /**
     * @en
     * Offset between font and shadow.
     *
     * @zh
     * 字体与阴影的偏移。
     */
    get shadowOffset(): Vec2;
    set shadowOffset(value: Vec2);
    /**
     * @en
     * A non-negative float specifying the level of shadow blur.
     *
     * @zh
     * 阴影的模糊程度。
     */
    get shadowBlur(): number;
    set shadowBlur(value: number);
    /**
     * @deprecated since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    get spriteFrame(): SpriteFrame | LetterRenderTexture | null;
    /**
     * @deprecated since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    get ttfSpriteFrame(): SpriteFrame | null;
    /**
     * @deprecated since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    get assemblerData(): ISharedLabelData | null;
    /**
     * @deprecated since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    get fontAtlas(): FontAtlas | null;
    set fontAtlas(value: FontAtlas | null);
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    get _bmFontOriginalSize(): number;
    /**
     * @engineInternal
     */
    get textStyle(): TextStyle;
    /**
     * @engineInternal
     */
    get textLayout(): TextLayout;
    /**
     * @engineInternal
     */
    get textRenderData(): TextOutputRenderData;
    /**
     * @engineInternal
     */
    get textLayoutData(): TextOutputLayoutData;
    protected _string: string;
    protected _horizontalAlign: HorizontalTextAlignment;
    protected _verticalAlign: VerticalTextAlignment;
    protected _actualFontSize: number;
    protected _fontSize: number;
    protected _fontFamily: string;
    protected _lineHeight: number;
    protected _overflow: Overflow;
    protected _enableWrapText: boolean;
    protected _font: Font | null;
    protected _isSystemFontUsed: boolean;
    protected _spacingX: number;
    protected _isItalic: boolean;
    protected _isBold: boolean;
    protected _isUnderline: boolean;
    protected _underlineHeight: number;
    protected _cacheMode: CacheMode;
    protected _enableOutline: boolean;
    protected _outlineColor: Color;
    protected _outlineWidth: number;
    protected _enableShadow: boolean;
    protected _shadowColor: Color;
    protected _shadowOffset: Vec2;
    protected _shadowBlur: number;
    protected _N$file: Font | null;
    protected _texture: SpriteFrame | LetterRenderTexture | null;
    protected _ttfSpriteFrame: SpriteFrame | null;
    protected _userDefinedFont: Font | null;
    protected _assemblerData: ISharedLabelData | null;
    protected _fontAtlas: FontAtlas | null;
    protected _letterTexture: LetterRenderTexture | null;
    protected _contentWidth: number;
    protected _textStyle: TextStyle | null;
    protected _textLayout: TextLayout | null;
    protected _textRenderData: TextOutputRenderData | null;
    protected _textLayoutData: TextOutputLayoutData | null;
    /**
     * @engineInternal
     */
    get contentWidth(): number;
    /**
     * @engineInternal
     */
    set contentWidth(val: number);
    constructor();
    onEnable(): void;
    private destroyTtfSpriteFrame;
    _onPreDestroy(): void;
    onDestroy(): void;
    private destroyLetterTexture;
    /**
     * @en update render data.
     * @zh 更新渲染相关数据。
     * @param force @en Whether to force an immediate update. @zh 是否立马强制更新渲染数据。
     */
    updateRenderData(force?: boolean): void;
    protected _render(render: IBatcher): void;
    protected _updateColor(): void;
    /**
     * @deprecated since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    setEntityColor(color: Color): void;
    protected _canRender(): boolean;
    protected _flushAssembler(): void;
    protected _applyFontTexture(): void;
    protected changeMaterialForDefine(): void;
    /**
     * @engineInternal
     * @mangle
     */
    _updateBlendFunc(): void;
}
