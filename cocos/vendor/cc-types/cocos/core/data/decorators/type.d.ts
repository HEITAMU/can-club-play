import { LegacyPropertyDecorator } from './utils';
import { PrimitiveType } from '../utils/attribute';
/**
 * @en Declare the property as integer
 * @zh 将该属性标记为整数。
 */
export declare const integer: LegacyPropertyDecorator;
/**
 * @en Declare the property as float
 * @zh 将该属性标记为浮点数。
 */
export declare const float: LegacyPropertyDecorator;
/**
 * @en Declare the property as boolean
 * @zh 将该属性标记为布尔值。
 */
export declare const boolean: LegacyPropertyDecorator;
/**
 * @en Declare the property as string
 * @zh 将该属性标记为字符串。
 */
export declare const string: LegacyPropertyDecorator;
/**
 * @en Declare the property as the given type
 * @zh 标记该属性的类型。
 * @param type
 */
export declare function type(type: Function | [Function] | any): LegacyPropertyDecorator;
export declare function type<T>(type: PrimitiveType<T> | [PrimitiveType<T>]): LegacyPropertyDecorator;
