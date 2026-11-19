export declare const DELIMETER = "$_$";
export declare function createAttrsSingle(owner: Object, superAttrs?: any): any;
/**
 * @param subclass Should not have '__attrs__'.
 */
export declare function createAttrs(subclass: any): any;
/**
 * Tag the class with any meta attributes, then return all current attributes assigned to it.
 * This function holds only the attributes, not their implementations.
 * @param constructor The class or instance. If instance, the attribute will be dynamic and only available for the specified instance.
 * @param propertyName The name of the property or function, used to retrieve the attributes.
 * @private
 */
export declare function attr(constructor: any, propertyName: string): {
    [attributeName: string]: any;
};
/**
 * Returns a read-only meta-object.
 */
export declare function getClassAttrs(constructor: any): any;
export declare function setClassAttr(ctor: any, propName: any, key: any, value: any): void;
export declare class PrimitiveType<T> {
    name: string;
    default: T;
    constructor(name: string, defaultValue: T);
    toString(): string;
}
/**
 * @en
 * Indicates that the editor should treat this property or array element as an Integer value.
 * @zh
 * 指定编辑器以整数形式对待该属性或数组元素。
 * @example
 * ```ts
 * import { CCInteger, _decorator } from "cc";
 *
 * // in the class definition:
 *
 * @_decorator.property({type: CCInteger})
 * count = 0;
 *
 * @_decorator.property({type: [CCInteger]})
 * array = [];
 * ```
 */
export declare const CCInteger: PrimitiveType<number>;
/**
 * @en
 * Indicates that the editor should treat this property or array element as a Float value.
 * @zh
 * 指定编辑器以浮点数形式对待该属性或数组元素。
 * @example
 * ```ts
 * import { CCFloat, _decorator } from "cc";
 *
 * // in the class definition:
 *
 * @_decorator.property({type: CCFloat})
 * x = 0;
 *
 * @_decorator.property({type: [CCFloat]})
 * array = [];
 * ```
 */
export declare const CCFloat: PrimitiveType<number>;
/**
 * @en
 * Indicates that the editor should treat this property or array element as a Boolean value.
 * @zh
 * 指定编辑器以布尔值形式对待该属性或数组元素。
 *
 * @example
 * ```ts
 * import { CCBoolean, _decorator } from "cc";
 * // in the class definition
 * @_decorator.property({type: CCBoolean})
 * isTrue = false;
 *
 * @_decorator.property({type: [CCBoolean]})
 * array = [];
 * ```
 */
export declare const CCBoolean: PrimitiveType<boolean>;
/**
 * @en
 * Indicates that the editor should treat this property or array element as a String value.
 * @zh
 * 指定编辑器以字符串形式对待该属性或数组元素。
 * @example
 * ```ts
 * import { CCString, _decorator } from "cc";
 *
 * // in the class definition
 *
 * @_decorator.property({type: CCString})
 * name = '';
 *
 * @_decorator.property({type: [CCString]})
 * array = [];
 * ```
 */
export declare const CCString: PrimitiveType<string>;
export declare function getTypeChecker_ET(type: string, attributeName: string): (constructor: Function, mainPropertyName: string) => void;
export declare function getObjTypeChecker_ET(typeCtor: any): (classCtor: any, mainPropName: any) => void;
