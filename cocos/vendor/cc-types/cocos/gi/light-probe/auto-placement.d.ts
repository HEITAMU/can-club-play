import { Vec3 } from '../../core';
export declare const PlaceMethod: {
    UNIFORM: number;
    ADAPTIVE: number;
};
export interface PlacementInfo {
    method: number;
    nProbesX: number;
    nProbesY: number;
    nProbesZ: number;
    minPos: Vec3;
    maxPos: Vec3;
}
export declare class AutoPlacement {
    static generate(info: PlacementInfo): Vec3[];
    private static doGenerateUniform;
    private static doGenerateAdaptive;
}
