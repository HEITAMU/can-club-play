import { IGeometry } from './define';
/**
 * @deprecated
 */
export declare function wireframe(indices: number[]): number[];
/**
 * @deprecated
 */
export declare function invWinding(indices: number[]): number[];
/**
 * @deprecated
 */
export declare function toWavefrontOBJ(primitive: IGeometry, scale?: number): string;
/**
 * @deprecated
 */
export declare function normals(positions: number[], nms: number[], length?: number): number[];
