/** @mangle */
interface IMeshoptDecoder {
    supported: boolean;
    ready: Promise<void>;
    decodeVertexBuffer: (target: Uint8Array, count: number, size: number, source: Uint8Array) => number;
    decodeIndexBuffer: (target: Uint8Array, count: number, size: number, source: Uint8Array) => number;
    decodeIndexSequence: (target: Uint8Array, count: number, size: number, source: Uint8Array) => number;
    decodeGltfBuffer: (target: Uint8Array, count: number, size: number, source: Uint8Array, mode: string) => void;
    useWorkers: boolean;
    decodeGltfBufferAsync: (count: number, size: number, source: Uint8Array, mode: string) => Promise<Uint8Array>;
}
export declare const MeshoptDecoder: IMeshoptDecoder;
export declare function InitDecoder(): Promise<void>;
export {};
