import { Asset } from './asset';
/**
 * @en The asset for text file.
 * @zh 文本资源。
 */
export declare class TextAsset extends Asset {
    /**
     * @en The text content.
     * @zh 此资源包含的文本。
     */
    text: string;
    toString(): string;
    constructor(name?: string);
}
