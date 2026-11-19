import { Type } from '../../gfx';
import { Color, Mat3, Mat4, Vec2, Vec3, Vec4, Quat, IVec2Like, IVec3Like, IVec4Like, IMat3Like, IMat4Like } from '../../core';
export declare const genHandle: (binding: number, type: Type, count: number, offset?: number) => number;
export declare const getTypeFromHandle: (handle: number) => number;
export declare const getBindingFromHandle: (handle: number) => number;
export declare const getCountFromHandle: (handle: number) => number;
export declare const getOffsetFromHandle: (handle: number) => number;
export declare const customizeType: (handle: number, type: Type) => number;
/**
 * @en Vector type uniforms
 * @zh 向量类型 uniform
 */
export type MaterialProperty = number | Vec2 | Vec3 | Vec4 | Color | Mat3 | Mat4 | Quat;
export declare const type2reader: {
    0: (a: Float32Array, v: number, idx?: number) => void;
    5: (a: Int32Array, v: number, idx?: number) => number;
    6: (a: Int32Array, v: IVec2Like, idx?: number) => IVec2Like;
    7: (a: Int32Array, v: IVec3Like, idx?: number) => IVec3Like;
    8: (a: Int32Array, v: IVec4Like, idx?: number) => IVec4Like;
    13: (a: Float32Array, v: number, idx?: number) => number;
    14: (a: Float32Array, v: IVec2Like, idx?: number) => IVec2Like;
    15: (a: Float32Array, v: IVec3Like, idx?: number) => IVec3Like;
    16: (a: Float32Array, v: IVec4Like, idx?: number) => IVec4Like;
    21: (a: Float32Array, v: IMat3Like, idx?: number) => IMat3Like;
    25: (a: Float32Array, v: IMat4Like, idx?: number) => IMat4Like;
};
export declare const type2writer: {
    0: (a: Float32Array, v: number, idx?: number) => void;
    5: (a: Int32Array, v: number, idx?: number) => number;
    6: (a: Int32Array, v: Vec2, idx?: number) => Int32Array;
    7: (a: Int32Array, v: Vec3, idx?: number) => Int32Array;
    8: (a: Int32Array, v: Vec4, idx?: number) => Int32Array;
    13: (a: Float32Array, v: number, idx?: number) => number;
    14: (a: Float32Array, v: Vec2, idx?: number) => Float32Array;
    15: (a: Float32Array, v: Vec3, idx?: number) => Float32Array;
    16: (a: Float32Array, v: Vec4, idx?: number) => Float32Array;
    21: (a: Float32Array, v: Mat3, idx?: number) => Float32Array;
    25: (a: Float32Array, v: Mat4, idx?: number) => Float32Array;
};
export declare const type2validator: {
    5: (v: number) => boolean;
    13: (v: number) => boolean;
    6: (v: Vec2) => boolean;
    14: (v: Vec2) => boolean;
    7: (v: Vec3) => boolean;
    15: (v: Vec3) => boolean;
    8: (v: Vec4) => boolean;
    16: (v: Vec4 | Color | Quat) => boolean;
    21: (v: Mat3) => boolean;
    25: (v: Mat4) => boolean;
};
/**
 * @en Gets the default values for the given type of uniform
 * @zh 根据指定的 Uniform 类型来获取默认值
 * @param type The type of the uniform
 */
export declare function getDefaultFromType(type: Type): readonly number[] | string;
export declare function getStringFromType(type: Type): string;
/**
 * @en Combination of preprocess macros
 * @zh 预处理宏组合
 */
export type MacroRecord = Record<string, number | boolean | string>;
/**
 * @en Override the preprocess macros
 * @zh 覆写预处理宏
 * @param target Target preprocess macros to be overridden
 * @param source Preprocess macros used for override
 */
export declare function overrideMacros(target: MacroRecord, source: MacroRecord): boolean;
