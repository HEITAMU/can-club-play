/**
 * @zh
 * 就地重新排列数组中的元素，
 * 使所有令谓词 `predicate` 返回 `true`的元素都排在所有令谓词 `predicate` 返回 `false`的元素前面。
 * 不会保留元素的相对顺序。
 * @en
 * Reorders the elements in array **in place** in such a way that
 * all elements for which the predicate `predicate` returns `true` precede
 * the elements for which predicates `predicate` returns `false`.
 * Relative order of the elements is *NOT* preserved.
 * @param array @zh 输入数组。 @en The input array.
 * @param predicate @zh 谓词，当元素应该被排列在其它元素前面时返回 `true`。
 *                  @en The predicate which returns `true` if the element should be ordered before other elements.
 * @returns @zh 第一组元素的个数。
 *          @en The number of elements in the first group.
 * @example
 * ```ts
 * const array = [7, 1, 2, 4, 3];
 * const nFirstGroupElements = partition(array, (v) => v % 2 === 0);
 * log(nFirstGroupElements); // 2
 * log(array); // [2, 4, 7, 1, 3]
 * log(array.slice(0, nFirstGroupElements)); // [2, 4]
 * log(array.slice(nFirstGroupElements)); // [7, 1, 3]
 * ```
 */
export declare function partition<T>(array: T[], predicate: (element: T, index: number, array: T[]) => boolean): number;
