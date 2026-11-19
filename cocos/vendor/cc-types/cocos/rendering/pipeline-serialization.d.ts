import { AccessFlagBit, Format, LoadOp, StoreOp, TextureType, TextureUsageBit } from '../gfx';
import { RenderTexture } from '../asset/assets/render-texture';
import { Material } from '../asset/assets/material';
/**
 * @en The tag of the render flow, including SCENE, POSTPROCESS and UI.
 * @zh 渲染流程的标签，包含：常规场景（SCENE），后处理（POSTPROCESS），UI 界面（UI）
 */
export declare enum RenderFlowTag {
    SCENE = 0,
    POSTPROCESS = 1,
    UI = 2
}
export declare class RenderTextureDesc {
    name: string;
    type: TextureType;
    usage: TextureUsageBit;
    format: Format;
    width: number;
    height: number;
}
export declare class RenderTextureConfig {
    name: string;
    texture: RenderTexture | null;
}
export declare class MaterialConfig {
    name: string;
    material: Material | null;
}
export declare class FrameBufferDesc {
    name: string;
    renderPass: number;
    colorTextures: string[];
    depthStencilTexture: string;
    texture: RenderTexture | null;
}
export declare class ColorDesc {
    format: Format;
    loadOp: LoadOp;
    storeOp: StoreOp;
    sampleCount: number;
    beginAccesses: AccessFlagBit;
    endAccesses: AccessFlagBit;
}
export declare class DepthStencilDesc {
    format: Format;
    depthLoadOp: LoadOp;
    depthStoreOp: StoreOp;
    stencilLoadOp: LoadOp;
    stencilStoreOp: StoreOp;
    sampleCount: number;
    beginAccesses: AccessFlagBit;
    endAccesses: AccessFlagBit;
}
export declare class RenderPassDesc {
    index: number;
    colorAttachments: never[];
    depthStencilAttachment: DepthStencilDesc;
}
export declare enum RenderQueueSortMode {
    FRONT_TO_BACK = 0,
    BACK_TO_FRONT = 1
}
/**
 * @en The render queue descriptor
 * @zh 渲染队列描述信息
 */
export declare class RenderQueueDesc {
    /**
     * @en Whether the render queue is a transparent queue
     * @zh 当前队列是否是半透明队列
     */
    isTransparent: boolean;
    /**
     * @en The sort mode of the render queue
     * @zh 渲染队列的排序模式
     */
    sortMode: RenderQueueSortMode;
    /**
     * @en The stages using this queue
     * @zh 使用当前渲染队列的阶段列表
     */
    stages: string[];
}
