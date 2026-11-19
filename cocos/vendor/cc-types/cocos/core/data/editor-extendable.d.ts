import { EditorExtendableObject } from './editor-extras-tag';
/**
 * Creates a mixin class that inherits from the specific base class and implements the `EditorExtendableObject` interface.
 * @param Base The base class.
 * @param className Assign an optional cc class name. If the base class is not cc class, this param is required.
 * @returns The mixin class.
 */
export declare function EditorExtendableMixin<T>(Base: new (...args: any[]) => T, className?: string): new (...args: any[]) => EditorExtendableObject;
/**
 * Class which implements the `EditorExtendableObject` interface.
 * @engineInternal
 */
export declare const EditorExtendable: new (...args: any[]) => EditorExtendableObject;
export type EditorExtendable = InstanceType<typeof EditorExtendable>;
