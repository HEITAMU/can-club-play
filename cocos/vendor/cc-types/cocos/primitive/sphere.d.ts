/// <reference types="./@types/globals" />
import { IGeometry, IGeometryOptions } from './define';
/**
 * @zh
 * 球参数选项。
 * @en
 * The options of sphere
 */
interface ISphereOptions extends IGeometryOptions {
    segments: number;
}
/**
 * @en
 * Generate a shpere with radius 0.5.
 * @zh
 * 生成一个球。
 * @param radius @en The radius. @zh 球半径。
 * @param options @en The sphere creation options. @zh 参数选项。
 */
export default function sphere(radius?: number, opts?: RecursivePartial<ISphereOptions>): IGeometry;
export {};
