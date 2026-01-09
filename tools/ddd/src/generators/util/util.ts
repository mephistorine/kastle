import {formatFiles, Tree} from "@nx/devkit";
import {UtilGeneratorSchema} from "./schema";
import {strings} from "@angular-devkit/core";
import {libraryGenerator as jsLibraryGenerator} from "@nx/js";
import {getOrgFromTree, makeImportPath, makeTagsString} from "../../index";

export async function utilGenerator(tree: Tree, options: UtilGeneratorSchema) {
    const libName = `util-${options.name}`;
    const domain = strings.dasherize(options.name);

    const result = await jsLibraryGenerator(tree, {
        name: libName,
        directory: `libs/${domain}`,
        importPath: makeImportPath(getOrgFromTree(tree), domain, libName),
        tags: makeTagsString(domain, "domain-logic"),
        buildable: Boolean(options.buildable),
        publishable: Boolean(options.publishable),
    });

    await formatFiles(tree);

    return result;
}

export default utilGenerator;
