import { TransformArray } from './transform-array';
export declare class Pose {
    readonly transforms: TransformArray;
    readonly auxiliaryCurves: Float64Array;
    private constructor();
    /**
     * @internal
     */
    _poseTransformSpace: PoseTransformSpace;
    /**
     * @internal
     */
    static _create(transforms: TransformArray, auxiliaryCurves: Float64Array): Pose;
}
export declare enum PoseTransformSpace {
    /**
     * Transforms are stored relative to their parent nodes.
     */
    LOCAL = 0,
    /**
     * Transforms are stored relative to the belonging animation controller's node's space.
     */
    COMPONENT = 1
}
export declare class TransformFilter {
    constructor(involvedTransforms: readonly number[]);
    get involvedTransforms(): Readonly<Uint16Array>;
    /**
     * ANOTHER IDEA: if we partition the indices into intervals,
     * can we achieve a better performance when do transform copy?
     *
     * For example: let every two elements of this array represents
     * an involved transform range: first index and end index.
     * For example, [1, 3, 4, 5, 5, 10] denotes the transform indices:
     * - [1, 3)  i.e indices 1, 2
     * - [4, 5)  i.e indices 4
     * - [5, 10) i.e indices 5, 6, 7, 8, 9
     * Its length always be multiple of 2.
     *
     * Obviously, the actual optimization effect is decided by the sparsity of the indices.
     *
     * ```ts
     * // Partition the ordered array in intervals.
     * let nIntervals = 0;
     * const intervals = new Uint32Array(involvedTransforms.length * 2); // Capacity, not size
     * for (let iBegin = 0; iBegin < involvedTransforms.length;) {
     *      const begin = involvedTransforms[iBegin];
     *      let iEnd = iBegin + 1;
     *      let end = begin + 1;
     *      for (; iEnd < involvedTransforms.length; ++iEnd, ++end) {
     *          if (intervals[iEnd] !== (end + 1)) {
     *              break;
     *          }
     *      }
     *      intervals[2 * nIntervals + 0] = begin;
     *      intervals[2 * nIntervals + 1] = end;
     *      ++nIntervals;
     *  }
     *
     * this._involvedTransformIntervals = intervals.slice(0, nIntervals * 2);
     * ```
     */
    private _involvedTransforms;
}
export declare function blendPoseInto(target: Pose, source: Readonly<Pose>, alpha: number, transformFilter?: TransformFilter | undefined): void;
export declare function blendTransformsInto(target: TransformArray, source: Readonly<TransformArray>, alpha: number, transformFilter?: TransformFilter | undefined): void;
export declare function blendAuxiliaryCurvesInto(target: Float64Array, source: Readonly<Float64Array>, alpha: number): void;
export declare function calculateDeltaPose(target: Pose, base: Pose): void;
export declare function calculateDeltaTransforms(target: TransformArray, base: TransformArray): void;
export declare function calculateDeltaAuxiliaryCurves(target: Float64Array, base: Float64Array): void;
export declare function applyDeltaPose(target: Pose, base: Pose, alpha: number, transformFilter?: TransformFilter | undefined): void;
export declare function applyDeltaTransforms(target: TransformArray, delta: TransformArray, alpha: number, transformFilter?: TransformFilter | undefined): void;
export declare function applyDeltaAuxiliaryCurves(target: Float64Array, delta: Float64Array, alpha: number): void;
