import { ClearFlagBit, LoadOp, Format, Rect } from '../../gfx';
import { ReflectionProbe } from '../../render-scene/scene/reflection-probe';
import { Camera } from '../../render-scene/scene/camera';
import { Shadows } from '../../render-scene/scene/shadows';
import { Light } from '../../render-scene/scene/light';
import { BasicPipeline } from './pipeline';
import { AttachmentType } from './types';
import { RenderWindow } from '../../render-scene/core/render-window';
import { RasterPass, RenderData, RenderGraph } from './render-graph';
import { DescriptorSetData, LayoutGraphData } from './layout-graph';
export declare enum AntiAliasing {
    NONE = 0,
    FXAA = 1,
    FXAAHQ = 2
}
export declare function getRTFormatBeforeToneMapping(ppl: BasicPipeline): Format;
export declare function validPunctualLightsCulling(pipeline: BasicPipeline, camera: Camera): void;
export declare function getCameraUniqueID(camera: Camera): number;
export declare function getLoadOpOfClearFlag(clearFlag: ClearFlagBit, attachment: AttachmentType): LoadOp;
export declare function getRenderArea(camera: Camera, width: number, height: number, light?: Light | null, level?: number, out?: Rect | undefined): Rect;
export declare function buildShadowPass(passName: Readonly<string>, ppl: BasicPipeline, camera: Camera, light: Light, level: number, width: Readonly<number>, height: Readonly<number>): void;
export declare function buildReflectionProbePass(camera: Camera, ppl: BasicPipeline, probe: ReflectionProbe, renderWindow: RenderWindow, faceIdx: number): void;
export declare class ShadowInfo {
    shadowEnabled: boolean;
    mainLightShadowNames: string[];
    spotLightShadowNames: string[];
    validLights: Light[];
    reset(): void;
}
export declare function buildShadowPasses(cameraName: string, camera: Camera, ppl: BasicPipeline): ShadowInfo;
export declare function updateCameraUBO(setter: any, camera: Readonly<Camera>, ppl: Readonly<BasicPipeline>): void;
export declare function getDescBinding(descId: any, descData: DescriptorSetData): number;
export declare function getDescBindingFromName(bindingName: string): number;
export declare function getDescriptorSetDataFromLayout(layoutName: string): DescriptorSetData | undefined;
export declare function getDescriptorSetDataFromLayoutId(id: number): DescriptorSetData | undefined;
export declare function updateGlobalDescBinding(data: RenderData, sceneId: number, idxRD: number, layoutName?: string): void;
export declare function updatePerPassUBO(layout: string, sceneId: number, idxRD: number, user: RenderData): void;
export declare function hashCombineKey(val: any): string;
export declare function hashCombineStr(str: string): number;
export declare function bool(val: any): boolean;
export declare function AlignUp(value: number, alignment: number): number;
export declare function SetLightUBO(light: Light | null, bHDR: boolean, exposure: number, shadowInfo: Shadows | null, buffer: Float32Array, offset: number, elemSize: number): void;
export declare function getSubpassOrPassID(sceneId: number, rg: RenderGraph, lg: LayoutGraphData): number;
export declare class RenderPassMergeInfo {
    combineHash: number;
    needBeginRP: boolean;
    needEndRP: boolean;
    constructor(combineHash?: number, needBeginRP?: boolean, needEndRP?: boolean);
    init(combineHash: number, needBeginRP?: boolean, needEndRP?: boolean): void;
}
export declare const rpMergeInfos: Map<RasterPass, RenderPassMergeInfo>;
export declare function resetPassMGState(): void;
export declare function processPassMG(pass: RasterPass): void;
export declare function genHashValue(pass: RasterPass): void;
