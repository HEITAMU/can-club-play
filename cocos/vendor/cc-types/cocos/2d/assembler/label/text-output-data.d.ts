import { Texture2D } from '../../../asset/assets';
import { Rect, Size, Vec2 } from '../../../core';
import { SpriteFrame } from '../../assets';
import { IRenderData } from './text-processing';
export declare class TextOutputLayoutData {
    parsedString: string[];
    nodeContentSize: Size;
    canvasSize: Size;
    canvasPadding: Rect;
    contentSizeExtend: Size;
    startPosition: Vec2;
    reset(): void;
}
export declare class TextOutputRenderData {
    quadCount: number;
    vertexBuffer: IRenderData[];
    texture: Texture2D | SpriteFrame | null;
    uiTransAnchorX: number;
    uiTransAnchorY: number;
    reset(): void;
}
