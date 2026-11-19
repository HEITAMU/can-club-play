import { Event } from '../../input/types';
import { EventDispatcherPriority, IEventDispatcher } from '../../input/input';
declare class PointerEventDispatcher implements IEventDispatcher {
    priority: EventDispatcherPriority;
    private _isListDirty;
    private _inDispatchCount;
    private _pointerEventProcessorList;
    private _processorListToAdd;
    private _processorListToRemove;
    constructor();
    onThrowException(): void;
    dispatchEvent(event: Event): boolean;
    private addPointerEventProcessor;
    private removePointerEventProcessor;
    private dispatchEventMouse;
    private dispatchEventTouch;
    private _removeClaimedTouch;
    private _updatePointerEventProcessorList;
    private _sortPointerEventProcessorList;
    private _sortByPriority;
    private _markListDirty;
}
export declare const pointerEventDispatcher: PointerEventDispatcher;
export {};
