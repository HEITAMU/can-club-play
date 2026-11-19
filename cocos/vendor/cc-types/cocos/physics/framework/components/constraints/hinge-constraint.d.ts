import { Constraint } from './constraint';
import { Vec3 } from '../../../../core';
import { IHingeConstraint } from '../../../spec/i-physics-constraint';
/**
 * @en The hinge constraint limitation data.
 * @zh 铰链约束的限制数据。
 */
export declare class HingeLimitData {
    private _enabled;
    private _upperLimit;
    private _lowerLimit;
    constructor();
    /**
     * @en
     * Whether to enable the rotation limit of the hinge constraint.
     * @zh
     * 是否开启旋转限制。
     */
    get enabled(): boolean;
    set enabled(v: boolean);
    /**
     * @en
     * The upper limit to the rotation of pivotB related to pivotB's local position. (in degrees)
     * @zh
     * 转轴约束的旋转上限。（以度为单位）
     */
    get upperLimit(): number;
    set upperLimit(v: number);
    /**
     * @en
     * The lower limit to the rotation of pivotB related to pivotB's local position. (in degrees)
     * @zh
     * 转轴约束的旋转下限。（以度为单位）
     */
    get lowerLimit(): number;
    set lowerLimit(v: number);
}
/**
 * @en The hinge constraint motor data.
 * @zh 铰链约束的马达数据。
 */
export declare class HingeMotorData {
    private _enabled;
    private _motorVelocity;
    private _motorForceLimit;
    constructor();
    /**
     * @en
     * Whether the motor is enabled or not.
     * @zh
     * 转轴约束是否启用 Motor
     */
    get enabled(): boolean;
    set enabled(v: boolean);
    /**
     * @en
     * The rotation speed of pivotA related to pivotB. (in degrees per second)
     * @zh
     * 转轴约束的旋转速度。（以度每秒为单位）
     */
    get motorVelocity(): number;
    set motorVelocity(v: number);
    /**
     * @en
     * The max drive force of the motor.
     * @zh
     * 转轴约束的最大驱动力。
     */
    get motorForceLimit(): number;
    set motorForceLimit(v: number);
}
/**
 * @en Hinge constraint.
 * It keeps the local rotation axes of two rigid bodies aligned,
 * and locks the relative motion along the rotation axis.
 * @zh 铰链约束。
 * 它保持两个刚体的本地旋转轴对齐，并锁定沿旋转轴的相对运动。
 */
export declare class HingeConstraint extends Constraint {
    /**
     * @en
     * The pivot point of the constraint in the local coordinate system of the attached rigid body.
     * @zh
     * 约束关节在连接刚体的本地坐标系中的锚点。
     */
    get pivotA(): Vec3;
    set pivotA(v: Vec3);
    /**
     * @en
     * The pivot point of the constraint in the local coordinate system of the connected rigid body.
     * @zh
     * 约束关节在连接刚体的本地坐标系中的锚点。
     */
    get pivotB(): Vec3;
    set pivotB(v: Vec3);
    /**
     * @en
     * The axis of the constraint in the local coordinate system of the attached rigid body.
     * @zh
     * 约束关节在连接刚体的本地坐标系中的轴。
     */
    get axis(): Vec3;
    set axis(v: Vec3);
    /**
     * @en
     * Whether to enable the rotation limit of the hinge constraint.
     * @zh
     * 是否开启旋转限制。
     */
    get limitEnabled(): boolean;
    set limitEnabled(v: boolean);
    /**
     * @en
     * The upper limit to the rotation angle of pivotB related to pivotB's local position.
     * @zh
     * 转轴约束的旋转角度上限。
     */
    get upperLimit(): number;
    set upperLimit(v: number);
    /**
     * @en
     * The lower limit to the rotation angle of pivotB related to pivotB's local position.
     * @zh
     * 转轴约束的旋转角度下限。
     */
    get lowerLimit(): number;
    set lowerLimit(v: number);
    /**
     * @en
     * Whether the motor is enabled or not.
     * @zh
     * 转轴约束是否启用 Motor
     */
    get motorEnabled(): boolean;
    set motorEnabled(v: boolean);
    /**
     * @en
     * The rotation speed of pivotA related to pivotB.
     * @zh
     * 转轴约束的旋转速度。
     */
    get motorVelocity(): number;
    set motorVelocity(v: number);
    /**
     * @en
     * The max drive force of the motor.
     * @zh
     * 转轴约束的最大驱动力。
     */
    get motorForceLimit(): number;
    set motorForceLimit(v: number);
    private readonly _axis;
    private readonly _pivotA;
    private readonly _pivotB;
    private _limitData;
    private _motorData;
    get constraint(): IHingeConstraint;
    constructor();
}
