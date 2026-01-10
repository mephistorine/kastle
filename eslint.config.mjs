// import taigaEslint from "@taiga-ui/eslint-plugin-experience-next";
import nxPlugin from "@nx/eslint-plugin";

export default [
    ...nxPlugin.configs['flat/base'],
    ...nxPlugin.configs['flat/typescript'],
    ...nxPlugin.configs['flat/javascript'],
    {
        files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
        rules: {
            '@nx/enforce-module-boundaries': [
                'error',
                {
                    // ...rule specific configuration
                },
            ],
        },
    },
];
