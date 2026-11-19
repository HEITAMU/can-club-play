import { ISchedulable } from './scheduler';
export declare enum SystemPriority {
    LOW = 0,
    MEDIUM = 100,
    HIGH = 200,
    SCHEDULER = 2147483648
}
/**
 * @en Base class for all functional system managed by [[Director]].
 * @zh 功能系统的基类，由 [[Director]] 管理。
 */
export declare class System implements ISchedulable {
    static Priority: {
        LOW: SystemPriority;
        MEDIUM: SystemPriority;
        HIGH: SystemPriority;
        SCHEDULER: SystemPriority;
    };
    protected _id: string;
    protected _priority: number;
    protected _executeInEditMode: boolean;
    set priority(value: number);
    get priority(): number;
    set id(id: string);
    get id(): string;
    /**
     * @en Sorting between different systems.
     * @zh 不同系统间排序。
     * @param a System a
     * @param b System b
     */
    static sortByPriority(a: System, b: System): number;
    /**
     * @en Init the system, will be invoked by [[Director]] when registered, should be implemented if needed.
     * @zh 系统初始化函数，会在注册时被 [[Director]] 调用，如果需要的话应该由子类实现
     */
    init(): void;
    /**
     * @en Update function of the system, it will be invoked between all components update phase and late update phase.
     * @zh 系统的帧更新函数，它会在所有组件的 update 和 lateUpdate 之间被调用
     * @param dt Delta time after the last frame
     */
    update(dt: number): void;
    /**
     * @en Post update function of the system, it will be invoked after all components late update phase and before the rendering process.
     * @zh 系统的帧后处理函数，它会在所有组件的 lateUpdate 之后以及渲染之前被调用
     * @param dt Delta time after the last frame
     */
    postUpdate(dt: number): void;
    destroy(): void;
}
