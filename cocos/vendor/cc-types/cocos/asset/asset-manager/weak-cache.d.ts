import { ICache } from './cache';
declare class WeakRef<T> {
    constructor(obj: T);
    deref(): T | null;
}
export default class WeakCache<T> implements ICache<T> {
    protected _weakMap: Record<string, WeakRef<T>>;
    constructor(map?: Record<string, T>);
    add(key: string, val: T): T;
    has(key: string): boolean;
    get(key: string): T | undefined | null;
    remove(key: string): T | undefined | null;
    clear(): void;
    forEach(func: (val: T, key: string) => void): void;
    find(predicate: (val: T, key: string) => boolean): T | null;
    get count(): number;
    destroy(): void;
}
export {};
