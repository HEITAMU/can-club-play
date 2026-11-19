import { InstancedBuffer } from './instanced-buffer';
import { Device, RenderPass, CommandBuffer, DescriptorSet } from '../gfx';
/**
 * @en Render queue for instanced batching
 * @zh 渲染合批队列。
 */
export declare class RenderInstancedQueue {
    /**
     * @en A set of instanced buffer
     * @zh Instance 合批缓存集合。
     */
    queue: Set<InstancedBuffer>;
    private _renderQueue;
    /**
     * @en Clear the render queue
     * @zh 清空渲染队列。
     */
    clear(): void;
    sort(): void;
    uploadBuffers(cmdBuff: CommandBuffer): void;
    /**
     * @en Record command buffer for the current queue
     * @zh 记录命令缓冲。
     * @param cmdBuff The command buffer to store the result
     */
    recordCommandBuffer(device: Device, renderPass: RenderPass, cmdBuff: CommandBuffer, descriptorSet?: DescriptorSet | null, dynamicOffsets?: Readonly<number[]>): void;
}
