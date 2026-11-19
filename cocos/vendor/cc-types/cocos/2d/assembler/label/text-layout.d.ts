import { Size } from '../../../core';
export declare class TextLayout {
    horizontalAlign: number;
    verticalAlign: number;
    wrapping: boolean;
    overFlow: number;
    lineHeight: number;
    maxLineWidth: number;
    spacingX: number;
    textWidthTemp: number;
    textHeightTemp: number;
    textDimensions: Size;
    horizontalKerning: number[];
    numberOfLines: number;
    linesOffsetX: number[];
    letterOffsetY: number;
    tailoredTopY: number;
    tailoredBottomY: number;
    textDesiredHeight: number;
    linesWidth: number[];
    reset(): void;
}
