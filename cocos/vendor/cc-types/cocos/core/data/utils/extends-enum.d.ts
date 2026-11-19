/**
 * @zh
 * 组合任意多个枚举。
 * 此函数的行为等价于返回了一个新的枚举，其成员囊括了所有源枚举的成员。
 * 这些枚举的成员必须各不相同（包括成员名和值），否则行为是未定义的。
 * @en
 * Combine an arbitrary number of enumerations.
 * It behaves like an enumeration having members that are a combination of members of the source enumerations
 * is returned.
 * These enumerations shall have non-overlapped member names or member values.
 * If not, the behavior is undefined.
 * @example
 * ```ts
 * enum Apple { apple = 'apple', }
 * enum Pen { pen = 'pen' }
 * // As if `enum ApplePen { apple = 'apple'; pen = 'pen'; }`
 * const ApplePen = extendsEnum(Apple, Pen);
 * ```
 */
export declare function extendsEnum(): {};
export declare function extendsEnum<E0>(e0: E0): E0;
export declare function extendsEnum<E0, E1>(e0: E0, e1: E1): E0 & E1;
export declare function extendsEnum<E0, E1, E2>(e0: E0, e1: E1, e2: E2): E0 & E1 & E2;
export declare function extendsEnum<E0, E1, E2, E3>(e0: E0, e1: E1, e2: E2, e3: E3): E0 & E1 & E2 & E3;
