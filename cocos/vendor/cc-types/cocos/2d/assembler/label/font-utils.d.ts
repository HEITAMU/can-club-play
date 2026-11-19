import { FontAtlas, FontLetterDefinition } from '../../assets/bitmap-font';
import { Color } from '../../../core';
import { ImageAsset, Texture2D } from '../../../asset/assets';
import { TextureBase } from '../../../asset/assets/texture-base';
export interface ISharedLabelData {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D | null;
}
export declare class CanvasPool {
    static getInstance(): CanvasPool;
    private constructor();
    pool: ISharedLabelData[];
    get(): ISharedLabelData;
    put(canvas: ISharedLabelData): void;
}
interface ILabelInfo {
    fontSize: number;
    lineHeight: number;
    hash: string;
    fontFamily: string;
    fontDesc: string;
    hAlign: number;
    vAlign: number;
    color: Color;
    isOutlined: boolean;
    out: Color;
    margin: number;
    fontScale: number;
}
declare class LetterTexture {
    image: ImageAsset | null;
    labelInfo: ILabelInfo;
    char: string;
    data: ISharedLabelData | null;
    canvas: HTMLCanvasElement | null;
    context: CanvasRenderingContext2D | null;
    width: number;
    height: number;
    offsetY: number;
    hash: string;
    constructor(char: string, labelInfo: ILabelInfo);
    updateRenderData(): void;
    destroy(): void;
    private _updateProperties;
    private _updateTexture;
}
export declare class LetterRenderTexture extends Texture2D {
    /**
     * @en
     * Init the render texture with size.
     * @zh
     * 初始化 render texture。
     * @param [width]
     * @param [height]
     * @param [string]
     */
    initWithSize(width: number, height: number, format?: number): void;
    /**
     * @en Draw a texture to the specified position
     * @zh 将指定的图片渲染到指定的位置上。
     * @param {Texture2D} image
     * @param {Number} x
     * @param {Number} y
     */
    drawTextureAt(image: ImageAsset, x: number, y: number): void;
}
export declare class LetterAtlas {
    get width(): number;
    get height(): number;
    private _x;
    private _y;
    private _nextY;
    private _width;
    private _height;
    private _halfBleed;
    fontDefDictionary: FontAtlas;
    private _dirty;
    constructor(width: number, height: number);
    insertLetterTexture(letterTexture: LetterTexture): FontLetterDefinition | null;
    update(): void;
    reset(): void;
    destroy(): void;
    getTexture(): TextureBase | null;
    beforeSceneLoad(): void;
    clearAllCache(): void;
    getLetter(key: string): FontLetterDefinition;
    getLetterDefinitionForChar(char: string, labelInfo: ILabelInfo): FontLetterDefinition | null;
}
export interface IShareLabelInfo {
    fontAtlas: FontAtlas | LetterAtlas | null;
    fontSize: number;
    lineHeight: number;
    hAlign: number;
    vAlign: number;
    hash: string;
    fontFamily: string;
    fontDesc: string;
    color: Color;
    isOutlined: boolean;
    out: Color;
    margin: number;
    fontScale: number;
}
export declare const shareLabelInfo: IShareLabelInfo;
export declare function computeHash(labelInfo: any): string;
export {};
