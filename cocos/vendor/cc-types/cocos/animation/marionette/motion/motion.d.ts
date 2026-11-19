import { Node } from '../../../scene-graph';
import { AnimationMask } from '../animation-mask';
import { createEval } from '../create-eval';
import type { BlendStateBuffer } from '../../../3d/skeletal-animation/skeletal-animation-blending';
import type { ClipStatus } from '../state-machine/state-machine-eval';
import type { RuntimeID } from '../graph-debug';
import { AnimationGraphBindingContext, AnimationGraphEvaluationContext } from '../animation-graph-context';
import { Pose } from '../../core/pose';
import { EditorExtendable } from '../../../core';
export interface CreateClipEvalContext {
    node: Node;
    blendBuffer: BlendStateBuffer;
    mask?: AnimationMask;
}
export interface MotionEval {
    /**
     * The runtime ID. Maybe invalid.
     */
    readonly runtimeId?: RuntimeID;
    /**
     * The duration of this motion. If it's a clip motion.
     * It should be $duration_{clip} / speed_{clip}$.
     */
    readonly duration: number;
    getClipStatuses(baseWeight: number): Iterator<ClipStatus>;
    overrideClips(context: AnimationGraphBindingContext): void;
    createPort(): MotionPort;
}
export declare abstract class Motion extends EditorExtendable {
    abstract [createEval](context: AnimationGraphBindingContext, ignoreEmbeddedPlayers: boolean): MotionEval | null;
    abstract clone(): Motion;
    /**
     * // TODO: HACK
     * @internal
     */
    __callOnAfterDeserializeRecursive(): void;
}
export interface MotionPort {
    evaluate(progress: number, context: AnimationGraphEvaluationContext): Pose;
    reenter(): void;
}
