/// <reference types="./@types/globals" />
import { IBaseConstraint, IPointToPointConstraint, IHingeConstraint, IFixedConstraint, IConfigurableConstraint } from '../spec/i-physics-constraint';
import { IBoxShape, ISphereShape, ICapsuleShape, ITrimeshShape, ICylinderShape, IConeShape, ITerrainShape, ISimplexShape, IPlaneShape, IBaseShape } from '../spec/i-physics-shape';
import { IPhysicsWorld } from '../spec/i-physics-world';
import { IRigidBody } from '../spec/i-rigid-body';
import { IBoxCharacterController, ICapsuleCharacterController } from '../spec/i-character-controller';
import { IVec3Like } from '../../core';
import { EColliderType, EConstraintType, ECharacterControllerType } from './physics-enum';
import { PhysicsMaterial } from '.';
export type IPhysicsEngineId = 'builtin' | 'cannon.js' | 'bullet' | 'physx' | string;
interface IPhysicsWrapperObject {
    PhysicsWorld?: Constructor<IPhysicsWorld>;
    RigidBody?: Constructor<IRigidBody>;
    BoxCharacterController?: Constructor<IBoxCharacterController>;
    CapsuleCharacterController?: Constructor<ICapsuleCharacterController>;
    BoxShape?: Constructor<IBoxShape>;
    SphereShape?: Constructor<ISphereShape>;
    CapsuleShape?: Constructor<ICapsuleShape>;
    TrimeshShape?: Constructor<ITrimeshShape>;
    CylinderShape?: Constructor<ICylinderShape>;
    ConeShape?: Constructor<IConeShape>;
    TerrainShape?: Constructor<ITerrainShape>;
    SimplexShape?: Constructor<ISimplexShape>;
    PlaneShape?: Constructor<IPlaneShape>;
    PointToPointConstraint?: Constructor<IPointToPointConstraint>;
    HingeConstraint?: Constructor<IHingeConstraint>;
    FixedConstraint?: Constructor<IFixedConstraint>;
    ConfigurableConstraint?: Constructor<IConfigurableConstraint>;
}
interface IPhysicsBackend {
    [key: string]: IPhysicsWrapperObject;
}
export interface IPhysicsSelector {
    /**
     * @en
     * The id of the physics engine being used by the physics system.
     * @zh
     * 物理系统正在使用的物理引擎的唯一标志。
     */
    readonly id: IPhysicsEngineId;
    /**
     * @en
     * The wrapper of the physics engine being used by the physics system.
     * @zh
     * 物理系统使用的物理引擎的封装层。
     */
    readonly wrapper: IPhysicsWrapperObject;
    /**
     * @en
     * All physics engine backends that the physics module has registered.
     * @zh
     * 物理模块已注册的所有物理引擎后端。
     */
    readonly backend: IPhysicsBackend;
    /**
     * @en
     * An instance of the physical world through which you can access the lowlevel objects.
     * @zh
     * 物理世界实例，通过它可以访问到底层对象。
     */
    readonly physicsWorld: IPhysicsWorld | null;
    /**
     * @en
     * To register the backend, the system will use the last backend registered before initialization,
     * and the registration after that needs to be switched manually.
     * @zh
     * 注册后端，系统将使用在初始化前注册的最后一个后端，此后注册的需要手动切换。
     */
    register: (id: IPhysicsEngineId, wrapper: IPhysicsWrapperObject) => void;
    /**
     * @en
     * Switch to the physics backend corresponding to the id in the registry.
     * @zh
     * 切换为注册表里对应 id 的物理后端。
     */
    switchTo: (id: IPhysicsEngineId) => void;
    [x: string]: any;
}
export interface IWorldInitData {
    gravity: IVec3Like;
    allowSleep: boolean;
    defaultMaterial: PhysicsMaterial;
}
/**
 * @en
 * The physics selector is used to register and switch the physics engine backend.
 * @zh
 * 物理选择器用于注册和切换物理引擎后端。
 */
export declare const selector: IPhysicsSelector;
export declare function constructDefaultWorld(data: IWorldInitData): void;
export declare function createPhysicsWorld(): IPhysicsWorld;
export declare function createRigidBody(): IRigidBody;
export declare function createShape(type: EColliderType): IBaseShape;
export declare function createConstraint(type: EConstraintType): IBaseConstraint;
interface IEntireCharacterController extends IBoxCharacterController, ICapsuleCharacterController {
}
export declare function createCharacterController(type: ECharacterControllerType): IEntireCharacterController;
export {};
