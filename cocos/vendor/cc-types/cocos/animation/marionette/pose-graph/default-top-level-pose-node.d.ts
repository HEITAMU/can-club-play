import { Pose, TransformFilter } from '../../core/pose';
import { AnimationGraph, Layer } from '../animation-graph';
import { AnimationGraphBindingContext, AnimationGraphEvaluationContext, AnimationGraphSettleContext, AnimationGraphUpdateContext } from '../animation-graph-context';
import { TopLevelStateMachineEvaluation } from '../state-machine/state-machine-eval';
import { PoseNode } from './pose-node';
import { PoseStashAllocator } from './stash/runtime-stash';
export declare class DefaultTopLevelPoseNode extends PoseNode {
    constructor(graph: AnimationGraph, bindingContext: AnimationGraphBindingContext, poseStashAllocator: PoseStashAllocator);
    get layerCount(): number;
    reenter(): void;
    bind(_context: AnimationGraphBindingContext): void;
    settle(context: AnimationGraphSettleContext): void;
    getLayerWeight(layerIndex: number): number;
    setLayerWeight(layerIndex: number, weight: number): void;
    getLayerTopLevelStateMachineEvaluation(layerIndex: number): TopLevelStateMachineEvaluation;
    overrideClips(context: AnimationGraphBindingContext): void;
    protected doUpdate(context: AnimationGraphUpdateContext): void;
    protected doEvaluate(context: AnimationGraphEvaluationContext): Pose;
    private _layerRecords;
}
declare class LayerEvaluationRecord {
    constructor(layer: Layer, bindingContext: AnimationGraphBindingContext, poseStashAllocator: PoseStashAllocator);
    get stateMachineEvaluation(): TopLevelStateMachineEvaluation;
    settle(context: AnimationGraphSettleContext): void;
    update(context: AnimationGraphUpdateContext): void;
    postEvaluate(): void;
    additive: boolean;
    weight: number;
    private _topLevelStateMachineEval;
    private _stashManager;
    private _motionSyncManager;
    private _mask;
    transformFilter: TransformFilter | undefined;
}
export type { LayerEvaluationRecord };
