/// <reference types="./@types/globals" />
import * as attributeUtils from './utils/attribute';
/**
 * @engineInternal
 */
export declare const ENUM_TAG = "Enum";
/**
 * @engineInternal
 */
export declare const BITMASK_TAG = "BitMask";
export declare function CCClass<TFunction>(options: {
    name?: string;
    extends: null | (Function & {
        __props__?: any;
        _sealed?: boolean;
    });
    ctor: TFunction;
    properties?: any;
    editor?: any;
}): any;
export declare namespace CCClass {
    var _isCCClass: (constructor: any) => boolean;
    var fastDefine: (className: any, constructor: any, serializableFields: any) => void;
    var Attr: typeof attributeUtils;
    var attr: typeof attributeUtils.attr;
    var isCCClassOrFastDefined: typeof import("./class").isCCClassOrFastDefined;
    var getInheritanceChain: (constructor: any) => any[];
    var isArray: (defaultVal: any) => boolean;
    var getDefault: (defaultVal: any) => any;
    var escapeForJS: (s: any) => string;
    var IDENTIFIER_RE: RegExp;
    var getNewValueTypeCode: any;
}
/**
 * Returns if the class is a cc-class or is fast-defined.
 * @param constructor The constructor of the class.
 * @returns Judge result.
 * @engineInternal
 */
export declare function isCCClassOrFastDefined<T>(constructor: Constructor<T>): boolean;
