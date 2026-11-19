import { Material } from '../../asset/assets/material';
import { PassInstance } from './pass-instance';
import { MacroRecord } from './pass-utils';
import { PassOverrides } from './pass';
import { Renderer } from '../../misc/renderer';
export interface IMaterialInstanceInfo {
    parent: Material;
    owner?: Renderer;
    subModelIdx?: number;
}
/**
 * @zh
 * 材质实例，当有材质修改需求时，根据材质资源创建的，可任意定制的实例。
 */
export declare class MaterialInstance extends Material {
    get parent(): Material;
    get owner(): Renderer | null;
    protected _passes: PassInstance[];
    private _parent;
    private _owner;
    private _subModelIdx;
    constructor(info: IMaterialInstanceInfo);
    recompileShaders(overrides: MacroRecord, passIdx?: number): void;
    overridePipelineStates(overrides: PassOverrides, passIdx?: number): void;
    destroy(): boolean;
    onPassStateChange(dontNotify: boolean): void;
    protected _createPasses(): PassInstance[];
}
