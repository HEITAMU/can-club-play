import { IGeometry } from './define';
/**
 * @en
 * Translate the geometry.
 * @zh
 * 平移几何体。
 * @param geometry @zh 几何体信息。@en The geometry to be translated
 * @param offset @zh 偏移量。@en The translation
 */
export declare function translate(geometry: IGeometry, offset: {
    x?: number;
    y?: number;
    z?: number;
}): IGeometry;
/**
 * @en
 * Scale the geometry.
 * @zh
 * 缩放几何体。
 * @param geometry @zh 几何体信息。 @en The geometry to be scaled
 * @param value @zh 缩放量。@en The scaling size
 */
export declare function scale(geometry: IGeometry, value: {
    x?: number;
    y?: number;
    z?: number;
}): IGeometry;
/**
 * @en
 * Converts geometry to wireframe mode. Only geometry with triangle topology is supported.
 * @zh
 * 将几何体转换为线框模式，仅支持三角形拓扑的几何体。
 * @param geometry @zh 几何体信息。@en The geometry to be converted to wireframe
 */
export declare function wireframed(geometry: IGeometry): IGeometry;
