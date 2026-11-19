/**
 * @en the device accelerometer reports values for each axis in units of g-force.
 * @zh 设备重力传感器传递的各个轴的数据。
 */
export declare class Acceleration {
    x: number;
    y: number;
    z: number;
    timestamp: number;
    constructor(x?: number, y?: number, z?: number, timestamp?: number);
}
