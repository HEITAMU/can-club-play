/**
 * @packageDocumentation
 * @module ui-assembler
 */
import type { IAssembler } from '../../renderer/base';
import type { RenderData } from '../../renderer/render-data';
import type { IBatcher } from '../../renderer/i-batcher';
import type { Sprite } from '../../components';
/**
 * simple 组装器
 * 可通过 `UI.simple` 获取该组装器。
 */
declare class Simple implements IAssembler {
    createData(sprite: Sprite): RenderData;
    updateRenderData(sprite: Sprite): void;
    private updateWorldVerts;
    fillBuffers(sprite: Sprite, renderer: IBatcher): void;
    private updateVertexData;
    updateUVs(sprite: Sprite): void;
    updateColor(sprite: Sprite): void;
}
export declare const simple: Simple;
export {};
