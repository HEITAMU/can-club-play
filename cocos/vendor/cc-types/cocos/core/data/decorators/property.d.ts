import { CCString, CCInteger, CCBoolean } from '../utils/attribute';
import { IExposedAttributes } from '../utils/attribute-defines';
import { LegacyPropertyDecorator } from './utils';
import { PropertyStash } from '../class-stash';
export type SimplePropertyType = Function | string | typeof CCString | typeof CCInteger | typeof CCBoolean;
export type PropertyType = SimplePropertyType | SimplePropertyType[];
/**
 * @zh CCClass 属性选项。
 * @en CCClass property options
 */
export type IPropertyOptions = IExposedAttributes;
/**
 * @en Declare as a CCClass property with options
 * @zh 声明属性为 CCClass 属性。
 * @param options property options
 */
export declare function property(options?: IPropertyOptions): LegacyPropertyDecorator;
/**
 * @en Declare as a CCClass property with the property type
 * @zh 标注属性为 cc 属性。<br/>
 * 等价于`@property({type})`。
 * @param type A [[ccclass]] type or a [[ValueType]]
 */
export declare function property(type: PropertyType): LegacyPropertyDecorator;
/**
 * @en Declare as a CCClass property
 * @zh 标注属性为 cc 属性。<br/>
 * 等价于`@property()`。
 */
export declare function property(...args: Parameters<LegacyPropertyDecorator>): void;
export declare function getOrCreatePropertyStash(target: Parameters<LegacyPropertyDecorator>[0], propertyKey: Parameters<LegacyPropertyDecorator>[1], descriptorOrInitializer?: Parameters<LegacyPropertyDecorator>[2]): PropertyStash;
