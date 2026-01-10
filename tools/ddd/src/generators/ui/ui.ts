import {formatFiles, Tree} from "@nx/devkit";
import {UiGeneratorSchema} from "./schema";
import {strings} from "@angular-devkit/core";
import {libraryGenerator as angularLibraryGenerator} from "@nx/angular/generators";
import {getOrgFromTree, makeImportPath, makeTagsString} from "../../index";

export async function uiGenerator(tree: Tree, options: UiGeneratorSchema) {
    const domain = strings.dasherize(options.domain);
    const name = strings.dasherize(options.name);
    const libPath = `ui-${name}`;
    const libName = `${domain}-${libPath}`;

    const result = await angularLibraryGenerator(tree, {
        name: libName,
        directory: `libs/${domain}/${libPath}`,
        importPath: makeImportPath(getOrgFromTree(tree), domain, libName),
        tags: makeTagsString(domain, "ui"),
        buildable: Boolean(options.buildable),
        publishable: Boolean(options.publishable),
        prefix: options.prefix ?? "app",
    });

    await formatFiles(tree);
    return result;
}

export default uiGenerator;
