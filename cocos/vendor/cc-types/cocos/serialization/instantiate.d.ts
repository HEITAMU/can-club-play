import { Prefab } from '../scene-graph/prefab';
import { Node } from '../scene-graph/node';
/**
 * @zh 从 Prefab 实例化出新节点。
 * @en Instantiate a node from the Prefab.
 * @param prefab The prefab.
 * @returns The instantiated node.
 * @example
 * ```ts
 * import { instantiate, director } from 'cc';
 * // Instantiate node from prefab.
 * const node = instantiate(prefabAsset);
 * node.parent = director.getScene();
 * ```
 */
export declare function instantiate(prefab: Prefab): Node;
/**
 * @en Clones the object `original.
 * @zh 克隆指定的任意类型的对象。
 * @param original An existing object that you want to make a copy of.
 * It can be any JavaScript object(`typeof original === 'object'`) but:
 * - it shall not be array or null;
 * - it shall not be object of `Asset`;
 * - if it's an object of `CCObject`, it should not have been destroyed.
 * @returns The newly instantiated object.
 * @example
 * ```ts
 * import { instantiate, director } from 'cc';
 * // Clone a node.
 * const node = instantiate(targetNode);
 * node.parent = director.getScene();
 * ```
 */
export declare function instantiate<T>(original: T): T;
export declare namespace instantiate {
    var _clone: typeof doInstantiate;
}
declare function doInstantiate(obj: any, parent?: any): any;
export {};
