import { Mat4 } from '../../core';
import type { Node } from '../../scene-graph/node';
import type { UISkew } from './ui-skew';
/**
 * Check whether the node or its parent has skew components and return the original world matrix without skew to `out` parameter.
 * @param node The node and its parent for finding skew.
 * @param out The node's original world matrix without skew.
 * @return true if the node or its parent has skew components, otherwise returns false.
 */
export declare function findSkewAndGetOriginalWorldMatrix(node: Node | null, out: Mat4): boolean;
export declare function updateLocalMatrixBySkew(uiSkewComp: UISkew, outLocalMatrix: Mat4): void;
