import { Format } from '../../gfx';
export declare function writeBuffer(target: DataView, data: number[], format?: Format, offset?: number, stride?: number): void;
export declare function readBuffer(target: DataView, format?: Format, offset?: number, length?: number, stride?: number, out?: number[]): number[];
export declare function mapBuffer(target: DataView, callback: (cur: number, idx: number, view: DataView) => number, format?: Format, offset?: number, length?: number, stride?: number, out?: DataView): DataView;
