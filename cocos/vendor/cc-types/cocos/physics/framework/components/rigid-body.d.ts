/// <reference types="./@types/globals" />
import { Vec3 } from '../../../core';
import { Component } from '../../../scene-graph';
import { IRigidBody } from '../../spec/i-rigid-body';
import { ERigidBodyType } from '../physics-enum';
/**
 * @en
 * Rigid body component.
 * @zh
 * 刚体组件。
 */
export declare class RigidBody extends Component {
    /**
     * @en
     * Enumeration of rigid body types.
     * @zh
     * 刚体类型的枚举。
     */
    static readonly Type: typeof ERigidBodyType;
    /**
     * @en
     * Gets or sets the group of the rigid body.
     * @zh
     * 获取或设置分组。
     */
    get group(): number;
    set group(v: number);
    /**
     * @en
     * Gets or sets the type of rigid body.
     * @zh
     * 获取或设置刚体类型。
     */
    get type(): ERigidBodyType;
    set type(v: ERigidBodyType);
    /**
     * @en
     * Gets or sets the mass of the rigid body.
     * @zh
     * 获取或设置刚体的质量。
     */
    get mass(): number;
    set mass(value: number);
    /**
     * @en
     * Gets or sets whether hibernation is allowed.
     * @zh
     * 获取或设置是否允许休眠。
     */
    get allowSleep(): boolean;
    set allowSleep(v: boolean);
    /**
     * @en
     * Gets or sets linear damping.
     * @zh
     * 获取或设置线性阻尼。
     */
    get linearDamping(): number;
    set linearDamping(value: number);
    /**
     * @en
     * Gets or sets the rotation damping.
     * @zh
     * 获取或设置旋转阻尼。
     */
    get angularDamping(): number;
    set angularDamping(value: number);
    /**
     * @en
     * Gets or sets whether a rigid body uses gravity.
     * @zh
     * 获取或设置刚体是否使用重力。
     */
    get useGravity(): boolean;
    set useGravity(value: boolean);
    /**
     * @en
     * Gets or sets the linear velocity factor that can be used to control the scaling of the velocity in each axis direction.
     * @zh
     * 获取或设置线性速度的因子，可以用来控制每个轴方向上的速度的缩放。
     */
    get linearFactor(): Vec3;
    set linearFactor(value: Vec3);
    /**
     * @en
     * Gets or sets the rotation speed factor that can be used to control the scaling of the rotation speed in each axis direction.
     * @zh
     * 获取或设置旋转速度的因子，可以用来控制每个轴方向上的旋转速度的缩放。
     */
    get angularFactor(): Vec3;
    set angularFactor(value: Vec3);
    /**
     * @en
     * Gets or sets the speed threshold for going to sleep.
     * @zh
     * 获取或设置进入休眠的速度临界值。
     */
    get sleepThreshold(): number;
    set sleepThreshold(v: number);
    /**
     * @en
     * Turning on or off continuous collision detection.
     * @zh
     * 开启或关闭连续碰撞检测。
     */
    get useCCD(): boolean;
    set useCCD(v: boolean);
    /**
     * @en
     * Gets whether it is the state of awake.
     * @zh
     * 获取是否是唤醒的状态。
     */
    get isAwake(): boolean;
    /**
     * @en
     * Gets whether you can enter a dormant state.
     * @zh
     * 获取是否是可进入休眠的状态。
     */
    get isSleepy(): boolean;
    /**
     * @en
     * Gets whether the state is dormant.
     * @zh
     * 获取是否是正在休眠的状态。
     */
    get isSleeping(): boolean;
    /**
     * @en
     * Gets or sets whether the rigid body is static.
     * @zh
     * 获取或设置刚体是否是静态类型的（静止不动的）。
     */
    get isStatic(): boolean;
    set isStatic(v: boolean);
    /**
     * @en
     * Gets or sets whether the rigid body moves through physical dynamics.
     * @zh
     * 获取或设置刚体是否是动力学态类型的（将根据物理动力学控制运动）。
     */
    get isDynamic(): boolean;
    set isDynamic(v: boolean);
    /**
     * @en
     * Gets or sets whether a rigid body is controlled by users.
     * @zh
     * 获取或设置刚体是否是运动态类型的（将由用户来控制运动）。
     */
    get isKinematic(): boolean;
    set isKinematic(v: boolean);
    /**
     * @en
     * Gets the wrapper object, through which the lowLevel instance can be accessed.
     * @zh
     * 获取封装对象，通过此对象可以访问到底层实例。
     */
    get body(): IRigidBody | null;
    private _body;
    private _group;
    private _type;
    private _mass;
    private _allowSleep;
    private _linearDamping;
    private _angularDamping;
    private _useGravity;
    private _linearFactor;
    private _angularFactor;
    protected get _isInitialized(): boolean;
    protected onLoad(): void;
    protected onEnable(): void;
    protected onDisable(): void;
    protected onDestroy(): void;
    /**
     * @en
     * Apply force to a world point. This could, for example, be a point on the Body surface.
     * @zh
     * 在世界空间中，相对于刚体的质心的某点上对刚体施加作用力。
     * @param force @zh 作用力 @en The force applied
     * @param relativePoint @zh 作用点，相对于刚体的质心 @en The point to apply the force on, relative to the center of mass of the rigid body
     */
    applyForce(force: Vec3, relativePoint?: Vec3): void;
    /**
     * @en
     * Apply force to a local point. This could, for example, be a point on the Body surface.
     * @zh
     * 在本地空间中，相对于刚体的质心的某点上对刚体施加作用力。
     * @param force @zh 作用力 @en The force applied
     * @param localPoint @zh 作用点 @en The point to apply the force on
     */
    applyLocalForce(force: Vec3, localPoint?: Vec3): void;
    /**
     * @en
     * In world space, impulse is applied to the rigid body at some point relative to the center of mass of the rigid body.
     * @zh
     * 在世界空间中，相对于刚体的质心的某点上对刚体施加冲量。
     * @param impulse @zh 冲量 @en The impulse applied
     * @param relativePoint @zh 作用点，相对于刚体的中心点 @en The point to apply the impulse, relative to the center of mass of the rigid body
     */
    applyImpulse(impulse: Vec3, relativePoint?: Vec3): void;
    /**
     * @en
     * In local space, impulse is applied to the rigid body at some point relative to the center of mass of the rigid body.
     * @zh
     * 在本地空间中，相对于刚体的质心的某点上对刚体施加冲量。
     * @param impulse @zh 冲量 @en The impulse applied
     * @param localPoint @zh 作用点 @en The point to apply the impulse
     */
    applyLocalImpulse(impulse: Vec3, localPoint?: Vec3): void;
    /**
     * @en
     * In world space, torque is applied to the rigid body.
     * @zh
     * 在世界空间中，对刚体施加扭矩。
     * @param torque @zh 扭矩 @en The torque applied
     */
    applyTorque(torque: Vec3): void;
    /**
     * @zh
     * 在本地空间中，对刚体施加扭矩。
     * @zh
     * In local space, torque is applied to the rigid body.
     * @param torque @zh 扭矩 @en The torque applied
     */
    applyLocalTorque(torque: Vec3): void;
    /**
     * @en
     * Wake up the rigid body.
     * @zh
     * 唤醒刚体。
     */
    wakeUp(): void;
    /**
     * @en
     * Dormancy of rigid body.
     * @zh
     * 休眠刚体。
     */
    sleep(): void;
    /**
     * @en
     * Clear the forces and velocity of the rigid body.
     * @zh
     * 清除刚体受到的力和速度。
     */
    clearState(): void;
    /**
     * @en
     * Clear the forces of the rigid body.
     * @zh
     * 清除刚体受到的力。
     */
    clearForces(): void;
    /**
     * @en
     * Clear velocity of the rigid body.
     * @zh
     * 清除刚体的速度。
     */
    clearVelocity(): void;
    /**
     * @en
     * Gets the linear velocity.
     * @zh
     * 获取线性速度。
     * @param out @zh 速度向量 @en The velocity vector
     */
    getLinearVelocity(out: Vec3): void;
    /**
     * @en
     * Sets the linear velocity.
     * @zh
     * 设置线性速度。
     * @param value @zh 速度向量 @en The velocity vector
     */
    setLinearVelocity(value: Vec3): void;
    /**
     * @en
     * Gets the angular velocity.
     * @zh
     * 获取旋转速度。
     * @param out @zh 角速度向量 @en The angular velocity vector
     */
    getAngularVelocity(out: Vec3): void;
    /**
     * @en
     * Sets the angular velocity.
     * @zh
     * 设置旋转速度。
     * @param value @zh 角速度向量 @en The angular velocity vector
     */
    setAngularVelocity(value: Vec3): void;
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
     * @returns {number} @zh 掩码值，为 32 位整数，范围为 [2^0, 2^31] @en Mask value which is a 32-bits integer, the range is [2^0, 2^31]
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
}
export declare namespace RigidBody {
    type Type = EnumAlias<typeof ERigidBodyType>;
}
