/**
 * @en
 * The main namespace of Cocos engine, all engine core classes, functions, properties and constants are defined in this namespace.
 * @zh
 * Cocos引擎的主要命名空间，引擎代码中所有的类，函数，属性和常量都在这个命名空间中定义。
 * @deprecated
 */
export declare const cclegacy: Record<string, any> & {
    _global: typeof globalThis;
};
/**
 * @en
 * The main namespace of Cocos engine, all engine core classes, functions, properties and constants are defined in this namespace.
 * @zh
 * Cocos引擎的主要命名空间，引擎代码中所有的类，函数，属性和常量都在这个命名空间中定义。
 * @deprecated
 */
export declare const legacyCC: Record<string, any> & {
    _global: typeof globalThis;
};
declare const engineVersion = "3.8.8";
export { engineVersion as VERSION };
declare const ccwindow: typeof window;
/**
 * @en
 * It is jsb.window in native mode, otherwise it is the window object in the web context.
 * @zh
 * 原生环境下为 jsb.window, 引擎为模拟部分 web 环境所提供. Web 环境这个变量是 window 对象。
 */
export { ccwindow };
