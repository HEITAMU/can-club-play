/**
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 * The following section is auto-generated.
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 */
import type { Attribute, ShaderInfo } from '../../gfx';
import type { ProgramProxy } from './private';
import type { IProgramInfo } from '../../render-scene/core/program-lib';
export declare class ProgramInfo {
    constructor(programInfo: IProgramInfo, shaderInfo: ShaderInfo, attributes: Attribute[], blockSizes: number[], handleMap: Record<string, number>);
    readonly programInfo: IProgramInfo;
    readonly shaderInfo: ShaderInfo;
    readonly attributes: Attribute[];
    readonly blockSizes: number[];
    readonly handleMap: Record<string, number>;
}
export declare class ProgramGroup {
    readonly programInfos: Map<string, ProgramInfo>;
    readonly programProxies: Map<string, ProgramProxy>;
}
