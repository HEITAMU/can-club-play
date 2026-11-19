import { Node } from '../../../scene-graph';
/**
 * @zh 描述动画图中的事件绑定。
 * @en Describes the event bindings in animation graph.
 */
export declare class AnimationGraphEventBinding {
    /**
     * @zh 绑定的方法名。
     * @en The event name bound.
     */
    methodName: string;
    /**
     * @zh 获取该绑定是否绑定了任何事件。
     * @en Tells if there's any event bound to this binding.
     */
    get isBound(): boolean;
    emit(origin: Node): void;
    copyTo(that: AnimationGraphEventBinding): AnimationGraphEventBinding;
}
