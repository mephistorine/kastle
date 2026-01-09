import {addProjectConfiguration, formatFiles, generateFiles, runTasksInSerial, Tree} from "@nx/devkit";
import * as path from "path";
import {ScaffoldGeneratorSchema} from "./schema";
import {strings} from "@angular-devkit/core";
import domainGenerator from "../domain/domain";
import featureGenerator from "../feature/feature";
import uiGenerator from "../ui/ui";
import utilGenerator from "../util/util";

export async function scaffoldGenerator(tree: Tree, options: ScaffoldGeneratorSchema) {
    const domain = strings.dasherize(options.domain);

    const tasks = []

    tasks.push(await domainGenerator(tree, {
        name: domain
    }))

    const featureNames = (options.features ?? "").split(",")

    for (const featureName of featureNames) {
        tasks.push(await featureGenerator(tree, {
            domain: domain,
            name: featureName
        }))
    }

    const uiLibNames = (options.uis ?? "").split(",")

    for (const uiLibName of uiLibNames) {
        tasks.push(await uiGenerator(tree, {
            domain: domain,
            name: uiLibName
        }))
    }

    const utilNames = (options.utils ?? "").split(",")

    for (const utilName of utilNames) {
        tasks.push(await utilGenerator(tree, {
            domain: domain,
            name: utilName
        }))
    }

    return runTasksInSerial(...tasks);
}

export default scaffoldGenerator;
