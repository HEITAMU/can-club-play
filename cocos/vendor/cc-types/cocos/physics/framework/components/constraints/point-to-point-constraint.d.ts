import { Constraint } from './constraint';
import { IVec3Like } from '../../../../core';
import { IPointToPointConstraint } from '../../../spec/i-physics-constraint';
/**
 * @en The point to point constraint.
 * It locks the relative position of the pivots between two rigid bodies.
 * @zh 点对点约束。
 * 点对点约束会锁定两个刚体间的连接点的相对位置。
 */
export declare class PointToPointConstraint extends Constraint {
    /**
     * @en
     * The pivot point of the constraint in the local coordinate system of the attached rigid body.
     * @zh
     * 约束关节在连接刚体本地坐标系中的位置。
     */
    get pivotA(): IVec3Like;
    set pivotA(v: IVec3Like);
    /**
     * @en
     * The pivot point of the constraint in the local coordinate system of the connected rigid body.
     * @zh
     * 约束关节在连接刚体本地坐标系中的位置。
     */
    get pivotB(): IVec3Like;
    set pivotB(v: IVec3Like);
    get constraint(): IPointToPointConstraint;
    private readonly _pivotA;
    private readonly _pivotB;
    constructor();
}
