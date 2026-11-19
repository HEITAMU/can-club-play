import { Asset } from '../../../asset/assets/asset';
/**
 * @en
 * Physics materials.
 * @zh
 * 物理材质。
 */
export declare class PhysicsMaterial extends Asset {
    /**
     * @en
     * Gets all physics material instances.
     * @zh
     * 获取所有的物理材质实例。
     */
    static allMaterials: PhysicsMaterial[];
    /**
     * @en
     * The event which will be triggered when the entity of physics material update.
     * @zh
     * 物理材质实例更新时触发的事件。
     * @event PhysicsMaterial.EVENT_UPDATE
     */
    static readonly EVENT_UPDATE = "event_update";
    /**
     * @en
     * Friction for this material.
     * @zh
     * 此材质的摩擦系数。
     */
    get friction(): number;
    set friction(value: number);
    /**
     * @en
     * Rolling friction for this material.
     * @zh
     * 此材质的滚动摩擦系数。
     */
    get rollingFriction(): number;
    set rollingFriction(value: number);
    /**
     * @en
     * Spinning friction for this material.
     * @zh
     * 此材质的自旋摩擦系数。
     */
    get spinningFriction(): number;
    set spinningFriction(value: number);
    /**
     * @en
     * Restitution for this material.
     * @zh
     * 此材质的回弹系数。
     */
    get restitution(): number;
    set restitution(value: number);
    readonly id: number;
    private static _idCounter;
    private _friction;
    private _rollingFriction;
    private _spinningFriction;
    private _restitution;
    constructor();
    /**
     * @en
     * clone.
     * @zh
     * 克隆。
     */
    clone(): PhysicsMaterial;
    /**
     * @en
     * destroy.
     * @zh
     * 销毁。
     * @return 是否成功
     */
    destroy(): boolean;
    /**
     * @en
     * Sets the coefficients values.
     * @zh
     * 设置材质相关的系数。
     * @param friction
     * @param rollingFriction
     * @param spinningFriction
     * @param restitution
     */
    setValues(friction: number, rollingFriction: number, spinningFriction: number, restitution: number): void;
}
