import { Vec2 } from '../../../core';
/**
 * Blends given samples using simple directional algorithm.
 * @param weights Result weights of each sample.
 * @param samples Every samples' parameter.
 * @param input Input parameter.
 */
export declare const blendSimpleDirectional: (weights: number[], samples: readonly Vec2[], input: Readonly<Vec2>) => void;
/**
 * Validates the samples if they satisfied the requirements of simple directional algorithm.
 * @param samples Samples to validate.
 * @returns Issues the samples containing.
 */
export declare function validateSimpleDirectionalSamples(samples: ReadonlyArray<Vec2>): SimpleDirectionalSampleIssue[];
export type SimpleDirectionalSampleIssue = SimpleDirectionalIssueSameDirection;
/**
 * Simple directional issue representing some samples have same(or very similar) direction.
 */
export declare class SimpleDirectionalIssueSameDirection {
    samples: readonly number[];
    constructor(samples: readonly number[]);
}
/**
 * Cartesian Gradient Band Interpolation.
 * @param weights
 * @param thresholds
 * @param value
 */
export declare function sampleFreeformCartesian(weights: number[], thresholds: readonly Vec2[], value: Readonly<Vec2>): void;
/**
 * The class tracking the polar space gradient band interpolation.
 * For code readers, throughout the implementation:
 * - Variable names like `V_IJ` denotes a vector pointing from example motion "I" to example motion "J";
 * - Variable names like `V_IX` denotes a vector pointing from example motion "I" to new velocity being queried, which is properly named "X".
 * For detail definitions see section 6.3 in [paper](https://runevision.com/thesis/rune_skovbo_johansen_thesis.pdf) .
 */
export declare class PolarSpaceGradientBandInterpolator2D {
    private static _CACHE_INPUT_DIRECTION;
    private static _CACHE_VIJ;
    private static _CACHE_VIX;
    private static _ANGLE_MULTIPLIER;
    constructor(examples: readonly Readonly<Vec2>[]);
    interpolate(weights: number[], input: Readonly<Vec2>): void;
    private _exampleDirections;
    private _exampleMagnitudes;
    /**
     * n*n Precomputed (\vec{p_i}{p_j}, (|p_i| + |p_j|) / 2).
     */
    private _precomputedVIJs;
    private _cacheVIXAngles;
}
