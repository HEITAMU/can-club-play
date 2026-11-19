export declare enum StorageUnit {
    Uint8 = 0,
    Uint16 = 1,
    Uint32 = 2,
    Int8 = 3,
    Int16 = 4,
    Int32 = 5,
    Float32 = 6,
    Float64 = 7
}
export declare enum ElementType {
    Scalar = 0,
    Vec2 = 1,
    Vec3 = 2,
    Vec4 = 3,
    Quat = 4,
    Mat4 = 5
}
export type StorageUnitElementType = number;
export declare function combineStorageUnitElementType(unit: StorageUnit, elementType: ElementType): number;
export declare function extractStorageUnitElementType(combined: StorageUnitElementType): {
    storageUnit: number;
    elementType: number;
};
/**
 * @deprecated Since V3.5.0.
 */
export declare class CompactValueTypeArray {
    static StorageUnit: typeof StorageUnit;
    static ElementType: typeof ElementType;
    /**
     * Offset into the buffer, in bytes.
     */
    private _byteOffset;
    /**
     * Unit count this CVTA occupies.
     */
    private _unitCount;
    /**
     * Element type this CVTA holds.
     */
    private _unitElement;
    /**
     * Element count this CVTA holds.
     */
    private _length;
    /**
     * Returns the length in bytes that a buffer needs to encode the specified value array in form of CVTA.
     * @param values The value array.
     * @param unit Target element type.
     */
    static lengthFor(values: any[], elementType: ElementType, unit: StorageUnit): number;
    /**
     * Compresses the specified value array in form of CVTA into target buffer.
     * @param values The value array.
     * @param unit Target element type.
     * @param arrayBuffer Target buffer.
     * @param byteOffset Offset into target buffer.
     */
    static compress(values: any[], elementType: ElementType, unit: StorageUnit, arrayBuffer: ArrayBuffer, byteOffset: number, presumedByteOffset: number): CompactValueTypeArray;
    /**
     * Decompresses this CVTA.
     * @param arrayBuffer The buffer this CVTA stored in.
     */
    decompress<T>(arrayBuffer: ArrayBuffer): T[];
}
export declare function isCompactValueTypeArray(value: any): value is CompactValueTypeArray;
