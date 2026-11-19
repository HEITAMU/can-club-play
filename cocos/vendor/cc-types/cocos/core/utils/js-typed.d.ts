/// <reference types="./@types/globals" />
import { StringSubstitution } from '../platform/debug';
/**
 * @en
 * Checks if an object is `number`.
 * @zh
 * 检查对象是否是 number 类型。
 * @param object @en The object to check. @zh 要检查的对象。
 * @returns @en True if it is a number primitive or a `Number` instance, false else.
 * @zh 如果该对象是基础数字类型或者是 `Number` 实例，返回 `true`；否则返回 `false`。
 * @example
 * ```ts
 * var obj = 10;
 * isNumber(obj); // returns true
 *
 * obj = new Number(10);
 * isNumber(obj); // returns true
 * ```
 */
export declare function isNumber(object: any): object is number;
/**
 * @en
 * Checks if an object is `string`.
 * @zh
 * 检查对象是否是 string 类型。
 * @param object @en The object to check. @zh 要检查的对象。
 * @returns @en True if it is a string primitive or a `String` instance, false else.
 * @zh 如果该对象是基础字符串类型或者是 `String` 实例，返回 `true`；否则返回 `false`。
 * @example
 * ```ts
 * var obj = "it is a string";
 * isString(obj); // returns true
 *
 * obj = new String("it is a string");
 * isString(obj); // returns true
 * ```
 */
export declare function isString(object: any): object is string;
/**
 * @en
 * Checks if an object is empty object. If an object does not have any enumerable property
 * (including properties inherits from prototype chains), then it is an empty object.
 * @zh
 * 检查对象是否为空对象。空对象的定义是：没有任何可被枚举的属性（包括从原型链继承的属性）的对象。
 * @param obj @en The object to check. @zh 要检查的对象。
 * @returns @en True if it is not an empty object or not an object, false else.
 * @zh 如果不是空对象或者不是一个对象，返回 `true`；否则返回 `false`。
 */
export declare function isEmptyObject(obj: any): boolean;
/**
 * @en A helper function to add a property to an object, or modifies attributes
 * of an existing property. The property is configurable.
 * @zh 为对象添加属性或者修改已有属性的辅助函数。该属性是可配置的。
 * @param object @en The object to add or modify attributes. @zh 要添加或者修改属性的对象。
 * @param propertyName @en The property name to add or modify. @zh 要添加或修改的属性名。
 * @param value_ @en The property value to add or new value to replace a existing attribute.
 * @zh 要添加的属性值，或者取代现有属性的新值。
 * @param writable @en If the property is writable. @zh 属性是否可写。
 * @param enumerable @en If the property is enumerable. @zh 属性是否可枚举。
 */
export declare const value: (object: Record<string | number, any>, propertyName: string, value_: any, writable?: boolean, enumerable?: boolean) => void;
/**
 * @en A helper function to add or modify `get`, `set`, `enumerable` or `configurable` of a property.
 * @zh 添加或修改属性的 `get`, `set`, `enumerable` 或者 `configurable`。
 * @param object @en The object to add or modify attributes. @zh 要添加或者修改属性的对象。
 * @param propertyName @en The property name to add or modify. @zh 要添加或修改的属性名。
 * @param getter @en The getter of a property. @zh 属性的获取函数。
 * @param setter @en The setter of a property. @zh 属性的设置函数。
 * @param enumerable @en If the property is enumerable. @zh 属性是否可列举。
 * @param configurable @en If the property is configurable. @zh 属性是否可配置。
 */
export declare const getset: (object: Record<string | number, any>, propertyName: string, getter: Getter, setter?: Setter | boolean, enumerable?: boolean, configurable?: boolean) => void;
/**
 * @en A helper function to add or modify `get`, `enumerable` or `configurable` of a property.
 * @zh 添加或修改属性的 `get`, `enumerable` 或者 `configurable`。
 * @param object @en The object to add or modify attributes. @zh 要添加或者修改属性的对象。
 * @param propertyName @en The property name to add or modify. @zh 要添加或修改的属性名。
 * @param getter @en The getter of a property. @zh 属性的获取函数。
 * @param enumerable @en If the property is enumerable. @zh 属性是否可列举。
 * @param configurable @en If the property is configurable. @zh 属性是否可配置。
 */
export declare const get: (object: Record<string | number, any>, propertyName: string, getter: Getter, enumerable?: boolean, configurable?: boolean) => void;
/**
 * @en A helper function to add or modify `get`, `enumerable` or `configurable` of a property.
 * @zh 添加或修改属性的 `get`, `enumerable` 或者 `configurable`。
 * @param object @en The object to add or modify attributes. @zh 要添加或者修改属性的对象。
 * @param propertyName @en The property name to add or modify. @zh 要添加或修改的属性名。
 * @param setter @en The setter of a property. @zh 属性的设置函数。
 * @param enumerable @en If the property is enumerable. @zh 属性是否可列举。
 * @param configurable @en If the property is configurable. @zh 属性是否可配置。
 */
export declare const set: (object: Record<string | number, any>, propertyName: string, setter: Setter, enumerable?: boolean, configurable?: boolean) => void;
/**
 * @en
 * A simple wrapper of `Object.create(null)` which ensures the return object have no prototype (and thus no inherited members).
 * This eliminates the need to make `hasOwnProperty` judgments when we look for values by key on the object,
 * which is helpful for performance in this case.
 * @zh
 * 该方法是对 `Object.create(null)` 的简单封装。
 * `Object.create(null)` 用于创建无 prototype （也就无继承）的空对象。
 * 这样我们在该对象上查找属性时，就不用进行 `hasOwnProperty` 判断，此时对性能提升有帮助。
 *
 * @param forceDictMode @en Apply the delete operator to newly created map object. This will let V8 put the object in
 * "dictionary mode" and disables creation of hidden classes. This will improve the performance of objects that are
 * constantly changing shape.
 * @zh 对新创建的地图对象应用删除操作。这将让V8将对象置于 "字典模式"，并禁止创建隐藏类。这将提高那些不断变化形状对象的性能。
 * @returns @en A newly map object. @zh 一个新的 map 对象。
 */
export declare function createMap(forceDictMode?: boolean): any;
/**
 * @en
 * Gets class name of the object, if object is just a {} (and which class named 'Object'), it will return "".
 * (modified from <a href="http://stackoverflow.com/questions/1249531/how-to-get-a-javascript-objects-class">the code of stackoverflow post</a>)
 * @zh
 * 获取对象的类型名称，如果对象是 {} 字面量，将会返回 ""。参考了 stackoverflow 的代码实现：
 * <a href="http://stackoverflow.com/questions/1249531/how-to-get-a-javascript-objects-class">stackoverflow 的实现</a>
 * @param objOrCtor @en An object instance or constructor. @zh 类实例或者构造函数。
 * @returns @en The class name. @zh 类名。
 */
export declare function getClassName(objOrCtor: any): string;
/**
 * @en Deprecates a property. It will print waring message if the deprecated property is accessed.
 * The warning message includes new property name to use.
 * @zh 废弃一个属性。如果被废弃属性还在使用的话，会打印警告消息。警告消息包含新的属性名。
 * @param object @en The object or class of the property to deprecate.
 *               @zh 被废弃属性的对象或者类。
 * @param obsoleted @en The property name to deprecate. It could be a property name or `className.propertyName`.
 * @zh 要废弃的属性名。可以直接传属性名或者是 `类名.属性名` 的形式。
 * @param newExpr @en New property name to use. It could be a property name or `className.propertyName`.
 * @zh 新的属性名。可以直接传属性名或者是 `类名.属性名` 的形式。
 * @param writable @en Whether the property is writable. Default is false. @zh 该属性是否可写。默认不可写。
 */
export declare function obsolete(object: any, obsoleted: string, newExpr: string, writable?: boolean): void;
/**
 * @en Deprecates some properties. It will print waring message if any deprecated property is accessed.
 * The warning message includes new property name to use.
 * @zh 废弃一组属性。如果被废弃属性还在使用的话，会打印警告消息。警告消息包含新的属性名。
 * @param obj @en The object or class of these properties to deprecate.
 *            @zh 被废弃属性的对象或者类。
 * @param objName @en The object name or class name of these properties to deprecate.
 *                @zh 被废弃属性的对象名或者类名。
 * @param props @en The property names to deprecate. @zh 被废弃的一组属性名。
 * @param writable @en Whether these properties are writable. @zh 被废弃的属性是否可写。
 */
export declare function obsoletes(obj: any, objName: any, props: any, writable: any): void;
/**
 * @en
 * A string tool to construct a string with format string.
 * @zh
 * 根据格式字符串构造一个字符串。
 * @param msg @en A JavaScript string containing zero or more substitution strings (%s).
 * @zh 包含有 0 个或者多个格式符的字符串。
 * @param subst @en JavaScript objects with which to replace substitution strings within msg.
 * @zh 替换 `msg` 里格式符的表达式。
 * @returns @en A new formatted string. @zh 格式化后的新字符串。
 * @example
 * ```
 * import { js } from 'cc';
 * js.formatStr("a: %s, b: %s", a, b);
 * js.formatStr(a, b, c);
 * ```
 */
export declare function formatStr(msg: string, ...subst: StringSubstitution[]): string;
/**
 * @en
 * A string tool to constructs a string from an arbitrary sequence of js object arguments.
 * @zh
 * 根据任意 js 对象参数序列构造一个字符串。
 * @returns @en A new formatted string. @zh 格式化后的新字符串。
 * @example
 * ```
 * import { js } from 'cc';
 * js.formatStr({}, null, undefined);  // [object Object] null undefined
 * ```
 */
export declare function formatStr(...data: unknown[]): string;
/**
 * @en Removes the first argument. @zh 移除第一个参数。
 * @returns @en An Array that contains all arguments except the first one.
 * @zh 新的参数数组，该数组不包含第一个参数。
 */
export declare function shiftArguments(): any[];
/**
 * @en Gets a property descriptor by property name of an object or its prototypes.
 * @zh 根据属性名从一个对象或者它的原型链中获取属性描述符。
 * @param object @en The object to get property descriptor. @zh 获取描述符的对象。
 * @param propertyName @en The property name to get property descriptor.
 * @zh 获取属性描述符的属性名。
 * @returns @en A `PropertyDescriptor` instance or null if not found.
 * @zh 属性描述符对象。如果没找到的话，返回 null。
 */
export declare function getPropertyDescriptor(object: any, propertyName: string): PropertyDescriptor | null;
/**
 * @en Copies all properties except those in `excepts` from `source` to `target`.
 * @zh 把 `source` 的所有属性，除了那些定义在 `excepts`的属性，拷贝到 `target`。
 * @param source @en Source object to copy from. @zh 拷贝的源对象。
 * @param target @en Target object to copy to. @zh 拷贝到目标对象。
 * @param excepts @en Properties are not copied. @zh 不拷贝到属性。
 */
export declare function copyAllProperties(source: any, target: any, excepts: Array<string>): void;
/**
 * @en Copies all the properties in "sources" that are not defined in object from "sources" to "object".
 * @zh 将 "sources" 中的所有没在 object 定义的属性从 "sources" 复制到 "object"。
 * @param object @en Object to copy properties to. @zh 拷贝的目标对象。
 * @param sources @en Source objects to copy properties from. @zh 拷贝到源对象数组。
 * @return @en The passing `object` or a new object if passing object is not valid.
 * @zh 传入的对象。如果传入的对象无效或者没传入，将返回一个新对象。
 */
export declare function addon(object?: Record<string | number, any>, ...sources: any[]): Record<string | number, any>;
/**
 * @en Copies all the properties in "sources" from "sources" to "object".
 * @zh 将 "sources" 中的所有属性从 "sources" 复制到 "object"。
 * @param object @en Object to copy properties to. @zh 拷贝的目标对象。
 * @param sources @en Source objects to copy properties from. @zh 拷贝到源对象数组。
 * @return @en The passing `object` or a new object if passing object is not valid.
 * @zh 传入的对象。如果传入的对象无效或者没传入，将返回一个新对象。
 */
export declare function mixin(object?: Record<string | number, any>, ...sources: any[]): Record<string | number, any>;
/**
 * @en
 * Makes a class inherit from the supplied base class.
 * @zh
 * 将一个类型继承另一个类型。
 * @param cls @en The class to inherit. @zh 要继承的类。
 * @param base @en The class to inherit from. @zh 被继承的类。
 * @returns @en Passed in `cls`. @zh 传入的 `cls`。
 */
export declare function extend(cls: Function, base: Function): Function | undefined;
/**
 * @en Get super class.
 * @zh 获取父类。
 * @param constructor @en The constructor to get super class.
 * @zh 要获取父类的构造函数。
 * @returns @en Super class. @zh 父类。
 */
export declare function getSuper(constructor: Function): any;
/**
 * @en
 * Checks whether a class is child of another class, or is the same type as another class.
 * @zh 判断一类型是否是另一类型的子类或本身。
 * @param subclass @en Sub class to check. @zh 子类类型。
 * @param superclass @en Super class to check. @zh 父类类型。
 * @return @en True if sub class is child of super class, or they are the same type. False else.
 * @zh 如果子类类型是父类类型的子类，或者二者是相同类型，那么返回 true，否则返回 false。
 */
export declare function isChildClassOf<T extends Constructor>(subclass: unknown, superclass: T): subclass is T;
export declare function isChildClassOf(subclass: unknown, superclass: unknown): boolean;
/**
 * @en Removes all enumerable properties from a object.
 * @zh 移除对象中所有可枚举属性.
 * @param object @en The object to remove enumerable properties from.
 * @zh 要删除可枚举属性的对象。
 */
export declare function clear(object: Record<string | number, any>): void;
/**
 * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
 */
export declare const _idToClass: Record<string, Constructor>;
/**
 * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
 */
export declare const _nameToClass: Record<string, Constructor>;
/**
 * @en
 * Register the class by specified id, if its classname is not defined, the class name will also be set.
 * @zh
 * 通过 id 注册类型
 * @method _setClassId
 * @param classId
 * @param constructor
 * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
 */
export declare const _setClassId: (id: string, constructor: Constructor) => void;
/**
 * @en Registers a class by specified name manually.
 * @zh 通过指定的名称手动注册类型
 * @param className @en Class name to register. @zh 注册的类名。
 * @param constructor @en Constructor to register. @zh 注册的构造函数。
 */
export declare function setClassName(className: string, constructor: Constructor): void;
/**
 * @en Sets an alias for a class.
 * After executing `setClassAlias(target, alias)`, `alias` will be a single way short cut for class `target`.
 * `js.getClassByName(alias)` and `getClassById(alias)` will return `target`. But `js.getClassName(target)`
 * will return the original class name of `target`, not the alias.
 * @zh 为类设置别名。执行 `setClassAlias(target, alias)` 后，`alias` 将作为类 `target` 的 “单向 ID” 和 “单向名称”。
 * 因此，`getClassById(alias)` 和 `getClassByName(alias)` 都会得到 `target`。这种映射是单向的，这意味着 `getClassName(target)`
 * 和 `getClassId(target)` 将不会返回 `alias`。
 * @param target @en Constructor of a class to set an alias. @zh 设置别名的类的构造函数。
 * @param alias @en Alias to set. The name shall not have been set as class name or alias of another class.
 * @zh 类的别名。别名不能重复，也不能是已有类的名字。
 */
export declare function setClassAlias(target: Constructor, alias: string): void;
/**
 * @en
 * Unregister some classes from engine.
 * If you don't need a registered class anymore, you should unregister the class or engine will keep its reference.
 * Please note that it‘s your responsibility to remove other references to the class.
 * @zh
 * 取消注册类型。如果你不再需要一个注册的类，你应该取消注册这个类，否则引擎会还有对它的引用。
 * 请注意，你仍然有责任释放其他地方对该类的引用。
 *
 * @param ...constructor @en The classes to unregister. @zh 取消注册的类型列表。
 */
export declare function unregisterClass(...constructors: Function[]): void;
/**
 * @en Gets a registered class by id.
 * @zh 通过 id 获取已注册的类型。
 * @param classId @en An id to get class.
 * @return constructor
 * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
 * Please use `getClassById()` instead.
 */
export declare function _getClassById(classId: any): Constructor<unknown>;
/**
 * @en Gets the registered class by id.
 * @zh 通过 id 获取已注册的类型。
 * @param classId @en The class id used to get class. @zh 获取类的 id。
 * @returns @en The constructor of the registered class. @zh 注册的类构造函数。
 */
export declare function getClassById(classId: any): Constructor<unknown>;
/**
 * @en
 * Gets the registered class by class name.
 * @zh
 * 通过类名获取已注册的类型。
 * @param classname @en The class name used to get class. @zh 获取类的类名。
 * @returns @en The constructor of the registered class. @zh 注册的类构造函数。
 */
export declare function getClassByName(classname: any): Constructor<unknown>;
/**
 * @en
 * Get class id of the object
 * @zh
 * 获取对象的 class id
 * @param obj - instance or constructor
 * @param [allowTempId = true]   - can return temp id in editor
 * @return
 * @deprecated since v3.5.0. this is an engine private interface that will be removed in the future.
 * Please use `getClassId()` instead.
 */
export declare function _getClassId(obj: any, allowTempId?: boolean): string;
/**
 * @en
 * Gets class id of an object
 * @zh
 * 获取对象的 class id。
 * @param obj @en An object instance to get class id. @zh 获取类标识的对象。
 * @param allowTempId @en Whether allow to return a temple class id in editor.
 * @zh 在编辑器时，是否允许返回一个临时的类标识。
 * @returns @en Class id if found, empty string else.
 * @zh 找到的类标识。如果没找到的话，返回空字符串。
 */
export declare function getClassId(obj: any, allowTempId?: boolean): string;
