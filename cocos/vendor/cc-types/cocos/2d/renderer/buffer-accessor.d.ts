import { Attribute, Device } from '../../gfx';
import type { MeshBuffer } from './mesh-buffer';
export declare class BufferAccessor {
    get attributes(): Readonly<Attribute[]>;
    get vertexFormatBytes(): number;
    get floatsPerVertex(): number;
    protected _device: Device;
    protected _attributes: Attribute[];
    protected _vertexFormatBytes: number;
    protected _floatsPerVertex: number;
    protected _buffers: MeshBuffer[];
    constructor(device: Device, attributes: Attribute[]);
    initialize(): void;
    reset(): void;
    request(vertexCount?: number, indexCount?: number): void;
    appendBuffers(vertices: Float32Array, indices: Uint16Array): void;
    uploadBuffers(): void;
    destroy(): void;
}
