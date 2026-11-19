import { Vec3 } from '../../core/math/vec3';
import { Quat } from '../../core/math/quat';
import { Mat4 } from '../../core';
type ReadonlyTransform = Transform;
export declare class Transform {
    static IDENTITY: Readonly<Transform>;
    static ZERO: Readonly<Transform>;
    get position(): Readonly<Vec3>;
    set position(value: Readonly<Vec3>);
    get rotation(): Readonly<Quat>;
    set rotation(value: Readonly<Quat>);
    get scale(): Readonly<Vec3>;
    set scale(value: Readonly<Vec3>);
    static clone(src: ReadonlyTransform): Transform;
    static setIdentity(out: Transform): Transform;
    static copy(out: Transform, src: ReadonlyTransform): Transform;
    static equals(a: ReadonlyTransform, b: ReadonlyTransform, epsilon?: number): boolean;
    static strictEquals(a: ReadonlyTransform, b: ReadonlyTransform): boolean;
    static lerp(out: Transform, from: ReadonlyTransform, to: ReadonlyTransform, t: number): Transform;
    /**
     * Associate two transforms.
     * The result is as if the `first` transform is applied and then the `second` transform.
     * @param out The result transform.
     * @param first The first transform to apply.
     * @param second The second transform to apply.
     * @returns `out`.
     * @note
     * Much important things to note is that
     * currently the following prerequisites are imposed on scales of both transforms:
     * - The scale should be uniformed, ie. all components should be the same.
     * - Each component of the scale shall be non-negative.
     */
    static multiply(out: Transform, second: ReadonlyTransform, first: ReadonlyTransform): Transform;
    /**
     * Calculates the relative transitions.
     * The result is as if `first` transform is associated by applying the result first then the `second`.
     * @param out The result transform.
     * @param first See description.
     * @param second See description.
     * @returns `out`.
     * @note
     *
     * Note: if scale of second transform contains 0,
     * the result scale's corresponding component would be error.
     *
     * Same restriction is applied to this method like `Transform.multiply`.
     */
    static calculateRelative: (out: Transform, first: ReadonlyTransform, second: ReadonlyTransform) => Transform;
    /**
     * Inverts the transform.
     * @param out Out transform.
     * @param transform Transform to invert.
     */
    static invert(out: Transform, transform: ReadonlyTransform): Transform;
    static fromMatrix(out: Transform, matrix: Readonly<Mat4>): Transform;
    static toMatrix(out: Mat4, transform: ReadonlyTransform): Mat4;
    private readonly _position;
    private readonly _rotation;
    private readonly _scale;
}
export declare function __calculateDeltaTransform(out: Transform, target: Readonly<Transform>, base: Readonly<Transform>): Transform;
export declare const __applyDeltaTransform: (out: Transform, base: Readonly<Transform>, delta: Readonly<Transform>, alpha: number) => Transform;
export declare const ZERO_DELTA_TRANSFORM: Readonly<Transform>;
export {};
