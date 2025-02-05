export interface FeatureOptions {
    [key: string]: boolean | undefined;
}

export interface FeatureConfig {
    [key: string]: FeatureOptions;
}
