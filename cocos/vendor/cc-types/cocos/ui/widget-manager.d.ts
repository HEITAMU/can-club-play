import { js } from '../core';
import { Node } from '../scene-graph/node';
import { AlignFlags, AlignMode, Widget } from './widget';
declare function updateAlignment(node: Node): void;
/**
 * @en widget Manager， use to align widget
 * @zh widget 管理器，用于对齐操作
 * @deprecated Since v3.7.0, this is an engine private interface that will be removed in the future.
 */
export declare const widgetManager: {
    isAligning: boolean;
    _nodesOrderDirty: boolean;
    _activeWidgetsIterator: js.array.MutableForwardIterator<Widget>;
    animationState: {
        previewing: boolean;
        time: number;
        animatedSinceLastFrame: boolean;
    } | null;
    init(): void;
    add(widget: Widget): void;
    remove(widget: Widget): void;
    onResized(): void;
    refreshWidgetOnResized(node: Node): void;
    updateOffsetsToStayPut(widget: Widget, e?: AlignFlags): void;
    updateAlignment: typeof updateAlignment;
    AlignMode: typeof AlignMode;
    AlignFlags: typeof AlignFlags;
};
export {};
