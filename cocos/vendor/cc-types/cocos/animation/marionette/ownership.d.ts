export declare const ownerSymbol: unique symbol;
export interface OwnedBy<T> {
    [ownerSymbol]: T | undefined;
}
export declare function assertsOwnedBy<T>(mastered: OwnedBy<T>, owner: T): void;
export declare function own<T>(mastered: OwnedBy<T>, owner: T): void;
export declare function markAsDangling<T>(mastered: OwnedBy<T>): void;
