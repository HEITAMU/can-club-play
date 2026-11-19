/// <reference types="./@types/pal/input" />
import { HMDInputDevice } from 'pal/input';
import { Event } from './event';
import { SystemEventTypeUnion } from '../event-enum';
/**
 * @en
 * The HMD event.
 *
 * @zh
 * 头戴显示器事件。
 */
export declare class EventHMD extends Event {
    /**
     * @en The hmd device which trigger the current hmd event
     * @zh 触发当前头戴显示器事件的头戴显示器设备
     */
    hmdInputDevice: HMDInputDevice;
    /**
     * @param eventType - The type of the event
     * @param hmdInputDevice - The hmd device which trigger the current hmd event
     */
    constructor(eventType: SystemEventTypeUnion, hmdInputDevice: HMDInputDevice);
}
