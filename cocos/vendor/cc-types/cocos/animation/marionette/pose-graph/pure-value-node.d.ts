import { VarInstance } from '../variable';
import { PoseGraphNode } from './foundation/pose-graph-node';
import { PoseGraphType } from './foundation/type-system';
type Outputs = unknown[];
/**
 * Base class of all pure value nodes in pose graph.
 *
 * Pure value nodes are nodes in pose graph that yields non-pose-object value(s).
 *
 * Sometimes, pure values nodes are also abbreviated as pv nodes.
 */
export declare abstract class PureValueNode extends PoseGraphNode {
    constructor(outputTypes: readonly PoseGraphType[]);
    get outputCount(): number;
    getOutputType(outputIndex: number): PoseGraphType;
    link(context: PureValueNodeLinkContext): void;
    private _outputTypes;
    abstract selfEvaluate(outputs: Outputs): void;
}
export declare abstract class SingleOutputPVNode<TValue = unknown> extends PureValueNode {
    constructor(outputType: PoseGraphType);
    selfEvaluate(outputs: Outputs): void;
    protected abstract selfEvaluateDefaultOutput(): TValue;
}
export interface PureValueNodeLinkContext {
    getVar(name: string): VarInstance | undefined;
}
export {};
