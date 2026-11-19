/// <reference types="./@types/globals" />
import { IGeometry, IGeometryOptions } from './define';
/**
 * @en
 * The definition of the parameter for building a circle.
 * @zh
 * 圆形参数选项。
 */
interface ICircleOptions extends IGeometryOptions {
    segments: number;
}
/**
 * @en
 * Generate a circle with radius 1, centered at origin,
 * but may be repositioned through the `center` option.
 * @zh
 * 生成一个圆，其半径是单位1，中心点在原点。
 * @param options @zh 参数选项。 @en The optional creation parameters of the circle
 */
export default function circle(options?: RecursivePartial<ICircleOptions> | ICircleOptions): IGeometry;
export {};
