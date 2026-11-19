import type { IBatcher } from '../../renderer/i-batcher';
import type { Label } from '../../components/label';
import type { IAssembler } from '../../renderer/base';
import { BmfontUtils } from './bmfontUtils';
import type { RenderData } from '../../renderer/render-data';
/**
 * bmfont 组装器
 * 可通过 `UI.bmfont` 获取该组装器。
 */
declare class Bmfont extends BmfontUtils implements IAssembler {
    createData(comp: Label): RenderData;
    fillBuffers(comp: Label, renderer: IBatcher): void;
}
export declare const bmfont: Bmfont;
export {};
