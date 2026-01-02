import taigaEslint from "@taiga-ui/eslint-plugin-experience-next";
import nx from "@nx/eslint-plugin";

export default [
    {
        plugins: {
            "@nx": nx,
        },
    },
    ...nx.configs["flat/typescript"],
    ...taigaEslint.configs.recommended,
    {
        ignores: ["**/dist", "**/out-tsc"],
    },
    {
        files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
        rules: {
            "@nx/enforce-module-boundaries": [
                "error",
                {
                    enforceBuildableLibDependency: true,
                    allow: [String.raw`^.*/eslint(\.base)?\.config\.[cm]?[jt]s$`],
                    depConstraints: [
                        {
                            sourceTag: "*",
                            onlyDependOnLibsWithTags: ["*"],
                        },
                    ],
                },
            ],
        },
    },
    {
        files: ["**/*.ts", "**/*.tsx", "**/*.cts", "**/*.mts"],
        // Override or add rules here
        rules: {
            "no-implicit-coercion": "error",
            "@typescript-eslint/strict-boolean-expressions": "error",
        },
    },
    {
        files: ["**/*.ts", "**/*.tsx", "**/*.cts", "**/*.mts", "**/*.js", "**/*.jsx", "**/*.cjs", "**/*.mjs"],
        rules: {
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
