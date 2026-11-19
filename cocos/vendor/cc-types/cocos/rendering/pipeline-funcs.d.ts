import { CommandBuffer, Device, RenderPass } from '../gfx';
import { IVec4Like } from '../core';
import { Camera, Model } from '../render-scene/scene';
/**
 * @en Convert color in SRGB space to linear space
 * @zh SRGB 颜色空间转换为线性空间。
 * @param out Output color object
 * @param gamma Gamma value in SRGB space
 */
export declare function SRGBToLinear(out: IVec4Like, gamma: IVec4Like): void;
/**
 * @en Convert color in linear space to SRGB space
 * @zh 线性空间转换为 SRGB 颜色空间。
 * @param out Output color object
 * @param linear Color value in linear space
 */
export declare function LinearToSRGB(out: IVec4Like, linear: IVec4Like): void;
export declare function getProfilerCamera(): Camera | null;
export declare function decideProfilerCamera(cameras: Camera[]): void;
export declare function renderProfiler(device: Device, renderPass: RenderPass, cmdBuff: CommandBuffer, profiler: Model | null, camera: Camera): void;
