const envVarPlugin = {
    name: "env-var-plugin",
    setup(build) {
        const options = build.initialOptions;

        for (const key in process.env) {
            if (key.startsWith("KSTL_")) {
                Reflect.set(
                    options.define,
                    `import.meta.env.${key.replace("KSTL_", "")}`,
                    JSON.stringify(process.env[key]),
                );
            }
        }
    },
};

module.exports = envVarPlugin;
