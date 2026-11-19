import { Vec3 } from '../math';
import { AABB } from './aabb';
import { OBB } from './obb';
import { Plane } from './plane';
/**
 * @en
 * Calculates the distance between a point and a plane.
 * @zh
 * 计算点和平面之间的距离。
 * @param point @en The target point. @zh 目标点。
 * @param plane @en The target plane. @zh 目标平面。
 * @returns @en The distance between the point and the plane. @zh 点和平面之间的距离。
 */
export declare function point_plane(point: Vec3, plane_: Plane): number;
/**
 * @en
 * Calculates the closest point on a plane to a given point.
 * @zh
 * 计算平面上最接近给定点的点。
 * @param out @en The closest point. @zh 最近点。
 * @param point @en The given point. @zh 给定点。
 * @param plane @en The target plane. @zh 平面。
 * @returns @en The result of the closest point, same as the `out` parameter. @zh 存储最近点的向量，与 `out` 参数为同一个对象。
 */
export declare function pt_point_plane(out: Vec3, point: Vec3, plane_: Plane): Vec3;
/**
 * @en
 * Calculates the closest point on an AABB to a given point.
 * @zh
 * 计算 AABB 上最接近给定点的点。
 * @param out @en The closest point. @zh 最近点。
 * @param point @en The given point @zh 给定点。
 * @param aabb @en The target AABB to calculate. @zh 参与计算的 AABB 实例。
 * @returns @en The result of the closest point, same as the `out` parameter. @zh 存储最近点的向量，与 `out` 参数为同一个对象。
 */
export declare function pt_point_aabb(out: Vec3, point: Vec3, aabb_: AABB): Vec3;
/**
 * @en
 * Calculates the closest point on an OBB to a given point.
 * @zh
 * 计算 OBB 上最接近给定点的点。
 * @param out @en The closest point. @zh 最近点。
 * @param point @en The given point. @zh 给定点。
 * @param obb @en The target OBB to calculate. @zh 参与计算的 OBB 实例。
 * @returns @en The result of the closest point, same as the `out` parameter. @zh 存储最近点的向量，与 `out` 参数为同一个对象。
 */
export declare function pt_point_obb(out: Vec3, point: Vec3, obb_: OBB): Vec3;
/**
 * @en
 * Calculates the closest point on the line, which is from A to B, to the given point.
 * @zh
 * 计算给定点距离线段 AB 上最近的一点。
 * @param out @en The closest point. @zh 最近点。
 * @param point @en The given point. @zh 给定点
 * @param linePointA @en Point A on the line. @zh 线上的某点 A。
 * @param linePointB @en Point B on the line. @zh 线上的某点 B。
 */
export declare function pt_point_line(out: Vec3, point: Vec3, linePointA: Vec3, linePointB: Vec3): void;
