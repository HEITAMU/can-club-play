/**
 * @en Use Reflection probe
 * @zh 使用反射探针。
 */
export declare enum ReflectionProbeType {
    /**
     * @en Use the default skybox.
     * @zh 使用默认天空盒。
     */
    NONE = 0,
    /**
     * @en Cubemap generate by probe.
     * @zh Probe烘焙的cubemap。
     */
    BAKED_CUBEMAP = 1,
    /**
     * @en Realtime planar reflection.
     * @zh 实时平面反射。
     */
    PLANAR_REFLECTION = 2,
    /**
     * @en Mixing between reflection probe.
     * @zh 反射探针之间进行混合。
     */
    BLEND_PROBES = 3,
    /**
     * @en Mixing between reflection probe and skybox.
     * @zh 反射探针之间混合或反射探针和天空盒之间混合。
     */
    BLEND_PROBES_AND_SKYBOX = 4
}
