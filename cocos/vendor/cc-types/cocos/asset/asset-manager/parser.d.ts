import { IMemoryImageSource } from '../assets/image-asset';
import { CCON } from '../../serialization/ccon';
import { Asset } from '../assets';
export type ParseHandler = (file: any, options: Record<string, any>, onComplete: ((err: Error | null, data?: any) => void)) => void;
/**
 * @en
 * Parse the downloaded file, it's a singleton, you can access it via [[AssetManager.parser]].
 *
 * @zh
 * 解析已下载的文件，parser 是一个单例, 你能通过 [[assetManager.parser]] 访问它。
 *
 */
export declare class Parser {
    private _parsing;
    private _parsers;
    private static _instance;
    static get instance(): Parser;
    private constructor();
    /**
     * @engineInternal
     * @mangle
     */
    parseImage(file: HTMLImageElement | Blob, options: Record<string, any>, onComplete: ((err: Error | null, data?: HTMLImageElement | ImageBitmap | null) => void)): void;
    /**
     * @engineInternal
     * Don't mangle this function since it's used in platform adapter code.
     */
    parsePVRTex(file: ArrayBuffer | ArrayBufferView, options: Record<string, any>, onComplete: ((err: Error | null, data?: IMemoryImageSource | null) => void)): void;
    /**
     * @engineInternal
     * Don't mangle this function since it's used in platform adapter code.
     */
    parsePKMTex(file: ArrayBuffer | ArrayBufferView, options: Record<string, any>, onComplete: ((err: Error | null, data?: IMemoryImageSource | null) => void)): void;
    /**
     * @engineInternal
     * Don't mangle this function since it's used in platform adapter code.
     */
    parseASTCTex(file: ArrayBuffer | ArrayBufferView, options: Record<string, any>, onComplete: ((err: Error | null, data?: IMemoryImageSource | null) => void)): void;
    /**
     * @engineInternal
     * Don't mangle this function since it's used in platform adapter code.
     */
    parsePlist(file: string, options: Record<string, any>, onComplete: ((err: Error | null, data?: any) => void)): void;
    /**
     * @engineInternal
     * @mangle
     */
    parseImport(file: Record<string, any> | CCON, options: Record<string, any>, onComplete: ((err: Error | null, data?: Asset | null) => void)): void;
    /**
     * @engineInternal
     * @mangle
     */
    init(): void;
    /**
     * @en
     * Register custom handler if you want to change default behavior or extend parser to parse other format file.
     *
     * @zh
     * 当你想修改默认行为或者拓展 parser 来解析其他格式文件时可以注册自定义的 handler。
     *
     * @param type
     * @en Extension name likes '.jpg' or map likes {'.jpg': jpgHandler, '.png': pngHandler}.
     * @zh 形如 '.jpg' 的扩展名或形如 {'.jpg': jpgHandler, '.png': pngHandler} 的映射表。
     * @param handler @en The corresponding handler. @zh 对应扩展名的处理方法。
     * @param handler.file @en The file to be parsed. @zh 待解析的文件。
     * @param handler.options @en Some optional parameters. @zh 一些可选的参数。
     * @param handler.onComplete @en The callback invoked when parsing finished. @zh 完成解析的回调。
     *
     * @example
     * parser.register('.tga', (file, options, onComplete) => onComplete(null, null));
     * parser.register({'.tga': (file, options, onComplete) => onComplete(null, null),
     *                  '.ext': (file, options, onComplete) => onComplete(null, null)});
     *
     */
    register(type: string, handler: (file: any, options: Record<string, any>, onComplete: ((err: Error | null, data?: any) => void)) => void): void;
    register(map: Record<string, (file: any, options: Record<string, any>, onComplete: ((err: Error | null, data?: any) => void)) => void>): void;
    /**
     * @en
     * Use corresponding handler to parse file.
     *
     * @zh
     * 使用对应的 handler 来解析文件。
     *
     * @param id @en The id of file. @zh 文件的唯一 id。
     * @param file @en The data of file. @zh 文件的数据。
     * @param type @en The corresponding type of file, likes '.jpg'. @zh 需要使用的解析方法类型。
     * @param options @en Some optional parameters will be transferred to the corresponding handler. @zh 传递到解析方法的额外参数。
     * @param onComplete @en The callback invoked when finishing parsing. @zh 完成解析的回调。
     * @param onComplete.err @en The occurred error, null indicates success. @zh 解析过程中发生的错误，null 表明解析成功。
     * @param onComplete.content @en The parsed data. @zh 解析后的数据。
     *
     * @example
     * downloader.download('test.jpg', 'test.jpg', '.jpg', {}, (err, file) => {
     *      parser.parse('test.jpg', file, '.jpg', null, (err, img) => console.log(err));
     * });
     *
     */
    parse(id: string, file: any, type: string, options: Record<string, any>, onComplete: ((err: Error | null, data?: any) => void)): void;
}
declare const _default: Parser;
export default _default;
