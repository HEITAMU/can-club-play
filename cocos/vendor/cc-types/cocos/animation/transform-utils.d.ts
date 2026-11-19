import { Mat4 } from '../core';
import { Node } from '../scene-graph';
/**
 * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
 */
export declare function getPathFromRoot(target: Node | null, root: Node): string;
/**
 * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
 */
export declare function getWorldTransformUntilRoot(target: Node, root: Node, outMatrix: Mat4): Mat4;
