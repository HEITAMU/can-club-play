import type { IBatcher } from '../../renderer/i-batcher';
import type { Label } from '../../components/label';
import type { IAssembler } from '../../renderer/base';
import { TTFUtils } from './ttfUtils';
import type { RenderData } from '../../renderer/render-data';
/**
 * ttf 组装器
 * 可通过 `UI.ttf` 获取该组装器。
 */
export declare class TTF extends TTFUtils implements IAssembler {
    createData(comp: Label): RenderData;
    fillBuffers(comp: Label, renderer: IBatcher): void;
    updateVertexData(comp: Label): void;
    updateUVs(comp: Label): void;
    updateColor(comp: Label): void;
}
export declare const ttf: TTF;
