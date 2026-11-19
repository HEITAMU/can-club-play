import { Component } from '../../../scene-graph';
import { PostProcessSetting } from './post-process-setting';
export declare class PostProcess extends Component {
    static all: PostProcess[];
    global: boolean;
    protected _shadingScale: number;
    constructor();
    get shadingScale(): number;
    set shadingScale(v: number);
    enableShadingScaleInEditor: boolean;
    settings: Map<typeof PostProcessSetting, PostProcessSetting>;
    addSetting(setting: PostProcessSetting): void;
    removeSetting(setting: PostProcessSetting): void;
    getSetting(ctor: typeof PostProcessSetting): PostProcessSetting | undefined;
    onEnable(): void;
    onDisable(): void;
}
