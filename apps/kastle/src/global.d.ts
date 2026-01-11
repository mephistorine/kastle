interface ImportMeta {
    // @see apps/kastle/plugins/env-var-plugin.js
    readonly env: Readonly<{
        POCKETBASE_URL: string;
        [key: string]: string;
    }>;
}
