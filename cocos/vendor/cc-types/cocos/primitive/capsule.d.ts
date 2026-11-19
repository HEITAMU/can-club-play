/// <reference types="./@types/globals" />
import { Vec3 } from '../core';
/**
 * @en
 * The definition of the parameter for building a capsule.
 * @zh
 * 胶囊体参数选项。
 */
export interface ICapsuteOptions {
    sides: number;
    heightSegments: number;
    capped: boolean;
    arc: number;
}
/**
 * Generate a capsule with radiusTop radiusBottom 0.5, height 2, centered at origin,
 * but may be repositioned through the `center` option.
 * @zh
 * 生成一个胶囊体。
 * @param radiusTop @zh 顶部半径。 @en The radius of top sphere
 * @param radiusBottom @zh 底部半径。@en The radius of bottom sphere
 * @param opts @zh 胶囊体参数选项。@en The optional creation parameters of the capsule
 */
export default function capsule(radiusTop?: number, radiusBottom?: number, height?: number, opts?: RecursivePartial<ICapsuteOptions>): {
    positions: number[];
    normals: number[];
    uvs: number[];
    indices: number[];
    minPos: Vec3;
    maxPos: Vec3;
    boundingRadius: number;
};
