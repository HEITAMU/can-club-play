export declare class EffectSettings {
    init(path?: string): Promise<void>;
    get data(): ArrayBuffer | null;
    private _data;
}
export declare const effectSettings: EffectSettings;
