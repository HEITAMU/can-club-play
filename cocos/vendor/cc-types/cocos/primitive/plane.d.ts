/// <reference types="./@types/globals" />
import { IGeometry, IGeometryOptions } from './define';
/**
 * @en
 * The definition of the parameter for building a plane.
 * @zh
 * 平面参数选项。
 */
interface IPlaneOptions extends RecursivePartial<IGeometryOptions> {
    /**
     * Plane extent on X-axis.
     */
    width: number;
    /**
     * Plane extent on Z-axis.
     */
    length: number;
    /**
     * Segment count on X-axis.
     */
    widthSegments: number;
    /**
     * Segment count on Z-axis.
     */
    lengthSegments: number;
}
/**
 * @en
 * This function generates a plane on XOZ plane with positive Y direction.
 * @zh
 * 生成一个平面，其位于XOZ平面，方向为Y轴正方向。
 * @param options @zh 平面参数选项。@en The optional creation parameters of the plane
 */
export default function plane(options?: IPlaneOptions): IGeometry;
export {};
