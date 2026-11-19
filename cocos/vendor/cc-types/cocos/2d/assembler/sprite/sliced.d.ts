import type { RenderData } from '../../renderer/render-data';
import type { IBatcher } from '../../renderer/i-batcher';
import type { Sprite } from '../../components';
import type { IAssembler } from '../../renderer/base';
/**
 * sliced 组装器
 * 可通过 `UI.sliced` 获取该组装器。
 */
declare class Sliced implements IAssembler {
    private QUAD_INDICES;
    createData(sprite: Sprite): RenderData;
    private createQuadIndices;
    updateRenderData(sprite: Sprite): void;
    private updateVertexData;
    fillBuffers(sprite: Sprite, renderer: IBatcher): void;
    private updateWorldVertexData;
    updateUVs(sprite: Sprite): void;
    updateColor(sprite: Sprite): void;
}
export declare const sliced: Sliced;
export {};
