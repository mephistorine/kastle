import {createTreeWithEmptyWorkspace} from "@nx/devkit/testing";
import {Tree, readProjectConfiguration} from "@nx/devkit";

import {scaffoldGenerator} from "./scaffold";
import {ScaffoldGeneratorSchema} from "./schema";

describe("scaffold generator", () => {
    let tree: Tree;
    const options: ScaffoldGeneratorSchema = {name: "test"};

    beforeEach(() => {
        tree = createTreeWithEmptyWorkspace();
    });

    it("should run successfully", async () => {
        await scaffoldGenerator(tree, options);
        const config = readProjectConfiguration(tree, "test");
        expect(config).toBeDefined();
    });
});
