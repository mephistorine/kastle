import taigaPrettierConfig from "@taiga-ui/prettier-config";

/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
    ...taigaPrettierConfig,
    singleQuote: false,
};

export default config;
