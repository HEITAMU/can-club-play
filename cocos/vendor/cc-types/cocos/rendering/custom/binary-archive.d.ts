import { OutputArchive, InputArchive } from './archive';
export declare class BinaryOutputArchive implements OutputArchive {
    constructor();
    b(value: boolean): void;
    n(value: number): void;
    s(value: string): void;
    reserve(requiredSize: number): void;
    get data(): ArrayBuffer;
    capacity: number;
    size: number;
    buffer: Uint8Array;
    dataView: DataView;
}
export declare class BinaryInputArchive implements InputArchive {
    constructor(data: ArrayBuffer, byteOffset?: number);
    b(): boolean;
    n(): number;
    s(): string;
    offset: number;
    dataView: DataView;
}
