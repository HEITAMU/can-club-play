import type { RenderData } from '../../renderer/render-data';
import type { IBatcher } from '../../renderer/i-batcher';
import { Sprite } from '../../components';
import type { IAssembler } from '../../renderer/base';
/**
 * barFilled 组装器
 * 可通过 `UI.barFilled` 获取该组装器。
 */
declare class BarFilled implements IAssembler {
    updateRenderData(sprite: Sprite): void;
    updateUVs(sprite: Sprite, fillStart: number, fillEnd: number): void;
    private updateVertexData;
    createData(sprite: Sprite): RenderData;
    private updateWorldVertexData;
    fillBuffers(sprite: Sprite, renderer: IBatcher): void;
    updateColor(sprite: Sprite): void;
}
export declare const barFilled: BarFilled;
export {};
