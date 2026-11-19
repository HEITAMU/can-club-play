import { SpriteAtlas, TTFFont, SpriteFrame } from '../assets';
import { EventTouch } from '../../input/types';
import { Color, Vec2 } from '../../core';
import { IHtmlTextParserResultObj } from '../utils/html-text-parser';
import { Node } from '../../scene-graph';
import { CacheMode, HorizontalTextAlignment, Label, VerticalTextAlignment } from './label';
import { Sprite } from './sprite';
import { Component } from '../../scene-graph/component';
interface ISegment {
    node: Node;
    comp: Label | Sprite | null;
    lineCount: number;
    styleIndex: number;
    imageOffset: string;
    clickParam: string;
    clickHandler: string;
    type: string;
}
/**
 * @en
 * The RichText Component.
 *
 * @zh
 * 富文本组件。
 */
export declare class RichText extends Component {
    /**
     * @en
     * Content string of RichText.
     *
     * @zh
     * 富文本显示的文本内容。
     */
    get string(): string;
    set string(value: string);
    /**
     * @en
     * Horizontal Alignment of each line in RichText.
     *
     * @zh
     * 文本内容的水平对齐方式。
     */
    get horizontalAlign(): HorizontalTextAlignment;
    set horizontalAlign(value: HorizontalTextAlignment);
    /**
     * @en
     * Vertical Alignment of each line in RichText.
     *
     * @zh
     * 文本内容的竖直对齐方式。
     */
    get verticalAlign(): VerticalTextAlignment;
    set verticalAlign(value: VerticalTextAlignment);
    /**
     * @en
     * Font size of RichText.
     *
     * @zh
     * 富文本字体大小。
     */
    get fontSize(): number;
    set fontSize(value: number);
    /**
     * @en
     * Font color of RichText. Works when the text content does not have a color parameter set. Transparency cascade is not supported.
     *
     * @zh
     * 富文本默认文字颜色。在文本内容没有设置颜色参数时生效。暂不支持颜色级联。
     */
    get fontColor(): Color;
    set fontColor(value: Color);
    /**
     * @en
     * Custom System font of RichText.
     *
     * @zh
     * 富文本定制系统字体。
     */
    get fontFamily(): string;
    set fontFamily(value: string);
    /**
     * @en
     * Custom System font of RichText.
     *
     * @zh
     * 富文本定制字体。
     */
    get font(): TTFFont | null;
    set font(value: TTFFont | null);
    /**
     * @en
     * Whether to use system font name or not.
     *
     * @zh
     * 是否使用系统字体。
     */
    get useSystemFont(): boolean;
    set useSystemFont(value: boolean);
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
     * The maximize width of the RichText.
     *
     * @zh
     * 富文本的最大宽度。
     */
    get maxWidth(): number;
    set maxWidth(value: number);
    /**
     * @en
     * Line Height of RichText.
     *
     * @zh
     * 富文本行高。
     */
    get lineHeight(): number;
    set lineHeight(value: number);
    /**
     * @en
     * The image atlas for the img tag. For each src value in the img tag, there should be a valid spriteFrame in the image atlas.
     *
     * @zh
     * 对于 img 标签里面的 src 属性名称，都需要在 imageAtlas 里面找到一个有效的 spriteFrame，否则 img tag 会判定为无效。
     */
    get imageAtlas(): SpriteAtlas | null;
    set imageAtlas(value: SpriteAtlas | null);
    /**
     * @en
     * Once checked, the RichText will block all input events (mouse and touch) within
     * the bounding box of the node, preventing the input from penetrating into the underlying node.
     *
     * @zh
     * 选中此选项后，RichText 将阻止节点边界框中的所有输入事件（鼠标和触摸），从而防止输入事件穿透到底层节点。
     */
    get handleTouchEvent(): boolean;
    set handleTouchEvent(value: boolean);
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
    protected _lineHeight: number;
    protected _string: string;
    protected _horizontalAlign: HorizontalTextAlignment;
    protected _verticalAlign: VerticalTextAlignment;
    protected _fontSize: number;
    protected _fontColor: Color;
    protected _maxWidth: number;
    protected _fontFamily: string;
    protected _font: TTFFont | null;
    protected _isSystemFontUsed: boolean;
    protected _userDefinedFont: TTFFont | null;
    protected _cacheMode: CacheMode;
    protected _imageAtlas: SpriteAtlas | null;
    protected _handleTouchEvent: boolean;
    protected _textArray: IHtmlTextParserResultObj[];
    protected _segments: ISegment[];
    protected _labelSegmentsCache: ISegment[];
    protected _linesWidth: number[];
    protected _lineCount: number;
    protected _labelWidth: number;
    protected _labelHeight: number;
    protected _layoutDirty: boolean;
    protected _lineOffsetX: number;
    protected _updateRichTextStatus: () => void;
    protected _labelChildrenNum: number;
    constructor();
    onLoad(): void;
    onEnable(): void;
    onDisable(): void;
    onRestore(): void;
    onDestroy(): void;
    protected _addEventListeners(): void;
    protected _removeEventListeners(): void;
    protected _updateLabelSegmentTextAttributes(): void;
    protected _createFontLabel(str: string): ISegment;
    protected _createImage(spriteFrame: SpriteFrame): ISegment;
    protected _onTTFLoaded(): void;
    /**
    * @engineInternal
    * @mangle
    */
    protected splitLongStringApproximatelyIn2048(text: string, styleIndex: number): string[];
    /**
    * @engineInternal
    * @mangle
    */
    protected splitLongStringOver2048(text: string, styleIndex: number): string[];
    protected _measureText(styleIndex: number, string?: string): number | ((s: string) => number);
    /**
    * @engineInternal
    * @mangle
    */
    protected _calculateSize(out: Vec2, styleIndex: number, s: string): Vec2;
    protected _onTouchEnded(event: EventTouch): void;
    protected _containsTouchLocation(label: ISegment, point: Vec2): boolean;
    protected _resetState(): void;
    protected _activateChildren(active: any): void;
    protected _addLabelSegment(stringToken: string, styleIndex: number): ISegment;
    protected _updateRichTextWithMaxWidth(labelString: string, labelWidth: number, styleIndex: number): void;
    protected _isLastComponentCR(stringToken: any): boolean;
    protected _updateLineInfo(): void;
    protected _needsUpdateTextLayout(newTextArray: IHtmlTextParserResultObj[]): boolean;
    protected _addRichTextImageElement(richTextElement: IHtmlTextParserResultObj): void;
    protected _updateTextDefaultColor(): void;
    protected _updateRichText(): void;
    protected _getFirstWordLen(text: string, startIndex: number, textLen: number): number;
    protected _updateRichTextPosition(): void;
    protected _convertLiteralColorValue(color: string): Color;
    protected _applyTextAttribute(labelSeg: ISegment): void;
    protected _applyLayer(): void;
    protected _resetLabelState(label: Label): void;
}
export {};
