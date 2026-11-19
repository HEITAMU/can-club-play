import { AnimationState } from './animation-state';
import { Playable } from './playable';
interface CrossFadeScheduler {
    addCrossFade(crossFade: CrossFade): void;
    removeCrossFade(crossFade: CrossFade): void;
}
export declare class CrossFade extends Playable {
    private readonly _managedStates;
    private readonly _fadings;
    private _scheduled;
    private _scheduler;
    constructor(scheduler?: CrossFadeScheduler);
    update(deltaTime: number): void;
    /**
     * 在指定时间内将从当前动画状态切换到指定的动画状态。
     * @param state 指定的动画状态。
     * @param duration 切换时间。
     */
    crossFade(state: AnimationState | null, duration: number): void;
    clear(): void;
    protected onPlay(): void;
    /**
     * 停止我们淡入淡出的所有动画状态并停止淡入淡出。
     */
    protected onPause(): void;
    /**
     * 恢复我们淡入淡出的所有动画状态并继续淡入淡出。
     */
    protected onResume(): void;
    /**
     * 停止所有淡入淡出的动画状态。
     */
    protected onStop(): void;
    private _calculateWeights;
    private _scheduleThis;
    private _unscheduleThis;
}
export {};
