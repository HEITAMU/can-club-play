import { Constraint } from './constraint';
import { Vec3 } from '../../../../core';
import { EConstraintMode, EDriverMode } from '../../physics-enum';
import { IConfigurableConstraint } from '../../../spec/i-physics-constraint';
/**
 * @en The linear limit settings of the configurable constraint.
 * @zh 可配置约束的线性限制设置。
 */
export declare class LinearLimitSettings {
    get xMotion(): EConstraintMode;
    set xMotion(v: EConstraintMode);
    get yMotion(): EConstraintMode;
    set yMotion(v: EConstraintMode);
    get zMotion(): EConstraintMode;
    set zMotion(v: EConstraintMode);
    get upper(): Vec3;
    set upper(v: Vec3);
    get lower(): Vec3;
    set lower(v: Vec3);
    get restitution(): number;
    set restitution(v: number);
    get enableSoftConstraint(): boolean;
    set enableSoftConstraint(v: boolean);
    get stiffness(): number;
    set stiffness(v: number);
    get damping(): number;
    set damping(v: number);
    private _xMotion;
    private _yMotion;
    private _zMotion;
    private _upper;
    private _lower;
    private _enableSoftConstraint;
    private _bounciness;
    private _stiffness;
    private _damping;
    /**
     * @engineInternal
     */
    set impl(v: IConfigurableConstraint);
    private _impl;
    constructor(configurableConstraint: IConfigurableConstraint);
}
/**
 * @en The angular limit settings of the configurable constraint.
 * @zh 可配置约束的角度限制设置。
 */
export declare class AngularLimitSettings {
    get twistMotion(): EConstraintMode;
    set twistMotion(v: EConstraintMode);
    get swingMotion1(): EConstraintMode;
    set swingMotion1(v: EConstraintMode);
    get swingMotion2(): EConstraintMode;
    set swingMotion2(v: EConstraintMode);
    get twistExtent(): number;
    set twistExtent(v: number);
    get swingExtent1(): number;
    set swingExtent1(v: number);
    get swingExtent2(): number;
    set swingExtent2(v: number);
    get twistRestitution(): number;
    set twistRestitution(v: number);
    get swingRestitution(): number;
    set swingRestitution(v: number);
    get enableSoftConstraintTwist(): boolean;
    set enableSoftConstraintTwist(v: boolean);
    get twistStiffness(): number;
    set twistStiffness(v: number);
    get twistDamping(): number;
    set twistDamping(v: number);
    get enableSoftConstraintSwing(): boolean;
    set enableSoftConstraintSwing(v: boolean);
    get swingStiffness(): number;
    set swingStiffness(v: number);
    get swingDamping(): number;
    set swingDamping(v: number);
    private _swing1Motion;
    private _swing2Motion;
    private _twistMotion;
    private _twistExtent;
    private _swingExtent1;
    private _swingExtent2;
    private _enableSoftConstraintSwing;
    private _swingBounciness;
    private _swingStiffness;
    private _swingDamping;
    private _enableSoftConstraintTwist;
    private _twistBounciness;
    private _twistStiffness;
    private _twistDamping;
    /**
     * @engineInternal
     */
    set impl(v: IConfigurableConstraint);
    private _impl;
    constructor(configurableConstraint: IConfigurableConstraint);
}
/**
 * @en The linear driver settings of the configurable constraint.
 * @zh 可配置约束的线性驱动器设置。
 */
export declare class LinearDriverSettings {
    get xDrive(): EDriverMode;
    set xDrive(v: EDriverMode);
    get yDrive(): EDriverMode;
    set yDrive(v: EDriverMode);
    get zDrive(): EDriverMode;
    set zDrive(v: EDriverMode);
    get targetPosition(): Vec3;
    set targetPosition(v: Vec3);
    get targetVelocity(): Vec3;
    set targetVelocity(v: Vec3);
    get strength(): number;
    set strength(v: number);
    private _target;
    private _velocity;
    private _xDrive;
    private _yDrive;
    private _zDrive;
    private _strength;
    /**
     * @engineInternal
     */
    set impl(v: IConfigurableConstraint);
    private _impl;
    constructor(configurableConstraint: IConfigurableConstraint);
}
/**
 * @en The angular driver settings of the configurable constraint.
 * @zh 可配置约束的角度驱动器设置。
 */
export declare class AngularDriverSettings {
    get twistDrive(): EDriverMode;
    set twistDrive(v: EDriverMode);
    get swingDrive1(): EDriverMode;
    set swingDrive1(v: EDriverMode);
    get swingDrive2(): EDriverMode;
    set swingDrive2(v: EDriverMode);
    get targetOrientation(): Vec3;
    set targetOrientation(v: Vec3);
    get targetVelocity(): Vec3;
    set targetVelocity(v: Vec3);
    get strength(): number;
    set strength(v: number);
    private _swingDrive1;
    private _swingDrive2;
    private _twistDrive;
    private _targetOrientation;
    private _targetVelocity;
    private _strength;
    /**
     * @engineInternal
     */
    set impl(v: IConfigurableConstraint);
    private _impl;
    constructor(configurableConstraint: IConfigurableConstraint);
}
/**
 * @en The configurable constraint component.
 * The configurable constraint provides all the functionality of other constraints, and provides comprehensive configurable options.
 * @zh 可配置约束组件。
 * 可配置约束提供了其他约束的所有功能支持，提供了全面的可配置选项。
 */
export declare class ConfigurableConstraint extends Constraint {
    /**
     * @en
     * The axis of the constraint in the local coordinate system of the attached rigid body.
     * @zh
     * 约束关节在连接刚体的本地坐标系中的轴。
     */
    get axis(): Vec3;
    set axis(v: Vec3);
    /**
     * @en The secondary axis of the constraint in the local coordinate system of the attached rigid body.
     * @zh 约束关节在连接刚体的本地坐标系中的第二轴。
     */
    get secondaryAxis(): Vec3;
    set secondaryAxis(v: Vec3);
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
     * The pivotB is derived automatically.
     * @zh
     * pivotB 会自动计算。
     */
    get autoPivotB(): boolean;
    set autoPivotB(v: boolean);
    /**
     * @en
     * The break force threshold of the constraint.
     * @zh
     * 约束的断裂力阈值。
     */
    get breakForce(): number;
    set breakForce(v: number);
    /**
     * @en
     * The break torque threshold of the constraint.
     * @zh
     * 约束的断裂扭矩阈值。
     */
    get breakTorque(): number;
    set breakTorque(v: number);
    /**
     * @en
     * The linear limit settings of the constraint.
     * @zh
     * 线性限制设置。
     */
    get linearLimitSettings(): LinearLimitSettings;
    set linearLimitSettings(v: LinearLimitSettings);
    /**
     * @en
     * The angular limit settings of the constraint.
     * @zh
     * 角度限制设置。
     */
    get angularLimitSettings(): AngularLimitSettings;
    set angularLimitSettings(v: AngularLimitSettings);
    /**
     * @en
     * The linear drive settings of the constraint.
     * @zh
     * 线性驱动设置。
     */
    get linearDriverSettings(): LinearDriverSettings;
    set linearDriverSettings(v: LinearDriverSettings);
    /**
     * @en
     * The angular drive settings of the constraint.
     * @zh
     * 角度驱动设置。
     */
    get angularDriverSettings(): AngularDriverSettings;
    set angularDriverSettings(v: AngularDriverSettings);
    private _breakForce;
    private _breakTorque;
    private _linearLimitSettings;
    private _angularLimitSettings;
    private _linearDriverSettings;
    private _angularDriverSettings;
    private readonly _pivotA;
    private readonly _pivotB;
    private _autoPivotB;
    private readonly _axis;
    private readonly _secondaryAxis;
    get constraint(): IConfigurableConstraint;
    constructor();
    onLoad(): void;
}
