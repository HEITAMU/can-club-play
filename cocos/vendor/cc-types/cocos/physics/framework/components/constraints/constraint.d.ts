/// <reference types="./@types/globals" />
import { Component } from '../../../../scene-graph';
import { RigidBody } from '../rigid-body';
import { IBaseConstraint } from '../../../spec/i-physics-constraint';
import { EConstraintType } from '../../physics-enum';
declare const Constraint_base: new (...args: any[]) => Component & import("../../../../core/event/eventify").IEventified;
/**
 * @en
 * Base class for joint constraints, which depends on rigid body components.
 * @zh
 * 关节约束的基类，它依赖于刚体组件。
 */
export declare class Constraint extends Constraint_base {
    /**
     * @en
     * Enumeration of joint types.
     * @zh
     * 关节类型的枚举。
     */
    static readonly Type: typeof EConstraintType;
    /**
     * @en
     * Gets the collider attached rigid-body.
     * @zh
     * 获取碰撞器所绑定的刚体组件。
     */
    get attachedBody(): RigidBody | null;
    /**
     * @en
     * Get or set the jointed rigid body, null means link to a static rigid body at the world origin.
     * @zh
     * 获取或设置关节连接的刚体，为空时表示链接到位于世界原点的静态刚体。
     */
    get connectedBody(): RigidBody | null;
    set connectedBody(v: RigidBody | null);
    /**
     * @en
     * Get or set whether collision is turned on between two rigid bodies connected by a joint.
     * @zh
     * 获取或设置关节连接的两刚体之间是否开启碰撞。
     */
    get enableCollision(): boolean;
    set enableCollision(v: boolean);
    /**
     * @en
     * Gets the type of this joint.
     * @zh
     * 获取此关节的类型。
     */
    readonly TYPE: EConstraintType;
    protected _enableCollision: boolean;
    protected _connectedBody: RigidBody | null;
    protected _constraint: IBaseConstraint | null;
    constructor(type: EConstraintType);
    protected onLoad(): void;
    protected onEnable(): void;
    protected onDisable(): void;
    protected onDestroy(): void;
}
export declare namespace Constraint {
    type Type = EnumAlias<typeof EConstraintType>;
}
export {};
