/**
 * Searches the **ascending sorted** array for an element and returns the index of that element.
 * @param array The array to search in.
 * @param value The value to search.
 * @returns The index of the searched element in the sorted array, if found;
 * otherwise, returns the complement of the index of the next element greater than the element to be searched or,
 * returns the complement of array's length if no element is greater than the element to be searched or the array is empty.
 * @engineInternal
 */
export declare function binarySearch(array: number[], value: number): number;
/**
 * Searches the **ascending sorted** number array for an element and returns the index of that element.
 * @param array The array to search in.
 * @param value The value to search.
 * @param EPSILON The epsilon to compare the numbers. Default to `1e-6`.
 * @returns The index of the searched element in the sorted array, if found;
 * otherwise, returns the complement of the index of the next element greater than the element to be searched or,
 * returns the complement of array's length if no element is greater than the element to be searched or the array is empty.
 * @engineInternal
 */
export declare function binarySearchEpsilon(array: Readonly<ArrayLike<number>>, value: number, EPSILON?: number): number;
/**
 * Searches the **ascending sorted** array for an element and returns the index of that element.
 * @param array The array to search in.
 * @param value The value to search.
 * @param lessThan Comparison function object which returns ​true if the first argument is less than the second.
 * @returns The index of the searched element in the sorted array, if found;
 * otherwise, returns the complement of the index of the next element greater than the searching element or,
 * returns the complement of array's length if no element is greater than the searching element or the array is empty.
 * @engineInternal
 */
export declare function binarySearchBy<T, U>(array: T[], value: U, lessThan: (lhs: T, rhs: U) => number): number;
