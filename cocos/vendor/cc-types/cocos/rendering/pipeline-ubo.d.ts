import { Device, DescriptorSet } from '../gfx';
import { Camera } from '../render-scene/scene/camera';
import { Mat4, Color } from '../core';
import { PipelineRuntime } from './custom/pipeline';
import { Shadows } from '../render-scene/scene/shadows';
import { Light } from '../render-scene/scene/light';
import { DirectionalLight } from '../render-scene/scene';
import { RenderWindow } from '../render-scene/core/render-window';
export declare class PipelineUBO {
    static updateGlobalUBOView(window: RenderWindow, bufferView: Float32Array): void;
    static updateCameraUBOView(pipeline: PipelineRuntime, bufferView: Float32Array, camera: Camera): void;
    static getPCFRadius(shadowInfo: Shadows, mainLight: DirectionalLight): number;
    static updatePlanarNormalAndDistance(shadowInfo: Shadows, shadowUBO: Float32Array): void;
    static updateShadowUBOView(pipeline: PipelineRuntime, shadowBufferView: Float32Array, csmBufferView: Float32Array, camera: Camera): void;
    static updateShadowUBOLightView(pipeline: PipelineRuntime, shadowBufferView: Float32Array, light: Light, level: number): void;
    protected _globalUBO: Float32Array;
    protected _cameraUBO: Float32Array;
    protected _shadowUBO: Float32Array;
    protected _csmUBO: Float32Array;
    static _combineSignY: number;
    protected _device: Device;
    protected _pipeline: PipelineRuntime;
    /**
     *|combinedSignY|clipSpaceSignY|screenSpaceSignY| Backends   |
     *|    :--:     |    :--:      |      :--:      |   :--:     |
     *|      0      |      -1      |      -1        |  Vulkan    |
     *|      1      |       1      |      -1        |Metal/WebGPU|
     *|      2      |      -1      |       1        |            |
     *|      3      |       1      |       1        |  GL-like   |
     */
    static getCombineSignY(): number;
    private _initCombineSignY;
    activate(device: Device, pipeline: PipelineRuntime): void;
    /**
     * @en Update all UBOs
     * @zh 更新全部 UBO。
     */
    updateGlobalUBO(window: RenderWindow): void;
    updateCameraUBO(camera: Camera): void;
    updateShadowUBO(camera: Camera): void;
    updateShadowUBOLight(globalDS: DescriptorSet, light: Light, level?: number): void;
    updateShadowUBORange(offset: number, data: Mat4 | Color): void;
    destroy(): void;
}
