export declare class CCON {
    constructor(document: unknown, chunks: Uint8Array[]);
    get document(): unknown;
    get chunks(): Uint8Array[];
    private _document;
    private _chunks;
}
export declare function encodeCCONBinary(ccon: CCON): Uint8Array;
export declare function decodeCCONBinary(bytes: Uint8Array): CCON;
export declare class InvalidCCONError extends Error {
}
export declare class BufferBuilder {
    private _viewOrPaddings;
    private _length;
    constructor();
    get byteLength(): number;
    alignAs(align: number): number;
    append(view: ArrayBufferView): number;
    get(): Uint8Array;
}
