import { SpriteFrame } from '../../2d/assets/sprite-frame';
import { Component } from '../../scene-graph/component';
import { EventHandler as ComponentEventHandler } from '../../scene-graph/component-event-handler';
import { Size } from '../../core/math';
import { EventTouch } from '../../input/types';
import { Label } from '../../2d/components/label';
import { Sprite } from '../../2d/components/sprite';
import { EditBoxImplBase } from './edit-box-impl-base';
import { InputFlag, InputMode, KeyboardReturnType } from './types';
declare enum EditBoxEventType {
    EDITING_DID_BEGAN = "editing-did-began",
    EDITING_DID_ENDED = "editing-did-ended",
    TEXT_CHANGED = "text-changed",
    EDITING_RETURN = "editing-return",
    XR_EDITING_DID_BEGAN = "xr-editing-did-began",
    XR_EDITING_DID_ENDED = "xr-editing-did-ended"
}
/**
 * @en
 * `EditBox` is a component for inputing text, you can use it to gather small amounts of text from users.
 *
 * @zh
 * `EditBox` 组件，用于获取用户的输入文本。
 */
export declare class EditBox extends Component {
    /**
     * @en
     * Input string of EditBox.
     *
     * @zh
     * 输入框的初始输入内容，如果为空则会显示占位符的文本。
     */
    get string(): string;
    set string(value: string);
    /**
     * @en
     * The display text of placeholder.
     *
     * @zh
     * 输入框占位符的文本内容。
     */
    get placeholder(): string;
    set placeholder(value: string);
    /**
     * @en
     * The Label component attached to the node for EditBox's input text label.
     *
     * @zh
     * 输入框输入文本节点上挂载的 Label 组件对象。
     */
    get textLabel(): Label | null;
    set textLabel(oldValue: Label | null);
    /**
     * @en
     * The Label component attached to the node for EditBox's placeholder text label.
     *
     * @zh
     * 输入框占位符节点上挂载的 Label 组件对象。
     */
    get placeholderLabel(): Label | null;
    set placeholderLabel(oldValue: Label | null);
    /**
     * @en
     * The background image of EditBox.
     *
     * @zh
     * 输入框的背景图片。
     */
    get backgroundImage(): SpriteFrame | null;
    set backgroundImage(value: SpriteFrame | null);
    /**
     * @en
     * Set the input flags that are to be applied to the EditBox.
     *
     * @zh
     * 指定输入标志位，可以指定输入方式为密码或者单词首字母大写。
     */
    get inputFlag(): InputFlag;
    set inputFlag(value: InputFlag);
    /**
     * @en
     * Set the input mode of the edit box.
     * If you pass ANY, it will create a multiline EditBox.
     *
     * @zh
     * 指定输入模式: ANY表示多行输入，其它都是单行输入，移动平台上还可以指定键盘样式。
     */
    get inputMode(): InputMode;
    set inputMode(oldValue: InputMode);
    /**
     * @en
     * The return key type of EditBox.
     * Note: it is meaningless for web platforms and desktop platforms.
     *
     * @zh
     * 指定移动设备上面回车按钮的样式。
     * 注意：这个选项对 web 平台与 desktop 平台无效。
     */
    get returnType(): KeyboardReturnType;
    set returnType(value: KeyboardReturnType);
    /**
     * @en
     * The maximize input length of EditBox.
     * - If pass a value less than 0, it won't limit the input number of characters.
     * - If pass 0, it doesn't allow input any characters.
     *
     * @zh
     * 输入框最大允许输入的字符个数。
     * - 如果值为小于 0 的值，则不会限制输入字符个数。
     * - 如果值为 0，则不允许用户进行任何输入。
     */
    get maxLength(): number;
    set maxLength(value: number);
    /**
     * @en
     * Set the tabIndex of the DOM input element (only useful on Web).
     *
     * @zh
     * 修改 DOM 输入元素的 tabIndex（这个属性只有在 Web 上面修改有意义）。
     */
    get tabIndex(): number;
    set tabIndex(value: number);
    /**
     * @deprecated since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    static _EditBoxImpl: typeof EditBoxImplBase;
    /**
     * @en Keyboard Return Type.
     * @zh 键盘的返回键类型。
     */
    static KeyboardReturnType: typeof KeyboardReturnType;
    /**
     * @en Defines some flag bits for setting text display and text formatting.
     * @zh 定义了一些用于设置文本显示和文本格式化的标志位。
     */
    static InputFlag: typeof InputFlag;
    /**
     * @en Input Mode.
     * @zh 输入模式。
     */
    static InputMode: typeof InputMode;
    /**
     * @en Keyboard event enumeration.
     * @zh 键盘的事件枚举。
     */
    static EventType: typeof EditBoxEventType;
    /**
     * @en
     * The event handler to be called when EditBox began to edit text.
     *
     * @zh
     * 开始编辑文本输入框触发的事件回调。
     */
    editingDidBegan: ComponentEventHandler[];
    /**
     * @en
     * The event handler to be called when EditBox text changes.
     *
     * @zh
     * 编辑文本输入框时触发的事件回调。
     */
    textChanged: ComponentEventHandler[];
    /**
     * @en
     * The event handler to be called when EditBox edit ends.
     *
     * @zh
     * 结束编辑文本输入框时触发的事件回调。
     */
    editingDidEnded: ComponentEventHandler[];
    /**
     * @en
     * The event handler to be called when return key is pressed. Windows is not supported.
     *
     * @zh
     * 当用户按下回车按键时的事件回调，目前不支持 windows 平台。
     */
    editingReturn: ComponentEventHandler[];
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _impl: EditBoxImplBase | null;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _background: Sprite | null;
    protected _textLabel: Label | null;
    protected _placeholderLabel: Label | null;
    protected _returnType: KeyboardReturnType;
    protected _string: string;
    protected _tabIndex: number;
    protected _backgroundImage: SpriteFrame | null;
    protected _inputFlag: InputFlag;
    protected _inputMode: InputMode;
    protected _maxLength: number;
    private _isLabelVisible;
    constructor();
    __preload(): void;
    onEnable(): void;
    private _beforeDraw;
    onDisable(): void;
    onDestroy(): void;
    /**
     * @en Let the EditBox get focus.
     * @zh 让当前 EditBox 获得焦点。
     */
    setFocus(): void;
    /**
     * @en Let the EditBox get focus.
     * @zh 让当前 EditBox 获得焦点。
     */
    focus(): void;
    /**
     * @en Let the EditBox lose focus.
     * @zh 让当前 EditBox 失去焦点。
     */
    blur(): void;
    /**
     * @en Determine whether EditBox is getting focus or not.
     * @zh 判断 EditBox 是否获得了焦点。
     * Note: only available on Web at the moment.
     */
    isFocused(): boolean;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _editBoxEditingDidBegan(): void;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     * @param text content filtered by sensitive words.This parameter may be undefined.
     * If relevant platform returns desensitized content, it will be passed to developer by EventType.EDITING_DID_ENDED.
     * Now only ByteDance minigame platform
     */
    _editBoxEditingDidEnded(text?: string): void;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _editBoxTextChanged(text: string): void;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     * @param text content filtered by sensitive words.This parameter may be undefined.
     * If relevant platform returns desensitized content, it will be passed to developer by EventType.EDITING_RETURN.
     * Now only ByteDance minigame platform
     */
    _editBoxEditingReturn(text?: string): void;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _showLabels(): void;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _hideLabels(): void;
    protected _onTouchBegan(event: EventTouch): void;
    protected _onTouchCancel(event: EventTouch): void;
    protected _onTouchEnded(event: EventTouch): void;
    protected _init(): void;
    protected _ensureBackgroundSprite(): void;
    protected _updateTextLabel(): void;
    protected _updatePlaceholderLabel(): void;
    protected _syncSize(): void;
    protected _updateLabels(): void;
    protected _updateString(text: string): void;
    protected _updateLabelStringStyle(text: string, ignorePassword?: boolean): string;
    protected _registerEvent(): void;
    protected _unregisterEvent(): void;
    private _onBackgroundSpriteFrameChanged;
    private _registerBackgroundEvent;
    private _unregisterBackgroundEvent;
    protected _updateLabelPosition(size: Size): void;
    protected _resizeChildNodes(): void;
    protected _xrUnClick(): void;
    protected _xrKeyBoardInput(str: string): void;
}
export {};
