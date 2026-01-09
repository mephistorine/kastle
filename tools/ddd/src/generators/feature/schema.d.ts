export interface FeatureGeneratorSchema {
    name: string;
    domain: string;
    buildable?: boolean;
    publishable?: boolean;
    prefix?: string;
}
