import { Label } from '../../components';
import type { ISharedLabelData } from './font-utils';
import type { UITransform } from '../../framework/ui-transform';
import type { TextOutputLayoutData, TextOutputRenderData } from './text-output-data';
import type { TextStyle } from './text-style';
import type { TextLayout } from './text-layout';
export declare class TTFUtils {
    updateProcessingData(style: TextStyle, layout: TextLayout, outputLayoutData: TextOutputLayoutData, outputRenderData: TextOutputRenderData, comp: Label, trans: UITransform): void;
    getAssemblerData(): ISharedLabelData;
    resetAssemblerData(assemblerData: ISharedLabelData): void;
    updateRenderData(comp: Label): void;
    generateVertexData(style: TextStyle, outputLayoutData: TextOutputLayoutData, outputRenderData: TextOutputRenderData): void;
    updateVertexData(comp: Label): void;
    updateUVs(comp: Label): void;
    _updateFontFamily(comp: Label): string;
    _calDynamicAtlas(comp: Label, outputLayoutData: TextOutputLayoutData): void;
    _resetDynamicAtlas(comp: Label): void;
}
