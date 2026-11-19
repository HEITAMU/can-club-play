/** @mangle */
export declare class BufferBlob {
    private _arrayBufferOrPaddings;
    private _length;
    constructor();
    setNextAlignment(align: number): void;
    addBuffer(arrayBuffer: ArrayBuffer): number;
    getLength(): number;
    getCombined(): ArrayBufferLike;
}
