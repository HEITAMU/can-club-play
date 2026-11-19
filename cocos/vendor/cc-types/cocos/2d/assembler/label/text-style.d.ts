import { Color } from '../../../core';
import { IConfig } from '../../assets/bitmap-font';
import { SpriteFrame } from '../../assets/sprite-frame';
export declare class TextStyle {
    isBold: boolean;
    isItalic: boolean;
    isUnderline: boolean;
    underlineHeight: number;
    isOutlined: boolean;
    outlineColor: Color;
    outlineWidth: number;
    hasShadow: boolean;
    shadowColor: Color;
    shadowBlur: number;
    shadowOffsetX: number;
    shadowOffsetY: number;
    color: Color;
    fontSize: number;
    actualFontSize: number;
    isSystemFontUsed: boolean;
    originFontSize: number;
    bmfontScale: number;
    fontFamily: string;
    fontDesc: string;
    fntConfig: IConfig | null;
    spriteFrame: SpriteFrame | null;
    fontScale: number;
    reset(): void;
}
