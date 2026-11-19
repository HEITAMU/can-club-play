import { BasicPipeline, PipelineBuilder } from './pipeline';
import { Camera } from '../../render-scene/scene/camera';
import { RenderWindow } from '../../render-scene/core/render-window';
export { packRGBE } from '../../core/math/color';
export declare function setEditorPipelineSettings(settings: object | null): void;
export declare function getEditorPipelineSettings(): object | null;
export declare function forceResizeAllWindows(): void;
export declare function defaultWindowResize(ppl: BasicPipeline, window: RenderWindow, width: number, height: number): void;
export declare function dispatchResizeEvents(cameras: Camera[], builder: PipelineBuilder, ppl: BasicPipeline): void;
