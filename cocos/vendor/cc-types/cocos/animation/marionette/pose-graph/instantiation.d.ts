import { PoseNode } from './pose-node';
import { PoseGraph } from './pose-graph';
import { PureValueNodeLinkContext } from './pure-value-node';
import { PoseNodePlayMotion } from './pose-nodes/play-motion';
import { AnimationGraphBindingContext, AnimationGraphSettleContext, AnimationGraphUpdateContext, AnimationGraphEvaluationContext } from '../animation-graph-context';
import type { Pose } from '../../core/pose';
declare class InstantiatedPoseGraph {
    private _rootPoseNode;
    private _countingPlayMotionNodes;
    constructor(_rootPoseNode: PoseNode | undefined, _countingPlayMotionNodes: readonly PoseNodePlayMotion[] | undefined);
    bind(context: AnimationGraphBindingContext): void;
    settle(context: AnimationGraphSettleContext): void;
    reenter(): void;
    update(context: AnimationGraphUpdateContext): void;
    evaluate(context: AnimationGraphEvaluationContext): Pose | null;
    countMotionTime(): number;
}
export type { InstantiatedPoseGraph };
export declare function instantiatePoseGraph(graph: PoseGraph, linkContext: PureValueNodeLinkContext, mayCountMotionTime?: boolean): InstantiatedPoseGraph;
export interface PoseNodeDependencyEvaluation {
    evaluate(): void;
}
