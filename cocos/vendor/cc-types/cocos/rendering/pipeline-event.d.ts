import { EventTarget } from '../core';
export declare enum PipelineEventType {
    /**
     * @en
     * The event type for render frame begin event
     *
     * @zh
     * 帧渲染开始事件。
     */
    RENDER_FRAME_BEGIN = "render-frame-begin",
    /**
      * @en
      * The event type for render frame end event
      *
      * @zh
      * 帧渲染结束事件。
      */
    RENDER_FRAME_END = "render-frame-end",
    /**
     * @en
     * The event type for render camera begin event
     *
     * @zh
     * 相机渲染开始事件。
     */
    RENDER_CAMERA_BEGIN = "render-camera-begin",
    /**
     * @en
     * The event type for render camera end event
     *
     * @zh
     * 相机渲染结束事件。
     */
    RENDER_CAMERA_END = "render-camera-end",
    /**
      * @en
      * FBO attachment texture zoom event
      *
      * @zh
      * FBO附件纹理缩放事件。
      */
    ATTACHMENT_SCALE_CAHNGED = "attachment-scale-changed"
}
export type PipelineEventCallback = (...args: any[]) => void;
export declare class PipelineEventProcessor extends EventTarget implements IPipelineEvent {
    eventTargetOn: <TFunction extends (...args: any[]) => void>(type: string | number, callback: TFunction, thisArg?: any, once?: boolean | undefined) => TFunction;
    eventTargetOnce: <TFunction extends (...args: any[]) => void>(type: string | number, callback: TFunction, thisArg?: any) => TFunction;
    constructor();
    on<TFunction extends PipelineEventCallback>(type: PipelineEventType, callback: TFunction, target?: any, once?: boolean): typeof callback;
    once<TFunction extends PipelineEventCallback>(type: PipelineEventType, callback: TFunction, target?: any): typeof callback;
}
export interface IPipelineEvent {
    on(type: PipelineEventType, callback: PipelineEventCallback, target?: any, once?: boolean): typeof callback;
    once(type: PipelineEventType, callback: PipelineEventCallback, target?: any): typeof callback;
    off(type: PipelineEventType, callback?: PipelineEventCallback, target?: any): void;
    emit(type: PipelineEventType, arg0?: any, arg1?: any, arg2?: any, arg3?: any, arg4?: any): void;
    targetOff(typeOrTarget: any): void;
    removeAll(typeOrTarget: any): void;
    hasEventListener(type: PipelineEventType, callback?: PipelineEventCallback, target?: any): boolean;
}
