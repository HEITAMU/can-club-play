/**
 * @example
 * ```
 * import { js } from 'cc';
 * var array = [0, 1, 2, 3, 4];
 * var iterator = new js.array.MutableForwardIterator(array);
 * for (iterator.i = 0; iterator.i < array.length; ++iterator.i) {
 *     var item = array[iterator.i];
 *     ...
 * }
 * ```
 */
export declare class MutableForwardIterator<T> {
    array: T[];
    i: number;
    constructor(array: T[]);
    get length(): number;
    set length(value: number);
    remove(value: T): void;
    removeAt(i: number): void;
    fastRemove(value: T): void;
    fastRemoveAt(i: number): void;
    push(item: T): void;
}
/**
 * @zh
 * 移除指定索引的数组元素。
 * @en
 * Removes the array item at the specified index.
 * @param array @zh 被操作的数组。@en The array to be operated.
 * @param index @zh 待移除元素的索引。@en The index of the element to be removed.
 */
export declare function removeAt<T>(array: T[], index: number): void;
/**
 * @zh
 * 移除指定索引的数组元素。
 * 此函数十分高效，但会改变数组的元素次序。
 * @en
 * Removes the array item at the specified index.
 * It's faster but the order of the array will be changed.
 * @param array @zh 被操作的数组。@en The array to be operated.
 * @param index @zh 待移除元素的索引。@en The index of the element to be removed.
 */
export declare function fastRemoveAt<T>(array: T[], index: number): void;
/**
 * @zh
 * 移除首个指定的数组元素。判定元素相等时相当于于使用了 `Array.prototype.indexOf`。
 * @en
 * Removes the first occurrence of a specific object from the array.
 * Decision of the equality of elements is similar to `Array.prototype.indexOf`.
 * @param array @zh 被操作的数组。@en The array to be operated.
 * @param value @zh 待移除元素。@en The value to be removed.
 */
export declare function remove<T>(array: T[], value: T): boolean;
/**
 * @zh
 * 移除首个指定的数组元素。判定元素相等时相当于于使用了 `Array.prototype.indexOf`。
 * 此函数十分高效，但会改变数组的元素次序。
 * @en
 * Removes the first occurrence of a specific object from the array.
 * Decision of the equality of elements is similar to `Array.prototype.indexOf`.
 * It's faster but the order of the array will be changed.
 * @param array @zh 被操作的数组。@en The array to be operated.
 * @param value @zh 待移除元素。@en The value to be removed.
 */
export declare function fastRemove<T>(array: T[], value: T): void;
/**
 * @zh
 * 移除首个使谓词满足的数组元素。
 * @en
 * Removes the first occurrence of a specific object from the array where `predicate` is `true`.
 * @param array @zh 被操作的数组。@en The array to be operated.
 * @param predicate @zh 一元谓词，如果要元素的话，需要返回 true。@en unary predicate which returns true if the element should be removed.
 */
export declare function removeIf<T>(array: T[], predicate: (value: T) => boolean): T | undefined;
/**
 * @zh
 * 验证数组的类型。
 * 此函数将用 `instanceof` 操作符验证每一个元素。
 * @en
 * Verify array's Type.
 * This function tests each element using `instanceof` operator.
 * @param array @zh 待验证的数组。@en The array to be verified.
 * @param type @zh 用来判断数组元素的数据类型。@en The type used to verify the element type.
 * @returns @zh 当每一个元素都是指定类型时返回 `true`，否则返回 `false`。@en Return true if all elements of the array is the same type, false others.
 */
export declare function verifyType<T extends Function>(array: any[], type: T): array is T[];
/**
 * @zh
 * 移除多个数组元素。
 * @en
 * Removes multiple array elements.
 * @param array @zh 被操作的数组。@en The array to be operated.
 * @param removals @zh 所有待移除的元素。此数组的每个元素所对应的首个源数组的元素都会被移除。
 *                 @en The values to be removed. If a value appears multiple times in the array, only the first math element will be removed.
 */
export declare function removeArray<T>(array: T[], removals: T[]): void;
/**
 * @zh
 * 在数组的指定索引上插入对象。
 * @en
 * Inserts some objects at specified index.
 * @param array @zh 被操作的数组。@en The array to be operated.
 * @param objects @zh 插入的所有对象。@en The objects to be inserted.
 * @param index @zh 插入的索引。@en The index to insert at.
 * @returns @zh 传入的 `array`。@en The passed in `array`.
 */
export declare function appendObjectsAt<T>(array: T[], objects: T[], index: number): T[];
/**
 * @zh
 * 返回数组是否包含指定的元素。
 * @en
 * Determines whether the array contains a specific element.
 * @param array @zh 被查询的数组 @en The array to be checked.
 * @param value @zh 用来查询的值 @en The value used to check for.
 * @returns @zh true 如果包含该元素，否则返回 false。@en true if contains the value, false else.
 */
export declare function contains<T>(array: T[], value: T): boolean;
/**
 * @zh
 * 拷贝数组。
 * @en
 * Copy an array.
 * @param array @zh 用来拷贝的数组。@en The array to be copied from.
 * @returns @zh 数组的副本。@en A new array has the same values as `array`.
 */
export declare function copy<T>(array: T[]): T[];
export declare function fillItems<T>(array: T[], ...items: T[]): void;
