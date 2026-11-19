/// <reference types="./@types/globals" />
import { js } from '../core';
import { Details } from './deserialize';
import type { deserialize } from './deserialize';
import { CCON } from './ccon';
type ReportMissingClass = deserialize.ReportMissingClass;
type ClassFinder = deserialize.ClassFinder;
type SerializableClassConstructor = deserialize.SerializableClassConstructor;
export type CompiledDeserializeFn = (deserializer: _Deserializer, object: Record<string, unknown>, deserialized: Record<string, unknown>, constructor: AnyFunction) => void;
type TypedArrayViewConstructorName = 'Uint8Array' | 'Int8Array' | 'Uint16Array' | 'Int16Array' | 'Uint32Array' | 'Int32Array' | 'Float32Array' | 'Float64Array';
interface SerializedTypedArray {
    __id__: never;
    __uuid__: never;
    __type__: 'TypedArray';
    array: number[];
    ctor: TypedArrayViewConstructorName;
}
interface SerializedTypedArrayRef {
    __id__: never;
    __uuid__: never;
    __type__: 'TypedArrayRef';
    ctor: TypedArrayViewConstructorName;
    offset: number;
    length: number;
}
type SerializedGeneralTypedObject = {
    __id__: never;
    __uuid__: never;
    __type__?: NotKnownTypeTag;
} & Record<NotTypeTag, SerializedFieldValue>;
interface SerializedObjectReference {
    __type__: never;
    __uuid__: never;
    __id__: number;
}
interface SerializedUUIDReference {
    __type__: never;
    __id__: never;
    __uuid__: string;
    __expectedType__: string;
}
type SerializedObject = SerializedTypedArray | SerializedTypedArrayRef | SerializedGeneralTypedObject;
type SerializedFieldObjectValue = SerializedObjectReference | SerializedUUIDReference | unknown;
type SerializedFieldValue = string | number | boolean | null | SerializedFieldObjectValue;
type NotA<T, ReservedNames> = T extends ReservedNames ? never : T;
type NotB<T, ReservedNames> = ReservedNames extends T ? never : T;
type FooName<T, ReservedNames> = NotA<T, ReservedNames> & NotB<T, ReservedNames>;
type NotTypeTag = FooName<string, '__type__'>;
type NotKnownTypeTag = FooName<string, 'TypedArray' | 'TypedArrayRef'>;
type SerializedData = SerializedObject | SerializedObject[];
declare class DeserializerPool extends js.Pool<_Deserializer> {
    constructor();
}
declare class _Deserializer {
    static pool: DeserializerPool;
    result: Details;
    customEnv: unknown;
    deserializedList: Array<Record<PropertyKey, unknown> | undefined>;
    deserializedData: any;
    private _classFinder;
    private _reportMissingClass;
    private _onDereferenced;
    /**
     * @engineInternal
     */
    get ignoreEditorOnly(): unknown;
    private _ignoreEditorOnly;
    private _mainBinChunk;
    private _serializedData;
    private _context;
    constructor(result: Details, classFinder: ClassFinder, reportMissingClass: ReportMissingClass, customEnv: unknown, ignoreEditorOnly: unknown);
    reset(result: Details, classFinder: ClassFinder, reportMissingClass: ReportMissingClass, customEnv: unknown, ignoreEditorOnly: unknown): void;
    clear(): void;
    deserialize(serializedData: SerializedData | CCON): any;
    /**
     * @param serialized - The object to deserialize, must be non-nil.
     * @param globalIndex - If the object is deserialized from "root objects" array.
     * @param owner - Tracing purpose.
     * @param propName - Tracing purpose.
     */
    private _deserializeObject;
    private _deserializeTypedArrayView;
    private _deserializeTypedArrayViewRef;
    private _deserializeArray;
    private _deserializePlainObject;
    private _deserializeTypeTaggedObject;
    private _deserializeInto;
    private _runCustomizedDeserialize;
    private _deserializeFireClass;
    /**
     * @engineInternal
     */
    _deserializeAndAssignField(obj: Record<PropertyKey, unknown> | unknown[], serializedField: SerializedFieldObjectValue, propName: string): boolean;
    private _deserializeObjectField;
    /**
     * @engineInternal
     */
    _fillPlainObject(instance: Record<string, unknown>, serialized: Record<string, unknown>): void;
    /**
     * @engineInternal
     */
    _deserializeFastDefinedObject(instance: Record<PropertyKey, unknown>, serialized: SerializedGeneralTypedObject, klass: SerializableClassConstructor): void;
}
export interface DeserializeDynamicOptions {
    classFinder?: ClassFinder;
    ignoreEditorOnly?: boolean;
    createAssetRefs?: boolean;
    customEnv?: unknown;
    reportMissingClass?: ReportMissingClass;
}
export declare function deserializeDynamic(data: SerializedData | CCON, details: Details, options?: DeserializeDynamicOptions): any;
export declare function parseUuidDependenciesDynamic(serialized: unknown): string[];
export {};
