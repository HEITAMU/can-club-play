/**
 * @zh
 * Settings 中的默认分组，通常与模块一一对应。
 *
 * @en
 * The default grouping in Settings, which usually corresponds to the module.
 */
export declare enum SettingsCategory {
    PATH = "path",
    ENGINE = "engine",
    ASSETS = "assets",
    SCRIPTING = "scripting",
    PHYSICS = "physics",
    RENDERING = "rendering",
    LAUNCH = "launch",
    SCREEN = "screen",
    SPLASH_SCREEN = "splashScreen",
    ANIMATION = "animation",
    PROFILING = "profiling",
    PLUGINS = "plugins",
    XR = "xr"
}
/**
 * @zh
 * 配置模块用于获取 settings.json 配置文件中的配置信息，同时你可以覆盖一些配置从而影响引擎的启动和运行，可参考 [game.init] 的参数选项说明。你可以通过 [settings] 访问此模块单例。
 * @en
 * The Settings module is used to get the configuration information in the settings.json configuration file,
 * and you can override some of the configuration to affect the launch and running of the engine, as described in the [game.init] parameter options.
 * You can access this single instance of the module via [settings].
 */
export declare class Settings {
    static Category: typeof SettingsCategory;
    constructor();
    /**
     * Initialization
     * @internal
     */
    init(path?: string, overrides?: Record<string, any>): Promise<void>;
    /**
     * @zh
     * 覆盖一部分配置数据。
     *
     * @en
     * Override some configuration info in Settings module.
     *
     * @param category @en The category you want to override. @zh 想要覆盖的分组。
     * @param name @en The name of the configuration in the category you want to override. @zh 分组中想要覆盖的具体配置名称。
     * @param value @en The value of the configuration you want to override. @zh 想要覆盖的具体值。
     *
     * @example
     * ```ts
     * console.log(settings.querySettings(SettingsCategory.ASSETS, 'server')); // print https://www.cocos.com
     * settings.overrideSettings(SettingsCategory.ASSETS, 'server', 'http://www.test.com');
     * console.log(settings.querySettings(SettingsCategory.ASSETS, 'server')); // print http://www.test.com
     * ```
     */
    overrideSettings<T = any>(category: SettingsCategory | string, name: string, value: T): void;
    /**
     * @zh
     * 查询配置模块中具体分组中的具体配置值。
     *
     * @en
     * Query specific configuration values in specific category in the settings module.
     *
     * @param category @en The name of category to query. @zh 想要查询的分组名称。
     * @param name @en The name of configuration in category to query. @zh 分组中想要查询的具体的配置名称。
     * @returns @en The value of configuration to query. @zh 想要查询的具体配置值。
     *
     * @example
     * ```ts
     * console.log(settings.querySettings(SettingsCategory.ENGINE, 'debug')); // print false
     * ```
     */
    querySettings<T = any>(category: SettingsCategory | string, name: string): T | null;
    private _settings;
    private _override;
}
export declare namespace Settings {
    type Category = typeof SettingsCategory;
}
/**
 * @zh
 * Settings 模块单例，你能通过此单例访问 settings.json 中的配置数据。
 * @en
 * Settings module singleton, through this you can access the configuration data in settings.json.
 */
export declare const settings: Settings;
