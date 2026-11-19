import { Mat4 } from '../core';
import { Node } from '../scene-graph/node';
export interface IJointTransform {
    node: Node;
    local: Mat4;
    world: Mat4;
    stamp: number;
    parent: IJointTransform | null;
}
export declare function getWorldMatrix(transform: IJointTransform | null, stamp: number): Readonly<Mat4>;
export declare function getTransform(node: Node, root: Node): IJointTransform | null;
export declare function deleteTransform(node: Node): void;
