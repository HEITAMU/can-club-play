import { Font } from './font';
import { SpriteFrame } from './sprite-frame';
import { IShareLabelInfo } from '../assembler/label/font-utils';
import { TextureBase } from '../../asset/assets/texture-base';
export interface IConfig {
    [key: string]: any;
}
export declare class FontLetterDefinition {
    u: number;
    v: number;
    w: number;
    h: number;
    offsetX: number;
    offsetY: number;
    valid: boolean;
    xAdvance: number;
}
export interface ILetterDefinition {
    [key: string]: FontLetterDefinition;
}
export declare class FontAtlas {
    letterDefinitions: ILetterDefinition;
    _texture: TextureBase | null;
    constructor(texture: TextureBase | null);
    set texture(texture: TextureBase | null);
    get texture(): TextureBase | null;
    addLetterDefinitions(letter: string, letterDefinition: FontLetterDefinition): void;
    cloneLetterDefinition(): ILetterDefinition;
    getTexture(): TextureBase | null;
    getLetter(key: string): FontLetterDefinition;
    getLetterDefinitionForChar(char: string, labelInfo?: IShareLabelInfo): FontLetterDefinition | null;
    clear(): void;
}
/**
 * @en Class for BitmapFont handling.
 * @zh 位图字体资源类。
 */
export declare class BitmapFont extends Font {
    /**
     * @deprecated since v3.7.0, Useless Code.
     */
    fntDataStr: string;
    /**
     * @en [[SpriteFrame]] of the bitmap font.
     * @zh 位图字体所使用的精灵。
     */
    spriteFrame: SpriteFrame | null;
    /**
     * @en The font size.
     * @zh 文字尺寸。
     */
    fontSize: number;
    /**
     * @en Font configuration.
     * @zh 字体配置。
     */
    fntConfig: IConfig | null;
    /**
     * @deprecated since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    fontDefDictionary: FontAtlas;
    constructor();
    onLoaded(): void;
}
