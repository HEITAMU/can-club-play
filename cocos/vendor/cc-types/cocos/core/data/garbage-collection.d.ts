import type { GCObject } from './gc-object';
declare class GarbageCollectionManager {
    private _finalizationRegistry;
    private _gcObjects;
    constructor();
    registerGCObject(gcObject: GCObject): GCObject;
    init(): void;
    private finalizationRegistryCallback;
    destroy(): void;
}
/**
 * @engineInternal
 */
declare const garbageCollectionManager: GarbageCollectionManager;
export { garbageCollectionManager };
