import {readJson, Tree} from "@nx/devkit";

export function getOrgFromTree(tree: Tree) {
    try {
        const pkg = readJson<any>(tree, "package.json");
        const name = String(pkg?.name ?? "");
        const m = name.match(/^@([^/]+)\//);
        if (m) return m[1];
    } catch {}

    return "kstl";
}

export function makeImportPath(orgName: string, domain: string, libName: string) {
    return `@${orgName}/${domain}/${libName}`
}

export function makeTagsString(domain: string, type: string) {
    return `domain:${domain},type:${type}`
}
