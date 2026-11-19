import type { RenderData } from '../../renderer/render-data';
import type { IBatcher } from '../../renderer/i-batcher';
import type { Sprite } from '../../components/sprite';
import type { UIRenderer } from '../../framework/ui-renderer';
import type { IAssembler } from '../../renderer/base';
declare class Tiled implements IAssembler {
    createData(sprite: UIRenderer): RenderData;
    updateRenderData(sprite: Sprite): void;
    private createQuadIndices;
    updateUVs(sprite: Sprite): void;
    fillBuffers(sprite: Sprite, renderer: IBatcher): void;
    private updateWorldUVData;
    private updateWorldVertexAndUVData;
    private updateVerts;
    private updateColorLate;
    updateColor(sprite: Sprite): void;
}
export declare const tiled: Tiled;
export {};
