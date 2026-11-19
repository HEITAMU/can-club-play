import type { RenderData } from '../../renderer/render-data';
import type { IBatcher } from '../../renderer/i-batcher';
import type { Sprite } from '../../components';
import type { IAssembler } from '../../renderer/base';
/**
 * radialFilled 组装器
 * 可通过 `UI.radialFilled` 获取该组装器。
 */
declare class RadialFilled implements IAssembler {
    createData(sprite: Sprite): RenderData;
    updateRenderData(sprite: Sprite): void;
    private createQuadIndices;
    fillBuffers(comp: Sprite, renderer: IBatcher): void;
    private updateWorldUVData;
    private updateWorldVertexAndUVData;
    updateUVs(sprite: Sprite): void;
    private updateColorLate;
    updateColor(sprite: Sprite): void;
}
export declare const radialFilled: RadialFilled;
export {};
