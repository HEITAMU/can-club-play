import { Component } from '../../scene-graph/component';
import { Vec3 } from '../../core';
/**
 * @en The light probe group component.
 * @zh 光照探针组组件。
 */
export declare class LightProbeGroup extends Component {
    protected _probes: Vec3[];
    protected _method: number;
    protected _minPos: Vec3;
    protected _maxPos: Vec3;
    protected _nProbesX: number;
    protected _nProbesY: number;
    protected _nProbesZ: number;
    get probes(): Vec3[];
    set probes(val: Vec3[]);
    get method(): number;
    /**
     * @en Minimum position of the light probe group
     * @zh 光照探针组包围盒最小值
     */
    get minPos(): Vec3;
    set minPos(val: Vec3);
    /**
     * @en Maximum position of the light probe group
     * @zh 光照探针组包围盒最大值
     */
    get maxPos(): Vec3;
    set maxPos(val: Vec3);
    get nProbesX(): number;
    set nProbesX(val: number);
    get nProbesY(): number;
    set nProbesY(val: number);
    get nProbesZ(): number;
    set nProbesZ(val: number);
    onLoad(): void;
    onEnable(): void;
    onDisable(): void;
    generateLightProbes(): void;
    onProbeChanged(updateTet?: boolean, emitEvent?: boolean): void;
}
