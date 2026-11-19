import { CommandBuffer } from './command-buffer';
import { GFXObject, QueueType, QueueInfo } from './define';
/**
 * @en GFX Queue.
 * @zh GFX 队列。
 */
export declare abstract class Queue extends GFXObject {
    /**
     * @en Get current type.
     * @zh 队列类型。
     */
    get type(): number;
    /** @mangle */
    protected _type: QueueType;
    constructor();
    abstract initialize(info: Readonly<QueueInfo>): void;
    abstract destroy(): void;
    /**
     * @en Submit command buffers.
     * @zh 提交命令缓冲数组。
     * @param cmdBuffs The command buffers to be submitted.
     * @param fence The syncing fence.
     */
    abstract submit(cmdBuffs: Readonly<CommandBuffer[]>): void;
}
