import { Vertex, Tetrahedron } from './delaunay';
import { LightProbeInfo } from '../../scene-graph/scene-globals';
import { Vec3, Vec4 } from '../../core';
export declare class LightProbesData {
    get probes(): Vertex[];
    get tetrahedrons(): Tetrahedron[];
    empty(): boolean;
    reset(): void;
    updateProbes(points: Vec3[]): void;
    updateTetrahedrons(): void;
    getInterpolationSHCoefficients(tetIndex: number, weights: Vec4, coefficients: Vec3[]): boolean;
    getInterpolationWeights(position: Vec3, tetIndex: number, weights: Vec4): number;
    hasCoefficients(): boolean;
    private static getTriangleBarycentricCoord;
    private getBarycentricCoord;
    private getTetrahedronBarycentricCoord;
    private getOuterCellBarycentricCoord;
    private _probes;
    private _tetrahedrons;
}
/**
 * @en light probe data
 * @zh 光照探针数据
 */
export declare class LightProbes {
    /**
     * @en GI multiplier
     * @zh GI乘数
     */
    set giScale(val: number);
    get giScale(): number;
    /**
      * @en GI sample counts
      * @zh GI 采样数量
      */
    set giSamples(val: number);
    get giSamples(): number;
    /**
      * @en light bounces
      * @zh 光照反弹次数
      */
    set bounces(val: number);
    get bounces(): number;
    /**
     * @en Reduce ringing of light probe
     * @zh 减少光照探针的振铃效果
     */
    set reduceRinging(val: number);
    get reduceRinging(): number;
    /**
     * @en Whether to show light probe
     * @zh 是否显示光照探针
     */
    set showProbe(val: boolean);
    get showProbe(): boolean;
    /**
     * @en Whether to show light probe's connection
     * @zh 是否显示光照探针连线
     */
    set showWireframe(val: boolean);
    get showWireframe(): boolean;
    /**
     * @en Whether to show light probe's convex
     * @zh 是否显示光照探针凸包
     */
    set showConvex(val: boolean);
    get showConvex(): boolean;
    /**
     * @en light probe's vertex and tetrahedron data
     * @zh 光照探针顶点及四面体数据
     */
    set data(val: LightProbesData | null);
    get data(): LightProbesData | null;
    /**
     * @en The value of all light probe sphere display size
     * @zh 光照探针全局显示大小
     */
    set lightProbeSphereVolume(val: number);
    get lightProbeSphereVolume(): number;
    protected _giScale: number;
    protected _giSamples: number;
    protected _bounces: number;
    protected _reduceRinging: number;
    protected _showProbe: boolean;
    protected _showWireframe: boolean;
    protected _showConvex: boolean;
    protected _data: LightProbesData | null;
    protected _lightProbeSphereVolume: number;
    initialize(info: LightProbeInfo): void;
    empty(): boolean;
}
