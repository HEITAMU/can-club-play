import { Font } from './font';
/**
 * @en Class for TTFFont asset.
 * @zh TTF 字体资源类。
 */
export declare class TTFFont extends Font {
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    _fontFamily: string | null;
    constructor();
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    get _nativeAsset(): string | null;
    set _nativeAsset(value: string | null);
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    get _nativeDep(): {
        uuid: string;
        __nativeName__: string;
        ext: string;
        __isNative__: boolean;
    };
    /**
     * @en default init.
     * @zh 默认初始化。
     * @param uuid @en Asset uuid. @zh 资源 uuid。
     * @deprecated since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    initDefault(uuid?: string): void;
}
