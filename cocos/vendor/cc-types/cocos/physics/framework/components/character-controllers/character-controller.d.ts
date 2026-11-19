import { Vec3 } from '../../../../core';
import { Component } from '../../../../scene-graph';
import { IBaseCharacterController } from '../../../spec/i-character-controller';
import { ECharacterControllerType } from '../../physics-enum';
import { CharacterCollisionEventType, CharacterTriggerEventType } from '../../physics-interface';
type Callback = (...args: any[]) => any;
declare const CharacterController_base: new (...args: any[]) => Component & import("../../../../core/event/eventify").IEventified;
/**
 * @en
 * Base class for Character Controller component.
 * @zh
 * 角色控制器组件基类。
 */
export declare class CharacterController extends CharacterController_base {
    /**
     * @en
     * Gets or sets the group of the character controller.
     * @zh
     * 获取或设置分组。
     */
    get group(): number;
    set group(v: number);
    /**
     * @en
     * Gets or sets the minimum movement distance of the character controller.
     * @zh
     * 获取或设置角色控制器的最小移动距离。
     */
    get minMoveDistance(): number;
    set minMoveDistance(value: number);
    /**
     * @en 、
     * Gets or sets the maximum height the character controller can automatically climb.
     * @zh
     * 获取或设置角色控制器的最大自动爬台阶高度。
     */
    get stepOffset(): number;
    set stepOffset(value: number);
    /**
     * @en
     * Gets or sets the slope limit of the character controller in degree.
     * @zh
     * 获取或设置角色控制器的最大爬坡角度。
    */
    get slopeLimit(): number;
    set slopeLimit(value: number);
    /**
     * @en
     * Gets or sets the skin width of the character controller.
     * @zh
     * 获取或设置角色控制器的皮肤宽度。
     */
    get skinWidth(): number;
    set skinWidth(value: number);
    /**
     * @en
     * Gets or sets the center of the character controller in local space.
     * @zh
     * 获取或设置角色控制器的中心点在局部坐标系中的位置。
     */
    get center(): Readonly<Vec3>;
    set center(value: Readonly<Vec3>);
    /**
     * @en
     * Gets the type of this character controller.
     * @zh
     * 获取此角色控制器的类型。
     */
    readonly type: ECharacterControllerType;
    constructor(type: ECharacterControllerType);
    protected _cct: IBaseCharacterController | null;
    private _group;
    private _minMoveDistance;
    private _stepOffset;
    private _slopeLimit;
    private _skinWidth;
    private _center;
    private _initialized;
    private _prevPos;
    private _currentPos;
    private _velocity;
    private _centerWorldPosition;
    protected _needCollisionEvent: boolean;
    protected _needTriggerEvent: boolean;
    protected get _isInitialized(): boolean;
    protected onLoad(): void;
    protected onEnable(): void;
    protected onDisable(): void;
    protected onDestroy(): void;
    /**
     * @en
     * Gets world position of center.
     * @zh
     * 获取中心的世界坐标。
     */
    get centerWorldPosition(): Readonly<Vec3>;
    /**
     * @en
     * Sets world position of center.
     * Note: Calling this function will immediately synchronize the position of
     * the character controller in the physics world to the node.
     * @zh
     * 设置中心的世界坐标。
     * 注意：调用该函数会立刻将角色控制器在物理世界中的位置同步到节点上。
     */
    set centerWorldPosition(value: Readonly<Vec3>);
    /**
     * @en
     * Gets the velocity.
     * Note: velocity is only updated after move() is called.
     * @zh
     * 获取速度。
     * 注意：velocity 只会在 move() 调用后更新。
     */
    get velocity(): Readonly<Vec3>;
    /**
     * @en
     * Gets whether the character is on the ground.
     * Note: isGrounded is only updated after move() is called.
     * @zh
     * 获取是否在地面上。
     * 注意：isGrounded 只会在 move() 调用后更新。
     */
    get isGrounded(): boolean;
    /**
     * @en
     * Move the character.
     * @zh
     * 移动角色控制器。
     * @param movement @zh 移动向量 @en The movement vector
     */
    move(movement: Vec3): void;
    /**
     * @en
     * Registers callbacks associated with triggered or collision events.
     * @zh
     * 注册触发或碰撞事件相关的回调。
     * @param type - The event type, onControllerColliderHit;
     * @param callback - The event callback, signature:`(event?:ICollisionEvent|ITriggerEvent)=>void`.
     * @param target - The event callback target.
     */
    on<TFunction extends Callback>(type: CharacterTriggerEventType | CharacterCollisionEventType, callback: TFunction, target?: any, once?: boolean): any;
    /**
     * @en
     * Unregisters callbacks associated with trigger or collision events that have been registered.
     * @zh
     * 取消已经注册的触发或碰撞事件相关的回调。
     * @param type - The event type, onControllerColliderHit;
     * @param callback - The event callback, signature:`(event?:ICollisionEvent|ITriggerEvent)=>void`.
     * @param target - The event callback target.
     */
    off(type: CharacterTriggerEventType | CharacterCollisionEventType, callback?: Callback, target?: any): void;
    /**
     * @en
     * Registers a callback associated with a trigger or collision event, which is automatically unregistered once executed.
     * @zh
     * 注册触发或碰撞事件相关的回调，执行一次后会自动取消注册。
     * @param type - The event type, onControllerColliderHit;
     * @param callback - The event callback, signature:`(event?:ICollisionEvent|ITriggerEvent)=>void`.
     * @param target - The event callback target.
     */
    once<TFunction extends Callback>(type: CharacterTriggerEventType | CharacterCollisionEventType, callback: TFunction, target?: any): any;
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
    get needCollisionEvent(): boolean;
    get needTriggerEvent(): boolean;
    private _updateNeedEvent;
}
export {};
