/// <reference types="./@types/globals" />
import { OwnedBy, ownerSymbol } from '../ownership';
import type { Layer, StateMachine, TransitionInternal } from '../animation-graph';
import { EditorExtendable } from '../../../core';
import { StateMachineComponent } from './state-machine-component';
export declare const outgoingsSymbol: unique symbol;
export declare const incomingsSymbol: unique symbol;
export declare class State extends EditorExtendable implements OwnedBy<Layer | StateMachine> {
    [ownerSymbol]: StateMachine | undefined;
    name: string;
    [outgoingsSymbol]: TransitionInternal[];
    [incomingsSymbol]: TransitionInternal[];
    constructor();
    copyTo(that: State): void;
}
type StateMachineComponentConstructor<T extends StateMachineComponent> = Constructor<T>;
export declare class InteractiveState extends State {
    get components(): Iterable<StateMachineComponent>;
    addComponent<T extends StateMachineComponent>(constructor: StateMachineComponentConstructor<T>): T;
    removeComponent(component: StateMachineComponent): void;
    instantiateComponents(): StateMachineComponent[];
    copyTo(that: InteractiveState): void;
    private _components;
}
export {};
