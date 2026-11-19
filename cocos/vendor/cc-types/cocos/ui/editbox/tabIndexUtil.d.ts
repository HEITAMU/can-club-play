import { EditBoxImpl } from './edit-box-impl';
export declare class tabIndexUtil {
    static _tabIndexList: EditBoxImpl[];
    static add(editBoxImpl: EditBoxImpl): void;
    static remove(editBoxImpl: EditBoxImpl): void;
    static resort(): void;
    static next(editBoxImpl: EditBoxImpl): void;
}
