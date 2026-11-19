/**
 * @internal DO NOT USE IT IN YOUR CODES.
 * @param constructor
 * @returns
 */
export declare function getSerializationMetadata(constructor: Function): SerializationMetadata | undefined;
/**
 * @internal
 */
export declare function getOrCreateSerializationMetadata(constructor: Function): SerializationMetadata;
/**
 * @internal For internal usage only. DO NOT USE IT IN YOUR CODES.
 */
export interface SerializationMetadata {
    uniquelyReferenced?: boolean;
}
