import { Motion } from '../motion';
import { InteractiveState } from './state';
import { AnimationGraphEventBinding } from '../event/event-binding';
export declare class MotionState extends InteractiveState {
    motion: Motion | null;
    speed: number;
    /**
     * Should be float.
     */
    speedMultiplier: string;
    speedMultiplierEnabled: boolean;
    /**
     * @zh 状态进入事件绑定，此处绑定的事件会在状态机向该状态过渡时触发。
     * @en State entered event binding. The event bound here will be triggered
     * when the state machine starts to transition into this state.
     */
    transitionInEventBinding: AnimationGraphEventBinding;
    /**
     * @zh 状态离开事件绑定，此处绑定的事件会在状态机从该状态离开时触发。
     * @en State left event binding. The event bound here will be triggered
     * when the state machine starts to transition out from this state.
     */
    transitionOutEventBinding: AnimationGraphEventBinding;
    /**
     * // TODO: HACK
     * @internal
     */
    __callOnAfterDeserializeRecursive(): void;
    copyTo(that: MotionState): MotionState;
}
