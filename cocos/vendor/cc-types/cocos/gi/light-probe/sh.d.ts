import { Vec3 } from '../../core';
export declare class LightProbeSampler {
    /**
     *  generate one sample from sphere uniformly
     */
    static uniformSampleSphere(u1: number, u2: number): Vec3;
    /**
     *  generate ucount1 * ucount2 samples from sphere uniformly
     */
    static uniformSampleSphereAll(sampleCount: number): Vec3[];
    /**
     *  probability density function of uniform distribution on spherical surface
     */
    static uniformSpherePdf(): number;
}
/**
 * Spherical Harmonics utility class
 */
export declare class SH {
    private static LMAX;
    private static basisFunctions;
    private static basisOverPI;
    /**
     * update ubo data by coefficients
     */
    static updateUBOData(data: Float32Array, offset: number, coefficients: Vec3[]): void;
    /**
     * recreate a function from sh coefficients, which is same as SHEvaluate in shader
     */
    static shaderEvaluate(normal: Vec3, coefficients: Vec3[]): Vec3;
    /**
     * recreate a function from sh coefficients
     */
    static evaluate(sample: Vec3, coefficients: Vec3[]): Vec3;
    /**
     * project a function to sh coefficients
     */
    static project(samples: Vec3[], values: Vec3[]): Vec3[];
    /**
     * calculate irradiance's sh coefficients from radiance's sh coefficients directly
     */
    static convolveCosine(radianceCoefficients: Vec3[]): Vec3[];
    /**
     * return basis function count
     */
    static getBasisCount(): number;
    /**
     * evaluate from a basis function
     */
    static evaluateBasis(index: number, sample: Vec3): number;
    static reduceRinging(coefficients: Vec3[], lambda: number): void;
    private static lambda;
    private static toIndex;
}
