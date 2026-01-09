export interface UiGeneratorSchema {
    name: string;
    domain: string;
    buildable?: boolean;
    publishable?: boolean;
    prefix?: string;
}
