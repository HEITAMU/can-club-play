/**
 * @en Joins strings to be a path.
 * @zh 拼接字符串为路径。
 * @param segments @en Strings to be joined. @zh 被拼接的字符串数组。
 * @returns @en The final path. @zh 拼接后的路径。
 * @example {@link cocos/core/utils/CCPath/join.js}
 */
export declare function join(...segments: string[]): string;
/**
 * @en Gets the extension name of a path including '.', like '.png'.
 * @zh 返回 Path 的扩展名，包括 '.'，例如 '.png'。
 * @param path @en A file path. @zh 文件路径。
 * @returns @en The extension name. @zh 扩展名。
 * @example {@link cocos/core/utils/CCPath/extname.js}
 */
export declare function extname(path: string): string;
/**
 * @en Gets the main name of a file name, exclude extension name.
 * @zh 获取文件名的主名称。
 * @deprecated
 */
export declare function mainFileName(fileName: string): string;
/**
 * @en Gets the file name of a file path, exclude extension name and directory name.
 * @zh 获取文件路径的文件名，不包含扩展名和目录名。
 * @param path @en A file path. @zh 文件路径。
 * @param extName @en File extension name. @zh 文件扩展名。
 * @returns @en The file name. @zh 文件名。
 * @example {@link cocos/core/utils/CCPath/basename.js}
 */
export declare function basename(path: string, extName?: string): string;
/**
 * @en Gets directory name of a file path.
 * @zh 获取文件路径的目录名。
 * @param path @en A file path. @zh 文件路径。
 * @returns @en Directory name. @zh 文件目录名。
 * @example {@link cocos/core/utils/CCPath/dirname.js}
 */
export declare function dirname(path: string): string;
/**
 * @en Changes file extension name.
 * @zh 更改文件的扩展名。
 * @param path @en A file path. @zh 文件路径。
 * @param extName @en New file extension name. @zh 新文件扩展名。
 * @returns @en New file path. @zh 新的文件路径。
 * @example {@link cocos/core/utils/CCPath/changeExtname.js}
 */
export declare function changeExtname(path: string, extName?: string): string;
/**
 * @en Changes file name of a file path.
 * @zh 更改文件路径的文件名。
 * @param path @en A file path. @zh 文件路径。
 * @param newBaseName @en New file name. @zh 新文件名。
 * @param keepExt @en Whether to keep extension name. @zh 是否保留扩展名。
 * @returns @en New file path. @zh 新文件路径。
 * @example {@link cocos/core/utils/CCPath/changeBasename.js}
 */
export declare function changeBasename(path: string, newBaseName: string, keepExt?: boolean): string;
export declare function _normalize(url: any): any;
/**
 * @en Removes the last path separator('/' or '\') of a path if exist.
 * @zh 如果存在的话，删除文件路径的最后一个分隔符（'/' 或者 '\'）。
 * @param path @en A file path to modify. @zh 要修改的文件路径。
 * @returns @en A new file path without last file separator.
 * @zh 路径最后分隔符的新路径。
 */
export declare function stripSep(path: string): string;
/**
 * @en Gets file separator for different platforms. It is `/` on unix like platforms,
 * and `\` on windows.
 * @zh 获取不同平台的文件分割符。类 unix 系统是 `/`，windows 系统是 `\`。
 * @returns @en File separator. @zh 文件分割符。
 */
export declare function getSeperator(): string;
