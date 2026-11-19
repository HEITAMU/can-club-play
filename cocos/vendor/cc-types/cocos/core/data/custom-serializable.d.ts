/**
 * Tag to define the custom serialization method.
 * @internal
 */
export declare const serializeTag: unique symbol;
/**
 * Tag to define the custom deserialization method.
 * @internal
 */
export declare const deserializeTag: unique symbol;
export interface SerializationInput {
    /**
     * Reads a property from the input.
     * @param name Property name.
     * @returns The property's value, after deserialized.
     */
    readProperty(name: string): unknown;
    /**
     * Deserializes this object according to the original procedure.
     */
    readThis(): void;
    /**
      * Deserializes super according to the original procedure.
      */
    readSuper(): void;
}
export interface SerializationOutput {
    /**
     * Writes a property into output.
     * @param name Property name.
     * @param value Property value.
     */
    writeProperty(name: string, value: unknown): void;
    /**
     * Serialize this object according to the original procedure.
     */
    writeThis(): void;
    /**
     * Serialize super according to the original procedure.
     */
    writeSuper(): void;
}
export type SerializationContext = {
    /**
     * The main serializing asset or root node in the scene/prefab passed to the serialization procedure.
     */
    root: unknown;
    /**
     * True if the serialization procedure is targeting CCON.
     */
    toCCON: boolean;
    /**
     * Customized arguments passed to serialization procedure.
     */
    customArguments: Record<PropertyKey, unknown>;
};
/**
 * @engineInternal
 */
export type DeserializationContext = {
    /**
     * True if the deserialization procedure is deserializing from CCON.
     */
    fromCCON: boolean;
};
export interface CustomSerializable {
    [serializeTag](output: SerializationOutput, context: SerializationContext): void;
    [deserializeTag]?(input: SerializationInput, context: DeserializationContext): void;
}
/**
 * Enables the custom to serialize/deserialize method only if the (de)serialize procedure is targeting CCON.
 * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
 */
export declare const enableIfCCON: MethodDecorator;
