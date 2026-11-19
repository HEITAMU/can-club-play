/**
 * @deprecated since v3.6.0, this is an engine private interface that will be removed in the future.
 */
export declare function setDefaultLogTimes(times: number): void;
interface IReplacement {
    /** Deprecated property name. */
    name: string;
    /** Times to print log when accessing deprecated property. */
    logTimes?: number;
    /** New property name. */
    newName?: string;
    /** The object to deprecate this property. */
    target?: object;
    /** The name of the object to deprecate this property. */
    targetName?: string;
    /** New function to access the property. If it is valid, `customSetter` and `customGetter` will be ignored. */
    customFunction?: Function;
    /** New setter. */
    customSetter?: (v: any) => void;
    /** New getter. */
    customGetter?: () => any;
    /** Property description used in warning log. */
    suggest?: string;
}
interface IRemoveItem {
    /** Removed property name. */
    name: string;
    /** Times to print log when accessing removed property. */
    logTimes?: number;
    /** Property description used in warning log. */
    suggest?: string;
}
interface IMarkItem {
    /** Deprecated property name. */
    name: string;
    /** Times to print log when accessing deprecated property. */
    logTimes?: number;
    /** Property description used in warning log. */
    suggest?: string;
}
/**
 * @deprecated since v3.6.0, this is an engine private interface that will be removed in the future.
 */
export declare let replaceProperty: (owner: object, ownerName: string, properties: IReplacement[]) => void;
/**
 * @deprecated since v3.6.0, this is an engine private interface that will be removed in the future.
 */
export declare let removeProperty: (owner: object, ownerName: string, properties: IRemoveItem[]) => void;
/**
 * @deprecated since v3.6.0, this is an engine private interface that will be removed in the future.
 */
export declare let markAsWarning: (owner: object, ownerName: string, properties: IMarkItem[]) => void;
/**
 * @engineInternal
 */
interface IDeprecateInfo {
    newName?: string;
    since: string;
    removed: boolean;
}
/**
 * @engineInternal
 */
interface TopLevelDeprecateList {
    [name: string]: IDeprecateInfo | undefined;
}
/**
 * This is an internal method to register the deprecate info of module exported binding name.
 * DO NOT USE THIS INTERFACE.
 *
 * @example
 * ```ts
 * deprecateModuleExportedName({
 *     ButtonComponent: {
 *         newName: 'Button',
 *         since: '1.2.0',
 *         removed: false,
 *     },
 * });
 * ```
 * @engineInternal
 */
export declare function deprecateModuleExportedName(deprecateList: TopLevelDeprecateList): void;
/**
 * An internal method to check whether the top level interface is deprecated.
 * DO NOT USE THIS INTERFACE.
 *
 * @example
 * ```ts
 * // print deprecate info of ButtonComponent and ToggleComponent
 * import { ButtonComponent, ToggleComponent } from 'cc';
 * ```
 * @engineInternal
 */
export declare function __checkObsolete__(checkList: string[]): void;
/**
 * An internal method to check whether the top level interface is deprecated in namespace.
 * DO NOT USE THIS INTERFACE.
 *
 * @example
 * ```ts
 * import * as cc from 'cc';
 * console.log(cc.ButtonComponent);  // print deprecate info of ButtonComponent
 * ```
 * @engineInternal
 */
export declare function __checkObsoleteInNamespace__(ccNamespace: object): any;
export {};
