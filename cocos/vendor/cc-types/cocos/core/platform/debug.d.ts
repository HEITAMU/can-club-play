export type StringSubstitution = number | string;
/**
 * @en Outputs a log message to the console.
 *     The message may be a single string (with optional substitution values), or it may be any one or more JavaScript objects.
 * @zh 向控制台输出一条日志信息。这条信息可能是单个字符串（包括可选的替代字符串），也可能是一个或多个对象。
 */
export declare function log(...data: unknown[]): void;
/**
 * @en Outputs a warning message to the console.
 *     The message may be a single string (with optional substitution values), or it may be any one or more JavaScript objects.
 *     - In Cocos Creator, warning is yellow.
 *     - In Chrome, warning have a yellow warning icon with the message text.
 * @zh 向控制台输出一条警告信息。这条信息可能是单个字符串（包括可选的替代字符串），也可能是一个或多个对象。
 *     - 在 Cocos Creator 中，警告信息显示是黄色的。<br/>
 *     - 在 Chrome 中，警告信息有着黄色的图标以及黄色的消息文本。<br/>
 */
export declare function warn(...data: unknown[]): void;
/**
 * @en Outputs an error message to the console.
 *     The message may be a single string (with optional substitution values), or it may be any one or more JavaScript objects.
 *     - In Cocos Creator, error is red.<br/>
 *     - In Chrome, error have a red icon along with red message text.<br/>
 * @zh 向控制台输出一条错误信息。这条信息可能是单个字符串（包括可选的替代字符串），也可能是一个或多个对象。
 *     - 在 Cocos Creator 中，错误信息显示是红色的。<br/>
 *     - 在 Chrome 中，错误信息有红色的图标以及红色的消息文本。<br/>
 */
export declare function error(...data: unknown[]): void;
/**
 * @en
 * Assert the condition and output error messages if the condition is not true.
 * @zh
 * 对检查测试条件进行检查，如果条件不为 true 则输出错误消息
 * @param condition @zh 需要检查的条件。 @en The condition to check on.
 * @param message @zh 包含零个或多个需要替换的JavaScript字符串。@en JavaScript objects to replace substitution strings in msg.
 * @param optionalParams  @zh 用来替换在message中需要替换的JavaScript对象。@en JavaScript objects with which to replace substitution strings within msg.
 * This gives you additional control over the format of the output.
 */
export declare function assert(condition: boolean, message?: string, ...optionalParams: StringSubstitution[]): asserts condition;
/**
 * @en Outputs a message at the "debug" log level.
 * @zh 输出一条“调试”日志等级的消息。
 * @param data @zh 输出的消息对象。 @en The output message object.
 */
export declare function debug(...data: unknown[]): void;
/**
 * @engineInternal
 */
export declare function _resetDebugSetting(mode: DebugMode): void;
export declare function _throw(error_: any): any;
export declare function logID(id: number, ...optionalParams: StringSubstitution[]): void;
export declare function debugID(id: number, ...optionalParams: StringSubstitution[]): void;
export declare function warnID(id: number, ...optionalParams: StringSubstitution[]): void;
export declare function errorID(id: number, ...optionalParams: StringSubstitution[]): void;
export declare function assertID(condition: boolean, id: number, ...optionalParams: StringSubstitution[]): void;
/**
 * @en Enum for debug modes.
 * @zh 调试模式。
 */
export declare enum DebugMode {
    /**
     * @en The debug mode none.
     * @zh 禁止模式，禁止显示任何日志消息。
     */
    NONE = 0,
    /**
     * @en The debug mode none.
     * @zh 调试模式，显示所有日志消息。
     */
    VERBOSE = 1,
    /**
     * @en Information mode, which display messages with level higher than "information" level.
     * @zh 信息模式，显示“信息”级别以上的日志消息。
     */
    INFO = 2,
    /**
     * @en Information mode, which display messages with level higher than "warning" level.
     * @zh 警告模式，显示“警告”级别以上的日志消息。
     */
    WARN = 3,
    /**
     * @en Information mode, which display only messages with "error" level.
     * @zh 错误模式，仅显示“错误”级别的日志消息。
     */
    ERROR = 4,
    /**
     * @en The debug mode info for web page.
     * @zh 信息模式（仅 WEB 端有效），在画面上输出所有信息。
     */
    INFO_FOR_WEB_PAGE = 5,
    /**
     * @en The debug mode warn for web page.
     * @zh 警告模式（仅 WEB 端有效），在画面上输出 warn 级别以上的（包含 error）信息。
     */
    WARN_FOR_WEB_PAGE = 6,
    /**
     * @en The debug mode error for web page.
     * @zh 错误模式（仅 WEB 端有效），在画面上输出 error 信息。
     */
    ERROR_FOR_WEB_PAGE = 7
}
/**
 * @en Gets error message with the error id and possible parameters.
 * @zh 通过 error id 和必要的参数来获取错误信息。
 * @param errorId @zh 错误的ID。@en Error id.
 * @param param @zh 输出日志。@en Output log.
 */
export declare function getError(errorId: number, ...param: StringSubstitution[]): string;
/**
 * @en Returns whether or not to display the FPS and debug information.
 * @zh 是否显示 FPS 信息和部分调试信息。
 * @deprecated @zh 从v3.6开始不再支持，请使用 profiler.isShowingStates。@en Since v3.6, Please use profiler.isShowingStates instead.
 */
export declare function isDisplayStats(): boolean;
/**
 * @en Sets whether display the FPS and debug informations on the bottom-left corner.
 * @zh 设置是否在左下角显示 FPS 和部分调试。
 * @deprecated @zh 从v3.6开始不再支持，请使用 profiler.showStats。@en Since v3.6, Please use profiler.showStats instead.
 */
export declare function setDisplayStats(displayStats: boolean): void;
