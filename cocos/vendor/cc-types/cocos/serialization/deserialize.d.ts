/// <reference types="./@types/globals" />
import { js } from '../core';
import { DeserializeDynamicOptions } from './deserialize-dynamic';
import { Asset } from '../asset/assets/asset';
import type { CompiledDeserializeFn } from './deserialize-dynamic';
import { reportMissingClass as defaultReportMissingClass } from './report-missing-class';
import type { MapEnum, TupleSlice } from './deserialize-type-utilities';
declare const EMPTY_PLACEHOLDER = 0;
/** **************************************************************************
 * TYPE DECLARATIONS
 *************************************************************************** */
type Bnot<T extends number, U extends number> = T | U;
type BoolAndNum<B extends boolean, N extends number> = Bnot<N, N>;
type SharedString = string;
type Empty = typeof EMPTY_PLACEHOLDER;
type StringIndex = number;
type InstanceIndex = number;
type RootInstanceIndex = InstanceIndex;
type NoNativeDep = boolean;
type RootInfo = BoolAndNum<NoNativeDep, RootInstanceIndex>;
type StringIndexBnotNumber = Bnot<StringIndex, number>;
type ReverseIndex = number;
type InstanceBnotReverseIndex = Bnot<InstanceIndex, ReverseIndex>;
export declare namespace deserialize.Internal {
    type SharedString_ = SharedString;
    type Empty_ = Empty;
    type StringIndex_ = StringIndex;
    type InstanceIndex_ = InstanceIndex;
    type StringIndexBnotNumber_ = StringIndexBnotNumber;
}
declare const enum DataTypeID {
    SimpleType = 0,
    InstanceRef = 1,
    Array_InstanceRef = 2,
    Array_AssetRefByInnerObj = 3,
    Class = 4,
    ValueTypeCreated = 5,
    AssetRefByInnerObj = 6,
    TRS = 7,
    ValueType = 8,
    Array_Class = 9,
    CustomizedClass = 10,
    Dict = 11,
    Array = 12,
    ARRAY_LENGTH = 13
}
export declare namespace deserialize.Internal {
    export import DataTypeID_ = DataTypeID;
    type DataTypes_ = DataTypes;
}
interface DataTypes {
    [DataTypeID.SimpleType]: number | string | boolean | null | object;
    [DataTypeID.InstanceRef]: InstanceBnotReverseIndex;
    [DataTypeID.Array_InstanceRef]: DataTypes[DataTypeID.InstanceRef][];
    [DataTypeID.Array_AssetRefByInnerObj]: DataTypes[DataTypeID.AssetRefByInnerObj][];
    [DataTypeID.Class]: IClassObjectData;
    [DataTypeID.ValueTypeCreated]: IValueTypeData;
    [DataTypeID.AssetRefByInnerObj]: number;
    [DataTypeID.TRS]: ITRSData;
    [DataTypeID.ValueType]: IValueTypeData;
    [DataTypeID.Array_Class]: DataTypes[DataTypeID.Class][];
    [DataTypeID.CustomizedClass]: ICustomObjectData;
    [DataTypeID.Dict]: IDictData;
    [DataTypeID.Array]: IArrayData;
}
type PrimitiveObjectTypeID = (DataTypeID.SimpleType | // SimpleType also includes any pure JSON object
DataTypeID.Array | DataTypeID.Array_Class | DataTypeID.Array_AssetRefByInnerObj | DataTypeID.Array_InstanceRef | DataTypeID.Dict);
type AdvancedTypeID = Exclude<DataTypeID, DataTypeID.SimpleType>;
type AnyData = DataTypes[keyof DataTypes];
type AdvancedData = DataTypes[Exclude<keyof DataTypes, DataTypeID.SimpleType>];
type OtherObjectData = ICustomObjectDataContent | Exclude<DataTypes[PrimitiveObjectTypeID], (number | string | boolean | null)>;
type OtherObjectTypeID = Bnot<number, PrimitiveObjectTypeID>;
type Ctor<T> = new () => T;
export interface CCClassConstructor<T> extends Ctor<T> {
    __values__: string[];
    __deserialize__?: CompiledDeserializeFn;
}
type AnyCtor = Ctor<Object>;
type AnyCCClass = CCClassConstructor<Object>;
export declare namespace deserialize.Internal {
    type AnyData_ = AnyData;
    type OtherObjectData_ = OtherObjectData;
    type OtherObjectTypeID_ = OtherObjectTypeID;
    type AnyCCClass_ = AnyCCClass;
}
type IClass = [
    string | AnyCtor,
    string[],
    number,
    ...DataTypeID[]
];
type IMask = [
    number,
    ...number[]
];
type IClassObjectData = [
    number,
    ...AnyData[]
];
type ICustomObjectDataContent = any;
declare const CUSTOM_OBJ_DATA_CLASS = 0;
declare const CUSTOM_OBJ_DATA_CONTENT = 1;
interface ICustomObjectData extends Array<any> {
    [CUSTOM_OBJ_DATA_CLASS]: number;
    [CUSTOM_OBJ_DATA_CONTENT]: ICustomObjectDataContent;
}
type IValueTypeData = [
    number,
    ...number[]
];
type ITRSData = [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number
];
declare const DICT_JSON_LAYOUT = 0;
interface IDictData extends Array<any> {
    [DICT_JSON_LAYOUT]: any;
    [1]: string;
    [2]: AdvancedTypeID;
    [3]: AdvancedData;
    [index: number]: any;
}
type IArrayData = [
    AnyData[],
    ...DataTypeID[]
];
export declare namespace deserialize.Internal {
    type IClass_ = IClass;
    type IMask_ = IMask;
    type IClassObjectData_ = IClassObjectData;
    type ICustomObjectDataContent_ = ICustomObjectDataContent;
    type ICustomObjectData_ = ICustomObjectData;
    type ITRSData_ = ITRSData;
    type IDictData_ = IDictData;
    type IArrayData_ = IArrayData;
}
declare const enum Refs {
    EACH_RECORD_LENGTH = 3,
    OWNER_OFFSET = 0,
    KEY_OFFSET = 1,
    TARGET_OFFSET = 2
}
interface IRefs extends Array<number> {
    [0]: (object | InstanceIndex);
    [1]?: StringIndexBnotNumber;
    [2]?: InstanceIndex;
    [index: number]: any;
}
declare const enum File {
    Version = 0,
    Context = 0,
    SharedUuids = 1,
    SharedStrings = 2,
    SharedClasses = 3,
    SharedMasks = 4,
    Instances = 5,
    InstanceTypes = 6,
    Refs = 7,
    DependObjs = 8,
    DependKeys = 9,
    DependUuidIndices = 10,
    ARRAY_LENGTH = 11
}
interface IFileDataMap {
    [File.Version]: number;
    [File.SharedUuids]: SharedString[] | Empty;
    [File.SharedStrings]: SharedString[] | Empty;
    [File.SharedClasses]: (IClass | string | AnyCCClass)[];
    [File.SharedMasks]: IMask[] | Empty;
    [File.Instances]: (IClassObjectData | OtherObjectData | RootInfo)[];
    [File.InstanceTypes]: OtherObjectTypeID[] | Empty;
    [File.Refs]: IRefs | Empty;
    [File.DependObjs]: (object | InstanceIndex)[];
    [File.DependKeys]: (StringIndexBnotNumber | string)[];
    [File.DependUuidIndices]: (StringIndex | string)[];
}
type IFileData = MapEnum<{
    [x in keyof IFileDataMap as `${x}`]: IFileDataMap[x];
}, 11>;
type IRuntimeFileDataMap = Omit<IFileDataMap, File.Version> & {
    [File.Context]: FileInfo & DeserializeContext;
};
/**
 * At runtime, we intruded the original file data and injected some helpers.
 */
export type IRuntimeFileData = MapEnum<{
    [x in keyof IRuntimeFileDataMap as `${x}`]: IRuntimeFileDataMap[x];
}, 11>;
type IDeserializeInput = IFileData | IRuntimeFileData;
type ISharedData = TupleSlice<IFileData, 1, 5>;
type IPackedFileSection = [
    ...document: TupleSlice<IFileData, 5>
];
type IPackedFileData = [
    /** Version. */
    version: number,
    ...shared: ISharedData,
    sections: IPackedFileSection[]
];
export declare namespace deserialize.Internal {
    export import Refs_ = Refs;
    type IRefs_ = IRefs;
    export import File_ = File;
    type IFileData_ = IFileData;
    type IPackedFileData_ = IPackedFileData;
}
interface ICustomHandler {
    result: Details;
    customEnv: any;
}
type ClassFinder = deserialize.ClassFinder;
interface DeserializeContext extends ICustomHandler {
    _version?: number;
}
interface IOptions extends Partial<ICustomHandler> {
    classFinder?: ClassFinder;
    reportMissingClass?: deserialize.ReportMissingClass;
}
/** **************************************************************************
 * IMPLEMENTS
 *************************************************************************** */
/**
 * @en Contains information collected during deserialization
 * @zh 包含反序列化时的一些信息。
 * @class Details
 */
export declare class Details {
    /**
     * @en
     * the object list whose field needs to load asset by uuid
     * @zh
     * 对象列表，其中每个对象有属性需要通过 uuid 进行资源加载
     */
    uuidObjList: IRuntimeFileData[File.DependObjs] | null;
    /**
     * @en
     * the corresponding field name which referenced to the asset
     * @zh
     * 引用着资源的字段名称
     */
    uuidPropList: IRuntimeFileData[File.DependKeys] | null;
    /**
     * @en
     * list of the depends assets' uuid
     * @zh
     * 依赖资源的 uuid 列表
     */
    uuidList: IRuntimeFileData[File.DependUuidIndices] | null;
    /**
     * @en
     * list of the depends assets' type
     * @zh
     * 依赖的资源类型列表
     */
    uuidTypeList: string[];
    static pool: js.Pool<Details>;
    assignAssetsBy: (getter: (uuid: string, options: {
        type: Constructor<Asset>;
        owner: Record<string, unknown>;
        prop: string;
    }) => Asset) => void;
    /**
     * @method init
     * @param {Object} data
     */
    init(data?: IDeserializeInput): void;
    /**
     * @method reset
     */
    reset(): void;
    /**
     * @method push
     * @param {Object} obj
     * @param {String} propName
     * @param {String} uuid
     */
    push(obj: object, propName: string, uuid: string, type?: string): void;
}
export declare function dereference(refs: IRefs, instances: IRuntimeFileData[File.Instances], strings: IRuntimeFileData[File.SharedStrings]): void;
export declare function isCompiledJson(json: unknown): boolean;
/**
 * @en Deserializes a previously serialized object to reconstruct it to the original.
 * @zh 将序列化后的对象进行反序列化以使其复原。
 *
 * @param data Serialized data.
 * @param details - Additional loading result.
 * @param options Deserialization Options.
 * @return The original object.
 */
export declare function deserialize(data: IDeserializeInput | string | any, details?: Details, options?: IOptions & DeserializeDynamicOptions): unknown;
export declare namespace deserialize {
    var Details: typeof import("./deserialize").Details;
    var reportMissingClass: typeof defaultReportMissingClass;
    var isCompiledJson: typeof import("./deserialize").isCompiledJson;
    var _macros: {
        EMPTY_PLACEHOLDER: 0;
        CUSTOM_OBJ_DATA_CLASS: 0;
        CUSTOM_OBJ_DATA_CONTENT: 1;
        CLASS_TYPE: 0;
        CLASS_KEYS: 1;
        CLASS_PROP_TYPE_OFFSET: 2;
        MASK_CLASS: 0;
        OBJ_DATA_MASK: 0;
        DICT_JSON_LAYOUT: 0;
        ARRAY_ITEM_VALUES: 0;
        PACKED_SECTIONS: File.Instances;
    };
}
export declare namespace deserialize {
    type SerializableClassConstructor = new () => unknown;
    type ReportMissingClass = (id: string) => void;
    type ClassFinder = {
        (id: string, serialized: unknown, owner?: unknown[] | Record<PropertyKey, unknown>, propName?: string): SerializableClassConstructor | undefined;
        onDereferenced?: (deserializedList: Array<Record<PropertyKey, unknown> | undefined>, id: number, object: Record<string, unknown> | unknown[], propName: string) => void;
    };
}
declare class FileInfo {
    version: number;
    preprocessed: boolean;
    constructor(version: number);
}
export declare function unpackJSONs(data: IPackedFileData, classFinder?: ClassFinder, reportMissingClass?: deserialize.ReportMissingClass): IDeserializeInput[];
export declare function packCustomObjData(type: string, data: IClassObjectData | OtherObjectData, hasNativeDep?: boolean): IFileData;
export declare function hasNativeDep(data: IRuntimeFileData): boolean;
export declare function parseUuidDependencies(serialized: unknown): string[];
export {};
