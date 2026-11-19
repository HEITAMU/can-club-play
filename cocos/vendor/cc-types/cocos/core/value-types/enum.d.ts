export type EnumType = Record<string, string | number>;
/**
 * @en
 * Define an enum type. <br/>
 * If a enum item has a value of -1, it will be given an Integer number according to it's order in the list.<br/>
 * Otherwise it will use the value specified by user who writes the enum definition.
 *
 * @zh
 * 定义一个枚举类型。<br/>
 * 用户可以把枚举值设为任意的整数，如果设为 -1，系统将会分配为上一个枚举值 + 1。
 *
 * @param obj
 * @en A JavaScript literal object containing enum names and values, or a TypeScript enum type.
 * @zh 包含枚举名和值的 JavaScript literal 对象，或者是一个 TypeScript enum 类型。
 * @return @en The defined enum type. @zh 定义的枚举类型。
 */
export declare function Enum<T extends object>(obj: T): T;
export declare namespace Enum {
    var update: <T extends object>(obj: T) => T;
    var isEnum: <EnumT extends object>(enumType: EnumT) => boolean;
    var getList: <EnumT extends object>(enumType: EnumT) => readonly Enum.Enumerator<EnumT>[];
    var sortList: <EnumT extends object>(enumType: EnumT, compareFn: (a: Enum.Enumerator<EnumT>, b: Enum.Enumerator<EnumT>) => number) => void;
}
declare namespace Enum {
    interface Enumerator<EnumT> {
        /**
         * The name of the enumerator.
         */
        name: keyof EnumT;
        /**
         * The value of the numerator.
         */
        value: EnumT[keyof EnumT];
    }
}
/**
 * Make the enum type `enumType` as enumeration so that Creator may identify, operate on it.
 * Formally, as a result of invocation on this function with enum type `enumType`:
 * - `Enum.isEnum(enumType)` returns `true`;
 * - `Enum.getList(enumType)` returns the enumerators of `enumType`.
 * @param
 * @en enumType An enum type, eg, a kind of type with similar semantic defined by TypeScript.
 * @zh 枚举类型，例如 TypeScript 中定义的类型。
 */
export declare function ccenum<EnumT extends object>(enumType: EnumT): void;
export {};
