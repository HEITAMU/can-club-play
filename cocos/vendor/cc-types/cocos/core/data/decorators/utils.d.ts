/// <reference types="./@types/globals" />
export type Initializer = () => unknown;
export type BabelPropertyDecoratorDescriptor = PropertyDescriptor & {
    initializer?: Initializer;
};
/**
 * @en
 * The signature is compatible with both the TypeScript legacy decorator and the Babel legacy decorator.
 * The third argument is `descriptor` in the Babel case.
 * For some engine internally optimized decorators, the third argument is the initializer.
 * @zh
 * 该签名同时兼容 TypeScript legacy 装饰器以及 Babel legacy 装饰器。
 * 第三个参数在 Babel 情况下，会传入 descriptor。对于一些被优化的引擎内部装饰器，会传入 initializer。
 */
export type LegacyPropertyDecorator = (target: Record<string, any>, propertyKey: string | symbol, descriptorOrInitializer?: BabelPropertyDecoratorDescriptor | Initializer | null) => void;
/**
 * @en
 * A class(or property) decorator which does nothing.
 * @zh
 * 一个什么也不做的类（或属性）装饰器。
 */
export declare const emptyDecorator: ClassDecorator & LegacyPropertyDecorator;
/**
 * @en
 * A function that ignores all arguments and returns the `emptyDecorator`.
 * @zh
 * 一个忽略所有参数并且返回 `emptyDecorator` 的函数。
 */
export declare const emptyDecoratorFn: () => ClassDecorator & LegacyPropertyDecorator;
/**
 * @en
 * Acts like `emptyDecorator` if called in form of `@x`;
 * acts like `emptyDecoratorFn` if called in form of `@x(...args)`.
 * @zh
 * 当以 `@x` 形式调用时表现如同 `emptyDecorator`，当以 `@x(...args)` 形式调用时表现如同 `emptyDecoratorFn`。
 */
export declare const emptySmartClassDecorator: ClassDecorator & ((arg?: unknown) => ClassDecorator);
/**
 * @en
 * Make a smart class decorator which can properly handle the following form decorator syntax:
 * - `@x`
 * - `@x(arg0)`
 *
 * and forward both the decorated class and the `arg0` (in the first form, `arg0` is forwarded as `undefined`) to
 * `decorate`.
 * @zh
 * 创建一个智能类装饰器，它能正确地处理以下形式的装饰器语法：
 * - `@x`
 * - `@x(arg0)`
 *
 * 并且，将被装饰的类和 `arg0`（若是第一种形式，`arg0` 就是 `undefined`）一起转发给 `decorate`。
 * @param decorate
 */
export declare function makeSmartClassDecorator<TArg>(decorate: <TFunction extends AnyFunction>(constructor: TFunction, arg?: TArg) => ReturnType<ClassDecorator>): ClassDecorator & ((arg?: TArg) => ClassDecorator);
/**
 * @en
 * Make a function that accepts an argument value and returns a class decorator.
 * The decorator sets the editor property `propertyName`, on the decorated class, into that argument value.
 * @zh
 * 创建一个函数，该函数接受一个参数值并返回一个类装饰器。
 * 该装饰器将被装饰类的编辑器属性 `propertyName` 设置为该参数的值。
 * @param propertyName The editor property.
 */
export declare function makeEditorClassDecoratorFn<TValue>(propertyName: string): (value: TValue) => ClassDecorator;
/**
 * Make a smart class decorator.
 * The smart decorator sets the editor property `propertyName`, on the decorated class, into:
 * - `defaultValue` if the decorator is called with `@x` form, or
 * - the argument if the decorator is called with an argument, eg, the `@x(arg0)` form.
 * @zh
 * 创建一个智能类装饰器。
 * 该智能类装饰器将根据以下情况来设置被装饰类的编辑器属性 `propertyName`：
 * - 如果该装饰器是以 `@x` 形式调用的，该属性将被设置为 `defaultValue`。
 * - 如果该装饰器是以一个参数的形式，即 `@x(arg0)` 的形式调用的，该属性将被设置为传入的参数值。
 * @param propertyName The editor property.
 */
export declare function makeSmartEditorClassDecorator<TValue>(propertyName: string, defaultValue: TValue): ClassDecorator & ((arg?: TValue | undefined) => ClassDecorator);
export declare const CACHE_KEY = "__ccclassCache__";
export declare function getClassCache(ctor: any, decoratorName?: any): any;
export declare function getSubDict<T, TKey extends keyof T>(obj: T, key: TKey): NonNullable<T[TKey]>;
