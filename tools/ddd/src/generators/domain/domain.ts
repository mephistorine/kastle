import {formatFiles, Tree} from "@nx/devkit";
import {libraryGenerator as jsLibraryGenerator} from "@nx/js";
import {DomainGeneratorSchema} from "./schema";
import {strings} from "@angular-devkit/core";
import {getOrgFromTree, makeImportPath, makeTagsString} from "../../index";

export async function domainGenerator(tree: Tree, options: DomainGeneratorSchema) {
    const libName = `domain-${options.name}`;
    const domainName = strings.dasherize(options.name);
    const directory = `libs/${domainName}/domain`

    const result = await jsLibraryGenerator(tree, {
        name: libName,
        directory: directory,
        importPath: makeImportPath(getOrgFromTree(tree), domainName, "domain"),
        tags: makeTagsString(domainName, "domain-logic"),
        buildable: Boolean(options.buildable),
        publishable: Boolean(options.publishable),
        linter: "eslint",
        unitTestRunner: "jest"
    });

    tree.write(`${directory}/src/lib/application/.gitkeep`, "");
    tree.write(`${directory}/src/lib/entities/.gitkeep`, "");
    tree.write(`${directory}/src/lib/infrastructure/.gitkeep`, "");

    await formatFiles(tree);

    return result;
}

export default domainGenerator;
