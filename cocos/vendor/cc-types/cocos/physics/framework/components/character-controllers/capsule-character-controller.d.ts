import { CharacterController } from './character-controller';
/**
 * @en
 * Character Controller component.
 * @zh
 * 角色控制器组件。
 */
export declare class CapsuleCharacterController extends CharacterController {
    constructor();
    /**
     * @en
     * Gets or sets the radius of the sphere of the capsule shape of the CharacterController in local space.
     * @zh
     * 获取或设置在本地坐标系下的胶囊体球半径。
     */
    get radius(): number;
    set radius(value: number);
    /**
     * @en
     * Gets or sets the height of the capsule shape of the CharacterController in local space.
     * Height the distance between the two sphere centers at the end of the capsule.
     * @zh
     * 获取或设置在本地坐标系下的胶囊体末端两个球心的距离。
     */
    get height(): number;
    set height(value: number);
    private _radius;
    private _height;
}
