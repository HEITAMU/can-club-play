/**
 * A SAX Parser
 * @class saxParser
 */
export declare class SAXParser {
    private _parser;
    constructor();
    /**
     * @method parse
     * @param {String} xmlTxt
     * @return {Document}
     */
    parse(xmlTxt: string): Document;
    protected _parseXML(textxml: string): Document;
}
/**
 *
 * plistParser is a singleton object for parsing plist files
 * @class plistParser
 * @extends SAXParser
 */
declare class PlistParser extends SAXParser {
    /**
     * @en parse a xml string as plist object.
     * @zh 将xml字符串解析为plist对象。
     * @param xmlTxt - plist xml contents
     * @return {*} plist object
     */
    parse(xmlTxt: string): any;
    private _parseNode;
    private _parseArray;
    private _parseDict;
}
/**
 * @type {PlistParser}
 * @name plistParser
 * A Plist Parser
 */
declare const plistParser: PlistParser;
export default plistParser;
