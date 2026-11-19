/// <reference types="./@types/pal/input" />
import { HandheldInputDevice } from 'pal/input';
import { Event } from './event';
import { SystemEventTypeUnion } from '../event-enum';
/**
 * @en
 * The Handheld event.
 *
 * @zh
 * 手持设备事件。
 */
export declare class EventHandheld extends Event {
    /**
     * @en The handheld device which trigger the current handheld event
     * @zh 触发当前手持设备事件的手持设备
     */
    handheldInputDevice: HandheldInputDevice;
    /**
     * @param eventType - The type of the event
     * @param handheldInputDevice - The handheld device which trigger the current handheld event
     */
    constructor(eventType: SystemEventTypeUnion, handheldInputDevice: HandheldInputDevice);
}
