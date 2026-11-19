import { Node } from '../../scene-graph';
/**
 * Invokes methods with specified `methodName` on each component of `node`,
 * the methods were registered binding to some animation related events(animation clip frame event or animation graph event).
 *
 * @param node The node to search components with.
 * @param methodName The method name to invoke.
 * @param args The arguments passed to the method.
 */
export declare function invokeComponentMethodsEngagedInAnimationEvent(node: Node, methodName: string, args: unknown[]): void;
