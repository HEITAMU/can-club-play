import { Asset } from './asset';
/**
 * @en Json asset, it will automatically parse the json to a JS object.
 * @zh Json 资源。
 * Json 资源加载后将直接解析为对象。如果你希望获得 JSON 的原始文本，你需要使用文本资源（使用文件名后缀“.txt”）。
 */
export default class JsonAsset extends Asset {
    /**
     * @en The parsed JS object
     * @zh 解析后的对象。
     */
    json: Record<string, any> | null;
    constructor(name?: string);
}
