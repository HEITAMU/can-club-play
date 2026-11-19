type CleanUpFunction<T> = (value: T) => boolean | void;
/**
 * @en
 * A fixed-length object pool designed for general type.<br>
 * The implementation of this object pool is very simple.
 * It can help you to improve your game performance for objects which need frequent release and recreate operations.<br/>
 * @zh
 * 长度固定的对象缓存池，可以用来缓存各种对象类型。<br/>
 * 这个对象池的实现非常精简，它可以帮助您提高游戏性能，适用于优化对象的反复创建和销毁。
 * @class js.Pool
 * @example
 * ```
 *
 * Example 1:
 *
 * function Details () {
 *     this.uuidList = [];
 * };
 * Details.prototype.reset = function () {
 *     this.uuidList.length = 0;
 * };
 * Details.pool = new js.Pool(function (obj) {
 *     obj.reset();
 * }, 5);
 * Details.pool.get = function () {
 *     return this._get() || new Details();
 * };
 *
 * var detail = Details.pool.get();
 * ...
 * Details.pool.put(detail);
 *
 * Example 2:
 *
 * function Details (buffer) {
 *    this.uuidList = buffer;
 * };
 * ...
 * Details.pool.get = function (buffer) {
 *     var cached = this._get();
 *     if (cached) {
 *         cached.uuidList = buffer;
 *         return cached;
 *     }
 *     else {
 *         return new Details(buffer);
 *     }
 * };
 *
 * var detail = Details.pool.get( [] );
 * ...
 * ```
 */
export declare class Pool<T> {
    /**
     * @en
     * The current number of available objects, the default is 0. It will gradually increase with the recycle of the object,
     * the maximum will not exceed the size specified when the constructor is called.
     * @zh
     * 当前可用对象数量，一开始默认是 0，随着对象的回收会逐渐增大，最大不会超过调用构造函数时指定的 size。
     * @default 0
     */
    count: number;
    /**
     * @en
     * Gets an object from pool.
     * @zh 从对象池中获取一个对象。
     * @returns @en An object or null if this pool doesn't contain any object.
     * @zh 获取的对象。如果对象池中没有对象，返回 null。
     */
    get(): T | null;
    private _pool;
    private _cleanup;
    /**
     * @en Constructor. @zh 构造函数。
     * @param cleanupFunc @en Callback method used to process the cleanup logic when the object is recycled.
     * @zh 当对象放入对象池时，用来执行清理逻辑的回调函数。
     * @param size @en Pool size. @zh 对象池大小。
     */
    constructor(cleanup: CleanUpFunction<T>, size: number);
    /**
     * @en Constructor. @zh 构造函数。
     * @param size @en Pool size. @zh 对象池大小。
     */
    constructor(size: number);
    /**
     * @en
     * Gets an object from pool.
     * @zh 从对象池中获取一个对象。
     * @returns @en An object or null if this pool doesn't contain any object.
     * @zh 获取的对象。如果对象池中没有对象，返回 null。
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _get(): T | null;
    /**
     * @en Put an object into the pool.
     * @zh 向对象池返还一个不再需要的对象。
     */
    put(obj: T): void;
    /**
     * @en Resize the pool.
     * @zh 设置对象池容量。
     * @param length @en New pool size.
     * @zh 新对象池大小。
     */
    resize(length: number): void;
}
export {};
