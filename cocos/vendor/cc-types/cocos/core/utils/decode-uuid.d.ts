/**
 * @en
 * Decode base64-compressed uuid.
 *
 * @zh
 * 解码用 base64 压缩过的 uuid。
 *
 * @param  base64 @en Base-64 compressed uuid. @zh 用 base-64 压缩过的 uuid。
 * @returns @en Original uuid. @zh 未压缩过的 uuid。
 *
 * @example
 * ```ts
 * const uuid = 'fcmR3XADNLgJ1ByKhqcC5Z';
 * const originalUuid = decodeUuid(uuid); // fc991dd7-0033-4b80-9d41-c8a86a702e59
 * ```
 */
export default function decodeUuid(base64: string): string;
