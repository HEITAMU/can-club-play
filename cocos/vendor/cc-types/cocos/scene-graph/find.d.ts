import { Node } from './node';
/**
 * @en Finds a node by hierarchy path, the path is case-sensitive.
 * It will traverse the hierarchy by splitting the path using '/' character.
 * This function will still returns the node even if it is inactive.
 * It is recommended to not use this function every frame instead cache the result at startup.
 * @zh 通过路径从节点树中查找节点的方法，路径是大小写敏感的，并且通过 `/` 来分隔节点层级。
 * 即使节点的状态是未启用的也可以找到，建议将结果缓存，而不是每次需要都去查找。
 * @param path The path of the target node
 * @param referenceNode If given, the search will be limited in the sub node tree of the reference node
 */
export declare function find(path: string, referenceNode?: Node): Node | null;
