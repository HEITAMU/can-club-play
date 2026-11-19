import { System } from '../core';
import { ActionManager } from './actions/action-manager';
/**
 * @en
 * Tween system.
 * @zh
 * 缓动系统。
 */
export declare class TweenSystem extends System {
    /**
     * @en
     * The ID flag of the system.
     * @zh
     * 此系统的 ID 标记。
     */
    static readonly ID = "TWEEN";
    /**
     * @en
     * Gets the instance of the tween system.
     * @zh
     * 获取缓动系统的实例。
     */
    static readonly instance: TweenSystem;
    /**
     * @en
     * Gets the action manager.
     * @zh
     * 获取动作管理器。
     */
    get ActionManager(): ActionManager;
    private readonly actionMgr;
    constructor();
    /**
     * @en
     * The update will auto execute after all components update.
     * @zh
     * 此方法会在组件 update 之后自动执行。
     * @param dt @en The delta time @zh 间隔时间
     */
    update(dt: number): void;
}
