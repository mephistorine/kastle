const myOrgEnvRegex = /^KSTL_/i;

const envVarPlugin = {
    name: "env-var-plugin",
    setup(build) {
        const options = build.initialOptions;

        const envVars = {};
        for (const key in process.env) {
            if (myOrgEnvRegex.test(key)) {
                envVars[key.replace(myOrgEnvRegex, "")] = process.env[key];
            }
        }

        options.define["import.meta.env"] = JSON.stringify(envVars);
    },
};

module.exports = envVarPlugin;
