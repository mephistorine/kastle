interface ImportMeta {
    readonly env: Readonly<{
        POCKETBASE_URL: string;
        [key: string]: string;
    }>;
}
