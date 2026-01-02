import taigaPrettierConfig from "@taiga-ui/prettier-config";

/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
    ...taigaPrettierConfig,
    // plugins: [...taigaPrettierConfig.plugins, "@trivago/prettier-plugin-sort-imports"],
    singleQuote: false,
    // importOrder: ["<BUILTIN_MODULES>", "<THIRD_PARTY_MODULES>", "^@angular/(.*)$", "^[./]"],
    // importOrderSeparation: false,
};

export default config;
