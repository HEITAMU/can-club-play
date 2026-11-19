/// <reference types="./@types/pal/input" />
/**
 * @packageDocumentation
 * @module event
 */
import { GamepadInputDevice as Gamepad } from 'pal/input';
import { Event } from './event';
/**
  * @en
  * The gamepad event.
  * @zh
  * 手柄事件。
  */
export declare class EventGamepad extends Event {
    /**
     * @en The gamepad device which trigger the current gamepad event
     * @zh 触发当前手柄事件的手柄设备
     */
    gamepad: Gamepad;
    constructor(type: string, gamepad: Gamepad);
}
