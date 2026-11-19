export declare const BASELINE_RATIO = 0.26;
export declare const MIDDLE_RATIO: number;
export declare function getBaselineOffset(): number;
interface ICacheNode {
    key: string;
    value: number;
    prev: ICacheNode | null;
    next: ICacheNode | null;
}
export declare class LRUCache {
    private count;
    private limit;
    private datas;
    private head;
    private tail;
    constructor(size: number);
    moveToHead(node: ICacheNode): void;
    put(key: string, value: number): void;
    remove(node: ICacheNode): void;
    get(key: string): number | null;
    clear(): void;
    has(key: string): boolean;
    delete(key: string): void;
}
/**
 * @deprecated since v3.7.2, this is an engine private interface that will be removed in the future.
 */
export declare function isUnicodeCJK(ch: string): boolean;
/**
 * @deprecated since v3.7.2, this is an engine private interface that will be removed in the future.
 */
export declare function isUnicodeSpace(ch: string): boolean;
/**
 * @deprecated since v3.7.2, this is an engine private interface that will be removed in the future.
 */
export declare function safeMeasureText(ctx: CanvasRenderingContext2D, string: string, desc?: string): number;
export declare function getSymbolLength(str: string): number;
export declare function getSymbolAt(str: string, index: number): string;
export declare function getSymbolCodeAt(str: string, index: number): string;
/**
* @engineInternal
*/
export declare function isEnglishWordPartAtFirst(stringToken: string): boolean;
/**
* @engineInternal
*/
export declare function isEnglishWordPartAtLast(stringToken: string): boolean;
/**
* @engineInternal
*/
export declare function getEnglishWordPartAtFirst(stringToken: string): RegExpExecArray | null;
/**
* @engineInternal
*/
export declare function getEnglishWordPartAtLast(stringToken: string): RegExpExecArray | null;
/**
 * @deprecated since v3.7.2, this is an engine private interface that will be removed in the future.
 */
export declare function fragmentText(stringToken: string, allWidth: number, maxWidth: number, measureText: (string: string) => number): string[];
export {};
