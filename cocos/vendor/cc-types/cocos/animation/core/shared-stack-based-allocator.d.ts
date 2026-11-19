declare const allocatorPageCountTag: unique symbol;
declare const onStackPurgedTag: unique symbol;
declare class SharedMemoryPage {
    constructor(byteLength: number);
    readonly buffer: ArrayBuffer;
    useCount: number;
}
declare class PagedStack {
    private _manager;
    private _pageSize;
    constructor(_manager: SharedStackBasedAllocatorManager, _pageSize: number);
    get pageSize(): number;
    get debugLocking(): boolean;
    get allocatorCount(): number;
    debugLock(): void;
    debugUnlock(): void;
    getPageMemory(index: number): ArrayBuffer;
    pushPage(allocator: SharedStackBasedAllocator): SharedMemoryPage;
    popPage(allocator: SharedStackBasedAllocator): void;
    createAllocator(sliceSize: number): SharedStackBasedAllocator;
    destroyAllocator(allocator: SharedStackBasedAllocator): void;
    private _locking;
    private _pages;
    private _allocatorCount;
    private _pushNewPage;
}
declare class SharedMemorySlice {
    readonly buffer: ArrayBuffer;
    readonly byteOffset: number;
    constructor(buffer: ArrayBuffer, byteOffset: number);
}
/**
 * Dev note:
 * - `push()` do create new object(SharedMemorySlice) and do array push-back, no caching.
 * - `pop()` do array pop-back.
 */
declare class SharedStackBasedAllocator {
    private _resource;
    private _sliceSize;
    [allocatorPageCountTag]: number;
    constructor(_resource: PagedStack, _sliceSize: number);
    get isEmpty(): boolean;
    destroy(): void;
    debugLock(): void;
    debugUnlock(): void;
    push(): SharedMemorySlice;
    pop(): void;
    private _slicesPerPage;
    private _slices;
}
export declare class SharedStackBasedAllocatorManager {
    private _thresholds;
    constructor(_thresholds: number[]);
    get isEmpty(): boolean;
    createAllocator(pageSize: number): SharedStackBasedAllocator;
    [onStackPurgedTag](stack: PagedStack): void;
    private _stacks;
    private _selectStackPageSize;
}
export type { SharedStackBasedAllocator };
