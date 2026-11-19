/**
 * @en
 * Value proxies are used to set curve value to target. They are "generalized assignment".
 * Every value proxy associates with a target object.
 * @zh
 * 曲线值代理用来设置曲线值到目标，是广义的赋值。
 * 每个曲线值代理都关联着一个目标对象。
 */
export interface IValueProxy {
    /**
     * @en
     * Gets the value from the target.
     * This method is used for implementing component-wise animation in certain circumstance.
     * @zh
     * 从目标中获取值。某些情况下可能需要这个接口来实现分量动画。
     */
    get?: () => any;
    /**
     * @en
     * Sets a value.
     * @zh
     * 设置曲线值到目标对象上。
     */
    set: (value: any) => void;
}
export interface IValueProxyFactory {
    /**
     * @en
     * Returns a value proxy for specific target.
     * @zh
     * 返回指定目标的曲线值代理。
     * @param target The target acquiring the value proxy.
     * @returns The value proxy, or undefined if the proxy could not be created.
     * In later case, a warn should be given before returning.
     */
    forTarget(target: any): IValueProxy | undefined;
}
