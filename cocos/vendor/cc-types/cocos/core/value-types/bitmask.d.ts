/**
 * @en
 * Defines a BitMask type. The editor will display different inspector depending on this data type.  It may define some properties to the object.
 * The keys of new properties are the integer type values, and the values are corresponding keys. See the example below.
 * keys.
 * @zh
 * 定义一个位掩码类型。编辑器会根据这个数据类型显示不同的显示界面。它可能会在对象添加新属性。新属性的 key 是原来的整型 value，value 是对应的 key。参考下面的例子。
 * @param obj
 * @en A JavaScript literal object containing BitMask names and values.
 * @zh 包含 BitMask 名称和值的 JavaScript 文字对象。
 * @returns @en The defined BitMask type @zh 定义的位掩码类型。
 * @example
 * ```ts
 * // `type1` and `type2` are single-selected.
 * let obj = {
 *     type1: 0,
 *     type2: 1 << 2,
 * }
 *
 * // `type1` and `type2` are multiple-selected.
 * // New properties are added to obj, obj now is
 * // {
 * //     type1: 0,
 * //     type2: 1<< 2,
 * //     0: type1,
 * //     4: type2
 * // }
 * BitMask(obj);
 * ```
 */
export declare function BitMask<T extends object>(obj: T): T;
export declare namespace BitMask {
    var isBitMask: (BitMaskType: any) => any;
    var getList: (BitMaskDef: any) => any;
    var update: (BitMaskDef: any) => any;
}
/**
 * @en Similar to [[BitMask]], but it doesn't add properties to the object.
 * @zh 和 [[BitMask]] 类似功能，但不会往对象添加属性。
 * @param bitmaskx @en An object to make BitMask type. @zh 要标记为 BitMask 类型的对象。
 * @returns @en The passed in object. @zh 传入的对象。
 */
export declare function ccbitmask(bitmaskx: any): void;
