import { IVec3Like, RecyclePool, geometry, IQuatLike } from '../../core';
import { PhysicsRayResult } from '../framework/physics-ray-result';
import { EPhysicsDrawFlags, PhysicsMaterial } from '../framework';
export interface IRaycastOptions {
    mask: number;
    group: number;
    queryTrigger: boolean;
    maxDistance: number;
}
export interface IPhysicsWorld {
    readonly impl: any;
    debugDrawFlags: EPhysicsDrawFlags;
    debugDrawConstraintSize: number;
    setGravity: (v: IVec3Like) => void;
    setAllowSleep: (v: boolean) => void;
    setDefaultMaterial: (v: PhysicsMaterial) => void;
    step(fixedTimeStep: number, timeSinceLastCalled?: number, maxSubSteps?: number): void;
    raycast(worldRay: geometry.Ray, options: IRaycastOptions, pool: RecyclePool<PhysicsRayResult>, results: PhysicsRayResult[]): boolean;
    raycastClosest(worldRay: geometry.Ray, options: IRaycastOptions, out: PhysicsRayResult): boolean;
    sweepBox(worldRay: geometry.Ray, halfExtent: IVec3Like, orientation: IQuatLike, options: IRaycastOptions, pool: RecyclePool<PhysicsRayResult>, results: PhysicsRayResult[]): boolean;
    sweepBoxClosest(worldRay: geometry.Ray, halfExtent: IVec3Like, orientation: IQuatLike, options: IRaycastOptions, result: PhysicsRayResult): boolean;
    sweepSphere(worldRay: geometry.Ray, radius: number, options: IRaycastOptions, pool: RecyclePool<PhysicsRayResult>, results: PhysicsRayResult[]): boolean;
    sweepSphereClosest(worldRay: geometry.Ray, radius: number, options: IRaycastOptions, result: PhysicsRayResult): boolean;
    sweepCapsule(worldRay: geometry.Ray, radius: number, height: number, orientation: IQuatLike, options: IRaycastOptions, pool: RecyclePool<PhysicsRayResult>, results: PhysicsRayResult[]): boolean;
    sweepCapsuleClosest(worldRay: geometry.Ray, radius: number, height: number, orientation: IQuatLike, options: IRaycastOptions, result: PhysicsRayResult): boolean;
    emitEvents(): void;
    syncSceneToPhysics(): void;
    syncAfterEvents(): void;
    destroy(): void;
}
