import { BasicVariableDescription, createInstanceTag, Value, VariableType, VarInstanceBase } from './basic';
/**
 * @en The reset mode of boolean variables. It indicates when to reset the variable as `false`.
 * @zh 布尔类型变量的重置模式，指示在哪些情况下将变量重置为 `false`。
 */
export declare enum TriggerResetMode {
    /**
     * @en The variable is reset when it's consumed by animation transition.
     * @zh 在该变量被动画过渡消耗后自动重置。
     */
    AFTER_CONSUMED = 0,
    /**
     * @en The variable is reset in next frame or when it's consumed by animation transition.
     * @zh 下一帧自动重置；在该变量被动画过渡消耗后也会自动重置。
     */
    NEXT_FRAME_OR_AFTER_CONSUMED = 1
}
export declare class TriggerVariable implements BasicVariableDescription<VariableType.TRIGGER> {
    get type(): VariableType.TRIGGER;
    get value(): boolean;
    set value(value: boolean);
    get resetMode(): TriggerResetMode;
    set resetMode(value: TriggerResetMode);
    [createInstanceTag](): VarInstanceTrigger;
    private _flags;
}
export declare class VarInstanceTrigger extends VarInstanceBase {
    readonly resetMode: TriggerResetMode;
    constructor(value: Value, resetMode: TriggerResetMode);
    protected getValue(): Value;
    protected setValue(value: Value): void;
    private _value;
}
