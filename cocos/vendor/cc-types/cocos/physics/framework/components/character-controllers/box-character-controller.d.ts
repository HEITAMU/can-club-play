import { CharacterController } from './character-controller';
/**
 * @en
 * Character Controller component.
 * @zh
 * 角色控制器组件。
 */
export declare class BoxCharacterController extends CharacterController {
    constructor();
    /**
     * @en
     * Gets or sets the half height of the box shape of the CharacterController in local space.
     * @zh
     * 获取或设置立方体在本地坐标系下的高度的一半。
     */
    get halfHeight(): number;
    set halfHeight(value: number);
    /**
     * @en
     * Gets or sets the half side extent of box shape of the CharacterController in local space.
     * @zh
     * 获取或设置立方体在本地坐标系下的横向宽度的一半。
     */
    get halfSideExtent(): number;
    set halfSideExtent(value: number);
    /**
     * @en
     * Gets or sets the half forward extent of the box on the CharacterController in local space.
     * @zh
     * 获取或设置立方体在本地坐标系下的纵向宽度一半。
     */
    get halfForwardExtent(): number;
    set halfForwardExtent(value: number);
    private _halfHeight;
    private _halfSideExtent;
    private _halfForwardExtent;
}
