/// <reference types="./@types/globals" />
import { IVec3Like } from '../../../../core';
import { Collider } from './collider';
import { ISimplexShape } from '../../../spec/i-physics-shape';
import { ESimplexType } from '../../physics-enum';
/**
 * @en
 * Simplex collider, support point, line, triangle, tetrahedron.
 * @zh
 * 单纯形碰撞器，支持点、线、三角形、四面体。
 */
export declare class SimplexCollider extends Collider {
    static readonly ESimplexType: typeof ESimplexType;
    get shapeType(): ESimplexType;
    set shapeType(v: ESimplexType);
    get vertex0(): IVec3Like;
    set vertex0(v: IVec3Like);
    get vertex1(): IVec3Like;
    set vertex1(v: IVec3Like);
    get vertex2(): IVec3Like;
    set vertex2(v: IVec3Like);
    get vertex3(): IVec3Like;
    set vertex3(v: IVec3Like);
    /**
     * @en
     * Gets the wrapper object, through which the lowLevel instance can be accessed.
     * @zh
     * 获取封装对象，通过此对象可以访问到底层实例。
     */
    get shape(): ISimplexShape;
    get vertices(): IVec3Like[];
    private _shapeType;
    private _vertices;
    constructor();
    updateVertices(): void;
}
export declare namespace SimplexCollider {
    type ESimplexType = EnumAlias<typeof ESimplexType>;
}
