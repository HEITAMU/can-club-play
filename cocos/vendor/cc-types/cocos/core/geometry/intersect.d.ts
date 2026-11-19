import { Vec3 } from '../math';
import { AABB } from './aabb';
import { Capsule } from './capsule';
import { Frustum } from './frustum';
import { Line } from './line';
import { OBB } from './obb';
import { Plane } from './plane';
import { Ray } from './ray';
import { Sphere } from './sphere';
import { Triangle } from './triangle';
import type { RenderingSubMesh } from '../../asset/assets';
import type { IRaySubMeshOptions, IRayModelOptions, IRayMeshOptions } from './spec';
import type { Model } from '../../render-scene/scene';
import type { Mesh } from '../../3d';
/**
 * @en
 * line-aabb intersect detect.
 * @zh
 * 线段与轴对齐包围盒的相交性检测
 * @param line @zh 线段 @en The line to test
 * @param aabb @zh 轴对齐包围盒 @en The aabb to test
 * @returns @zh 如果没有相交，返回 0 ，否则返回非 0。 @en zero if no intersection, otherwise returns a non-zero value.no intersection
 */
declare function lineAABB(line: Line, aabb: AABB): number;
/**
 * @en
 * line-obb intersect detect.
 * @zh
 * 线段与OBB的相交性检测。
 * @param line @zh 线段 @en The line to test.
 * @param obb @zh OBB @en The OBB to test.
 * @returns @zh 如果没有相交，返回 0 ，否则返回非 0。 @en zero if no intersection, otherwise returns a non-zero value.no intersection
 */
declare function lineOBB(line: Line, obb: OBB): number;
/**
 * @en
 * line-sphere intersect detect.
 * @zh
 * 线段与球的相交性检测
 * @param line @zh 线段 @en The line to test
 * @param sphere @zh 球 @en The sphere to test
 * @returns @zh 如果没有相交，返回 0 ，否则返回非 0。 @en zero if no intersection, otherwise returns a non-zero value.no intersection
 */
declare function lineSphere(line: Line, sphere: Sphere): number;
/**
 * @en
 * Algorithm of intersect detect for basic geometry.
 * @zh
 * 基础几何的相交性检测算法。
 */
declare const intersect: {
    raySphere: (ray: Ray, sphere: Sphere) => number;
    rayAABB: (ray: Ray, aabb: AABB) => number;
    rayOBB: (ray: Ray, obb: OBB) => number;
    rayPlane: (ray: Ray, plane: Plane) => number;
    rayTriangle: (ray: Ray, triangle: Triangle, doubleSided?: boolean) => number;
    rayCapsule: (ray: Ray, capsule: Capsule) => number;
    raySubMesh: (ray: Ray, submesh: RenderingSubMesh, options?: IRaySubMeshOptions) => number;
    rayMesh: (ray: Ray, mesh: Mesh, options?: IRayMeshOptions) => number;
    rayModel: (r: Ray, model: Model, options?: IRayModelOptions) => number;
    lineSphere: typeof lineSphere;
    lineAABB: typeof lineAABB;
    lineOBB: typeof lineOBB;
    linePlane: (line: Line, plane: Plane) => number;
    lineTriangle: (line: Line, triangle: Triangle, outPt?: Vec3) => number;
    sphereWithSphere: (sphere0: Sphere, sphere1: Sphere) => boolean;
    sphereAABB: (sphere: Sphere, aabb: AABB) => boolean;
    sphereOBB: (sphere: Sphere, obb: OBB) => boolean;
    spherePlane: (sphere: Sphere, plane: Plane) => number;
    sphereFrustum: (sphere: Sphere, frustum: Frustum) => number;
    sphereFrustumAccurate: (sphere: Sphere, frustum: Frustum) => number;
    sphereCapsule: (sphere: Sphere, capsule: Capsule) => boolean;
    aabbWithAABB: (aabb1: AABB, aabb2: AABB) => boolean;
    aabbWithOBB: (aabb: AABB, obb: OBB) => number;
    aabbPlane: (aabb: AABB, plane: Plane) => number;
    aabbFrustum: (aabb: AABB, frustum: Readonly<Frustum>) => number;
    aabbFrustumAccurate: (aabb: AABB, frustum: Frustum) => number;
    obbWithOBB: (obb1: OBB, obb2: OBB) => number;
    obbPlane: (obb: OBB, plane: Plane) => number;
    obbFrustum: (obb: OBB, frustum: Frustum) => number;
    obbFrustumAccurate: (obb: OBB, frustum: Frustum) => number;
    obbPoint: (obb: OBB, point: Vec3) => boolean;
    obbCapsule: (obb: OBB, capsule: Capsule) => boolean | 1 | 0;
    aabbFrustumCompletelyInside: (aabb: AABB, frustum: Readonly<Frustum>) => number;
    capsuleWithCapsule: (capsuleA: Capsule, capsuleB: Capsule) => boolean;
    /**
     * @en Check intersection between two geometries, it accept all basic geometry types in [[geometry]] module.
     * @zh 两个几何体的相交性检测，可填入 [[geometry]] 模块中的基础几何形状。
     * @param g1 @en The first geometry. @zh 第一个几何体。
     * @param g2 @en The second geometry. @zh 第二个几何体。
     * @param outPt @en A 3d point to store the intersection point result, only part of the geometries support this.
     *              @zh 可选，用于保存相交点的输出对象。（注：仅部分形状的检测带有这个返回值）
     */
    resolve(g1: any, g2: any, outPt?: null): number;
};
export default intersect;
