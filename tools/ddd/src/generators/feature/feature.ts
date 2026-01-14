import type {UnitTestRunner} from "@nx/angular/src/utils/test-runners";
import {formatFiles, Tree} from "@nx/devkit";
import {libraryGenerator as angularLibraryGenerator} from "@nx/angular/generators";
import {FeatureGeneratorSchema} from "./schema";
import {strings} from "@angular-devkit/core";
import {getOrgFromTree, makeImportPath, makeTagsString} from "../../index";

export async function featureGenerator(tree: Tree, options: FeatureGeneratorSchema) {
    const domain = strings.dasherize(options.domain);
    const name = strings.dasherize(options.name);
    const libPath = `feature-${name}`;

    const result = await angularLibraryGenerator(tree, {
        name: libPath,
        directory: `libs/${domain}/${libPath}`,
        importPath: makeImportPath(getOrgFromTree(tree), domain, libPath),
        tags: makeTagsString(domain, "feature"),
        buildable: Boolean(options.buildable),
        publishable: Boolean(options.publishable),
        prefix: options.prefix ?? `lib-${domain}`,
        unitTestRunner: "jest" as UnitTestRunner,
        linter: "eslint",
    });

    await formatFiles(tree);
    return result;
}

export default featureGenerator;
