import { EditBox } from './edit-box';
import { InputFlag, InputMode, KeyboardReturnType } from './types';
import { EditBoxImplBase } from './edit-box-impl-base';
export declare class EditBoxImpl extends EditBoxImplBase {
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _delegate: EditBox | null;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _inputMode: InputMode;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _inputFlag: InputFlag;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _returnType: KeyboardReturnType;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    __eventListeners: any;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    __autoResize: boolean;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    __orientationChanged: any;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _edTxt: HTMLInputElement | HTMLTextAreaElement | null;
    private _isTextArea;
    private _textLabelFont;
    private _textLabelFontSize;
    private _textLabelFontColor;
    private _textLabelAlign;
    private _placeholderLabelFont;
    private _placeholderLabelFontSize;
    private _placeholderLabelFontColor;
    private _placeholderLabelAlign;
    private _placeholderLineHeight;
    private _placeholderStyleSheet;
    private _domId;
    private _forceUpdate;
    constructor();
    init(delegate: EditBox): void;
    clear(): void;
    private _resize;
    beforeDraw(): void;
    setTabIndex(index: number): void;
    setSize(width: number, height: number): void;
    beginEditing(): void;
    endEditing(): void;
    private _createInput;
    private _createTextArea;
    private _addDomToGameContainer;
    private _removeDomFromGameContainer;
    private _showDom;
    private _hideDom;
    private _showDomOnMobile;
    private _hideDomOnMobile;
    private _isElementInViewport;
    private _adjustWindowScroll;
    private _scrollBackWindow;
    private _updateMatrix;
    private _updateInputType;
    private _updateMaxLength;
    private _initStyleSheet;
    private _updateStyleSheet;
    private _updateTextLabel;
    private _updatePlaceholderLabel;
    private _registerEventListeners;
    private _removeEventListeners;
}
