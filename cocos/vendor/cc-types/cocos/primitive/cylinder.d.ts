/// <reference types="./@types/globals" />
import { IGeometry, IGeometryOptions } from './define';
/**
 * @en
 * The definition of the parameter for building a cylinder.
 * @zh
 * 圆柱参数选项。
 */
export interface ICylinderOptions extends IGeometryOptions {
    radialSegments: number;
    heightSegments: number;
    capped: boolean;
    arc: number;
}
/**
 * @en
 * Generate a cylinder with radiusTop radiusBottom 0.5, height 2 and centered at origin,
 * but may be repositioned through the `center` option.
 * @zh
 * 生成一个圆柱。
 * @param radiusTop @en Radius of top plane. @zh 顶部半径。
 * @param radiusBottom @en Radius of bottom plane.  @zh 底部半径。
 * @param height @en The cylinder height.  @zh 圆柱的高
 * @param opts @en The optional creation parameters of the cylinder.  @zh 圆柱参数选项。
 */
export default function cylinder(radiusTop?: number, radiusBottom?: number, height?: number, opts?: RecursivePartial<ICylinderOptions>): IGeometry;
