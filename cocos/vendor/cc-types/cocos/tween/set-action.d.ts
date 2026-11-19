import { ActionInstant } from './actions/action-instant';
export declare class SetAction extends ActionInstant {
    private _props;
    constructor(props?: any);
    init(props: any): boolean;
    update(): void;
    clone(): SetAction;
    isUnknownDuration(): boolean;
}
