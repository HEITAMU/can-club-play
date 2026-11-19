/// <reference types="./@types/globals" />
import { ICylinderOptions } from './cylinder';
import { IGeometry } from './define';
type IConeOptions = ICylinderOptions;
/**
 * @en
 * Generate a cone with radius 0.5, height 1, centered at origin,
 * but may be repositioned through the `center` option.
 * @zh
 * 生成一个圆锥。
 * @param radius @zh 圆锥半径。 @en The radius of cone
 * @param height @zh 圆锥高度。 @en The height of cone
 * @param opts @zh 圆锥参数选项。@en The optional creation parameters of the cone
 */
export default function cone(radius?: number, height?: number, opts?: RecursivePartial<IConeOptions>): IGeometry;
export {};
