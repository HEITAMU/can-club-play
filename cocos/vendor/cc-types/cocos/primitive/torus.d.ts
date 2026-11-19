/// <reference types="./@types/globals" />
import { Vec3 } from '../core';
import { IGeometryOptions } from './define';
/**
 * @zh
 * 环面参数选项。
 * @en
 * The options about torus
 */
interface ITorusOptions extends IGeometryOptions {
    radialSegments: number;
    tubularSegments: number;
    arc: number;
}
/**
 * @en
 * Generate a torus with radius 0.4, tube 0.1 and centered at origin.
 * @zh
 * 生成一个环面。
 * @param radius @zh 环面半径。@en The radius fo torus
 * @param tube @zh 管形大小。@en The radius of tube
 * @param opts @zh 参数选项。@en The optional creation parameters of the torus
 */
export default function torus(radius?: number, tube?: number, opts?: RecursivePartial<ITorusOptions>): {
    positions: number[];
    normals: number[];
    uvs: number[];
    indices: number[];
    minPos: Vec3;
    maxPos: Vec3;
    boundingRadius: number;
};
export {};
