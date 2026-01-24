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
            "@nx/enforce-module-boundaries": [
                "error",
                {
                    allow: [],
                    depConstraints: [
                        {
                            sourceTag: "*",
                            onlyDependOnLibsWithTags: ["*"],
                        },
                        {
                            sourceTag: "type:util",
                            onlyDependOnLibsWithTags: ["domain:shared"],
                        },
                        {
                            sourceTag: "type:domain-logic",
                            onlyDependOnLibsWithTags: ["type:domain-logic", "type:util", "domain:shared"],
                        },
                        {
                            sourceTag: "type:ui",
                            onlyDependOnLibsWithTags: ["type:domain-logic", "type:ui", "type:util", "domain:shared"],
                        },
                        {
                            sourceTag: "type:feature",
                            onlyDependOnLibsWithTags: [
                                "type:domain-logic",
                                "type:ui",
                                "type:feature",
                                "type:util",
                                "domain:shared",
                            ],
                        },
                        // TODO: Add auto import new domain tag
                        {
                            sourceTag: "domain:entry",
                            onlyDependOnLibsWithTags: ["domain:entry"],
                        },
                        {
                            sourceTag: "domain:diary",
                            onlyDependOnLibsWithTags: ["domain:diary"],
                        },
                        {
                            sourceTag: "domain:auth",
                            onlyDependOnLibsWithTags: ["domain:auth"],
                        },
                    ],
                },
            ],
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
