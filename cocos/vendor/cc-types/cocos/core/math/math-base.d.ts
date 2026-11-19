import { ValueType } from '../value-types/value-type';
import { FloatArray } from './type-define';
export declare const MATH_FLOAT_ARRAY: Float32ArrayConstructor | Float64ArrayConstructor;
export declare class MathBase extends ValueType {
    static createFloatArray(size: number): Float64Array | Float32Array;
    /**
     * @en Get the internal array data.
     * @zh 获取内部 array 数据。
     */
    get array(): FloatArray;
    protected _array: FloatArray;
}
