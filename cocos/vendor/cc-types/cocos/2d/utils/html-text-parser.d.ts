/**
 * @en A utils class for parsing HTML texts. The parsed results will be an object array.
 * @zh 一个用于解析HTML文本的工具类。解析后的结果将是一个对象数组。
 * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
 */
export interface IHtmlTextParserResultObj {
    text?: string;
    style?: IHtmlTextParserStack;
}
/**
 * @en Html Text Parser Stack interface
 * @zh Html 文本解析器接口
 * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
 */
export interface IHtmlTextParserStack {
    color?: string;
    size?: number;
    event?: {
        [k: string]: string;
    };
    isNewLine?: boolean;
    isImage?: boolean;
    src?: string;
    imageWidth?: number;
    imageHeight?: number;
    imageOffset?: string;
    imageAlign?: string;
    underline?: boolean;
    italic?: boolean;
    bold?: boolean;
    outline?: {
        color: string;
        width: number;
    };
}
/**
 * @en Html Text Parser Stack
 * @zh Html 文本解析器
 * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
 */
export declare class HtmlTextParser {
    private _specialSymbolArray;
    private _stack;
    private _resultObjectArray;
    constructor();
    parse(htmlString: string): IHtmlTextParserResultObj[];
    private _attributeToObject;
    private getRightQuotationIndex;
    private _processEventHandler;
    private _addToStack;
    private _processResult;
    private _escapeSpecialSymbol;
}
