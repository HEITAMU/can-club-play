import { SpriteFrame } from '../../assets/sprite-frame';
import { Rect } from '../../../core';
import { Label } from '../../components/label';
import { UITransform } from '../../framework/ui-transform';
import { TextOutputLayoutData, TextOutputRenderData } from './text-output-data';
import { TextStyle } from './text-style';
import { TextLayout } from './text-layout';
export declare class BmfontUtils {
    updateProcessingData(style: TextStyle, layout: TextLayout, outputLayoutData: TextOutputLayoutData, outputRenderData: TextOutputRenderData, comp: Label, trans: UITransform): void;
    updateRenderData(comp: Label): void;
    updateUVs(label: Label): void;
    updateColor(label: Label): void;
    protected resetRenderData(comp: Label): void;
    protected generateVertexData(style: TextStyle, outputLayoutData: TextOutputLayoutData, outputRenderData: TextOutputRenderData, offset: number, spriteFrame: SpriteFrame, rect: Rect, rotated: boolean, x: number, y: number): void;
    protected _updateFontFamily(comp: Label): void;
    protected _updateLabelInfo(comp: Label): void;
    protected _resetProperties(): void;
    protected createQuadIndices(indexCount: number): void;
}
