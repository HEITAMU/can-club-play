/// <reference types="./@types/globals" />
import { IGeometry, IGeometryOptions } from './define';
/**
 * @en
 * The definition of the parameter for building a box.
 * @zh
 * 立方体参数选项。
 */
interface IBoxOptions extends RecursivePartial<IGeometryOptions> {
    /**
     * @en
     * Box extent on X-axis.
     * @zh
     * 立方体宽度。
     */
    width?: number;
    /**
     * @en
     * Box extent on Y-axis.
     * @zh
     * 立方体高度。
     */
    height?: number;
    /**
     * @en
     * Box extent on Z-axis.
     * @zh
     * 立方体长度。
     */
    length?: number;
    /**
     * @en
     * Segment count on X-axis.
     * @zh
     * 宽度线段数。
     */
    widthSegments?: number;
    /**
     * @en
     * Segment count on Y-axis.
     * @zh
     * 高度线段数。
     */
    heightSegments?: number;
    /**
     * @en
     * Segment count on Z-axis.
     * @zh
     * 长度线段数。
     */
    lengthSegments?: number;
}
/**
 * @en
 * This function generates a box with specified extents and centered at origin,
 * but may be repositioned through the `center` option.
 * @zh
 * 生成一个立方体，其大小是定义的范围且中心在原点。
 * @param options @zh 参数选项。@en The optional creation parameters of the box
 */
export default function box(options?: IBoxOptions): IGeometry;
export {};
