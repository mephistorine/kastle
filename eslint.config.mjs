// import taigaEslint from "@taiga-ui/eslint-plugin-experience-next";
import nxPlugin from "@nx/eslint-plugin";
import taiga from "@taiga-ui/eslint-plugin-experience-next";

export default [
    ...nxPlugin.configs["flat/base"],
    ...nxPlugin.configs["flat/typescript"],
    ...nxPlugin.configs["flat/javascript"],
    ...taiga.configs.recommended,
    ...taiga.configs["html-eslint"],
    {
        files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx", "**/*.mjs"],
        rules: {
            "@nx/enforce-module-boundaries": ["error", {}],
            "@stylistic/quotes": [
                "error",
                "double",
                {
                    avoidEscape: true,
                },
            ],
        },
    },
];
