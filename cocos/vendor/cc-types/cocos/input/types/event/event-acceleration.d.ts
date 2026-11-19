import { Event } from './event';
import { Acceleration } from '../acceleration';
/**
 * @en
 * The acceleration event.
 * @zh
 * 加速计事件。
 */
export declare class EventAcceleration extends Event {
    /**
     * @en The acceleration object
     * @zh 加速度对象
     */
    acc: Acceleration;
    /**
     * @param acc - The acceleration
     * @param bubbles - Indicate whether the event bubbles up through the hierarchy or not.
     */
    constructor(acc: Acceleration, bubbles?: boolean);
}
