import type { IBatcher } from '../../renderer/i-batcher';
import type { Label } from '../../components/label';
import { LetterFont } from './letter-font';
import type { RenderData } from '../../renderer/render-data';
import type { IAssembler } from '../../renderer/base';
/**
 * letter 组装器
 * 可通过 `UI.letter` 获取该组装器。
 */
declare class Letter extends LetterFont implements IAssembler {
    createData(comp: Label): RenderData;
    fillBuffers(comp: Label, renderer: IBatcher): void;
    updateColor(label: Label): void;
}
export declare const letter: Letter;
export {};
