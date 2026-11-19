import { PostSettingsInfo } from '../../scene-graph/scene-globals';
export declare const ToneMappingType: {
    DEFAULT: number;
    LINEAR: number;
};
export declare class PostSettings {
    protected _toneMappingType: number;
    protected _activated: boolean;
    set toneMappingType(val: number);
    get toneMappingType(): number;
    initialize(postSettingsInfo: PostSettingsInfo): void;
    activate(): void;
    protected _updatePipeline(): void;
}
