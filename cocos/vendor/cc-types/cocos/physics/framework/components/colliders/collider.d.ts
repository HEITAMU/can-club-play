/// <reference types="./@types/globals" />
import { Vec3, geometry } from '../../../../core';
import { CharacterTriggerEventType, CollisionEventType, TriggerEventType } from '../../physics-interface';
import { RigidBody } from '../rigid-body';
import { PhysicsMaterial } from '../../assets/physics-material';
import { Component } from '../../../../scene-graph';
import { IBaseShape } from '../../../spec/i-physics-shape';
import { EColliderType, EAxisDirection } from '../../physics-enum';
type Callback = (...args: any[]) => any;
declare const Collider_base: new (...args: any[]) => Component & import("../../../../core/event/eventify").IEventified;
/**
 * @en
 * Base class for colliders.
 * @zh
 * 碰撞器的基类。
 */
export declare class Collider extends Collider_base {
    /**
     * @en
     * Enumeration of collider types.
     * @zh
     * 碰撞体类型的枚举。
     */
    static readonly Type: typeof EColliderType;
    /**
     * @en
     * Enumeration of axes.
     * @zh
     * 坐标轴方向的枚举。
     */
    static readonly Axis: typeof EAxisDirection;
    /**
     * @en
     * Get the rigid body component to which the collider is bound, possibly null.
     * @zh
     * 获取碰撞器所绑定的刚体组件，可能为空。
     */
    get attachedRigidBody(): RigidBody | null;
    /**
     * @en
     * Gets or sets the physical material for this collider.
     * @zh
     * 获取或设置此碰撞器的物理材质。
     */
    get sharedMaterial(): PhysicsMaterial | null;
    set sharedMaterial(value: PhysicsMaterial | null);
    /**
     * @en
     * Gets or sets the physics material for this collider, which in Shared state will generate a new instance.
     * @zh
     * 获取或设置此碰撞器的物理材质，共享状态下获取将会生成新的实例。
     */
    get material(): PhysicsMaterial | null;
    set material(value: PhysicsMaterial | null);
    /**
     * @en
     * Gets or sets the collider is trigger, this will be always trigger if using builtin.
     * @zh
     * 获取或设置碰撞器是否为触发器。(builtin 中无论真假都为触发器)
     */
    get isTrigger(): boolean;
    set isTrigger(value: boolean);
    /**
     * @en
     * Gets or sets the center of the collider, in local space.
     * @zh
     * 在本地空间中，获取或设置碰撞器的中心点。
     */
    get center(): Vec3;
    set center(value: Vec3);
    /**
     * @en
     * Gets the wrapper object, through which the lowLevel instance can be accessed.
     * @zh
     * 获取封装对象，通过此对象可以访问到底层实例。
     */
    get shape(): IBaseShape | null;
    get worldBounds(): Readonly<geometry.AABB>;
    get boundingSphere(): Readonly<geometry.Sphere>;
    get needTriggerEvent(): boolean;
    get needCollisionEvent(): boolean;
    readonly type: EColliderType;
    protected _shape: IBaseShape | null;
    protected _aabb: geometry.AABB | null;
    protected _boundingSphere: geometry.Sphere | null;
    protected _isSharedMaterial: boolean;
    protected _needTriggerEvent: boolean;
    protected _needCollisionEvent: boolean;
    protected _material: PhysicsMaterial | null;
    protected _isTrigger: boolean;
    protected readonly _center: Vec3;
    protected get _isInitialized(): boolean;
    constructor(type: EColliderType);
    /**
     * @en
     * Registers callbacks associated with triggered or collision events.
     * @zh
     * 注册触发或碰撞事件相关的回调。
     * @param type - The event type, onTriggerEnter|onTriggerStay|onTriggerExit|onCollisionEnter|onCollisionStay|onCollisionExit;
     * @param callback - The event callback, signature:`(event?:ICollisionEvent|ITriggerEvent)=>void`.
     * @param target - The event callback target.
     */
    on<TFunction extends Callback>(type: TriggerEventType | CollisionEventType | CharacterTriggerEventType, callback: TFunction, target?: any, once?: boolean): any;
    /**
     * @en
     * Unregisters callbacks associated with trigger or collision events that have been registered.
     * @zh
     * 取消已经注册的触发或碰撞事件相关的回调。
     * @param type - The event type, onTriggerEnter|onTriggerStay|onTriggerExit|onCollisionEnter|onCollisionStay|onCollisionExit;
     * @param callback - The event callback, signature:`(event?:ICollisionEvent|ITriggerEvent)=>void`.
     * @param target - The event callback target.
     */
    off(type: TriggerEventType | CollisionEventType | CharacterTriggerEventType, callback?: Callback, target?: any): void;
    /**
     * @en
     * Registers a callback associated with a trigger or collision event, which is automatically unregistered once executed.
     * @zh
     * 注册触发或碰撞事件相关的回调，执行一次后会自动取消注册。
     * @param type - The event type, onTriggerEnter|onTriggerStay|onTriggerExit|onCollisionEnter|onCollisionStay|onCollisionExit;
     * @param callback - The event callback, signature:`(event?:ICollisionEvent|ITriggerEvent)=>void`.
     * @param target - The event callback target.
     */
    once<TFunction extends Callback>(type: TriggerEventType | CollisionEventType | CharacterTriggerEventType, callback: TFunction, target?: any): any;
    /**
     * @en
     * Removes all registered events of the specified target or type.
     * @zh
     * 移除所有指定目标或类型的注册事件。
     * @param typeOrTarget - The event type or target.
     */
    removeAll(typeOrTarget: TriggerEventType | CollisionEventType | Record<string, unknown>): void;
    /**
     * @en
     * Gets the group value.
     * @zh
     * 获取分组值。
     * @returns @zh 分组值，为 32 位整数，范围为 [2^0, 2^31] @en Group value which is a 32-bits integer, the range is [2^0, 2^31]
     */
    getGroup(): number;
    /**
     * @en
     * Sets the group value.
     * @zh
     * 设置分组值。
     * @param v @zh 分组值，为 32 位整数，范围为 [2^0, 2^31] @en Group value which is a 32-bits integer, the range is [2^0, 2^31]
     */
    setGroup(v: number): void;
    /**
     * @en
     * Add a grouping value to fill in the group you want to join.
     * @zh
     * 添加分组值，可填要加入的 group。
     * @param v @zh 分组值，为 32 位整数，范围为 [2^0, 2^31] @en Group value which is a 32-bits integer, the range is [2^0, 2^31]
     */
    addGroup(v: number): void;
    /**
     * @en
     * Subtract the grouping value to fill in the group to be removed.
     * @zh
     * 减去分组值，可填要移除的 group。
     * @param v @zh 分组值，为 32 位整数，范围为 [2^0, 2^31] @en Group value which is a 32-bits integer, the range is [2^0, 2^31]
     */
    removeGroup(v: number): void;
    /**
     * @en
     * Gets the mask value.
     * @zh
     * 获取掩码值。
     * @returns @zh 掩码值，为 32 位整数，范围为 [2^0, 2^31] @en Mask value which is a 32-bits integer, the range is [2^0, 2^31]
     */
    getMask(): number;
    /**
     * @en
     * Sets the mask value.
     * @zh
     * 设置掩码值。
     * @param v @zh 掩码值，为 32 位整数，范围为 [2^0, 2^31] @en Mask value which is a 32-bits integer, the range is [2^0, 2^31]
     */
    setMask(v: number): void;
    /**
     * @en
     * Add mask values to fill in groups that need to be checked.
     * @zh
     * 添加掩码值，可填入需要检查的 group。
     * @param v @zh 掩码值，为 32 位整数，范围为 [2^0, 2^31] @en Mask value which is a 32-bits integer, the range is [2^0, 2^31]
     */
    addMask(v: number): void;
    /**
     * @en
     * Subtract the mask value to fill in the group that does not need to be checked.
     * @zh
     * 减去掩码值，可填入不需要检查的 group。
     * @param v @zh 掩码值，为 32 位整数，范围为 [2^0, 2^31] @en Mask value which is a 32-bits integer, the range is [2^0, 2^31]
     */
    removeMask(v: number): void;
    protected onLoad(): void;
    protected onEnable(): void;
    protected onDisable(): void;
    protected onDestroy(): void;
    private _updateMaterial;
    private _updateNeedEvent;
}
export declare namespace Collider {
    type Type = EnumAlias<typeof EColliderType>;
    type Axis = EnumAlias<typeof EAxisDirection>;
}
export {};
