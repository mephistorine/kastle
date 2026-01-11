import {formatFiles, Tree} from "@nx/devkit";
import {UtilGeneratorSchema} from "./schema";
import {strings} from "@angular-devkit/core";
import {libraryGenerator as jsLibraryGenerator} from "@nx/js";
import {getOrgFromTree, makeImportPath, makeTagsString} from "../../index";

export async function utilGenerator(tree: Tree, options: UtilGeneratorSchema) {
    const libName = `util-${strings.dasherize(options.name)}`;
    const domain = strings.dasherize(options.domain);

    const result = await jsLibraryGenerator(tree, {
        name: libName,
        directory: `libs/${domain}/${libName}`,
        importPath: makeImportPath(getOrgFromTree(tree), domain, libName),
        tags: makeTagsString(domain, "util"),
        buildable: Boolean(options.buildable),
        publishable: Boolean(options.publishable),
        unitTestRunner: "jest",
        linter: "eslint"
    });

    await formatFiles(tree);

    return result;
}

export default utilGenerator;
