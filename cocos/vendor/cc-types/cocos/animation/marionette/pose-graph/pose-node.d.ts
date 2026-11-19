import { Pose } from '../../core/pose';
import { AnimationGraphBindingContext, AnimationGraphEvaluationContext, AnimationGraphSettleContext, AnimationGraphUpdateContext } from '../animation-graph-context';
import { PoseGraphNode } from './foundation/pose-graph-node';
import type { PoseNodeDependencyEvaluation } from './instantiation';
export declare enum PoseTransformSpaceRequirement {
    NO = 0,
    LOCAL = 1,
    COMPONENT = 2
}
/**
 * Base class of all pose nodes.
 *
 * Pose nodes are nodes in pose graph that yields pose objects.
 */
export declare abstract class PoseNode extends PoseGraphNode {
    /**
     * Starts the bind stage on this pose node.
     *
     * @param context The bind context.
     *
     * @note Subclasses shall implement this method to perform some preparing works
     * and invoke this method on dependant pose nodes.
     */
    abstract bind(context: AnimationGraphBindingContext): void;
    /**
     * Starts the settle stage on this pose node.
     *
     * @param context The settle context.
     *
     * @note Subclasses shall implement this method to perform some post-binding works
     * and invoke this method on dependant pose nodes.
     *
     */
    abstract settle(context: AnimationGraphSettleContext): void;
    /**
     * Reenter this pose nodes.
     *
     * @note Subclasses shall implement this method to perform some state resetting works.
     * and invoke this method on dependant pose nodes.
     *
     * This method would be fired if other pose nodes that depends on this pose node requests a "reset".
     * For example, if this pose node is as a node of a pose state.
     * When this state is activated, this method is invoked.
     */
    abstract reenter(): void;
    /**
     * Perform the update stage on this pose node.
     * This method will directly forward to call `this.doUpdate`.
     *
     * @param context The update context.
     *
     * @note Subclasses shall not override this method and should override `doUpdate` instead.
     */
    update(context: AnimationGraphUpdateContext): void;
    /**
     * Evaluates this pose node.
     * This method will directly forward to call `this.doEvaluate`.
     *
     * @param context The evaluation context.
     *
     * @note Subclasses shall not override this method and should override `doEvaluate` instead.
     */
    evaluate(context: AnimationGraphEvaluationContext, poseTransformSpaceRequirement: PoseTransformSpaceRequirement): Pose;
    static evaluateDefaultPose(context: AnimationGraphEvaluationContext, poseTransformSpaceRequirement: PoseTransformSpaceRequirement): Pose;
    /** @internal */
    _setDependencyEvaluation(dependency: PoseNodeDependencyEvaluation): void;
    /**
     * Implement this method to performs the update stage on this pose node.
     *
     * @param context The update context.
     *
     * @note Subclasses shall implement this method to perform some updating works.
     * and invoke `this.update` on dependant pose nodes.
     */
    protected abstract doUpdate(context: AnimationGraphUpdateContext): void;
    /**
     * Implement this method to evaluate this pose node.
     *
     * @param context The evaluation context.
     *
     * @returns The result pose.
     */
    protected abstract doEvaluate(context: AnimationGraphEvaluationContext): Pose;
    /**
     * TODO: some nodes access dependencies in reenter(). See: cocos/cocos-engine#15305
     */
    protected _forceEvaluateEvaluation(): void;
    private _dependencyEvaluation;
}
