/// <reference types="./@types/globals" />
import { IDGenerator } from './id-generator';
import { _getClassById, _getClassId, addon, clear, createMap, extend, formatStr, getClassByName, getClassById, getClassName, getClassId, getPropertyDescriptor, getSuper, isChildClassOf, isNumber, isString, isEmptyObject, mixin, obsolete, obsoletes, setClassName, setClassAlias, shiftArguments, unregisterClass } from './js-typed';
import { Pool } from './pool';
import * as array from './array';
export * from './js-typed';
export { IDGenerator } from './id-generator';
export { Pool } from './pool';
export { array };
/**
 * @deprecated since v3.7.0, `js.js` is deprecated, please access `js` directly instead.
 */
export declare const js: {
    IDGenerator: typeof IDGenerator;
    Pool: typeof Pool;
    array: typeof array;
    isNumber: typeof isNumber;
    isString: typeof isString;
    isEmptyObject: typeof isEmptyObject;
    getPropertyDescriptor: typeof getPropertyDescriptor;
    addon: typeof addon;
    mixin: typeof mixin;
    extend: typeof extend;
    getSuper: typeof getSuper;
    isChildClassOf: typeof isChildClassOf;
    clear: typeof clear;
    value: (object: Record<string | number, any>, propertyName: string, value_: any, writable?: boolean | undefined, enumerable?: boolean | undefined) => void;
    getset: (object: Record<string | number, any>, propertyName: string, getter: Getter, setter?: boolean | Setter | undefined, enumerable?: boolean | undefined, configurable?: boolean | undefined) => void;
    get: (object: Record<string | number, any>, propertyName: string, getter: Getter, enumerable?: boolean | undefined, configurable?: boolean | undefined) => void;
    set: (object: Record<string | number, any>, propertyName: string, setter: Setter, enumerable?: boolean | undefined, configurable?: boolean | undefined) => void;
    unregisterClass: typeof unregisterClass;
    getClassName: typeof getClassName;
    setClassName: typeof setClassName;
    setClassAlias: typeof setClassAlias;
    getClassByName: typeof getClassByName;
    getClassById: typeof getClassById;
    /**
     * @en All classes registered in the engine, indexed by name.
     * @zh 引擎中已注册的所有类型，通过名称进行索引。
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     * @example
     * ```
     * import { js } from 'cc';
     * // save all registered classes before loading scripts
     * let builtinClassIds = js._registeredClassIds;
     * let builtinClassNames = js._registeredClassNames;
     * // load some scripts that contain CCClass
     * ...
     * // clear all loaded classes
     * js._registeredClassIds = builtinClassIds;
     * js._registeredClassNames = builtinClassNames;
     * ```
     *
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _registeredClassNames: Record<string, Constructor<unknown>>;
    /**
     * @en All classes registered in the engine, indexed by ID.
     * @zh 引擎中已注册的所有类型，通过 ID 进行索引。
     * @example
     * ```
     * import { js } from 'cc';
     * // save all registered classes before loading scripts
     * let builtinClassIds = js._registeredClassIds;
     * let builtinClassNames = js._registeredClassNames;
     * // load some scripts that contain CCClass
     * ...
     * // clear all loaded classes
     * js._registeredClassIds = builtinClassIds;
     * js._registeredClassNames = builtinClassNames;
     * ```
     *
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _registeredClassIds: Record<string, Constructor<unknown>>;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _getClassId: typeof _getClassId;
    getClassId: typeof getClassId;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _setClassId: (id: string, constructor: Constructor<unknown>) => void;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _getClassById: typeof _getClassById;
    obsolete: typeof obsolete;
    obsoletes: typeof obsoletes;
    formatStr: typeof formatStr;
    shiftArguments: typeof shiftArguments;
    createMap: typeof createMap;
};
