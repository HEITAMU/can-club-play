import { Motion } from '../../motion/motion';
import { PoseNode } from '../pose-node';
import { MotionSyncInfo } from '../motion-sync/motion-sync-info';
import { AnimationGraphBindingContext, AnimationGraphEvaluationContext, AnimationGraphSettleContext, AnimationGraphUpdateContext } from '../../animation-graph-context';
import type { Pose } from '../../../core/pose';
export declare class PoseNodePlayMotion extends PoseNode {
    motion: Motion | null;
    readonly syncInfo: MotionSyncInfo;
    startTime: number;
    speedMultiplier: number;
    /**
     * The weight of this node indicated in last update.
     */
    get lastIndicativeWeight(): number;
    /**
     * Normalized time elapsed on specified motion.
     */
    get elapsedMotionTime(): number;
    bind(context: AnimationGraphBindingContext): void;
    settle(context: AnimationGraphSettleContext): void;
    reenter(): void;
    protected doUpdate(context: AnimationGraphUpdateContext): void;
    doEvaluate(context: AnimationGraphEvaluationContext): Pose;
    private _workspace;
    private _runtimeSyncRecord;
}
