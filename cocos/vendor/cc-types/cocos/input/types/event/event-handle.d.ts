/// <reference types="./@types/pal/input" />
import { HandleInputDevice } from 'pal/input';
import { Event } from './event';
import { SystemEventTypeUnion } from '../event-enum';
/**
 * @en
 * The 6DOF handle event.
 *
 * @zh
 * 6DOF手柄事件。
 */
export declare class EventHandle extends Event {
    /**
     * @en The handle device which trigger the current handle event
     * @zh 触发当前手柄事件的手柄设备
     */
    handleInputDevice: HandleInputDevice;
    /**
     * @param eventType - The type of the event
     * @param handleInputDevice - The handle device which trigger the current handle event
     */
    constructor(eventType: SystemEventTypeUnion, handleInputDevice: HandleInputDevice);
}
