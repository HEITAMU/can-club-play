import { Node } from '../../scene-graph/node';
import { AnimationClip } from '../animation-clip';
import { AuxiliaryCurveHandle, TransformHandle } from '../core/animation-handle';
import { Pose } from '../core/pose';
import { AnimationGraphEvaluationContext } from './animation-graph-context';
/**
 * This module contains utilities to marry animation clip with animation graph.
 *
 * A typical workflow is:
 *
 * At initial, an animation clip is bound to animation graph in `AnimationClipGraphBindingContext`,
 * an `AnimationClipAGEvaluation` is created after this phase to track the evaluation.
 *
 * Then at each frame, `AnimationClipAGEvaluation.evaluate()` is called,
 * passed with the current `AnimationClipGraphEvaluationContext`.
 * The evaluation context gives the pose that need to be filled,
 * then animation clip emplaces sampled animation data into the pose.
 */
/**
 * The context in which animation clips can be bound in an animation graph.
 */
export interface AnimationClipGraphBindingContext {
    /**
     * The root node. This should be the animation controller's host node.
     */
    origin: Node;
    /**
     * Binds a scene node transform into animation graph.
     * @param path Path to the scene node from `origin`.
     * @returns The transform handle if successfully bound, `null` otherwise.
     */
    bindTransform(path: string): TransformHandle | null;
    /**
     * Binds an auxiliary curve.
     * @param curveName Curve name.
     */
    bindAuxiliaryCurve(curveName: string): AuxiliaryCurveHandle;
}
/**
 * The context in which animation clips can evaluate during animation graph evaluation.
 * Currently, the context is just the output pose.
 */
export type AnimationClipGraphEvaluationContext = Pose;
/**
 * A pose binding describes how to get/set part of a bound transform in animation graph.
 * The `T` can be `Vec3`, `Quat` for now.
 */
export interface PoseBinding<T> {
    /**
     * Destroys this binding.
     */
    destroy(): void;
    /**
     * Sets the part's value.
     * @param value The value.
     * @param pose The pose.
     */
    setValue(value: T, pose: Pose): void;
    /**
     * Reads the part's value.
     * @param pose The pose.
     */
    getValue(pose: Pose): Readonly<T>;
}
/**
 * Describes the evaluation of a animation clip in sense of animation graph.
 */
export interface AnimationClipAGEvaluation {
    /**
     * Destroys all the track evaluations and exotic animation evaluation.
     */
    destroy(): void;
    /**
     * Evaluates.
     * @param time The time.
     * @param context The evaluation context.
     */
    evaluate(time: number, context: AnimationGraphEvaluationContext): Pose;
}
export declare function createAnimationAGEvaluation(clip: AnimationClip, context: AnimationClipGraphBindingContext): AnimationClipAGEvaluation;
