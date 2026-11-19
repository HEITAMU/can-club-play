import type { Label } from '../../components';
import { BmfontUtils } from './bmfontUtils';
import { LetterRenderTexture } from './font-utils';
export declare class LetterFont extends BmfontUtils {
    getAssemblerData(): LetterRenderTexture | null;
    protected _updateFontFamily(comp: Label): void;
    protected _getFontFamily(comp: Label): string;
    protected _updateLabelInfo(comp: Label): void;
    protected _getFontDesc(): string;
}
