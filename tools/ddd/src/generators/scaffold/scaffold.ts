import {strings} from "@angular-devkit/core";
import {runTasksInSerial, Tree} from "@nx/devkit";
import domainGenerator from "../domain/domain";
import featureGenerator from "../feature/feature";
import uiGenerator from "../ui/ui";
import utilGenerator from "../util/util";
import {ScaffoldGeneratorSchema} from "./schema";

export async function scaffoldGenerator(tree: Tree, options: ScaffoldGeneratorSchema) {
    const domain = strings.dasherize(options.domain);
    const features = options.features ?? ""
    const uis = options.uis ?? ""
    const utils = options.utils ?? ""

    const tasks = [];

    tasks.push(
        await domainGenerator(tree, {
            name: domain,
        }),
    );

    if (features.length > 0) {
        const featureNames = features.split(",");
        for (const featureName of featureNames) {
            tasks.push(
                await featureGenerator(tree, {
                    domain: domain,
                    name: featureName,
                }),
            );
        }
    }

    if (uis.length > 0) {
        const uiLibNames = uis.split(",");
        for (const uiLibName of uiLibNames) {
            tasks.push(
                await uiGenerator(tree, {
                    domain: domain,
                    name: uiLibName,
                }),
            );
        }
    }

    if (utils.length > 0) {
        const utilNames = utils.split(",");

        for (const utilName of utilNames) {
            tasks.push(
                await utilGenerator(tree, {
                    domain: domain,
                    name: utilName,
                }),
            );
        }
    }

    return runTasksInSerial(...tasks);
}

export default scaffoldGenerator;
