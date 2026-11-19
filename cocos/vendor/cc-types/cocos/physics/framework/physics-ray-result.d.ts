import { Vec3, IVec3Like } from '../../core';
import { Collider } from '../../../exports/physics-framework';
/**
 * @en
 * Used to store physics ray test results.
 * @zh
 * 用于保存物理射线检测结果。
 */
export declare class PhysicsRayResult {
    /**
     * @en
     * The hit point，in world space.
     * @zh
     * 在世界坐标系下的击中点。
     */
    get hitPoint(): Vec3;
    /**
     * @en
     * The distance between the ray origin with the hit.
     * @zh
     * 距离。
     */
    get distance(): number;
    /**
     * @en
     * The collider hit by the ray.
     * @zh
     * 击中的碰撞盒
     */
    get collider(): Collider;
    /**
     * @en
     * The normal of the hit plane，in world space.
     * @zh
     * 在世界坐标系下击中面的法线。
     */
    get hitNormal(): Vec3;
    /**
     * @en
     * Represents the fraction (range: 0.0 to 1.0) along the ray's path where the closest collision occurs.
     * A value of 0.0 indicates an immediate collision at the ray's starting point,
     * while a value of 1.0 means no collision along the entire ray length.
     * Intermediate values indicate the fraction of the ray distance at which the closest hit is detected.
     * Warning: only take effect with Bullet.
     * @zh
     * 表示射线路径上最近碰撞发生的位置，以百分比形式（范围：0.0 到 1.0）。
     * 0.0 表示射线在起点处立即发生碰撞，1.0 表示射线在整个路径上未发生碰撞。
     * 中间值表示碰撞点在射线总长度上的比例位置。
     * 注意：只在 Bullet 引擎起效.
     */
    get closestHitFraction(): number;
    protected _hitPoint: Vec3;
    protected _hitNormal: Vec3;
    protected _distance: number;
    protected _collider: Collider | null;
    protected _closestHitFraction: number;
    /**
     * @en
     * internal methods.
     * @zh
     * 设置射线，此方法由引擎内部使用，请勿在外部脚本调用。
     *
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _assign(hitPoint: IVec3Like, distance: number, collider: Collider, hitNormal: IVec3Like, closestHitFraction?: number): void;
    /**
     * @en
     * clone.
     * @zh
     * 克隆。
     */
    clone(): PhysicsRayResult;
}
/**
 * @en
 * Used to store physics line strip cast test results.
 * @zh
 * 用于保存物理逐线段检测结果。
 */
export declare class PhysicsLineStripCastResult extends PhysicsRayResult {
    private _id;
    /**
     * @en
     * The line id of the line segments. This is only for lineStripCast
     * @zh
     * id
     */
    get id(): number;
    /**
     * @en
     * internal methods.
     * @zh
     * 设置射线，此方法由引擎内部使用，请勿在外部脚本调用。
     * @engineInternal
     */
    _assign(hitPoint: IVec3Like, distance: number, collider: Collider, hitNormal: IVec3Like, id?: number): void;
    /**
     * @en
     * clone.
     * @zh
     * 克隆。
     */
    clone(): PhysicsLineStripCastResult;
}
