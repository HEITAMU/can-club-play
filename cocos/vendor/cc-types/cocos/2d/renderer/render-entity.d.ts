import { NativeRenderEntity } from './native-2d';
import { RenderDrawInfo } from './render-draw-info';
import { Color } from '../../core';
import { Stage } from './stencil-manager';
import { Node } from '../../scene-graph';
export declare enum RenderEntityFillColorType {
    COLOR = 0,
    VERTEX = 1
}
export declare enum RenderEntityType {
    STATIC = 0,
    DYNAMIC = 1,
    CROSSED = 2
}
export declare enum MaskMode {
    NONE = 0,
    MASK = 1,
    MASK_INVERTED = 2,
    MASK_NODE = 3,
    MASK_NODE_INVERTED = 4
}
/** @mangle */
export declare class RenderEntity {
    private _renderEntityType;
    private _dynamicDrawInfoArr;
    protected _node: Node | null;
    protected _renderTransform: Node | null;
    protected _stencilStage: Stage;
    protected _colorDirty: boolean;
    protected _enabled: boolean;
    protected _useLocal: boolean;
    protected _maskMode: MaskMode;
    protected _uint32SharedBuffer: Uint32Array;
    protected _uint8SharedBuffer: Uint8Array;
    protected _boolSharedBuffer: Uint8Array;
    private _nativeObj;
    get nativeObj(): NativeRenderEntity;
    get renderDrawInfoArr(): RenderDrawInfo[];
    get renderEntityType(): RenderEntityType;
    setPriority(val: number): void;
    protected _color: Color;
    get color(): Color;
    set color(val: Color);
    get colorDirty(): boolean;
    set colorDirty(val: boolean);
    get enabled(): boolean;
    set enabled(val: boolean);
    setUseLocal(useLocal: boolean): void;
    constructor(entityType: RenderEntityType);
    addDynamicRenderDrawInfo(renderDrawInfo: RenderDrawInfo | null): void;
    removeDynamicRenderDrawInfo(): void;
    clearDynamicRenderDrawInfos(): void;
    clearStaticRenderDrawInfos(): void;
    clearRenderDrawInfos(): void;
    setDynamicRenderDrawInfo(renderDrawInfo: RenderDrawInfo | null, index: number): void;
    setMaskMode(mode: MaskMode): void;
    setFillColorType(fillColorType: RenderEntityFillColorType): void;
    getStaticRenderDrawInfo(): RenderDrawInfo | null;
    setNode(node: Node | null): void;
    setRenderTransform(renderTransform: Node | null): void;
    setStencilStage(stage: Stage): void;
    private initSharedBuffer;
}
