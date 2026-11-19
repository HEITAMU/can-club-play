/**
 * @en JS Implementation of MurmurHash2. Original implementation is http://github.com/garycourt/murmurhash-js.
 * @zh MurmurHash2 的 JS 实现。原始实现是 http://github.com/garycourt/murmurhash-js 。
 * @param input @en ASCII string or a Uint8Array to be hashed. @zh 希望被哈希的 ASCII 字符串或者 Uint8Array.
 * @param seed @en Hash seed. Should be a positive integer. @zh 哈希种子。必须是个正整数。
 * @returns @en 32-bit positive integer hash. @zh 32位正整数哈希值。
 */
export declare function murmurhash2_32_gc(input: string | Uint8Array, seed: number): number;
