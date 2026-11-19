import { ILifecycle } from './i-lifecycle';
import { IGroupMask } from './i-group-mask';
import { IVec3Like, geometry } from '../../core';
import { Collider, RigidBody, PhysicsMaterial, SimplexCollider } from '../../../exports/physics-framework';
import { Mesh } from '../../3d/assets';
import { ITerrainAsset } from './i-external';
export interface IBaseShape extends ILifecycle, IGroupMask {
    readonly impl: any;
    readonly collider: Collider;
    readonly attachedRigidBody: RigidBody | null;
    initialize(v: Collider): void;
    setMaterial: (v: PhysicsMaterial | null) => void;
    setAsTrigger: (v: boolean) => void;
    setCenter: (v: IVec3Like) => void;
    getAABB: (v: geometry.AABB) => void;
    getBoundingSphere: (v: geometry.Sphere) => void;
    updateEventListener: () => void;
}
export interface IBoxShape extends IBaseShape {
    updateSize: () => void;
}
export interface ISphereShape extends IBaseShape {
    updateRadius: () => void;
}
export interface ICapsuleShape extends IBaseShape {
    setRadius: (v: number) => void;
    setCylinderHeight: (v: number) => void;
    setDirection: (v: number) => void;
}
export interface ICylinderShape extends IBaseShape {
    setRadius: (v: number) => void;
    setHeight: (v: number) => void;
    setDirection: (v: number) => void;
}
export interface ISimplexShape extends IBaseShape {
    setShapeType: (v: SimplexCollider.ESimplexType) => void;
    setVertices: (v: IVec3Like[]) => void;
}
export interface IConeShape extends IBaseShape {
    setRadius: (v: number) => void;
    setHeight: (v: number) => void;
    setDirection: (v: number) => void;
}
export interface ITrimeshShape extends IBaseShape {
    setMesh: (v: Mesh | null) => void;
}
export interface ITerrainShape extends IBaseShape {
    setTerrain: (v: ITerrainAsset | null) => void;
}
export interface IConeShape extends IBaseShape {
    setRadius: (v: number) => void;
    setHeight: (v: number) => void;
    setDirection: (v: number) => void;
}
export interface IPlaneShape extends IBaseShape {
    setNormal: (v: IVec3Like) => void;
    setConstant: (v: number) => void;
}
