import { UIRenderer } from '../framework/ui-renderer';
import { IBatcher } from '../renderer/i-batcher';
import { DrawBatch2D } from '../renderer/draw-batch';
import { Color } from '../../core';
import { StaticVBAccessor } from '../renderer/static-vb-accessor';
import type { Batcher2D } from '../renderer/batcher-2d';
/**
 * @en
 * Static batch component of UI.
 * This component is placed on the root node of all node objects that need to be batch.
 * Only sprites and label participate in the batch.
 * Static batch must be enabled manually, otherwise dynamic batch is still used.
 * Note: Do not place mask, Graphics, and objects such as UI models or particles under child nodes,
 * otherwise rendering will be skipped after static batching is enabled.
 *
 * @zh
 * UI 静态合批组件。
 * 该组件放在所有需要被静态合批的节点对象的根节点上，子节点放置对象必须是精灵和文本，其余对象不参与静态合批。
 * 用户必须通过手动方式启用收集静态合批数据[[markAsDirty]]，否则合批方式仍然采用动态合批（采集数据的流程相同）。此后渲染的内容是采用收集到的合批渲染数据，子节点的任何修改将不再有效。
 * 注意：子节点下不要放置 Mask，Graphics，以及 UI 模型或者粒子之类对象，否则会在启用完静态合批后跳过渲染。
 *
 * @deprecated Since v3.4.1, We have adopted a new rendering batching policy in v3.4.1,
 * which will result in an effective performance improvement for normal dynamic batching components,
 * so manual management with the UIStaticBatch component is no longer recommended and will be removed in the future
 */
export declare class UIStaticBatch extends UIRenderer {
    constructor();
    get color(): Readonly<Color>;
    set color(value: Readonly<Color>);
    get drawBatchList(): DrawBatch2D[];
    protected _init: boolean;
    protected _bufferAccessor: StaticVBAccessor | null;
    protected _dirty: boolean;
    private _uiDrawBatchList;
    postUpdateAssembler(render: IBatcher): void;
    /**
     * @en
     * Recollect data tags.
     * The render data will be recollected during the render phase of the current frame, and the next frame will be rendered using fixed data.
     * Note: 尽量不要频繁调用此接口, 会有一定内存损耗.
     *
     * @zh
     * 重新采集数据标记，会在当前帧的渲染阶段重新采集渲染数据，下一帧开始将会使用固定数据进行渲染。
     * 注意：尽量不要频繁调用此接口，因为会清空原先存储的 ia 数据重新采集，会有一定内存损耗。
     */
    markAsDirty(): void;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _requireDrawBatch(): DrawBatch2D;
    protected _clearData(): void;
    protected _getBatcher(): Batcher2D | null;
}
