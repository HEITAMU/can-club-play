import type { AnimationController, MotionStateStatus } from '../animation-controller';
/**
 * @en State machine component.
 * @zh 状态机组件。
 */
export declare class StateMachineComponent {
    /**
     * @en
     * Called when a motion state right after it entered.
     * @zh
     * 在刚刚进入动作状态时调用。
     * @param controller The animation controller it within.
     * @param motionStateStatus The status of the motion.
     */
    onMotionStateEnter(controller: AnimationController, motionStateStatus: Readonly<MotionStateStatus>): void;
    /**
     * @en
     * Called when a motion state is going to be exited.
     * @zh
     * 在即将退出动作状态时调用。
     * @param controller The animation controller it within.
     * @param motionStateStatus The status of the motion.
     */
    onMotionStateExit(controller: AnimationController, motionStateStatus: Readonly<MotionStateStatus>): void;
    /**
     * @en
     * Called when a motion state updated except for the first and last frame.
     * @zh
     * 在动作状态更新时调用，但不会在第一次和最后一次时调用。
     * @param controller The animation controller it within.
     * @param motionStateStatus The status of the motion.
     */
    onMotionStateUpdate(controller: AnimationController, motionStateStatus: Readonly<MotionStateStatus>): void;
    /**
     * @en
     * Called when a state machine right after it entered.
     * @zh
     * 在刚刚进入状态机时调用。
     * @param controller The animation controller it within.
     */
    onStateMachineEnter(controller: AnimationController): void;
    /**
     * @en
     * Called when a state machine is going to be exited.
     * @zh
     * 在即将退出状态机时调用。
     * @param controller The animation controller it within.
     */
    onStateMachineExit(controller: AnimationController): void;
}
