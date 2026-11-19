import { PoseGraphNode } from './pose-graph-node';
export declare class AddNonFreestandingNodeError extends Error {
    constructor(node: PoseGraphNode);
}
export declare class OperationOnFreestandingNodeError extends Error {
    constructor(node: PoseGraphNode);
}
