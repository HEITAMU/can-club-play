export declare class InvalidTransitionError extends Error {
    constructor(type: 'to-entry' | 'to-any' | 'from-exit');
}
export declare class VariableNotDefinedError extends Error {
    constructor(name: string);
}
export declare class VariableTypeMismatchedError extends Error {
    constructor(name: string, expected: string, received?: string);
}
