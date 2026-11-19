import { ILifecycle } from './i-lifecycle';
import { Constraint, RigidBody, EConstraintMode, EDriverMode } from '../framework';
import { IVec3Like } from '../../core';
export interface IBaseConstraint extends ILifecycle {
    readonly impl: any;
    initialize(v: Constraint): void;
    setConnectedBody(v: RigidBody | null): void;
    setEnableCollision(v: boolean): void;
}
export interface IPointToPointConstraint extends IBaseConstraint {
    setPivotA(v: IVec3Like): void;
    setPivotB(v: IVec3Like): void;
}
export interface IHingeConstraint extends IBaseConstraint {
    setPivotA(v: IVec3Like): void;
    setPivotB(v: IVec3Like): void;
    setAxis(v: IVec3Like): void;
    setLimitEnabled(v: boolean): void;
    setLowerLimit(min: number): void;
    setUpperLimit(max: number): void;
    setMotorEnabled(v: boolean): void;
    setMotorVelocity(v: number): void;
    setMotorForceLimit(v: number): void;
}
export interface IFixedConstraint extends IBaseConstraint {
    setBreakForce(v: number): void;
    setBreakTorque(v: number): void;
}
export interface IConfigurableConstraint extends IBaseConstraint {
    setConstraintMode(idx: number, v: EConstraintMode): void;
    setLinearLimit(idx: number, lower: number, upper: number): void;
    setAngularExtent(twist: number, swing1: number, swing2: number): void;
    setLinearRestitution(v: number): void;
    setSwingRestitution(v: number): void;
    setTwistRestitution(v: number): void;
    setLinearSoftConstraint(v: boolean): void;
    setLinearStiffness(v: number): void;
    setLinearDamping(v: number): void;
    setSwingSoftConstraint(v: boolean): void;
    setTwistSoftConstraint(v: boolean): void;
    setSwingStiffness(v: number): void;
    setSwingDamping(v: number): void;
    setTwistStiffness(v: number): void;
    setTwistDamping(v: number): void;
    setDriverMode(idx: number, v: EDriverMode): void;
    setLinearMotorTarget(v: IVec3Like): void;
    setLinearMotorVelocity(v: IVec3Like): void;
    setLinearMotorForceLimit(v: number): void;
    setAngularMotorTarget(v: IVec3Like): void;
    setAngularMotorVelocity(v: IVec3Like): void;
    setAngularMotorForceLimit(v: number): void;
    setPivotA(v: IVec3Like): void;
    setPivotB(v: IVec3Like): void;
    setAutoPivotB(v: boolean): void;
    setAxis(v: IVec3Like): void;
    setSecondaryAxis(v: IVec3Like): void;
    setBreakForce(v: number): void;
    setBreakTorque(v: number): void;
}
