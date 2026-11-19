import { EditBox } from './edit-box';
export declare class EditBoxImplBase {
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _editing: boolean;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _delegate: EditBox | null;
    init(delegate: EditBox): void;
    onEnable(): void;
    beforeDraw(): void;
    onDisable(): void;
    clear(): void;
    setTabIndex(index: number): void;
    setSize(width: number, height: number): void;
    setFocus(value: any): void;
    isFocused(): boolean;
    beginEditing(): void;
    endEditing(): void;
}
