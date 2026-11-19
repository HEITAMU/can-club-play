import { Component } from '../../../scene-graph/component';
import { Vec3 } from '../../../core';
/**
 * @en
 * A tool component to help apply force to the rigid body at each frame.
 * @zh
 * 在每帧对一个刚体施加持续的力，依赖 RigidBody 组件。
 */
export declare class ConstantForce extends Component {
    private _rigidBody;
    private readonly _force;
    private readonly _localForce;
    private readonly _torque;
    private readonly _localTorque;
    private _mask;
    /**
     * @en
     * Gets or sets forces in world coordinates.
     * @zh
     * 获取或设置世界坐标系下的力。
     */
    get force(): Vec3;
    set force(value: Vec3);
    /**
     * @en
     * Gets or sets the forces in the local coordinate system.
     * @zh
     * 获取或设置本地坐标系下的力。
     */
    get localForce(): Vec3;
    set localForce(value: Vec3);
    /**
     * @en
     * Gets or sets the torsional force in world coordinates.
     * @zh
     * 获取或设置世界坐标系下的扭转力。
     */
    get torque(): Vec3;
    set torque(value: Vec3);
    /**
     * @en
     * Gets or sets the torsional force in the local coordinate system.
     * @zh
     * 获取或设置本地坐标系下的扭转力。
     */
    get localTorque(): Vec3;
    set localTorque(value: Vec3);
    onLoad(): void;
    lateUpdate(dt: number): void;
    private _maskUpdate;
}
