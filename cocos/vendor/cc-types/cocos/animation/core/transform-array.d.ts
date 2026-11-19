import { Vec3 } from '../../core/math/vec3';
import { Quat } from '../../core/math/quat';
import { Transform } from './transform';
/**
 * Array-buffer-based transform array.
 */
export declare class TransformArray {
    static get BYTES_PER_ELEMENT(): number;
    constructor(length?: number);
    constructor(buffer: ArrayBuffer, byteOffset?: number, length?: number);
    get buffer(): ArrayBufferLike;
    get byteLength(): number;
    get byteOffset(): number;
    get length(): number;
    getTransform(index: number, out: Transform): Transform;
    getPosition(index: number, out: Vec3): Vec3;
    getRotation(index: number, out: Quat): Quat;
    getScale(index: number, out: Vec3): Vec3;
    setTransform(index: number, value: Readonly<Transform>): void;
    setPosition(index: number, value: Readonly<Vec3>): void;
    setRotation(index: number, value: Readonly<Quat>): void;
    setScale(index: number, value: Readonly<Vec3>): void;
    /**
     * Same algorithm as https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/copyWithin
     * except for the the operating objects are transforms.
     */
    copyWithin(target: number, start: number, end?: number): void;
    /**
     * Same algorithm as https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/fill
     * except for the the operating objects are transforms.
     */
    fill(value: Readonly<Transform>, start?: number, end?: number): void;
    /**
     * Same as `this.fill(Transform.ZERO, start, end)`.
     */
    fillZero(start?: number, end?: number): void;
    /**
     * Same algorithm as https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/set
     * except for:
     * - the the operating objects are transforms,
     * - plain array is not allowed.
     */
    set(transformArray: Readonly<TransformArray>, targetOffset?: number): void;
    /**
     * Same algorithm as https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/slice
     * except for the the operating objects are transforms.
     */
    slice(start?: number, end?: number): TransformArray;
    /**
     * Copy a span of `source` into `this`.
     * Equivalent to `this.set(source.slice(sourceOffset, sourceOffset + size), targetOffset)`
     * except without perform the slicing.
     * */
    copyRange(targetOffset: number, source: Readonly<TransformArray>, sourceOffset: number, size: number): void;
    private _data;
}
