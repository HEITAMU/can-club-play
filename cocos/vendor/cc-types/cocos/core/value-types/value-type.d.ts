/**
 * @en The base class of all value types.
 * @zh 所有值类型的基类。
 */
export declare class ValueType {
    constructor();
    /**
     * @en
     * Clone the current object. The clone result of the object should be equal to the current object,
     * i.e. satisfy `this.equals(this, value.clone())`.
     * The base version of this method do nothing and returns `this'.
     * The derived class **must** rewrite this method and the returned object should not be `this`, i.e. satisfy `this !== this.clone()`.
     * @zh
     * 克隆当前值。克隆的结果值应与当前值相等，即满足 `this.equals(this, value.clone())`。
     * 本方法的基类版本简单地返回 `this`；
     * 派生类**必须**重写本方法，并且返回的对象不应当为 `this`，即满足 `this !== this.clone()`。
     * @returns @en The cloned object. @zh 克隆的对象。
     */
    clone(): ValueType;
    /**
     * @en
     * Check whether the current object is equal to the specified object.
     * This check should be interchangeable, i.e. satisfy `this.equals(other) === other.equals(this)`.
     * The base version of this method will returns `false'.
     * @zh
     * 判断当前值是否与指定值相等。此判断应当具有交换性，即满足 `this.equals(other) === other.equals(this)`。
     * 本方法的基类版本简单地返回 `false`。
     * @param other @en The other object @zh 指定值。
     * @returns @en `true` if equal, otherwise returns `false` @zh 如果相等，则返回 `true`，否则返回 `false`。
     */
    equals(other: this): boolean;
    /**
     * @en
     * Set the property values of the current object with the given object.
     * The base version of this method will returns `this' and the derived class **must** rewrite this method.
     * @zh
     * 赋值当前值使其与指定值相等。
     * 本方法的基类版本简单地返回 `this`，派生类**必须**重写本方法。
     * @param other @en The other object. @zh 指定值。
     */
    set(other: this): void;
    /**
     * @en
     * Convert the current object to a string.
     * The base version of this method will returns an empty string.
     * @zh
     * 返回当前值的字符串表示。
     * 本方法的基类版本返回空字符串。
     * @returns @en The string representation of the current value. @zh 当前值的字符串表示。
     */
    toString(): string;
}
