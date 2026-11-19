import { ScalableContainer } from './scalable-container';
/**
 * @en Typed object pool.
 * It's a traditional design, you can get elements out of the pool or recycle elements by putting back into the pool.
 * @zh 支持类型的对象池。这是一个传统设计的对象池，你可以从对象池中取出对象或是放回不再需要对象来复用。
 * @see [[RecyclePool]]
 */
export declare class Pool<T> extends ScalableContainer {
    private _ctor;
    private _elementsPerBatch;
    private _shrinkThreshold;
    private _nextAvail;
    private _freePool;
    private _dtor;
    /**
     * @en Constructor with the allocator of elements and initial pool size.
     * @zh 使用元素的构造器和初始大小的构造函数。
     * @param ctor @en The allocator of elements in pool, it's invoked directly without `new` in Pool.
     * @zh 元素的构造器，Pool 内部使用该构造器直接创建实例。
     * @param elementsPerBatch @en Initial pool size, this size will also be the incremental size when
     * the pool is overloaded.
     * @zh 对象池的初始大小。当对象池扩容时，也会使用该值。
     * @param dtor @en The finalizer of element, it's invoked when this Pool is destroyed or shrunk if
     * it is valid.
     * @zh 元素的析构器。如果存在的话，当对象池销毁或者缩容时，会使用该析构器。
     * @param shrinkThreshold @en The container is shrink only if the size of the container exceeds the shrinkThreshold,
     * and the size of the container after reduction is greater than or equal to the shrinkThreshold. The value equals elementsPerBatch
     * if not value is passed.
     * @zh 只有容器的数量大于 shrinkThreshold 时才缩容，缩减后的容器大小小于等于 shrinkThreshold。如果没有传入值，那么它的值和 elementsPerBatch 相同。
     */
    constructor(ctor: () => T, elementsPerBatch: number, dtor?: (obj: T) => void, shrinkThreshold?: number);
    /**
     * @en Take an object out of the object pool.
     * @zh 从对象池中取出一个对象。
     * @returns @en An object ready for use. This function always returns an object.
     * @zh 该函数总是返回一个可用的对象。
     */
    alloc(): T;
    /**
     * @en Put an object back into the object pool.
     * @zh 将一个对象放回对象池中。
     * @param obj @en The object to be put back into the pool.
     * @zh 放回对象池中的对象。
     */
    free(obj: T): void;
    /**
     * @en Put multiple objects back into the object pool.
     * @zh 将一组对象放回对象池中。
     * @param objs @en An array of objects to be put back into the pool.
     * @zh 放回对象池中的一组对象。
     */
    freeArray(objs: T[]): void;
    /**
     * @en Try to shrink the object pool to reduce memory usage.
     * @zh 尝试缩容对象池，以释放内存。
     */
    tryShrink(): void;
    /**
     * @en Destroy all elements and clear the pool.
     * @zh 释放对象池中所有资源并清空缓存池。
     */
    destroy(): void;
}
