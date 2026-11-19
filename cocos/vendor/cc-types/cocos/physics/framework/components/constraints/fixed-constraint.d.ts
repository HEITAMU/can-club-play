import { Constraint } from './constraint';
import { IFixedConstraint } from '../../../spec/i-physics-constraint';
/**
 * @en The fixed constraint.
 * It locks the relative position and rotation between two rigid bodies.
 * @zh 固定关节。
 * 固定关节会锁定两个刚体间的相对位置和相对旋转。
 */
export declare class FixedConstraint extends Constraint {
    /**
     * @en
     * The maximum force that can be applied to the constraint before it breaks.
     * @zh
     * 约束的断裂力阈值。
     */
    get breakForce(): number;
    set breakForce(v: number);
    /**
     * @en
     * The maximum torque that can be applied to the constraint before it breaks.
     * @zh
     * 约束的断裂扭矩阈值。
     */
    get breakTorque(): number;
    set breakTorque(v: number);
    get constraint(): IFixedConstraint;
    private _breakForce;
    private _breakTorque;
    constructor();
}
